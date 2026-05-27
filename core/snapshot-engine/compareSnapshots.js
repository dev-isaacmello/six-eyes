export function compareSnapshots(left, right) {
  const leftPayload = left.payload ?? left;
  const rightPayload = right.payload ?? right;
  const leftKeys = new Set(Object.keys(leftPayload));
  const rightKeys = new Set(Object.keys(rightPayload));

  return {
    added: [...rightKeys].filter((key) => !leftKeys.has(key)),
    removed: [...leftKeys].filter((key) => !rightKeys.has(key)),
    changed: [...leftKeys].filter(
      (key) =>
        rightKeys.has(key) &&
        JSON.stringify(leftPayload[key]) !== JSON.stringify(rightPayload[key]),
    ),
  };
}
