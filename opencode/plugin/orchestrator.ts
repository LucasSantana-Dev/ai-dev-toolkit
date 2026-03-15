import type { Plugin, PluginInput } from "@opencode-ai/plugin"
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from "fs"
import { join } from "path"

// ── Config ──────────────────────────────────────────────────────────
const STATE_DIR = join(
  process.env.HOME || "~",
  ".local",
  "share",
  "opencode",
  "orchestrator",
)
const BACKLOG_FILE = join(STATE_DIR, "backlog.json")
const POLL_INTERVAL_MS = 60 * 1000 // check every 60s
const BOOT_DELAY_MS = 12000
const MAX_CONCURRENT = 2 // max sessions working simultaneously

// ── Types ───────────────────────────────────────────────────────────
interface Task {
  id: string
  title: string
  description: string
  directory: string // project path
  priority: "critical" | "high" | "medium" | "low"
  status: "backlog" | "ready" | "in_progress" | "done" | "blocked"
  sessionID?: string
  agent?: string
  createdAt: number
  updatedAt: number
  completedAt?: number
  parentID?: string
  subtasks?: string[]
  tags?: string[]
}

interface Backlog {
  tasks: Task[]
  lastPlanAt?: number
  version: number
}

// ── Helpers ─────────────────────────────────────────────────────────
function loadBacklog(): Backlog {
  if (!existsSync(BACKLOG_FILE)) {
    return { tasks: [], version: 1 }
  }
  try {
    return JSON.parse(readFileSync(BACKLOG_FILE, "utf-8"))
  } catch {
    return { tasks: [], version: 1 }
  }
}

function saveBacklog(backlog: Backlog): void {
  mkdirSync(STATE_DIR, { recursive: true })
  writeFileSync(BACKLOG_FILE, JSON.stringify(backlog, null, 2))
}

function genID(): string {
  return `task_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`
}

function getNextTask(backlog: Backlog): Task | undefined {
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
  return backlog.tasks
    .filter((t) => t.status === "ready")
    .sort(
      (a, b) =>
        priorityOrder[a.priority] - priorityOrder[b.priority] ||
        a.createdAt - b.createdAt,
    )[0]
}

function getActiveTasks(backlog: Backlog): Task[] {
  return backlog.tasks.filter((t) => t.status === "in_progress")
}

// ── Core Logic ──────────────────────────────────────────────────────
async function dispatchTask(client: any, task: Task): Promise<void> {
  const backlog = loadBacklog()
  const t = backlog.tasks.find((x) => x.id === task.id)
  if (!t || t.status !== "ready") return

  // Create a new session for this task
  const session = await client.session.create({
    body: { title: task.title },
    query: { directory: task.directory },
  })

  if (!session.data) return
  const sessionID = (session.data as any).id

  // Mark task as in_progress
  t.status = "in_progress"
  t.sessionID = sessionID
  t.updatedAt = Date.now()
  saveBacklog(backlog)

  // Build the prompt
  const subtaskContext =
    t.subtasks && t.subtasks.length > 0
      ? `\n\nThis is part of a larger effort. Related subtask IDs: ${t.subtasks.join(", ")}`
      : ""

  const prompt = [
    `## Task: ${t.title}`,
    "",
    t.description,
    subtaskContext,
    "",
    "### Instructions",
    "- Use Skills and MCP tools as needed",
    "- Create skills for reusable workflows you discover",
    "- Commit constantly with conventional commits after each functional step",
    "- Run lint + tests before considering the task done",
    "- When complete, summarize what you did",
    "",
    `Priority: ${t.priority} | Task ID: ${t.id}`,
  ].join("\n")

  // Send prompt
  await client.session.promptAsync({
    path: { id: sessionID },
    body: {
      agent: t.agent,
      parts: [{ type: "text" as const, text: prompt }],
    },
  })
}

async function checkCompletions(client: any): Promise<void> {
  const backlog = loadBacklog()
  const active = getActiveTasks(backlog)

  for (const task of active) {
    if (!task.sessionID) continue

    try {
      // Check session status
      const status = await client.session.status({
        path: { id: task.sessionID },
      })

      if ((status.data as any)?.type === "idle") {
        // Session finished — check if it has uncommitted changes
        const session = await client.session.get({
          path: { id: task.sessionID },
        })
        const hasChanges =
          (session.data as any)?.summary?.files > 0

        // Check todos to see if all are completed
        let allDone = true
        try {
          const todos = await client.session.todo({
            path: { id: task.sessionID },
          })
          const items = (todos.data as any[]) || []
          allDone = items.every(
            (t: any) =>
              t.status === "completed" || t.status === "cancelled",
          )
        } catch {
          // No todos means the agent didn't use todowrite, assume done
        }

        if (allDone) {
          task.status = "done"
          task.completedAt = Date.now()
          task.updatedAt = Date.now()
          saveBacklog(backlog)
        }
      }
    } catch {
      // Session might have been deleted
      task.status = "blocked"
      task.updatedAt = Date.now()
      saveBacklog(backlog)
    }
  }
}

async function orchestrate(client: any): Promise<void> {
  // 1. Check completions
  await checkCompletions(client)

  // 2. Dispatch next task if under concurrency limit
  const backlog = loadBacklog()
  const active = getActiveTasks(backlog)

  if (active.length < MAX_CONCURRENT) {
    const next = getNextTask(backlog)
    if (next) {
      await dispatchTask(client, next)
    }
  }
}

// ── Plugin Export ────────────────────────────────────────────────────
export const Orchestrator: Plugin = async ({
  client,
}: PluginInput) => {
  mkdirSync(STATE_DIR, { recursive: true })

  // Initialize backlog if it doesn't exist
  if (!existsSync(BACKLOG_FILE)) {
    saveBacklog({ tasks: [], version: 1 })
  }

  // Start orchestration loop
  setTimeout(async () => {
    try {
      await orchestrate(client)
    } catch {}
  }, BOOT_DELAY_MS)

  const interval = setInterval(async () => {
    try {
      await orchestrate(client)
    } catch {}
  }, POLL_INTERVAL_MS)

  return {
    async event(input) {
      const event = input.event

      // When a session goes idle, check if its task is done
      if (event.type === "session.idle") {
        setTimeout(async () => {
          try {
            await orchestrate(client)
          } catch {}
        }, 3000)
      }
    },
  }
}

// ── CLI Commands (exported for use in /plan command) ─────────────
export function addTask(
  title: string,
  description: string,
  directory: string,
  priority: Task["priority"] = "medium",
  agent?: string,
  tags?: string[],
): Task {
  const backlog = loadBacklog()
  const task: Task = {
    id: genID(),
    title,
    description,
    directory,
    priority,
    status: "ready",
    agent,
    tags,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  backlog.tasks.push(task)
  saveBacklog(backlog)
  return task
}

export function addPlan(
  planTitle: string,
  steps: Array<{
    title: string
    description: string
    directory: string
    priority?: Task["priority"]
    agent?: string
  }>,
): Task[] {
  const backlog = loadBacklog()
  const parentID = genID()
  const parent: Task = {
    id: parentID,
    title: planTitle,
    description: `Plan: ${steps.length} steps`,
    directory: steps[0]?.directory || ".",
    priority: "high",
    status: "backlog",
    subtasks: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  const tasks: Task[] = [parent]
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    const task: Task = {
      id: genID(),
      title: `[${i + 1}/${steps.length}] ${step.title}`,
      description: step.description,
      directory: step.directory,
      priority: step.priority || "medium",
      status: i === 0 ? "ready" : "backlog",
      agent: step.agent,
      parentID,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    parent.subtasks!.push(task.id)
    tasks.push(task)
  }

  backlog.tasks.push(...tasks)
  saveBacklog(backlog)
  return tasks
}

export function promoteNext(parentID: string): boolean {
  const backlog = loadBacklog()
  const parent = backlog.tasks.find((t) => t.id === parentID)
  if (!parent?.subtasks) return false

  for (const subID of parent.subtasks) {
    const sub = backlog.tasks.find((t) => t.id === subID)
    if (sub && sub.status === "backlog") {
      sub.status = "ready"
      sub.updatedAt = Date.now()
      saveBacklog(backlog)
      return true
    }
  }

  // All subtasks done — mark parent done
  parent.status = "done"
  parent.completedAt = Date.now()
  parent.updatedAt = Date.now()
  saveBacklog(backlog)
  return false
}

export function listTasks(
  filter?: Task["status"],
): Task[] {
  const backlog = loadBacklog()
  if (filter) return backlog.tasks.filter((t) => t.status === filter)
  return backlog.tasks
}

export function getBacklogSummary(): string {
  const backlog = loadBacklog()
  const counts = { backlog: 0, ready: 0, in_progress: 0, done: 0, blocked: 0 }
  for (const t of backlog.tasks) {
    counts[t.status] = (counts[t.status] || 0) + 1
  }
  return [
    `Backlog: ${counts.backlog} | Ready: ${counts.ready} | In Progress: ${counts.in_progress} | Done: ${counts.done} | Blocked: ${counts.blocked}`,
    `Total: ${backlog.tasks.length}`,
  ].join("\n")
}
