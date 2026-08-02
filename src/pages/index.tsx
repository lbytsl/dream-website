import React from "react";
import Layout from "@theme/Layout";
import AnimatedHome from "@site/src/components/homepage/AnimatedHome";

export default function Home(): React.ReactNode {
  return (
    <Layout
      title="Dream · AI 开发者的知识轨道"
      description="探索 Prompt 工程、AI Skills 与智能应用开发，让知识从阅读真正抵达实践。"
    >
      <AnimatedHome />
    </Layout>
  );
}
