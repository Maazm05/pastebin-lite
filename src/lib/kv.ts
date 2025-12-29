// src/lib/kv.ts

declare global {
  var __KV_STORE: Map<string, any> | undefined;
}

const store: Map<string, any> = globalThis.__KV_STORE || new Map();
globalThis.__KV_STORE = store;

export const kv = {
  async set(key: string, value: any) {
    store.set(key, value);
  },
  async get(key: string) {
    return store.get(key);
  },
};
