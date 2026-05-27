export function resolveConstraints(protocol, context = {}) {
  const constraints = [
    ...(protocol.constraints ?? []),
    ...(context.constraints ?? []),
  ];

  return [...new Set(constraints)].filter(Boolean);
}
