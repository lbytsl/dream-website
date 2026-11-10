import React, { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useLocation } from "@docusaurus/router";
import styles from "./styles.module.css";

/** 图片与渲染后流程图共用的预览资料；临时 SVG 地址随预览释放。 */
export interface ArticleMedia {
  src: string;
  label: string;
  width: number;
  height: number;
  temporary?: boolean;
}

const ViewerContext = createContext<(media: ArticleMedia) => void>(() => {});

/** 供文章图片和 Mermaid 工具栏打开同一个大图阅读器。 */
export function useArticleMediaViewer(): (media: ArticleMedia) => void {
  return useContext(ViewerContext);
}

/** 用原生对话框管理焦点，缩放仅影响当前预览，不改变正文布局。 */
function MediaDialog({ media, onClose }: { media: ArticleMedia; onClose: () => void }): ReactNode {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [failed, setFailed] = useState(false);
  const titleId = useId();
  const helpId = useId();

  const fit = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    setScale(Math.max(0.01, Math.min(Math.max(1, viewport.clientWidth - 48) / media.width, Math.max(1, viewport.clientHeight - 48) / media.height, 1)));
    viewport.scrollTo(0, 0);
  }, [media.width, media.height]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const focused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    fit();
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (focused?.isConnected) focused.focus({ preventScroll: true });
    };
  }, [fit]);

  // 缩放后保持视口中心对应同一位置，避免读者不断重新定位。
  const zoom = (factor: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const next = Math.max(0.1, Math.min(4, scale * factor));
    const ratio = next / scale;
    const left = (viewport.scrollLeft + viewport.clientWidth / 2) * ratio - viewport.clientWidth / 2;
    const top = (viewport.scrollTop + viewport.clientHeight / 2) * ratio - viewport.clientHeight / 2;
    setScale(next);
    requestAnimationFrame(() => viewport.scrollTo(Math.max(0, left), Math.max(0, top)));
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      aria-describedby={helpId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      onKeyDown={(event) => {
        if (event.key === "+" || event.key === "=") { event.preventDefault(); zoom(1.25); }
        if (event.key === "-") { event.preventDefault(); zoom(0.8); }
        if (event.key === "0") { event.preventDefault(); fit(); }
      }}
    >
      <header className={styles.header}>
        <strong id={titleId} className={styles.title}>{media.label}</strong>
        <button type="button" className={styles.close} onClick={onClose} autoFocus>关闭</button>
      </header>
      <div className={styles.toolbar} role="group" aria-label="图片缩放">
        <button type="button" onClick={() => zoom(0.8)} disabled={scale <= 0.1} aria-label="缩小图片">缩小</button>
        <output aria-live="polite">{Math.round(scale * 100)}%</output>
        <button type="button" onClick={() => zoom(1.25)} disabled={scale >= 4} aria-label="放大图片">放大</button>
        <button type="button" onClick={fit}>适应窗口</button>
        <button type="button" onClick={() => setScale(1)}>原始大小</button>
        <a href={media.src} target="_blank" rel="noopener noreferrer">打开原图</a>
      </div>
      <p id={helpId} className={styles.help}>放大后可拖动或滚动查看；按 Esc 关闭，+ / − 缩放，0 适应窗口。</p>
      <div
        ref={viewportRef}
        className={`${styles.viewport} ${dragging ? styles.dragging : ""}`}
        tabIndex={0}
        aria-label="大图查看区域，可滚动查看细节"
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse" || event.button !== 0 || (event.target as Element).closest("a")) return;
          const viewport = event.currentTarget;
          dragRef.current = { x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
          viewport.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onPointerMove={(event) => {
          const start = dragRef.current;
          if (!start) return;
          event.currentTarget.scrollLeft = start.left - (event.clientX - start.x);
          event.currentTarget.scrollTop = start.top - (event.clientY - start.y);
        }}
        onPointerUp={(event) => {
          dragRef.current = null;
          setDragging(false);
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => { dragRef.current = null; setDragging(false); }}
      >
        {failed ? <p role="alert" className={styles.error}>图片加载失败，可关闭后重试或打开原图。</p> : (
          <div className={styles.surface}>
            <img src={media.src} alt={media.label} draggable={false} style={{ width: media.width * scale, height: media.height * scale }} onError={() => setFailed(true)} />
          </div>
        )}
      </div>
    </dialog>
  );
}

/** 文章切换时关闭预览，回收由 Mermaid 生成的临时图像。 */
export default function ArticleMediaViewer({ children }: { children: ReactNode }): ReactNode {
  const [media, setMedia] = useState<ArticleMedia | null>(null);
  const { pathname } = useLocation();
  const close = useCallback(() => setMedia(null), []);
  const open = useCallback((next: ArticleMedia) => {
    // 打包器可能内嵌小图；改用 Blob 地址，让“打开原图”可在新标签页查看。
    if (next.src.startsWith("data:image/")) {
      const separator = next.src.indexOf(",");
      const metadata = next.src.slice(5, separator);
      const content = next.src.slice(separator + 1);
      try {
        const bytes = metadata.endsWith(";base64")
          ? Uint8Array.from(atob(content), (character) => character.charCodeAt(0))
          : decodeURIComponent(content);
        const src = URL.createObjectURL(new Blob([bytes], { type: metadata.split(";")[0] }));
        setMedia({ ...next, src, temporary: true });
        return;
      } catch {
        // 非标准 data URL 仍可尝试预览，避免单张图片影响正文交互。
      }
    }
    setMedia(next);
  }, []);
  useEffect(() => { setMedia(null); }, [pathname]);
  useEffect(() => () => { if (media?.temporary) URL.revokeObjectURL(media.src); }, [media]);
  return <ViewerContext.Provider value={open}>{children}{media && <MediaDialog key={media.src} media={media} onClose={close} />}</ViewerContext.Provider>;
}
