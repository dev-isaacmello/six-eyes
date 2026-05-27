export const STATE_DIRNAME = ".sixeyes";

export const MAP_FILES = {
  architecture: "memory/architecture-memory.json",
  architectureMemory: "memory/architecture-memory.json",
  dependencyGraph: "graph/dependency-graph.json",
  semantic: "maps/semantic-map.json",
  domain: "maps/domain-map.json",
  symbol: "maps/symbol-map.json",
  hotspots: "graph/hotspots.json",
  violations: "graph/violations.json",
  contextRankings: "runtime/context-window.json",
  contextWindow: "runtime/context-window.json",
  agentMemory: "memory/project-memory.json",
  projectMemory: "memory/project-memory.json",
  decisions: "memory/decisions.json",
  activeProvider: "runtime/active-provider.json",
  session: "runtime/session.json",
  indexState: "runtime/index-state.json",
};

export const LEGACY_MAP_FILES = {
  architecture: "architecture.json",
  dependencyGraph: "dependency-graph.json",
  semantic: "semantic-map.json",
  domain: "domain-map.json",
  contextRankings: "context-rankings.json",
  agentMemory: "agent-memory.json",
  indexState: "index-state.json",
};

export const SOURCE_GLOBS = [
  "**/*.{js,jsx,ts,tsx,mjs,cjs,py,cs,java,go,rs,rb,php}",
  "**/*.dart",
  "**/package.json",
  "**/pubspec.yaml",
  "**/pyproject.toml",
  "**/requirements.txt",
  "**/*.csproj",
  "**/pom.xml",
  "**/go.mod",
  "**/Cargo.toml",
];

export const DEFAULT_IGNORES = [
  "**/node_modules/**",
  "**/.git/**",
  "**/.dart_tool/**",
  "**/.fvm/**",
  "**/dist/**",
  "**/build/**",
  "**/.next/**",
  "**/coverage/**",
  "**/.turbo/**",
  "**/.venv/**",
  "**/venv/**",
  "**/target/**",
  "**/examples/**",
  "**/bin/**",
  "**/obj/**",
];

export const LAYER_HINTS = {
  domain: ["domain", "entities", "valueobjects", "aggregate", "model"],
  application: ["application", "usecase", "service", "command", "query"],
  infrastructure: [
    "infrastructure",
    "adapter",
    "repository",
    "gateway",
    "persistence",
    "data",
  ],
  presentation: [
    "presentation",
    "controller",
    "route",
    "api",
    "ui",
    "view",
    "page",
    "screen",
    "screens",
    "widget",
    "widgets",
    "bloc",
    "cubit",
    "provider",
  ],
};

export const ARCHITECTURE_PATTERNS = {
  "Clean Architecture": {
    requiredLayers: ["domain", "application", "infrastructure", "presentation"],
    threshold: 3,
  },
  "Hexagonal Architecture": {
    markers: ["ports", "adapters"],
    threshold: 2,
  },
  "Vertical Slice": {
    markers: ["features", "commands", "queries"],
    threshold: 2,
  },
  "Feature-first Flutter": {
    markers: ["features", "screens", "widgets", "bloc", "cubit", "provider"],
    threshold: 2,
  },
  "Flutter App": {
    markers: ["flutter", "main"],
    threshold: 2,
  },
  DDD: {
    markers: [
      "aggregate",
      "entity",
      "valueobject",
      "repository",
      "domain event",
    ],
    threshold: 2,
  },
};

export const FRAMEWORK_SIGNALS = {
  Flutter: {
    anchors: ["pubspec.yaml", "lib/main.dart", "main.dart"],
    code: ["package:flutter/", "flutter/material.dart", "flutter/widgets.dart"],
    packages: ["flutter"],
  },
  Dart: {
    anchors: ["pubspec.yaml", "main.dart"],
    code: ["import 'dart:", 'import \"dart:'],
    packages: ["dart"],
  },
  "Next.js": {
    anchors: [
      "next.config.js",
      "next.config.mjs",
      "app/layout.tsx",
      "app/page.tsx",
      "pages/_app.tsx",
    ],
    code: ["from 'next/", 'from "next/', "next/navigation"],
    packages: ["next"],
  },
  React: {
    anchors: ["src/main.tsx", "src/main.jsx"],
    code: ["from 'react'", 'from "react"', "useState(", "useEffect("],
    packages: ["react"],
  },
  "ASP.NET Core": {
    anchors: ["Program.cs", "Startup.cs"],
    code: ["builder.Services", "MapControllers", "AddControllers("],
    packages: ["microsoft.aspnetcore"],
  },
  FastAPI: {
    anchors: ["main.py", "app/main.py"],
    code: ["from fastapi import", "FastAPI(", "uvicorn.run("],
    packages: ["fastapi", "uvicorn"],
  },
  Django: {
    anchors: ["manage.py", "settings.py", "wsgi.py", "asgi.py"],
    code: ["DJANGO_SETTINGS_MODULE", "INSTALLED_APPS", "django."],
    packages: ["django"],
  },
  LangChain: {
    anchors: [],
    code: [
      "from langchain",
      "import langchain",
      "RunnableSequence",
      "ChatOpenAI",
    ],
    packages: ["langchain", "@langchain/core"],
  },
  LangGraph: {
    anchors: [],
    code: [
      "from langgraph",
      "import langgraph",
      "StateGraph",
      "add_node(",
      "add_edge(",
    ],
    packages: ["langgraph"],
  },
};

export const MAX_FILE_SIZE_BYTES = 1024 * 1024;
