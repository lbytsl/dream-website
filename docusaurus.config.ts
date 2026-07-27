import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const config: Config = {
  title: "AI Developer Hub",
  tagline: "探索 AI 开发的前沿技术与实践",
  favicon: "img/favicon.ico",

  future: {
    v4: true,
  },

  url: "https://your-github-username.github.io",
  baseUrl: "/",
  organizationName: "your-github-username",
  projectName: "dream-website",
  trailingSlash: false,

  onBrokenLinks: "throw",


  // ============================================================
  // 国际化 (i18n)
  // ============================================================
  i18n: {
    defaultLocale: "zh-CN",
    locales: ["zh-CN", "en"],
    localeConfigs: {
      "zh-CN": {
        label: "中文",
        direction: "ltr",
        htmlLang: "zh-CN",
      },
      en: {
        label: "English",
        direction: "ltr",
        htmlLang: "en-US",
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
          editUrl: "https://github.com/your-github-username/dream-website/tree/main/",
          showLastUpdateTime: false,
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: {
          showReadingTime: true,
          readingTime: ({ content, frontMatter, defaultReadingTime }) =>
            defaultReadingTime({ content, options: { wordsPerMinute: 300 } }),
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
            title: "AI Developer Hub Blog",
            description: "AI 技术文章、Prompt 工程与开发实践",
            copyright: `Copyright © ${new Date().getFullYear()} AI Developer Hub`,
          },
          editUrl: "https://github.com/your-github-username/dream-website/tree/main/",
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
    // Replace with your project's social card
    image: "img/social-card.png",
    metadata: [
      { name: "keywords", content: "AI, Prompt, Skills, Dify, RAG, LLM, MCP, AI工程" },
      { name: "author", content: "AI Developer Hub" },
      { name: "twitter:card", content: "summary_large_image" },
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
      title: "AI Developer Hub",
      logo: {
        alt: "AI Developer Hub Logo",
        src: "img/logo.svg",
      },
      hideOnScroll: true,
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
          type: "localeDropdown",
          position: "right",
        },
        {
          href: "https://github.com/your-github-username",
          position: "right",
          className: "header-github-link",
          "aria-label": "GitHub repository",
        },
      ],
    },
    footer: {
      style: "dark",
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
              href: "https://github.com/your-github-username",
            },
            {
              label: "Email",
              href: "mailto:your-email@example.com",
            },
            {
              label: "RSS",
              to: "/blog/rss.xml",
            },
          ],
        },
        {
          title: "更多",
          items: [
            { label: "关于我", to: "/about" },
            { label: "GitHub", href: "https://github.com/your-github-username" },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AI Developer Hub. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        "python",
        "typescript",
        "javascript",
        "bash",
        "json",
        "yaml",
        "markdown",
        "sql",
      ],
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
