export class AdapterRegistry {
  constructor(adapters = {}) {
    this.adapters = new Map(Object.entries(adapters));
  }

  get(action) {
    const adapter = this.adapters.get(action) || this.adapters.get('default');
    if (!adapter) throw new Error(`adapter_not_found:${action}`);
    return adapter;
  }
}
