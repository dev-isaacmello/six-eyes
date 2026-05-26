import path from "path";
import chalk from "chalk";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { ensureStateDirectory } from "./memory-engine.js";
import { getProvider } from "./providers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, "..");

const SKILL_SOURCE = path.join(PACKAGE_ROOT, "skills", "six-eyes");
const TEMPLATE_SOURCE = path.join(PACKAGE_ROOT, "templates");
const PROVIDER_SOURCE = path.join(PACKAGE_ROOT, "providers");

export async function runInstall({
  provider,
  workspacePath,
  withInitMessage = true,
}) {
  const targetProvider = getProvider(provider);

  console.log(
    chalk.cyan(`\nInstalling Six Eyes for provider: ${targetProvider.name}\n`),
  );

  await ensureStateDirectory(workspacePath);
  await fs.ensureDir(targetProvider.targetDir);

  await fs.copy(SKILL_SOURCE, targetProvider.targetDir, {
    overwrite: true,
    recursive: true,
  });

  await fs.copy(
    TEMPLATE_SOURCE,
    path.join(targetProvider.targetDir, "templates"),
    {
      overwrite: true,
      recursive: true,
    },
  );

  await fs.copy(
    PROVIDER_SOURCE,
    path.join(targetProvider.targetDir, "providers"),
    {
      overwrite: true,
      recursive: true,
    },
  );

  if (withInitMessage) {
    console.log(chalk.green("Six Eyes installed successfully."));
  }

  console.log(chalk.green(`Provider target: ${targetProvider.targetDir}`));
  console.log(chalk.green(`Hint: ${targetProvider.message}`));
  console.log(
    chalk.green(`Workspace state: ${path.join(workspacePath, ".sixeyes")}`),
  );
}
