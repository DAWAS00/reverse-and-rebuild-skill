#!/usr/bin/env node
// Copies the skill folder into an agent's skills directory.
//   (no flag)      ~/.claude/skills        (Claude Code, user level)
//   --project      ./.claude/skills        (Claude Code, this project)
//   --dir <path>   any other agent's skills directory
const fs = require("fs"), path = require("path"), os = require("os");
const args = process.argv.slice(2);
const i = args.indexOf("--dir");
const root = i >= 0 && args[i + 1] ? path.resolve(args[i + 1])
  : args.includes("--project") ? path.join(process.cwd(), ".claude", "skills")
  : path.join(os.homedir(), ".claude", "skills");
const src = path.join(__dirname, "..", "skills");
for (const name of fs.readdirSync(src)) {
  const dest = path.join(root, name);
  fs.mkdirSync(root, { recursive: true });
  fs.cpSync(path.join(src, name), dest, { recursive: true });
  console.log(`installed ${name} -> ${dest}`);
}
