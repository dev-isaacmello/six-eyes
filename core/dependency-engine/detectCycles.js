export function detectCycles(graph) {
  const visiting = new Set();
  const visited = new Set();
  const stack = [];
  const cycles = [];

  function dfs(node) {
    if (visiting.has(node)) {
      const fromIdx = stack.indexOf(node);
      cycles.push(stack.slice(fromIdx).concat(node));
      return;
    }

    if (visited.has(node)) {
      return;
    }

    visiting.add(node);
    stack.push(node);

    const edges = graph[node] ?? [];
    for (const next of edges) {
      if (graph[next]) {
        dfs(next);
      }
    }

    stack.pop();
    visiting.delete(node);
    visited.add(node);
  }

  for (const node of Object.keys(graph)) {
    dfs(node);
  }

  return cycles.slice(0, 25);
}
