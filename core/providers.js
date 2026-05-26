import os from "os";
import path from "path";

const HOME = os.homedir();

export const PROVIDERS = {
  claude: {
    name: "claude",
    targetDir: path.join(HOME, ".claude", "skills", "six-eyes"),
    message: "Use /six-eyes inside Claude Code",
  },
  cursor: {
    name: "cursor",
    targetDir: path.join(HOME, ".cursor", "rules", "six-eyes"),
    message: "Reference the generated rules from Cursor",
  },
  openai: {
    name: "openai",
    targetDir: path.join(HOME, ".config", "openai", "skills", "six-eyes"),
    message: "Attach six-eyes prompts in your Codex workflow",
  },
  aider: {
    name: "aider",
    targetDir: path.join(HOME, ".aider", "skills", "six-eyes"),
    message: "Load skill docs in your aider system prompt",
  },
  codex: {
    name: "codex",
    targetDir: path.join(HOME, ".codex", "skills", "six-eyes"),
    message: "Use maps from .sixeyes to shape codex context",
  },
  generic: {
    name: "generic",
    targetDir: path.join(HOME, ".six-eyes", "skills", "six-eyes"),
    message: "Wire the skill docs into your preferred agent runtime",
  },
};

export function getProvider(providerName) {
  const key = String(providerName || "").toLowerCase();
  return PROVIDERS[key] ?? PROVIDERS.generic;
}
