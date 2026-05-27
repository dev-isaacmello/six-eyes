import path from "path";

function extractJsSymbols(content) {
  return [
    ...content.matchAll(/\b(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g),
    ...content.matchAll(/\b(?:export\s+)?class\s+([A-Za-z_$][\w$]*)/g),
    ...content.matchAll(/\b(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=/g),
  ].map((match) => match[1]);
}

function extractPythonSymbols(content) {
  return [
    ...content.matchAll(/^\s*def\s+([A-Za-z_]\w*)\s*\(/gm),
    ...content.matchAll(/^\s*class\s+([A-Za-z_]\w*)\s*[:(]/gm),
  ].map((match) => match[1]);
}

function extractDartSymbols(content) {
  return [
    ...content.matchAll(/\bclass\s+([A-Za-z_]\w*)/g),
    ...content.matchAll(/\b(?:Future<[^>]+>|void|int|double|String|bool)\s+([A-Za-z_]\w*)\s*\(/g),
  ].map((match) => match[1]);
}

function extractCsharpSymbols(content) {
  return [
    ...content.matchAll(/\b(?:class|record|interface|struct)\s+([A-Za-z_]\w*)/g),
    ...content.matchAll(/\b(?:public|private|protected|internal)\s+[\w<>]+\s+([A-Za-z_]\w*)\s*\(/g),
  ].map((match) => match[1]);
}

export function extractSymbolsForFile(filePath, content) {
  const ext = path.extname(filePath).toLowerCase();

  if ([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"].includes(ext)) {
    return extractJsSymbols(content);
  }

  if (ext === ".py") {
    return extractPythonSymbols(content);
  }

  if (ext === ".dart") {
    return extractDartSymbols(content);
  }

  if (ext === ".cs") {
    return extractCsharpSymbols(content);
  }

  return [];
}

export function scanSymbols(filesWithContent) {
  return filesWithContent.map((file) => ({
    file: file.relPath,
    symbols: [...new Set(extractSymbolsForFile(file.relPath, file.content))],
  }));
}
