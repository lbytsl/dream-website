import React from "react";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import styles from "./FeaturedArticles.module.css";

// Temporary static data; will be replaced by plugin data in the future
const featuredArticles = [
  {
    title: "Building AI Agents with LangChain: A Complete Guide",
    category: "AI Engineering",
    readingTime: 12,
    date: "2026-07-20",
    cover: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
  },
  {
    title: "Prompt Engineering Best Practices for GPT-4 and Claude",
    category: "Prompt Engineering",
    readingTime: 8,
    date: "2026-07-15",
    cover: "https://images.unsplash.com/photo-1682163270330-8020e9cdbc3f?w=600&q=80",
  },
  {
    title: "Understanding RAG: From Theory to Production",
    category: "RAG",
    readingTime: 15,
    date: "2026-07-10",
    cover: "https://images.unsplash.com/photo-1509228468518-180b56baae27?w=600&q=80",
  },
];

function ArticleCard({ article }: { article: (typeof featuredArticles)[0] }) {
  return (
    <Link to="/blog" className={styles.card}>
      <div className={styles.cardImageWrapper}>
        <div className={styles.cardImagePlaceholder}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className={styles.cardBadge}>{article.category}</span>
          <span className={styles.cardDate}>{article.date}</span>
        </div>
        <h3 className={styles.cardTitle}>{article.title}</h3>
        <div className={styles.cardFooter}>
          <span className={styles.cardReadingTime}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {article.readingTime} min read
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedArticles(): React.ReactNode {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          <Translate id="home.featuredArticles.title">最新文章</Translate>
        </h2>
        <p className={styles.sectionSubtitle}>
          <Translate id="home.featuredArticles.subtitle">
            探索 AI 技术前沿，分享工程实践经验
          </Translate>
        </p>

        <div className={styles.grid}>
          {featuredArticles.map((article, idx) => (
            <ArticleCard key={idx} article={article} />
          ))}
        </div>

        <div className={styles.cta}>
          <Link className="button button--primary button--lg" to="/blog">
            <Translate id="home.featuredArticles.viewAll">查看全部文章 →</Translate>
          </Link>
        </div>
      </div>
    </section>
  );
}
