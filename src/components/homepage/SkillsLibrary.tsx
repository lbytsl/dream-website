import React from "react";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import styles from "./SkillsLibrary.module.css";

const hotSkills = [
  {
    name: "质量审计",
    description: "证据化评分，识别幻觉、冲突、漂移、注入等风险。覆盖规格、依据、控制、适配、验证五个维度。",
    href: "/docs/skills/prompt-ops/quality-audit",
  },
  {
    name: "安全优化",
    description: "保持任务意图和接口不变，按风险优先级优化，产出逐项变更记录和预期影响说明。",
    href: "/docs/skills/prompt-ops/optimization",
  },
  {
    name: "版本比较",
    description: "同一基线对比多个版本，检测能力回退、兼容性破坏和新阻塞项，给出明确迁移建议。",
    href: "/docs/skills/prompt-ops/comparison",
  },
  {
    name: "测试与发布",
    description: "生成典型、边界、对抗、回归四类用例，定义断言，执行发布门禁检查。",
    href: "/docs/skills/prompt-ops/testing",
  },
  {
    name: "Prompt 设计",
    description: "从需求出发，七步构建法产出角色、目标、约束、输出契约和验收标准。",
    href: "/docs/skills/prompt-ops/design",
  },
  {
    name: "开源仓库",
    description: "纯 Markdown、无专有依赖，支持 Claude Code / Codex / Trae / WorkBuddy，Apache 2.0 许可证。",
    href: "https://github.com/lbytsl/skills-promptops",
    isExternal: true,
  },
];

function SkillCard({ skill }: { skill: (typeof hotSkills)[0] }) {
  return (
    <Link to={skill.href} className={styles.card}>
      <div className={styles.cardIcon}>
        {skill.name === "质量审计" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        {skill.name === "安全优化" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        )}
        {skill.name === "版本比较" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        )}
        {skill.name === "测试与发布" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        )}
        {skill.name === "Prompt 设计" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        )}
        {skill.name === "开源仓库" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        )}
      </div>
      <h3 className={styles.cardName}>{skill.name}</h3>
      <p className={styles.cardDesc}>{skill.description}</p>
      {skill.isExternal && (
        <span className={styles.cardGitHub}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          开源仓库
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
          <Translate id="home.skillsLibrary.title">PromptOps 核心能力</Translate>
        </h2>
        <p className={styles.sectionSubtitle}>
          <Translate id="home.skillsLibrary.subtitle">
            开放标准 Skill，将 Prompt 从一次性文案升级为可评估、可测试、可比较、可发布的工程资产
          </Translate>
        </p>

        <div className={styles.grid}>
          {hotSkills.map((skill, idx) => (
            <SkillCard key={idx} skill={skill} />
          ))}
        </div>

        <div className={styles.cta}>
          <Link className="button button--secondary button--lg" to="/docs/skills/intro">
            <Translate id="home.skillsLibrary.viewAll">查看完整教程 →</Translate>
          </Link>
        </div>
      </div>
    </section>
  );
}
