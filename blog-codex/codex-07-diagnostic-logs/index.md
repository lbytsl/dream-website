---
slug: 07-diagnostic-logs
title: Codex 07｜用两条计数日志找出文章消失在哪一步
authors: [lbytsl]
tags: [codex-tips, tutorial]
date: 2026-11-25
description: 请 Codex 为互相竞争的两个解释各设计一个观测值，再用同一份样本决定下一步读哪段代码。
image: /img/blog-covers/codex-tips.svg
---

接口给了两篇文章，列表却是空的。与其让 Codex 把整份响应打进日志，不如先比较：文章是在筛选前就没了，还是筛选后才没了？

{/* truncate */}

## 技巧：给调试假设加观测点

**请 Codex 为互相竞争的两个解释各设计一个观测值，再用同一份样本决定下一步读哪段代码。**

## 原理与适用场景

列表通常经过获取、筛选、渲染三步。页面空白只能说明最后没看到文章；用数字记录步骤之间的交接，就能缩小范围。这种方法适合能重现症状、但不确定故障发生在哪一层的时候。

## 低效写法与问题

```js
console.log('response', response);
```

一次打印几十个字段不等于提供了线索，还可能把邮箱或请求信息写进共享日志。即便看清返回了两篇，也不知道它们是否被筛选掉了。

## 正确做法与代码解释

> 只用下面的虚构样本。比较「上游没有文章」与「状态值没对上」两种解释；每一步只记阶段名和个数。先预测输出，再运行，不记录正文和用户数据。

```js
const rows = [{ status: 'published' }, { status: 'draft' }];
console.info('loaded', rows.length);
const shown = rows.filter(row => row.status === 'public');
console.info('afterStatusFilter', shown.length);
```

在 `counts.mjs` 里运行会看到 `loaded 2`、`afterStatusFilter 0`。这排除了此样本的「上游没有文章」，但 **0 本身还不能证明** 哪个状态才对。再对照样本或接口契约，确认发布状态叫 `published`，把比较值改成它后应看到 `2 → 1`；草稿仍不出现。

## 关键点与常见陷阱

- 一次只改一个条件，改前和改后用相同输入，否则两次计数没法比较。
- 若看到 `0 → 0`，先查获取步骤；若是 `2 → 1` 但页面仍白，去看渲染。不要把这两种路径都诊断为筛选错误。

## 动手练习与小挑战

**练习：** 给数组加第二条已发布记录。让 Codex 不看你算的答案，报出修复前后两对数字，再自己数一遍。

**小挑战：** 输入全是草稿。两种写法都得到 0，为什么这份样本不能区分它们？补一条有辨别力的数据，再删除临时调试日志。

## 延伸阅读与相关技巧

- [通用 02 · 从入口收集上下文](/blog/general-tips/02-focused-context) 提供放置观测点的位置。
- [通用 05 · 最小复现](/blog/general-tips/05-minimal-repro) 把锁定的筛选步骤单独拿出来，免去重复跑完整页面。

[返回「Codex 使用技巧」系列目录](/blog/codex-tips)
