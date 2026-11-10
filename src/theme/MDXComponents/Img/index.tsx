import React, { useRef, type ReactNode } from "react";
import OriginalImg from "@theme-original/MDXComponents/Img";
import { useLocation } from "@docusaurus/router";
import type { Props } from "@theme/MDXComponents/Img";
import { useArticleMediaViewer } from "@site/src/components/ArticleMediaViewer";
import styles from "@site/src/components/ArticleMediaViewer/styles.module.css";

/** 为博文正文图片提供可键盘操作的放大入口，保留原主题的图片属性。 */
export default function ArticleImage(props: Props): ReactNode {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const open = useArticleMediaViewer();
  const { pathname } = useLocation();
  if (!pathname.startsWith("/blog/")) return <OriginalImg {...props} />;
  return (
    <span className={styles.imageFrame}>
      <button ref={buttonRef} type="button" className={styles.imageButton} aria-label={`放大查看：${props.alt || "文章插图"}`} onClick={() => {
        const image = buttonRef.current?.querySelector("img");
        if (image) open({ src: image.currentSrc || image.src, label: image.alt || "文章插图", width: image.naturalWidth || 1024, height: image.naturalHeight || 768 });
      }}>
        <OriginalImg {...props} />
        <span className={styles.imageHint} aria-hidden="true">点击放大</span>
      </button>
    </span>
  );
}
