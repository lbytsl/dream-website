import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import Translate from "@docusaurus/Translate";
import styles from "./about.module.css";

const skillCategories = [
  {
    title: "AI 工程化",
    items: [
      { name: "Spring AI", desc: "会话记忆、RAG 知识库、Tool Calling、MCP 协议" },
      { name: "LangChain / LangGraph", desc: "AI 工作流编排、多模型接入、Agent 任务链路" },
      { name: "Prompt Engineering", desc: "角色定义、思维链、少样本学习、结构化输出" },
      { name: "RAG 系统", desc: "知识库构建、向量检索、上下文增强、引用追溯" },
      { name: "Claude Agent SDK", desc: "对话式交互、工具调用、检查点快照、版本回退" },
    ],
  },
  {
    title: "后端技术",
    items: [
      { name: "Java + Spring Boot 3", desc: "企业级后端开发，Spring Cloud Alibaba 微服务架构" },
      { name: "Python + FastAPI", desc: "高性能 RESTful API 及 AI 应用后端服务" },
      { name: "MySQL + Redis", desc: "数据库设计、索引优化、缓存方案、消息队列" },
      { name: "Docker + Linux", desc: "容器化部署、服务器运维与环境管理" },
    ],
  },
  {
    title: "前端技术",
    items: [
      { name: "Vue 3 生态", desc: "Pinia、Element Plus、Vite，单页应用与后台管理系统" },
      { name: "React + TypeScript", desc: "组件化开发、Hooks、状态管理与类型安全" },
      { name: "UniApp 多端开发", desc: "微信小程序、Android/iOS 双端 APP 开发与上线" },
      { name: "Tailwind CSS", desc: "实用优先的 CSS 框架，高效构建现代化界面" },
    ],
  },
  {
    title: "工程能力",
    items: [
      { name: "RBAC 权限体系", desc: "动态权限、数据分级、SaaS 多租户架构" },
      { name: "支付集成", desc: "微信支付、支付宝开放平台，回调验签与安全防护" },
      { name: "实时通信", desc: "WebSocket、SSE 流式推送、Redis Streams 异步处理" },
      { name: "AI 辅助开发", desc: "Cursor、Trae、Claude Code、Codex 等工具深度使用" },
    ],
  },
];

const openSourceProjects = [
  {
    name: "sql_to_ER",
    repo: "lbytsl/sql_to_ER",
    description: "ER 图生成工具 — 支持 SQL 解析、批量导入、图形编辑与多种格式导出",
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

function useGitHubStars(repo: string) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const key = `gh-stars-${repo}`;
    const ttl = 60 * 60 * 1000;

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
      description="关于 Dream - 全栈 AI 开发者，专注于 AI 工程化与 Prompt 质量工程"
    >
      <main className={styles.page}>
        <div className={styles.container}>
          {/* Profile Header */}
          <section className={styles.profile}>
            <h1 className={styles.name}>
              <Translate id="about.name">Dream</Translate>
            </h1>
            <p className={styles.title}>
              <Translate id="about.tagline">全栈 AI 开发工程师</Translate>
            </p>
            <p className={styles.bio}>
              <Translate id="about.bio">
                软件工程本科毕业，Java 全栈开发 3 年经验，具备从需求分析、系统设计到部署运维的全链路落地能力。
                专注于 AI 工程化方向，擅长将大模型能力融入业务场景，构建具备 RAG 知识库、Tool Calling 和多模型协作能力的 AI 智能体系统。
              </Translate>
            </p>

            <div className={styles.socialLinks}>
              <a href="https://github.com/lbytsl" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                GitHub
              </a>
              <a href="https://blog.csdn.net/weixin_68705666" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                CSDN Blog
              </a>
            </div>
          </section>

          {/* Core Competencies */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>核心能力</h2>
            <div className={styles.skillGrid}>
              {skillCategories.map((category) => (
                <div key={category.title} className={styles.skillCategory}>
                  <h3 className={styles.skillCategoryTitle}>{category.title}</h3>
                  <ul className={styles.skillList}>
                    {category.items.map((item) => (
                      <li key={item.name} className={styles.skillItem}>
                        <span className={styles.skillName}>{item.name}</span>
                        <span className={styles.skillDesc}>{item.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Professional Experience */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>工作经历</h2>
            <div className={styles.experienceList}>
              <div className={styles.experienceItem}>
                <div className={styles.experienceHeader}>
                  <h3 className={styles.experienceRole}>AI 开发工程师</h3>
                  <span className={styles.experienceDate}>2026.01 - 至今</span>
                </div>
                <p className={styles.experienceCompany}>某 AI 科技公司</p>
                <p className={styles.experienceDesc}>
                  负责 AI 全栈平台核心功能建设，参与多角色协作平台的全栈研发与架构落地。
                  设计并落地多模型 LLM 接入能力，基于 LangChain / LangGraph 构建 AI 访谈分析工作流。
                  建设 RAG 与知识库能力，负责实时智能辅助链路（WebSocket、SSE、语音转写 + 大模型）。
                  负责单用户报告、多用户洞察简报和项目洞察台建设，支持 Word / PDF 导出。
                  推动前端复杂模块工程化治理，抽象通用组件与 Hooks 降低维护成本。
                </p>
              </div>

              <div className={styles.experienceItem}>
                <div className={styles.experienceHeader}>
                  <h3 className={styles.experienceRole}>全栈工程师（实习生 → 工程师）</h3>
                  <span className={styles.experienceDate}>2024.07 - 2026.01</span>
                </div>
                <p className={styles.experienceCompany}>某文化传媒公司</p>
                <p className={styles.experienceDesc}>
                  管理技术部门开发运转，负责 Android / iOS 双端 APP、官网、微信小程序从 0 到 1 的设计与开发。
                  独立完成官网的全栈开发与上线（Spring Boot + Vue 3），负责 ICP 备案、域名备案及云服务器部署。
                  设计并实现后台管理系统，构建安全防护体系（密码加盐哈希、JWT 防伪造、DDoS 防护、文件上传校验）。
                  实现完整的 RBAC 动态权限控制系统与数据权限分级管理，接入微信支付完成订单闭环。
                  独立完成 SEO 优化与搜索引擎收录，通过 Meta 标签优化、页面性能优化等手段提升搜索可见度。
                </p>
              </div>
            </div>
          </section>

          {/* Key Projects */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>重点项目</h2>
            <div className={styles.experienceList}>
              <div className={styles.experienceItem}>
                <div className={styles.experienceHeader}>
                  <h3 className={styles.experienceRole}>AI 多智能体平台</h3>
                  <span className={styles.experienceDate}>2025.02 - 2025.07</span>
                </div>
                <p className={styles.experienceCompany}>毕业设计 · 广东省计算机设计大赛三等奖</p>
                <p className={styles.experienceDesc}>
                  独立设计开发企业级多智能体平台系统（Vue 3 + Spring Boot 3 + Spring AI + RAG + Tool Calling + MCP）。
                  支持多轮对话、记忆持久化、RAG 知识库检索，基于 ReAct 模式实现自主规划智能体。
                  实现 SQL ER 图生成、AI 思维导图实时渲染、SSE 流式接口消费者等模块。
                  运用 Prompt 工程优化智能体输出质量，基于阿里云百炼平台反复测试迭代。
                </p>
              </div>

              <div className={styles.experienceItem}>
                <div className={styles.experienceHeader}>
                  <h3 className={styles.experienceRole}>跨平台智能设备控制 APP</h3>
                  <span className={styles.experienceDate}>2024.07 - 2025.01</span>
                </div>
                <p className={styles.experienceCompany}>Android / iOS 双端 · 已上线应用商店</p>
                <p className={styles.experienceDesc}>
                  基于 UniApp + Vue 3 开发双端 APP，设计全局蓝牙管理器控制设备动力组模块。
                  实现遥控模式、陀螺仪模式、导航模式、编程模式，完成从 0 到 1 研发并上线应用商店。
                </p>
              </div>
            </div>
          </section>

          {/* Open Source */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>开源项目</h2>
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
            <h2 className={styles.sectionTitle}>联系方式</h2>
            <p className={styles.contactText}>
              如果你对 AI 开发有兴趣，或想交流 Prompt 工程与 Agent 开发经验，欢迎通过 GitHub 联系我。
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
