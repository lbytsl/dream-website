import React from "react";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import OriginalBlogPostPaginator from "@theme-original/BlogPostPaginator";
import PaginatorNavLink from "@theme/PaginatorNavLink";
import type { Props } from "@theme/BlogPostPaginator";

export default function BlogPostPaginator(props: Props): React.ReactNode {
  const { metadata } = useBlogPost();
  if (!/\/blog\/(general-tips|codex-tips|workbuddy-tips)\//.test(metadata.permalink)) {
    return <OriginalBlogPostPaginator {...props} />;
  }
  const { prevItem, nextItem } = props;

  return (
    <nav className="pagination-nav docusaurus-mt-lg" aria-label="课程导航">
      {prevItem && <PaginatorNavLink {...prevItem} subLabel="上一课" />}
      {nextItem && <PaginatorNavLink {...nextItem} subLabel="下一课" isNext />}
    </nav>
  );
}
