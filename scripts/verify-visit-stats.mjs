import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../src/components/SiteVisitStats/umami.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
});
const { beijingDayStart, loadVisitStats } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

assert.equal(beijingDayStart(Date.parse("2026-11-06T15:59:59Z")), Date.parse("2026-11-05T16:00:00Z"));
assert.equal(beijingDayStart(Date.parse("2026-11-06T16:00:00Z")), Date.parse("2026-11-06T16:00:00Z"));

const originalFetch = globalThis.fetch;
const originalNow = Date.now;
let now = Date.parse("2026-11-06T12:00:00Z");
Date.now = () => now;
const config = {
  shareUrl: "https://stats.example.com/share/public-code/dream",
  apiBaseUrl: "https://stats.example.com/api",
  websiteId: "test-site",
};
const signal = new AbortController().signal;
const calls = [];
let invalidCount = false;
let wrongWebsite = false;
let fail = false;
globalThis.fetch = async (url, options) => {
  assert.equal(options.credentials, "omit");
  assert.equal(options.signal, signal);
  calls.push(new URL(url));
  if (fail) return new Response("unavailable", { status: 503 });
  if (url.includes("/share/")) {
    return Response.json({ websiteId: wrongWebsite ? "other-site" : "test-site", token: "public-share-token" });
  }
  assert.equal(options.headers["x-umami-share-token"], "public-share-token");
  assert.equal(options.headers["x-umami-share-context"], "1");
  const params = new URL(url).searchParams;
  assert.equal(params.get("timezone"), "Asia/Shanghai");
  assert.equal(params.get("endAt"), String(now));
  if (params.get("startAt") === "0") {
    return Response.json({ pageviews: invalidCount ? -1 : 12580 });
  }
  assert.equal(params.get("startAt"), String(beijingDayStart(now)));
  return Response.json({ visitors: { value: 0, prev: 1 } });
};

try {
  await assert.rejects(loadVisitStats(undefined, signal));
  const data = await loadVisitStats(config, signal);
  assert.equal(data.pageviews, 12580);
  assert.equal(data.todayVisitors, 0, "A real zero must not become an unavailable state");
  assert.equal(calls.length, 3);
  await loadVisitStats(config, signal);
  assert.equal(calls.length, 3, "Reuse fresh data across navigation");
  now += 300_001;
  await loadVisitStats(config, signal);
  assert.equal(calls.length, 6, "Refresh after five minutes");
  now = Date.parse("2026-11-06T15:59:59Z");
  await loadVisitStats(config, signal);
  now += 1000;
  await loadVisitStats(config, signal);
  assert.equal(calls.length, 12, "Invalidate the cache at Beijing midnight");
  now += 300_001;
  wrongWebsite = true;
  await assert.rejects(loadVisitStats(config, signal), /does not match/);
  wrongWebsite = false;
  invalidCount = true;
  await assert.rejects(loadVisitStats(config, signal), /Invalid visit count/);
  invalidCount = false;
  fail = true;
  await assert.rejects(loadVisitStats(config, signal), /unavailable/);
  console.log("Visit stats: date boundaries, public-share authorization, both API count formats, zero, caching, site mismatch and failure handling passed.");
} finally {
  globalThis.fetch = originalFetch;
  Date.now = originalNow;
}
