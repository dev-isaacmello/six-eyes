export function semanticSearch(analysis, query, { limit = 10 } = {}) {
  const terms = String(query)
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (!terms.length) {
    return [];
  }

  return analysis.scan.files
    .map((file) => {
      const haystack = file.relPath.toLowerCase();
      const score = terms.reduce(
        (total, term) => total + (haystack.includes(term) ? 1 : 0),
        0,
      );

      return {
        file: file.relPath,
        score,
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
