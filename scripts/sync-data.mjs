// Copies ../pipeline/apps.json -> data/apps.json when the pipeline file exists.
// When a build only sees hub/ (e.g. a CI job that checks out this folder alone)
// the pipeline folder is absent, so the committed data/apps.json is used as-is.
// Runs automatically via "prebuild".
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const hubRoot = join(here, "..");
const source = join(hubRoot, "..", "pipeline", "apps.json");
const target = join(hubRoot, "data", "apps.json");

if (!existsSync(source)) {
  console.log(`[sync-data] ${source} not found; keeping committed data/apps.json`);
  process.exit(0);
}

// Validate that the source parses before overwriting the committed copy.
const parsed = JSON.parse(readFileSync(source, "utf8"));
if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.apps) || !parsed.hub) {
  console.error("[sync-data] pipeline/apps.json is missing `hub` or `apps`; aborting");
  process.exit(1);
}

mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);
console.log(`[sync-data] copied pipeline/apps.json -> data/apps.json (${parsed.apps.length} apps)`);
