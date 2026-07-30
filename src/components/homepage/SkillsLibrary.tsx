import React from "react";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import styles from "./SkillsLibrary.module.css";

const skillCategories = [
  {
    name: "发现与自动化",
    icon: "search",
    description: "Skill 搜索发现与浏览器自动化，让 AI Agent 具备网页交互能力。",
    skills: ["Find Skills", "Agent Browser"],
    href: "/docs/skills/discovery",
  },
  {
    name: "设计与前端",
    icon: "design",
    description: "AI 驱动的界面创作、设计审查与前端体验优化工具集。",
    skills: ["Frontend Design", "Web Design Guidelines"],
    href: "/docs/skills/design",
  },
  {
    name: "工程质量",
    icon: "code",
    description: "Prompt 工程化、代码架构治理、React 性能优化与测试驱动开发。",
    skills: ["PromptOps", "React Best Practices", "TDD", "Architecture"],
    href: "/docs/skills/engineering",
  },
  {
    name: "云与创意",
    icon: "cloud",
    description: "Azure AI 服务、AI 图像生成与程序化视频创作能力。",
    skills: ["Microsoft Foundry", "AI Image Gen", "Remotion"],
    href: "/docs/skills/cloud-creative",
  },
];

function SkillCard({ category }: { category: (typeof skillCategories)[0] }) {
  return (
    <Link to={category.href} className={styles.card}>
      <div className={styles.cardIcon}>
        {category.icon === "search" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        )}
        {category.icon === "design" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
        )}
        {category.icon === "code" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        )}
        {category.icon === "cloud" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />
          </svg>
        )}
      </div>
      <h3 className={styles.cardName}>{category.name}</h3>
      <p className={styles.cardDesc}>{category.description}</p>
      <div className={styles.cardTags}>
        {category.skills.map((skill) => (
          <span key={skill} className={styles.cardTag}>{skill}</span>
        ))}
      </div>
    </Link>
  );
}

export default function SkillsLibrary(): React.ReactNode {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          <Translate id="home.skillsLibrary.title">Skills 工具集</Translate>
        </h2>
        <p className={styles.sectionSubtitle}>
          <Translate id="home.skillsLibrary.subtitle">
            发现、设计、工程与云创意——四大分类覆盖 AI Agent 开发全流程
          </Translate>
        </p>

        <div className={styles.grid}>
          {skillCategories.map((category, idx) => (
            <SkillCard key={idx} category={category} />
          ))}
        </div>

        <div className={styles.cta}>
          <Link className="button button--secondary button--lg" to="/docs/skills/intro">
            <Translate id="home.skillsLibrary.viewAll">浏览全部 Skills →</Translate>
          </Link>
        </div>
      </div>
    </section>
  );
}
