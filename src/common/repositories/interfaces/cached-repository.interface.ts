export interface ICachedRepository {
  buildCacheKey(prefix: string, ...keys: string[]): string;
}
