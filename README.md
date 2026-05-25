# Resume LaTeX Template

一个双栏 LaTeX 简历模板，左栏适合放照片、姓名、简介和基础信息，右栏适合放关于我、项目经历、实习经历等主要内容。

## 文件

- `latex/elegant-resume.sty`：版式和组件定义，控制字体、双栏、背景、标题、项目块、经历块等样式。
- `latex/resume-template.tex`：可复制使用的模板，保留占位内容和常用组件示例。
- `latex/resume.tex`：个人简历内容实例，默认被 `.gitignore` 忽略，不提交个人信息。
- `latex/photo.*`：个人照片，默认被 `.gitignore` 忽略。

## 编译

```bash
cd latex
xelatex resume-template.tex
```

中文内容依赖 XeLaTeX / ctex。编译完成后会生成 `resume-template.pdf`。

如果你复制了一份个人简历 `resume.tex`，也可以编译：

```bash
xelatex resume.tex
```

## 新建一份简历

复制模板：

```bash
cp latex/resume-template.tex latex/resume.tex
```

保留顶部这两行：

```tex
\documentclass[UTF8,fontset=none,10pt]{ctexart}
\usepackage{elegant-resume}
```

然后替换 `\profileHeader`、`\sideSection`、`\mainSection`、`\projectItem`、`\datedItem` 里的内容即可。

## 维护

如果只调整视觉样式，优先改 `latex/elegant-resume.sty`。如果只更新个人内容，改被忽略的 `latex/resume.tex` 即可。

## 照片

左栏顶部已经预留照片位置。后续把一寸照放到 `latex/photo.jpg`，然后在 `resume.tex` 或 `resume-template.tex` 顶部使用：

```tex
\includegraphics[width=2.5cm,height=3.5cm,keepaspectratio]{photo.jpg}
```
