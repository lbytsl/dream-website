import React, { useEffect, useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { loadVisitStats, type VisitStatsConfig, type VisitStats } from "./umami";
import styles from "./styles.module.css";

const numberFormat = new Intl.NumberFormat("zh-CN", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function SiteVisitStats({ mobile = false }: { mobile?: boolean }) {
  const { siteConfig } = useDocusaurusContext();
  const config = siteConfig.customFields?.visitStats as VisitStatsConfig | undefined;
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (mobile) return;
    let active = true;
    let controller: AbortController | undefined;
    async function refresh() {
      controller = new AbortController();
      const timeout = window.setTimeout(() => controller?.abort(), 12_000);
      try {
        const data = await loadVisitStats(config, controller.signal);
        if (active) {
          setStats(data);
          setState("ready");
        }
      } catch {
        if (active) {
          setStats(null);
          setState("error");
        }
      } finally {
        window.clearTimeout(timeout);
      }
    }
    void refresh();
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, 300_000);
    return () => {
      active = false;
      controller?.abort();
      window.clearInterval(interval);
    };
  }, [config, mobile]);

  if (mobile) return null;

  const description = stats
    ? `浏览量 ${stats.pageviews.toLocaleString("zh-CN")}，今日访客 ${stats.todayVisitors.toLocaleString("zh-CN")}；今日按北京时间统计。浏览量覆盖 Umami 当前保留的记录。更新于 ${new Date(stats.updatedAt).toLocaleTimeString("zh-CN", { timeZone: "Asia/Shanghai", hour12: false })}。`
    : state === "error" ? "访问统计暂不可用" : "正在加载访问统计";

  return (
    <div className={styles.stats} title={description} role="group" aria-label={description}>
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M3 17V9m6 8V5m6 12v-6m6 10H3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={styles.metric}>
        <span className={styles.label}>浏览量</span>
        <strong>{stats ? numberFormat.format(stats.pageviews) : "—"}</strong>
      </span>
      <span className={styles.divider} aria-hidden="true" />
      <span className={styles.metric}>
        <span className={styles.label}>今日访客</span>
        <strong>{stats ? numberFormat.format(stats.todayVisitors) : "—"}</strong>
      </span>
      <span className={styles.srOnly} role="status">{state === "error" ? "统计暂不可用" : state === "loading" ? "统计加载中" : ""}</span>
    </div>
  );
}
