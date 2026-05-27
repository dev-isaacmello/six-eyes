export class BaseProvider {
  constructor(config = {}) {
    this.config = config;
  }

  get name() {
    return this.config.name ?? "generic";
  }

  buildPrompt(contextWindow) {
    return JSON.stringify(contextWindow, null, 2);
  }

  buildRules() {
    return [];
  }

  installTarget() {
    return this.config.targetDir ?? null;
  }
}
