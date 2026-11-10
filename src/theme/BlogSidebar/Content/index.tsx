import React, { type ReactNode } from "react";
import { useLocation } from "@docusaurus/router";
import { groupBlogSidebarItemsByYear } from "@docusaurus/plugin-content-blog/client";
import DocSidebarItems from "@theme/DocSidebarItems";
import Heading from "@theme/Heading";
import type { Props } from "@theme/BlogSidebar/Content";
import type { PropSidebarItemCategory } from "@docusaurus/plugin-content-docs";

/** 在各年份内建立专题分类，侧栏短名不改变文章完整标题。 */
function createKnowledgeCategory(items: Props["items"]): PropSidebarItemCategory {
  return {
    type: "category",
    label: "知识库",
    collapsible: true,
    collapsed: false,
    // 侧栏使用专题短名；完整标题保留在正文，便于同时查看其他文章。
    items: items.map((item) => {
      const order = item.permalink.match(/\/(\d{2})-/)?.[1];
      const title = item.permalink.endsWith("/11-overview")
        ? "总论与架构选型"
        : item.title.split("：")[0];
      return {
        type: "link",
        label: order ? `${order} · ${title}` : title,
        href: item.permalink,
      };
    }),
  };
}

/** 保持年份为首层，知识库分类与同年的其他文章并列。 */
export default function BlogSidebarContent({
  items,
  ListComponent,
  yearGroupHeadingClassName,
}: Props): ReactNode {
  const { pathname } = useLocation();
  return (
    <>
      {groupBlogSidebarItemsByYear(items).map(([year, yearItems]) => {
        const knowledgeItems = yearItems
          .filter((item) => item.permalink.includes("/blog/knowledge-base/"))
          .sort((left, right) => left.permalink.localeCompare(right.permalink));
        const otherItems = yearItems.filter(
          (item) => !item.permalink.includes("/blog/knowledge-base/"),
        );

        return (
          <div role="group" key={year}>
            <Heading as="h3" className={yearGroupHeadingClassName}>
              {year}
            </Heading>
            {knowledgeItems.length > 0 && (
              <ul className="menu__list">
                <DocSidebarItems
                  items={[createKnowledgeCategory(knowledgeItems)]}
                  activePath={pathname}
                  level={1}
                />
              </ul>
            )}
            {otherItems.length > 0 && <ListComponent items={otherItems} />}
          </div>
        );
      })}
    </>
  );
}
