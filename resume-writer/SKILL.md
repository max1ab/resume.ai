---
name: resume-writer
description: Use when creating or revising resumes from user background, target role, or JD; edits JSON resume data, selects layout/theme, builds HTML previews, and keeps content concise enough for A4 export.
---

# Resume Writer

Use this skill when creating or revising resumes.

## Layout

- `resume-writer/` — this skill package (scripts, templates, agent examples)
- `resume-writer/examples/` — minimal usage examples for the agent
- Repository root `examples/` — showcase samples for humans only (not part of the published package)

When installed in another project, create a workspace directory for the user's resume JSON.

## Workflow

1. Work from the user's background, target role, and JD if provided.
2. Start from the closest agent example:
   - `resume-writer/examples/sample-resume.json` for the default sidebar resume.
   - `resume-writer/examples/sample-single.json` for the single-column resume.
   - Example images live in `resume-writer/examples/assets/`.
3. Create or edit the user's JSON file in their workspace.
4. Put photos and project images next to the user's JSON or update paths after copying an example.
5. Build HTML from the project root:

```bash
node resume-writer/scripts/build.mjs <path-to-resume.json>
```

6. Tell the user the JSON and HTML paths.

## Boundaries

- Prefer editing the user's resume JSON, not files under `resume-writer/examples/`.
- Do not edit `resume-writer/templates/` unless the user asks for layout, theme, renderer, or export behavior changes.
- Do not edit repository root `examples/` unless the user asks to update showcase samples.
- Use only supported section types: `body`, `projects`, `experience`, `methods`.
- Do not invent companies, schools, awards, links, or metrics. If data is missing, keep wording neutral or ask.

## Theme and Schema

See [reference.md](reference.md) for theme options, JSON schema, and image path rules.

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
