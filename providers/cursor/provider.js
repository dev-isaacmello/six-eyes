import { BaseProvider } from "../../core/provider-runtime/BaseProvider.js";
import { rules } from "./rules.js";

export default class CursorProvider extends BaseProvider {
  buildRules() {
    return rules;
  }

  buildPrompt(contextWindow) {
    return `Cursor rules must follow this Six Eyes context:\n\n${JSON.stringify(
      contextWindow,
      null,
      2,
    )}`;
  }
}
