#!/usr/bin/env node
// Copies the skill into ~/.claude/skills (or ./.claude/skills with --project).
const fs = require("fs"), path = require("path"), os = require("os");
const project = process.argv.includes("--project");
const root = project ? path.join(process.cwd(), ".claude", "skills") : path.join(os.homedir(), ".claude", "skills");
const src = path.join(__dirname, "..", "skills");
for (const name of fs.readdirSync(src)) {
  const dest = path.join(root, name);
  fs.mkdirSync(root, { recursive: true });
  fs.cpSync(path.join(src, name), dest, { recursive: true });
  console.log(`installed ${name} -> ${dest}`);
}
