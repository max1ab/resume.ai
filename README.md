# Resume LaTeX Template

一个双栏 LaTeX 简历模板，左栏适合放照片、姓名、简介和基础信息，右栏适合放关于我、项目经历、实习经历等主要内容。

## 目录结构

```
resume-it/
├── templates/
│   ├── elegant-resume.sty     版式和组件定义（字体、双栏、背景、各种组件）
│   ├── resume-template.tex    完整模板，含所有组件示例和占位内容
│   └── assets/
│       └── sample-photo.jpg   模板示例头像
├── resumes/
│   ├── resume.tex             占位简历，git 跟踪，可作为新建简历的起点
│   ├── [岗位].tex             个人简历，gitignore，不提交个人信息
│   └── assets/
│       └── photo.jpg          个人照片，gitignore
└── .latexmkrc                 编译配置，自动设置 TEXINPUTS
```

## 编译

```bash
# 编译单份简历，pdf 输出到 resumes/ 目录
latexmk -cd resumes/frontend.tex

# 一次编译所有简历
latexmk -cd resumes/*.tex

# 监听改动，保存后自动重编
latexmk -cd -pvc resumes/frontend.tex

# 清理中间文件
latexmk -cd -C resumes/frontend.tex
```

## 新建一份简历

复制占位文件，以岗位命名：

```bash
cp resumes/resume.tex resumes/[岗位].tex
```

然后替换 `\profileHeader`、`\sideSection`、`\mainSection`、`\projectItem`、`\datedItem` 里的内容即可。

照片放到 `resumes/assets/photo.jpg`，在 `.tex` 中用：

```tex
\includegraphics[width=\linewidth,height=4cm,keepaspectratio]{photo.jpg}
```

## 组件说明

| 命令 | 用途 |
|---|---|
| `\profileHeader{姓名}{岗位}{简介}` | 左栏姓名标题块 |
| `\sideSection{标题}{内容}` | 左栏信息区块 |
| `\firstMainSection{标题}` | 右栏第一个章节标题（无上边距） |
| `\mainSection{标题}` | 右栏章节标题 |
| `\mainDivider` | 右栏分隔线 |
| `\bodyText{内容}` | 右栏纯文本段落 |
| `\projectItem{名称}{描述}{标签}{备注}{链接}` | 项目块，备注和链接可传空 `{}` |
| `\datedItem{名称}{时间}{摘要}{内容}` | 经历块，内容支持 `tightBullets` |
| `\methodItem{序号}{标题}{说明}` | 方法/优势块，四个一排 |
| `\tag{文字}` | 技术标签胶囊 |
| `\photoPlaceholder` | 照片占位框 |

## 维护

只调整视觉样式 → 改 `templates/elegant-resume.sty`，所有简历下次编译自动生效。

只更新个人内容 → 改对应的 `resumes/[岗位].tex`。
