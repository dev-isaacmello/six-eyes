import { BaseProvider } from "../../core/provider-runtime/BaseProvider.js";
import { rules } from "./rules.js";

export default class GenericProvider extends BaseProvider {
  buildRules() {
    return rules;
  }
}
