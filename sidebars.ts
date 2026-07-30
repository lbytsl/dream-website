import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  // Prompt 模块
  promptSidebar: [
    {
      type: "category",
      label: "Prompt Library",
      link: {
        type: "doc",
        id: "prompt/intro",
      },
      items: [
        {
          type: "category",
          label: "绘图提示词",
          link: {
            type: "doc",
            id: "prompt/painting/index",
          },
          items: [
            "prompt/painting/minimal-doodle-infographic/index",
            "prompt/painting/vintage-sketch-poster/index",
            "prompt/painting/clay-3d-infographic/index",
            "prompt/painting/exploded-view/index",
            "prompt/painting/whiteboard-explainer/index",
            "prompt/painting/livestream-screenshot/index",
            "prompt/painting/xiaohongshu-pop-art-cover/index",
            "prompt/painting/city-window-poster/index",
            "prompt/painting/anime-character-sheet/index",
            "prompt/painting/character-relationship-map/index",
          ],
        },
        {
          type: "category",
          label: "文本提示词",
          link: {
            type: "doc",
            id: "prompt/text/index",
          },
          items: [
            "prompt/text/travel-itinerary/index",
            "prompt/text/classical-naming/index",
            "prompt/text/vocabulary-learning/index",
            "prompt/text/exam-tutoring/index",
            "prompt/text/legal-issue-analysis/index",
            "prompt/text/text-similarity-rewrite/index",
            "prompt/text/thirty-day-learning-plan/index",
            "prompt/text/structured-explanation/index",
            "prompt/text/brand-positioning-slogan/index",
            "prompt/text/ielts-band-comparison/index",
          ],
        },
      ],
    },
  ],

  // Skills 模块
  skillsSidebar: [
    {
      type: "category",
      label: "Skills Library",
      link: {
        type: "doc",
        id: "skills/intro",
      },
      items: [
        {
          type: "category",
          label: "发现与自动化",
          link: {
            type: "generated-index",
            title: "发现与自动化",
            description: "Skill 搜索与浏览器自动化工具",
            slug: "/skills/discovery",
          },
          items: [
            "skills/discovery/find-skills/index",
            "skills/discovery/agent-browser/index",
          ],
        },
        {
          type: "category",
          label: "设计与前端",
          link: {
            type: "generated-index",
            title: "设计与前端",
            description: "界面创作、设计审查与前端体验优化",
            slug: "/skills/design",
          },
          items: [
            "skills/design/frontend-design/index",
            "skills/design/web-design-guidelines/index",
          ],
        },
        {
          type: "category",
          label: "工程质量",
          link: {
            type: "generated-index",
            title: "工程质量",
            description: "Prompt 工程、代码架构、React 性能与测试驱动开发",
            slug: "/skills/engineering",
          },
          items: [
            "skills/engineering/react-best-practices/index",
            "skills/engineering/improve-codebase-architecture/index",
            "skills/engineering/tdd/index",
            {
              type: "category",
              label: "PromptOps",
              link: { type: "doc", id: "skills/engineering/prompt-ops/index" },
              items: [
                "skills/engineering/prompt-ops/quickstart",
                "skills/engineering/prompt-ops/quality-audit",
                "skills/engineering/prompt-ops/optimization",
                "skills/engineering/prompt-ops/comparison",
                "skills/engineering/prompt-ops/testing",
                "skills/engineering/prompt-ops/design",
              ],
            },
          ],
        },
        {
          type: "category",
          label: "云与创意",
          link: {
            type: "generated-index",
            title: "云与创意",
            description: "Azure AI、图像生成与程序化视频",
            slug: "/skills/cloud-creative",
          },
          items: [
            "skills/cloud/microsoft-foundry/index",
            "skills/creative/ai-image-generation/index",
            "skills/creative/remotion-best-practices/index",
          ],
        },
      ],
    },
  ],
};

export default sidebars;
