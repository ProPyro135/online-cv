// "Watch it build": hides whatever is on screen, then a few labelled cursors
// rebuild it — dragging out boxes (Figma-style) and typing text line by line —
// by revealing the real elements with clip-path. Nothing is cloned or re-rendered.

type Kind = 'box' | 'text';
type Task = { el: HTMLElement | SVGSVGElement; kind: Kind; parent?: Task; taken: boolean; done: boolean };
type Line = { left: number; right: number; top: number; bottom: number };

const HIDE = 'data-sb-hide';
const CREW: [string, string][] = [
  ['React', '#61dafb'],
  ['Angular', '#fb7185'],
  ['AWS', '#f59e0b'],
  ['Python', '#a78bfa'],
  ['Ionic', '#34d399'],
];

const CSS = `
[${HIDE}]{visibility:hidden!important;transition:none!important}
.sb-layer{position:fixed;inset:0;z-index:45;transition:opacity .4s}
.sb-cursor{position:fixed;left:0;top:0;pointer-events:none;will-change:transform;z-index:2}
.sb-cursor svg{position:absolute;display:none;overflow:visible}
.sb-cursor[data-mode=arrow] .sb-arrow,.sb-cursor[data-mode=cross] .sb-cross,.sb-cursor[data-mode=text] .sb-text{display:block}
.sb-cross,.sb-text{left:-8px;top:-9px}
.sb-name{position:absolute;left:14px;top:18px;padding:2px 7px;border-radius:6px;font-size:11px;font-weight:600;line-height:1.4;color:#0d0d0d;white-space:nowrap}
.sb-sel{position:fixed;border:1px solid var(--c);background:color-mix(in srgb,var(--c) 7%,transparent);pointer-events:none;transition:opacity .25s}
.sb-sel i{position:absolute;width:6px;height:6px;background:#0d0d0d;border:1px solid var(--c)}
.sb-sel i:nth-child(1){left:-4px;top:-4px}.sb-sel i:nth-child(2){right:-4px;top:-4px}
.sb-sel i:nth-child(3){left:-4px;bottom:-4px}.sb-sel i:nth-child(4){right:-4px;bottom:-4px}
.sb-badge{position:absolute;top:100%;left:50%;transform:translate(-50%,7px);background:var(--c);color:#0d0d0d;font:600 10px/1 ui-monospace,monospace;padding:3px 5px;border-radius:4px;white-space:nowrap}
.sb-caret{position:fixed;width:2px;background:var(--c);pointer-events:none}
.sb-hint{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);padding:6px 12px;border-radius:999px;background:rgba(13,13,13,.85);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.6);font-size:12px;white-space:nowrap;pointer-events:none}
`;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Alpha of any computed CSS colour (rgba, oklch(... / a), transparent). */
function alpha(c: string) {
  if (!c || c === 'transparent') return 0;
  const slash = c.match(/\/\s*([\d.]+)(%?)\s*\)$/);
  if (slash) return +slash[1] / (slash[2] ? 100 : 1);
  const rgba = c.match(/^rgba\((?:[^,]+,){3}\s*([\d.]+)\)/);
  return rgba ? +rgba[1] : 1;
}

function isBox(cs: CSSStyleDeclaration) {
  if (alpha(cs.backgroundColor) > 0.02 || cs.backgroundImage !== 'none') return true;
  return (['Top', 'Right', 'Bottom', 'Left'] as const).some(
    (s) => parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none' && alpha(cs[`border${s}Color`]) > 0.02,
  );
}

const hasOwnText = (el: Element) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim());

/** Every element on screen that paints something: boxes/media get dragged out, text gets typed. */
function collect(root: Element): Task[] {
  const tasks: Task[] = [];
  const byEl = new Map<Element, Task>();
  for (const el of root.querySelectorAll<HTMLElement | SVGElement>('*')) {
    if (el instanceof SVGElement && !(el instanceof SVGSVGElement)) continue;
    if (el.closest('[data-swarm-skip]')) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2 || r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth) continue;
    if (r.width >= innerWidth * 0.98 && r.height >= innerHeight * 0.98) continue; // page-sized backgrounds stay
    if ('checkVisibility' in el && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
    const cs = getComputedStyle(el);
    if (cs.filter.includes('blur')) continue; // decorative glows
    const media = el instanceof SVGSVGElement || el.tagName === 'IMG';
    const kind: Kind | null = media || isBox(cs) ? 'box' : hasOwnText(el) ? 'text' : null;
    if (!kind) continue;
    let parent: Task | undefined;
    for (let p = el.parentElement; p && p !== root && !parent; p = p.parentElement) parent = byEl.get(p);
    const t: Task = { el: el as Task['el'], kind, parent, taken: false, done: false };
    byEl.set(el, t);
    tasks.push(t);
  }
  return tasks;
}

/** Viewport rects of each rendered line of the element's own text. */
function lineRects(el: Element): Line[] {
  const lines: Line[] = [];
  for (const n of el.childNodes) {
    if (n.nodeType !== 3 || !n.textContent!.trim()) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    for (const r of range.getClientRects()) {
      if (r.width < 1) continue;
      const l = lines.find((l) => Math.abs(l.top - r.top) < r.height / 2);
      if (l) Object.assign(l, { left: Math.min(l.left, r.left), right: Math.max(l.right, r.right), bottom: Math.max(l.bottom, r.bottom) });
      else lines.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });
    }
  }
  return lines.sort((a, b) => a.top - b.top);
}

let injected = false;
let stopCurrent: (() => void) | null = null;

export function toggleSwarmBuild(onRunningChange: (running: boolean) => void) {
  if (stopCurrent) return stopCurrent();
  if (!injected) {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    injected = true;
  }
  const tasks = collect(document.getElementById('root')!);
  if (!tasks.length) return;

  let alive = true;
  const tween = (ms: number, fn: (k: number) => void) =>
    new Promise<void>((res) => {
      const t0 = performance.now();
      const step = (now: number) => {
        if (!alive) return res();
        const k = Math.min(1, (now - t0) / ms);
        fn(k);
        if (k < 1) requestAnimationFrame(step);
        else res();
      };
      requestAnimationFrame(step);
    });

  const layer = document.createElement('div');
  layer.className = 'sb-layer';
  layer.innerHTML = '<div class="sb-hint">Rebuilding this view · click to skip</div>';
  document.body.appendChild(layer);
  for (const t of tasks) t.el.setAttribute(HIDE, '');

  // Scrolling would move things out from under the cursors; block it without hiding the scrollbar (no layout shift).
  const block = (e: Event) => e.preventDefault();
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') stop();
    else if ([' ', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault();
  };
  addEventListener('wheel', block, { passive: false });
  addEventListener('touchmove', block, { passive: false });
  addEventListener('keydown', onKey);
  layer.addEventListener('click', () => stop());

  function stop() {
    if (!alive) return;
    alive = false;
    stopCurrent = null;
    for (const t of tasks) {
      t.el.removeAttribute(HIDE);
      t.el.style.clipPath = '';
    }
    removeEventListener('wheel', block);
    removeEventListener('touchmove', block);
    removeEventListener('keydown', onKey);
    layer.remove();
    onRunningChange(false);
  }
  stopCurrent = stop;
  onRunningChange(true);

  const cursors = CREW.slice(0, clamp(Math.ceil(tasks.length / 4), 1, CREW.length)).map(([name, color], i) => {
    const el = document.createElement('div');
    el.className = 'sb-cursor';
    el.dataset.mode = 'arrow';
    el.innerHTML = `
      <svg class="sb-arrow" width="16" height="20"><path d="M1 1v15l4.2-4 2.9 6.6 2.6-1.1-2.9-6.5H14z" fill="${color}" stroke="#0d0d0d" stroke-width="1.2" stroke-linejoin="round"/></svg>
      <svg class="sb-cross" width="17" height="17"><path d="M8.5 0v17M0 8.5h17" stroke="#0d0d0d" stroke-width="3"/><path d="M8.5 0v17M0 8.5h17" stroke="${color}" stroke-width="1.2"/></svg>
      <svg class="sb-text" width="17" height="19"><path d="M5.5 1h6M5.5 18h6M8.5 1v17" stroke="#0d0d0d" stroke-width="3"/><path d="M5.5 1h6M5.5 18h6M8.5 1v17" stroke="${color}" stroke-width="1.2"/></svg>
      <span class="sb-name" style="background:${color}">${name}</span>`;
    layer.appendChild(el);
    // Fly in from alternating screen edges.
    const c = { el, color, x: i % 2 ? innerWidth + 40 : -40, y: innerHeight * (0.2 + 0.15 * i) };
    const set = (x: number, y: number) => {
      c.x = x;
      c.y = y;
      el.style.transform = `translate(${x}px,${y}px)`;
    };
    set(c.x, c.y);
    const moveTo = (x: number, y: number) => {
      const x0 = c.x, y0 = c.y;
      const dist = Math.hypot(x - x0, y - y0);
      // Slight arc: control point pushed sideways from the midpoint.
      const bend = (Math.random() - 0.5) * 0.4;
      const cx = (x0 + x) / 2 - (y - y0) * bend, cy = (y0 + y) / 2 + (x - x0) * bend;
      return tween(clamp(250 + dist * 0.6, 250, 900), (k) => {
        const e = ease(k), u = 1 - e;
        set(u * u * x0 + 2 * u * e * cx + e * e * x, u * u * y0 + 2 * u * e * cy + e * e * y);
      });
    };
    return { ...c, set, moveTo, mode: (m: string) => (el.dataset.mode = m) };
  });
  type Cursor = (typeof cursors)[number];

  async function dragBox(c: Cursor, el: Task['el']) {
    const r = el.getBoundingClientRect();
    await c.moveTo(r.left, r.top);
    if (!alive) return;
    c.mode('cross');
    const sel = document.createElement('div');
    sel.className = 'sb-sel';
    sel.style.setProperty('--c', c.color);
    sel.innerHTML = '<i></i><i></i><i></i><i></i><span class="sb-badge"></span>';
    layer.appendChild(sel);
    const badge = sel.querySelector('span')!;
    el.style.clipPath = 'inset(0 100% 100% 0)';
    el.removeAttribute(HIDE);
    await tween(clamp(350 + Math.sqrt(r.width * r.height) * 1.2, 400, 1100), (k) => {
      const e = ease(k), w = r.width * e, h = r.height * e;
      c.set(r.left + w, r.top + h);
      Object.assign(sel.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${w}px`, height: `${h}px` });
      badge.textContent = `${Math.round(w)} × ${Math.round(h)}`;
      el.style.clipPath = `inset(0 ${(1 - e) * 100}% ${(1 - e) * 100}% 0)`;
    });
    el.style.clipPath = '';
    sel.style.opacity = '0';
    setTimeout(() => sel.remove(), 250);
  }

  async function typeText(c: Cursor, el: Task['el']) {
    const er = el.getBoundingClientRect();
    const lines = lineRects(el);
    // Section transforms (scale) mean viewport px != the element's own px.
    const sx = el instanceof HTMLElement && el.offsetWidth ? er.width / el.offsetWidth : 1;
    const sy = el instanceof HTMLElement && el.offsetHeight ? er.height / el.offsetHeight : 1;
    const charW = parseFloat(getComputedStyle(el).fontSize) * 0.5;
    if (!lines.length) return el.removeAttribute(HIDE);
    await c.moveTo(lines[0].left, (lines[0].top + lines[0].bottom) / 2);
    if (!alive) return;
    c.mode('text');
    const caret = document.createElement('div');
    caret.className = 'sb-caret';
    caret.style.setProperty('--c', c.color);
    layer.appendChild(caret);
    el.style.clipPath = 'inset(0 100% 100% 0)';
    el.removeAttribute(HIDE);
    for (const l of lines) {
      const yt = (l.top - er.top) / sy, yb = (l.bottom - er.top) / sy;
      Object.assign(caret.style, { top: `${l.top}px`, height: `${l.bottom - l.top}px` });
      if (l !== lines[0]) await c.moveTo(l.left, (l.top + l.bottom) / 2);
      await tween(clamp(((l.right - l.left) / charW) * 28, 120, 1600), (k) => {
        const x = l.left + (l.right - l.left) * k;
        const lx = (x - er.left) / sx;
        c.set(x, (l.top + l.bottom) / 2);
        caret.style.left = `${x}px`;
        // Lines above are fully shown; the current line is shown up to the caret.
        el.style.clipPath = `polygon(0 0,100% 0,100% ${yt}px,${lx}px ${yt}px,${lx}px ${yb}px,0 ${yb}px)`;
      });
    }
    el.style.clipPath = '';
    caret.remove();
  }

  const ready = (t: Task) => !t.taken && (!t.parent || t.parent.done);
  async function work(c: Cursor) {
    while (alive) {
      const open = tasks.filter(ready).slice(0, 6);
      if (!open.length) {
        if (tasks.every((t) => t.taken)) return;
        await sleep(60);
        continue;
      }
      // Grab the nearest of the next few tasks so the crew spreads out naturally.
      const dist = (t: Task) => {
        const r = t.el.getBoundingClientRect();
        return Math.hypot(r.left - c.x, r.top - c.y);
      };
      const t = open.reduce((a, b) => (dist(b) < dist(a) ? b : a));
      t.taken = true;
      await (t.kind === 'text' ? typeText(c, t.el) : dragBox(c, t.el));
      t.done = true;
      c.mode('arrow');
    }
  }

  (async () => {
    await Promise.all(cursors.map(work));
    if (!alive) return;
    // Everyone leaves the way they came, then the real page takes over.
    layer.querySelector('.sb-hint')?.remove();
    await Promise.all(cursors.map((c, i) => c.moveTo(i % 2 ? innerWidth + 60 : -60, c.y)));
    stop();
  })();
}
