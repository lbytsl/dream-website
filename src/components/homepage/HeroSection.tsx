import React from "react";
import Link from "@docusaurus/Link";
import { useColorMode } from "@docusaurus/theme-common";
import Translate from "@docusaurus/Translate";
import styles from "./HeroSection.module.css";

export default function HeroSection(): React.ReactNode {
  const { colorMode } = useColorMode();

  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroBadge}>
          <span className={styles.badgeDot} />
          <Translate id="hero.badge">AI Developer Hub</Translate>
        </div>

        <h1 className={styles.heroTitle}>
          <Translate id="hero.title.line1">探索 AI 开发的</Translate>
          <br />
          <span className={styles.heroHighlight}>
            <Translate id="hero.title.line2">前沿技术与实践</Translate>
          </span>
        </h1>

        <p className={styles.heroSubtitle}>
          <Translate id="hero.subtitle.line1">
            分享 AI 技术文章、Prompt 工程、Skills 开发与开源项目，
          </Translate>
          <br />
          <Translate id="hero.subtitle.line2">
            助力每一位 AI 开发者快速成长
          </Translate>
        </p>

        <div className={styles.heroActions}>
          <Link
            className="button button--primary button--lg"
            to="/blog"
          >
            <Translate id="hero.cta.viewArticles">查看文章</Translate>
          </Link>
          <Link
            className="button button--secondary button--lg"
            href="https://github.com/your-github-username"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ marginRight: 8 }}
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            GitHub
          </Link>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>50+</span>
            <span className={styles.statLabel}>
              <Translate id="hero.stats.articles">技术文章</Translate>
            </span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>100+</span>
            <span className={styles.statLabel}>
              <Translate id="hero.stats.prompts">Prompt 模板</Translate>
            </span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>30+</span>
            <span className={styles.statLabel}>
              <Translate id="hero.stats.skills">Skills 工具</Translate>
            </span>
          </div>
        </div>
      </div>

      <div className={styles.heroBg}>
        <div className={styles.heroGlow} />
        <div className={styles.heroGrid} />
      </div>
    </header>
  );
}
