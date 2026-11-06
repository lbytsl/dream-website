# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

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
