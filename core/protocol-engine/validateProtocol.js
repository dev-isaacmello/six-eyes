export function validateProtocol(protocol) {
  const errors = [];

  if (!protocol || typeof protocol !== "object") {
    errors.push("Protocol must be an object.");
  }

  if (!protocol.id) {
    errors.push("Protocol id is required.");
  }

  if (!Array.isArray(protocol.steps) || protocol.steps.length === 0) {
    errors.push("Protocol must define at least one step.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
