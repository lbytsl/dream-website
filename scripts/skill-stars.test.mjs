import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

// 使用真实缓存模块验证跨页面并发、限流和隐私模式，不需要访问外部服务。
const source = await readFile(new URL("../src/components/skillStars.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
});
const { loadSkillStars } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

test("浏览器 Star 缓存与异常恢复", async (t) => {
  const originalFetch = globalThis.fetch;
  const originalStorage = globalThis.localStorage;
  const originalNow = Date.now;
  let now = Date.now();
  Date.now = () => now;
  const storage = new Map();
  globalThis.localStorage = { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
  try {
    await t.test("并发访问同一仓库合并请求，随后命中缓存", async () => {
      let calls = 0;
      globalThis.fetch = async () => { calls++; return Response.json({ stargazers_count: 123 }); };
      const [one, two] = await Promise.all([loadSkillStars("org/shared"), loadSkillStars("org/shared")]);
      assert.equal(calls, 1);
      assert.deepEqual(one, two);
      assert.equal(one.value, 123);
      await loadSkillStars("org/shared");
      assert.equal(calls, 1);
      now += 3600001;
      await loadSkillStars("org/shared");
      assert.equal(calls, 2);
    });
    await t.test("读取较新的静态快照时无需再次请求", async () => {
      globalThis.fetch = async () => { throw new Error("不应请求"); };
      const fallback = { value: 100, updatedAt: new Date(now).toISOString() };
      assert.deepEqual(await loadSkillStars("org/fresh", fallback), fallback);
    });
    await t.test("限流保留历史值与时间，并避免连续重试", async () => {
      let calls = 0;
      globalThis.fetch = async () => { calls++; return new Response("rate limited", { status: 403 }); };
      const old = { value: 9, updatedAt: new Date(now - 7200000).toISOString() };
      assert.deepEqual(await loadSkillStars("org/limited", old), old);
      assert.deepEqual(await loadSkillStars("org/limited", old), old);
      assert.equal(calls, 1);
      now += 300001;
      globalThis.fetch = async () => Response.json({ stargazers_count: 0 });
      assert.equal((await loadSkillStars("org/limited", old)).value, 0);
    });
    await t.test("损坏缓存及非法上游数字不能显示成零", async () => {
      storage.set("skill-stars:org/bad", "broken json");
      globalThis.fetch = async () => Response.json({ stargazers_count: -1 });
      assert.equal(await loadSkillStars("org/bad"), undefined);
    });
    await t.test("浏览器禁用存储时仍能获取和复用内存缓存", async () => {
      globalThis.localStorage = { getItem() { throw new Error("denied"); }, setItem() { throw new Error("denied"); } };
      let calls = 0;
      globalThis.fetch = async () => { calls++; return Response.json({ stargazers_count: 22 }); };
      assert.equal((await loadSkillStars("org/private")).value, 22);
      assert.equal((await loadSkillStars("org/private")).value, 22);
      assert.equal(calls, 1);
    });
  } finally {
    globalThis.fetch = originalFetch;
    if (originalStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = originalStorage;
    Date.now = originalNow;
  }
});
