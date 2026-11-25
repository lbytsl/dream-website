---
slug: 19-log-pipeline
title: 技巧 13：用管道把日志交给 AI——命令行调试工作流
authors: [lbytsl]
tags: [workbuddy-tips, tools, tutorial]
date: 2026-11-24
description: 掌握 codebuddy -p 的一次性执行模式与管道输入，把构建错误、测试日志交给 AI 分析，并按格式拿到可解析结果。
---

# 技巧 13：用管道把日志交给 AI——命令行调试工作流

> 一句话概括：把命令输出直接管道给 `codebuddy -p`，不用复制粘贴日志，还能让结果以 JSON 形式回到脚本里。

{/* truncate */}

本篇聚焦 CodeBuddy 的日志管道与输出示例。跨工具的方法和练习见[通用技巧](/blog/general-tips/09-structured-cli-results)。

## 一、技巧名称与一句话概括

**技巧名称**：管道式调试（Pipeline Debugging）。

**一句话概括**：用 `cat ... | codebuddy -p "..."` 把筛选后的日志交给 AI 一次性分析，适合构建失败、测试报错和自动化流水线。

这是[通用 02 · 从入口收集上下文](/blog/general-tips/02-focused-context)的命令行版本，也是[技巧 14 审查流水线](/blog/workbuddy-tips/20-review-pipeline)的基础设施。

## 二、核心原理与适用场景

`codebuddy -p`（`--print`）是**一次性执行模式**：给一个提示词，输出结果，退出。没有交互式会话。

它天然适合管道：

```bash
cat errors.txt | codebuddy -p '用三句话说明根本原因' > output.txt
```

官方文档给出的场景包括：

- 脚本和自动化任务；
- CI/CD 流水线；
- 一次性查询（「解释这个项目是做什么的」）；
- 日志分析（「分析这份日志里的错误」）。

**输出格式**可以用 `--output-format` 控制：

| 格式 | 产出 |
|------|------|
| `text` | 纯文本回复 |
| `json` | JSON 数组，含 cost、duration 等元数据 |
| `stream-json` | 实时流式 JSON 对象（整体拼接不是合法 JSON） |

**权限注意**：用 `-p` 单次执行时，如果操作需要文件访问或命令执行授权，必须加 `-y`（或 `--dangerously-skip-permissions`）。单独加 `-y` 时，高危命令仍可能要求确认。

**适用场景**：构建报错、测试日志分析、批量文件检查、CI 里跑代码审查。

## 三、错误或低效写法及问题说明

**错误一：把全量日志直接管道过去**

```bash
cat build.log | codebuddy -p '看看哪里错了'
```

800 行日志里可能只有 5 行有效信息，其余既烧 token 又干扰判断（见[通用 02 · 从入口收集上下文](/blog/general-tips/02-focused-context)）。

**错误二：不指定输出要求**

「看看哪里错了」会得到一个大段解释。如果后面还要用脚本解析结果，这种输出没法用。

**错误三：一次性模式却需要改文件但没加 `-y`**

```bash
codebuddy -p "Review the code quality of src/utils.js"
```

需要读文件授权时这条命令会卡住或失败。缺少 `-y` 是最常见的坑。

## 四、正确应用方式：三种调试管道

**场景一：构建错误定位**

```bash
# 先筛出错误行及前后文，再交给 AI
grep -n -A 8 -B 3 "error TS\|ERROR in" build.log > errors.txt

cat errors.txt | codebuddy -p \
  '用三句话说明根本原因，指出最先出错的文件和行号。不要给修复代码。' \
  > analysis.txt
```

**场景二：测试失败按原因分组**

```bash
grep -E "FAIL|●|Error:" test-output.log | \
codebuddy -p '按失败原因分组，每组给出最可能的一处代码位置，输出不超过 10 行' \
  --output-format text
```

**场景三：CI 中拿到结构化结果**

```bash
cat src/utils/request.ts | \
codebuddy -p '列出这个文件中的潜在 Bug，每项包含 line、severity、issue 三个字段' \
  --output-format json > analysis.json
```

拿到 JSON 后脚本就能按 `severity` 决定是否阻塞流水线（这正是[技巧 14](/blog/workbuddy-tips/20-review-pipeline)要做的事）。

**需要写文件的自动化任务**要加 `-y`：

```bash
codebuddy -p "Add unit tests for all files in services directory" -y
```

**批量任务**可以用循环扇出：

```bash
for file in $(cat files-to-check.txt); do
  codebuddy -p "Check $file for deprecated API usage" --output-format json
done
```

## 五、关键点与常见陷阱

**关键点**

1. **先筛选再管道**：`grep -A 8 -B 3` 保留错误前后文，别只留一行。
2. 提示词里明确输出长度和格式，尤其当结果要被脚本消费时。
3. 需要文件访问或命令执行时加 `-y`；高危环境下要清楚它的含义。
4. JSON 输出适合程序解析，`stream-json` 适合实时展示但不是完整 JSON。
5. 一次性模式无会话上下文，任务必须自包含——别写「继续刚才的分析」。

**常见陷阱**

- **管道输入和 `@` 引用混用搞混**：管道传递的是 stdin 内容，文件引用是另一套机制。
- **以为 `-y` 等于无限制**：HIGH/CRITICAL 危险命令仍可能要确认。
- **在沙箱里误用 `-p -y`**：`export CODEBUDDY_IS_SANDBOX=1` 配合 `-p -y` 会抑制所有提示，风险很高。
- **日志含敏感信息**：管道前先脱敏，别把 token、手机号送进模型。

## 六、动手练习与小挑战

**练习**：制造一次构建失败，把日志保存到本地。先直接 `cat build.log | codebuddy -p '哪里错了'`，再用 `grep` 筛选后重复一次。对比两次的回答质量与耗时。

**小挑战**：写一个脚本，把三个日志文件的分析结果以 JSON 格式输出，并用 `jq` 提取所有 `severity=high` 的条目。这就是一个最小可用的 CI 门禁原型。

## 七、延伸阅读或相关技巧

- [通用 02 · 从入口收集上下文](/blog/general-tips/02-focused-context) —— 筛选日志的底层理由
- [通用 05 · 最小复现](/blog/general-tips/05-minimal-repro) —— 交互式调试的上下文组织方式
- [技巧 14：代码审查流水线](/blog/workbuddy-tips/20-review-pipeline) —— 把管道用法接入 CI
