#!/usr/bin/env node

import chalk from "chalk";
import { runInstall } from "../core/install-engine.js";
import { analyzeProject } from "../core/analyze-engine.js";
import { generateDependencyGraph } from "../core/graph-engine.js";
import { generateContextSummary } from "../core/context-engine.js";
import {
  persistAnalysisMaps,
  readStoredMaps,
  ensureStateDirectory,
} from "../core/memory-engine.js";

const args = process.argv.slice(2);
const command = args[0] ?? "install";

function parseArg(name, fallback = null) {
  const index = args.findIndex((a) => a === `--${name}`);
  if (index === -1) {
    return fallback;
  }

  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    return true;
  }

  return value;
}

function parseNumberArg(name, fallback) {
  const value = parseArg(name, fallback);
  const num = Number(value);
  if (Number.isNaN(num)) {
    return fallback;
  }

  return num;
}

function printHelp() {
  console.log(`
Six Eyes - Cognitive Constraint Shaping Runtime

Usage:
  six-eyes [command] [--provider <name>] [--cwd <path>]

Commands:
  install      Install provider assets (default)
  init         Create .sixeyes memory maps and run first scan
  scan         Run semantic analysis and persist architecture maps
  graph        Generate dependency graph and report hotspots
  context      Print ranked context for agent execution
  review       Run scan + graph + context in one deterministic pass
  maps         Print known persisted cognitive maps
  help         Show this message

Providers:
  claude | cursor | openai | aider | codex | generic

Examples:
  six-eyes install --provider claude
  six-eyes scan --cwd .
  six-eyes context --top 12
`);
}

function logHeadline(text) {
  console.log(chalk.cyan(`\n${text}\n`));
}

async function runScan(workspacePath) {
  logHeadline("Running semantic architecture scan...");
  const analysis = await analyzeProject(workspacePath);
  await persistAnalysisMaps(workspacePath, analysis);

  const architectureNames = analysis.architecture.detected.map((a) => a.name);
  const frameworkNames = analysis.frameworks.detected.map((f) => f.name);

  console.log(chalk.green("Scan complete."));
  console.log(`Architectures: ${architectureNames.join(", ") || "none"}`);
  console.log(`Frameworks: ${frameworkNames.join(", ") || "none"}`);
  console.log(`Cycles: ${analysis.dependency.cycles.length}`);
  console.log(`Hot modules: ${analysis.dependency.hotspots.length}`);
  console.log(`Cognitive score: ${analysis.summary.cognitionScore}/100`);

  return analysis;
}

async function runGraph(workspacePath) {
  logHeadline("Generating dependency intelligence graph...");
  const graph = await generateDependencyGraph(workspacePath);
  console.log(chalk.green("Dependency graph generated."));
  console.log(`Files indexed: ${graph.metrics.files}`);
  console.log(`Edges: ${graph.metrics.edges}`);
  console.log(`Cycles: ${graph.cycles.length}`);
  console.log(`Layer violations: ${graph.layerViolations.length}`);

  return graph;
}

async function runContext(workspacePath, top = 10) {
  logHeadline("Building adaptive context ranking...");
  const analysis = await analyzeProject(workspacePath);
  await persistAnalysisMaps(workspacePath, analysis);

  const summary = generateContextSummary(analysis, {
    top,
  });

  console.log(summary);
  return summary;
}

async function runReview(workspacePath, top = 10) {
  logHeadline("Running deterministic cognitive review...");
  const analysis = await runScan(workspacePath);
  await runGraph(workspacePath);
  const summary = generateContextSummary(analysis, { top });
  console.log(summary);

  console.log(chalk.green("Review completed."));
}

async function main() {
  const workspacePath = parseArg("cwd", process.cwd());
  const provider = parseArg("provider", "claude");
  const top = parseNumberArg("top", 10);

  try {
    switch (command) {
      case "install":
        await runInstall({ provider, workspacePath });
        break;

      case "init": {
        await ensureStateDirectory(workspacePath);
        await runInstall({ provider, workspacePath, withInitMessage: false });
        await runScan(workspacePath);
        console.log(chalk.green("Initialization complete."));
        break;
      }

      case "scan":
        await runScan(workspacePath);
        break;

      case "graph":
        await runGraph(workspacePath);
        break;

      case "context":
        await runContext(workspacePath, top);
        break;

      case "review":
        await runReview(workspacePath, top);
        break;

      case "maps": {
        const maps = await readStoredMaps(workspacePath);
        console.log(chalk.cyan("Known maps:"));
        for (const map of maps) {
          console.log(`- ${map}`);
        }
        break;
      }

      case "help":
      case "--help":
      case "-h":
        printHelp();
        break;

      default:
        console.error(chalk.red(`Unknown command: ${command}`));
        printHelp();
        process.exitCode = 1;
    }
  } catch (error) {
    console.error(chalk.red("Six Eyes failed."));
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

main();
