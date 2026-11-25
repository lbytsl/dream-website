---
slug: 10-bounded-diff
title: Codex 10｜用差异对照，把小修留在小范围内
authors: [lbytsl]
tags: [codex-tips, tools]
date: 2026-11-25
description: 指定这次允许改变的行为，再把修改前后的 Git 差异对照起来，确认补丁没有混进别人的工作。
image: /img/blog-covers/codex-tips.svg
---

你只想让「0 条评论」显示出来。Codex 交回来一整页格式调整时，真正有用的一行反倒最难审核。

{/* truncate */}

## 技巧：审查补丁的边界

**指定这次允许改变的行为，再把修改前后的 Git 差异对照起来，确认补丁没有混进别人的工作。**

## 原理与适用场景

Git 的 diff 展示文件与基准版本的差异。任务开始时若工作区已经有改动，结束时看一眼文件名不足以区分归属。这个技巧适合文案、空值判断、兼容性等局部修复，尤其适合多人共用工作区的情况。

## 低效写法与问题

> 把评论数显示修好，顺便统一这个目录的代码风格。

把逻辑修改和全目录格式化混进同一个差异，复查变慢；若另一个人恰好在修改卡片样式，你甚至很难判断哪几行可以保留。

## 正确做法与代码解释

> 先看 `git status --short` 和 `git diff HEAD --` 作为起点。只修 `src/card.mjs` 的评论数显示：0 是真实值，只有 null 或 undefined 才显示「暂无」。不格式化别的文件，不提交，不撤销已有改动。

```diff
-export const countLabel = n => n || '暂无';
+export const countLabel = n => n ?? '暂无';
```

`||` 把 0 当作假值，`??` 只对空值回退。在已有首次提交的练习仓库，修改后运行：

```sh
git diff HEAD -- src/card.mjs
git diff HEAD --stat
git status --short
```

第一行看具体补丁，第二行看已跟踪文件的改动范围，第三行还能看到未跟踪文件。分别调用 `countLabel(0)`、`countLabel(null)`、`countLabel(3)`，结果应是 `0`、`暂无`、`3`。文件差异和行为结果缺一不可。

## 关键点与常见陷阱

- `git diff` 默认只看未暂存部分；这里用 `HEAD` 是为了同时看到已暂存与未暂存的已跟踪改动。
- 如果同文件里本来就有别人的几行，保留它们；别为了让统计「只剩一行」去重置工作区。

## 动手练习与小挑战

**练习：** 开始前先在另一个练习文件写一行未提交的笔记。修完后让 Codex 区分「本次新增」与「原来就在」，笔记内容应原封不动。

**小挑战：** 让笔记和待修函数出现在同一个文件。只看文件名已无法分辨；请指出哪个差异块修复了 0、哪个与需求无关。

## 延伸阅读与相关技巧

- [通用 03 · 可验证的任务切片](/blog/general-tips/03-verifiable-slices)：如果每次补丁都太大，先缩小这一步要交付的结果。
- [通用 07 · 证据式代码审查](/blog/general-tips/07-evidence-based-review)：补丁范围对了，还要确认行为没错。
- [通用 06 · Git 工作树隔离](/blog/general-tips/06-isolated-worktrees)：当两份改动不容易分开时，换一份工作目录。

[返回「Codex 使用技巧」系列目录](/blog/codex-tips)
