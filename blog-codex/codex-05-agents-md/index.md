---
slug: 05-agents-md
title: Codex 02｜用 AGENTS.md 留住仓库里的约定
authors: [lbytsl]
tags: [codex-tips, tools]
date: 2026-11-25
description: 把反复适用、可以核查的命令和边界放进仓库的 AGENTS.md，把一次性的需求留在对话里。
image: /img/blog-covers/codex-tips.svg
---

每开一次新对话都要叮嘱「示例用 Node 原生测试，不要装 Jest」？这不是单次任务的需求，而是小书架仓库的工作约定。

{/* truncate */}

本篇聚焦 Codex 的 `AGENTS.md` 示例。跨工具的方法和练习见[通用技巧](/blog/general-tips/04-repository-instructions)。

## 技巧：把长期约定写进 AGENTS.md

**把反复适用、可以核查的命令和边界放进仓库的 `AGENTS.md`，把一次性的需求留在对话里。**

## 原理与适用场景

Codex 会在开始工作时读取项目指令。在 CLI 中，项目规则按仓库根目录到当前工作目录的路径逐层发现；越靠近工作目录的规则越具体。因此在根目录写全项目通用的约定，在子项目里只写差异。它帮助 Codex 找对做法，不替代测试，也不是权限控制。

## 低效写法与问题

> 以后写代码要专业、优雅、高质量。还要记得这周先改搜索框。

前半句无法验证，后半句下周就会过期。如果 Codex 因此选了团队没有使用的测试框架，你还是得重新解释一遍。

## 正确做法与代码解释

在**练习仓库根目录**创建 `AGENTS.md`，例如：

```md
# 小书架的开发约定
- 运行环境是 Node.js 20+；练习模块使用 .mjs。
- 修改搜索逻辑时，在仓库根目录运行 node --test tests/search.test.mjs。
- 不要手改 build/ 的静态产物；改源文件后重新构建。
- 报告哪些检查真的运行过；没运行的写出原因。
```

先确认 `tests/search.test.mjs` 确实存在，再在同一目录启动新的 Codex 会话，问：「只读说明：如果改搜索，你会在哪里运行哪条命令？依据哪个文件？」预期它能指向上面的测试，而不是自行安装工具。这里的路径和命令解决的是「去哪验证」；真正的断言是否有效，还要看测试内容。

## 关键点与常见陷阱

- 启动目录影响加载链；从仓库根启动，不代表自动读取每个兄弟目录里的文件。修改规则后，用新会话验证。
- 别在规则里放令牌、客户样本或「所有命令自动批准」。需要技术限制的地方应使用实际权限设置。

## 动手练习与小挑战

**练习：** 如果手边还没有测试，把[通用 01 · 先写验收标准](/blog/general-tips/01-acceptance-criteria)里的 `search` 函数保存为根目录的 `search.mjs`（不需要文件末尾的临时断言），创建 `tests/search.test.mjs`：

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { search } from '../search.mjs';
test('空搜索不列出文章', () => {
  assert.deepEqual(search([{ title: '书单' }], ' '), []);
});
```

让新会话先复述命令，再执行；区分「读到命令」和「测试通过」两种证据。

**小挑战：** 在 `examples/AGENTS.md` 加「这里的示例不引入第三方包」，分别从根目录和 `examples` 启动 CLI，比较两次答复里引用的规则。

## 延伸阅读与相关技巧

- [OpenAI：Codex 如何发现 AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)。
- [09 · 只读权限调查](/blog/codex-tips/14-read-only)：想阻止命令写文件，靠的不是团队约定，而是工具权限。
- [10 · 把工作流程做成 Skill](/blog/codex-tips/16-first-skill)：只在特定任务才需要的一整套步骤，不必塞进每次都读的规则里。

[返回「Codex 使用技巧」系列目录](/blog/codex-tips)
