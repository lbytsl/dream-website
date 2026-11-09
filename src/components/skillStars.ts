/** GitHub Star 的成功快照；失败时保留此时间以反映实际新鲜度。 */
export type StarCount = { value: number; updatedAt: string };

const hour = 60 * 60 * 1000;
const pending = new Map<string, Promise<StarCount>>();
const memory = new Map<string, StarCount>();
const retryAfter = new Map<string, number>();

/** 拒绝非法缓存，包含未来时间；浏览器存储不可用时仍可获取统计。 */
function validStars(value: unknown): value is StarCount {
  const item = value as StarCount | undefined;
  const time = Date.parse(item?.updatedAt ?? "");
  return !!item && Number.isSafeInteger(item.value) && item.value >= 0 && Number.isFinite(time) && time <= Date.now();
}

/** 同一仓库共享请求与缓存；失败暂缓重试，避免站内跳转反复消耗配额。 */
export async function loadSkillStars(repo: string, fallback?: StarCount): Promise<StarCount | undefined> {
  let cached = memory.get(repo);
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(`skill-stars:${repo}`) ?? "null");
    if (validStars(stored) && (!cached || stored.updatedAt > cached.updatedAt)) cached = stored;
  } catch { /* 隐私模式或损坏缓存不影响页面。 */ }
  if (fallback && (!cached || fallback.updatedAt > cached.updatedAt)) cached = fallback;
  if (cached && Date.now() - Date.parse(cached.updatedAt) < hour) return cached;
  if ((retryAfter.get(repo) ?? 0) > Date.now()) return cached;
  let request = pending.get(repo);
  if (!request) {
    request = (async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch(`https://api.github.com/repos/${repo}`, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const body = await response.json();
        const next = { value: body.stargazers_count, updatedAt: new Date(Date.now()).toISOString() };
        if (!validStars(next)) throw new Error("Star 数量不合法");
        memory.set(repo, next);
        try { localStorage.setItem(`skill-stars:${repo}`, JSON.stringify(next)); } catch { /* 存储失败使用内存缓存。 */ }
        return next;
      } finally { clearTimeout(timeout); }
    })();
    pending.set(repo, request);
  }
  try { return await request; }
  catch { retryAfter.set(repo, Date.now() + 5 * 60 * 1000); return cached; }
  finally { pending.delete(repo); }
}
