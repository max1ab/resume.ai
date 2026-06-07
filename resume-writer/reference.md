# Resume Writer Reference

## Repository Layout

```text
resume.ai/
├── resume-writer/              # publishable skill package
│   ├── examples/               # agent usage examples
│   │   ├── sample-resume.json
│   │   ├── sample-single.json
│   │   └── assets/
│   ├── scripts/build.mjs
│   └── templates/
└── examples/                   # showcase samples (this repo only)
    ├── sample-classic-blue.json
    └── sample-academic-red.json
```

## JSON Schema

Full schema: [`templates/resume-schema.json`](templates/resume-schema.json)

Core shape:

```json
{
  "photo": "assets/sample-photo.jpg",
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
    { "title": "经历",     "type": "experience", "items": [...] }
  ]
}
```

`mainSections[].type` must be one of: `body`, `projects`, `experience`, `methods`.

## Theme Options

- `theme.layout`: `sidebar-left`, `sidebar-right`, or `single`.
- `theme.headingStyle`: `bar`, `marker`, or `underline`.
- `theme.font`: `modern`, `system`, `serif`, or `compact`.
- `theme.color`: `neutral`, `classic-blue`, `academic-red`, `business-green`, or `creative-orange`.
- `theme.colors`: optional hex overrides for allowed color tokens.

Agent examples:

- Sidebar: `resume-writer/examples/sample-resume.json`
- Single column: `resume-writer/examples/sample-single.json`

Showcase examples in this repository:

- `examples/sample-classic-blue.json`
- `examples/sample-academic-red.json`

## Images

- Agent example assets: `resume-writer/examples/assets/`.
- Put user photos and project images beside the user's JSON or in a nearby assets folder.
- Showcase JSON may use `sample-photo.jpg`; the build script also resolves images from `resume-writer/examples/assets/`.
- Remote `http(s)` and `data:` image URLs are left unchanged.

## Build Commands

From the repository or project root:

```bash
node resume-writer/scripts/build.mjs path/to/resume.json
node resume-writer/scripts/build.mjs path/to/resume.json --watch
node resume-writer/scripts/build.mjs resume-writer/examples/sample-resume.json
node resume-writer/scripts/build.mjs examples/sample-classic-blue.json
node resume-writer/scripts/build.mjs --standalone-template
```

Resume JSON/HTML paths are relative to the current working directory. Templates always come from this package.

## Standalone HTML Without Node

Copy `templates/resume-standalone.html` next to a resume JSON, then replace `__RESUME_DATA__` with resume JSON. Escape `<`, `>`, and `&` as `\u003c`, `\u003e`, and `\u0026` before embedding.
