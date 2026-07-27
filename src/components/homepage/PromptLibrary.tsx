import React from "react";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import styles from "./PromptLibrary.module.css";

const hotPrompts = [
  {
    name: "System Prompt - Expert Developer",
    model: "Claude • GPT-4",
    category: "Coding",
    description: "Expert software developer system prompt with deep reasoning and best practice guidance.",
    href: "/docs/prompt/codex-cursor/generation",
  },
  {
    name: "Long-form Content Writer",
    model: "Claude 3.5",
    category: "Writing",
    description: "Professional content writing prompt supporting structured long-form output.",
    href: "/docs/prompt/claude/long-form",
  },
  {
    name: "Data Analysis Assistant",
    model: "GPT-4 • Gemini",
    category: "Data Analysis",
    description: "Automated data analysis and visualization prompt with statistical capabilities.",
    href: "/docs/prompt/chatgpt/data-analysis",
  },
  {
    name: "Dify Workflow Builder",
    model: "Dify",
    category: "Workflow",
    description: "Efficient Dify workflow design prompt for complex business logic.",
    href: "/docs/prompt/dify/workflow",
  },
  {
    name: "RAG Knowledge Base QA",
    model: "RAGFlow",
    category: "RAG",
    description: "Knowledge base question-answering prompt optimized for retrieval-augmented generation.",
    href: "/docs/prompt/ragflow/query",
  },
  {
    name: "Code Review Expert",
    model: "Claude • Cursor",
    category: "Code Review",
    description: "Professional code review prompt covering security, performance, and style.",
    href: "/docs/prompt/claude/code-review",
  },
];

function PromptCard({
  prompt,
}: {
  prompt: (typeof hotPrompts)[0];
}) {
  return (
    <Link to={prompt.href} className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardBadge}>{prompt.category}</span>
        <span className={styles.cardModel}>{prompt.model}</span>
      </div>
      <h3 className={styles.cardName}>{prompt.name}</h3>
      <p className={styles.cardDesc}>{prompt.description}</p>
    </Link>
  );
}

export default function PromptLibrary(): React.ReactNode {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          <Translate id="home.promptLibrary.title">热门 Prompt</Translate>
        </h2>
        <p className={styles.sectionSubtitle}>
          <Translate id="home.promptLibrary.subtitle">
            精选高质量 Prompt 模板，覆盖主流模型与应用场景
          </Translate>
        </p>

        <div className={styles.grid}>
          {hotPrompts.map((prompt, idx) => (
            <PromptCard key={idx} prompt={prompt} />
          ))}
        </div>

        <div className={styles.cta}>
          <Link className="button button--secondary button--lg" to="/docs/prompt/intro">
            <Translate id="home.promptLibrary.viewAll">浏览全部 Prompt →</Translate>
          </Link>
        </div>
      </div>
    </section>
  );
}
