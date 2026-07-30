import React from "react";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import styles from "./PromptLibrary.module.css";

const hotPrompts = [
  {
    title: "AI 结构化讲解",
    category: "文字处理",
    href: "/docs/prompt/text/structured-explanation",
    description: "像老师在黑板画图那样讲解概念，用流程图、对比表、时间线结构化知识。",
  },
  {
    title: "品牌定位口号",
    category: "文字处理",
    href: "/docs/prompt/text/brand-positioning-slogan",
    description: "三步产出 1 句品牌口号 + 差异化支柱 + 创意表达，建立清晰的品牌心智。",
  },
  {
    title: "法律问题分析",
    category: "文字处理",
    href: "/docs/prompt/text/legal-issue-analysis",
    description: "用法律思维拆解实务场景，输出争议焦点、请求权基础与风险应对方案。",
  },
  {
    title: "小红书 Pop 艺术封面",
    category: "绘画设计",
    href: "/docs/prompt/painting/xiaohongshu-pop-art-cover",
    description: "波普艺术风格封面图，大号文字 + 高饱和色块，适合小红书信息流。",
  },
  {
    title: "粘土风 3D 信息图",
    category: "绘画设计",
    href: "/docs/prompt/painting/clay-3d-infographic",
    description: "粘土质感 3D 等距信息图，柔光材质 + 可爱形态，让数据变得亲切有趣。",
  },
  {
    title: "动画角色设定",
    category: "绘画设计",
    href: "/docs/prompt/painting/anime-character-sheet",
    description: "专业角色三视图 + 表情包 + 配色方案，统一动画角色设计语言。",
  },
];

function PromptCard({ prompt }: { prompt: (typeof hotPrompts)[0] }) {
  return (
    <Link to={prompt.href} className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardBadge}>{prompt.category}</span>
      </div>
      <h3 className={styles.cardName}>{prompt.title}</h3>
      <p className={styles.cardDesc}>{prompt.description}</p>
    </Link>
  );
}

export default function PromptLibrary(): React.ReactNode {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          <Translate id="home.promptLibrary.title">精选 Prompt</Translate>
        </h2>
        <p className={styles.sectionSubtitle}>
          <Translate id="home.promptLibrary.subtitle">
            经过反复测试打磨的高质量 Prompt，覆盖文字处理与绘画设计两大类场景
          </Translate>
        </p>

        <div className={styles.grid}>
          {hotPrompts.map((prompt, idx) => (
            <PromptCard key={idx} prompt={prompt} />
          ))}
        </div>

        <div className={styles.cta}>
          <Link className="button button--secondary button--lg" to="/docs/prompt/intro">
            <Translate id="home.promptLibrary.viewAll">探索全部 Prompt →</Translate>
          </Link>
        </div>
      </div>
    </section>
  );
}
