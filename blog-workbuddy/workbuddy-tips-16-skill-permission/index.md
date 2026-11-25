---
slug: 16-skill-permission
title: 技巧 16：给 Skill 上锁——allowed-tools 与权限最小化
authors: [lbytsl]
tags: [workbuddy-tips, tools]
date: 2026-11-21
description: 用 allowed-tools 白名单把 Skill 限制在它真正需要的工具范围内，减少误操作，也让 AI 更准确判断该不该调用它。
---

# 技巧 16：给 Skill 上锁——allowed-tools 与权限最小化

> 一句话概括：审查类 Skill 不该有写文件的权限——只给它真正需要的工具，既安全又能提升触发准确率。

{/* truncate */}

## 一、技巧名称与一句话概括

**技巧名称**：Skill 最小权限（Least Privilege for Skills）。

**一句话概括**：通过 `allowed-tools` 白名单显式声明 Skill 能用的工具，把「可能误删文件的助手」变成「只能看不能动的审查员」。

## 二、核心原理与适用场景

`allowed-tools` 是 `SKILL.md` frontmatter 里的一个字段，用逗号分隔列出允许的工具：

```yaml
---
name: pdf
description: PDF 文档处理专家
allowed-tools: Read, Write, Bash, WebFetch
---
```

它有两层作用：

1. **安全边界**：Skill 只能调用白名单里的工具，写不写文件、能不能跑命令都由你定；
2. **触发信号**：AI 选择 Skill 时会看「任务所需工具是否在白名单内」（见[技巧 14](/blog/workbuddy-tips/14-skill-trigger)）。权限写对了，触发判断也更准。

工具支持模式匹配，可以精确到子命令或路径：

```yaml
allowed-tools: Read, Write, Bash(git:status,git:diff), Grep
allowed-tools: Bash(git:*)
allowed-tools: Edit(src/**/*.ts)
```

**适用场景**：任何要交给团队共享的 Skill、涉及文件修改或 Shell 命令的 Skill、你担心 AI 顺手改错东西的时候。

## 三、错误或低效写法及问题说明

```yaml
# ❌ 权限过大
allowed-tools: Bash
```

问题：

- 一个只读的审查 Skill 拿到完整 Bash 权限，理论上可以执行 `rm`、`mv`、任何命令；
- AI 在判断「这个 Skill 适不适合当前任务」时，会认为它能干很多事，可能在不该出场的时候被调用；
- 团队共享后，风险从你一个人扩散到整个项目。

另一个极端是**权限不足**：

```yaml
# ❌ 权限不够
allowed-tools: Read
```

但 Skill 正文里要求「运行 `git diff --stat` 获取变更范围」——`Bash` 不在白名单里，命令执行不了，Skill 被触发也没法完成工作。

## 四、正确应用方式：给审查 Skill 配权限

延续[技巧 15 创建的 PR 审查 Skill](/blog/workbuddy-tips/15-first-skill)，它的实际需要是：读文件、搜索、执行 Git 只读命令。写出来就是：

```yaml
---
name: pr-review
description: PR 与代码变更审查专家。当用户要求审查代码、检查 PR、review 改动时触发，输出分级问题清单。
allowed-tools: Read, Grep, Bash(git:status,git:diff,git:log)
---
```

逐项解释：

- `Read`：读取代码文件；
- `Grep`：搜索相关实现（比如查某个函数被谁调用）；
- `Bash(git:status,git:diff,git:log)`：只允许三条只读 Git 命令，没有 `git push`、没有 `rm`。

**没有 `Write`、没有 `Edit`**：这个 Skill 从物理上就无法改代码，「只报告不修改」不再只是一句提示词约定。

对比一个真正需要写文件的 Skill：

```yaml
---
name: changelog-generator
description: 根据 Git 提交记录生成 CHANGELOG.md
allowed-tools: Read, Write, Bash(git:log)
---
```

它拿到 `Write` 是因为产出就是文件；但依然没有全局 `Bash`，还能跑的 Git 命令只有 `git log`。

**除了白名单，还有两个可见性开关**：

```yaml
# 只能通过 /skill-name 手动触发，AI 不会自动调用
disable-model-invocation: true

# 从 / 菜单隐藏，仅供 AI 内部或其他 Skill 引用（适合项目规范）
user-invocable: false
```

以及设置文件里的 `skillOverrides`，可以在不改 Skill 文件的前提下调整可见性：

```json
{
  "skillOverrides": {
    "legacy-context": "name-only",
    "deploy": "off"
  }
}
```

四态含义：`on`（名称+描述都对模型可见）、`name-only`（仅名称，省 context）、`user-invocable-only`（对模型隐藏，用户仍可调用）、`off`（完全禁用）。

用 `/skills` 面板也能可视化调整这些状态，改动会写入 `.codebuddy/settings.local.json`。

## 五、关键点与常见陷阱

**关键点**

1. 按 Skill 的**实际动作**列工具，不按「可能会用到」列。
2. Shell 命令尽量精确到子命令，别直接给整个 `Bash`。
3. 先跑一遍完整流程，把缺失的工具补进白名单。
4. 背景规范类 Skill 用 `user-invocable: false` 隐藏，减少菜单噪音。
5. 插件来源的 Skill 不受 `skillOverrides` 控制，要用 `/plugin` 管理。

**常见陷阱**

- **工具名拼错**：白名单里写了不存在的工具名，AI 会判断 Skill 不胜任。用 `/skills` 检查。
- **漏掉 `--dangerously-skip-permissions` 场景**：无交互模式下的权限行为与交互模式不同，别混为一谈。
- **以为权限限制等于安全审计**：白名单约束的是工具调用，不是提示词注入风险。
- **所有 Skill 都用同一套白名单**：直接复制粘贴省事，但违背了最小权限原则。

## 六、动手练习与小挑战

**练习**：拿你已有的一个 Skill，列出它的正文实际用到的每一个工具，把 `allowed-tools` 精简到刚好够用。然后用一句自然语言触发它，确认流程仍能跑通。

**小挑战**：创建一个「只读代码审查」Skill 和一个「生成变更文件」Skill，对比两者的 `allowed-tools`。让同事尝试用提示词诱导审查 Skill 去改文件，验证白名单是否真的挡得住。

## 七、延伸阅读或相关技巧

- [技巧 14：Skill 是怎么被触发的](/blog/workbuddy-tips/14-skill-trigger) —— 权限是 AI 判断调用的依据之一
- [技巧 15：从零创建你的第一个 Skill](/blog/workbuddy-tips/15-first-skill) —— 完整的 SKILL.md 结构
- [技巧 17：context: fork](/blog/workbuddy-tips/17-skill-fork) —— 另一种隔离手段：独立上下文
