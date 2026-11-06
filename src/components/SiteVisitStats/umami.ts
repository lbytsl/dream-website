export interface VisitStatsConfig {
  shareUrl: string;
  apiBaseUrl: string;
  websiteId: string;
}

export interface VisitStats {
  pageviews: number;
  todayVisitors: number;
  updatedAt: number;
}

let cache: { key: string; dayStart: number; data: VisitStats } | undefined;

/** Use Beijing midnight regardless of the visitor's local timezone. */
export function beijingDayStart(now: number): number {
  const offset = 8 * 60 * 60 * 1000;
  return Math.floor((now + offset) / 86_400_000) * 86_400_000 - offset;
}

function count(value: unknown): number {
  // Umami v2 returns { value, prev }; v3 returns the number directly.
  const number = typeof value === "object" && value !== null && "value" in value
    ? value.value : value;
  if (typeof number !== "number" || !Number.isSafeInteger(number) || number < 0) {
    throw new Error("Invalid visit count");
  }
  return number;
}

export async function loadVisitStats(
  config: VisitStatsConfig | undefined,
  signal: AbortSignal,
): Promise<VisitStats> {
  if (!config?.shareUrl || !config.apiBaseUrl || !config.websiteId) {
    throw new Error("Public visit statistics are not configured");
  }

  const share = new URL(config.shareUrl);
  const slug = share.pathname.match(/\/share\/([^/]+)/)?.[1];
  const api = new URL(config.apiBaseUrl);
  if (!slug || share.protocol !== "https:" || api.protocol !== "https:" || api.origin !== share.origin) {
    throw new Error("Invalid public statistics configuration");
  }

  const now = Date.now();
  const dayStart = beijingDayStart(now);
  const key = JSON.stringify(config);
  if (cache?.key === key && cache.dayStart === dayStart && now - cache.data.updatedAt < 300_000) {
    return cache.data;
  }

  async function get(path: string, headers?: Record<string, string>) {
    const response = await fetch(`${api.href.replace(/\/$/, "")}${path}`, {
      headers,
      signal,
      credentials: "omit",
      referrerPolicy: "no-referrer",
    });
    if (!response.ok) throw new Error("Visit statistics unavailable");
    return response.json();
  }

  // Only a public share token is used. No account credentials are shipped.
  const access = await get(`/share/${slug}`);
  if (access.websiteId !== config.websiteId || typeof access.token !== "string" || !access.token) {
    throw new Error("The share does not match this website");
  }
  const headers = {
    "x-umami-share-token": access.token,
    "x-umami-share-context": "1",
  };
  const statsPath = `/websites/${encodeURIComponent(config.websiteId)}/stats`;
  const params = (start: number) => new URLSearchParams({
    startAt: String(start),
    endAt: String(now),
    timezone: "Asia/Shanghai",
  });
  const [all, today] = await Promise.all([
    get(`${statsPath}?${params(0)}`, headers),
    get(`${statsPath}?${params(dayStart)}`, headers),
  ]);
  const data = {
    pageviews: count(all.pageviews),
    todayVisitors: count(today.visitors),
    updatedAt: now,
  };
  cache = { key, dayStart, data };
  return data;
}
