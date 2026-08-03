import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "@docusaurus/router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./MobileToc.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

type TocHeading = {
  id: string;
  level: number;
  text: string;
};

export default function MobileToc(): React.ReactNode {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLButtonElement>(null);
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState("");
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    setHeadings([]);
    setActiveId("");

    let syncFrame = 0;
    const syncHeadings = () => {
      cancelAnimationFrame(syncFrame);
      syncFrame = requestAnimationFrame(() => {
        const nextHeadings = Array.from(
          document.querySelectorAll<HTMLElement>("article h2[id], article h3[id]"),
        )
          .filter((heading) => heading.textContent?.trim())
          .map((heading) => ({
            id: heading.id,
            level: Number(heading.tagName.slice(1)),
            text: heading.textContent!.replace(/#$/, "").trim(),
          }));
        setHeadings(nextHeadings);
        setActiveId((current) =>
          nextHeadings.some((heading) => heading.id === current)
            ? current
            : (nextHeadings[0]?.id ?? ""),
        );
      });
    };

    syncHeadings();
    const observer = new MutationObserver(syncHeadings);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(syncFrame);
    };
  }, [location.pathname]);

  useGSAP(
    () => {
      if (!panel.current || !backdrop.current) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.to(backdrop.current, {
        autoAlpha: open ? 1 : 0,
        duration: reduced ? 0 : 0.24,
        pointerEvents: open ? "auto" : "none",
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(panel.current, {
        autoAlpha: open ? 1 : 0,
        yPercent: open ? 0 : 12,
        scale: open ? 1 : 0.97,
        duration: reduced ? 0 : 0.36,
        pointerEvents: open ? "auto" : "none",
        ease: open ? "power3.out" : "power2.in",
        overwrite: "auto",
      });
    },
    { scope: root, dependencies: [open] },
  );

  useGSAP(
    () => {
      if (headings.length === 0 || window.matchMedia("(min-width: 997px)").matches) return;
      const triggers = headings.map((heading) => {
        const element = document.getElementById(heading.id);
        if (!element) return null;
        return ScrollTrigger.create({
          trigger: element,
          start: "top 34%",
          end: "bottom 34%",
          onEnter: () => setActiveId(heading.id),
          onEnterBack: () => setActiveId(heading.id),
        });
      });
      return () => triggers.forEach((trigger) => trigger?.kill());
    },
    { dependencies: [headings] },
  );

  const navigateToHeading = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    setOpen(false);
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 78,
      behavior: "auto",
    });
    window.history.replaceState(null, "", `#${id}`);
  };

  if (headings.length === 0) return null;

  return (
    <div ref={root} className={styles.root}>
      <button
        ref={backdrop}
        type="button"
        className={styles.backdrop}
        onClick={() => setOpen(false)}
        aria-label="关闭本页目录"
        tabIndex={open ? 0 : -1}
      />
      <div
        ref={panel}
        id="mobile-page-toc"
        className={styles.panel}
        aria-hidden={!open}
      >
        <div className={styles.panelHead}>
          <div><span>ON THIS PAGE</span><strong>本页目录</strong></div>
          <button type="button" onClick={() => setOpen(false)} aria-label="关闭本页目录">×</button>
        </div>
        <nav className={styles.list} aria-label="本页章节">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`${styles.item} ${heading.level === 3 ? styles.subItem : ""} ${activeId === heading.id ? styles.active : ""}`}
              onClick={(event) => navigateToHeading(event, heading.id)}
              tabIndex={open ? 0 : -1}
            >
              <i aria-hidden="true" />
              <span>{heading.text}</span>
            </a>
          ))}
        </nav>
      </div>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-page-toc"
      >
        <span aria-hidden="true"><i /><i /><i /></span>
        <strong>目录</strong>
        <small>{headings.length}</small>
      </button>
    </div>
  );
}
