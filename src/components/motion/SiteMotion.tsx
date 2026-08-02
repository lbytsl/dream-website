import React, { useRef } from "react";
import { useLocation } from "@docusaurus/router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./SiteMotion.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function SiteMotion({ children }: { children: React.ReactNode }): React.ReactNode {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const transition = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useGSAP(
    (context) => {
      const scope = root.current;
      if (!scope) return;

      const mm = gsap.matchMedia();
      const article = scope.querySelector<HTMLElement>("article");
      const navbar = scope.querySelector<HTMLElement>(".navbar");

      gsap.timeline({ defaults: { ease: "power3.inOut" } })
        .set(transition.current, { transformOrigin: "right center", scaleX: 1 })
        .to(transition.current, { scaleX: 0, duration: 0.62 });

      if (navbar) {
        const navY = gsap.quickTo(navbar, "yPercent", { duration: 0.42, ease: "power3.out" });
        ScrollTrigger.create({
          start: 80,
          end: "max",
          onUpdate: (self) => navY(self.direction > 0 && self.scroll() > 140 ? -112 : 0),
        });
      }

      if (article && progress.current) {
        gsap.set(progress.current, { scaleX: 0, autoAlpha: 1 });
        const setProgress = gsap.quickSetter(progress.current, "scaleX");
        ScrollTrigger.create({
          trigger: article,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => setProgress(self.progress),
        });

        const sections = gsap.utils.toArray<HTMLElement>(
          article.querySelectorAll("h2, h3, blockquote, .theme-code-block, [class*='codeBlockContainer']"),
        ).slice(0, 48);

        sections.forEach((section, index) => {
          gsap.from(section, {
            opacity: 0,
            y: index % 3 === 0 ? 28 : 20,
            duration: 0.72,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 88%", once: true },
          });
        });

        const codeBlocks = gsap.utils.toArray<HTMLElement>(
          article.querySelectorAll(".theme-code-block, [class*='codeBlockContainer']"),
        );
        codeBlocks.forEach((block) => {
          gsap.set(block, { transformPerspective: 900, transformOrigin: "center center" });
          const yTo = gsap.quickTo(block, "y", { duration: 0.32, ease: "power2.out" });
          const scaleTo = gsap.quickTo(block, "scale", { duration: 0.32, ease: "power2.out" });
          const enter = () => { yTo(-4); scaleTo(1.006); };
          const leave = () => { yTo(0); scaleTo(1); };
          block.addEventListener("pointerenter", enter);
          block.addEventListener("pointerleave", leave);
          context.add(() => {
            block.removeEventListener("pointerenter", enter);
            block.removeEventListener("pointerleave", leave);
          });
        });
      } else {
        gsap.set(progress.current, { autoAlpha: 0 });
      }

      mm.add(
        {
          desktop: "(min-width: 997px) and (pointer: fine)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (mediaContext) => {
          const { desktop, motion } = mediaContext.conditions as { desktop: boolean; motion: boolean };
          if (!desktop || !motion || !cursor.current) return;

          gsap.set(cursor.current, { autoAlpha: 1 });
          const cursorX = gsap.quickTo(cursor.current, "x", { duration: 0.16, ease: "power3.out" });
          const cursorY = gsap.quickTo(cursor.current, "y", { duration: 0.16, ease: "power3.out" });
          const cursorScale = gsap.quickTo(cursor.current, "scale", { duration: 0.25, ease: "power3.out" });
          const moveCursor = (event: PointerEvent) => { cursorX(event.clientX); cursorY(event.clientY); };
          const hoverCursor = (event: PointerEvent) => {
            cursorScale((event.target as HTMLElement).closest("a, button, input, [data-interactive]") ? 1.8 : 1);
          };
          window.addEventListener("pointermove", moveCursor, { passive: true });
          window.addEventListener("pointerover", hoverCursor, { passive: true });

          const magneticCleanup: Array<() => void> = [];
          gsap.utils.toArray<HTMLElement>("[data-magnetic]", scope).forEach((button) => {
            let rect = button.getBoundingClientRect();
            const xTo = gsap.quickTo(button, "x", { duration: 0.38, ease: "power3.out" });
            const yTo = gsap.quickTo(button, "y", { duration: 0.38, ease: "power3.out" });
            const enter = () => { rect = button.getBoundingClientRect(); };
            const move = (event: PointerEvent) => {
              xTo((event.clientX - rect.left - rect.width / 2) * 0.22);
              yTo((event.clientY - rect.top - rect.height / 2) * 0.22);
            };
            const leave = () => { xTo(0); yTo(0); };
            button.addEventListener("pointerenter", enter);
            button.addEventListener("pointermove", move, { passive: true });
            button.addEventListener("pointerleave", leave);
            magneticCleanup.push(() => {
              button.removeEventListener("pointerenter", enter);
              button.removeEventListener("pointermove", move);
              button.removeEventListener("pointerleave", leave);
            });
          });

          return () => {
            window.removeEventListener("pointermove", moveCursor);
            window.removeEventListener("pointerover", hoverCursor);
            magneticCleanup.forEach((cleanup) => cleanup());
          };
        },
      );

      const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        cancelAnimationFrame(refreshFrame);
        mm.revert();
      };
    },
    { scope: root, dependencies: [location.pathname], revertOnUpdate: true },
  );

  return (
    <div ref={root} className={styles.root}>
      <div ref={progress} className={styles.progress} aria-hidden="true" />
      <div ref={transition} className={styles.transition} aria-hidden="true" />
      <div ref={cursor} className={styles.cursor} aria-hidden="true" />
      {children}
    </div>
  );
}
