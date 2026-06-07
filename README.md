# Resume AI Template

一个适合配合 AI agent 使用的 HTML 简历模板项目。

用户只需把自己的背景、目标岗位和经历告诉 agent，agent 将内容整理成 JSON，通过构建脚本生成一份可直接在浏览器打开的 HTML 简历。生成文件会内联样式和脚本；照片仍按相对路径引用。无需安装 LaTeX 或任何 npm 依赖，浏览器打印即可导出 PDF。

## 适合怎么用

你可以直接对 agent 说：

```text
基于这个仓库，帮我生成一份面向 AI 工程师岗位的中文简历。
重点突出我的项目经历、模型部署经验和工程能力。
文件放到 resumes/ai-engineer.json。
```

也可以让 agent 继续迭代：

```text
把这份简历改成后端开发方向，弱化算法表述，强化服务端架构和性能优化。
```

```text
帮我压缩到一页，语气更像正式求职简历，不要太营销。
```

```text
根据这个 JD 重新组织项目顺序，然后重新构建 HTML。
```

## 项目结构

```text
resume.ai/
├── templates/
│   ├── resume.html             HTML 骨架（含三个构建占位符）
│   ├── resume.css              双栏布局样式
│   ├── render.js               Vanilla JS 渲染器
│   ├── resume-schema.json      JSON 数据结构说明
│   └── resume-standalone.html  无 Node 备用模板
├── resumes/
│   ├── sample-resume.json      示例简历数据
│   ├── sample-photo.jpg        示例头像
│   ├── [岗位].json             你的不同岗位简历数据
│   └── photo.jpg               你的个人照片（gitignore 忽略）
├── scripts/
│   └── build.mjs               构建脚本（纯 Node stdlib，无 npm 依赖）
├── skills/
│   └── resume-writer/SKILL.md  给 AI agent 的简历写作规则
└── legacy/                     归档的 LaTeX 方案（见 legacy/README.md）
```

`templates/` 是模板本体，通常不需要修改。

`resumes/` 是简历工作区。让 agent 从 `resumes/sample-resume.json` 复制出不同岗位的 JSON：

```text
resumes/ai-engineer.json
resumes/backend.json
resumes/product-manager.json
```

## 快速开始

构建示例简历：

```bash
node scripts/build.mjs resumes/sample-resume.json
open resumes/sample-resume.html
```

构建指定简历：

```bash
node scripts/build.mjs resumes/ai-engineer.json
```

监听改动并自动重新构建：

```bash
node scripts/build.mjs resumes/ai-engineer.json --watch
```

构建完成后，用浏览器打开对应 `.html` 文件即可预览。使用浏览器的打印功能（`Cmd+P` / `Ctrl+P`）可导出为 PDF。

生成无 Node 备用模板：

```bash
node scripts/build.mjs --standalone-template
```

如果目标环境没有 Node.js，可以复制 `templates/resume-standalone.html` 到 `resumes/<name>.html`，再把里面的 `__RESUME_DATA__` 替换成简历 JSON。替换前需要把 JSON 文本中的 `<`、`>`、`&` 分别替换为 `\u003c`、`\u003e`、`\u0026`，避免破坏 HTML 的 JSON 数据块。

## JSON 数据结构

简历数据以 JSON 格式描述，完整 schema 见 [`templates/resume-schema.json`](templates/resume-schema.json)。核心字段：

```json
{
  "photo": "resumes/photo.jpg",
  "theme": {
    "font": "modern",
    "layout": "sidebar-left",
    "headingStyle": "bar",
    "color": "classic-blue"
  },
  "profile": {
    "name": "姓名",
    "role": "目标岗位",
    "tagline": "2 行以内的个人简介"
  },
  "sideSections": [
    { "title": "基本信息", "lines": ["城市 · 学历", "Phone: 138xxxx"] },
    { "title": "联系方式", "lines": [
      { "text": "yourname@email.com", "url": "mailto:yourname@email.com" }
    ]}
  ],
  "mainSections": [
    { "title": "关于我",   "type": "body",       "paragraphs": ["..."] },
    { "title": "代表项目", "type": "projects",   "items": [...] },
    { "title": "经历",     "type": "experience", "items": [...] },
    { "title": "作品展示", "type": "projects",   "items": [
      { "title": "带图片的项目", "description": "...", "image": "project.png" }
    ] }
  ]
}
```

`theme.color` 支持：

```text
neutral / classic-blue / academic-red / business-green / creative-orange
```

`theme.headingStyle` 支持 `bar`、`marker`、`underline`。双栏默认 `bar`，单栏默认 `marker`。

`theme.layout` 可用 `sidebar-left`、`sidebar-right` 或 `single`。
双栏示例见 `resumes/sample-resume.json`，单栏示例见 `resumes/sample-single.json`。

也可以用 `theme.colors` 覆盖少量颜色 token，值必须是 hex 色值：

```json
{
  "theme": {
    "color": "classic-blue",
    "colors": {
      "accent": "#245B82",
      "sidebg": "#F4F8FA",
      "tagbg": "#E8F0F7"
    }
  }
}
```

## 给 Agent 的建议

更完整的 agent 工作流见 [`skills/resume-writer/SKILL.md`](skills/resume-writer/SKILL.md)。

- 不要修改 `templates/`，除非明确要调整整体版式。
- 新简历从 `resumes/sample-resume.json` 复制并修改内容。
- 不同岗位使用不同文件名，例如 `resumes/backend.json`。
- 用户照片直接放在 `resumes/` 下，例如 `resumes/photo.jpg`。
- 修改 JSON 后运行 `node scripts/build.mjs resumes/<file>.json` 重新生成 HTML。
- 简历内容优先按目标岗位和 JD 重组，而不是简单堆砌经历。
- `mainSections` 的 `type` 字段只能是 `body`、`projects`、`experience`、`methods` 四种。

## 隐私

真实简历数据和个人照片默认通过 `.gitignore` 忽略，只提交模板和示例。如果要公开这个仓库，请确认 `resumes/` 下没有真实姓名、联系方式、照片或未公开项目经历。

## 环境要求

- Node.js 18+（使用原生 ESM，无需 npm install）

---

## 旧 LaTeX 方案

原始 LaTeX/PDF 方案已归档到 [`legacy/`](legacy/README.md)，有精排 PDF 需求时可参考。
