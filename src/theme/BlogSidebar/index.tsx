import React from "react";
import { usePluginData } from "@docusaurus/useGlobalData";
import OriginalBlogSidebar from "@theme-original/BlogSidebar";
import type { BlogSidebar } from "@docusaurus/plugin-content-blog";
import type { Props } from "@theme/BlogSidebar";

export default function SharedBlogSidebar({ sidebar }: Props): React.ReactNode {
  const sharedSidebar = usePluginData("blog-series-sidebar") as BlogSidebar;
  return <OriginalBlogSidebar sidebar={sidebar && sharedSidebar} />;
}
