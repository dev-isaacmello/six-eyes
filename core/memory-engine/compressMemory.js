export function compressMemory(memory, { maxItems = 20 } = {}) {
  return {
    generatedAt: new Date().toISOString(),
    architecture: memory.architecture?.detected ?? memory.architectureMemory?.detected ?? [],
    frameworks: memory.semantic?.frameworks ?? [],
    risks: {
      cycles: memory.dependencyGraph?.cycles?.length ?? 0,
      violations: memory.violations?.violations?.length ?? 0,
    },
    context: (memory.contextWindow?.files ?? []).slice(0, maxItems),
    decisions: (memory.decisions?.decisions ?? []).slice(-maxItems),
  };
}
