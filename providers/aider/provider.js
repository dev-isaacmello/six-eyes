import { BaseProvider } from "../../core/provider-runtime/BaseProvider.js";
import { rules } from "./rules.js";

export default class AiderProvider extends BaseProvider {
  buildRules() {
    return rules;
  }

  buildPrompt(contextWindow) {
    return `Aider should apply these Six Eyes constraints before code changes:\n\n${JSON.stringify(
      contextWindow,
      null,
      2,
    )}`;
  }
}
