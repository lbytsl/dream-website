import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";

export default function PrivacyPage(): React.ReactNode {
  return (
    <Layout title="隐私说明" description="Dream 博客访问统计与隐私说明">
      <main style={{ maxWidth: 780, margin: "0 auto", padding: "8rem 1.5rem 10rem", minHeight: "75vh" }}>
        <p style={{ color: "var(--ifm-color-primary)", fontFamily: "monospace", letterSpacing: ".12em", fontSize: ".72rem" }}>PRIVACY / 访问统计</p>
        <h1 style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", letterSpacing: "-.06em", marginBottom: "2rem" }}>简短的隐私说明</h1>
        <p>为了了解哪些内容真正有帮助，并持续改善阅读体验，本站使用 Umami 与百度统计收集访问数据。</p>
        <h2>会收集什么</h2>
        <p>统计可能包含访问页面、来源、设备类型、浏览器、停留和交互等信息。Umami 以隐私友好的匿名访问分析为主；百度统计作为第三方服务，可能依据其规则使用标识符或 Cookie。</p>
        <h2>如何使用</h2>
        <p>数据只用于分析内容表现、发现页面问题和改善网站体验。本站不会出售访客个人数据，也不会使用这些数据建立个人营销档案。</p>
        <h2>你的选择</h2>
        <p>你可以通过浏览器设置限制或清除 Cookie，也可以使用内容拦截工具阻止统计脚本。这样做不会影响本站主要内容的阅读。</p>
        <p style={{ marginTop: "3rem", color: "var(--ifm-color-emphasis-600)" }}>更新日期：2026 年 8 月 3 日</p>
        <Link to="/">← 返回首页</Link>
      </main>
    </Layout>
  );
}
