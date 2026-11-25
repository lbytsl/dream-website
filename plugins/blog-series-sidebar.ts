import type { BlogContent, BlogSidebar } from "@docusaurus/plugin-content-blog";
import type { Plugin } from "@docusaurus/types";

/** Share the article directory without mixing series posts into the main blog feed. */
export default function blogSeriesSidebar(): Plugin {
  return {
    name: "blog-series-sidebar",
    allContentLoaded({ allContent, actions }) {
      const blogs = allContent["docusaurus-plugin-content-blog"] as Record<string, BlogContent>;
      const main = blogs.default;
      const sidebar: BlogSidebar = {
        title: main.blogSidebarTitle,
        items: Object.values(blogs).flatMap(({ blogPosts }) =>
          blogPosts.map(({ metadata: { title, permalink, unlisted, date } }) => ({
            title, permalink, unlisted, date,
          })),
        ),
      };
      actions.setGlobalData(sidebar);
    },
  };
}
