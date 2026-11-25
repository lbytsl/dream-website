---
slug: 16-first-skill
title: Codex 10｜把发稿检查写成第一个 Codex Skill
authors: [lbytsl]
tags: [codex-tips, tools]
date: 2026-11-25
description: 把只在某类任务里反复使用的流程写成一个 Skill，明确它什么时候用、接收什么、最后交付什么。
image: /img/blog-covers/codex-tips.svg
---

每次发稿都要重复交代「核对标题、检查栏目、列出缺失项，但别改正文」。这段话值得留下来，不过没必要让改按钮颜色的人也读一遍。

{/* truncate */}

本篇聚焦 Codex 中创建并验证 Skill 的示例。跨工具的方法和练习见[通用技巧](/blog/general-tips/08-reusable-skills)。

## 技巧：用 SKILL.md 封装复用流程

**把只在某类任务里反复使用的流程写成一个 Skill，明确它什么时候用、接收什么、最后交付什么。**

## 原理与适用场景

Skill 是一个以 `SKILL.md` 为入口的目录。Codex 先看到名称与描述，需要使用时才读完整说明。适合周周重复的发稿检查，不适合还没做过一次、验收标准都不清楚的工作。仓库的通用约定仍然放在 `AGENTS.md`，两者不必复制同一份长文。

## 低效写法与问题

```yaml
name: helper
description: 对任何文章做所有有用的优化
```

「任何」「所有」既说不清什么时候使用，也说不清何时结束。读者本来只想检查栏目，它却可能顺手改标题、润色正文；即便结果有用，也不是原任务。

## 正确做法与代码解释

在可信练习仓库新建 `.agents/skills/article-preflight/SKILL.md`，文件内容如下：

```md
---
name: article-preflight
description: 发稿前只读核对指定 Markdown 稿件的标题与栏目；不用于润色正文。
---
1. 如果未给稿件路径，先询问路径，不扫描整个仓库。
2. 检查文件开头的元数据是否含非空 title、category。
3. 按「字段 / 结果 / 依据」给两行报告，缺失写「缺失」。
4. 不修改稿件，不触发发布。
```

给 `draft.md` 写上 `---` 包围的元数据，只填 `title: 春天的书单`，不填 `category`。在 Codex 输入 `$article-preflight 检查 draft.md`。名称用于显式选择，描述用于匹配任务，正文把输入和输出定死。验收是报告中标题有值、栏目缺失，而文件没有被补写；不是看它有没有夸稿子写得好。

## 关键点与常见陷阱

- `name` 和 `description` 是文件开头的 YAML 元数据，不是正文里的两个标题。目录名与名称保持一致最省心。
- 这是练习站自定的 `category` 字段，不是所有博客的规定。换仓库要先对照其真实发稿规则。
- 无法发现时先检查目录、文件名和启动位置；必要时重启 Codex，不要因为找不到就把规则复制到每一段提示词。

## 动手练习与小挑战

**练习：** 准备「两项齐全」和「缺栏目」各一篇，显式调用两次。自己先写期望的两行报告，再比输出。

**小挑战：** 不点名 Skill，分别问「发稿前帮我核对字段」和「把这段文字写得更活泼」。检查前者是否选择该流程、后者是否保持在润色任务；若误选，先改描述再试。

## 延伸阅读与相关技巧

- [OpenAI：创建和发现 Skills](https://learn.chatgpt.com/docs/build-skills)。
- [02 · 区分长期仓库规则](/blog/codex-tips/05-agents-md)；[11 · 把机械判定交给脚本](/blog/codex-tips/17-skill-script) 是这个 Skill 的下一步。

[返回「Codex 使用技巧」系列目录](/blog/codex-tips)
