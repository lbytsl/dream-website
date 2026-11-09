const { test } = require("node:test");
const assert = require("node:assert/strict");
const { parseInstalls, collectStats, discoverSkills } = require("./sync-skill-stats");

/** 固定统计栏夹具，确认正文数字不会误入快照。 */
test("只读取安装量统计栏并保留来源精度", () => {
  assert.equal(parseInstalls('<p>100K installs</p><span>Installs</span></div><div class="count">4.3M</div>'), "4.3M");
  assert.equal(parseInstalls('<span>Installs</span></div><div>0</div>'), "0");
  assert.throws(() => parseInstalls('<p>100K installs</p>'));
  assert.throws(() => parseInstalls('<span>Installs</span></div><div>-1</div>'));
});

/** 限流或源页面改版时保持旧值和原时间，不伪装成刚更新。 */
test("双源失败保留历史数据与时间", async () => {
  const old = { repo: "org/repo", installs: { display: "2K", updatedAt: "2026-07-30T00:00:00Z" }, stars: { value: 12, updatedAt: "2026-07-30T00:00:00Z" } };
  const { result, warnings } = await collectStats([{ skill: "org/repo/skill", repo: "org/repo" }], { "org/repo/skill": old }, async () => ({ ok: false, status: 429 }));
  assert.deepEqual(result["org/repo/skill"], old);
  assert.equal(warnings.length, 2);
});

/** 两项统计独立成功或失败，重复仓库只调用一次 GitHub。 */
test("独立更新并合并重复仓库请求", async () => {
  let githubCalls = 0;
  const now = "2026-11-09T01:00:00Z";
  const request = async (url) => {
    if (url.includes("api.github.com")) {
      githubCalls++;
      return { ok: true, json: async () => ({ stargazers_count: 0 }) };
    }
    return { ok: true, text: async () => url.endsWith("/one") ? '<span>Installs</span></div><div>1.2K</div>' : '<p>upstream changed</p>' };
  };
  const { result, warnings } = await collectStats([{ skill: "org/repo/one", repo: "org/repo" }, { skill: "org/repo/two", repo: "org/repo" }], {}, request, () => now);
  assert.equal(githubCalls, 1);
  assert.deepEqual(result["org/repo/one"].installs, { display: "1.2K", updatedAt: now });
  assert.deepEqual(result["org/repo/two"].stars, { value: 0, updatedAt: now });
  assert.equal(result["org/repo/two"].installs, undefined);
  assert.equal(warnings.length, 1);
});

/** 无历史值或映射已更换时，错误响应不能继承其他仓库的数字。 */
test("拒绝非法 Star 并清除旧仓库回退", async () => {
  const { result } = await collectStats([{ skill: "org/repo/skill", repo: "org/new" }], { "org/repo/skill": { repo: "org/old", stars: { value: 99, updatedAt: "2026-07-30T00:00:00Z" } } }, async () => ({ ok: true, text: async () => "", json: async () => ({ stargazers_count: -1 }) }));
  assert.equal(result["org/repo/skill"].stars, undefined);
  assert.equal(result["org/repo/skill"].installs, undefined);
});

/** 文档映射需覆盖当前带统计的技能，避免路径与仓库混淆。 */
test("从文档发现完整映射", async () => {
  const skills = await discoverSkills();
  assert.equal(skills.length, 11);
  assert.equal(new Set(skills.map(({ skill }) => skill)).size, skills.length);
  assert.ok(skills.some(({ skill, repo }) => skill === "101-skills/skills/ai-image-generation" && repo === "inference-sh/skills"));
  assert.ok(skills.some(({ skill, repo }) => skill === "pbakaus/impeccable/impeccable" && repo === "pbakaus/impeccable"));
});
