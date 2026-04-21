import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import matter from "gray-matter";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "../../..");
const CATALOG = path.join(REPO_ROOT, "catalog");

export type Kind = "skill" | "server" | "collection" | "doc";

export interface Skill {
  id: string;
  name: string;
  description: string;
  version?: string;
  tags: string[];
  editors?: string[];
  source?: { path?: string; repo?: string };
  homepage?: string;
  license?: string;
  body: string;
}

export interface Server {
  id: string;
  name: string;
  description: string;
  transport: string;
  command?: string;
  args?: string[];
  url?: string;
  env?: Array<{ name: string; description?: string; required?: boolean; default?: string }>;
  tags: string[];
  homepage?: string;
  license?: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  items: Array<{ kind: "skill" | "server" | "doc"; id: string }>;
  tags?: string[];
}

export interface Doc {
  id: string;
  title: string;
  description: string;
  tags: string[];
  body: string;
  source?: { path?: string; upstream?: string; license?: string };
}

async function listFiles(dir: string, ext: string): Promise<string[]> {
  if (!existsSync(dir)) return [];
  const { readdir } = await import("node:fs/promises");
  return (await readdir(dir)).filter((f) => f.endsWith(ext)).sort();
}

async function listDirs(dir: string): Promise<string[]> {
  if (!existsSync(dir)) return [];
  const { readdir, stat } = await import("node:fs/promises");
  const entries = await readdir(dir);
  const out: string[] = [];
  for (const e of entries) {
    if ((await stat(path.join(dir, e))).isDirectory()) out.push(e);
  }
  return out.sort();
}

export async function getSkills(): Promise<Skill[]> {
  const dir = path.join(CATALOG, "skills");
  const out: Skill[] = [];
  for (const slug of await listDirs(dir)) {
    const mPath = path.join(dir, slug, "manifest.json");
    const sPath = path.join(dir, slug, "SKILL.md");
    if (!existsSync(mPath)) continue;
    const manifest = JSON.parse(await readFile(mPath, "utf8")) as Omit<Skill, "body">;
    const body = existsSync(sPath) ? matter(await readFile(sPath, "utf8")).content : "";
    out.push({ ...manifest, body });
  }
  return out;
}

export async function getServers(): Promise<Server[]> {
  const dir = path.join(CATALOG, "servers");
  const out: Server[] = [];
  for (const file of await listFiles(dir, ".yaml")) {
    const data = yaml.load(await readFile(path.join(dir, file), "utf8")) as Server;
    out.push(data);
  }
  return out;
}

export async function getCollections(): Promise<Collection[]> {
  const dir = path.join(CATALOG, "collections");
  const out: Collection[] = [];
  for (const file of await listFiles(dir, ".yaml")) {
    out.push(yaml.load(await readFile(path.join(dir, file), "utf8")) as Collection);
  }
  return out;
}

export async function getDocs(): Promise<Doc[]> {
  const dir = path.join(CATALOG, "docs");
  const out: Doc[] = [];
  for (const file of await listFiles(dir, ".md")) {
    const raw = await readFile(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    out.push({ ...(data as Omit<Doc, "body">), body: content });
  }
  return out;
}
