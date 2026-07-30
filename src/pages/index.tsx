import React from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Translate from "@docusaurus/Translate";

import HeroSection from "@site/src/components/homepage/HeroSection";
import FeaturedArticles from "@site/src/components/homepage/FeaturedArticles";
import PromptLibrary from "@site/src/components/homepage/PromptLibrary";
import SkillsLibrary from "@site/src/components/homepage/SkillsLibrary";
import FooterCTA from "@site/src/components/homepage/FooterCTA";

export default function Home(): React.ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title="Dream — AI 开发前沿技术平台 | Prompt · Skills · RAG · MCP"
      description="一站式 AI 开发技术博客，专注 Prompt 工程、RAG 知识库、Skills 工具集、MCP 协议与 LLM 实战。提供 20+ Prompt 模板、11+ Skills 工具，助你从入门到精通 ✓ 立即探索 AI 开发新范式 →"
    >
      <HeroSection />
      <main>
        <FeaturedArticles />
        <PromptLibrary />
        <SkillsLibrary />
      </main>
      <FooterCTA />
    </Layout>
  );
}
