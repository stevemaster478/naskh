import type { ConversionMode } from "@shared/schema";

interface CacheEntry {
  result: string;
  timestamp: number;
  source: "dictionary" | "ai";
}

class ConversionCache {
  private cache: Map<string, CacheEntry>;
  private maxSize: number;
  private ttl: number;

  constructor(maxSize: number = 1000, ttlMinutes: number = 60) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttlMinutes * 60 * 1000;
  }

  private getCacheKey(text: string, mode: ConversionMode): string {
    return `${mode}:${text.toLowerCase().trim()}`;
  }

  set(text: string, mode: ConversionMode, result: string, source: "dictionary" | "ai"): void {
    const key = this.getCacheKey(text, mode);
    
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      result,
      timestamp: Date.now(),
      source,
    });
  }

  get(text: string, mode: ConversionMode): CacheEntry | null {
    const key = this.getCacheKey(text, mode);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry;
  }

  clear(): void {
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl / 60000,
    };
  }
}

export const conversionCache = new ConversionCache();
