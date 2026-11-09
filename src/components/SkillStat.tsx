import React, { useEffect, useState } from "react";
import snapshot from "@site/static/data/skill-stats.json";
import { loadSkillStars, type StarCount } from "./skillStars";

/** 统计快照保留来源精度，更新时间只代表本站成功读取的时刻。 */
type SkillStats = { repo: string; installs?: { display: string; updatedAt: string }; stars?: StarCount };
const data: Record<string, SkillStats> = snapshot;

/** 固定使用北京时间，避免服务器和访问者所在时区导致显示不一致。 */
function formatChinaTime(iso: string): string {
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}`;
}

/** 在技能详情表中展示统计、来源及更新时间，Star 在可见页面按小时刷新。 */
export default function SkillStat({ skill, metric }: { skill: string; metric: "installs" | "stars" }) {
  const entry = data[skill];
  const [stars, setStars] = useState(entry?.stars);
  useEffect(() => {
    setStars(entry?.stars);
    if (metric !== "stars" || !entry) return;
    let active = true;
    const refresh = () => {
      if (document.visibilityState === "hidden") return;
      void loadSkillStars(entry.repo, entry.stars).then((next) => { if (active) setStars(next); });
    };
    refresh();
    const timer = window.setInterval(refresh, 60000);
    document.addEventListener("visibilitychange", refresh);
    return () => { active = false; clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
  }, [skill, metric, entry]);

  const stat = metric === "installs" ? entry?.installs : stars;
  const value = metric === "installs" ? entry?.installs?.display : stars?.value.toLocaleString("en-US");
  const href = metric === "installs" ? `https://skills.sh/${skill}` : `https://github.com/${entry?.repo}`;
  return (
    <span>
      {stat ? <a href={href} target="_blank" rel="noopener noreferrer">{value}</a> : "待更新"}
      {stat ? (
        <span title="北京时间（Asia/Shanghai）">{`（更新于${formatChinaTime(stat.updatedAt)}）`}</span>
      ) : (
        <small style={{ display: "block", color: "var(--ifm-color-emphasis-600)", fontSize: "0.75rem" }}>暂未获取到统计</small>
      )}
      <small style={{ display: "block", color: "var(--ifm-color-emphasis-600)", fontSize: "0.75rem" }}>
        {metric === "installs" ? "skills.sh 统计 · 每日同步" : "来源仓库 Star · 每小时刷新"}
      </small>
    </span>
  );
}
