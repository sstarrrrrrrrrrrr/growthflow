const STORAGE_PREFIX = "growthflow";

export const storageService = {
  get<T>(key: string, fallback: T): T {
    try {
      const value = window.localStorage.getItem(`${STORAGE_PREFIX}:${key}`);
      return value ? (JSON.parse(value) as T) : fallback;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    window.localStorage.setItem(`${STORAGE_PREFIX}:${key}`, JSON.stringify(value));
  },

  remove(key: string): void {
    window.localStorage.removeItem(`${STORAGE_PREFIX}:${key}`);
  },
};
