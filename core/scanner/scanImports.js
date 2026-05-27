import path from "path";

export function extractImportsForFile(filePath, content) {
  const ext = path.extname(filePath).toLowerCase();

  if ([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"].includes(ext)) {
    return [
      ...content.matchAll(/import\s+[^'"\n]*?from\s+['"]([^'"]+)['"]/g),
      ...content.matchAll(/import\s*\(\s*['"]([^'"]+)['"]\s*\)/g),
      ...content.matchAll(/export\s+[^'"\n]*?from\s+['"]([^'"]+)['"]/g),
      ...content.matchAll(/require\(\s*['"]([^'"]+)['"]\s*\)/g),
    ].map((match) => match[1]);
  }

  if (ext === ".py") {
    return [
      ...content.matchAll(/^\s*import\s+([\w.]+)/gm),
      ...content.matchAll(/^\s*from\s+([\w.]+)\s+import\s+/gm),
    ].map((match) => match[1]);
  }

  if (ext === ".dart") {
    return [
      ...content.matchAll(/^\s*import\s+['"]([^'"]+)['"]/gm),
      ...content.matchAll(/^\s*export\s+['"]([^'"]+)['"]/gm),
      ...content.matchAll(/^\s*part\s+['"]([^'"]+)['"]/gm),
    ].map((match) => match[1]);
  }

  if (ext === ".cs") {
    return [...content.matchAll(/^\s*using\s+([\w.]+)/gm)].map(
      (match) => match[1],
    );
  }

  return [];
}

export function resolveRelativeImport(originFile, specifier) {
  if (!specifier.startsWith(".")) {
    return null;
  }

  const base = path.posix.dirname(originFile);
  const targetBase = path.posix.normalize(path.posix.join(base, specifier));

  return [
    targetBase,
    `${targetBase}.js`,
    `${targetBase}.mjs`,
    `${targetBase}.cjs`,
    `${targetBase}.ts`,
    `${targetBase}.tsx`,
    `${targetBase}.jsx`,
    `${targetBase}.py`,
    `${targetBase}.cs`,
    `${targetBase}.dart`,
    `${targetBase}/index.js`,
    `${targetBase}/index.ts`,
    `${targetBase}/index.tsx`,
  ];
}

export function resolveDartImport(specifier) {
  if (specifier.startsWith("dart:")) {
    return null;
  }

  if (!specifier.startsWith("package:")) {
    return null;
  }

  const packagePath = specifier.replace(/^package:[^/]+\//, "");
  if (!packagePath) {
    return null;
  }

  const normalized = packagePath.replace(/^\//, "");
  return [
    `lib/${normalized}`,
    `lib/${normalized}.dart`,
    normalized,
    `${normalized}.dart`,
  ];
}

export function resolveImportCandidates(originFile, specifier) {
  return resolveDartImport(specifier) ?? resolveRelativeImport(originFile, specifier);
}

export function scanImports(filesWithContent) {
  return filesWithContent.map((file) => ({
    file: file.relPath,
    imports: extractImportsForFile(file.relPath, file.content),
  }));
}
