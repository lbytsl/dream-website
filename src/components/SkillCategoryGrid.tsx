import React, { useMemo, useRef, useState } from "react";
import Link from "@docusaurus/Link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./SkillCategoryGrid.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

type CategoryType = "discovery" | "design" | "engineering" | "cloudCreative";

type SkillItem = {
  title: string;
  description: string;
  href: string;
  icon: string;
  tags: string[];
};

const skillData: Record<CategoryType, SkillItem[]> = {
  discovery: [
    { title: "Find Skills", description: "从开放生态中搜索、评估并安装适合任务的 Skill。", href: "/docs/skills/discovery/find-skills", icon: "⌕", tags: ["技能发现", "搜索", "工具"] },
    { title: "Agent Browser", description: "为 Agent 提供网页导航、读取、点击、输入和截图能力。", href: "/docs/skills/discovery/agent-browser", icon: "◎", tags: ["浏览器", "自动化", "测试"] },
  ],
  design: [
    { title: "Frontend Design", description: "生成更有辨识度、更接近成品的 Web 页面与组件。", href: "/docs/skills/design/frontend-design", icon: "✦", tags: ["前端设计", "UI", "组件"] },
    { title: "Web Design Guidelines", description: "按现代设计准则检查界面质量、可用性与一致性。", href: "/docs/skills/design/web-design-guidelines", icon: "◇", tags: ["设计审查", "响应式", "可访问性"] },
  ],
  engineering: [
    { title: "Vercel React Best Practices", description: "Vercel 工程团队整理的 React 与 Next.js 性能实践。", href: "/docs/skills/engineering/react-best-practices", icon: "R", tags: ["React", "Next.js", "性能"] },
    { title: "Improve Codebase Architecture", description: "分析代码结构和依赖，提出渐进式架构改进方案。", href: "/docs/skills/engineering/improve-codebase-architecture", icon: "⌘", tags: ["架构", "重构", "代码质量"] },
    { title: "Test-Driven Development", description: "通过红—绿—重构循环，以测试驱动功能实现。", href: "/docs/skills/engineering/tdd", icon: "✓", tags: ["TDD", "测试", "回归"] },
    { title: "PromptOps", description: "对 Prompt 进行质量审计、安全优化、版本比较与发布测试。", href: "/docs/skills/engineering/prompt-ops", icon: "P", tags: ["Prompt 工程", "质量审计", "测试"] },
  ],
  cloudCreative: [
    { title: "Microsoft Foundry", description: "Microsoft 官方 Azure Skill，辅助构建和管理 AI 应用。", href: "/docs/skills/cloud/microsoft-foundry", icon: "☁", tags: ["Azure", "AI 应用", "云服务"] },
    { title: "AI Image Generation", description: "为 Agent 接入 AI 图像生成和视觉素材工作流。", href: "/docs/skills/creative/ai-image-generation", icon: "◈", tags: ["图像生成", "视觉", "创意"] },
    { title: "Remotion Best Practices", description: "使用 React 代码创建稳定、可渲染的程序化视频。", href: "/docs/skills/creative/remotion-best-practices", icon: "▶", tags: ["Remotion", "视频", "React"] },
  ],
};

const categoryMeta = {
  discovery: { eyebrow: "DISCOVERY & AUTOMATION", title: "发现与自动化", description: "发现合适的 Agent Skill，并通过浏览器自动化完成真实网页任务。" },
  design: { eyebrow: "DESIGN & FRONTEND", title: "设计与前端", description: "从界面创作到设计审查，构建更清晰、更一致的 Web 体验。" },
  engineering: { eyebrow: "ENGINEERING QUALITY", title: "工程质量", description: "覆盖 Prompt 工程、代码架构、React 性能与测试驱动开发。" },
  cloudCreative: { eyebrow: "CLOUD & CREATIVE", title: "云与创意", description: "连接云端 AI 服务、图像生成与程序化视频生产工作流。" },
};

const categoryLinks: Array<{ type: CategoryType; label: string; href: string }> = [
  { type: "discovery", label: "发现", href: "/docs/skills/discovery" },
  { type: "design", label: "设计", href: "/docs/skills/design" },
  { type: "engineering", label: "工程", href: "/docs/skills/engineering" },
  { type: "cloudCreative", label: "云与创意", href: "/docs/skills/cloud-creative" },
];

export default function SkillCategoryGrid({ type }: { type: CategoryType }) {
  const items = skillData[type];
  const meta = categoryMeta[type];
  const root = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((item) =>
      [item.title, item.description, ...item.tags].join(" ").toLowerCase().includes(keyword),
    );
  }, [items, query]);

  useGSAP(
    (context) => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 997px) and (pointer: fine)",
        },
        (mediaContext) => {
          const { motion, desktop } = mediaContext.conditions as { motion: boolean; desktop: boolean };
          if (!motion) return;

          gsap.timeline({ defaults: { ease: "power3.out" } })
            .from("[data-skill-hero] > *", { opacity: 0, y: 24, duration: .65, stagger: .07 })
            .from("[data-skill-toolbar]", { opacity: 0, y: 16, duration: .5 }, "-=.3")
            .from("[data-skill-card]", { opacity: 0, y: 28, scale: .97, duration: .62, stagger: .075 }, "-=.28");

          const input = root.current?.querySelector<HTMLElement>("[data-skill-search]");
          if (input) {
            const scaleTo = gsap.quickTo(input, "scale", { duration: .25, ease: "power3.out" });
            const focus = () => scaleTo(1.012);
            const blur = () => scaleTo(1);
            input.addEventListener("focus", focus);
            input.addEventListener("blur", blur);
            context.add(() => { input.removeEventListener("focus", focus); input.removeEventListener("blur", blur); });
          }

          if (!desktop) return;
          gsap.utils.toArray<HTMLElement>("[data-skill-card]").forEach((card) => {
            gsap.set(card, { transformPerspective: 950, transformOrigin: "center" });
            const rotateX = gsap.quickTo(card, "rotationX", { duration: .38, ease: "power3.out" });
            const rotateY = gsap.quickTo(card, "rotationY", { duration: .38, ease: "power3.out" });
            const yTo = gsap.quickTo(card, "y", { duration: .38, ease: "power3.out" });
            const move = (event: PointerEvent) => {
              const rect = card.getBoundingClientRect();
              rotateX(((event.clientY - rect.top) / rect.height - .5) * -6);
              rotateY(((event.clientX - rect.left) / rect.width - .5) * 7);
              yTo(-5);
            };
            const leave = () => { rotateX(0); rotateY(0); yTo(0); };
            card.addEventListener("pointermove", move, { passive: true });
            card.addEventListener("pointerleave", leave);
            context.add(() => { card.removeEventListener("pointermove", move); card.removeEventListener("pointerleave", leave); });
          });
        },
      );
      return () => mm.revert();
    },
    { scope: root, dependencies: [type, query], revertOnUpdate: true },
  );

  return (
    <div ref={root} className={`${styles.categoryPage} ${styles[type]}`}>
      <header className={styles.hero} data-skill-hero>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>{meta.eyebrow}</span>
          <h1>{meta.title}</h1>
          <p>{meta.description}</p>
        </div>
        <div className={styles.count} aria-label={`${items.length} 个 Skills`}>
          <strong>{items.length}</strong>
          <span>个实用 Skills</span>
        </div>
      </header>

      <div className={styles.toolbar} data-skill-toolbar>
        <nav className={styles.categoryNav} aria-label="Skills 分类">
          {categoryLinks.map((category) => (
            <Link
              key={category.type}
              to={category.href}
              className={category.type === type ? styles.categoryActive : undefined}
            >
              {category.label}
            </Link>
          ))}
        </nav>
        <label className={styles.search} data-skill-search>
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索当前分类"
            aria-label="搜索 Skills"
          />
          <kbd>{filteredItems.length}</kbd>
        </label>
      </div>

      <div className={styles.grid}>
        {filteredItems.map((item, index) => (
          <Link className={styles.card} to={item.href} key={item.href} data-skill-card data-interactive>
            <div className={styles.cardTop}>
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <div className={styles.cardBottom}>
              <div className={styles.tags}>{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <span className={styles.arrow} aria-hidden="true">→</span>
            </div>
          </Link>
        ))}
        {filteredItems.length === 0 && (
          <div className={styles.empty} role="status">
            <span>NO MATCH</span>
            <h2>没有找到相关 Skill</h2>
            <p>换一个技术词试试，例如 React、测试或图像。</p>
          </div>
        )}
      </div>
    </div>
  );
}
