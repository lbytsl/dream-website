import React, { useRef, useState } from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./cooperation.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
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

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .from("[data-coop-kicker]", { autoAlpha: 0, y: 16, duration: .65 })
          .from("[data-coop-title] > span", { autoAlpha: 0, yPercent: 105, duration: .95, stagger: .12 }, "-=.35")
          .from("[data-coop-copy], [data-coop-action]", { autoAlpha: 0, y: 24, duration: .75, stagger: .1 }, "-=.45")
          .from("[data-coop-signal]", { autoAlpha: 0, scale: .94, y: 28, duration: .9 }, "-=.65");

        gsap.to(`.${styles.signalGlow}`, { rotation: 360, duration: 22, repeat: -1, ease: "none" });

        gsap.utils.toArray<HTMLElement>("[data-coop-reveal]").forEach((element, index) => {
          gsap.from(element, {
            autoAlpha: 0,
            y: 48,
            duration: .9,
            delay: Math.min(index % 3, 2) * .06,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 86%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

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
      <div ref={root} className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p data-coop-kicker>AVAILABLE FOR SELECTED PROJECTS · 2026</p>
            <h1 data-coop-title>
              <span>把 AI 能力</span>
              <span>变成<span className={styles.accent}>可交付产品。</span></span>
            </h1>
            <p className={styles.lead} data-coop-copy>我负责从需求拆解、技术方案到产品上线的完整链路。适合已有明确业务问题，希望快速验证并真正投入使用的团队。</p>
            <button type="button" className={styles.heroButton} onClick={copyWechat} data-coop-action data-umami-event="cooperation-hero-copy">
              {copied ? "已复制微信号" : "复制微信，开始沟通"} <span aria-hidden="true">{copied ? "✓" : "→"}</span>
            </button>
          </div>

          <aside className={styles.signal} data-coop-signal aria-label="微信联系方式">
            <div className={styles.signalGlow} aria-hidden="true" />
            <div className={styles.signalTop}><span><i /> COOPERATION SIGNAL</span><b>ONLINE</b></div>
            <div className={styles.qrFrame}>
              <img src="/img/contact/wechat-qr.png" alt="Dream 的微信二维码，微信号 jyg031119" />
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
            <p>CAPABILITIES / 01</p>
            <h2 id="services-title">可以一起完成什么</h2>
          </div>
          <div className={styles.serviceList}>
            {services.map(([number, title, copy]) => (
              <article key={number} data-coop-reveal>
                <span>{number}</span><h3>{title}</h3><p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.caseStudy} aria-labelledby="case-title">
          <div className={styles.caseCopy} data-coop-reveal>
            <p>SELECTED CASE / 02</p>
            <h2 id="case-title">智绘创联<br /><span>MindWeave</span></h2>
            <p>我独立完成的 AIGC 全场景效率工具平台，覆盖产品设计、前后端、AI 工作流、支付、权限、对象存储与部署。</p>
            <a href="https://link.mindweave.top/#/" target="_blank" rel="noreferrer" data-umami-event="mindweave-live-site">访问线上产品 <span>↗</span></a>
          </div>
          <div className={styles.caseVisual} data-coop-reveal aria-label="MindWeave 产品能力示意">
            <div className={styles.productBar}><i /><i /><i /><span>link.mindweave.top</span></div>
            <div className={styles.productCanvas}>
              <div className={styles.productNav}><b>智绘创联</b><span>AI 工具</span><span>使用记录</span><span>积分中心</span></div>
              <div className={styles.productMain}>
                <p>SQL → ER DIAGRAM</p><h3>让数据库设计<br />即刻可视化</h3>
                <div className={styles.miniSchema}><span>SQL DDL</span><i>→</i><span>ER GRAPH</span></div>
              </div>
            </div>
          </div>
          <div className={styles.delivery} data-coop-reveal>
            <span>VUE · ELEMENT PLUS · ECHARTS</span>
            <span>SPRING BOOT · SECURITY · JWT</span>
            <span>MYSQL · REDIS · OSS · ALIPAY</span>
          </div>
        </section>

        <section className={styles.process} aria-labelledby="process-title">
          <div data-coop-reveal><p>WORKING TOGETHER / 03</p><h2 id="process-title">先把问题说清楚，<br />再把产品做扎实。</h2></div>
          <ol>
            <li data-coop-reveal><span>01</span><div><h3>需求诊断</h3><p>明确用户、场景、数据与成功标准，判断 AI 是否真的适合。</p></div></li>
            <li data-coop-reveal><span>02</span><div><h3>方案与原型</h3><p>给出技术路线、边界、里程碑与可操作的产品原型。</p></div></li>
            <li data-coop-reveal><span>03</span><div><h3>开发与交付</h3><p>迭代开发、验证质量，完成部署、文档与后续维护交接。</p></div></li>
          </ol>
        </section>

        <section className={styles.finalCta} data-coop-reveal>
          <p>HAVE A REAL PROBLEM TO SOLVE?</p>
          <h2>把你的想法<br />发给我看看。</h2>
          <button type="button" onClick={copyWechat} data-umami-event="cooperation-final-copy">{copied ? "微信号已复制 ✓" : "复制微信号 jyg031119"}</button>
          <Link to="/privacy">查看访问统计与隐私说明</Link>
        </section>
      </div>
    </Layout>
  );
}
