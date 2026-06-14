#!/usr/bin/env node
// Bootstrap script run after `npm install`:
// 1. Copy .env.example -> .env if missing (SQLite-only dev secrets, safe).
// 2. Run prisma migrate deploy + db seed so the app is queryable on first dev.
// Skips gracefully when invoked in CI / outside the project root.

import { existsSync, copyFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..");

if (!existsSync(path.join(root, "package.json"))) {
  process.exit(0); // not the project root, nothing to do
}

const envPath = path.join(root, ".env");
const examplePath = path.join(root, ".env.example");
if (!existsSync(envPath) && existsSync(examplePath)) {
  copyFileSync(examplePath, envPath);
  console.log("[setup-db] created .env from .env.example");
}

function run(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: root, stdio: "inherit", shell: true });
  return r.status === 0;
}

// Generate the Prisma client (always safe)
run("npx", ["prisma", "generate"]);

// Apply migrations + seed only when running locally (not in CI).
if (!process.env.CI) {
  run("npx", ["prisma", "migrate", "deploy"]);
  run("npx", ["prisma", "db", "seed"]);
}
