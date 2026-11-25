---
slug: 09-fixed-clock
title: Codex 09｜把「现在」传进函数，让定时发布测试不再碰运气
authors: [lbytsl]
tags: [codex-tips, tutorial]
date: 2026-11-25
description: 让 Codex 把当前时间变成一个参数，测试就可以在同一秒里检查发布前、发布时和发布后。
image: /img/blog-covers/codex-tips.svg
---

一篇文章上午应该隐藏，到了整点才出现。要验证这个边界，不必真的等到整点，也不必改电脑时间。

{/* truncate */}

## 技巧：固定时钟

**让 Codex 把当前时间变成一个参数，测试就可以在同一秒里检查发布前、发布时和发布后。**

## 原理与适用场景

读取系统时钟让输入悄悄多了一项：「什么时候运行」。实际页面需要真实时间，测试却需要可重复的时间。这种把外部值从参数传入的办法叫依赖注入；这里依赖只是一个数字，不需要引入框架。

## 低效写法与问题

> 先让测试睡一秒，再检查文章可见，多跑几次应该就稳定了。

休眠把结果交给机器调度；慢机器可能醒得太迟，而且仍没有测到「恰好等于发布时间」。在函数里直接调用 `Date.now()`，读者也没法手动重放某一刻。

## 正确做法与代码解释

> 保留页面默认用真实时钟，但允许测试指定毫秒时间戳。规则是到点即公开。请固定同一个发布时间，检查前 1 毫秒、当下、后 1 毫秒；不要用延时或改全局时钟。

```js
import assert from 'node:assert/strict';
function isPublished(publishAt, now = Date.now()) {
  return now >= publishAt;
}
const at = Date.parse('2026-01-01T00:00:00Z');
for (const [delta, want] of [[-1, false], [0, true], [1, true]]) {
  assert.equal(isPublished(at, at + delta), want);
}
```

保存为 `clock.mjs` 后运行 `node clock.mjs`。页面调用只传 `publishAt`，默认值读取真实时间；测试传第二个参数，就能精确踩在等号上。末尾的 `Z` 标明 UTC，示例不会因为开发者在不同时区而读取不同起点。

## 关键点与常见陷阱

- 统一单位。秒级时间戳和毫秒级时间戳都是数字，类型检查不一定能帮上忙。
- 固定一个时间点不等于解决所有时区问题；「按上海日期归档」是另一条业务规则。

## 动手练习与小挑战

**练习：** 把 `>=` 换成 `>`。跑三次，失败的都应该是 `delta` 为 0 的用例，而不是随机一条。

**小挑战：** 增加下线时间，要求展示区间「含开始、不含结束」。先列出四个边界的预期，再让 Codex 写判断；全过程不许等待真实时间。

## 延伸阅读与相关技巧

- [03 · 用表覆盖边界值](/blog/codex-tips/03-example-contract) 解释为什么刚好到点最值得测。
- [08 · 先看到预期的红灯](/blog/codex-tips/08-red-green-test) 用于确认等号确实被用例保护。

[返回「Codex 使用技巧」系列目录](/blog/codex-tips)
