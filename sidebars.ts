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
            type: "doc",
            id: "skills/discovery/index",
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
            type: "doc",
            id: "skills/design/index",
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
            type: "doc",
            id: "skills/engineering/index",
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
            type: "doc",
            id: "skills/cloud-creative/index",
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
