---
slug: 08-red-green-test
title: Codex 08｜让回归测试先红一次，再相信它变绿
authors: [lbytsl]
tags: [codex-tips, tutorial]
date: 2026-11-25
description: 请 Codex 先写一个会因旧错误而失败的断言，看到预期的失败以后，再写刚好能让它通过的修复。
image: /img/blog-covers/codex-tips.svg
---

收藏夹偶尔出现两篇相同的文章。修复后一片绿不一定令人放心：如果测试只检查「调用没报错」，旧代码也会通过。

{/* truncate */}

## 技巧：红、绿、重构

**请 Codex 先写一个会因旧错误而失败的断言，看到预期的失败以后，再写刚好能让它通过的修复。**

## 原理与适用场景

「红」是用例在旧逻辑上失败，「绿」是修复后通过，「重构」是在断言守住行为时整理代码。本例的规则是：同一个文章 ID 可以反复提交，收藏列表中只出现一次。要测的是列表内容，而不是按钮被调用了几次。

## 低效写法与问题

```js
assert.doesNotThrow(() => save(['a'], 'a'));
```

把 a 加第二次不会抛错，所以无论有没有重复这条断言都是绿的。「给收藏加一些测试」很容易产出这种看似覆盖、实际上区分不了好坏的用例。

## 正确做法与代码解释

> 先保留会重复追加的实现，先运行能区分新旧行为的测试并报告实际输出。确认红灯是重复 a 导致的，然后只改实现，不要放宽期望。

把下面内容保存为 `save.test.mjs`，运行 `node --test save.test.mjs`：

```js
import test from 'node:test';
import assert from 'node:assert/strict';
const save = (ids, id) => [...ids, id]; // 先保留旧实现

test('第二次收藏同一 ID 不增加条目', () => {
  assert.deepEqual(save(['a'], 'a'), ['a']);
});
test('新收藏排在已有条目之后', () => {
  assert.deepEqual(save(['a'], 'b'), ['a', 'b']);
});
```

第一个测试实际得到两个 a，第二个本来就通过。把 `save` 那一行替换为 `const save = (ids, id) => ids.includes(id) ? ids : [...ids, id];` 后再跑。先查 ID 是否存在，仅在新 ID 时追加，两条用例应同时变绿。

## 关键点与常见陷阱

- 「找不到文件」或导入报错也会变红，但不能证明用例抓住了重复收藏；先看失败的实际值。
- 不要边改实现边改期望。「无论顺序怎样都行」会悄悄放弃第二条已经约定的行为。

## 动手练习与小挑战

**练习：** 故意把新条目放在数组开头，预测哪一个测试会红，再运行核对。

**小挑战：** 新增「不修改传入的原数组」这条约定。先写一个会抓住 `push` 原地修改的断言，再让 Codex 改回不变更输入的版本。

## 延伸阅读与相关技巧

- [03 · 用样例表确定期望](/blog/codex-tips/03-example-contract) 帮你决定测试该断言什么。
- [12 · 用行为测试保护重构](/blog/codex-tips/12-behavior-lock)：下一步不是改规则，而是在规则不变时改结构。
- [Skills 知识库：测试驱动开发](/docs/skills/engineering/tdd) 展示怎样在其他任务里复用这个循环。

[返回「Codex 使用技巧」系列目录](/blog/codex-tips)
