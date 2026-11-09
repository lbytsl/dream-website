---
slug: deepseek-harness
title: 两天 10 万 Star，DeepSeek 悄悄开源了一个比模型还重要的东西
authors: [lbytsl]
tags: [ai-engineering, tools]
date: 2026-08-17
description: 从 Model 与 Harness 的分工讲起，介绍 DeepSeek Harness 的插件架构、运行方式，以及文件引用、界面增强、浏览器操作、记忆与多智能体等十款插件。
image: ./cover.png
seo_keywords:
  - DeepSeek Harness
  - dsh
  - AI Agent
  - 插件生态
  - Agent 框架
---

从 Model 与 Harness 的分工讲起，介绍 DeepSeek Harness 的插件架构、运行方式，以及文件引用、界面增强、浏览器操作、记忆与多智能体等十款插件。

![两天 10 万 Star，DeepSeek 悄悄开源了一个比模型还重要的东西文章配图](./cover.png)

{/* truncate */}

> 本文由本人 CSDN 原文整理迁入，保留原发表日期。[阅读 CSDN 原文](https://blog.csdn.net/weixin_68705666/article/details/163827105)。文中的版本、价格、Star 与社区规模等信息以原文写作时点为准。

> 最近 AI 圈最炸的事，除了 DeepSeek V4 Pro 正式版上线，就是它紧接着开源的 DeepSeek Harness（简称 dsh）了。 这个仓库上线不到两天，Star 数直接冲破 10 万，创下 GitHub 史上最快的增长纪录；如今（8 月 17 日）更是来到 14 万+。 它到底是什么？跟平时用的 DeepSeek 网页版、Claude Code、Codex 有什么区别？值不值得装？ 这篇文章，我用大白话给你讲清楚，并且从社区 1100 多个插件里，挑出十款口碑最好的推荐给你。

* * *

## 一、DeepSeek Harness 是什么？

### 1\. 先记住一个公式：Agent = Model + Harness

DeepSeek 官方给出了一个特别重要的等式：

> **Agent = Model + Harness**

-   **Model（模型）**，就是那颗"聪明的大脑"，负责思考和生成；

-   **Harness（马具）**，则是给大脑装上的"身体"。Harness 这个词原意就是"马具"——把 AI 模型比作一匹马，Harness 就是那套马具，让你能驾驭这匹马跑得更快、更稳，乖乖完成任务。


模型负责思考，Harness 负责把思考落地成行动：读写文件、执行命令、搜索网页、调用工具链。你平时用的 Claude Code、Codex、WorkBuddy，本质上都是 Harness，要和模型搭配起来用。

以前 DeepSeek 只开源了"马"（模型），这次终于把"马具"（Harness）也开源了。

### 2\. 核心定位："一切皆插件"的开源 Agent 框架

DeepSeek Harness 是 DeepSeek AI 开发的开源 Agent 框架，2026 年 8 月 13 日以 v0.1 开发者预览版发布（最新版本 0.1.0-rc.6），采用 **MIT 开源协议**，完全免费。

它最醒目的设计主张，是官方口号：

> **"一切皆插件（Everything is a Plugin）"**

什么意思？模型、工具、技能、会话、沙箱、存储、UI，甚至 Agent 自身的运行循环——**所有能力都是插件**，都可以拔掉、替换、自由重组。

整个框架建立在 **Cordis 微内核**之上。这个内核极其克制，只负责插件的加载、卸载和依赖管理，其他什么都不管。厉害的是，它可以在 Agent 运行过程中随时更换插件，还能保证运行状态不崩。

一句话总结：这是一套可配置、可重组的 Agent 运行环境，像乐高积木，每一块都能拆、能换、能拼。

### 3\. 上线即爆火，数据有多夸张？

-   上线 **半小时**突破 1 万 Star；

-   **首日**斩获 2.8 万 Star；

-   **42 小时**突破 10 万 Star，创下 GitHub 历史上前所未有的增长纪录；

-   对比一下：DeepSeek 自家的明星项目 R1 破 2 万 Star 用了 5.7 天；此前全球最快纪录保持者 Grok-1 用了 1.2 天；

-   截至目前（2026-08-17 实时核验）Star 已突破 **14 万（140,447）**；社区插件精选列表 awesome-dsh-plugin 已收录 **1169 个插件**，从记忆系统到工具能力，覆盖 14 个大类；官方还配套了 dsh-market 插件市场，一键安装。


### 4\. 核心功能一览

| 功能 | 说明 |
| --- | --- |
| **Web UI** | 一行命令 `npx @deepseek-ai/dsh web` 启动，浏览器访问 `http://127.0.0.1:3080`，官方主推的上手路径 |
| **Headless 模式** | `dsh --profile headless "任务"` 跑一次性任务，输出答案后退出，适合脚本化、批处理 |
| **四种运行模式** | 标准模式（默认）、PTC 模式（程序化工具调用）、极简模式（只有 Bash + 文件编辑器）、创造模式（插件开发） |
| **三级权限 + 沙箱** | 只读 / 工作区可写 / 完全访问；操作越权时弹窗人工审批，内置进程沙箱 |
| **内置 Agent 能力** | 工具、技能（Skill）、子代理（Subagent）、工作流（Workflow）、目标（Goal）、MCP 客户端 |
| **Trajectory 可观测性** | 仅追加式会话日志，每一步工具调用、思维链、上下文都按来源可查，支持分叉/恢复 |
| **多模型支持** | 不只 DeepSeek，还支持 Anthropic、OpenAI、Bedrock、Vertex、Azure 及任意 OpenAI 兼容端点 |
| **Python SDK** | `pip install deepseek-harness-sdk`，在代码里复用同一套能力，适合 CI 流水线 |

* * *

## 二、十款口碑插件推荐

社区插件已经 700+，鱼龙混杂。我按"实用 + 口碑好 + 有代表性"的标准挑了十款，覆盖视觉、操作、记忆、协作等不同场景。装上之后，Harness 的体验会明显不一样。

> 安装方法很简单：把插件 GitHub 地址发给 Harness 的 AI，说"帮我安装 https://github.com/xxx/dsh-xxx"，它会自己搞定；或者用 `dsh plugin add 插件名` 命令。想可视化逛插件市场，先装 dsh-market：`dsh plugin --profile web add dshmarket`。

### 1\. dsh-at-file —— 输入框 @ 引用文件（社区口碑第一）

**用途**：在输入框里直接 `@` 文件名，就能把文件内容附给 AI。 **亮点**：不用再手动复制粘贴路径，查代码、改文件的时候特别顺手。几乎所有社区推荐榜的第一名都是它。

GitHub：https://github.com/omdsh-dev/dsh-at-file

### 2\. ModLens —— 给纯文本模型装上"眼睛"（解决最大痛点）

**用途**：把图片粘贴进对话，模型就能"看"了，支持 OCR 文字提取、页面布局识别、语义理解。 **亮点**：DeepSeek 模型是纯文本模型，看不了图，这是用户吐槽最多的短板。ModLens 把图片解析成结构化文字信息，相当于给 AI 补上了一双眼睛，社区公认"刚需"。

GitHub：https://github.com/liustack/modlens

### 3\. dsh-genui —— 回复里直接渲染图表和组件

**用途**：让 AI 在回复中直接渲染图表、表格、表单、代码 Diff、Mermaid 流程图、交互面板。 **亮点**：以前 AI 只能给你"说"一个图表，装了它之后 AI 能直接"画"出来。写周报、做数据分析、画架构图，体验明显提升。

GitHub：https://github.com/omdsh-dev/dsh-genui

### 4\. DSH-better-sidebar —— VS Code 式全能工作台（GitHub ★1.8k）

**用途**：给 Harness 补上一套类似 VS Code 的侧边栏工作台：文件管理、代码编辑、真实终端、Git、Diff、内嵌浏览器、后台任务和子代理状态全塞进去。 **亮点**：把"聊天工具"升级成"开发 IDE"。第三方插件还能往侧边栏注册新页面，扩展性极强，是生态里 star 数最高的插件之一。

GitHub：https://github.com/omdsh-dev/DSH-better-sidebar

### 5\. dsh-web-ui —— 界面增强全家桶（GitHub ★3.7k，社区最火）

**用途**：任务看板、Git 图、右侧面板、Token 统计、手机远程，一次装齐。 **亮点**：目前社区最火的 UI 插件，把 Harness 原生的简陋界面"装修"成生产力工具。想一眼看清任务进度和花销，装它。

GitHub：https://github.com/zhu1090093659/dsh-web-ui

### 6\. dsh-browser-control —— 让 AI 操作真实浏览器

**用途**：通过 Playwright 控制真实 Chrome 浏览器，导航、点击、输入、截图，提供约 80 个浏览器工具。 **亮点**：AI 真正"上手"干活，可以自己打开网页、填表单、抓数据、做测试。配合 dsh-pilot（CDP 控制）和 dsh-computer-use（操作 macOS 桌面）这类插件，AI 的"手脚"就齐了。

GitHub：https://github.com/kyo615/dsh-browser-control

### 7\. OpenViking —— 火山引擎官方出品的记忆底座（GitHub ★28.7k）

**用途**：给 DSH 装上统一的自进化记忆——跨会话自动回忆、个人画像注入、会话捕获，把 Agent 记忆、知识 RAG、技能管理三合一，官方提供 dsh-memory-plugin 接入包。 **亮点**：记忆是当下最火的方向，而 OpenViking 是里面规格最高的一个：火山引擎官方开源、28.7k Star、可自托管。轻量替代还有 dsh-mnemon（本地优先、隐私友好）、dsh-memory-evolve（越用越懂你的习惯）等纯插件方案。

GitHub：https://github.com/volcengine/OpenViking

### 8\. dsh-negative-ledger —— "失败账本"，记住走过的坑

**用途**：保存已经被证明失败的路径，某条命令执行失败、某个文件不存在，在条件没变时阻止 AI 重复走同一条路。 **亮点**：设计简单但很聪明。普通模型记忆偏向"记住发生过什么"，工程 Agent 更需要"记住什么已经证明不该再做"。这个插件让 AI 学会吃一堑长一智。

GitHub：https://github.com/akslcw/dsh-negative-ledger

### 9\. dsh-agent-teams —— 一句话驱动多智能体团队

**用途**：装完之后，只要一句自然语言，就能驱动一个多智能体团队协作完成目标。 **亮点**：把"单打独斗"升级成"团队作战"，AI 自己拆任务、分派给不同的子 Agent 并行干活、最后汇总。复杂项目（比如重构、大文档翻译）的效率直接翻倍。

GitHub：https://github.com/NanmiCoder/dsh-agent-teams

### 10\. dsh-llm-fallbacks —— 模型挂了自动切换备用

**用途**：主模型报错或超时，自动降级到备用模型，任务不中断。 **亮点**：可靠性神器。配合 dsh-tier-router（简单任务用便宜快的模型、难题用强模型）这类路由插件，既省钱又稳。对重度使用者来说，这是"保命"级别的插件。

GitHub：https://github.com/btspoony/dsh-llm-fallbacks

> **顺便一提**：皮肤类插件是社区整活担当——鲸鱼娘桌宠、Excel 表格风（摸鱼神器）、TUI 终端风、2005 年中文网站广告风……因为 Harness 本质是浏览器里的 Web 应用，换皮肤超简单。工作累了可以装一个玩玩。

* * *

## 三、总结与展望

### 整体价值：把 Agent 做成"乐高"

DeepSeek Harness 最大的贡献，是把 Harness 这层真正做成了一个**开放平台**。

以前行业里主要比模型能力，后来开始比 Agent，再往后，真正影响体验的其实是"模型 + Harness + 插件生态"三者共同决定。

-   **对开发者**：一切皆插件意味着可以自由定制，不写框架源码就能换模型、换工具、换 UI，社区称之为"乐高式开发"；

-   **对普通用户**：一条命令装好，浏览器里就能用，能读写文件、执行命令、搜索网页；本地部署时是否向外发送数据，仍取决于模型端点和插件配置；

-   **对行业**：MIT 协议开源，加上国产超算互联网平台同步上线，VentureBeat 评价 DeepSeek 的竞争重点正从"模型层"向"Agent 基础设施层"上移。


### 社区评价：骨架很强，皮肤还在长

**叫好的地方**：

-   Flask 框架创始人 Armin Ronacher 评价 DSH 展现了"一些很酷的想法"，让他重新思考了自己产品的 Harness 重构方式；

-   长任务稳定性口碑不错：88 页论文翻译派出 10 个子代理 22 分钟完成；写游戏一次成功；

-   成本友好：搭配 DeepSeek 自家模型，复杂编程任务往往只要几毛到一两块钱；

-   可观测性好：轨迹回放、会话日志对排查问题价值很大。


**被吐槽的地方**：

-   上手门槛偏高：需要 Node.js、终端命令，对小白不友好；

-   产品细节粗糙：纯文本模型没"眼睛"、界面简陋、Token 消耗偏大；

-   开发者预览版，接口随时可能变；

-   有安全提醒：插件默认信任、无签名无权限清单，装插件要谨慎来源。


有开发者总结得很到位：\*\*"底层架构很强，用户体验很差。它已经造出了一副很强的 Agent 骨架，但还没有长出面向人的皮肤。"\*\*

### 未来潜力：Agent 界的"Android"

DSH 能不能成，关键看两件事：**官方能不能把底座稳定住，社区能不能持续长出好用的插件**。

好消息是，生态已经在飞速生长——发布不到一周，社区精选插件列表 awesome-dsh-plugin 已收录 **1169 个插件**，官方配套 dsh-market 插件市场让安装变成一键操作；深求社区（DeepSeek.club）也推出了官方配套的 **PluginHub 插件库**（deepseek.club/plugins）和 **Harness 学院**（deepseek.club/learn），教程、Demo、插件开发指引一应俱全。

很多人把它比作"Agent 界的 Android"：开源、摊开零件、让社区组装。早期虽然粗糙，但天花板极高。如果你喜欢折腾 AI Agent，或者想看看下一代 Agent 架构长什么样，装一个试试，不亏。

**相关链接**：

-   官方仓库：https://github.com/deepseek-ai/deepseek-harness

-   官方文档：https://deepseek-harness.github.io/deepseek-harness/

-   产品页：https://www.deepseek.com/harness/

-   插件精选总表（awesome-dsh-plugin）：https://github.com/awesome-dsh-plugin/awesome-dsh-plugin

-   插件市场（dsh-market）：https://github.com/dsh-market/dsh-market

-   社区插件库 PluginHub：https://deepseek.club/plugins


*（本文信息综合自 DeepSeek 官方仓库/文档、DeepSeek 官方公众号、澎湃新闻、VentureBeat、腾讯新闻、网易新闻、CSDN、博客园及社区实测，数据截至 2026 年 8 月 17 日。插件评价仅供参考，安装前建议查看仓库 README。）*

* * *

*觉得有用的话，点个赞、转给那个天天折腾 AI 工具的朋友。我们下期见。*
