---
slug: 20-review-pipeline
title: 技巧 20：把审查变成流水线——Skill + 子代理 + CI 门禁
authors: [lbytsl]
tags: [workbuddy-tips, tools, tutorial]
date: 2026-11-25
description: 把结构化审查提示词固化成 Skill，用独立上下文审查，再用 CI 中的一次性模式做门禁——系列收官实战。
---

# 技巧 20：把审查变成流水线——Skill + 子代理 + CI 门禁

> 一句话概括：把前面的审查、Skill 和自动化方法串起来——审查清单做成 Skill，交给独立上下文执行，最后用 CI 里的 `codebuddy -p` 卡住不合格的改动。

{/* truncate */}

## 一、技巧名称与一句话概括

**技巧名称**：审查流水线（Review Pipeline）。

**一句话概括**：把一次性审查提示词固化为可复用 Skill，用隔离上下文保证客观，再接入 CI 让「严重问题不合并」成为自动执行的规则。

这是本系列的收官篇：它综合了[通用 01 · 先写验收标准](/blog/general-tips/01-acceptance-criteria)、[通用 07 · 证据式代码审查](/blog/general-tips/07-evidence-based-review)、[技巧 15 创建 Skill](/blog/workbuddy-tips/15-first-skill)、[技巧 17 context: fork](/blog/workbuddy-tips/17-skill-fork)和[技巧 19 命令行管道](/blog/workbuddy-tips/19-log-pipeline)。

## 二、核心原理与适用场景

单个技巧能解决单点问题；把它们串起来，才形成**不依赖人自觉的质量机制**。

流水线分三层：

| 层级 | 载体 | 解决什么 |
|------|------|---------|
| 规范层 | 结构化审查提示词（通用 07） | 审查什么、怎么分级、怎么回报 |
| 复用层 | Skill（技巧 15、16、17） | 一句话触发、权限可控、上下文隔离 |
| 执行层 | CI 中的 `codebuddy -p`（技巧 19） | 每次提交自动跑，结果可解析 |

**适用场景**：团队协作、需要稳定代码质量门禁、审查意见总是靠「想起来才做」的项目。

## 三、错误或低效写法及问题说明

**错误一：审查全靠人记得**

```text
（口头约定）提交前大家互相看看代码。
```

结果：赶工期时第一条被牺牲的就是审查。

**错误二：把审查做成一次性提示词**

每次都手动粘贴一大段审查指令到对话里。容易发生：漏贴、用旧版本、不同人用的清单不一样。

**错误三：CI 里让 AI 自由输出**

```bash
codebuddy -p "Review the changes"
```

得到一段自然语言。脚本没法判断「有没有严重问题」，门禁形同虚设。

## 四、正确应用方式：三层搭一条流水线

**第一层：固化审查 Skill**

在 `.codebuddy/skills/pr-review/SKILL.md` 里写下[通用 07 · 证据式代码审查](/blog/general-tips/07-evidence-based-review)的清单和[技巧 15](/blog/workbuddy-tips/15-first-skill)的结构，权限按[技巧 16](/blog/workbuddy-tips/16-skill-permission)收紧：

```yaml
---
name: pr-review
description: PR 与代码变更审查专家。当用户要求审查代码、检查 PR、review 改动时触发，输出严重/一般/建议三级清单。
context: fork
agent: Explore
allowed-tools: Read, Grep, Bash(git:status,git:diff,git:log)
---

审查 $ARGUMENTS：
1. 运行 !`git diff --stat` 确认变更范围
2. 逐文件读取变更，按安全、正确性、一致性、可维护性四维检查
3. 输出 JSON 数组，每项字段：file、line、severity、issue、suggestion
4. severity 只允许 critical / major / suggestion
5. 未发现问题的维度也要返回一条空结论
只报告，不修改代码。
```

`context: fork` 让审查在独立上下文里进行——审查者没写过这段代码，偏见更少（呼应[通用 06 · Git 工作树隔离](/blog/general-tips/06-isolated-worktrees)和[技巧 11 子代理](/blog/workbuddy-tips/11-subagent)）。

**第二层：本地日常使用**

开发者提交前只需一句：

```text
用 pr-review 审查我这次的改动。
```

拿到分级清单，先处理 `critical` 和 `major`，再提交。这一步把问题挡在合并之前。

**第三层：CI 门禁**

官方最佳实践里给了把 CodeBuddy 当 linter 用的写法。在 `package.json` 中加脚本：

```json
{
  "scripts": {
    "lint:codebuddy": "codebuddy -p 'You are a linter. Review changes relative to main and report any issues. Report filename and line number on one line, and issue description on the second line. Do not return any other text.'"
  }
}
```

若要按级别设置门禁，先在可信环境运行审查命令，只有在命令成功退出后，才把审查结果交给检查器。下面的检查器以 `review.json` 中的**发现数组**为输入；如果当前 CLI 把答案包在自己的 JSON 对象里，先按实际输出提取发现数组，不要把 CLI 输出格式和业务报告格式当成一回事。

将下面的代码保存为 `check-review.mjs`，在同一 CI 作业中运行 `node check-review.mjs`：

```js
import { readFileSync } from 'node:fs';

try {
  const findings = JSON.parse(readFileSync('review.json', 'utf8'));
  const levels = ['critical', 'major', 'suggestion'];
  if (!Array.isArray(findings) || findings.some(item => !item || !levels.includes(item.severity))) {
    throw new Error('审查报告必须是数组，且每项包含有效的 severity');
  }
  if (findings.some(item => item.severity === 'critical')) {
    throw new Error('存在 critical 发现，请人工确认后再合并');
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
```

报告文件缺失、解析错误、结构无效和发现 `critical` 都会阻止门禁通过。`[]` 只表示一次成功的审查没有返回发现，不表示测试通过。每次在干净的 CI 工作目录生成新报告，不复用上一次输出。

**门禁规则建议**：

- `critical`：直接阻塞合并；
- `major`：生成评论，要求人工确认；
- `suggestion`：仅提示，不阻塞。

**第四层（可选）：审查者与被审查者分离**

让写代码的会话和审查的会话在不同 worktree 中运行（见[通用 06 · Git 工作树隔离](/blog/general-tips/06-isolated-worktrees)），CI 里的审查天然就是「全新上下文」，比作者自审可靠得多。

## 五、关键点与常见陷阱

**关键点**

1. 本地可使用 Skill。若要让 CI 使用相同标准，在 CI 提示词里显式传入受信任版本的审查清单；不能假设一次性命令会自动加载 Skill。
2. 输出必须是结构化格式，否则门禁无法判断。
3. 分级规则要明确定义——「critical 指会导致线上故障的问题」这类定义要写进 Skill。
4. 先核对 CI 的运行权限；不要让不受信任的变更修改门禁配置或接触凭据。
5. AI 审查是补充，不替代人工审查和自动化测试。

**常见陷阱**

- **门禁规则过严**：所有级别都阻塞，团队会被噪音淹没，最终集体绕过检查。
- **没有定义级别含义**：不同人对 critical 理解不同，输出就不稳定。
- **审查范围太大**：一次审整个仓库，反馈质量骤降。限定 diff 范围。
- **日志带敏感信息进 CI 模型**：先脱敏。
- **把审查当测试用**：AI 审查找逻辑和风格问题，不能替代真正的单元测试。

## 六、动手练习与小挑战

**练习**：把你团队当前的代码审查清单整理进 `pr-review` Skill，加上 CI 脚本。选一次真实 PR，对比「人工审查」和「AI 审查」分别发现了几个问题，重叠度多少。

**小挑战（毕业设计）**：完整搭一遍流水线：结构化审查 Skill → 本地一句话触发 → CI 门禁脚本 → 一条故意引入严重问题的分支。验证严重发现、无效 JSON 和审查命令失败都会阻塞；修复后再合并。

## 七、延伸阅读或相关技巧

### 系列回顾：从通用方法到工具实战

| 阶段 | 技巧 | 核心解决什么 |
|------|------|-------------|
| 入门·提示词 | [01 四要素](/blog/workbuddy-tips/01-task-brief) · [02 @ 引用](/blog/workbuddy-tips/02-at-reference) · [通用 01 · 先写验收标准](/blog/general-tips/01-acceptance-criteria) · [04 流程优于角色](/blog/workbuddy-tips/04-process-over-role) | 把话说清楚，让 AI 不用猜 |
| 入门·任务拆解 | [05 模式选择](/blog/workbuddy-tips/05-modes) · [06 Plan 模式](/blog/workbuddy-tips/06-plan-mode) · [通用 03 · 可验证的任务切片](/blog/general-tips/03-verifiable-slices) · [通用 06 · Git 工作树隔离](/blog/general-tips/06-isolated-worktrees) | 控制改动范围，可回退可并行 |
| 进阶·上下文 | [通用 02 · 从入口收集上下文](/blog/general-tips/02-focused-context) · [10 CODEBUDDY.md](/blog/workbuddy-tips/10-codebuddy-md) · [11 子代理](/blog/workbuddy-tips/11-subagent) · [12 检查点恢复](/blog/workbuddy-tips/12-resume-rewind) | 让有限上下文花在刀刃上 |
| 进阶·Skills | [14 触发机制](/blog/workbuddy-tips/14-skill-trigger) · [15 第一个 Skill](/blog/workbuddy-tips/15-first-skill) · [16 权限最小化](/blog/workbuddy-tips/16-skill-permission) · [17 context fork](/blog/workbuddy-tips/17-skill-fork) | 把好流程沉淀成可复用能力 |
| 实战·调试审查 | [通用 07 · 证据式代码审查](/blog/general-tips/07-evidence-based-review) · [通用 05 · 最小复现](/blog/general-tips/05-minimal-repro) · [19 日志管道](/blog/workbuddy-tips/19-log-pipeline) · [20 审查流水线](/blog/workbuddy-tips/20-review-pipeline) | 定位问题，并把质量变成机制 |

**一条主线**：先把需求说清，再控制执行范围和上下文，最后用 Skills 与流水线固定可重复的验证步骤。

这里的通用方法与工具实战均可独立阅读，也可以按上面的顺序连读。如果你从中间某篇开始，建议先扫一眼[技巧 01](/blog/workbuddy-tips/01-task-brief)——它是所有后续技巧的地基。

更多实战资源：[Prompt 模板库](/docs/prompt/intro) · [Skills 工具集](/docs/skills/intro) · [PromptOps 质量工程](/blog/promptops)
