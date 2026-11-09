import React, { useRef, useState } from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./cooperation.module.css";
import studio from "../css/studio.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

const services = [
  ["01", "RAG 知识库开发", "从数据清洗、检索策略到评测与上线，构建真正回答得准的企业知识系统。"],
  ["02", "AI Agent 开发", "围绕业务目标设计工具调用、工作流、记忆与安全边界。"],
  ["03", "企业 AI 应用咨询", "梳理场景、技术路线与投入边界，找到值得落地的 AI 机会。"],
  ["04", "Prompt 优化与评测", "建立可测试、可比较、可迭代的 Prompt 质量工程流程。"],
  ["05", "全栈产品开发", "网站、小程序与 App，从交互原型、前后端到部署交付。"],
];

export default function CooperationPage(): React.ReactNode {
  const root = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // 联系方式与服务内容默认可见，首屏只做轻量位移。
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-coop-copy], [data-coop-action]", {
        y: 12, duration: .6, stagger: .08, ease: "expo.out", clearProps: "transform",
      });
    });
    return () => mm.revert();
  }, { scope: root });

  const copyWechat = async () => {
    try {
      await navigator.clipboard.writeText("jyg031119");
    } catch {
      const input = document.createElement("textarea");
      input.value = "jyg031119";
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2400);
  };

  return (
    <Layout title="合作咨询" description="RAG、AI Agent、Prompt 工程与全栈 AI 产品开发合作。">
      <Head>
        <meta property="og:title" content="合作咨询｜Dream AI 全栈开发" />
        <meta property="og:description" content="把 AI 能力变成可交付产品：RAG、Agent、Prompt 评测与全栈开发。" />
      </Head>
      <div ref={root} className={studio.page}>
        <section className={styles.hero}>
          <div>
            <h1 data-coop-title>
              <span>把 AI 能力</span>
              <span>变成<span className={styles.accent}>可交付产品。</span></span>
            </h1>
            <p className={styles.lead} data-coop-copy>我负责从需求拆解、技术方案到产品上线的完整链路。适合已有明确业务问题，希望快速验证并真正投入使用的团队。</p>
            <button aria-live="polite" type="button" className={styles.heroButton} onClick={copyWechat} data-coop-action data-umami-event="cooperation-hero-copy">
              {copied ? "已复制微信号" : "复制微信，开始沟通"} <span aria-hidden="true">{copied ? "✓" : "→"}</span>
            </button>
          </div>

          <aside className={styles.signal} data-coop-signal aria-label="微信联系方式">
            <h2 className={styles.signalTop}>微信联系</h2>
            <div className={styles.qrFrame}>
              <img src="/img/contact/wechat-qr.png" alt="Dream 的微信二维码，微信号 jyg031119" width="400" height="400" />
            </div>
            <div className={styles.wechatRow}>
              <div><span>WECHAT ID</span><strong>jyg031119</strong></div>
              <button type="button" onClick={copyWechat} data-umami-event="cooperation-wechat-copy" aria-live="polite">{copied ? "已复制 ✓" : "一键复制"}</button>
            </div>
            <p>添加时请简单备注「合作方向 + 你的称呼」，我会更快理解需求。</p>
          </aside>
        </section>

        <section className={styles.services} aria-labelledby="services-title">
          <div className={styles.sectionIntro} data-coop-reveal>
            <h2 id="services-title">可以一起完成什么</h2>
          </div>
          <div className={styles.serviceList}>
            {services.map(([number, title, copy]) => (
              <article key={number} data-coop-reveal>
                <h3>{title}</h3><p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.process} aria-labelledby="process-title">
          <div data-coop-reveal><h2 id="process-title">先把问题说清楚，<br />再把产品做扎实。</h2></div>
          <ol>
            <li data-coop-reveal><span>01</span><div><h3>需求诊断</h3><p>明确用户、场景、数据与成功标准，判断 AI 是否真的适合。</p></div></li>
            <li data-coop-reveal><span>02</span><div><h3>方案与原型</h3><p>给出技术路线、边界、里程碑与可操作的产品原型。</p></div></li>
            <li data-coop-reveal><span>03</span><div><h3>开发与交付</h3><p>迭代开发、验证质量，完成部署、文档与后续维护交接。</p></div></li>
          </ol>
        </section>

        <section className={styles.finalCta} data-coop-reveal>
          <h2>把你的想法<br />发给我看看。</h2>
          <button type="button" onClick={copyWechat} data-umami-event="cooperation-final-copy">{copied ? "微信号已复制 ✓" : "复制微信号 jyg031119"}</button>
          <Link to="/privacy">查看访问统计与隐私说明</Link>
        </section>
      </div>
    </Layout>
  );
}
