---
slug: 15-first-skill
title: 技巧 15：从零创建你的第一个 Skill
authors: [lbytsl]
tags: [workbuddy-tips, tools, tutorial]
date: 2026-11-20
description: 把一个每天重复的操作沉淀成可复用 Skill：目录放哪、SKILL.md 怎么写、如何触发，一篇讲清。
---

# 技巧 15：从零创建你的第一个 Skill

> 一句话概括：把「每次都要重复说一遍的流程」写进 SKILL.md，让 AI 以后自动识别并执行。

{/* truncate */}

本篇聚焦 CodeBuddy 的 Skill 目录和 PR 审查示例。跨工具的方法和练习见[通用技巧](/blog/general-tips/08-reusable-skills)。

## 一、技巧名称与一句话概括

**技巧名称**：首个自定义 Skill（First Custom Skill）。

**一句话概括**：选一个高频、单一、触发条件清晰的重复操作，写成 Skill 文件，从此一句话就能调用整套流程。

## 二、核心原理与适用场景

Skill 的本质是「打包好的流程化提示词」——[技巧 04 讲的流程化写法](/blog/workbuddy-tips/04-process-over-role)写在对话里是一次性的，写进 `SKILL.md` 就变成了长期可复用的能力。

**存放位置**：

- 项目级：`.codebuddy/skills/`（随仓库共享给团队）
- 用户级：`~/.codebuddy/skills/`（个人所有项目可用）

每个 Skill 一个独立目录：

```text
.codebuddy/skills/
├── pr-review/
│   └── SKILL.md
├── data-analysis/
│   └── SKILL.md
└── code-review/
    └── SKILL.md
```

WorkBuddy 里还有更省事的做法：直接在对话框说明你想要的能力、触发方式和输出结果，它会帮你创建。官方示例指令：

```text
请帮我创建一个用于记录灵感的自定义 Skill。
当我输入灵感、想法或待验证创意时，自动识别内容类型，
整理成结构化记录，并保存到指定目录。
```

创建完成后，在技能栏的已安装目录下就能看到。

**适用场景**：每天都要做的固定流程（代码审查、生成提交信息、整理笔记、固定格式的报告）。

## 三、错误或低效写法及问题说明

**错误一：第一个 Skill 就想做万能助手**

```text
请创建一个能帮我处理所有开发任务的 Skill。
```

官方建议很明确：**首个自定义 Skill 只解决一个明确问题**。范围太大，AI 无法判断何时触发，description 也没法写具体。

**错误二：只有能力描述，没有触发条件**

```markdown
---
name: note
description: 笔记整理
---

整理笔记。
```

用户什么时候会想要它？输出什么格式？写到哪里？全都没说。触发条件不清，Skill 就形同虚设。

**错误三：把一次性需求做成 Skill**

「帮我把这个项目从 Vue2 迁到 Vue3」是一次性任务，写进提示词即可。沉淀成 Skill 的是「每次迁移都要遵循的检查清单」，而不是这次迁移本身。

## 四、正确应用方式：创建一个 PR 审查 Skill

**第一步：用自然语言让 WorkBuddy 帮你创建**

```text
请帮我创建一个 PR 代码审查 Skill。
当我要求审查代码、检查 PR、review 改动时触发。
按安全、正确性、一致性、可维护性四个维度检查，
输出「严重/一般/建议」三级清单，每条带文件名和行号，
只报告问题，不修改代码。
```

**第二步：检查生成的 SKILL.md**

```markdown
---
name: pr-review
description: PR 与代码变更审查专家。当用户要求审查代码、检查 PR、review 改动、查找潜在 Bug 或安全问题时触发，输出定位到行号的分级问题清单。
allowed-tools: Read, Grep, Bash(git:diff)
---

# PR 审查

## 触发条件
用户要求审查代码变更、检查 PR 或 review 已有实现。

## 执行步骤
1. 先确认变更范围：运行 !`git diff --stat`
2. 逐文件读取变更内容，只看本次改动部分
3. 按四个维度检查：
   - 安全：注入、越权、敏感信息
   - 正确性：边界条件、并发、错误处理
   - 一致性：与项目现有写法和 CODEBUDDY.md 约定是否一致
   - 可维护性：命名、重复、必要注释
4. 按级别输出：
   - 严重：会导致线上故障
   - 一般：需要修复但不阻塞合并
   - 建议：可选优化
5. 每条格式：文件:行号 — 问题 — 修复建议
6. 最后给出结论：可以合并 / 修改后重审

## 约束
- 只报告，不修改任何文件
- 未发现问题的维度也要明确写出
```

注意这里用到了官方支持的 `!`command`` 语法：Skill 触发时会执行 Shell 命令，输出替换进内容供 AI 分析。

**第三步：验证触发**

```text
帮我 review 一下这次的改动，看看有没有安全问题。
```

不需要输入 `/pr-review`，AI 应根据 description 自动匹配（原理见[技巧 14](/blog/workbuddy-tips/14-skill-trigger)）。

**第四步：迭代**

如果用起来发现它总漏掉性能问题，就在 SKILL.md 的检查维度里补一条「性能：循环内请求、N+1 查询、重复计算」，并同步更新 description 的触发词。

## 五、关键点与常见陷阱

**关键点**

1. 从**最高频**的重复动作开始——越高频越值得沉淀。
2. 单一能力、明确触发条件、明确输出，三样缺一不可。
3. 正文用有序步骤写流程，不用形容词写期望。
4. 团队共用的放项目级，个人习惯放用户级。
5. 用 `/skills` 确认它已加载、token 占用是否合理。

**常见陷阱**

- **SKILL.md 写成需求文档**：写「应该怎么办」，不要写「为什么要这么做」。
- **忘了写约束**：「只报告不修改」这类边界一定要写进正文。
- **权限开太大**：审查类 Skill 根本不需要 Write，见[技巧 16](/blog/workbuddy-tips/16-skill-permission)。
- **创建完就不管了**：用几次后根据实际表现迭代 description 和步骤。

## 六、动手练习与小挑战

**练习**：找出你过去一周重复说过三次以上的一条指令（比如「按项目规范生成提交信息」），把它写成完整 Skill：description 含 3 个触发词、正文含 4 个步骤、明确输出格式。

**小挑战**：把写好的 Skill 放进项目级目录并 git 提交，让同事在他们的会话里用自然语言触发它。看看他们是否一次就成功。

## 七、延伸阅读或相关技巧

- [技巧 14：读懂 Skill 的 description](/blog/workbuddy-tips/14-skill-trigger) —— 触发机制决定 Skill 会不会被用
- [技巧 16：给 Skill 上锁](/blog/workbuddy-tips/16-skill-permission) —— allowed-tools 的最小权限原则
- [技巧 17：context: fork](/blog/workbuddy-tips/17-skill-fork) —— 让 Skill 在隔离上下文里运行
