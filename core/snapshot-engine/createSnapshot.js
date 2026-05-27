import path from "path";
import fs from "fs-extra";
import { getStateDir } from "../shared/paths.js";

export async function createSnapshot(workspacePath, payload, name = null) {
  const snapshotId = name ?? `snapshot-${Date.now()}`;
  const filePath = path.join(getStateDir(workspacePath), "snapshots", `${snapshotId}.json`);
  const snapshot = {
    id: snapshotId,
    generatedAt: new Date().toISOString(),
    payload,
  };

  await fs.outputJson(filePath, snapshot, { spaces: 2 });
  return snapshot;
}
