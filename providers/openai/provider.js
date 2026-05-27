import { BaseProvider } from "../../core/provider-runtime/BaseProvider.js";
import { rules } from "./rules.js";

export default class OpenAIProvider extends BaseProvider {
  buildRules() {
    return rules;
  }

  buildPrompt(contextWindow) {
    return `Use this Six Eyes context as structured middleware:\n\n${JSON.stringify(
      contextWindow,
      null,
      2,
    )}`;
  }
}
