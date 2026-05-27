import { createHash } from "crypto";

export function hashText(text) {
  return createHash("sha256").update(String(text)).digest("hex");
}

export function hashJson(value) {
  return hashText(JSON.stringify(value));
}
