// very simple in-memory cache with TTL
const cache = new Map();
export function setCache(key, data, ttlMs = 60000) {
  // 60s
  cache.set(key, { data, expires: Date.now() + ttlMs });
}
export function getCache(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expires) {
    cache.delete(key);
    return null;
  }
  return hit.data;
}
