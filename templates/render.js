(function () {
  'use strict';

  // ── Security helpers ─────────────────────────────────────────
  function escapeHTML(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Only allow safe link schemes to prevent javascript: injection
  function safeHref(url) {
    if (typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('mailto:')
    ) {
      return escapeHTML(trimmed);
    }
    return null;
  }

  function renderLink(url, label) {
    const href = safeHref(url);
    if (!href) return escapeHTML(label || url);
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${escapeHTML(label || url)}</a>`;
  }

  // ── Tag chip ─────────────────────────────────────────────────
  function renderTag(text) {
    return `<span class="tag">${escapeHTML(text)}</span>`;
  }

  function renderTags(tags) {
    if (!Array.isArray(tags) || tags.length === 0) return '';
    return `<div class="project-tags">${tags.map(renderTag).join('')}</div>`;
  }

  // ── Sidebar renderers ────────────────────────────────────────
  function renderPhoto(photo) {
    if (photo) {
      const src = escapeHTML(photo);
      return `<div class="photo-area"><img src="${src}" alt="头像" /></div>`;
    }
    return `<div class="photo-area"><div class="photo-placeholder">照片位置</div></div>`;
  }

  function renderProfile(profile) {
    if (!profile) return '';
    const name    = escapeHTML(profile.name    || '');
    const role    = escapeHTML(profile.role    || '');
    const tagline = escapeHTML(profile.tagline || '');
    return `
<div class="profile-header">
  <div class="profile-name">${name}</div>
  <div class="profile-role">${role}</div>
  ${tagline ? `<div class="profile-tagline">${tagline}</div>` : ''}
</div>`;
  }

  // A side section body can contain plain text lines or hyperlink objects:
  // { text, url } → rendered as <a>text</a>
  // plain strings may also embed newlines (split into <br>)
  function renderSideLine(line) {
    if (line && typeof line === 'object' && line.url) {
      return renderLink(line.url, line.text);
    }
    // Replace both real newline characters and the two-character sequence \n
    // (which AI-generated JSON may emit as a literal backslash-n).
    return escapeHTML(String(line)).replace(/\\n|\n/g, '<br>');
  }

  function renderSideSection(section) {
    const title = escapeHTML(section.title || '');
    const lines = Array.isArray(section.lines) ? section.lines : [];
    const body  = lines.map(renderSideLine).join('<br>');
    return `
<hr class="side-rule" />
<div class="side-section-title">${title}</div>
<div class="side-section-body">${body}</div>`;
  }

  function renderSidebar(data) {
    const photo    = renderPhoto(data.photo ?? null);
    const profile  = renderProfile(data.profile);
    const sections = (data.sideSections || []).map(renderSideSection).join('');
    return `<aside class="sidebar">${photo}${profile}${sections}</aside>`;
  }

  // ── Main column section heading ──────────────────────────────
  function renderSectionHeading(title, isFirst) {
    const firstClass = isFirst ? ' first' : '';
    return `
<div class="main-section${firstClass}">
  <div class="main-section-title">${escapeHTML(title)}</div>
  <span class="main-section-rule"></span>
</div>`;
  }

  // ── body: paragraphs ─────────────────────────────────────────
  function renderBody(section, isFirst) {
    const heading    = renderSectionHeading(section.title || '', isFirst);
    const paragraphs = (section.paragraphs || [])
      .map(p => `<p>${escapeHTML(p)}</p>`)
      .join('');
    return `${heading}<div class="body-text">${paragraphs}</div>`;
  }

  // ── projects ─────────────────────────────────────────────────
  function renderProjectItem(item) {
    const title = escapeHTML(item.title || '');
    const desc  = escapeHTML(item.description || '');
    const tags  = renderTags(item.tags);

    let rightCol;
    if (item.image) {
      const src = escapeHTML(item.image);
      rightCol = `<div class="project-image"><img src="${src}" alt="${title}" /></div>`;
    } else {
      const label = escapeHTML(item.metaLabel || '');
      let   value = '';
      if (item.metaValue) {
        const href = safeHref(item.metaValue);
        value = href
          ? `<a href="${href}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.metaValue)}</a>`
          : escapeHTML(item.metaValue);
      }
      rightCol = `
<div class="project-meta">
  ${label ? `<span class="project-meta-label">${label}</span>` : ''}
  ${value  ? `<span class="project-meta-value">${value}</span>`  : ''}
</div>`;
    }

    return `
<div class="project-item">
  <div class="project-main">
    <div class="project-title">${title}</div>
    <div class="project-desc">${desc}</div>
    ${tags}
  </div>
  ${rightCol}
</div>
<hr class="item-divider" />`;
  }

  function renderProjects(section, isFirst) {
    const heading = renderSectionHeading(section.title || '', isFirst);
    const items   = (section.items || []).map(renderProjectItem).join('');
    return `${heading}${items}`;
  }

  // ── experience ───────────────────────────────────────────────
  function renderExperienceItem(item) {
    const title   = escapeHTML(item.title   || '');
    const date    = escapeHTML(item.date    || '');
    const summary = escapeHTML(item.summary || '');
    const bullets = Array.isArray(item.bullets) ? item.bullets : [];
    const bulletHTML = bullets.length
      ? `<ul class="dated-bullets">${bullets.map(b => `<li>${escapeHTML(b)}</li>`).join('')}</ul>`
      : '';
    return `
<div class="dated-item">
  <div class="dated-header">
    <span class="dated-title">${title}</span>
    <span class="dated-date">${date}</span>
  </div>
  ${summary ? `<div class="dated-summary">${summary}</div>` : ''}
  ${bulletHTML}
</div>
<hr class="item-divider" />`;
  }

  function renderExperience(section, isFirst) {
    const heading = renderSectionHeading(section.title || '', isFirst);
    const items   = (section.items || []).map(renderExperienceItem).join('');
    return `${heading}${items}`;
  }

  // ── methods (4-col strength grid) ────────────────────────────
  function renderMethodItem(item) {
    const num   = escapeHTML(String(item.number || ''));
    const label = escapeHTML(item.label || '');
    const text  = escapeHTML(item.text  || '');
    return `
<div class="method-item">
  <div class="method-number">${num}</div>
  <div class="method-label">${label}</div>
  <div class="method-text">${text}</div>
</div>`;
  }

  function renderMethods(section, isFirst) {
    const heading = renderSectionHeading(section.title || '', isFirst);
    const items   = (section.items || []).map(renderMethodItem).join('');
    return `${heading}<div class="methods-grid">${items}</div>`;
  }

  // ── Main column dispatcher ───────────────────────────────────
  function renderMainSection(section, index) {
    const isFirst = index === 0;
    switch (section.type) {
      case 'body':       return renderBody(section, isFirst);
      case 'projects':   return renderProjects(section, isFirst);
      case 'experience': return renderExperience(section, isFirst);
      case 'methods':    return renderMethods(section, isFirst);
      default:
        console.warn('[resume] unknown section type:', section.type, section);
        return `
<div class="render-warning">
  未知组件类型：${escapeHTML(section.type || '(empty)')}
</div>`;
    }
  }

  function renderMain(data) {
    const sections = (data.mainSections || [])
      .map((s, i) => renderMainSection(s, i))
      .join('');
    return `<main class="main">${sections}</main>`;
  }

  // ── Root render ──────────────────────────────────────────────
  function renderResume(data) {
    const sidebar = renderSidebar(data);
    const main    = renderMain(data);
    return `<div class="preview-shell"><div class="resume-page">${sidebar}${main}</div></div>`;
  }

  // ── Screen preview zoom ──────────────────────────────────────
  function setupPreviewZoom() {
    const shell = document.querySelector('.preview-shell');
    const page  = document.querySelector('.resume-page');
    const label = document.getElementById('zoom-label');
    if (!shell || !page || !label) return;

    const minScale = 0.45;
    const maxScale = 1.8;
    const step     = 0.1;
    let autoFit    = true;
    let scale      = 1;

    function clamp(value) {
      return Math.max(minScale, Math.min(maxScale, value));
    }

    function applyScale(nextScale) {
      scale = clamp(nextScale);
      shell.style.setProperty('--preview-scale', String(scale));
      shell.style.width  = `${Math.ceil(page.offsetWidth * scale)}px`;
      shell.style.height = `${Math.ceil(page.offsetHeight * scale)}px`;
      label.textContent = `${Math.round(scale * 100)}%`;
    }

    function fitToWidth() {
      const availableWidth = Math.max(320, window.innerWidth - 40);
      const baseWidth = page.offsetWidth || 1;
      applyScale(Math.min(1, availableWidth / baseWidth));
    }

    document.querySelectorAll('[data-zoom]').forEach(button => {
      button.addEventListener('click', () => {
        const action = button.getAttribute('data-zoom');
        if (action === 'fit') {
          autoFit = true;
          fitToWidth();
          return;
        }
        autoFit = false;
        applyScale(scale + (action === 'in' ? step : -step));
      });
    });

    window.addEventListener('resize', () => {
      if (autoFit) fitToWidth();
    });

    requestAnimationFrame(fitToWidth);
  }

  // ── Bootstrap ────────────────────────────────────────────────
  try {
    const dataEl = document.getElementById('resume-data');
    if (!dataEl) throw new Error('Missing #resume-data element');
    const data = JSON.parse(dataEl.textContent);
    const app  = document.getElementById('app');
    if (!app) throw new Error('Missing #app element');
    app.innerHTML = renderResume(data);
    setupPreviewZoom();

    // Set page title from profile name if available
    if (data.profile && data.profile.name) {
      document.title = data.profile.name + ' — Resume';
    }
  } catch (err) {
    console.error('[render.js]', err);
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `<div style="padding:40px;color:red;font-family:monospace">
        <strong>渲染错误</strong><br>${escapeHTML(err.message)}<br>
        <small>请检查 resume-data 的 JSON 格式是否正确。</small>
      </div>`;
    }
  }
})();
