const RATE_KEY = 'gen_daily';
const MAX_PER_DAY = 5;
const FREE_TRIAL_KEY = 'ai_free_trial_used';

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

interface DailyData {
  date: string;
  count: number;
}

function getDailyData(): DailyData {
  const today = getTodayKey();
  try {
    const raw = localStorage.getItem(RATE_KEY);
    if (raw) {
      const data: DailyData = JSON.parse(raw);
      if (data.date === today) return data;
    }
  } catch {}
  return { date: today, count: 0 };
}

export function checkGenerationLimit(): { allowed: boolean; remaining: number; used: number; max: number } {
  const data = getDailyData();
  const remaining = Math.max(0, MAX_PER_DAY - data.count);
  return {
    allowed: data.count < MAX_PER_DAY,
    remaining,
    used: data.count,
    max: MAX_PER_DAY,
  };
}

export function recordGeneration() {
  const data = getDailyData();
  data.count += 1;
  localStorage.setItem(RATE_KEY, JSON.stringify(data));
}

export function hasUsedFreeTrial(): boolean {
  try { return localStorage.getItem(FREE_TRIAL_KEY) === 'true'; } catch { return false; }
}

export function markFreeTrialUsed() {
  localStorage.setItem(FREE_TRIAL_KEY, 'true');
}
