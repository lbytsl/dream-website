---
slug: 19-structured-handoff
title: Codex 19｜用 codex exec 生成下一步能读取的交接报告
authors: [lbytsl]
tags: [codex-tips, tools]
date: 2026-11-25
description: 在非交互式 codex exec 中约束最终报告的字段和值，让脚本能识别「未验证」，同时保留结论的证据。
image: /img/blog-covers/codex-tips.svg
---

发稿检查的结论是「看起来没问题，除了链接还没验」。对人来说勉强够读，对下一步脚本来说，「没问题」和「没验」却是两种完全不同的状态。

{/* truncate */}

本篇聚焦 `codex exec` 的交接报告示例。跨工具的方法和练习见[通用技巧](/blog/general-tips/09-structured-cli-results)。

## 技巧：用 JSON Schema 约束最终答复

**在非交互式 `codex exec` 中约束最终报告的字段和值，让脚本能识别「未验证」，同时保留结论的证据。**

## 原理与适用场景

非交互式指运行一次指令、拿一次输出。JSON Schema 描述输出应当长什么样，不保证内容真实。本例用它把一份人工留下的检查记录转成交接单，不让模型执行测试、决定发布或自动合并。需要已登录的 CLI、可信 Git 练习仓库，以及当前版本支持的相关选项。

## 低效写法与问题

> 总结一下这次发稿，语气肯定一点。下一个脚本搜索「通过」两个字就行。

「还没通过」「测试通过但链接未检查」都含「通过」。靠关键词筛选，最危险的不是解析出错，而是看起来成功却丢了未验证事项。

## 正确做法与代码解释

在根目录新建 `notes.txt`，只写「字段检查已通过；尚未运行读者入口检查」。再把下面存成 `handoff.schema.json`：

```json
{
  "type": "object",
  "properties": {
    "readerCheck": {"type":"string", "enum":["passed","failed","not_run"]},
    "evidence": {"type":"string"}
  },
  "required": ["readerCheck", "evidence"],
  "additionalProperties": false
}
```

```sh
codex exec --sandbox read-only --output-schema handoff.schema.json -o handoff.json "只读 notes.txt。提取读者入口检查的状态和对应原句。没有执行就填 not_run；不要自行测试。"
```

`--output-schema` 约束最终消息，`-o` 让 CLI 把它写入指定文件，不是让模型编辑仓库。期望 `readerCheck` 是 `not_run`，`evidence` 指向「尚未运行读者入口检查」。下一步程序只接受明确的 `passed`，其余停下来交给人；不要因 JSON 能解析就断言入口正常。

## 关键点与常见陷阱

- `--json` 的逐行事件流与这里的一份最终 JSON 不是同一种输入。没有成功结束时，别拿上次残留的报告当新结果。
- 字段符合架构也可能引用错句。尤其是 `passed`，要对照本次命令输出或可信记录，不把模型自述当发布凭证。

## 动手练习与小挑战

**练习：** 保留样例原句，让 Codex 生成报告，用 `node -p "require('./handoff.json').readerCheck"` 单独读取字段。输出应是 `not_run` 而不是 `passed`。

**小挑战：** 把笔记改成「打开读者入口得到 404」，输出到另一个文件。新报告应为 `failed`，旧报告仍然是 `not_run`；两者都不等于已修好。

## 延伸阅读与相关技巧

- [OpenAI：非交互模式和结构化最终输出](https://learn.chatgpt.com/docs/non-interactive-mode)。
- [17 · 让脚本产生确定的检查结果](/blog/codex-tips/17-skill-script) 提供可信输入；[20 · 验收读者真实路径](/blog/codex-tips/20-reader-smoke-test) 提供值得交接的证据。

[返回「Codex 使用技巧」系列目录](/blog/codex-tips)
