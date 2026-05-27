const ENTRYPOINT_HINTS = [
  "main.",
  "index.",
  "server.",
  "app.",
  "Program.cs",
  "manage.py",
  "pubspec.yaml",
  "package.json",
  "next.config.",
];

export function detectEntrypoints(scan) {
  return scan.files
    .filter((file) =>
      ENTRYPOINT_HINTS.some((hint) => file.relPath.includes(hint)),
    )
    .map((file) => file.relPath)
    .slice(0, 50);
}
