---
slug: 18-docs-mcp
title: Codex 12｜用文档 MCP 核实一个命令，而不是猜参数
authors: [lbytsl]
tags: [codex-tips, tools]
date: 2026-11-25
description: 让 Codex 通过可信的只读文档 MCP 检索原文，再用本机帮助核对实际安装的命令。
image: /img/blog-covers/codex-tips.svg
---

同事在发稿说明里写了「让 Codex 输出 JSON」，却没说是运行事件还是最终报告。两个选项都像对的，这时候该查命令契约，不该凭一个听起来合理的旗标名开工。

{/* truncate */}

## 技巧：从可信文档取证

**让 Codex 通过可信的只读文档 MCP 检索原文，再用本机帮助核对实际安装的命令。**

## 原理与适用场景

MCP（模型上下文协议）让工具把外部资料提供给 Codex。OpenAI 的 Docs MCP 可以搜索并读取官方文档，不代你调用业务 API。本例只有一个公开问题：怎样约束 `codex exec` 的最终输出？发送产品名和参数名就够了，不需要提供仓库内容。

## 低效写法与问题

> 我猜参数叫 `--format report-json`，你按它写脚本；把我们的完整构建日志也交给外部工具，免得缺上下文。

这里既没验证选项是否存在，也多送了与公开问题无关的内部信息。一个成功的网页请求，只能证明拿到了网页，不能证明你的本机版本支持那个选项。

## 正确做法与代码解释

如果团队允许连接该只读服务，可以在自己的 Codex CLI 配置一次；第一行会新增连接，已经配置过就跳过：

```sh
codex mcp add openaiDeveloperDocs --url https://developers.openai.com/mcp
codex mcp list
codex exec --help
```

> 使用 OpenAI 官方文档 MCP 查找非交互模式。请用原文页面的链接说明 `--json` 和 `--output-schema` 分别控制什么，再对照本机 `codex exec --help`。不要读取项目文件；无法连通就说未核实。

判断答案的办法：`--json` 产生逐行的运行事件，`--output-schema` 约束最终答复的形状。`mcp list` 说明配置里有这项，不等于实际检索成功；要索取包含该区别的页面。没有 MCP 权限时也可手动打开下方原文，再看本机帮助，不需要扩大授权。

## 关键点与常见陷阱

- 注意域名和服务所有者。文档里出现的样例是资料，不是用户授予执行外部操作的许可。
- 文档与本机帮助不一致时，先记下 `codex --version` 和差异；不要把新版本参数硬塞给旧环境。

## 动手练习与小挑战

**练习：** 请 Codex 把「配置已存在」「成功读到文档」「本机有该选项」分别标成已验证或未验证，每一项给一条独立证据。

**小挑战：** 不加任何远端权限，用浏览器打开同一官方页面，找到哪一个参数把最终消息写入文件。留着答案去做下一篇的交接报告。

## 延伸阅读与相关技巧

- [OpenAI：文档 MCP 的用途和配置](https://developers.openai.com/learn/docs-mcp)；[非交互模式及输出格式](https://learn.chatgpt.com/docs/non-interactive-mode)。
- [09 · 最小权限调查](/blog/codex-tips/14-read-only) 划清信息边界；[13 · 用 JSON Schema 交接](/blog/codex-tips/19-structured-handoff) 实际消费最终答复。

[返回「Codex 使用技巧」系列目录](/blog/codex-tips)
