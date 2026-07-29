# Dream Website 项目长期记忆

## 项目基本信息
- **项目名**：dream-website（AI Developer Hub）
- **作者**：Dream（lbytsl），GitHub: https://github.com/lbytsl，Email: 1012858748@qq.com
- **部署地址**：https://lbytsl.github.io（baseUrl: "/"，trailingSlash: false）
- **仓库**：https://github.com/lbytsl/dream-website

## 技术栈
- Docusaurus 3.10.2（@docusaurus/core + preset-classic + faster + theme-mermaid）
- React 19 + TypeScript ~6.0.2
- 数学公式：remark-math + rehype-katex + KaTeX CSS（CDN 0.16.9）
- 代码高亮：prism-react-renderer（GitHub 亮色 / Dracula 暗色）
- Node.js >= 20.0

## 目录与内容结构
- `docs/prompt/`：19 篇 MDX，6 分类（ChatGPT/Claude/Gemini/Codex-Cursor/Dify/RAGFlow），侧边栏 ID = promptSidebar
- `docs/skills/`：19 篇 MDX，6 分类（PromptOps/Knowledge-Base/RAG/Dify/Coding/PPT），侧边栏 ID = skillsSidebar
- `blog/`：一篇文章一个目录（index.md + 封面图），frontmatter 引用 authors.yml/tags.yml
- `src/components/homepage/`：5 个首页组件（HeroSection/FeaturedArticles/PromptLibrary/SkillsLibrary/FooterCTA）
- `src/data/`：stats.json + recent-posts.json（由 scripts/build-stats.js 在 prestart/prebuild 自动生成）
- `src/css/custom.css`：全局样式，AI Hub 设计系统（--ai-* 变量），主色 #6366f1（亮）/ #818cf8（暗）
- **CSS 约定**：内联代码样式必须用 `:not(pre) > code` 选择器，不能用 `code {}` 或 `pre code {}`，否则会覆盖 Docusaurus 代码块 CSS module 样式导致边框/圆角/间距异常

## 内容规范
- 博客 frontmatter 必填：title、authors、date；可选：slug、tags、description
- 文档 frontmatter 必填：sidebar_position、title、description
- 博客封面图自动提取：build-stats.js 将文章目录内第一张图片复制到 static/img/blog-covers/
- tags.yml 已定义：ai-engineering/prompt-engineering/rag/tools/tutorial/promptops
- authors.yml 已定义：lbytsl

## 构建脚本
- `prestart`/`prebuild` 钩子运行 `node scripts/build-stats.js`
- 统计 blog 目录数（articles）、prompt mdx 数（prompts）、skills mdx 数（skills）
- 解析博客 frontmatter，按日期倒序取最近 3 篇写入 recent-posts.json

## 关联开源项目
- skills-promptops（Prompt 质量工程工作流）：https://github.com/lbytsl/skills-promptops
- sql_to_ER（ER 图生成工具，Vue）：https://github.com/lbytsl/sql_to_ER
