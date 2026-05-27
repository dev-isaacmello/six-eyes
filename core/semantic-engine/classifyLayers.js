import { LAYER_HINTS } from "../shared/constants.js";

export function classifyLayers(scan) {
  const layers = {};
  for (const layer of Object.keys(LAYER_HINTS)) {
    layers[layer] = [];
  }

  for (const file of scan.files) {
    const normalized = file.relPath.toLowerCase();
    for (const [layer, hints] of Object.entries(LAYER_HINTS)) {
      if (
        hints.some(
          (hint) =>
            normalized.includes(`/${hint}/`) ||
            normalized.includes(`${hint}.`),
        )
      ) {
        layers[layer].push(file.relPath);
      }
    }
  }

  return layers;
}
