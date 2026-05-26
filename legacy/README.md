# Legacy — LaTeX Resume

这个目录保存了原始的 LaTeX 简历方案，供有 PDF 精排需求的用户继续使用。

**当前项目主线已切换为 HTML 方案**，见根目录 `README.md`。

---

## 目录结构

```
legacy/
├── templates/
│   ├── elegant-resume.sty     模板样式和组件宏
│   └── resume-template.tex    模板完整示例（含占位内容）
├── resumes/
│   └── sample-resume.tex      示例简历
├── Makefile                   编译命令
├── .latexmkrc                 latexmk 配置（XeLaTeX + TEXINPUTS）
└── README.md                  本文件
```

## 环境要求

- TeX Live 或 MacTeX，需包含 XeLaTeX
- `latexmk`
- 推荐字体：Helvetica Neue、Hiragino Sans GB（macOS 系统自带）

## 快速开始

先将文件复制到项目根目录再编译（因为 Makefile 和 .latexmkrc 以根目录为基准）：

```bash
cp legacy/Makefile .
cp legacy/.latexmkrc .
cp -r legacy/templates templates-latex
cp legacy/resumes/sample-resume.tex resumes/

make FILE=resumes/sample-resume.tex
```

或者直接在 `legacy/` 目录内编译：

```bash
cd legacy
latexmk -cd -xelatex resumes/sample-resume.tex
```

## 可用组件宏

| 宏 | 用途 |
|---|---|
| `\startResume` / `\finishResume` | 文档开始/结束 + 双栏 |
| `\photoPlaceholder` | 照片占位框 |
| `\profileHeader{name}{role}{tagline}` | 侧栏顶部姓名/岗位块 |
| `\sideSection{title}{body}` | 侧栏分块 |
| `\firstMainSection{title}` / `\mainSection{title}` | 主栏章节标题 |
| `\bodyText{...}` | 段落文本 |
| `\projectItem{title}{desc}{tags}{label}{value}` | 项目卡片 |
| `\projectImageItem{title}{desc}{tags}{image}` | 带图项目卡片 |
| `\datedItem{title}{date}{summary}{bullets}` | 经历/教育条目 |
| `\methodItem{num}{label}{text}` | 优势四宫格（配合 `\hfill` 使用） |
| `\resumeTag{text}` | 圆角标签胶囊 |
| `tightBullets` | 紧凑要点列表环境 |
