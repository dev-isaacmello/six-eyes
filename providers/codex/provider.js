import { BaseProvider } from "../../core/provider-runtime/BaseProvider.js";
import { rules } from "./rules.js";

export default class CodexProvider extends BaseProvider {
  buildRules() {
    return rules;
  }

  buildPrompt(contextWindow) {
    return `Treat Six Eyes as the architectural middleware for this workspace:\n\n${JSON.stringify(
      contextWindow,
      null,
      2,
    )}`;
  }
}
