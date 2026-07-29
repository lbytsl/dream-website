import React from "react";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import styles from "./SkillsLibrary.module.css";

const hotSkills = [
  {
    name: "PromptOps",
    description: "Prompt engineering workflow and version management, supporting A/B testing and evaluation.",
    href: "/docs/skills/prompt-ops",
    hasGitHub: true,
  },
  {
    name: "Knowledge Base",
    description: "Build and manage enterprise knowledge bases with automated document parsing and chunking.",
    href: "/docs/skills/knowledge-base",
  },
  {
    name: "RAG Pipeline",
    description: "End-to-end RAG pipeline: document ingestion, embedding, retrieval, and generation.",
    href: "/docs/skills/rag",
  },
  {
    name: "Dify Plugin Dev",
    description: "Custom Dify plugins and tools development to extend platform capabilities.",
    href: "/docs/skills/dify",
  },
  {
    name: "AI Code Review",
    description: "Automated code review with AI, covering security, performance, and best practices.",
    href: "/docs/skills/coding",
  },
  {
    name: "PPT Automation",
    description: "AI-powered presentation generation from outlines to polished slides.",
    href: "/docs/skills/ppt",
  },
];

function SkillCard({ skill }: { skill: (typeof hotSkills)[0] }) {
  return (
    <Link to={skill.href} className={styles.card}>
      <div className={styles.cardIcon}>
        {skill.name === "PromptOps" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        )}
        {skill.name === "Knowledge Base" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        )}
        {skill.name === "RAG Pipeline" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        )}
        {skill.name === "Dify Plugin Dev" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        )}
        {skill.name === "AI Code Review" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="16 3 21 3 21 8" />
            <line x1="4" y1="20" x2="21" y2="3" />
            <polyline points="21 16 21 21 16 21" />
            <line x1="15" y1="15" x2="21" y2="21" />
            <line x1="4" y1="4" x2="9" y2="9" />
          </svg>
        )}
        {skill.name === "PPT Automation" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
        )}
        {!["PromptOps", "Knowledge Base", "RAG Pipeline", "Dify Plugin Dev", "AI Code Review", "PPT Automation"].includes(skill.name) && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        )}
      </div>
      <h3 className={styles.cardName}>{skill.name}</h3>
      <p className={styles.cardDesc}>{skill.description}</p>
      {skill.hasGitHub && (
        <span className={styles.cardGitHub}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          GitHub
        </span>
      )}
    </Link>
  );
}

export default function SkillsLibrary(): React.ReactNode {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          <Translate id="home.skillsLibrary.title">热门 Skills</Translate>
        </h2>
        <p className={styles.sectionSubtitle}>
          <Translate id="home.skillsLibrary.subtitle">
            实用 AI Skills 工具集，提升开发效率
          </Translate>
        </p>

        <div className={styles.grid}>
          {hotSkills.map((skill, idx) => (
            <SkillCard key={idx} skill={skill} />
          ))}
        </div>

        <div className={styles.cta}>
          <Link className="button button--secondary button--lg" to="/docs/skills/intro">
            <Translate id="home.skillsLibrary.viewAll">探索全部 Skills →</Translate>
          </Link>
        </div>
      </div>
    </section>
  );
}
