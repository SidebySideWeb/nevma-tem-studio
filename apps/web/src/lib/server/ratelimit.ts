/**
 * In-memory rate limit: 5 requests / 10 min per IP (per function instance).
 * ponytail: ceiling = single-instance memory; upgrade to Redis/Upstash if multi-region abuse appears.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX = 5;

type Bucket = { times: number[] };
const buckets = new Map<string, Bucket>();

export function rateLimit(ip: string): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  let b = buckets.get(ip);
  if (!b) {
    b = { times: [] };
    buckets.set(ip, b);
  }
  b.times = b.times.filter((t) => now - t < WINDOW_MS);
  if (b.times.length >= MAX) {
    const oldest = b.times[0]!;
    return { ok: false, retryAfterSec: Math.ceil((WINDOW_MS - (now - oldest)) / 1000) };
  }
  b.times.push(now);
  return { ok: true };
}

/** Test helper — clear buckets between e2e cases when E2E_MOCK_OUTBOUND is on. */
export function __resetRateLimitForTests() {
  buckets.clear();
}
