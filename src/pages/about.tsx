import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import Translate from "@docusaurus/Translate";
import styles from "./about.module.css";

const techStack = [
  "Python", "TypeScript", "React", "Next.js", "Node.js",
  "LangChain", "LlamaIndex", "Dify", "RAGFlow",
  "PostgreSQL", "Redis", "Chroma", "Docker",
];

const openSourceProjects = [
  {
    name: "sql_to_ER",
    repo: "lbytsl/sql_to_ER",
    description: "ER 图生成工具",
    href: "https://github.com/lbytsl/sql_to_ER",
    language: "Vue",
  },
  {
    name: "skills-promptops",
    repo: "lbytsl/skills-promptops",
    description: "Prompt 质量工程工作流 — 设计、评估、改进、比较、测试与发布门禁",
    href: "https://github.com/lbytsl/skills-promptops",
    language: "Markdown",
  },
];

function TechIcon({ tech }: { tech: string }) {
  return <span className={styles.techBadge}>{tech}</span>;
}

function useGitHubStars(repo: string) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const key = `gh-stars-${repo}`;
    const ttl = 60 * 60 * 1000; // 1 小时

    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        const { v, ts } = JSON.parse(cached);
        if (Date.now() - ts < ttl) {
          setStars(v);
          return;
        }
      } catch {}
    }

    let cancelled = false;
    fetch(`https://api.github.com/repos/${repo}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d?.stargazers_count != null) {
          setStars(d.stargazers_count);
          localStorage.setItem(key, JSON.stringify({ v: d.stargazers_count, ts: Date.now() }));
        }
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [repo]);

  return stars;
}

function StarDisplay({ repo }: { repo: string }) {
  const stars = useGitHubStars(repo);

  if (stars === null) {
    return <span className={styles.projectStars}>--</span>;
  }

  return (
    <span className={styles.projectStars}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      {stars}
    </span>
  );
}

export default function About(): React.ReactNode {
  return (
    <Layout
      title="关于我"
      description="关于 Dream 的作者 - AI 开发者与技术写作者"
    >
      <main className={styles.page}>
        <div className={styles.container}>
          {/* Profile Header */}
          <section className={styles.profile}>
            <div className={styles.avatar}>
              <img src="/img/avatar.jpg" alt="Dream" className={styles.avatarImage} />
            </div>
            <h1 className={styles.name}>
              <Translate id="about.name">Dream</Translate>
            </h1>
            <p className={styles.title}>
              <Translate id="about.tagline">AI全栈开发工程师</Translate>
            </p>
            <p className={styles.bio}>
              <Translate id="about.bio">
                热爱 AI 技术和开源，专注于 Prompt Engineering、RAG 系统和 AI 工程实践。
                致力于通过技术文章和开源项目帮助更多开发者进入 AI 开发领域。
              </Translate>
            </p>

            <div className={styles.socialLinks}>
              <a href="https://github.com/lbytsl" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                GitHub
              </a>
              <a href="mailto:1012858748@qq.com" className={styles.socialLink}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Email
              </a>
            </div>
          </section>

          {/* Tech Stack */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Translate id="about.techStack.title">技术栈</Translate>
            </h2>
            <div className={styles.techGrid}>
              {techStack.map((tech) => (
                <TechIcon key={tech} tech={tech} />
              ))}
            </div>
          </section>

          {/* Open Source */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Translate id="about.oss.title">开源项目</Translate>
            </h2>
            <div className={styles.projectGrid}>
              {openSourceProjects.map((proj) => (
                <a
                  key={proj.name}
                  href={proj.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.projectCard}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.projectIcon}>
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  <div className={styles.projectInfo}>
                    <div className={styles.projectHeader}>
                      <h3 className={styles.projectName}>{proj.name}</h3>
                      <StarDisplay repo={proj.repo} />
                    </div>
                    <p className={styles.projectDesc}>{proj.description}</p>
                    <span className={styles.projectLang}>{proj.language}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Translate id="about.contact.title">联系方式</Translate>
            </h2>
            <p className={styles.contactText}>
              <Translate id="about.contact.desc">
                如果你对 AI 开发有兴趣，或者有合作想法，欢迎通过 GitHub 或 Email 联系我。
              </Translate>
            </p>
            <div className={styles.contactLinks}>
              <a href="https://github.com/lbytsl" target="_blank" rel="noopener noreferrer" className="button button--primary button--lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 8 }}>
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                GitHub
              </a>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
