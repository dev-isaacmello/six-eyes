export function generateReport(validation) {
  const lines = ["# Six Eyes Architecture Enforcement", ""];

  lines.push(`Status: ${validation.valid ? "pass" : "fail"}`, "");
  lines.push(`Layer violations: ${validation.layers.violations.length}`);
  lines.push(`Boundary warnings: ${validation.boundaries.warnings.length}`);

  if (validation.layers.violations.length) {
    lines.push("", "## Layer Violations");
    for (const violation of validation.layers.violations) {
      lines.push(`- ${violation.origin} -> ${violation.dependency} (${violation.edge})`);
    }
  }

  if (validation.boundaries.warnings.length) {
    lines.push("", "## Boundary Warnings");
    for (const warning of validation.boundaries.warnings) {
      lines.push(`- ${warning.boundedContext}: ${warning.file}`);
    }
  }

  return `${lines.join("\n")}\n`;
}
