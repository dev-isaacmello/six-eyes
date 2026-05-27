import { resolveConstraints } from "./resolveConstraints.js";
import { validateProtocol } from "./validateProtocol.js";

export function executeProtocol(protocol, context = {}) {
  const validation = validateProtocol(protocol);
  if (!validation.valid) {
    return {
      ok: false,
      errors: validation.errors,
      steps: [],
    };
  }

  const constraints = resolveConstraints(protocol, context);
  const steps = protocol.steps.map((step, index) => ({
    index: index + 1,
    name: step.name ?? `step-${index + 1}`,
    action: step.action ?? step,
    constraints,
  }));

  return {
    ok: true,
    protocol: protocol.id,
    steps,
  };
}
