#!/usr/bin/env node
/**
 * Resume HTML builder
 *
 * Templates live in the skill package. Resume JSON/HTML paths are relative to
 * the current working directory (usually the repository root).
 *
 * Usage (from repository root):
 *   node resume-writer/scripts/build.mjs examples/sample-classic-blue.json
 *   node resume-writer/scripts/build.mjs examples/sample-classic-blue.json --watch
 *   node resume-writer/scripts/build.mjs resume-writer/examples/sample-resume.json
 *   node resume-writer/scripts/build.mjs --standalone-template
 *
 * Produces: <input>.html next to the JSON file
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname    = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, '..');
const TEMPLATES    = path.join(PACKAGE_ROOT, 'templates');
const EXAMPLES     = path.join(PACKAGE_ROOT, 'examples');
const WORKSPACE    = process.cwd();

// ── Argument parsing ─────────────────────────────────────────
const args      = process.argv.slice(2);
const watchMode = args.includes('--watch');
const standaloneTemplateMode = args.includes('--standalone-template');
const jsonArg   = args.find(a => !a.startsWith('--'));

if (standaloneTemplateMode) {
  buildStandaloneTemplate();
  process.exit(0);
}

if (!jsonArg) {
  console.error('Usage: node resume-writer/scripts/build.mjs <path-to-resume.json> [--watch]');
  console.error('       node resume-writer/scripts/build.mjs --standalone-template');
  process.exit(1);
}

const jsonPath = path.isAbsolute(jsonArg)
  ? jsonArg
  : path.resolve(WORKSPACE, jsonArg);

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
    const data = fs.readFileSync(jsonPath, 'utf8');

    const parsed      = JSON.parse(data);
    const resolvedData = resolveImagePaths(parsed, jsonPath);
    const embeddedData = JSON.stringify(resolvedData, null, 2)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026');

    const out = inlineAssets().replace('__RESUME_DATA__', embeddedData);

    fs.writeFileSync(htmlPath, out, 'utf8');
    const ts = new Date().toLocaleTimeString('zh-CN');
    console.log(`[${ts}] Built → ${path.relative(WORKSPACE, htmlPath)}`);
  } catch (err) {
    console.error(`Build error: ${err.message}`);
    if (!watchMode) process.exit(1);
  }
}

function inlineAssets() {
  const tpl = fs.readFileSync(path.join(TEMPLATES, 'resume.html'), 'utf8');
  const css = fs.readFileSync(path.join(TEMPLATES, 'resume.css'), 'utf8');
  const js = fs.readFileSync(path.join(TEMPLATES, 'render.js'), 'utf8');

  const safeCss = css.replace(/<\/style>/gi, '<\\/style>');
  const safeJs = js.replace(/<\/script>/gi, '<\\/script>');

  return tpl
    .replace(
      /<link\s+rel="stylesheet"\s+href="resume\.css"\s*\/>/,
      `<style>\n${safeCss}\n</style>`
    )
    .replace(
      /<script\s+src="render\.js"><\/script>/,
      `<script>\n${safeJs}\n</script>`
    );
}

function buildStandaloneTemplate() {
  const outPath = path.join(TEMPLATES, 'resume-standalone.html');
  fs.writeFileSync(outPath, inlineAssets(), 'utf8');
  console.log(`Built → ${path.relative(WORKSPACE, outPath)}`);
}

/**
 * Make local image paths relative to the output HTML file location.
 * JSON may contain paths relative to cwd, the JSON file, or skill examples/.
 */
function resolveImagePaths(data, srcJsonPath) {
  const dir = path.dirname(srcJsonPath);
  const basename = (p) => path.basename(p);

  function resolveLocalImagePath(imagePath) {
    if (!imagePath || typeof imagePath !== 'string') return imagePath;
    if (/^(?:https?:|data:|mailto:)/i.test(imagePath)) return imagePath;

    const candidates = [
      path.resolve(WORKSPACE, imagePath),
      path.resolve(dir, imagePath),
      path.resolve(EXAMPLES, imagePath),
      path.resolve(EXAMPLES, 'assets', imagePath),
      path.resolve(EXAMPLES, basename(imagePath)),
      path.resolve(EXAMPLES, 'assets', basename(imagePath))
    ];

    const absPath = candidates.find(candidate => fs.existsSync(candidate)) ?? null;
    return absPath ? path.relative(dir, absPath) : imagePath;
  }

  const next = {
    ...data,
    photo: resolveLocalImagePath(data.photo)
  };

  if (Array.isArray(data.mainSections)) {
    next.mainSections = data.mainSections.map(section => {
      if (!Array.isArray(section.items)) return section;
      return {
        ...section,
        items: section.items.map(item => item && typeof item === 'object'
          ? { ...item, image: resolveLocalImagePath(item.image) }
          : item)
      };
    });
  }

  return next;
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

  fs.watch(jsonPath, (_, filename) => trigger(filename || jsonPath));
  fs.watch(TEMPLATES, { recursive: false }, (_, filename) => trigger(filename));
}
