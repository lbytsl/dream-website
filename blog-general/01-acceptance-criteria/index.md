---
slug: 01-acceptance-criteria
title: 把需求写成可验收的提示词
authors: [lbytsl]
tags: [general-tips]
date: 2026-11-26
description: 用可观察的例子说明做完是什么样，再让 AI 改代码。
---

读者输入 ` CODEX ` 找不到《Codex 入门》。比起「优化搜索」，告诉 AI 哪些输入必须命中、哪些行为不能变，更容易一次改对。

{/* truncate */}

## 技巧名称与一句话概括

验收式提示词：先说清目标、输入、输出和约束，再用例子定义完成。

## 核心原理与适用场景

「更智能」「修好」没有唯一答案。把要求写成能现场核对的输入和输出，AI 就能用同一组例子复述需求、编写断言、展示结果。新增功能和修缺陷都适用。

## 低效写法与问题

> 搜索不好用，优化一下。

它没说明大小写、空白、空查询的规则。AI 可能顺手加全文搜索，反而扩大了改动。

## 正确应用与代码解释

> 只改标题搜索，不改接口和页面。样本是《Codex 入门》和《Git 手记》：` CODEX ` 只命中第一篇，`Vue` 不命中，空白查询保留当前的「返回空列表」。先写断言，再修复。交付时给出测试命令和结果。

```js
export function search(posts, query) {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  return posts.filter(post => post.title.toLowerCase().includes(term));
}
```

`trim()` 去掉首尾空白，两侧统一大小写之后再查找。空白查询显式保留原行为（否则空串会命中所有标题）。把函数存为 `search.mjs`，在文件末尾临时加上下面的断言，运行 `node search.mjs` 即可验证：

```js
import assert from 'node:assert/strict';
const posts = [{ title: 'Codex 入门' }, { title: 'Git 手记' }];
assert.deepEqual(search(posts, ' CODEX '), [posts[0]]);
assert.deepEqual(search(posts, 'Vue'), []);
assert.deepEqual(search(posts, '   '), []);
```

## 关键点与常见陷阱

- 至少覆盖一个正常值、一个反例和一个边界值；只给成功例子容易掩盖回归。
- 描述外部行为，不必指定实现；只有兼容性、范围等硬约束才写成不可改项。

## 动手练习与小挑战

练习：为「导出筛选结果」写三条验收例子。挑战：加上零条数据与中文列名两种边界，但不要把实现方式写死。

## 延伸阅读与相关技巧

- [用样例表澄清业务规则](/blog/codex-tips/03-example-contract)
- [把失败样例变成回归测试](/blog/codex-tips/08-red-green-test)
