---
name: resume-writer
description: Use when creating or revising resumes in this repository from user background, target role, or JD; edits JSON resume data, selects layout/theme, builds HTML previews, and keeps content concise enough for A4 export.
---

# Resume Writer

Use this skill when creating or revising resumes in this repository.

## Workflow

1. Work from the user's background, target role, and JD if provided.
2. Start from the closest sample:
   - `resumes/sample-resume.json` for the default sidebar resume.
   - `resumes/sample-single.json` for the single-column resume.
3. Create or edit a JSON file under `resumes/`.
4. Build the HTML:

```bash
node scripts/build.mjs resumes/<file>.json
```

5. Tell the user the JSON and HTML paths.

## Boundaries

- Prefer editing `resumes/*.json`.
- Do not edit `templates/` unless the user asks for layout, theme, renderer, or export behavior changes.
- Use only supported section types: `body`, `projects`, `experience`, `methods`.
- Do not invent companies, schools, awards, links, or metrics. If data is missing, keep wording neutral or ask.

## Theme Options

- `theme.layout`: `sidebar-left`, `sidebar-right`, or `single`.
- `theme.headingStyle`: `bar`, `marker`, or `underline`.
  - Sidebar layouts default to `bar`.
  - Single layout defaults to `marker`.
  - `underline` is the simpler legacy heading style.
- `theme.font`: `modern`, `system`, `serif`, or `compact`.
- `theme.color`: `neutral`, `classic-blue`, `academic-red`, `business-green`, or `creative-orange`.
- `theme.colors`: optional hex overrides for allowed color tokens.

## Images

- Put local photos and project images under `resumes/`.
- `photo` and `mainSections[].items[].image` both support either `photo.jpg` or `resumes/photo.jpg`.
- The build script rewrites existing local image paths relative to the generated HTML file.
- Remote `http(s)` and `data:` image URLs are left unchanged.

## Writing Defaults

- Keep the resume focused on the target role.
- Put the strongest and most relevant projects first.
- Keep sidebar lines short; for skills, prefer two skills per line.
- In single layout, keep top information compact and put contact info in the header contact row.
- Keep project descriptions and experience bullets concise.
- If the preview shows overflow, compress before adding more content.

## Overflow Handling

When the generated HTML shows an overflow warning, reduce content in this order:

1. Remove low-value supplemental info.
2. Shorten the profile tagline and about section.
3. Compress project descriptions.
4. Reduce bullets per experience.
5. Remove the least relevant project.
6. Switch `theme.font` to `compact` only if keeping the content matters.

## Delivery

Mention:

- the JSON file path
- the generated HTML file path
- whether the build succeeded
- that the page's `导出 PDF` button opens the browser PDF export flow
