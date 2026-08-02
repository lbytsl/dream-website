import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const config: Config = {
  title: "Dream — AI 开发前沿技术平台",
  tagline: "一站式 AI 开发技术博客：Prompt 工程 · RAG · Skills · MCP · LLM 实战",
  favicon: "img/avatar.jpg",

  future: {
    v4: true,
  },

  url: "https://dream.mindweave.top",
  baseUrl: "/",
  organizationName: "lbytsl",
  projectName: "dream-website",
  trailingSlash: false,

  onBrokenLinks: "warn",


  // ============================================================
  // 国际化 (i18n)
  // ============================================================
  i18n: {
    defaultLocale: "zh-CN",
    locales: ["zh-CN"],
    localeConfigs: {
      "zh-CN": {
        label: "中文",
        direction: "ltr",
        htmlLang: "zh-CN",
      },
    },
  },

  // ============================================================
  // Presets
  // ============================================================
  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/lbytsl/dream-website/tree/master/",
          showLastUpdateTime: false,
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: {
          showReadingTime: true,
          readingTime: ({ content, locale, defaultReadingTime }) =>
            defaultReadingTime({ content, locale, options: { wordsPerMinute: 300 } }),
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
            title: "Dream Blog",
            description: "AI 技术文章、Prompt 工程与开发实践",
            copyright: `Copyright © ${new Date().getFullYear()} Dream`,
          },
          editUrl: "https://github.com/lbytsl/dream-website/tree/master/",
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
        sitemap: {
          lastmod: "date",
          changefreq: "weekly",
          priority: 0.5,
          ignorePatterns: ["/tags/**", "/404"],
        },
      } satisfies Preset.Options,
    ],
  ],

  // ============================================================
  // headTags — 全局 <head> 标签注入 (hreflang, DNS prefetch 等)
  // ============================================================
  headTags: [
    // hreflang: 中文页面
    {
      tagName: "link",
      attributes: {
        rel: "alternate",
        hreflang: "zh-CN",
        href: "https://dream.mindweave.top",
      },
    },
    // hreflang: 默认回退
    {
      tagName: "link",
      attributes: {
        rel: "alternate",
        hreflang: "x-default",
        href: "https://dream.mindweave.top",
      },
    },
    // DNS 预解析
    {
      tagName: "link",
      attributes: {
        rel: "dns-prefetch",
        href: "https://cdn.jsdelivr.net",
      },
    },
    // ============ JSON-LD 结构化数据 ============
    // Organization
    {
      tagName: "script",
      attributes: { type: "application/ld+json" },
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Dream",
        "url": "https://dream.mindweave.top",
        "logo": "https://dream.mindweave.top/img/logo.jpg",
        "sameAs": ["https://github.com/lbytsl"],
        "description": "AI 开发前沿技术平台，专注 Prompt 工程、RAG、Skills 工具集与 LLM 实战",
      }),
    },
    // WebSite
    {
      tagName: "script",
      attributes: { type: "application/ld+json" },
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Dream - AI 开发技术平台",
        "url": "https://dream.mindweave.top",
        "description": "一站式 AI 开发技术博客：Prompt 工程 · RAG · Skills · MCP · LLM 实战",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://dream.mindweave.top/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      }),
    },
    // Person (Author)
    {
      tagName: "script",
      attributes: { type: "application/ld+json" },
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Dream (lbytsl)",
        "url": "https://dream.mindweave.top/about",
        "jobTitle": "AI 全栈开发工程师",
        "sameAs": [
          "https://github.com/lbytsl",
          "https://blog.csdn.net/weixin_68705666",
        ],
        "knowsAbout": [
          "Artificial Intelligence",
          "Prompt Engineering",
          "RAG (Retrieval-Augmented Generation)",
          "LangChain",
          "Spring AI",
          "MCP Protocol",
          "LLM Application Development",
        ],
      }),
    },
  ],

  // ============================================================
  // Plugins
  // ============================================================
  plugins: [],

  // ============================================================
  // Markdown
  // ============================================================
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  // ============================================================
  // Theme Config
  // ============================================================
  themeConfig: {
    // 社交分享卡片图片 (1200×630px PNG 推荐)
    image: "img/og-default.png",
    metadata: [
      // ============ 基础 SEO ============
      { name: "keywords", content: "AI, Prompt, Skills, Dify, RAG, LLM, MCP, AI工程, PromptOps, LangChain, Spring AI, Agent, 智能体" },
      { name: "author", content: "Dream (lbytsl)" },
      { name: "robots", content: "index, follow" },

      // ============ OpenGraph ============
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Dream - AI 开发技术平台" },
      { property: "og:locale", content: "zh_CN" },
      { property: "og:title", content: "Dream — AI 开发前沿技术平台 | Prompt · Skills · RAG · MCP" },
      { property: "og:description", content: "一站式 AI 开发技术博客：涵盖 Prompt 工程、RAG 知识库、Skills 工具集、MCP 协议与 LLM 实战。20+ Prompt 模板，11+ Skills 工具 ✓" },
      { property: "og:image", content: "https://dream.mindweave.top/img/og-default.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Dream - AI 开发前沿技术平台" },

      // ============ Twitter Card ============
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Dream — AI 开发前沿技术平台 | Prompt · Skills · RAG · MCP" },
      { name: "twitter:description", content: "一站式 AI 开发技术博客：涵盖 Prompt 工程、RAG 知识库、Skills 工具集、MCP 协议与 LLM 实战 ✓" },
      { name: "twitter:image", content: "https://dream.mindweave.top/img/og-default.png" },
      { name: "twitter:image:alt", content: "Dream - AI 开发前沿技术平台" },
    ],
    colorMode: {
      defaultMode: "dark",
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    // Algolia Search (reserved)
    // algolia: {
    //   appId: 'YOUR_APP_ID',
    //   apiKey: 'YOUR_SEARCH_API_KEY',
    //   indexName: 'YOUR_INDEX_NAME',
    //   contextualSearch: true,
    // },
    navbar: {
      title: "Dream",
      logo: {
        alt: "Dream Logo",
        src: "img/logo.jpg",
      },
      hideOnScroll: false,
      items: [
        {
          label: "首页",
          to: "/",
          position: "left",
          activeBaseRegex: "^/$",
        },
        {
          label: "文章",
          to: "/blog",
          position: "left",
        },
        {
          type: "docSidebar",
          sidebarId: "promptSidebar",
          label: "Prompt",
          position: "left",
        },
        {
          type: "docSidebar",
          sidebarId: "skillsSidebar",
          label: "Skills",
          position: "left",
        },
        {
          label: "关于我",
          to: "/about",
          position: "left",
        },
        {
          href: "https://github.com/lbytsl",
          position: "right",
          className: "header-github-link",
          "aria-label": "GitHub repository",
        },
      ],
    },
    footer: {
      links: [
        {
          title: "内容",
          items: [
            { label: "文章", to: "/blog" },
            { label: "Prompt", to: "/docs/prompt/intro" },
            { label: "Skills", to: "/docs/skills/intro" },
          ],
        },
        {
          title: "社区",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/lbytsl",
            },
            {
              label: "Email",
              href: "mailto:1012858748@qq.com",
            },
          ],
        },
        {
          title: "更多",
          items: [
            { label: "关于我", to: "/about" },
            { label: "GitHub", href: "https://github.com/lbytsl" },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Dream. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 5,
    },
  } satisfies Preset.ThemeConfig,

  // ============================================================
  // Stylesheets
  // ============================================================
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kpvGFasHpJhPmRb",
      crossorigin: "anonymous",
    },
  ],
};

export default config;
