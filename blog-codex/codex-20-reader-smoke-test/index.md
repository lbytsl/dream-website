---
slug: 20-reader-smoke-test
title: Codex 20｜从栏目入口点进正文，才算完成交付
authors: [lbytsl]
tags: [codex-tips, tutorial]
date: 2026-11-25
description: 让 Codex 从读者实际进入的页面开始，依次点链接、核对正文标题，并写明哪些环境还没有验证。
image: /img/blog-covers/codex-tips.svg
---

构建成功，直接输入文章地址也能打开，但读者从栏目点进去却是另一篇。这是整套系列最后要抓住的错误：文件存在，不等于人能顺利找到它。

{/* truncate */}

## 技巧：沿读者路径做冒烟验收

**让 Codex 从读者实际进入的页面开始，依次点链接、核对正文标题，并写明哪些环境还没有验证。**

## 原理与适用场景

冒烟测试是覆盖一条关键路径的简短检查，不追求测遍全站。这里选「文章页 → 系列目录 → 第一课正文」。从入口走才能验证三个页面之间的接线；检查目标标题可以识别「链接到了另一个同样返回 200 的页面」。

## 低效写法与问题

> 构建没报错，首页能打开，帮我在报告里写「全站发布成功」。

构建不一定检查链接语义；直接访问正文绕过了栏目入口。本地测试即便全绿，也不能证明部署已经生效。

## 正确做法与代码解释

> 在本地预览里，从 `/blog/` 点「Codex 使用技巧」，再点「第一课：标题搜索」。不要直接访问最终 URL。核对一级标题；任一步失败就记下第一个断点。不要部署。

要独立复现，在 `public/` 下按注释路径建三个小 HTML 文件（第一行注释所在的位置就是文件名）：

```html
<!-- public/blog/index.html -->
<meta charset="utf-8"><a href="./lessons/">Codex 使用技巧</a>
```

```html
<!-- public/blog/lessons/index.html -->
<meta charset="utf-8"><a href="./first/">第一课：标题搜索</a>
```

```html
<!-- public/blog/lessons/first/index.html -->
<meta charset="utf-8"><h1>标题搜索</h1>
```

在练习目录启动 `python -m http.server 4173 --bind 127.0.0.1 --directory public`，用浏览器就能按步骤手动验收。如果练习项目已装 Playwright Test 和浏览器，可把同一条路径写进 `reader.spec.mjs`：

```js
import { test, expect } from '@playwright/test';
test('读者能从文章页打开第一课', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/blog/');
  await page.getByRole('link', { name: 'Codex 使用技巧', exact: true }).click();
  await page.getByRole('link', { name: '第一课：标题搜索', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('标题搜索');
});
```

保持预览运行，在另一个终端执行 `npx --no-install playwright test reader.spec.mjs`。两个链接按读者能看见的名字定位，最后断言内容而不是只看状态码。选择手动方式时，如实记录点过哪两个链接、实际看到哪个标题，同样能交接。

## 关键点与常见陷阱

- 预览的是哪份产物要写清楚。本地预览、测试环境和线上地址不是同一份证据。
- 不要用「等待两秒」掩盖时序问题；找不到链接时先核对起点、名称与目标，不要改测试去直达正文。

## 动手练习与小挑战

**练习：** 只把第一个链接的文字改成「文章归档」，保留所有文件。直接输正文地址仍然成功，但按原任务执行会在哪一步失败？

**小挑战：** 恢复文字，把第二个链接故意指回目录。让 Codex 交付一份报告：第一个失败位置、实际与期望、修复后复验结果、未验证环境。不能只写「已修复」。

## 延伸阅读与相关技巧

- 回到 [通用 01 · 先写验收标准](/blog/general-tips/01-acceptance-criteria)：现在你可以把「读者从哪里开始、最后看到什么」写进下一次需求。
- 用 [通用 07 · 证据式代码审查](/blog/general-tips/07-evidence-based-review) 核对修复，再用 [19 · 结构化交接](/blog/codex-tips/19-structured-handoff) 区分本地通过和线上未验。

[返回「Codex 使用技巧」系列目录](/blog/codex-tips)
