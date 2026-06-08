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

  function joinWithItemDividers(items) {
    return items.filter(Boolean).join('<hr class="item-divider" />');
  }

  // ── Icon set ─────────────────────────────────────────────────
  function iconPath(name) {
    const paths = {
      user: '<circle cx="12" cy="8" r="3.2" /><path d="M5.5 19c.9-3.8 4-6 6.5-6s5.6 2.2 6.5 6" />',
      contact: '<path d="M4 7.5h16v10H4z" /><path d="m4 8 8 5.5L20 8" />',
      skills: '<path d="M12 3l2.4 5 5.4.8-3.9 3.8.9 5.4-4.8-2.6L7.2 18l.9-5.4-3.9-3.8 5.4-.8z" />',
      education: '<path d="M3 8.5 12 4l9 4.5-9 4.5z" /><path d="M6.5 11v4.2c1.7 1.2 3.5 1.8 5.5 1.8s3.8-.6 5.5-1.8V11" />',
      info: '<path d="M7 4.5h9.5A1.5 1.5 0 0 1 18 6v12.5H7A2.5 2.5 0 0 1 4.5 16V7A2.5 2.5 0 0 1 7 4.5z" /><path d="M7 4.5v12" /><path d="M9.5 8h5" /><path d="M9.5 11h4" />',
      briefcase: '<path d="M8 7V5.8C8 4.8 8.8 4 9.8 4h4.4c1 0 1.8.8 1.8 1.8V7" /><path d="M4 7h16v11H4z" /><path d="M4 11h16" />',
      award: '<circle cx="12" cy="8" r="4" /><path d="m9.5 11.5-1.2 7 3.7-2 3.7 2-1.2-7" />'
    };
    return paths[name] || paths.info;
  }

  function inferSideIcon(title) {
    const text = String(title || '');
    if (/补充|其他|说明|备注/i.test(text)) return 'info';
    if (/联系|电话|邮箱|网站|github/i.test(text)) return 'contact';
    if (/技能|能力|技术/i.test(text)) return 'skills';
    if (/教育|学校|学历/i.test(text)) return 'education';
    if (/经历|工作|项目/i.test(text)) return 'briefcase';
    if (/奖|证书|荣誉/i.test(text)) return 'award';
    if (/基本|信息|个人/i.test(text)) return 'user';
    return 'info';
  }

  function renderIcon(name) {
    return `<span class="section-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false">${iconPath(name)}</svg></span>`;
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
    const icon = renderIcon(section.icon || inferSideIcon(section.title));
    const lines = Array.isArray(section.lines) ? section.lines : [];
    const body  = lines.map(renderSideLine).join('<br>');
    return `
<hr class="side-rule" />
<div class="side-section-title">${icon}<span>${title}</span></div>
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
</div>`;
  }

  function renderProjects(section, isFirst) {
    const heading = renderSectionHeading(section.title || '', isFirst);
    const items   = joinWithItemDividers((section.items || []).map(renderProjectItem));
    return `${heading}${items}`;
  }

  // ── experience ───────────────────────────────────────────────
  function renderExperienceItem(item) {
    const title   = escapeHTML(item.title   || '');
    const date    = escapeHTML(item.date    || '');
    const summary = escapeHTML(item.summary || '');
    const bullets = Array.isArray(item.bullets) ? item.bullets : [];
    const bulletHTML = bullets.length
      ? `<ul class="dated-bullets">${bullets.map(b => {
          const content = (b && typeof b === 'object' && b.url)
            ? renderLink(b.url, b.text)
            : escapeHTML(String(b));
          return `<li>${content}</li>`;
        }).join('')}</ul>`
      : '';
    return `
<div class="dated-item">
  <div class="dated-header">
    <span class="dated-title">${title}</span>
    <span class="dated-date">${date}</span>
  </div>
  ${summary ? `<div class="dated-summary">${summary}</div>` : ''}
  ${bulletHTML}
</div>`;
  }

  function renderExperience(section, isFirst) {
    const heading = renderSectionHeading(section.title || '', isFirst);
    const items   = joinWithItemDividers((section.items || []).map(renderExperienceItem));
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

  function renderSingleInfoLine(line) {
    if (line && typeof line === 'object' && line.url) {
      return renderLink(line.url, line.text);
    }
    return escapeHTML(String(line)).replace(/\\n|\n/g, ' ');
  }

  function renderSingleInfoSection(section) {
    const title = escapeHTML(section.title || '');
    const lines = Array.isArray(section.lines) ? section.lines : [];
    if (lines.length === 0) return '';
    const contactClass = /联系|电话|邮箱|网站|github/i.test(String(section.title || ''))
      ? ' single-contact-group'
      : '';
    return `<div class="single-info-group${contactClass}">
      <span class="single-info-title">${title}</span>
      ${lines.map(line => `<span class="single-info-item">${renderSingleInfoLine(line)}</span>`).join('')}
    </div>`;
  }

  function renderSingleHeader(data) {
    const profile = data.profile || {};
    const name = escapeHTML(profile.name || '');
    const role = escapeHTML(profile.role || '');
    const tagline = escapeHTML(profile.tagline || '');
    const sideSections = Array.isArray(data.sideSections) ? data.sideSections : [];
    const contactSections = sideSections.filter(s => /联系|电话|邮箱|网站|github/i.test(String(s.title || '')));
    const otherSections = sideSections.filter(s => !/联系|电话|邮箱|网站|github/i.test(String(s.title || '')));
    const info = otherSections.map(renderSingleInfoSection).join('');
    const contactInfo = contactSections.map(renderSingleInfoSection).join('');
    const photo = renderPhoto(data.photo ?? null);
    return `<header class="single-header">
      <div class="single-header-main">
        <div class="single-profile">
          <div class="single-title-row">
            <div class="single-name">${name}</div>
            ${role ? `<div class="single-role">${role}</div>` : ''}
          </div>
          ${tagline ? `<div class="single-tagline">${tagline}</div>` : ''}
          ${info ? `<div class="single-info">${info}</div>` : ''}
        </div>
        ${photo}
      </div>
      ${contactInfo ? `<div class="single-contact single-info">${contactInfo}</div>` : ''}
    </header>`;
  }

  function renderSingleResume(data, headingStyle) {
    const header = renderSingleHeader(data);
    const main = renderMain(data);
    return `<div class="preview-shell"><div class="resume-page layout-single${headingStyle}">${header}${main}<div class="a4-limit-line" aria-hidden="true"><span>A4</span></div></div></div>`;
  }

  // ── Root render ──────────────────────────────────────────────
  function renderResume(data) {
    const theme = data.theme || {};
    const isSingle = theme.layout === 'single';
    const heading = ['underline', 'bar', 'marker'].includes(theme.headingStyle)
      ? theme.headingStyle
      : (isSingle ? 'marker' : 'bar');
    const headingStyle = ` heading-${heading}`;
    if (isSingle) {
      return renderSingleResume(data, headingStyle);
    }
    const sidebar = renderSidebar(data);
    const main    = renderMain(data);
    const layout = theme.layout === 'sidebar-right'
      ? ' layout-sidebar-right'
      : '';
    return `<div class="preview-shell"><div class="resume-page${layout}${headingStyle}">${sidebar}${main}<div class="a4-limit-line" aria-hidden="true"><span>A4</span></div></div></div>`;
  }

  // ── Theme presets ────────────────────────────────────────────
  function applyTheme(theme) {
    const fontPresets = {
      system: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      modern: '"Helvetica Neue", "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif',
      serif: '"Songti SC", "STSong", "SimSun", serif',
      compact: 'Arial, "Helvetica Neue", "Microsoft YaHei", sans-serif'
    };
    const colorPresets = {
      neutral: {
        sidebg: '#F3F3F1',
        linegray: '#D8D8D5',
        textgray: '#3F3F3F',
        muted: '#727272',
        tagbg: '#E9E9E7',
        accent: '#333333'
      },
      'classic-blue': {
        sidebg: '#F4F8FE',
        linegray: '#D5E3F5',
        textgray: '#333333',
        muted: '#6F7782',
        tagbg: '#E8F1FC',
        accent: '#1268C4'
      },
      'academic-red': {
        sidebg: '#FCF5F5',
        linegray: '#E9D4D4',
        textgray: '#333333',
        muted: '#756C6C',
        tagbg: '#F8E8E8',
        accent: '#B21D24'
      },
      'business-green': {
        sidebg: '#F3FAF7',
        linegray: '#D4E6DE',
        textgray: '#333333',
        muted: '#6B7772',
        tagbg: '#E5F3ED',
        accent: '#087B63'
      },
      'creative-orange': {
        sidebg: '#FFF7F1',
        linegray: '#EFD9C8',
        textgray: '#333333',
        muted: '#766F6A',
        tagbg: '#FCEBDD',
        accent: '#F05A1A'
      }
    };
    const colorKeys = ['sidebg', 'linegray', 'textgray', 'muted', 'tagbg', 'accent'];
    const hexColorPattern = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

    const selectedFont = theme && theme.font ? theme.font : 'modern';
    const fontStack = fontPresets[selectedFont] || fontPresets.modern;
    document.documentElement.style.setProperty('--font-stack', fontStack);

    const selectedColor = theme && theme.color ? theme.color : 'neutral';
    const colors = { ...(colorPresets[selectedColor] || colorPresets.neutral) };
    if (theme && theme.colors && typeof theme.colors === 'object') {
      colorKeys.forEach(key => {
        const value = theme.colors[key];
        if (typeof value === 'string' && hexColorPattern.test(value.trim())) {
          colors[key] = value.trim();
        }
      });
    }
    colorKeys.forEach(key => {
      document.documentElement.style.setProperty(`--${key}`, colors[key]);
    });
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

    function zoomBy(delta) {
      autoFit = false;
      applyScale(scale + delta);
    }

    function zoomByFactor(factor) {
      autoFit = false;
      applyScale(scale * factor);
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
        zoomBy(action === 'in' ? step : -step);
      });
    });

    document.addEventListener('keydown', (event) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey) return;
      if (event.key === '=' || event.key === '+' || event.code === 'Equal') {
        event.preventDefault();
        zoomBy(step);
      } else if (event.key === '-' || event.key === '_' || event.code === 'Minus') {
        event.preventDefault();
        zoomBy(-step);
      }
    });

    document.addEventListener('wheel', (event) => {
      if (!event.ctrlKey) return;
      event.preventDefault();
      zoomByFactor(Math.exp(-event.deltaY * 0.008));
    }, { passive: false });

    let pinchDistance = null;

    function getPinchDistance(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.hypot(dx, dy);
    }

    document.addEventListener('touchstart', (event) => {
      if (event.touches.length === 2) {
        pinchDistance = getPinchDistance(event.touches);
        autoFit = false;
      }
    }, { passive: true });

    document.addEventListener('touchmove', (event) => {
      if (event.touches.length !== 2 || pinchDistance == null) return;
      event.preventDefault();
      const distance = getPinchDistance(event.touches);
      zoomByFactor(distance / pinchDistance);
      pinchDistance = distance;
    }, { passive: false });

    document.addEventListener('touchend', (event) => {
      if (event.touches.length < 2) pinchDistance = null;
    });

    window.addEventListener('resize', () => {
      if (autoFit) fitToWidth();
    });

    requestAnimationFrame(fitToWidth);
  }

  // ── Layout warnings ─────────────────────────────────────────
  function setupLayoutWarnings() {
    const page = document.querySelector('.resume-page');
    const sidebar = document.querySelector('.sidebar');
    const main = document.querySelector('.main');
    const singleHeader = document.querySelector('.single-header');
    const warning = document.getElementById('layout-warning');
    const limitLine = document.querySelector('.a4-limit-line');
    if (limitLine) limitLine.hidden = true;
    if (!page || !main || !warning) return;

    function checkOverflow() {
      const a4Height = page.offsetWidth * 297 / 210;
      const contentNodes = [sidebar, singleHeader, main].filter(Boolean);
      const contentHeight = Math.max(...contentNodes.map(node => node.offsetTop + node.scrollHeight));
      const overflowPx = contentHeight - a4Height;

      if (overflowPx > 2) {
        const overflowMm = overflowPx / page.offsetWidth * 210;
        warning.hidden = false;
        warning.textContent = `超出 ${Math.ceil(overflowMm)}mm`;
        warning.title = `内容高度约 ${(contentHeight / page.offsetWidth * 210).toFixed(1)}mm，A4 高度为 297mm。`;
        if (limitLine) limitLine.hidden = false;
      } else {
        warning.hidden = true;
        warning.textContent = '';
        warning.removeAttribute('title');
        if (limitLine) limitLine.hidden = true;
      }
    }

    window.addEventListener('resize', checkOverflow);
    if ('ResizeObserver' in window) {
      new ResizeObserver(checkOverflow).observe(page);
    }
    requestAnimationFrame(checkOverflow);
    window.addEventListener('load', checkOverflow);
  }

  // ── Toolbar tooltips (fixed; avoids overflow clipping in Safari) ─
  function setupToolbarTooltips() {
    document.querySelectorAll('.toolbar-tooltip').forEach(tooltip => {
      // .preview-toolbar-shell has transform:translateX(-50%), which makes it
      // the containing block for position:fixed children. Moving each tooltip
      // to document.body restores normal viewport-relative fixed positioning.
      document.body.appendChild(tooltip);

      const id = tooltip.id;
      const described = document.querySelector(`[aria-describedby="${id}"]`);
      // Tooltips inside .print-btn-wrap use the wrapper as trigger; others
      // (e.g. .browser-warning-icon) fall back to the aria owner itself.
      const trigger = described?.closest('.print-btn-wrap') || described;
      if (!trigger) return;

      function position() {
        const triggerRect = trigger.getBoundingClientRect();
        const toolbar = document.querySelector('.preview-toolbar-shell');
        const anchorTop = (toolbar
          ? toolbar.getBoundingClientRect().bottom
          : triggerRect.bottom) + 8;

        // Center over the trigger button, clamped to viewport edges.
        const centerX = triggerRect.left + triggerRect.width / 2;
        const tw = tooltip.offsetWidth;
        const clamped = tw > 0
          ? Math.min(Math.max(centerX, tw / 2 + 8), window.innerWidth - tw / 2 - 8)
          : centerX;

        tooltip.style.left = `${clamped}px`;
        tooltip.style.top = `${anchorTop}px`;
        tooltip.style.right = 'auto';
        tooltip.style.transform = 'translateX(-50%)';
      }

      function show() {
        position();
        tooltip.classList.add('is-visible');
      }

      function hide() {
        tooltip.classList.remove('is-visible');
      }

      trigger.addEventListener('mouseenter', show);
      trigger.addEventListener('focusin', show);
      trigger.addEventListener('mouseleave', hide);
      trigger.addEventListener('focusout', hide);
      window.addEventListener('resize', () => {
        if (tooltip.classList.contains('is-visible')) position();
      });
    });
  }

  // ── Browser compatibility hint ──────────────────────────────
  function isChromiumBased() {
    const ua = navigator.userAgent;
    if (/Firefox|FxiOS/i.test(ua)) return false;
    if (/CriOS|EdgiOS|EdgA|Edg\//i.test(ua)) return true;
    if (/OPR\/|Brave/i.test(ua)) return true;
    return /Chrome|Chromium/i.test(ua);
  }

  function setupBrowserWarning() {
    const warning = document.getElementById('browser-warning');
    if (!warning || isChromiumBased()) return;
    warning.hidden = false;
  }

  // ── Print export ────────────────────────────────────────────
  function setupPrintExport() {
    const printButton = document.querySelector('[data-print]');
    if (!printButton) return;
    printButton.addEventListener('click', () => window.print());
  }

  // ── Bootstrap ────────────────────────────────────────────────
  try {
    const dataEl = document.getElementById('resume-data');
    if (!dataEl) throw new Error('Missing #resume-data element');
    const data = JSON.parse(dataEl.textContent);
    const app  = document.getElementById('app');
    if (!app) throw new Error('Missing #app element');
    applyTheme(data.theme);
    app.innerHTML = renderResume(data);
    setupPreviewZoom();
    setupLayoutWarnings();
    setupBrowserWarning();
    setupToolbarTooltips();
    setupPrintExport();

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
