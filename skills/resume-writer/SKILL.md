# Resume Writer

Use this skill when creating or revising resumes in this repository.

## Workflow

1. Work from the user's background, target role, and JD if provided.
2. Create or edit a JSON file under `resumes/`.
3. Build the HTML:

```bash
node scripts/build.mjs resumes/<file>.json
```

4. Tell the user the JSON and HTML paths.

## Boundaries

- Prefer editing `resumes/*.json`.
- Do not edit `templates/` unless the user asks for layout or renderer changes.
- Use only supported section types: `body`, `projects`, `experience`, `methods`.
- Use `theme.font` only when useful. Supported values are `modern`, `system`, `serif`, and `compact`.
- Do not invent companies, schools, awards, links, or metrics. If data is missing, keep wording neutral or ask.

## Writing Defaults

- Keep the resume focused on the target role.
- Put the strongest and most relevant projects first.
- Keep left-column lines short.
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
