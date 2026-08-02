import React, { useRef } from "react";
import Link from "@docusaurus/Link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import stats from "../../data/stats.json";
import recentPosts from "../../data/recent-posts.json";
import styles from "./AnimatedHome.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

const particles = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  x: `${8 + ((index * 37) % 84)}%`,
  y: `${10 + ((index * 53) % 78)}%`,
  size: `${2 + (index % 3)}px`,
  delay: index * 0.08,
}));

const signals = ["PROMPT ENGINEERING", "RAG", "AGENT", "MCP", "EVALUATION", "MULTIMODAL", "AI WORKFLOW", "OPEN SOURCE"];

const tracks = [
  { label: "PROMPT", x: "-34%", y: "-24%", tone: "blue" },
  { label: "SKILLS", x: "36%", y: "-8%", tone: "violet" },
  { label: "RAG", x: "-30%", y: "32%", tone: "cyan" },
  { label: "MCP", x: "31%", y: "35%", tone: "rose" },
];

const paths = [
  {
    kicker: "01 · THINK",
    title: "让 Prompt 成为工程资产",
    copy: "从结构化表达，到测试、审计与版本迭代。不是收藏提示词，而是建立可复用的方法。",
    href: "/docs/prompt/intro",
    action: "进入 Prompt 库",
    className: styles.pathBlue,
  },
  {
    kicker: "02 · BUILD",
    title: "把能力装进你的工作流",
    copy: "覆盖开发、设计与内容生产的 Skills，将成熟实践变成随时可调用的执行能力。",
    href: "/docs/skills/intro",
    action: "探索 Skills",
    className: styles.pathViolet,
  },
  {
    kicker: "03 · SHIP",
    title: "从原理走到真实交付",
    copy: "拆解 RAG、Agent 与 MCP 的工程现场，记录决策、边界和真正有用的实现细节。",
    href: "/blog",
    action: "阅读技术文章",
    className: styles.pathAmber,
  },
];

export default function AnimatedHome(): React.ReactNode {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const orbit = useRef<HTMLDivElement>(null);
  const latest = recentPosts[0];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 997px)",
        },
        (context) => {
          const { motion, desktop } = context.conditions as {
            motion: boolean;
            desktop: boolean;
          };

          if (!motion) {
            gsap.set("[data-reveal], [data-hero-item]", { clearProps: "all" });
            return;
          }

          const intro = gsap.timeline({
            defaults: { duration: 0.9, ease: "power3.out" },
          });
          const splitChars = gsap.utils.toArray<HTMLElement>("[data-hero-split]").flatMap((line) =>
            SplitText.create(line, {
              type: "chars",
              charsClass: styles.heroChar,
              aria: "auto",
            }).chars,
          );
          intro
            .from("[data-hero-kicker]", { autoAlpha: 0, y: 16 })
            .from(splitChars, { autoAlpha: 0, yPercent: 115, rotationX: -28, stagger: 0.035 }, "-=0.55")
            .from("[data-hero-copy], [data-hero-actions]", { autoAlpha: 0, y: 24, stagger: 0.12 }, "-=0.55")
            .from("[data-orbit], [data-floating-card]", { autoAlpha: 0, scale: 0.78, stagger: 0.08 }, "-=0.7")
            .from("[data-scroll-cue]", { autoAlpha: 0, y: -8 }, "-=0.25");

          gsap.to(`.${styles.heroGlow}`, {
            rotation: 360,
            scale: 1.08,
            duration: 24,
            ease: "none",
            repeat: -1,
          });
          gsap.to("[data-particle]", {
            y: (index) => (index % 2 ? -20 : 18),
            x: (index) => (index % 3 - 1) * 10,
            opacity: (index) => 0.3 + (index % 4) * 0.13,
            duration: (index) => 3.5 + (index % 5) * 0.7,
            stagger: 0.06,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });
          gsap.to("[data-floating-card]", {
            y: (index) => (index ? 10 : -12),
            rotation: (index) => (index ? 1.5 : -1.5),
            duration: 3.6,
            stagger: 0.35,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });

          gsap.to("[data-orbit-ring='outer']", {
            rotation: 360,
            duration: 42,
            ease: "none",
            repeat: -1,
          });
          gsap.to("[data-orbit-ring='inner']", {
            rotation: -360,
            duration: 30,
            ease: "none",
            repeat: -1,
          });

          if (desktop && hero.current && orbit.current) {
            const xTo = gsap.quickTo(orbit.current, "x", { duration: 0.8, ease: "power3.out" });
            const yTo = gsap.quickTo(orbit.current, "y", { duration: 0.8, ease: "power3.out" });
            const move = (event: PointerEvent) => {
              xTo((event.clientX / window.innerWidth - 0.5) * 24);
              yTo((event.clientY / window.innerHeight - 0.5) * 18);
            };
            hero.current.addEventListener("pointermove", move);

            const cardCleanups: Array<() => void> = [];
            gsap.utils.toArray<HTMLElement>("[data-home-tilt]").forEach((card) => {
              let rect = card.getBoundingClientRect();
              gsap.set(card, { transformPerspective: 1000, transformOrigin: "center" });
              const rotateX = gsap.quickTo(card, "rotationX", { duration: 0.42, ease: "power3.out" });
              const rotateY = gsap.quickTo(card, "rotationY", { duration: 0.42, ease: "power3.out" });
              const moveCard = (event: PointerEvent) => {
                rect = card.getBoundingClientRect();
                rotateX(((event.clientY - rect.top) / rect.height - 0.5) * -7);
                rotateY(((event.clientX - rect.left) / rect.width - 0.5) * 7);
              };
              const leaveCard = () => { rotateX(0); rotateY(0); };
              card.addEventListener("pointermove", moveCard, { passive: true });
              card.addEventListener("pointerleave", leaveCard);
              cardCleanups.push(() => {
                card.removeEventListener("pointermove", moveCard);
                card.removeEventListener("pointerleave", leaveCard);
              });
            });

            gsap.to("[data-signal-track]", {
              xPercent: -28,
              ease: "none",
              scrollTrigger: {
                trigger: "[data-signal-rail]",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            });

            gsap.to(orbit.current, {
              scale: 0.72,
              rotation: 8,
              autoAlpha: 0.16,
              ease: "none",
              scrollTrigger: {
                trigger: hero.current,
                start: "top top",
                end: "bottom top",
                scrub: 0.8,
              },
            });

            return () => {
              hero.current?.removeEventListener("pointermove", move);
              cardCleanups.forEach((cleanup) => cleanup());
            };
          }
        },
      );

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 54,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 84%",
            toggleActions: "play none none reverse",
          },
        });
      });

      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={styles.page}>
      <section ref={hero} className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.particles} aria-hidden="true">
          {particles.map((particle) => (
            <i
              key={particle.id}
              data-particle
              style={{ "--px": particle.x, "--py": particle.y, "--ps": particle.size, "--pd": particle.delay } as React.CSSProperties}
            />
          ))}
        </div>
        <div ref={orbit} className={styles.orbitScene} aria-hidden="true">
          <div className={styles.outerRing} data-orbit-ring="outer" />
          <div className={styles.innerRing} data-orbit-ring="inner" />
          <div className={styles.core}>D</div>
          {tracks.map((track) => (
            <span
              key={track.label}
              data-orbit
              className={`${styles.orbitTag} ${styles[track.tone]}`}
              style={{ "--x": track.x, "--y": track.y } as React.CSSProperties}
            >
              {track.label}
            </span>
          ))}
        </div>

        <div className={`${styles.floatingCard} ${styles.promptCard}`} data-floating-card aria-hidden="true">
          <span>Prompt / 01</span><strong>评估 · 测试 · 发布</strong><i>QUALITY 94</i>
        </div>
        <div className={`${styles.floatingCard} ${styles.skillsCard}`} data-floating-card aria-hidden="true">
          <span>Skill / ACTIVE</span><strong>Agent Workflow</strong><i>READY TO RUN</i>
        </div>

        <div className={styles.heroContent}>
          <p className={styles.eyebrow} data-hero-kicker>
            DREAM / AI KNOWLEDGE SYSTEM
          </p>
          <h1 id="home-title" className={styles.heroTitle}>
            <span className={styles.lineMask}><span data-hero-split>把复杂知识</span></span>
            <span className={styles.lineMask}><span data-hero-split className={styles.gradientText}>变成行动。</span></span>
          </h1>
          <p className={styles.heroCopy} data-hero-copy>
            一份持续生长的 AI 开发者知识系统。<br />
            从 Prompt、Skills 到 Agent 工程，读懂，然后真正做出来。
          </p>
          <div className={styles.heroActions} data-hero-actions>
            <Link className={styles.primaryButton} to="/blog" data-magnetic>
              开始探索 <span aria-hidden="true">↗</span>
            </Link>
            <Link className={styles.textButton} to="/about" data-magnetic>
              认识 Dream <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className={styles.scrollCue} data-scroll-cue aria-hidden="true">
          <span>SCROLL TO EXPLORE</span><i />
        </div>
      </section>

      <main>
        <section className={styles.manifesto}>
          <div className={styles.manifestoInner} data-reveal>
            <p className={styles.sectionLabel}>WHY DREAM</p>
            <h2>信息很多。<br />真正稀缺的是<span>路径。</span></h2>
            <p>这里不追逐每一个热点。我们筛选值得理解的变化，把零散知识组织成可以学习、复用和交付的清晰路径。</p>
          </div>
        </section>

        <section className={styles.signalRail} data-signal-rail aria-label="AI 技术方向">
          <div className={styles.signalTrack} data-signal-track>
            {[...signals, ...signals].map((signal, index) => <span key={`${signal}-${index}`}>{signal}<i /></span>)}
          </div>
        </section>

        <section className={styles.paths} aria-labelledby="paths-title">
          <div className={styles.sectionHead} data-reveal>
            <p className={styles.sectionLabel}>THREE PATHS</p>
            <h2 id="paths-title">选择你的下一步</h2>
          </div>
          <div className={styles.pathGrid}>
            {paths.map((path) => (
              <Link key={path.title} to={path.href} className={`${styles.pathCard} ${path.className}`} data-reveal data-home-tilt>
                <span className={styles.cardKicker}>{path.kicker}</span>
                <div>
                  <h3>{path.title}</h3>
                  <p>{path.copy}</p>
                </div>
                <span className={styles.cardAction}>{path.action} <b aria-hidden="true">↗</b></span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.latest}>
          <div className={styles.latestVisual} data-reveal>
            <img src={latest.cover} alt={`${latest.title}文章封面`} />
          </div>
          <div className={styles.latestCopy} data-reveal>
            <p className={styles.sectionLabel}>LATEST ARTICLE · {latest.date}</p>
            <h2>{latest.title}</h2>
            <p>{latest.description}</p>
            <Link to={`/blog/${latest.slug}`} className={styles.inlineLink}>阅读全文 <span>→</span></Link>
          </div>
        </section>

        <section className={styles.metrics} data-reveal aria-label="内容数据">
          <div><strong>{stats.articles}</strong><span>篇深度文章</span></div>
          <div><strong>{stats.prompts}</strong><span>个 Prompt 模板</span></div>
          <div><strong>{stats.skills}</strong><span>项实用 Skills</span></div>
          <p>持续更新，<br />只留下真正有用的内容。</p>
        </section>

        <section className={styles.closing}>
          <div data-reveal>
            <p className={styles.sectionLabel}>KEEP EXPLORING</p>
            <h2>下一次突破，<br />从一个好问题开始。</h2>
            <Link className={styles.primaryButton} to="/docs/prompt/intro" data-magnetic>打开知识库 <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </main>
    </div>
  );
}
