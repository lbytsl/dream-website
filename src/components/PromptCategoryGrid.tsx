import React from "react";
import Link from "@docusaurus/Link";
import styles from "./PromptCategoryGrid.module.css";

type CategoryType = "painting" | "text";

type PromptItem = {
  title: string;
  description: string;
  href: string;
  icon: string;
  tags: string[];
};

const promptData: Record<CategoryType, PromptItem[]> = {
  painting: [
    { title: "简约手绘知识信息图", description: "把复杂知识转化为清晰、亲切的手绘信息图。", href: "/docs/prompt/painting/minimal-doodle-infographic", icon: "✦", tags: ["信息图", "手绘", "科普"] },
    { title: "复古手绘知识海报", description: "用复古纸张与水彩笔触制作知识型视觉海报。", href: "/docs/prompt/painting/vintage-sketch-poster", icon: "✎", tags: ["复古", "海报", "手绘"] },
    { title: "黏土 3D 科普图", description: "生成温暖、有趣且层次清楚的黏土风 3D 科普图。", href: "/docs/prompt/painting/clay-3d-infographic", icon: "◉", tags: ["3D", "黏土", "科普"] },
    { title: "物品爆炸视图", description: "展示产品部件、内部结构与装配关系。", href: "/docs/prompt/painting/exploded-view", icon: "⌘", tags: ["产品", "工业设计", "结构"] },
    { title: "白板手绘讲解图", description: "适合课程讲解、流程梳理和知识分享。", href: "/docs/prompt/painting/whiteboard-explainer", icon: "↗", tags: ["白板", "流程图", "讲解"] },
    { title: "电商直播界面截图", description: "生成带完整促销信息与互动元素的直播界面。", href: "/docs/prompt/painting/livestream-screenshot", icon: "●", tags: ["电商", "直播", "UI"] },
    { title: "小红书波普风封面", description: "制作高对比、高能量的社交媒体视觉封面。", href: "/docs/prompt/painting/xiaohongshu-pop-art-cover", icon: "◆", tags: ["小红书", "波普", "封面"] },
    { title: "城市窗景海报", description: "用城市地标、天气和室内前景构建旅行海报。", href: "/docs/prompt/painting/city-window-poster", icon: "▣", tags: ["城市", "旅行", "摄影"] },
    { title: "动漫人物角色设定图", description: "一次生成角色三视图、表情、动作与服装变化。", href: "/docs/prompt/painting/anime-character-sheet", icon: "◇", tags: ["动漫", "角色设计", "游戏"] },
    { title: "关键人物关系图", description: "清晰呈现角色身份、阵营与关系网络。", href: "/docs/prompt/painting/character-relationship-map", icon: "⌬", tags: ["人物关系", "故事", "信息图"] },
  ],
  text: [
    { title: "智能旅行路线定制", description: "根据时间、预算与偏好生成可执行的深度行程。", href: "/docs/prompt/text/travel-itinerary", icon: "⌖", tags: ["旅行", "行程", "预算"] },
    { title: "古籍取名助手", description: "从古典文献中提取有出处、有寓意的名字。", href: "/docs/prompt/text/classical-naming", icon: "文", tags: ["取名", "古籍", "文化"] },
    { title: "英语单词深度学习", description: "系统掌握词义、发音、搭配、词源与易混词。", href: "/docs/prompt/text/vocabulary-learning", icon: "Aa", tags: ["英语", "单词", "学习"] },
    { title: "考试知识点辅导", description: "先诊断基础，再按考试标准讲解、练习与批改。", href: "/docs/prompt/text/exam-tutoring", icon: "✓", tags: ["考试", "辅导", "教育"] },
    { title: "法律问题初步梳理", description: "区分事实与推测，整理争议、证据和行动选项。", href: "/docs/prompt/text/legal-issue-analysis", icon: "§", tags: ["法律", "分析", "风险"] },
    { title: "文本相似度分析与改写", description: "分析表达重合并完成保留原意的实质性改写。", href: "/docs/prompt/text/text-similarity-rewrite", icon: "≋", tags: ["改写", "相似度", "写作"] },
    { title: "30 天技能学习计划", description: "把学习目标拆成每天可执行、可验收的任务。", href: "/docs/prompt/text/thirty-day-learning-plan", icon: "30", tags: ["计划", "技能", "成长"] },
    { title: "结构化知识讲解", description: "通过类比、示例、流程图与自测讲清复杂概念。", href: "/docs/prompt/text/structured-explanation", icon: "☷", tags: ["知识", "讲解", "结构化"] },
    { title: "品牌定位与宣传语", description: "提炼品牌价值，并生成清晰、可信、易记的文案。", href: "/docs/prompt/text/brand-positioning-slogan", icon: "◎", tags: ["品牌", "营销", "文案"] },
    { title: "雅思写作分档对比训练", description: "用不同分数档范文定位写作能力与提分路径。", href: "/docs/prompt/text/ielts-band-comparison", icon: "9", tags: ["雅思", "写作", "考试"] },
  ],
};

const categoryMeta = {
  painting: {
    eyebrow: "VISUAL PROMPTS",
    title: "绘图提示词",
    description: "从构图、风格到视觉层级，快速生成更稳定、更专业的画面。",
  },
  text: {
    eyebrow: "TEXT PROMPTS",
    title: "文本提示词",
    description: "覆盖学习、工作与生活场景，让大模型输出更清晰、更可执行。",
  },
};

export default function PromptCategoryGrid({ type }: { type: CategoryType }) {
  const items = promptData[type];
  const meta = categoryMeta[type];

  return (
    <div className={`${styles.categoryPage} ${styles[type]}`}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>{meta.eyebrow}</span>
          <h1>{meta.title}</h1>
          <p>{meta.description}</p>
        </div>
        <div className={styles.count} aria-label={`${items.length} 个提示词`}>
          <strong>{items.length}</strong>
          <span>个实用模板</span>
        </div>
      </header>

      <div className={styles.grid}>
        {items.map((item, index) => (
          <Link className={styles.card} to={item.href} key={item.href}>
            <div className={styles.cardTop}>
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <div className={styles.cardBottom}>
              <div className={styles.tags}>
                {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <span className={styles.arrow} aria-hidden="true">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

