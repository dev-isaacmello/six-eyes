export function detectHotspots(graph) {
  const fanIn = {};
  const fanOut = {};

  for (const [file, deps] of Object.entries(graph)) {
    fanOut[file] = deps.length;
    for (const dep of deps) {
      fanIn[dep] = (fanIn[dep] ?? 0) + 1;
    }
  }

  const candidates = Object.keys(graph).map((file) => ({
    file,
    fanIn: fanIn[file] ?? 0,
    fanOut: fanOut[file] ?? 0,
    score: (fanIn[file] ?? 0) * 2 + (fanOut[file] ?? 0),
  }));

  return candidates.sort((a, b) => b.score - a.score).slice(0, 15);
}
