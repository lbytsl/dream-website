import React, { type ReactNode } from "react";
import { useLocation } from "@docusaurus/router";
import { groupBlogSidebarItemsByYear } from "@docusaurus/plugin-content-blog/client";
import DocSidebarItems from "@theme/DocSidebarItems";
import Heading from "@theme/Heading";
import type { Props } from "@theme/BlogSidebar/Content";
import type { PropSidebarItemCategory } from "@docusaurus/plugin-content-docs";

const categories = [
  { slug: "general-tips", label: "通用技巧", collapsed: true },
  { slug: "workbuddy-tips", label: "WorkBuddy / CodeBuddy 使用技巧", collapsed: true },
  { slug: "codex-tips", label: "Codex 使用技巧", collapsed: true },
  { slug: "knowledge-base", label: "知识库", collapsed: false },
];

function createCategory(
  { slug, label, collapsed }: (typeof categories)[number],
  items: Props["items"],
): PropSidebarItemCategory {
  return {
    type: "category",
    label,
    collapsible: true,
    collapsed,
    items: [...items]
      .sort((left, right) => left.permalink.localeCompare(right.permalink))
      .map(({ permalink, title }) => {
        // A lesson's display number can change without invalidating its public URL.
        const numberedTitle = title.match(/^(?:Codex|技巧)\s+(\d{2})[｜：]\s*(.*)$/);
        const order = numberedTitle?.[1] ?? permalink.match(/\/(\d{2})-/)?.[1];
        const shortTitle = slug === "knowledge-base"
          ? (permalink.endsWith("/11-overview") ? "总论与架构选型" : title.split("：")[0])
          : (numberedTitle?.[2] ?? title);
        return {
          type: "link",
          label: order ? `${order} · ${shortTitle}` : shortTitle,
          href: permalink,
        };
      }),
  };
}

/** 专题折叠菜单与同年的其他文章并列。 */
export default function BlogSidebarContent({
  items,
  ListComponent,
  yearGroupHeadingClassName,
}: Props): ReactNode {
  const { pathname } = useLocation();
  return (
    <>
      {groupBlogSidebarItemsByYear(items).map(([year, yearItems]) => {
        const seriesItems = new Map<string, Props["items"]>();
        const otherItems = yearItems.filter((item) => {
          const series = categories.find(({ slug }) => item.permalink.includes(`/blog/${slug}/`));
          if (!series) return true;
          const posts = seriesItems.get(series.slug);
          if (posts) posts.push(item);
          else seriesItems.set(series.slug, [item]);
          return false;
        });
        const sidebarCategories = categories.flatMap((category) => {
          const posts = seriesItems.get(category.slug);
          return posts?.length ? [createCategory(category, posts)] : [];
        });

        return (
          <div role="group" key={year}>
            <Heading as="h3" className={yearGroupHeadingClassName}>
              {year}
            </Heading>
            {sidebarCategories.length > 0 && (
              <ul className="menu__list">
                <DocSidebarItems items={sidebarCategories} activePath={pathname} level={1} />
              </ul>
            )}
            {otherItems.length > 0 && <ListComponent items={otherItems} />}
          </div>
        );
      })}
    </>
  );
}
