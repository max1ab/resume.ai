#!/usr/bin/env node
/**
 * Resume HTML builder
 *
 * Usage:
 *   node scripts/build.mjs resumes/sample-resume.json
 *   node scripts/build.mjs resumes/ai-engineer.json --watch
 *
 * Produces: resumes/<name>.html  (self-contained, no CDN dependencies)
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const TEMPLATES = path.join(ROOT, 'templates');

// ── Argument parsing ─────────────────────────────────────────
const args      = process.argv.slice(2);
const watchMode = args.includes('--watch');
const jsonArg   = args.find(a => !a.startsWith('--'));

if (!jsonArg) {
  console.error('Usage: node scripts/build.mjs <path-to-resume.json> [--watch]');
  process.exit(1);
}

const jsonPath = path.resolve(ROOT, jsonArg);

if (!jsonArg.endsWith('.json')) {
  console.error('Error: input file must have a .json extension');
  process.exit(1);
}

if (!fs.existsSync(jsonPath)) {
  console.error(`Error: file not found — ${jsonPath}`);
  process.exit(1);
}

const htmlPath = jsonPath.slice(0, -5) + '.html';

// ── Core build function ──────────────────────────────────────
function build() {
  try {
    const tpl  = fs.readFileSync(path.join(TEMPLATES, 'resume.html'), 'utf8');
    const css  = fs.readFileSync(path.join(TEMPLATES, 'resume.css'),  'utf8');
    const js   = fs.readFileSync(path.join(TEMPLATES, 'render.js'),   'utf8');
    const data = fs.readFileSync(jsonPath, 'utf8');

    // Parse once; validate and use the same object throughout
    const parsed      = JSON.parse(data);

    // Resolve photo path relative to the output HTML file so <img src> works
    // when the HTML is opened directly from the resumes/ directory.
    const resolvedData = resolvePhotoPaths(parsed, jsonPath);
    const embeddedData = JSON.stringify(resolvedData, null, 2)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026');

    // Escape closing tags so inline CSS/JS cannot break out of their containers
    const safeCss = css.replace(/<\/style>/gi, '<\\/style>');
    const safeJs  = js.replace(/<\/script>/gi, '<\\/script>');

    const out = tpl
      .replace(
        /<link\s+rel="stylesheet"\s+href="resume\.css"\s*\/>/,
        `<style>\n${safeCss}\n</style>`
      )
      .replace(
        /<script\s+src="render\.js"><\/script>/,
        `<script>\n${safeJs}\n</script>`
      )
      .replace('__RESUME_DATA__', embeddedData);

    fs.writeFileSync(htmlPath, out, 'utf8');
    const ts = new Date().toLocaleTimeString('zh-CN');
    console.log(`[${ts}] Built → ${path.relative(ROOT, htmlPath)}`);
  } catch (err) {
    console.error(`Build error: ${err.message}`);
    if (!watchMode) process.exit(1);
  }
}

/**
 * Make photo path relative to the output HTML file location.
 * JSON may contain paths like "resumes/photo.jpg" (relative to root)
 * or just "photo.jpg" (relative to the JSON file).
 * The HTML is always written next to the JSON, so the same directory
 * is used for both resolution and the final relative path.
 */
function resolvePhotoPaths(data, srcJsonPath) {
  if (!data.photo) return data;

  const dir = path.dirname(srcJsonPath);

  // Resolve from root first, then fall back to relative-to-json
  const fromRoot = path.resolve(ROOT, data.photo);
  const fromJson = path.resolve(dir, data.photo);

  let absPhoto;
  if (fs.existsSync(fromRoot)) {
    absPhoto = fromRoot;
  } else if (fs.existsSync(fromJson)) {
    absPhoto = fromJson;
  } else {
    // Keep original path as-is (may be a URL or placeholder)
    return data;
  }

  return { ...data, photo: path.relative(dir, absPhoto) };
}

// ── Build once ───────────────────────────────────────────────
build();

// ── Watch mode ───────────────────────────────────────────────
if (watchMode) {
  console.log(`Watching for changes… (Ctrl+C to stop)\n`);

  let debounceTimer = null;
  const trigger = (filename) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (filename) console.log(`  changed: ${filename}`);
      build();
    }, 80);
  };

  // Watch the JSON data file
  fs.watch(jsonPath, (_, filename) => trigger(filename || jsonPath));

  // Watch the templates directory.
  // Note: { recursive: true } is only supported on macOS and Windows;
  // on Linux it silently has no effect. Since templates/ is flat (no subdirs)
  // recursive: false is sufficient and portable.
  fs.watch(TEMPLATES, { recursive: false }, (_, filename) => trigger(filename));
}
