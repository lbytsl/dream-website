import React, { useRef } from "react";
import Link from "@docusaurus/Link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import stats from "../../data/stats.json";
import recentPosts from "../../data/recent-posts.json";
import styles from "./AnimatedHome.module.css";
import studio from "../../css/studio.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

const signals = ["PROMPT ENGINEERING", "RAG", "AGENT", "MCP", "EVALUATION", "MULTIMODAL", "AI WORKFLOW", "OPEN SOURCE"];

const tracks = [
  { label: "PROMPT", x: "-34%", y: "-24%" },
  { label: "SKILLS", x: "36%", y: "-8%" },
  { label: "RAG", x: "-30%", y: "32%" },
  { label: "MCP", x: "31%", y: "35%" },
];

const paths = [
  {
    title: "让 Prompt 成为工程资产",
    copy: "从结构化表达，到测试、审计与版本迭代。不是收藏提示词，而是建立可复用的方法。",
    href: "/docs/prompt/intro",
    action: "进入 Prompt 库",
  },
  {
    title: "把能力装进你的工作流",
    copy: "覆盖开发、设计与内容生产的 Skills，将成熟实践变成随时可调用的执行能力。",
    href: "/docs/skills/intro",
    action: "探索 Skills",
  },
  {
    title: "从原理走到真实交付",
    copy: "拆解 RAG、Agent 与 MCP 的工程现场，记录决策、边界和真正有用的实现细节。",
    href: "/blog",
    action: "阅读技术文章",
  },
];

// 项目介绍与仓库功能保持一致；右侧流程图仅作能力示意。
const featuredProjects = [
  {
    id: "sql-to-er",
    title: "sql_to_ER",
    outcome: "把 SQL 变成可编辑的 ER 图",
    summary: "粘贴建表语句，生成实体关系图。在画布上调整字段和连线，再导出为设计文档。",
    tags: ["数据库建模", "可视化编辑", "PNG / SVG / PDF"],
    href: "https://github.com/lbytsl/sql_to_ER",
    event: "homepage-project-sql-to-er",
  },
  {
    id: "promptops",
    title: "PromptOps",
    outcome: "让 Prompt 的质量可以验证",
    summary: "把审计、评测、回归测试和发布串成完整流程，让每次 Prompt 调整都有据可查。",
    tags: ["Prompt 审计", "版本比较", "测试与发布"],
    href: "https://github.com/lbytsl/skills-promptops",
    event: "homepage-project-promptops",
  },
  {
    id: "jev-chat-analyzer",
    title: "Jev Chat Analyzer",
    outcome: "从聊天记录中读懂意图与情绪",
    summary: "用 Jev 分析对话，按需生成潜台词与回复建议。支持历史会话、追加记录和 Markdown 导出。",
    tags: ["Jev + LLM", "Vue 3 / FastAPI", "流式分析"],
    href: "https://github.com/lbytsl/jev-chat-analyzer",
    event: "homepage-project-jev-chat-analyzer",
  },
];

export default function AnimatedHome(): React.ReactNode {
  const root = useRef<HTMLDivElement>(null);
  const latest = recentPosts[0];

  // 首屏默认可见，只保留一次轻量位移动效，减少等待与持续动画开销。
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-hero-copy], [data-hero-actions]", {
        y: 16, duration: .65, stagger: .08, ease: "expo.out", clearProps: "transform",
      });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <div ref={root} className={studio.page}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.orbitScene} aria-hidden="true">
          <div className={styles.outerRing} />
          <div className={styles.innerRing} />
          <div className={styles.core}>D</div>
          {tracks.map((track) => (
            <span
              key={track.label}
              className={styles.orbitTag}
              style={{ "--x": track.x, "--y": track.y } as React.CSSProperties}
            >
              {track.label}
            </span>
          ))}
        </div>

        <div className={styles.heroContent}>
          <h1 id="home-title" className={styles.heroTitle}>
            <span className={styles.lineMask}><span>把复杂知识</span></span>
            <span className={styles.lineMask}><span className={styles.accent}>变成行动。</span></span>
          </h1>
          <p className={styles.heroCopy} data-hero-copy>
            一份持续生长的 AI 开发者知识系统。<br />
            从 Prompt、Skills 到 Agent 工程，读懂，然后真正做出来。
          </p>
          <div className={styles.heroActions} data-hero-actions>
            <a className={styles.primaryButton} href="#featured-projects">
              查看开源项目 <span aria-hidden="true">↓</span>
            </a>
            <Link className={styles.textButton} to="/cooperation" data-umami-event="homepage-cooperation">
              合作咨询 <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

      </section>

      <main>
        <section className={styles.manifesto}>
          <div className={styles.manifestoInner}>
            <h2>信息很多。<br />真正稀缺的是<span>路径。</span></h2>
            <p>这里不追逐每一个热点。我们筛选值得理解的变化，把零散知识组织成可以学习、复用和交付的清晰路径。</p>
          </div>
        </section>

        <section className={styles.signalRail} aria-label="AI 技术方向">
          <div className={styles.signalTrack}>
            {signals.map((signal) => <span key={signal}>{signal}</span>)}
          </div>
        </section>

        <section className={styles.paths} aria-labelledby="paths-title">
          <div className={styles.sectionHead}>
            <h2 id="paths-title">选择你的下一步</h2>
          </div>
          <div className={styles.pathGrid}>
            {paths.map((path) => (
              <Link key={path.title} to={path.href} className={styles.pathCard}>
                <div>
                  <h3>{path.title}</h3>
                  <p>{path.copy}</p>
                </div>
                <span className={styles.cardAction}>{path.action} <b aria-hidden="true">↗</b></span>
              </Link>
            ))}
          </div>
        </section>

        <section id="featured-projects" className={styles.projects} aria-labelledby="projects-title">
          <div className={styles.projectsIntro}>
            <div>
              <h2 id="projects-title">为真实场景，<br />做实用工具。</h2>
            </div>
            <p>数据库建模、Prompt 质量管理、聊天记录分析。这里记录我把具体问题做成开源工具的实践，也欢迎你参与改进。</p>
          </div>

          <div className={styles.projectStack}>
            {featuredProjects.map((project) => (
              <a
                key={project.id}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.projectCard}
                data-umami-event={project.event}
              >
                <div className={styles.projectBody}>
                  <div className={styles.projectInfo}>
                    <h3>{project.title}</h3>
                    <p className={styles.projectOutcome}>{project.outcome}</p>
                    <p>{project.summary}</p>
                    <div className={styles.projectTags}>
                      {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                    <span className={styles.projectAction}>
                      查看 GitHub 仓库
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" /></svg>
                    </span>
                  </div>
                  <div className={styles.projectVisual} aria-hidden="true">
                    {project.id === "sql-to-er" ? (
                      <div className={styles.schemaPreview}>
                        {/* 陈氏记法：实体为矩形、关系为菱形、属性为椭圆，主键加下划线。 */}
                        <svg className={styles.chenDiagram} viewBox="0 0 400 240" focusable="false">
                          <g className={styles.chenLines}>
                            <path d="M85 66v34M85 144v30M315 66v34M315 144v30M130 122h33M237 122h33" />
                          </g>
                          <g className={styles.chenAttributes}>
                            <ellipse cx="85" cy="44" rx="56" ry="22" />
                            <ellipse cx="85" cy="196" rx="56" ry="22" />
                            <ellipse cx="315" cy="44" rx="56" ry="22" />
                            <ellipse cx="315" cy="196" rx="56" ry="22" />
                          </g>
                          <g className={styles.chenEntities}>
                            <rect x="40" y="100" width="90" height="44" />
                            <rect x="270" y="100" width="90" height="44" />
                            <polygon points="200,87 237,122 200,157 163,122" />
                          </g>
                          <g className={styles.chenLabels}>
                            <text x="85" y="44" className={styles.chenKey}>用户ID</text>
                            <text x="85" y="196">姓名</text>
                            <text x="315" y="44" className={styles.chenKey}>订单ID</text>
                            <text x="315" y="196">金额</text>
                            <text x="85" y="122">用户</text>
                            <text x="200" y="122">下单</text>
                            <text x="315" y="122">订单</text>
                            <text x="147" y="107" className={styles.chenCardinality}>1</text>
                            <text x="254" y="107" className={styles.chenCardinality}>N</text>
                          </g>
                        </svg>
                      </div>
                    ) : project.id === "promptops" ? (
                      <div className={styles.promptPreview}>
                        <div><span>01</span><b>AUDIT</b><i>质量审计</i></div>
                        <div><span>02</span><b>COMPARE</b><i>版本比较</i></div>
                        <div><span>03</span><b>RELEASE</b><i>测试发布</i></div>
                      </div>
                    ) : (
                      <div className={styles.chatPreview}>
                        <div className={styles.chatInput}>聊天记录</div>
                        <div className={styles.chatBranches}>
                          <div><b>Jev</b><span>意图 · 情绪</span></div>
                          <div><b>LLM</b><span>潜台词 · 回复建议</span></div>
                        </div>
                        <div className={styles.chatOutput}>会话存档 · Markdown 导出</div>
                      </div>
                    )}
                    <span className={styles.previewCaption}>{project.id === "sql-to-er" ? "陈氏 ER 图 · 关系示意" : project.id === "jev-chat-analyzer" ? "分类 + 可选生成 · 流程示意" : "功能流程示意"}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div className={styles.projectCta}>
            <p>有 AI 产品、知识库或自动化工作流想法？</p>
            <Link to="/cooperation" data-umami-event="homepage-projects-cooperation">聊聊如何落地 <span>→</span></Link>
          </div>
        </section>

        <section className={styles.latest}>
          <div className={styles.latestVisual}>
            <img src={latest.cover} alt={`${latest.title}文章封面`} width="1923" height="818" loading="lazy" />
          </div>
          <div className={styles.latestCopy}>
            <h2>{latest.title}</h2>
            <p>{latest.description}</p>
            <Link to={`/blog/${latest.slug}`} className={styles.inlineLink}>阅读全文 <span>→</span></Link>
          </div>
        </section>

        <section className={styles.metrics} aria-label="内容数据">
          <div><strong>{stats.articles}</strong><span>篇深度文章</span></div>
          <div><strong>{stats.prompts}</strong><span>个 Prompt 模板</span></div>
          <div><strong>{stats.skills}</strong><span>项实用 Skills</span></div>
          <p>持续更新，<br />只留下真正有用的内容。</p>
        </section>

        <section className={styles.closing}>
          <div>
            <h2>下一次突破，<br />从一个好问题开始。</h2>
            <Link className={styles.primaryButton} to="/docs/prompt/intro">打开知识库 <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </main>
    </div>
  );
}
