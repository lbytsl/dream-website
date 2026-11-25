---
slug: 14-skill-trigger
title: 技巧 09：Skill 是怎么被触发的？读懂 description
authors: [lbytsl]
tags: [workbuddy-tips, tools]
date: 2026-11-19
description: 搞清 Skill 与斜杠命令的区别，以及 AI 依据什么决定调用哪个 Skill——description 写得好不好，决定它会不会被用上。
---

# 技巧 09：Skill 是怎么被触发的？读懂 description

> 一句话概括：Skill 由 AI 自动识别调用，而 AI 判断的依据主要是 description——它写清楚「什么时候用」，比写清楚「是什么」更重要。

{/* truncate */}

## 一、技巧名称与一句话概括

**技巧名称**：Skill 触发机制（Skill Triggering）。

**一句话概括**：Skill 是给 AI 的「专业培训」，AI 根据任务描述与 Skill description 的匹配度自动决定是否调用；description 写糊了，Skill 就永远不会出场。

## 二、核心原理与适用场景

官方把 Skills 和 Slash Commands 的区别讲得很清楚：

| 特性 | Skills | Slash Commands |
|------|--------|---------------|
| 触发方式 | **AI 模型自动识别并调用** | 用户手动输入命令 |
| 使用场景 | 专业领域任务处理 | 快捷操作和工作流 |
| 权限控制 | 支持工具白名单 | 无特殊权限控制 |
| 工作目录 | 支持自定义基础目录 | 使用当前工作目录 |
| 可见性 | 对用户透明，AI 自动决策 | 用户主动发起 |

简单记：**斜杠命令是你喊它，Skill 是它自己来**。

AI 选择 Skill 时看四件事：

1. **任务匹配度**：任务描述与 Skill `description` 的相关性；
2. **工具需求**：任务所需工具是否在 `allowed-tools` 范围内；
3. **上下文相关性**：当前对话是否适合使用该 Skill；
4. **Skill 来源**：项目级 Skills 优先于用户级 Skills。

其中第 1 条完全取决于你怎么写 `description`。用 `/skills` 命令可以查看当前已加载的所有 Skills 及其预估 token 数——先确认它在不在，再排查为什么没被触发。

**适用场景**：安装了 Skill 却发现没生效、写自定义 Skill、决定某个能力该做成 Skill 还是斜杠命令。

## 三、错误或低效写法及问题说明

```yaml
---
name: helper
description: 处理文件
---
```

这个 description 几乎不会触发。原因：

- 没有说明**什么任务**该用它（「处理文件」太宽泛，任何任务都沾边，等于都不匹配）；
- 没有说明**产出什么**（AI 不知道调用它能得到什么）；
- 没有场景关键词（用户说「审查这段代码的 SQL 注入风险」时，没有任何词能匹配上）。

结果：你装了这个 Skill，但在对话里从来没见它出场。

另一个常见错误是把 Skill 写成斜杠命令的用法：期望自己输入 `/xxx` 才触发，结果在对话里自然描述任务时它反而不出来。

## 四、正确应用方式：写一个会被触发的 description

下面是官方推荐写法的思路，对比一下：

```yaml
# ❌ 不好
description: 处理文件

# ✅ 好
description: PDF 文档解析和转换专家，支持文本提取和格式转换（project）
```

关键差别在于：好的 description 同时交代了**领域**（PDF 文档）、**能力**（解析、转换）、**具体动作**（文本提取、格式转换），还标注了来源。

再看一个代码审查 Skill 的写法：

```yaml
---
name: code-review
description: 代码审查与质量检查专家。当用户要求审查代码、检查 PR、review 改动、查找安全漏洞或性能问题时触发，输出定位到行号的分级问题清单。
allowed-tools: Read, Grep, Bash(git:diff)
---
```

这段 description 里埋了多个触发词：「审查代码」「检查 PR」「review 改动」「查找安全漏洞」「性能问题」。无论用户用哪种说法，都能匹配上。

**完整排查流程**：装了 Skill 却没触发时，按这三步查。

1. **用 `/skills` 确认它被加载了**——没加载就检查目录位置（项目级 `.codebuddy/skills/`，用户级 `~/.codebuddy/skills/`）。
2. **看 description 是否包含你任务里的词**——把你的原话和它对照，一个词都对不上就是 description 的问题。
3. **看 allowed-tools 是否够用**——任务需要写文件但白名单里只有 `Read`，AI 会判断这个 Skill 不胜任。

还有两个有时会用到的开关：

- `disable-model-invocation: true`：Skill 不出现在 AI 的 Skill 工具里，只能通过 `/skill-name` 手动触发；
- `user-invocable: false`：从 `/` 菜单隐藏，仅供 AI 内部或其他 Skill 引用，适合项目规范这类背景知识。

此外 `skillOverrides` 设置可以在不改 `SKILL.md` 的前提下控制可见性（四态：`on`、`name-only`、`user-invocable-only`、`off`）。

## 五、关键点与常见陷阱

**关键点**

1. description 里写**用户会说的话**，不是写技术分类。
2. 领域 + 能力 + 产出，三样至少有两样。
3. 先确认 Skill 已加载，再排查触发问题。
4. 项目级 Skill 优先级高于用户级，同名时会覆盖。
5. 高频、明确的能力才做成 Skill；一次性的需求直接写提示词更划算。

**常见陷阱**

- **description 写成营销语**：「最强代码审查助手」不含任何可匹配的任务词。
- **description 写得太宽**：「帮助编程」会让它在不该出场的时候乱入。
- **忘了 allowed-tools**：Skill 被触发了但干不了活，AI 会放弃它。
- **把背景规范和任务 Skill 混在一起**：背景类用 `user-invocable: false` 隐藏，避免占用菜单。

## 六、动手练习与小挑战

**练习**：给你系统里已有的 3 个 Skill 各写一句「用户会怎么说才会触发它」的示例指令。写不出来的那个，description 就需要改。

**小挑战**：找一个从未被触发过的 Skill，只修改它的 description（加入 3 个具体触发词），然后在对话里用其中一句话测试。记录修改前后的触发情况。

## 七、延伸阅读或相关技巧

- [技巧 10：从零创建你的第一个 Skill](/blog/workbuddy-tips/15-first-skill) —— 把 description 放进完整 SKILL.md
- [技巧 11：给 Skill 上锁](/blog/workbuddy-tips/16-skill-permission) —— allowed-tools 怎么写
- [技巧 03：流程比角色更重要](/blog/workbuddy-tips/04-process-over-role) —— Skill 正文本质就是流程化提示词
