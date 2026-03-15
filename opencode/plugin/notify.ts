import type { Plugin } from "@opencode-ai/plugin"

export const Notify: Plugin = async ({ $ }) => {
  return {
    async event(input) {
      if (input.event.type === "session.idle") {
        await $`say "Done"`
      }
    },
    async tool(input) {
      if (input.tool.type === "after") {
        const name = input.tool.name
        if (name === "bash" && input.tool.input?.command) {
          const cmd = input.tool.input.command as string
          if (cmd.includes("git push") || cmd.includes("gh pr create")) {
            await $`say "Pushed"`
          }
        }
      }
    },
  }
}
