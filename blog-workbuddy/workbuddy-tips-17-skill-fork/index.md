---
slug: 17-skill-fork
title: "技巧 17：context: fork——让 Skill 在隔离上下文里干活"
authors: [lbytsl]
tags: [workbuddy-tips, tools]
date: 2026-11-22
description: "用 context: fork 把调研类 Skill 丢进独立子代理上下文，只把结论带回主对话，并了解 agent、hooks 等配套字段。"
---

# 技巧 17：context: fork——让 Skill 在隔离上下文里干活

> 一句话概括：给 Skill 加上 `context: fork`，它就会在独立上下文的子代理里执行，不污染主对话。

{/* truncate */}

## 一、技巧名称与一句话概括

**技巧名称**：Skill 上下文隔离（Context Fork）。

**一句话概括**：`context: fork` 让 Skill 拥有自己的上下文窗口和 agent 类型，读入大量文件后只把结论返回主对话。

这是[技巧 11 子代理](/blog/workbuddy-tips/11-subagent)的「固化版」，也是[通用 02 · 从入口收集上下文](/blog/general-tips/02-focused-context)的进阶解法。

## 二、核心原理与适用场景

官方定义：`context: fork` 使 Skill 在隔离的子代理上下文中运行，**不访问对话历史**。

执行流程：

1. 创建新的隔离上下文；
2. 子代理接收 Skill 内容作为提示；
3. `agent` 字段决定执行环境；
4. 结果返回主对话。

可用的 agent 类型：

| 类型 | 说明 |
|------|------|
| `general-purpose` | 通用，默认 |
| `Explore` | 只读工具，优化代码库探索 |
| `Plan` | 规划和分析 |
| 自定义 | `.codebuddy/agents/` 中定义的 agent |

另外两个相关字段：

- `model`：指定 fork 时使用的模型，未配置时回退到 agent 默认模型；
- `hooks`：Skill 专属的 Hooks，仅在 `context: fork` 时生效（Beta 版本要求）。

**适用场景**：深度调研、大规模代码搜索、需要读很多文件再给结论的任务。

**不适用场景**：官方特别提醒——`context: fork` 只适用于**包含明确任务**的 Skill。只有指导方针、没有具体任务时，不会产生有意义的输出。比如「项目编码规范」这类背景知识应该用 `user-invocable: false` 的普通 Skill（见[技巧 14](/blog/workbuddy-tips/14-skill-trigger)），不要 fork。

## 三、错误或低效写法及问题说明

**错误一：把背景规范 fork 了**

```yaml
---
name: project-guidelines
description: 项目编码规范
context: fork
---

本项目使用 TypeScript 严格模式……
```

fork 出来的子代理没有对话历史，也不会把规范「注入」主对话——它只是对着一段规范文字空转，最后返回一句「已阅读」。规范类内容就该用普通 Skill 注入上下文。

**错误二：fork 任务没有产出要求**

```yaml
---
name: explore
description: 探索代码库
context: fork
agent: Explore
---

看看这个项目的认证模块。
```

子代理不知道要返回什么，可能读完一大堆文件后给一段漫无边际的总结。

**错误三：忘了 fork 拿不到主对话上下文**

在 Skill 里写「根据我们刚才讨论的方案……」——子代理看不到「刚才」，会直接卡住。fork Skill 的任务描述必须自包含。

## 四、正确应用方式：写一个深度调研 Skill

```yaml
---
name: deep-research
description: 深入研究某个主题或代码模块。当用户要求调研、摸清调用链、查找可复用实现时触发，返回带文件引用的结论摘要。
context: fork
agent: Explore
allowed-tools: Read, Glob, Grep
---

研究 $ARGUMENTS：

1. 使用 Glob 和 Grep 查找相关文件，不要读取整个项目
2. 读取最相关的 5–10 个文件，忽略测试与生成代码
3. 总结发现，每条结论附加具体文件引用（路径:行号）
4. 明确列出「未找到」的部分，不要猜测

输出限制：不超过 15 条结论，不超过 400 字。
不要提出实现方案，只报告事实。
```

**关键点拆解**：

- `$ARGUMENTS` 是占位符，会替换为用户传入的参数；
- `agent: Explore` 给只读工具，天然防止子代理改文件；
- 「不超过 15 条、400 字」约束了返回量——否则主上下文省下来的空间又被总结吃掉；
- 「明确列出未找到的部分」防止模型用猜测填空；
- 整个任务是自包含的，不依赖主对话历史。

**使用方式**：

```text
用 deep-research 调研一下我们的 token 刷新机制，重点找可复用的 OAuth 工具。
```

主对话只收到 400 字摘要，继续写实现时上下文很干净。

**Hooks 进阶**（Beta，仅 fork 生效）：可以给 Skill 加执行前后的守卫：

```yaml
hooks:
  PreToolUse:
    - matcher: "Read|Glob|Grep"
      hooks:
        - type: command
          command: ${CODEBUDDY_SKILL_DIR}/scripts/check-paths.sh
          timeout: 10
```

注意安全闸门：非内置来源的 Skill frontmatter hooks 默认不注册，需要在 settings 里设置 `allowUntrustedFrontmatterHooks: true` 才会启用。另外，需要产出 artifact 的 Skill 请用**前台执行**——后台命令的 artifact 声明暂不会被处理。

## 五、关键点与常见陷阱

**关键点**

1. fork 用于**有明确任务的调研/分析**，不用于背景知识。
2. 任务描述必须自包含，不要引用主对话历史。
3. 明确限定返回格式和长度，否则省下的上下文会被长总结吃掉。
4. 优先用 `Explore` agent，只读更安全。
5. `agent`、`model`、`hooks` 都只在 fork 时生效。

**常见陷阱**

- **fork + 产出文件**：子代理写完文件主对话不知道去哪找。需要 artifact 时用前台执行并声明产物。
- **fork 里写「继续上面的方案」**：没有「上面」。
- **把 fork 当成加速器**：它主要解决上下文隔离，不必然更快。
- **Hooks 没生效**：检查版本和 `allowUntrustedFrontmatterHooks` 设置。

## 六、动手练习与小挑战

**练习**：把[技巧 11](/blog/workbuddy-tips/11-subagent)里那条「调研 token 刷新机制」的指令改写成 fork Skill：加上 `context: fork`、`agent: Explore`、明确的 10 条以内输出格式。触发一次，观察主对话增加了多少内容。

**小挑战**：对比同一任务的两种做法——普通 Skill 在主对话调研 vs fork Skill 隔离调研。记录主对话的 token 消耗差异，以及写实现阶段 AI 是否还能准确引用调研结论。

## 七、延伸阅读或相关技巧

- [技巧 11：让子代理去翻代码](/blog/workbuddy-tips/11-subagent) —— fork 的手工版本
- [技巧 14：Skill 触发机制](/blog/workbuddy-tips/14-skill-trigger) —— 背景规范类 Skill 该怎么处理
- [技巧 16：allowed-tools 最小权限](/blog/workbuddy-tips/16-skill-permission) —— 与 fork 配合的安全边界
