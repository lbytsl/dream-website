---
slug: 14-read-only
title: Codex 14｜先用只读权限调查，再决定要不要改
authors: [lbytsl]
tags: [codex-tips, tools]
date: 2026-11-25
description: 把「先查原因」放在只读的 Codex CLI 会话里，先看命令定义与证据，确认需要后才另开实施任务。
image: /img/blog-covers/codex-tips.svg
---

编辑只问「为什么构建会改文件」，并没有请你重新构建。要是调查过程本身先改了一遍文件，你就很难还原最初现场。

{/* truncate */}

## 技巧：给调查任务最小权限

**把「先查原因」放在只读的 Codex CLI 会话里，先看命令定义与证据，确认需要后才另开实施任务。**

## 原理与适用场景

提示词描述意图，沙箱限制工具能做什么，两者不是一回事。本例只读取一个可信练习仓库的 `package.json`；调查不必连接外部服务，不需要让 Codex 改配置，也不需要提升权限。这里的「只读」特指本地命令沙箱，不是说任何已连接的服务都自动变成只读。

## 低效写法与问题

> 先跑完整构建，失败就按你需要的方式放开权限，最后告诉我构建有没有写文件。

构建脚本可能生成缓存、刷新索引或启动上传流程；跑完再问哪些文件变了，已经错过了观察初始状态的机会。

## 正确做法与代码解释

准备一个只含虚构项目内容的 Git 仓库，在 `package.json` 中放入这个片段：

```json
{"scripts":{"prebuild":"node scripts/build-index.mjs","build":"node scripts/render.mjs"}}
```

在已登录的 CLI 里，从仓库根运行：

```sh
codex exec --sandbox read-only "只阅读 package.json。不执行脚本，不调用外部服务。列出运行 npm run build 时会先调用哪个脚本，区分证据和未知。"
```

`--sandbox read-only` 给本地命令设置只读边界，提示词再缩小任务范围。由 `prebuild` 能推出 npm 会先调用 `build-index.mjs`，却**不能**推出它一定写了某个文件。下一步应读该脚本里实际写入路径，而非猜一个缓存目录。

## 关键点与常见陷阱

- 只读不是脱敏：仍不要让模型读取凭据、私钥或生产日志。本练习也不需要 MCP 或其他外部工具。
- 因写入被拒不是请求更大权限的充分理由。先问当前工作是否真的需要写入；受管理的环境还要遵守团队策略。

## 动手练习与小挑战

**练习：** 请 Codex 仅凭上面的 JSON 说出「已知的执行顺序」和「未知的副作用」。若它声称索引已生成，追问是哪一行代码、哪一次运行证明的。

**小挑战：** 在练习目录补一份只打印数字的 `build-index.mjs`，让它只读文件后修订结论。用修改前后的 `git status --short` 作辅助检查，不要把没看到 Git 差异当作整个系统没有副作用的证明。

## 延伸阅读与相关技巧

- [OpenAI：权限与沙箱](https://learn.chatgpt.com/docs/permissions)。
- [05 · 用 AGENTS.md 记录可验证的命令](/blog/codex-tips/05-agents-md)：把「应该如何做」和「工具可以做什么」分清。
- [18 · 查官方文档而不暴露项目数据](/blog/codex-tips/18-docs-mcp)：本地只读和远端工具授权是不同边界。

[返回「Codex 使用技巧」系列目录](/blog/codex-tips)
