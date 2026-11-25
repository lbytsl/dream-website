---
slug: 17-skill-script
title: Codex 11｜给 Skill 配一个能判定重复 ID 的脚本
authors: [lbytsl]
tags: [codex-tips, ai-engineering]
date: 2026-11-25
description: 让 Skill 说明何时检查、如何解释结果；把每次都应得出同一答案的比较交给一个小脚本。
image: /img/blog-covers/codex-tips.svg
---

肉眼找出三篇文章里的重复 ID 很容易。换成三百篇，再让 Codex 每次重新数一遍，就等于把本可重复的检查变成了临场发挥。

{/* truncate */}

## 技巧：把确定的检查交给脚本

**让 Skill 说明何时检查、如何解释结果；把每次都应得出同一答案的比较交给一个小脚本。**

## 原理与适用场景

编辑有时需要判断标题是否易懂，这靠阅读；但「两个 ID 是否完全相同」有明确规则。本例输入是一个文章 ID 字符串数组，不做大小写归一化。退出码是程序留给调用者的数：这里 0 表示未发现重复，1 表示发现重复，非法输入另算错误。

## 低效写法与问题

> 打开整份清单，一行行念，看一下有没有「看起来很像」的 ID，最后给个通过或不通过。

这种提示词没有说明 `Git` 与 `git` 算不算相同，也没有可供下一次发稿复用的检查。模型漏看第二个 a 时，报告仍可能写「通过」。

## 正确做法与代码解释

沿用[第 10 篇的 Skill](/blog/codex-tips/16-first-skill)，把下面脚本放在 `.agents/skills/article-preflight/scripts/check-ids.mjs`：

```js
import { readFileSync } from 'node:fs';
const ids = JSON.parse(readFileSync(process.argv[2], 'utf8'));
if (!Array.isArray(ids) || !ids.every(id => typeof id === 'string')) {
  throw new TypeError('清单必须是字符串数组');
}
const seen = new Set();
const duplicates = new Set();
for (const id of ids) {
  if (seen.has(id)) duplicates.add(id);
  seen.add(id);
}
console.log(JSON.stringify({ duplicates: [...duplicates] }));
if (duplicates.size) process.exitCode = 1;
```

把上篇的 `SKILL.md` 改成两个独立入口。只给清单时，不需要另外找一份稿件：

```md
---
name: article-preflight
description: 发稿前只读核对 Markdown 稿件标题与栏目，或检查 JSON 清单中的重复文章 ID。
---
- 提供 Markdown 路径：检查元数据 title、category 是否非空；按「字段 / 结果 / 依据」报告。
- 提供 ID 清单路径：从仓库根运行 node .agents/skills/article-preflight/scripts/check-ids.mjs，把该路径作为唯一参数。报告重复项或输入错误。
- 两项独立，只做用户要求的检查；没给所需路径才询问。不改稿、不改 ID、不发布。
```

对 `["a","b","a"]`，脚本输出 `{"duplicates":["a"]}`；`seen` 记住已读项，第二个集合让同一个重复值只报告一次。

## 关键点与常见陷阱

- 非零退出码不总是「有重复」。文件找不到或 JSON 损坏也会失败，要同时看是否生成了约定的结果对象。
- 先审阅脚本再运行；不因它放在 `scripts/` 就把下载、上传或改稿的权限一并交给它。

## 动手练习与小挑战

**练习：** 在根目录创建 `ids.json`，分别放入 `["a","b"]` 与 `["a","a","a"]`。先运行 `node .agents/skills/article-preflight/scripts/check-ids.mjs ids.json`，再输入 `$article-preflight 检查 ids.json 中的重复 ID`；两次报告应分别是空数组和一个 a。

**小挑战：** 把清单换成 `{"id":"a"}`。验收不是显示「没有重复」，而是说明输入形状不对；试着让错误报告也能告诉编辑如何修清单。

## 延伸阅读与相关技巧

- [10 · 从指令型 Skill 起步](/blog/codex-tips/16-first-skill)：只有确实需要确定性判定时才加脚本。
- [13 · 把报告交给下一个程序](/blog/codex-tips/19-structured-handoff)：固定的 JSON 结果不仅供人阅读。

[返回「Codex 使用技巧」系列目录](/blog/codex-tips)
