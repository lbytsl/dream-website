const fs = require("node:fs/promises");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "static/data/skill-stats.json");

/** 只读取详情页统计栏的安装量，避免把技能正文中的示例数字当成统计。 */
function parseInstalls(html) {
  const match = html.match(/<span>Installs<\/span>\s*<\/div>\s*<div\b[^>]*>\s*([\d,.]+\s*[KMB]?)\s*<\/div>/i);
  if (!match) throw new Error("未找到 skills.sh 安装量统计栏");
  const display = match[1].replace(/\s/g, "");
  if (!/^\d[\d,]*(?:\.\d+)?[KMB]?$/i.test(display)) throw new Error("安装量格式不合法");
  return display;
}

/** 从现有文档读取统计对应关系，来源仓库与 skills.sh 路径允许不同。 */
async function discoverSkills(directory = path.join(root, "docs/skills")) {
  const skills = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) skills.push(...await discoverSkills(file));
    else if (entry.name === "index.mdx") {
      const content = await fs.readFile(file, "utf8");
      const skill = content.match(/https:\/\/skills\.sh\/([\w.-]+\/[\w.-]+\/[\w.-]+)/)?.[1];
      const repo = content.match(/\| 来源 \|[^\n]*https:\/\/github\.com\/([\w.-]+\/[\w.-]+)/)?.[1];
      if (skill && repo) skills.push({ skill, repo });
    }
  }
  return skills;
}

/** 每项独立回退；请求失败不得更新时间或把未知值写成零。 */
async function collectStats(skills, previous = {}, request = fetch, now = () => new Date().toISOString()) {
  const result = {};
  const repositories = new Map();
  const warnings = [];
  for (const { skill, repo } of skills) {
    const entry = { repo, ...previous[skill] };
    entry.repo = repo;
    // 仓库映射发生变化时，旧仓库的 Star 不得作为新仓库的回退值。
    if (previous[skill]?.repo !== repo) delete entry.stars;
    try {
      const response = await request(`https://skills.sh/${skill}`, { signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      entry.installs = { display: parseInstalls(await response.text()), updatedAt: now() };
    } catch (error) {
      warnings.push(`${skill} 安装量：${error.message}`);
    }
    if (!repositories.has(repo)) {
      try {
        const headers = { Accept: "application/vnd.github+json", "User-Agent": "dream-website-stats" };
        // 令牌仅在构建进程使用，不写入输出文件或前端代码。
        if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
        const response = await request(`https://api.github.com/repos/${repo}`, { headers, signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!Number.isSafeInteger(data.stargazers_count) || data.stargazers_count < 0) throw new Error("Star 数量不合法");
        repositories.set(repo, { value: data.stargazers_count, updatedAt: now() });
      } catch (error) {
        repositories.set(repo, null);
        warnings.push(`${repo} Star：${error.message}`);
      }
    }
    if (repositories.get(repo)) entry.stars = repositories.get(repo);
    result[skill] = entry;
  }
  return { result, warnings };
}

/** 为静态站点生成可持久回退的统计快照；单个外部源失败不阻断站点构建。 */
async function main() {
  let previous = {};
  try { previous = JSON.parse(await fs.readFile(output, "utf8")); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  const { result, warnings } = await collectStats(await discoverSkills(), previous);
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, `${JSON.stringify(result, null, 2)}\n`);
  for (const warning of warnings) console.warn(`[技能统计] ${warning}，保留上次成功值；无历史值时显示待更新。`);
  console.log(`技能统计已处理 ${Object.keys(result).length} 项，${warnings.length} 项请求失败。`);
}

if (require.main === module) main().catch((error) => { console.error(error); process.exitCode = 1; });
module.exports = { parseInstalls, discoverSkills, collectStats };
