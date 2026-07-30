import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import styles from "./about.module.css";

export default function NotFound(): React.ReactNode {
  return (
    <Layout title="页面未找到" description="抱歉，您访问的页面不存在。返回首页继续探索 AI 开发技术。">
      <div className={styles.container}>
        <div className={styles.content} style={{ textAlign: "center", padding: "4rem 0" }}>
          <p style={{ fontSize: "4rem", fontWeight: 800, margin: "0 0 0.5rem", letterSpacing: "-0.02em" }}>
            404
          </p>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 1rem" }}>
            页面未找到
          </h1>
          <p style={{ color: "var(--ai-text-secondary)", maxWidth: "480px", margin: "0 auto 2rem", lineHeight: 1.6 }}>
            抱歉，您访问的页面不存在或已被移动。可能是链接已失效、输入了错误的 URL，或者页面已被移除。
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/" className="button button--primary">
              返回首页
            </Link>
            <Link to="/blog" className="button button--secondary">
              浏览文章
            </Link>
            <Link to="/docs/prompt/intro" className="button button--secondary">
              Prompt 模板
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
