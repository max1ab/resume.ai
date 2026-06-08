# Resume AI

本仓库维护可独立发布的 **Resume Writer** skill 包，以及仓库级的宣传示例。

## 结构

```text
resume.ai/
├── resume-writer/              # 发布包
│   └── examples/               # Agent 用法示例（最小集，随包发布）
├── examples/                   # 宣传展示 JSON（给人看，不进发布包）
└── legacy/                     # 归档 LaTeX 方案
```

| 目录 | 用途 |
|------|------|
| `resume-writer/examples/` | 教 Agent 怎么用的最小示例 |
| `examples/` | 主题/版式宣传样例，只提交 JSON |

发布时只需要 `resume-writer/`。

## 快速开始

构建宣传示例：

```bash
node resume-writer/scripts/build.mjs examples/sample-classic-blue.json
open examples/sample-classic-blue.html
```

构建 Agent 用法示例：

```bash
node resume-writer/scripts/build.mjs resume-writer/examples/sample-resume.json
open resume-writer/examples/sample-resume.html
```

## 安装 Agent Skill

```bash
npx skills add max1ab/resume.ai
```

手动安装：

```bash
cp -R resume-writer ~/.cursor/skills/resume-writer   # Cursor
cp -R resume-writer ~/.claude/skills/resume-writer   # Claude Code
cp -R resume-writer ~/.codex/skills/resume-writer     # Codex
```

在用户项目里自行创建工作目录存放简历 JSON。

## 发布

Skill 包目录为 `resume-writer/`。正式版本见 GitHub Releases（`v1.0.0` 起）。

## 文档

- 包说明：[`resume-writer/README.md`](resume-writer/README.md)
- Agent 规则：[`resume-writer/SKILL.md`](resume-writer/SKILL.md)
- Schema 参考：[`resume-writer/reference.md`](resume-writer/reference.md)

## 环境要求

- Node.js 18+（纯 Node stdlib，无需 npm install）

## 旧 LaTeX 方案

见 [`legacy/README.md`](legacy/README.md)。
