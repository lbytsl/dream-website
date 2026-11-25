---
slug: 09-structured-cli-results
title: 给命令行 AI 任务定义结构化输入与输出
authors: [lbytsl]
tags: [general-tips]
date: 2026-11-26
description: 先筛选输入，再校验输出；区分模型结论、真实验证结果和工具失败。
---

构建失败后，AI 可以帮你提炼错误，但「看起来通过了」不能当作自动化结果。让后续脚本先核对报告结构，再决定如何处理。

{/* truncate */}

## 技巧名称与一句话概括

结构化交接：给一次性任务限定输入范围，并要求固定字段和可核验的证据。

## 核心原理与适用场景

终端日志常包含无关输出，AI 回答也可能夹着解释或缺少字段。用本地命令筛选输入、用解析器校验输出，适合 CI 诊断和任务交接。不用 AI 的一句「成功」代替原始命令退出码。

## 低效写法与问题

> 读完整日志，自由总结；如果结果包含「通过」就继续发布。

「没有通过」同样含有「通过」，截断日志也可能隐藏关键错误。自动流程需要明确区分通过、失败、未验证和报告不可用。

## 正确应用与代码解释

把首条相关错误、执行命令和必要上下文交给工具，要求只返回带 `status` 与 `evidence` 的 JSON。以下校验函数不依赖具体 AI 工具：

```js
function parseReport(text) {
  const report = JSON.parse(text);
  if (!report || !['passed', 'failed', 'not_verified'].includes(report.status)
      || typeof report.evidence !== 'string' || !report.evidence.trim()) {
    throw new Error('报告缺少有效的状态或证据');
  }
  return report;
}
```

解析失败或字段不符合约定时，停止自动消费并保留原始日志。校验只能证明格式正确；是否真的通过，应以原始命令结果和验证记录为准。

## 关键点与常见陷阱

- 不把环境变量、访问令牌和完整数据直接交给模型；先在本地脱敏。
- 模型调用失败和任务验证失败是两件事，别把未知状态默认为通过。

## 动手练习与小挑战

练习：给校验函数输入一个合法报告和两个缺字段的报告。挑战：模拟模型返回 Markdown 代码围栏或截断 JSON，确保自动流程拒绝继续。

## 延伸阅读与相关技巧

- [Codex：用命令行生成结构化交接报告](/blog/codex-tips/19-structured-handoff)
- [WorkBuddy / CodeBuddy：通过管道传递日志](/blog/workbuddy-tips/19-log-pipeline)
