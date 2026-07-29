import React from "react";
import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import styles from "./FeaturedArticles.module.css";
import recentPosts from "../../data/recent-posts.json";

interface PostMeta {
  title: string;
  date: string;
  slug: string;
  tags: string[];
  description: string;
  cover: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toISOString().slice(0, 10);
}

function ArticleCard({ post }: { post: PostMeta }) {
  const tag = post.tags?.[0] ?? "AI";

  return (
    <Link to={`/blog/${post.slug}`} className={styles.card}>
      <div className={styles.cardImageWrapper}>
        {post.cover ? (
          <img src={post.cover} alt={post.title} className={styles.cardImage} />
        ) : (
          <div className={styles.cardImagePlaceholder}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
        )}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className={styles.cardBadge}>{tag}</span>
          <span className={styles.cardDate}>{formatDate(post.date)}</span>
        </div>
        <h3 className={styles.cardTitle}>{post.title}</h3>
      </div>
    </Link>
  );
}

export default function FeaturedArticles(): React.ReactNode {
  const posts = recentPosts as PostMeta[];

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
          {posts.map((post, idx) => (
            <ArticleCard key={idx} post={post} />
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
