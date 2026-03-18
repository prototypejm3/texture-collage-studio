const RATE_KEY = 'gen_timestamps';
const MAX_PER_HOUR = 5;
const HOUR_MS = 60 * 60 * 1000;

export function checkGenerationLimit(): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const raw = localStorage.getItem(RATE_KEY);
  const timestamps: number[] = raw ? JSON.parse(raw).filter((t: number) => now - t < HOUR_MS) : [];

  if (timestamps.length >= MAX_PER_HOUR) {
    const oldest = Math.min(...timestamps);
    const resetIn = Math.ceil((oldest + HOUR_MS - now) / 60000);
    return { allowed: false, remaining: 0, resetIn };
  }

  return { allowed: true, remaining: MAX_PER_HOUR - timestamps.length, resetIn: 0 };
}

export function recordGeneration() {
  const now = Date.now();
  const raw = localStorage.getItem(RATE_KEY);
  const timestamps: number[] = raw ? JSON.parse(raw).filter((t: number) => now - t < HOUR_MS) : [];
  timestamps.push(now);
  localStorage.setItem(RATE_KEY, JSON.stringify(timestamps));
}
