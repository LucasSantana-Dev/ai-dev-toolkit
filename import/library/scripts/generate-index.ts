import { writeFile } from "node:fs/promises";
import path from "node:path";
import { CATALOG_ROOT, loadSkills, loadServers, loadCollections, loadDocs } from "./lib/catalog.ts";

interface IndexEntry {
  kind: "skill" | "server" | "collection" | "doc";
  id: string;
  name: string;
  description: string;
  tags: string[];
  version?: string;
  deprecated?: boolean;
}

function toIndex(kind: IndexEntry["kind"], data: Record<string, unknown>): IndexEntry {
  return {
    kind,
    id: data.id as string,
    name: (data.name as string) ?? (data.title as string) ?? (data.id as string),
    description: (data.description as string) ?? "",
    tags: (data.tags as string[]) ?? [],
    version: data.version as string | undefined,
    deprecated: (data.deprecated as boolean) ?? false,
  };
}

async function main() {
  const [skills, servers, collections, docs] = await Promise.all([
    loadSkills(),
    loadServers(),
    loadCollections(),
    loadDocs(),
  ]);
  const index: IndexEntry[] = [
    ...skills.map((e) => toIndex("skill", e.data)),
    ...servers.map((e) => toIndex("server", e.data)),
    ...collections.map((e) => toIndex("collection", e.data)),
    ...docs.map((e) => toIndex("doc", e.data)),
  ].sort((a, b) => a.kind.localeCompare(b.kind) || a.id.localeCompare(b.id));

  const outPath = path.join(CATALOG_ROOT, "index.json");
  await writeFile(outPath, JSON.stringify({ version: 1, generatedAt: new Date().toISOString(), entries: index }, null, 2) + "\n");
  console.log(`✅ wrote ${outPath} (${index.length} entries)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
