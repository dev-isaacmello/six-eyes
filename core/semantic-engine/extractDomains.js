const DEFAULT_DOMAIN_CANDIDATES = [
  "domain",
  "billing",
  "user",
  "users",
  "account",
  "accounts",
  "order",
  "orders",
  "payment",
  "payments",
  "auth",
  "identity",
  "catalog",
  "inventory",
];

export function extractDomains(scan, candidates = DEFAULT_DOMAIN_CANDIDATES) {
  const boundaries = [];

  for (const candidate of candidates) {
    const files = scan.files
      .filter((file) => file.relPath.toLowerCase().includes(`/${candidate}`))
      .map((file) => file.relPath)
      .slice(0, 25);

    if (files.length) {
      boundaries.push({
        boundedContext: candidate,
        files,
      });
    }
  }

  return boundaries;
}
