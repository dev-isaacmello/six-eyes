import { BaseProvider } from "../../core/provider-runtime/BaseProvider.js";
import { rules } from "./rules.js";

export default class ClaudeProvider extends BaseProvider {
  buildRules() {
    return rules;
  }

  buildPrompt(contextWindow) {
    return `Use Six Eyes before editing. Architectural context:\n\n${JSON.stringify(
      contextWindow,
      null,
      2,
    )}`;
  }
}
