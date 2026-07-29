# Dream Website 项目文档

> **AI Developer Hub** — 探索 AI 开发的前沿技术与实践
> 基于 Docusaurus 3.10.x 构建的静态文档站点

---

## 目录

1. [项目介绍](#1-项目介绍)
2. [项目框架](#2-项目框架)
3. [使用说明](#3-使用说明)
4. [文章添加指南](#4-文章添加指南)
5. [Prompt 与 Skills 说明](#5-prompt-与-skills-说明)

---

## 1. 项目介绍

### 1.1 项目背景

Dream Website 是一个面向 AI 开发者的综合性技术知识站点，由开发者 **lbytsl（Dream）** 创建并维护。项目旨在将分散的 AI 工程实践经验——Prompt 模板、Skills 工具集、技术文章——整合到一个统一的、可检索的、现代化的文档站点中。

站点使用 Meta 开源的 **Docusaurus** 静态站点生成器构建，采用 React 19 + TypeScript 技术栈，支持 MDX 富文本、Mermaid 图表、KaTeX 数学公式渲染，并内置暗色模式、响应式布局与 i18n 国际化基础设施。

### 1.2 核心目标

| 目标 | 说明 |
|------|------|
| **知识沉淀** | 将 Prompt 工程与 AI Skills 的实战经验系统化整理为可复用的模板库 |
| **快速上手** | 让新开发者能在 10 分钟内完成环境搭建并浏览全部内容 |
| **工程化标准** | 通过自动化的统计脚本、标准化的 frontmatter 规范，确保内容质量与一致性 |
| **开源协作** | 所有文档内容均支持「编辑此页」跳转 GitHub，鼓励社区贡献 |

### 1.3 主要功能

1. **博客系统（Blog）** — 支持按日期归档、作者页面、标签分类、RSS/Atom 订阅源、阅读时长估算（300 字/分钟）。
2. **Prompt Library** — 覆盖 ChatGPT、Claude、Gemini、Codex/Cursor、Dify、RAGFlow 六大主流模型/平台的精选 Prompt 模板库，共 19 篇文档。
3. **Skills Library** — 汇集 PromptOps、Knowledge Base、RAG、Dify、Coding、PPT 六大领域的 AI Skills 工具集，共 19 篇文档。
4. **自定义首页** — 由 Hero 区域、最新文章卡片、热门 Prompt 卡片、热门 Skills 卡片、Footer CTA 五个 React 组件组成的现代化落地页。
5. **关于页面** — 展示作者技术栈、开源项目（含实时 GitHub Star 数）、联系方式。
6. **自动化数据生成** — `prestart`/`prebuild` 钩子自动统计文章数、Prompt 数、Skills 数，并提取最近 3 篇博客文章信息供首页展示。
7. **数学公式与图表** — 通过 `remark-math` + `rehype-katex` 支持 LaTeX 公式，通过内置 Mermaid 支持流程图渲染。
8. **SEO 与站点地图** — 内置 sitemap 插件（weekly 更新频率），配置了 keywords/author/twitter card 元数据。

### 1.4 适用场景

- **个人 AI 技术博客** — 发布 Prompt 工程实践、RAG 系统设计、AI Agent 开发等技术文章。
- **团队 Prompt 模板库** — 作为团队内部的 Prompt 标准化知识库，统一 Prompt 编写规范。
- **Skills 工具文档站** — 为开源 AI Skills 项目提供完整的文档托管。
- **AI 开发者入门指南** — 帮助新入行开发者快速了解主流模型的能力边界与最佳实践。

---

## 2. 项目框架

### 2.1 技术栈总览

| 层级 | 技术选型 | 版本 |
|------|----------|------|
| 站点生成器 | Docusaurus（`@docusaurus/core`） | 3.10.2 |
| 预设 | `@docusaurus/preset-classic` | 3.10.2 |
| 加速构建 | `@docusaurus/faster` | 3.10.2 |
| 前端框架 | React | ^19.0.0 |
| 语言 | TypeScript | ~6.0.2 |
| Markdown 处理 | `@mdx-js/react` | ^3.0.0 |
| 代码高亮 | `prism-react-renderer`（GitHub / Dracula 主题） | ^2.3.0 |
| 数学公式 | `remark-math` + `rehype-katex` + KaTeX CSS（CDN 0.16.9） | - |
| 图表 | Mermaid（`@docusaurus/theme-mermaid`，配置开启） | ^3.10.2 |
| 样式方案 | Infima（Docusaurus 内置）+ CSS Modules + 自定义 CSS 变量 | - |
| 包管理 | npm | - |
| 运行时要求 | Node.js >= 20.0 | - |

### 2.2 整体架构

Dream Website 遵循 Docusaurus 的「一切功能皆插件」架构理念。站点核心本身不提供任何功能，所有内容模块（docs、blog、pages）均以插件形式由 `@docusaurus/preset-classic` 统一打包。

```
┌─────────────────────────────────────────────────────────────┐
│                    docusaurus.config.ts                      │
│  (站点唯一配置：URL、i18n、presets、themeConfig、stylesheets) │
└───────────────────────────┬─────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
     │  docs 插件   │  │  blog 插件  │  │ pages 插件  │
     │ (MDX 文档)  │  │ (Markdown)  │  │  (React/TSX) │
     └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
            │                │                  │
            ▼                ▼                  ▼
     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
     │ docs/prompt/│  │ blog/       │  │ src/pages/  │
     │ docs/skills/│  │ authors.yml │  │ index.tsx   │
     │ sidebars.ts │  │ tags.yml    │  │ about.tsx   │
     └─────────────┘  └─────────────┘  └─────────────┘
            │
            ▼
     ┌─────────────────────────────────────┐
     │     theme-classic (经典主题)         │
     │  navbar / footer / sidebar / prism   │
     │  src/css/custom.css (全局样式覆盖)   │
     └─────────────────────────────────────┘
```

### 2.3 目录结构

```
dream-website/
├── blog/                              # 博客内容
│   ├── PromptOps/                     # 博客文章目录（一篇文章一个目录）
│   │   ├── index.md                   # 文章正文（Markdown）
│   │   └── promptops-cover.png        # 文章封面图（自动复制到 static/img/blog-covers/）
│   ├── authors.yml                    # 作者定义文件
│   └── tags.yml                       # 标签定义文件
│
├── docs/                              # 文档内容（MDX 格式）
│   ├── prompt/                        # Prompt Library（19 个 .mdx）
│   │   ├── intro.mdx                  # Prompt 库首页
│   │   ├── chatgpt/                   # ChatGPT 分类
│   │   │   ├── index.mdx
│   │   │   ├── web-dev.mdx
│   │   │   ├── writing.mdx
│   │   │   └── data-analysis.mdx
│   │   ├── claude/                    # Claude 分类
│   │   │   ├── index.mdx
│   │   │   ├── long-form.mdx
│   │   │   └── code-review.mdx
│   │   ├── gemini/                    # Gemini 分类
│   │   │   ├── index.mdx
│   │   │   └── multimodal.mdx
│   │   ├── codex-cursor/              # Codex/Cursor 分类
│   │   │   ├── index.mdx
│   │   │   ├── generation.mdx
│   │   │   └── debugging.mdx
│   │   ├── dify/                      # Dify 分类
│   │   │   ├── index.mdx
│   │   │   ├── workflow.mdx
│   │   │   └── agent.mdx
│   │   └── ragflow/                   # RAGFlow 分类
│   │       ├── index.mdx
│   │       ├── knowledge-base.mdx
│   │       └── query.mdx
│   │
│   └── skills/                        # Skills Library（19 个 .mdx）
│       ├── intro.mdx                  # Skills 库首页
│       ├── prompt-ops/                # PromptOps 分类
│       │   ├── index.mdx
│       │   ├── getting-started.mdx
│       │   └── workflow.mdx
│       ├── knowledge-base/            # Knowledge Base 分类
│       │   ├── index.mdx
│       │   ├── rag.mdx
│       │   └── vector-store.mdx
│       ├── rag/                       # RAG 分类
│       │   ├── index.mdx
│       │   ├── basic.mdx
│       │   └── advanced.mdx
│       ├── dify/                      # Dify 分类
│       │   ├── index.mdx
│       │   ├── chatflow.mdx
│       │   └── plugins.mdx
│       ├── coding/                    # Coding 分类
│       │   ├── index.mdx
│       │   ├── code-review.mdx
│       │   └── test-gen.mdx
│       └── ppt/                       # PPT 分类
│           ├── index.mdx
│           ├── design.mdx
│           └── automation.mdx
│
├── src/                               # 自定义源码
│   ├── components/
│   │   └── homepage/                  # 首页组件（5 个）
│   │       ├── HeroSection.tsx         # 顶部 Hero 区域（含统计数据展示）
│   │       ├── FeaturedArticles.tsx    # 最新文章卡片（读 recent-posts.json）
│   │       ├── PromptLibrary.tsx       # 热门 Prompt 卡片（硬编码 6 个）
│   │       ├── SkillsLibrary.tsx       # 热门 Skills 卡片（硬编码 6 个）
│   │       ├── FooterCTA.tsx           # 底部 CTA 区域
│   │       └── *.module.css           # 各组件配套 CSS Modules
│   ├── pages/                         # 独立页面（文件路径即路由）
│   │   ├── index.tsx                  # 首页（/），组合 5 个 homepage 组件
│   │   ├── about.tsx                  # 关于页（/about）
│   │   └── about.module.css
│   ├── data/                          # 自动生成的数据文件
│   │   ├── stats.json                # 站点统计（articles/prompts/skills 数量）
│   │   ├── recent-posts.json          # 最近 3 篇博客文章元数据
│   │   ├── stats.d.ts                 # stats.json 的 TypeScript 类型声明
│   │   └── recent-posts.d.ts          # recent-posts.json 的类型声明
│   └── css/
│       └── custom.css                # 全局样式（覆盖 Infima 变量 + AI Hub 设计系统）
│
├── i18n/                              # 国际化
│   └── zh-CN/
│       └── docusaurus-theme-classic/
│           └── code.json              # 主题文案翻译文件
│
├── scripts/                           # 构建辅助脚本
│   ├── build-stats.js                 # 统计脚本（prestart/prebuild 钩子）
│   └── inspect-codeblock.js           # 调试用：检查 SSR 代码块渲染
│
├── static/                            # 静态资源（原样复制到 build 根目录）
│   └── img/
│       ├── avatar.jpg                 # 作者头像
│       ├── logo.jpg                   # 站点 Logo
│       └── blog-covers/               # 博客封面图（自动生成）
│
├── docusaurus.config.ts               # 站点唯一配置文件
├── sidebars.ts                        # 文档侧边栏定义
├── tsconfig.json                      # TypeScript 配置
├── package.json                       # 依赖与脚本
├── package-lock.json                  # 锁定依赖版本
├── README.md                          # 项目说明
└── PROJECT_DOCUMENTATION.md           # 本文档
```

### 2.4 核心配置文件详解

#### 2.4.1 `docusaurus.config.ts`

站点唯一配置文件，核心配置项如下：

| 配置区块 | 关键设置 | 说明 |
|----------|----------|------|
| **站点元信息** | `title: "Dream"`、`tagline`、`favicon` | 浏览器标题栏、社交分享卡片 |
| **部署地址** | `url: "https://lbytsl.github.io"`、`baseUrl: "/"`、`trailingSlash: false` | GitHub Pages 部署 |
| **未来标志** | `future.v4: true` | 启用 Docusaurus v4 兼容模式 |
| **国际化** | `defaultLocale: "zh-CN"`、`locales: ["zh-CN"]` | 默认中文 |
| **Presets** | `classic`（docs + blog + theme + sitemap） | 经典预设打包所有常用插件 |
| **docs 插件** | `sidebarPath`、`editUrl`、`remarkPlugins: [remarkMath]`、`rehypePlugins: [rehypeKatex]` | 侧边栏路径、编辑链接、数学公式 |
| **blog 插件** | `showReadingTime`、`readingTime`（300 字/分钟）、`feedOptions`（RSS+Atom） | 阅读时长、订阅源 |
| **Markdown** | `mermaid: true`、`onBrokenMarkdownLinks: "warn"` | Mermaid 图表 |
| **themeConfig** | 暗色模式默认、navbar、footer、prism、TOC | 主题定制 |
| **stylesheets** | KaTeX CSS（CDN，含 SRI 完整性校验） | 数学公式样式 |

#### 2.4.2 `sidebars.ts`

定义两个侧边栏，分别对应导航栏中的「Prompt」和「Skills」入口：

- **`promptSidebar`** — 顶层分类「Prompt Library」，链接到 `prompt/intro`，下设 6 个子分类
- **`skillsSidebar`** — 顶层分类「Skills Library」，链接到 `skills/intro`，下设 6 个子分类

每个子分类使用 `link: { type: "doc", id: "xxx/index" }` 绑定一个索引文档作为分类落地页。

#### 2.4.3 `package.json` 脚本

| 脚本 | 作用 |
|------|------|
| `npm run start` | 启动开发服务器（先执行 `prestart` 生成统计数据） |
| `npm run build` | 生产构建（先执行 `prebuild` 生成统计数据） |
| `npm run serve` | 本地预览构建产物 |
| `npm run clear` | 清理 Docusaurus 缓存（`.docusaurus` 目录） |
| `npm run typecheck` | TypeScript 类型检查 |
| `npm run write-translations` | 提取待翻译文本 |
| `npm run write-heading-ids` | 为 Markdown 标题生成锚点 ID |
| `npm run swizzle` | 定制主题组件 |

### 2.5 核心组件交互关系

首页（`src/pages/index.tsx`）由 5 个组件组合而成，数据流如下：

```
src/pages/index.tsx (Home)
  │
  ├── HeroSection.tsx
  │     └── 读取 src/data/stats.json → 展示文章数/Prompt数/Skills数
  │
  ├── FeaturedArticles.tsx
  │     └── 读取 src/data/recent-posts.json → 展示最近 3 篇文章卡片
  │
  ├── PromptLibrary.tsx
  │     └── 硬编码 hotPrompts 数组（6 个）→ 展示热门 Prompt 卡片
  │
  ├── SkillsLibrary.tsx
  │     └── 硬编码 hotSkills 数组（6 个）→ 展示热门 Skills 卡片
  │
  └── FooterCTA.tsx
        └── 静态 CTA → GitHub / Email 链接
```

**数据自动生成机制**：

`scripts/build-stats.js` 在 `prestart` / `prebuild` 钩子中执行，负责：

1. 统计 `blog/` 下的文章目录数量 → `stats.articles`
2. 统计 `docs/prompt/` 下的 `.mdx` 文件数量 → `stats.prompts`
3. 统计 `docs/skills/` 下的 `.mdx` 文件数量 → `stats.skills`
4. 解析每篇博客文章的 `index.md` frontmatter（title、date、slug、tags、description）
5. 查找文章目录内的第一张图片（.png/.jpg/.jpeg/.webp/.gif），复制到 `static/img/blog-covers/` 作为封面
6. 按日期倒序取最近 3 篇 → 写入 `src/data/recent-posts.json`

输出的 `stats.json` 与 `recent-posts.json` 被 `HeroSection` 和 `FeaturedArticles` 组件 import 使用，实现首页内容的自动更新。

### 2.6 样式系统

项目采用分层样式架构：

1. **Infima 基础层** — Docusaurus 内置的 CSS 框架，提供网格、按钮、卡片等基础组件样式
2. **CSS 变量覆盖层**（`src/css/custom.css`） — 通过覆盖 `--ifm-color-primary` 等变量定义品牌色（主色 `#6366f1` 靛蓝 / 暗色模式 `#818cf8`）
3. **AI Hub 设计系统**（`src/css/custom.css`） — 自定义 `--ai-*` 系列令牌（背景、边框、阴影、渐变等），构成完整的设计语言
4. **CSS Modules** — 每个首页组件配套 `.module.css`，实现组件级样式隔离

全局样式还包含：navbar 毛玻璃效果、GitHub 图标 mask、Footer 暗色适配、代码块样式、卡片通用类（`.ai-card`、`.ai-badge`、`.ai-gradient-text`）、自定义滚动条。

---

## 3. 使用说明

### 3.1 环境要求

| 要求 | 最低版本 | 验证命令 |
|------|----------|----------|
| Node.js | >= 20.0 | `node -v` |
| npm | 随 Node 安装 | `npm -v` |
| Git | 任意 | `git --version` |

### 3.2 环境配置与安装步骤

#### 步骤 1：克隆仓库

```bash
git clone https://github.com/lbytsl/dream-website.git
cd dream-website
```

#### 步骤 2：安装依赖

```bash
npm install
```

> 依赖包括：`@docusaurus/core`、`@docusaurus/preset-classic`、`@docusaurus/faster`、`@docusaurus/theme-mermaid`、`react`、`react-dom`、`prism-react-renderer`、`remark-math`、`rehype-katex`、`katex`、`clsx` 等。

#### 步骤 3：验证安装

```bash
npm run typecheck
```

### 3.3 启动流程

#### 开发模式（热重载）

```bash
npm run start
```

执行流程：
1. `prestart` 钩子运行 `node scripts/build-stats.js` → 生成 `src/data/stats.json` 和 `src/data/recent-posts.json`
2. `docusaurus start` 启动开发服务器
3. 浏览器自动打开 `http://localhost:3000`
4. 修改文件后页面热重载（修改 `docusaurus.config.ts` 需重启）

#### 生产构建

```bash
npm run build
```

执行流程：
1. `prebuild` 钩子运行统计脚本
2. `docusaurus build` 生成静态文件到 `build/` 目录
3. 输出可部署到任意静态托管服务的内容

#### 预览构建产物

```bash
npm run serve
```

在 `http://localhost:3000` 预览 `build/` 目录的构建结果。

#### 清理缓存

遇到构建异常时执行：

```bash
npm run clear
```

清理 `.docusaurus` 缓存目录后重新 `build`。

### 3.4 部署

#### GitHub Pages 部署

站点配置为部署到 `https://lbytsl.github.io/dream-website`：

```bash
# 使用 SSH
USE_SSH=true npm run deploy

# 使用 HTTPS
GIT_USER=lbytsl npm run deploy
```

`docusaurus deploy` 会自动：构建站点 → 推送到 `gh-pages` 分支 → GitHub Pages 上线。

#### 其他平台

`build/` 目录可部署到 Netlify、Vercel、Cloudflare Pages 等任意静态托管服务。注意 `baseUrl` 需匹配部署路径。

### 3.5 核心功能操作指南

#### 浏览 Prompt 模板

1. 点击导航栏「Prompt」 → 进入 Prompt Library 首页
2. 左侧侧边栏展示 6 个分类（ChatGPT、Claude、Gemini、Codex/Cursor、Dify、RAGFlow）
3. 点击分类展开子文档列表
4. 每篇 Prompt 文档包含：标题、介绍、适用模型、Prompt 内容（可复制代码块）、示例、注意事项

#### 浏览 Skills 工具

1. 点击导航栏「Skills」 → 进入 Skills Library 首页
2. 左侧侧边栏展示 6 个分类（PromptOps、Knowledge Base、RAG、Dify、Coding、PPT）
3. 每篇 Skills 文档包含：简介、README、安装配置、Prompt 定义、工作流、示例

#### 阅读博客

1. 点击导航栏「文章」 → 进入博客列表
2. 博客按日期倒序排列，展示封面、标签、阅读时长
3. 支持按标签筛选（`/tags/`）和按作者浏览（`/authors/`）
4. 支持 RSS 订阅（`/blog/rss.xml`）和 Atom 订阅（`/blog/atom.xml`）

#### 搜索（预留）

`docusaurus.config.ts` 中预留了 Algolia DocSearch 配置（已注释），启用时需填入 `appId`、`apiKey`、`indexName`。

#### 国际化

当前仅配置中文（`zh-CN`）。如需新增英文：

```bash
# 1. 在 docusaurus.config.ts 的 i18n.locales 添加 "en"
# 2. 提取待翻译文本
npm run write-translations -- --locale en
# 3. 启动英文版开发服务器
npm run start:en
# 4. 构建英文版
docusaurus build --locale en
```

---

## 4. 文章添加指南

### 4.1 博客文章添加规范

#### 4.1.1 目录结构

每篇博客文章独立存放在 `blog/` 下的一个目录中，目录名即文章 slug：

```
blog/
└── my-new-article/          # 目录名 = slug（建议使用英文短横线命名）
    ├── index.md             # 文章正文（Markdown，必须存在）
    └── my-cover.png         # 封面图（可选，第一张图片被自动提取）
```

> **命名规范**：建议使用 `YYYY-MM-DD-title` 格式命名目录（如 `2026-07-29-promptops`），便于按日期排序。也可使用简洁的英文 slug（如 `PromptOps`）。

#### 4.1.2 Frontmatter 规范

每篇 `index.md` 必须包含以下 frontmatter（YAML 头部，用 `---` 包裹）：

```markdown
---
slug: my-article              # URL 路径（/blog/my-article），省略则用目录名
title: 文章标题                # 显示标题（必填）
authors: [lbytsl]             # 作者（引用 authors.yml 中定义的 key，必填）
tags: [prompt-engineering, rag]  # 标签（引用 tags.yml 中定义的 key）
date: 2026-07-30              # 发布日期（YYYY-MM-DD 格式，必填）
description: 文章摘要描述      # 用于 SEO 和列表展示
---

正文内容开始...

{/* truncate */}

正文继续（truncate 标记之后的内容在列表页折叠，点击「阅读更多」展开）
```

**字段说明**：

| 字段 | 必填 | 说明 |
|------|------|------|
| `slug` | 否 | 自定义 URL。省略时使用目录名 |
| `title` | 是 | 文章标题 |
| `authors` | 是 | 数组，元素需在 `blog/authors.yml` 中定义 |
| `tags` | 否 | 数组，元素需在 `blog/tags.yml` 中定义 |
| `date` | 是 | 发布日期，`YYYY-MM-DD` 格式 |
| `description` | 否 | 文章摘要，用于列表页和 SEO |

#### 4.1.3 作者定义（`blog/authors.yml`）

新增作者时在此文件添加：

```yaml
lbytsl:
  name: lbytsl              # 显示名称
  title: AI全栈开发工程师  # 头衔
  url: https://github.com/lbytsl  # 主页链接
  image_url: https://github.com/lbytsl.png  # 头像 URL
  page: true                 # 是否生成作者专属页面（/blog/authors/lbytsl）
  socials:
    github: lbytsl           # GitHub 用户名
```

#### 4.1.4 标签定义（`blog/tags.yml`）

新增标签时在此文件添加：

```yaml
my-tag:
  label: My Tag              # 显示名称
  permalink: /my-tag         # 标签页面 URL（/blog/tags/my-tag）
  description: 标签描述        # 标签描述
```

当前已定义的标签：

| 标签 Key | Label | 用途 |
|----------|-------|------|
| `ai-engineering` | AI Engineering | AI 工程实践 |
| `prompt-engineering` | Prompt Engineering | Prompt 工程 |
| `rag` | RAG | 检索增强生成 |
| `tools` | Tools | AI 工具推荐 |
| `tutorial` | Tutorial | AI 开发教程 |
| `promptops` | PromptOps | Prompt 质量工程 |

#### 4.1.5 封面图机制

- 将封面图放在文章目录内（与 `index.md` 同级），命名为任意 `.png`/`.jpg`/`.jpeg`/`.webp`/`.gif`
- 构建时 `scripts/build-stats.js` 自动将第一张图片复制到 `static/img/blog-covers/` 并重命名为 `{目录名}-cover{扩展名}`
- 封面图 URL 自动写入 `src/data/recent-posts.json` 的 `cover` 字段
- 首页 `FeaturedArticles` 组件读取此字段展示封面

#### 4.1.6 发布流程

1. 在 `blog/` 下创建文章目录（如 `blog/2026-07-30-my-article/`）
2. 编写 `index.md`，填写完整 frontmatter
3. 可选：放入封面图
4. 运行 `npm run start` 预览，检查 `http://localhost:3000/blog/my-article`
5. 如需新增作者或标签，编辑 `authors.yml` / `tags.yml`
6. 确认首页「最新文章」卡片已自动更新（统计脚本在 `prestart` 时运行）
7. 提交代码，推送后 GitHub Pages 自动部署

### 4.2 文档（Prompt/Skills）添加规范

#### 4.2.1 文件规范

- 文件格式：`.mdx`（支持 MDX，可导入 React 组件）
- Frontmatter 必填字段：`sidebar_position`（侧边栏排序）、`title`、`description`

```markdown
---
sidebar_position: 2
title: 文档标题
description: 文档描述（用于侧边栏提示和 SEO）
---

# 文档标题

正文内容...
```

#### 4.2.2 新增 Prompt 文档

1. 在 `docs/prompt/{分类}/` 下新建 `.mdx` 文件（如 `docs/prompt/chatgpt/new-prompt.mdx`）
2. 填写 frontmatter（`sidebar_position` 设为分类内的排序序号）
3. 如需在侧边栏显式控制顺序，编辑 `sidebars.ts` 的 `promptSidebar`，将新文档 ID 添加到对应分类的 `items` 数组
4. 分类首页 `index.mdx` 的「目录」列表中添加链接

#### 4.2.3 新增 Skills 文档

1. 在 `docs/skills/{分类}/` 下新建 `.mdx` 文件
2. 填写 frontmatter
3. 编辑 `sidebars.ts` 的 `skillsSidebar`
4. 分类首页 `index.mdx` 中添加链接

#### 4.2.4 新增分类

1. 在 `docs/prompt/` 或 `docs/skills/` 下新建目录
2. 创建 `index.mdx` 作为分类落地页（`sidebar_position: 1`）
3. 在 `sidebars.ts` 中添加 category 配置：

```typescript
{
  type: "category",
  label: "新分类名",
  link: { type: "doc", id: "prompt/new-category/index" },
  items: ["prompt/new-category/doc1", "prompt/new-category/doc2"],
}
```

4. 在 Prompt/Skills 库首页（`docs/prompt/intro.mdx` 或 `docs/skills/intro.mdx`）的「分类浏览」列表中添加链接

#### 4.2.5 内容编写建议

- **Prompt 文档**建议包含：标题、介绍、适用模型、Prompt 内容（用 ` ```text ` 代码块）、示例、注意事项
- **Skills 文档**建议包含：简介、README、安装配置、核心 Prompt、工作流、示例
- 内部链接使用相对路径（如 `[示例](../chatgpt/web-dev)`），构建时自动重写
- 组件导入使用 `@site` 别名（如 `import Foo from '@site/src/components/Foo'`）

---

## 5. Prompt 与 Skills 说明

### 5.1 Prompt Library 概览

Prompt Library 位于 `docs/prompt/`，共 **19 篇** `.mdx` 文档，覆盖 6 大主流模型/平台。侧边栏 ID 为 `promptSidebar`，导航栏入口为「Prompt」。

#### 5.1.1 ChatGPT 分类

| 文档 | 标题 | 说明 | 适用场景 |
|------|------|------|----------|
| `index.mdx` | ChatGPT Prompt | 分类首页，含目录和最佳实践 | 入口导航 |
| `web-dev.mdx` | Web 开发助手 | 全栈开发 Prompt 模板（React/TS/Node） | 前端/全栈代码生成 |
| `writing.mdx` | 写作助手 | 内容写作 Prompt 模板 | 文案、长文创作 |
| `data-analysis.mdx` | 数据分析助手 | 数据分析与可视化 Prompt | 数据清洗、统计、图表 |

**触发条件**：面向 OpenAI ChatGPT（GPT-4/GPT-4o/GPT-4 Turbo）模型。
**参数配置**：通过 `sidebar_position: 1-4` 控制侧边栏顺序。
**应用场景**：Web 开发代码生成、技术文档写作、数据清洗与可视化分析。

#### 5.1.2 Claude 分类

| 文档 | 标题 | 说明 | 适用场景 |
|------|------|------|----------|
| `index.mdx` | Claude Prompt | 分类首页 | 入口导航 |
| `long-form.mdx` | Long-form Content Writer | 结构化长文写作 Prompt | 技术报告、长篇分析 |
| `code-review.mdx` | Code Review Expert | 代码审查 Prompt（安全/性能/风格） | 代码质量把关 |

**触发条件**：面向 Anthropic Claude（Claude 3.5 Sonnet 等）模型。
**应用场景**：高质量长文生成、专业级代码审查。

#### 5.1.3 Gemini 分类

| 文档 | 标题 | 说明 | 适用场景 |
|------|------|------|----------|
| `index.mdx` | Gemini Prompt | 分类首页 | 入口导航 |
| `multimodal.mdx` | Multimodal | 多模态处理 Prompt | 图文理解、跨模态推理 |

**触发条件**：面向 Google Gemini 系列模型。
**应用场景**：图像理解、多模态推理任务。

#### 5.1.4 Codex / Cursor 分类

| 文档 | 标题 | 说明 | 适用场景 |
|------|------|------|----------|
| `index.mdx` | Codex / Cursor Prompt | 分类首页 | 入口导航 |
| `generation.mdx` | Code Generation | 代码生成 System Prompt | 项目脚手架、组件生成 |
| `debugging.mdx` | Debugging | 调试与问题排查 Prompt | 错误定位、修复建议 |

**触发条件**：面向 OpenAI Codex 和 Cursor 等 AI 编程工具。
**应用场景**：AI 辅助编程、自动代码生成、智能调试。

#### 5.1.5 Dify 分类

| 文档 | 标题 | 说明 | 适用场景 |
|------|------|------|----------|
| `index.mdx` | Dify Prompt | 分类首页 | 入口导航 |
| `workflow.mdx` | Workflow Builder | Dify 工作流设计 Prompt | 复杂业务逻辑编排 |
| `agent.mdx` | Agent | Dify Agent 构建 Prompt | 智能体开发 |

**触发条件**：面向 Dify 平台（LLM 应用开发平台）。
**应用场景**：工作流编排、Agent 开发、工具集成。

#### 5.1.6 RAGFlow 分类

| 文档 | 标题 | 说明 | 适用场景 |
|------|------|------|----------|
| `index.mdx` | RAGFlow Prompt | 分类首页 | 入口导航 |
| `knowledge-base.mdx` | Knowledge Base | 知识库构建 Prompt | 文档解析、分块、索引 |
| `query.mdx` | Query | 知识库问答 Prompt | 检索增强问答 |

**触发条件**：面向 RAGFlow（检索增强生成平台）。
**应用场景**：企业知识库构建、RAG 问答系统。

### 5.2 Skills Library 概览

Skills Library 位于 `docs/skills/`，共 **19 篇** `.mdx` 文档，覆盖 6 大 AI 能力领域。侧边栏 ID 为 `skillsSidebar`，导航栏入口为「Skills」。

#### 5.2.1 PromptOps

| 文档 | 标题 | 说明 |
|------|------|------|
| `index.mdx` | PromptOps | 分类首页，简介 + 目录 |
| `getting-started.mdx` | 快速开始 | 安装配置 + 基本使用（创建/测试/部署 Prompt） |
| `workflow.mdx` | Workflow | 工作流说明 |

**定义**：将 DevOps 理念应用于 Prompt 工程，提供完整的 Prompt 生命周期管理（创建 → 测试 → 版本控制 → 部署）。
**触发条件**：需要对 Prompt 进行工程化管理、A/B 测试、自动化评估、CI/CD 集成时使用。
**参数配置**：Prompt 以 YAML 格式定义，包含 `name`、`version`、`model`、`description`、`template` 字段。
**应用场景**：
- RAG 系统 Prompt 质量保障
- AI Agent 的 System Prompt 版本管理
- Prompt 回归测试与发布门禁
- 关联开源项目：[skills-promptops](https://github.com/lbytsl/skills-promptops)

> **核心工作流**：`Design → Evaluate → Improve → Compare → Test → Release Gate`

#### 5.2.2 Knowledge Base

| 文档 | 标题 | 说明 |
|------|------|------|
| `index.mdx` | Knowledge Base | 分类首页 |
| `rag.mdx` | RAG | 知识库与 RAG 集成 |
| `vector-store.mdx` | Vector Store | 向量存储配置 |

**定义**：企业知识库构建与管理 Skill，支持自动化文档解析和分块。
**触发条件**：需要构建企业级知识库、管理文档分块策略、配置向量存储时使用。
**应用场景**：企业文档知识管理、RAG 系统数据层搭建、向量数据库选型与配置。

#### 5.2.3 RAG

| 文档 | 标题 | 说明 |
|------|------|------|
| `index.mdx` | RAG | 分类首页 |
| `basic.mdx` | Basic | RAG 基础流程 |
| `advanced.mdx` | Advanced | RAG 进阶技术 |

**定义**：端到端 RAG 管道 Skill，覆盖文档摄取、嵌入（Embedding）、检索（Retrieval）、生成（Generation）全流程。
**触发条件**：需要实现检索增强生成系统时使用。
**应用场景**：知识库问答、文档智能检索、上下文增强生成。

#### 5.2.4 Dify

| 文档 | 标题 | 说明 |
|------|------|------|
| `index.mdx` | Dify | 分类首页 |
| `chatflow.mdx` | Chatflow | Dify 对话流构建 |
| `plugins.mdx` | Plugins | Dify 插件开发 |

**定义**：Dify 自定义插件与工具开发 Skill，扩展 Dify 平台能力。
**触发条件**：需要在 Dify 平台上开发自定义插件、工具集成、对话流编排时使用。
**应用场景**：Dify 插件开发、对话流设计、工具能力扩展。

#### 5.2.5 Coding

| 文档 | 标题 | 说明 |
|------|------|------|
| `index.mdx` | Coding | 分类首页 |
| `code-review.mdx` | Code Review | AI 自动代码审查 |
| `test-gen.mdx` | Test Gen | AI 测试用例生成 |

**定义**：AI 辅助编程与审查 Skill，覆盖代码安全、性能、最佳实践检查与测试生成。
**触发条件**：需要进行自动化代码审查、生成单元测试时使用。
**应用场景**：CI/CD 代码质量门禁、测试用例自动生成、代码风格审查。

#### 5.2.6 PPT

| 文档 | 标题 | 说明 |
|------|------|------|
| `index.mdx` | PPT | 分类首页 |
| `design.mdx` | Design | PPT 设计生成 |
| `automation.mdx` | Automation | PPT 自动化流程 |

**定义**：AI 驱动的演示文稿生成 Skill，从大纲到成品幻灯片的自动化流程。
**触发条件**：需要快速生成演示文稿、自动化 PPT 制作时使用。
**应用场景**：技术分享演示、产品方案 PPT、培训材料制作。

### 5.3 Prompt 与 Skills 的区别

| 维度 | Prompt Library | Skills Library |
|------|----------------|----------------|
| **定位** | 可直接复制的 Prompt 模板 | 可复用的 AI 能力模块 |
| **内容** | 单段 Prompt 文本 + 使用说明 | 完整工作流（安装、配置、Prompt、示例） |
| **粒度** | 面向具体任务的一段对话 | 面向完整能力的工作流 |
| **使用方式** | 复制 Prompt → 粘贴到对话框 | 安装 Skill → 集成到 Agent/工作流 |
| **侧边栏** | `promptSidebar` | `skillsSidebar` |
| **文档数** | 19 篇 | 19 篇 |

### 5.4 首页热门卡片配置

首页的「热门 Prompt」和「热门 Skills」卡片为**硬编码**在组件中的数组，需手动维护：

- **`src/components/homepage/PromptLibrary.tsx`** 中的 `hotPrompts` 数组（6 个条目）
- **`src/components/homepage/SkillsLibrary.tsx`** 中的 `hotSkills` 数组（6 个条目）

每个卡片对象包含：`name`、`model`/`hasGitHub`、`category`、`description`、`href`（指向对应文档路径）。

更新热门卡片时，修改对应数组中条目的 `href` 指向新增的文档路径即可。

---

## 附录

### A. 常用命令速查

| 命令 | 作用 |
|------|------|
| `npm run start` | 启动开发服务器（localhost:3000，热重载） |
| `npm run build` | 生产构建（输出到 `build/`） |
| `npm run serve` | 预览构建产物 |
| `npm run clear` | 清理缓存 |
| `npm run typecheck` | TypeScript 类型检查 |
| `npm run write-translations` | 提取待翻译文本 |
| `npm run write-heading-ids` | 为标题生成锚点 ID |
| `npm run swizzle` | 定制主题组件 |
| `USE_SSH=true npm run deploy` | 部署到 GitHub Pages（SSH） |

### B. 关键文件路径速查

| 文件 | 作用 |
|------|------|
| `docusaurus.config.ts` | 站点配置 |
| `sidebars.ts` | 侧边栏定义 |
| `src/css/custom.css` | 全局样式 |
| `src/pages/index.tsx` | 首页 |
| `src/pages/about.tsx` | 关于页 |
| `blog/authors.yml` | 作者定义 |
| `blog/tags.yml` | 标签定义 |
| `scripts/build-stats.js` | 统计脚本 |
| `src/data/stats.json` | 站点统计数据（自动生成） |
| `src/data/recent-posts.json` | 最近文章（自动生成） |

### C. 设计令牌速查

| 令牌 | 亮色模式 | 暗色模式 |
|------|----------|----------|
| `--ifm-color-primary` | `#6366f1` | `#818cf8` |
| `--ai-bg-primary` | `#f8fafc` | `#0f172a` |
| `--ai-bg-card` | `#ffffff` | `rgba(30,41,59,0.8)` |
| `--ai-border` | `#e2e8f0` | `#334155` |
| `--ai-accent` | `#6366f1` | - |
| `--ai-gradient` | `linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)` | 同左 |

---

> **文档版本**：1.0  
> **最后更新**：2026-07-30  
> **项目仓库**：[https://github.com/lbytsl/dream-website](https://github.com/lbytsl/dream-website)  
> **作者**：Dream（lbytsl）
