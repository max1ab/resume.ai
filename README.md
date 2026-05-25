# Resume LaTeX Template

一个双栏 LaTeX 简历模板，左栏放照片、姓名、基础信息，右栏放关于我、项目经历、实习经历等主要内容。

## 目录结构

```
resume-it/
├── templates/
│   ├── elegant-resume.sty     版式和组件定义
│   └── resume-template.tex    完整模板，含所有组件示例和占位内容
├── resumes/
│   ├── sample-resume.tex      示例简历，可作为新建简历的起点
│   ├── sample-photo.jpg       示例头像
│   ├── [岗位].tex             个人简历（建议加入 .gitignore）
│   └── photo.jpg              个人照片（建议加入 .gitignore）
└── .latexmkrc                 编译配置，自动使用 XeLaTeX 并设置 TEXINPUTS
```

## 环境要求

- TeX 发行版：[TeX Live](https://www.tug.org/texlive/) 或 [MiKTeX](https://miktex.org/)（需含 XeLaTeX）
- 字体：**Helvetica Neue**（正文）、**Hiragino Sans GB**（中文）
- 包：`latexmk`（推荐，用于自动编译）

## 编译

```bash
# 编译单份简历
latexmk -cd resumes/sample-resume.tex

# 一次编译所有简历
latexmk -cd resumes/*.tex

# 监听改动，保存后自动重编
latexmk -cd -pvc resumes/sample-resume.tex

# 清理中间文件（.aux .log .out 等）
latexmk -cd -C resumes/sample-resume.tex
```

也可以直接用 XeLaTeX：

```bash
cd resumes && xelatex sample-resume.tex
```

## 新建一份简历

复制占位文件，以岗位命名：

```bash
cp resumes/sample-resume.tex resumes/[岗位].tex
```

然后替换各组件里的占位内容即可。照片可直接放到 `resumes/` 下，在 `.tex` 中引用：

```tex
\begin{center}
  \includegraphics[width=\linewidth,height=4cm,keepaspectratio]{photo.jpg}
\end{center}
```

没有照片时用占位框：

```tex
\photoPlaceholder
```

## 组件说明

### 文档结构

```tex
\documentclass[UTF8,fontset=none,10pt]{ctexart}
\usepackage{elegant-resume}          % 默认
\usepackage[singlepage]{elegant-resume}  % 开启单页模式，超出内容静默丢弃

\startResume   % 开始（左栏内容写在这里）

\switchcolumn  % 切换到右栏

\finishResume  % 结束
```

### 左栏组件

| 命令 | 用途 |
|------|------|
| `\profileHeader{姓名}{岗位}{简介}` | 姓名标题块，简介可传 `{}` |
| `\sideSection{标题}{内容}` | 信息区块，自动在上方加分隔线 |
| `\photoPlaceholder` | 照片占位框 |

### 右栏组件

| 命令 | 用途 |
|------|------|
| `\firstMainSection{标题}` | 第一个节标题，无上边距 |
| `\mainSection{标题}` | 后续节标题，自动加上边距 |
| `\bodyText{内容}` | 纯文本段落 |
| `\projectItem{名称}{描述}{标签}{备注}{链接}` | 项目块，备注和链接可传空 `{}` |
| `\datedItem{名称}{时间}{摘要}{内容}` | 经历块，内容支持 `tightBullets` 环境 |
| `\methodItem{序号}{标题}{说明}` | 方法/优势块，四个并排用 `\hfill` 分隔 |
| `\resumeTag{文字}` | 技术标签胶囊 |

### 列表

```tex
\begin{tightBullets}
  \item 要点一
  \item 要点二
\end{tightBullets}
```

### 完整示例

```tex
\documentclass[UTF8,fontset=none,10pt]{ctexart}
\usepackage{elegant-resume}

\startResume

\photoPlaceholder

\profileHeader{姓名}{目标岗位}{一句话简介}

\sideSection{联系方式}{
\href{mailto:you@email.com}{you@email.com}\\
Phone: 13800000000
}

\switchcolumn

\firstMainSection{关于我}
\bodyText{这里写个人简介。}

\mainSection{项目经历}
\projectItem
  {项目名称}
  {项目描述}
  {\resumeTag{技术栈}}
  {}
  {\href{https://github.com/}{GitHub}}

\mainSection{工作经历}
\datedItem
  {公司名称}
  {2024.01 -- 至今}
  {一行摘要}
  {
    \begin{tightBullets}
      \item 具体工作内容
    \end{tightBullets}
  }

\finishResume
```

## 间距调节

视觉节奏由 `.sty` 顶部的三个长度变量控制，可在 `.tex` 的前言区覆盖：

```tex
\setlength{\ResSectionSep}{8pt}   % 节标题上方间距
\setlength{\ResItemSep}{6pt}      % 条目间 / 分隔线前后
\setlength{\ResInnerSep}{4pt}     % 条目内部子元素间距
```

## 维护

- 调整视觉样式 → 改 `templates/elegant-resume.sty`，`.latexmkrc` 会让 `resumes/` 下的简历自动找到它
- 更新个人内容 → 改对应的 `resumes/[岗位].tex`

## 个人简历私有化

Git 不支持分支级别的可见性。推荐将个人简历存入独立的**私有 repo**，通过 remote 同步模板更新：

```bash
# 在私有 repo 里添加本模板为 upstream
git remote add template git@github.com:你/resume-it.git

# 同步模板改动
git fetch template
git merge template/main
```

或者简单地在 `.gitignore` 中忽略个人文件：

```gitignore
resumes/[岗位].tex
resumes/photo.jpg
resumes/*.pdf
```
