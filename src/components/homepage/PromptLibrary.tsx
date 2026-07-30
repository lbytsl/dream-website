import React from "react";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import styles from "./PromptLibrary.module.css";

const hotPrompts = [
  {
    name: "简约手绘知识信息图",
    model: "AI 绘图",
    category: "绘图",
    description: "适合课程笔记、公众号配图和知识科普的手绘信息图模板。",
    href: "/docs/prompt/painting/minimal-doodle-infographic",
  },
  {
    name: "物品爆炸视图",
    model: "AI 绘图",
    category: "产品设计",
    description: "生成适合硬件原理和工业设计说明的专业爆炸视图。",
    href: "/docs/prompt/painting/exploded-view",
  },
  {
    name: "动漫人物角色设定图",
    model: "AI 绘图",
    category: "角色设计",
    description: "生成包含三视图、表情、动作和服装变化的完整角色设定。",
    href: "/docs/prompt/painting/anime-character-sheet",
  },
  {
    name: "智能旅行路线定制",
    model: "通用大模型",
    category: "旅行",
    description: "根据预算、时间与偏好生成可执行的深度旅行方案。",
    href: "/docs/prompt/text/travel-itinerary",
  },
  {
    name: "30 天技能学习计划",
    model: "通用大模型",
    category: "学习",
    description: "把学习目标拆解为每天可执行、可验收的渐进计划。",
    href: "/docs/prompt/text/thirty-day-learning-plan",
  },
  {
    name: "结构化知识讲解",
    model: "通用大模型",
    category: "知识讲解",
    description: "用定义、类比、示例、流程图和自测题讲清复杂概念。",
    href: "/docs/prompt/text/structured-explanation",
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
            精选实用 Prompt 模板，覆盖绘图、学习、工作与生活场景
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
