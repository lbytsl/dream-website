---
slug: 05-minimal-repro
title: 给 Bug 一份最小复现
authors: [lbytsl]
tags: [general-tips]
date: 2026-11-26
description: 保留最少数据和操作，同时写下实际结果、预期结果与必要环境。
---

「第二页少一篇」还不足以定位，但只用三条记录、一个页码和两行输出，也许就能说明问题。

{/* truncate */}

## 技巧名称与一句话概括

最小复现：让另一台机器在相同样例上看到同样的故障。

## 核心原理与适用场景

复现是解释的前提。界面故障记录入口和操作顺序；崩溃再附首个相关堆栈；遇到数据边界，就把触发问题的那几条数据单独留下。

## 低效写法与问题

> 列表分页偶尔不对，日志都在附件里，直接修。

它没有说明页码从零还是从一开始，也没有给出预期的记录。AI 可能复现了另一种故障，或者因为本地数据不同而无法复现。

## 正确应用与代码解释

```js
import assert from 'node:assert/strict';
const ids = ['a', 'b', 'c'];
const page = 2;
const size = 2;
// 接口页码从 1 开始；旧实现使用了 page * size。
const oldOffset = page * size;
assert.deepEqual(ids.slice(oldOffset, oldOffset + size), ['c']);
```

这是故意保留旧写法的复现脚本：运行后实际返回 `[]`，断言报出预期是 `['c']`。如果契约确认页码从 1 开始，偏移应当是 `(page - 1) * size`，改这一行再重跑同一断言。

## 关键点与常见陷阱

- 精简数据时每删一步就重跑，不要误删真正的触发条件。
- 记录会影响复现的版本、账号状态或时区；不要贴真实账号或完整业务数据。

## 动手练习与小挑战

练习：把自己的一个 UI Bug 写成三步复现。挑战：做一组不会出错的对照，例如第一页，并说明为什么不能只覆盖它。

## 延伸阅读与相关技巧

- [用诊断日志缩小范围](/blog/codex-tips/07-diagnostic-logs)
- [先红后绿的回归测试](/blog/codex-tips/08-red-green-test)
