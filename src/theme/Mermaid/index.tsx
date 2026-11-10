import React, { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import OriginalMermaid from "@theme-original/Mermaid";
import type { Props } from "@theme/Mermaid";
import { useLocation } from "@docusaurus/router";
import { useArticleMediaViewer } from "@site/src/components/ArticleMediaViewer";
import styles from "@site/src/components/ArticleMediaViewer/styles.module.css";

/** 保持流程图原有字号，并支持滚动及与正文图片一致的大图阅读。 */
export default function ArticleMermaid(props: Props): ReactNode {
  const hostRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>();
  const open = useArticleMediaViewer();
  const { pathname } = useLocation();
  const isArticle = pathname.startsWith("/blog/");

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !isArticle) return;
    const update = () => {
      const diagram = host.querySelector("svg");
      if (diagram?.viewBox.baseVal.width) setWidth(diagram.viewBox.baseVal.width);
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(host, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [props.value, isArticle]);

  if (!isArticle) return <OriginalMermaid {...props} />;
  const enlarge = () => {
    const diagram = hostRef.current?.querySelector("svg");
    if (!diagram) return;
    const bounds = diagram.viewBox.baseVal;
    const copy = diagram.cloneNode(true) as SVGSVGElement;
    copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    copy.setAttribute("width", String(bounds.width));
    copy.setAttribute("height", String(bounds.height));
    copy.style.maxWidth = "none";
    copy.style.width = `${bounds.width}px`;
    const source = new XMLSerializer().serializeToString(copy);
    open({ src: URL.createObjectURL(new Blob([source], { type: "image/svg+xml;charset=utf-8" })), label: "流程图详情", width: bounds.width, height: bounds.height, temporary: true });
  };
  return (
    <div className={styles.diagram}>
      <div className={styles.diagramBar}>
        <span>流程图 · 可滚动查看</span>
        <button type="button" onClick={enlarge}>放大查看</button>
      </div>
      <div ref={hostRef} className={styles.diagramViewport} style={{ "--diagram-width": width ? `${width}px` : "100%" } as CSSProperties} onClick={(event) => {
        if (!(event.target as Element).closest("a")) enlarge();
      }}>
        <OriginalMermaid {...props} />
      </div>
    </div>
  );
}
