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
      title={siteConfig.tagline}
      description="AI Developer Hub - 探索 AI 开发的前沿技术与实践，分享 Prompt、Skills、开源项目与工程实践"
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
