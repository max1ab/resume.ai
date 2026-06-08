# Resume Writer

可独立发布的 AI agent skill：整理 JSON 简历数据，构建 HTML 预览，浏览器打印导出 PDF。

无需 LaTeX，无需 npm install。需要 Node.js 18+。

## 包内结构

```text
resume-writer/
├── SKILL.md
├── README.md
├── reference.md
├── scripts/build.mjs
├── templates/
└── examples/          # Agent 用法示例（最小集，随包发布）
    └── assets/
```

仓库根目录的 `examples/` 是宣传展示样例，给人看，不随 skill 包发布。

## 安装

```bash
cp -R resume-writer ~/.cursor/skills/resume-writer
```

## 快速开始

Agent 用法示例（HTML 本地生成，不提交）：

```bash
node resume-writer/scripts/build.mjs resume-writer/examples/sample-resume.json
open resume-writer/examples/sample-resume.html
```

在本仓库预览宣传样例：

```bash
node resume-writer/scripts/build.mjs examples/sample-classic-blue.json
open examples/sample-classic-blue.html
```

## PDF 导出

预览页点击 **导出 PDF**，在浏览器打印对话框中选择「存储为 PDF」。

- **推荐 Chrome 或 Edge**（Chromium 内核）：打印预览与最终 PDF 一致。
- **Safari**：打印预览可能上移或出现细线，但最终 PDF 通常正常；若效果不理想，请换 Chrome。
- 纸张 **A4**、边距 **无**、勾选 **打印背景**、关闭 **页眉页脚**。

非 Chromium 浏览器打开预览时，顶栏右侧会显示提示。

## 对 Agent 怎么说

```text
用 resume-writer，从 examples/sample-resume.json 起步，
帮我生成一份 AI 工程师岗位的中文简历，保存为 ai-engineer.json 并构建 HTML。
```

## 更多说明

- Agent 规则：[`SKILL.md`](SKILL.md)
- 数据结构与主题：[`reference.md`](reference.md)
- JSON schema：[`templates/resume-schema.json`](templates/resume-schema.json)
