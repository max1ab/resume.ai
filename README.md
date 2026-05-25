# Resume AI Template

一个适合配合 AI agent 使用的 LaTeX 简历模板项目。

这个项目不是让用户手写 LaTeX，而是提供一套稳定的简历版式和组件。用户只需要告诉 agent 自己的背景、目标岗位和想要的风格，agent 就可以基于模板生成不同内容、不同侧重点的简历。

## 适合怎么用

你可以直接对 agent 说：

```text
基于这个仓库，帮我生成一份面向 AI 工程师岗位的中文简历。
重点突出我的项目经历、模型部署经验和工程能力。
文件放到 resumes/ai-engineer.tex。
```

也可以继续让 agent 迭代：

```text
把这份简历改成后端开发方向，弱化算法表述，强化服务端架构和性能优化。
```

```text
帮我压缩到一页，语气更像正式求职简历，不要太营销。
```

```text
根据这个 JD 重新组织项目顺序，并生成一版投递用 PDF。
```

## 项目结构

```text
resume-it/
├── templates/
│   ├── elegant-resume.sty     模板样式和组件
│   └── resume-template.tex    模板完整示例
├── resumes/
│   ├── sample-resume.tex      示例简历
│   ├── sample-photo.jpg       示例头像
│   ├── [岗位].tex             你的不同岗位简历
│   └── photo.jpg              你的个人照片
├── Makefile                   常用编译命令
└── .latexmkrc                 LaTeX 编译配置
```

`templates/` 是模板本体，通常不需要用户直接修改。

`resumes/` 是简历工作区。你可以让 agent 从 `sample-resume.tex` 复制出多份简历，例如：

```text
resumes/ai-engineer.tex
resumes/backend.tex
resumes/product-manager.tex
```

## 快速开始

先编译示例简历：

```bash
make
```

生成指定简历：

```bash
make FILE=resumes/ai-engineer.tex
```

监听改动并自动重新生成 PDF：

```bash
make watch FILE=resumes/ai-engineer.tex
```

清理中间文件：

```bash
make clean FILE=resumes/ai-engineer.tex
```

## 给 Agent 的建议

如果你把这个仓库交给 agent 使用，可以让它遵守这些原则：

- 不要修改 `templates/`，除非明确要调整整体版式。
- 新简历从 `resumes/sample-resume.tex` 复制。
- 不同岗位使用不同文件名，例如 `resumes/backend.tex`。
- 用户照片直接放在 `resumes/` 下，例如 `resumes/photo.jpg`。
- 编译优先使用 `make FILE=...`。
- 简历内容优先按目标岗位和 JD 重组，而不是简单堆砌经历。

## 环境要求

- TeX Live 或 MacTeX，需包含 XeLaTeX
- `latexmk`
- 推荐字体：Helvetica Neue、Hiragino Sans GB

## 隐私

真实简历和个人照片默认适合放在 `resumes/` 下，并通过 `.gitignore` 忽略。建议只提交模板和示例，不提交个人信息。

如果你要公开这个仓库，请确认 `resumes/` 下没有真实姓名、联系方式、照片或未公开项目经历。
