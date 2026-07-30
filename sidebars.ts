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
          label: "ChatGPT",
          link: { type: "doc", id: "prompt/chatgpt/index" },
          items: ["prompt/chatgpt/web-dev", "prompt/chatgpt/writing", "prompt/chatgpt/data-analysis"],
        },
        {
          type: "category",
          label: "Claude",
          link: { type: "doc", id: "prompt/claude/index" },
          items: ["prompt/claude/long-form", "prompt/claude/code-review"],
        },
        {
          type: "category",
          label: "Gemini",
          link: { type: "doc", id: "prompt/gemini/index" },
          items: ["prompt/gemini/multimodal"],
        },
        {
          type: "category",
          label: "Codex / Cursor",
          link: { type: "doc", id: "prompt/codex-cursor/index" },
          items: ["prompt/codex-cursor/generation", "prompt/codex-cursor/debugging"],
        },
        {
          type: "category",
          label: "Dify",
          link: { type: "doc", id: "prompt/dify/index" },
          items: ["prompt/dify/workflow", "prompt/dify/agent"],
        },
        {
          type: "category",
          label: "RAGFlow",
          link: { type: "doc", id: "prompt/ragflow/index" },
          items: ["prompt/ragflow/knowledge-base", "prompt/ragflow/query"],
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
          label: "PromptOps",
          link: { type: "doc", id: "skills/prompt-ops/index" },
          items: [
            "skills/prompt-ops/quickstart",
            "skills/prompt-ops/quality-audit",
            "skills/prompt-ops/optimization",
            "skills/prompt-ops/comparison",
            "skills/prompt-ops/testing",
            "skills/prompt-ops/design",
          ],
        },
      ],
    },
  ],
};

export default sidebars;
