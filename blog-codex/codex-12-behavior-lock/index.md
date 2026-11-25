---
slug: 12-behavior-lock
title: Codex 08｜先锁住旧行为，再请 Codex 消除重复
authors: [lbytsl]
tags: [codex-tips, tutorial]
date: 2026-11-25
description: 先为当前可见行为留下独立期望，再让 Codex 只移动或提取逻辑；重构前后用同一组断言比较。
image: /img/blog-covers/codex-tips.svg
---

目录和侧栏各写了一遍标题缩短逻辑。想把它们合并之前，先问一句：原来恰好八个字的标题，有没有省略号？

{/* truncate */}

## 技巧：行为不变的小步重构

**先为当前可见行为留下独立期望，再让 Codex 只移动或提取逻辑；重构前后用同一组断言比较。**

## 原理与适用场景

重构的目标是结构更清晰，不是顺手改变结果。用当前表现写下的检查叫特征测试：它记录的是「现在是什么」，不代表每一条都永远正确。适合整理重复代码前使用；若现有行为就是缺陷，应把修缺陷分成下一次改动。

## 低效写法与问题

> 把两段标题截断整理一下，省略号、空格什么的也顺手美化。

这样就失去了比较基准。原来 `12345678` 在导航里完整显示，重构后多一个字符或换成三个点，现有布局都有可能挤掉下一项。

## 正确做法与代码解释

> 先分别调用目录和侧栏的旧函数，记录 0、8、9 个字符的输出。若二者有差异，先停下，不要擅自统一。若一致，再提取 `shortTitle`，保留接口和标点。

```js
import assert from 'node:assert/strict';
// 从已确认相同的旧实现中提取，而不是重新设计排版算法。
const shortTitle = title => title.length > 8 ? title.slice(0, 8) + '…' : title;
const tocLabel = title => shortTitle(title);
const sidebarLabel = title => shortTitle(title);
for (const label of [tocLabel, sidebarLabel]) {
  assert.equal(label(''), '');
  assert.equal(label('12345678'), '12345678');
  assert.equal(label('123456789'), '12345678…');
}
```

在练习文件用 `node labels.mjs` 运行。断言调用的是两个对外入口，而不是只测新函数；即便某个入口忘记正确接线，也有机会被发现。示例特意保留原算法，未承诺处理所有书写系统。

## 关键点与常见陷阱

- 不要把预期写成 `shortTitle(input)` 再和自身比较，那样什么实现都能绿。
- `length` 和 `slice` 处理的是 UTF-16 编码单元，不是读者感知的字符。支持复合表情是新需求，不要悄悄混进这次重构。

## 动手练习与小挑战

**练习：** 给侧栏的旧版本换成三个英文点。让 Codex 运行同一组断言，它应该报告差异，而不是替你决定哪边才对。

**小挑战：** 团队确认目录用 8 个字符、侧栏用 12 个。能否仍共享一个函数，通过参数保留两个行为？分别写一个刚好到上限的例子。

## 延伸阅读与相关技巧

- [04 · 红绿测试](/blog/codex-tips/08-red-green-test) 用来验证特征测试有辨别力。
- [02 · 把约定记入 AGENTS.md](/blog/codex-tips/05-agents-md)：如果每次整理代码都要跑同一组检查，把命令留下来。
- [06 · 检查差异边界](/blog/codex-tips/10-bounded-diff) 帮你把「结构变了」和「行为变了」分开提交给读者检查。

[返回「Codex 使用技巧」系列目录](/blog/codex-tips)
