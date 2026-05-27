export class ProviderRegistry {
  #providers = new Map();

  register(name, providerFactory) {
    this.#providers.set(String(name).toLowerCase(), providerFactory);
  }

  has(name) {
    return this.#providers.has(String(name).toLowerCase());
  }

  create(name, config = {}) {
    const factory = this.#providers.get(String(name).toLowerCase());
    if (!factory) {
      throw new Error(`Unknown provider: ${name}`);
    }

    return factory(config);
  }

  list() {
    return [...this.#providers.keys()].sort();
  }
}
