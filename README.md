# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## 知识库系列博文

“文章”页左侧目录先按年份分组；每个年份内，十篇专题与一篇总论收在可折叠的“知识库”节点下，其他文章与该节点并列。

- 正文放在 `blog/KnowledgeBase/{序号-主题}/index.md`，使用 `knowledge-base/{序号-主题}` 作为 slug。
- 博文侧栏复用 Skills 页的分类组件，手机端通过导航菜单展开，进入专题时自动展开并高亮当前文章。
- 总论提供完整系列目录，各专题保留上一／下一篇入口；图表与导出文件随文章存放在 `blog/KnowledgeBase/assets/`。
- 每篇提供“动手应用”快捷入口，案例写明教学输入、处理轨迹、预期输出及验收条件；图在正文内嵌展示，同时保留 SVG／PNG 原图入口。
- `scripts/build-stats.js` 递归统计系列正文，避免把分类和资源目录误计为文章。

## Installation

```bash
npm install
```

**Note**: feel free to use the package manager of your choice.

## Local Development

```bash
npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

### Skills 安装量与 GitHub Star

技能详情通过 `src/components/SkillStat.tsx` 展示统计，来源对应关系自动读取各详情页的“来源”和“详情”链接。

- 安装量：构建时读取 skills.sh 公开详情页的统计栏，保留其 K/M 等展示精度；不是本站安装次数，也不代表所有渠道的精确安装总数。
- Star：构建时生成回退快照；访问页面时通过 GitHub API 更新，同一仓库共享请求并缓存一小时。页面可见时自动检查过期缓存，恢复可见时也检查。
- 每项按北京时间（Asia/Shanghai）显示为 `33,732（更新于2026-11-09 11:08）`；读取失败保留旧值与旧时间，无历史数据时显示“待更新”。浏览器禁用存储时使用内存缓存。
- `npm run build` 自动同步；也可执行 `npm run sync:skill-stats` 单独刷新快照。开发服务器启动前可先运行此命令。
- Pages 工作流每天北京时间 08:23 构建部署，并缓存上次成功部署的快照；实际执行时间受 GitHub Actions 调度影响。定时工作流需要位于仓库默认分支。
- 构建阶段可选 `GITHUB_TOKEN` 增加 GitHub API 配额；工作流使用自带令牌，前端不包含令牌。skills.sh 页面结构变化会告警并保留旧数据。

验证：`npm run test:skill-stats`、`npm run typecheck`、`npm run build`。

### 顶部访问统计

顶部导航栏右侧显示 Umami 的浏览量和今日访客，手机端也会保留。
数据来自 `docusaurus.config.ts` 的 `customFields.visitStats`，当前接入的是本站已有的公开分享链接。
网页只使用公开分享令牌，不包含账户密码或私有 API 密钥，无需单独部署统计后端。

- 浏览量：Umami 当前保留记录内的页面浏览次数，不保证覆盖网站上线以来全部历史。
- 今日访客：北京时间（Asia/Shanghai）当天的 Umami 去重访客数，不等同于精确真实人数。
- 初次打开会请求数据，之后可见页面每 5 分钟刷新一次；站内跳转复用缓存。
- 加载或请求失败时显示 `—`，鼠标悬停可查看状态；失败不会显示成 0。
- 数字较大时使用“万”等紧凑格式，悬停可查看完整数字和更新时间。
- 更换分享链接时，同时核对 `apiBaseUrl`（包括 Cloud 的 `analytics/us` 或 `analytics/eu` 区域）和 `websiteId`。撤销公开分享后，页面将无法读取统计。

本地检查：`npm run typecheck`、`node scripts/verify-visit-stats.mjs`、`npm run build`。
构建完成后，按原有流程部署 `build/` 目录即可生效。

Using SSH:

```bash
USE_SSH=true npm run deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> npm run deploy
```

If you are using GitHub Pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
