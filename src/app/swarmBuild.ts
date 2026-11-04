// "Watch it build", movie edition: hides the page, then a crew of labelled cursors rebuilds it —
// dragging out boxes (Figma-style) and typing text — while the page glides down in one slow,
// continuous scroll, easing off only when the crew falls behind. Real elements are revealed with clip-path; nothing is cloned.
// Any wheel, touch, key or click (or the Stop button) ends it and hands the page back.

import { CREW, HELPERS, type Member } from './crew';

type Kind = 'box' | 'text';
// top/bottom are document coordinates (the layout doesn't move while the movie runs).
type Task = { el: HTMLElement | SVGSVGElement; kind: Kind; parent?: Task; taken: boolean; done: boolean; top: number; bottom: number };
type Line = { left: number; right: number; top: number; bottom: number };

const HIDE = 'data-sb-hide';

const CSS = `
[${HIDE}]{visibility:hidden!important;transition:none!important}
.sb-running [data-reveal]{opacity:1!important;transform:none!important}
.sb-layer{position:fixed;inset:0;z-index:45}
.sb-cursor{position:fixed;left:0;top:0;pointer-events:none;will-change:transform;z-index:2}
.sb-cursor svg.sb-ptr{position:absolute;display:none;overflow:visible}
.sb-cursor[data-mode=arrow] .sb-arrow,.sb-cursor[data-mode=cross] .sb-cross,.sb-cursor[data-mode=text] .sb-text{display:block}
.sb-cross,.sb-text{left:-8px;top:-9px}
.sb-name{position:absolute;left:14px;top:18px;display:flex;align-items:center;gap:5px;padding:3px 8px 3px 6px;border-radius:999px;font:600 11px/1.3 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.35)}
.sb-name svg{width:13px;height:13px;flex:none}
.sb-sel{position:fixed;border:1px solid var(--c);background:color-mix(in srgb,var(--c) 7%,transparent);pointer-events:none;transition:opacity .25s}
.sb-sel i{position:absolute;width:6px;height:6px;background:#0d0d0d;border:1px solid var(--c)}
.sb-sel i:nth-child(1){left:-4px;top:-4px}.sb-sel i:nth-child(2){right:-4px;top:-4px}
.sb-sel i:nth-child(3){left:-4px;bottom:-4px}.sb-sel i:nth-child(4){right:-4px;bottom:-4px}
.sb-badge{position:absolute;top:100%;left:50%;transform:translate(-50%,7px);background:var(--c);color:var(--t);font:600 10px/1 ui-monospace,monospace;padding:3px 5px;border-radius:4px;white-space:nowrap}
.sb-caret{position:fixed;width:2px;background:var(--c);pointer-events:none}
.sb-cursor[data-parked] .sb-name{font-size:0;gap:0;padding:5px}
.sb-stop{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:10px;padding:8px 8px 8px 16px;border-radius:999px;background:rgba(22,22,23,.78);backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);border:1px solid rgba(255,255,255,.12);color:rgba(245,245,247,.75);font:13px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;white-space:nowrap;z-index:3}
.sb-stop button{display:flex;align-items:center;gap:6px;padding:7px 12px;border-radius:999px;background:#f5f5f7;color:#000;font-weight:600;cursor:pointer;transition:transform .12s}
.sb-stop button:active{transform:scale(.97)}
.sb-stop b{font-weight:600;color:#f5f5f7}
.sb-meter{width:84px;height:4px;border-radius:2px;background:rgba(255,255,255,.12);overflow:hidden}
.sb-meter i,.sb-bar{display:block;height:100%;transform-origin:left;transform:scaleX(var(--p,0));background:linear-gradient(90deg,#61dafb,#ffd43b,#ff9900,#ff5c7a,#3b82f6,#3ecf8e)}
.sb-pct{min-width:34px;text-align:right;font-variant-numeric:tabular-nums;color:#f5f5f7}
.sb-bar{position:fixed;top:48px;left:0;width:100%;height:2px;box-shadow:0 0 14px 1px rgba(97,218,251,.55);overflow:hidden}
.sb-bar::after{content:'';position:absolute;inset:0;width:30%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9),transparent);animation:sb-shine 1.4s linear infinite}
@keyframes sb-shine{from{transform:translateX(-100%)}to{transform:translateX(400%)}}
@media (max-width:640px){.sb-meter{display:none}}
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

/** Elements that paint something and intersect the viewport band [top, bottom). */
function collect(root: Element, top: number, bottom: number, seen: WeakSet<Element>): Task[] {
  const tasks: Task[] = [];
  const byEl = new Map<Element, Task>();
  for (const el of root.querySelectorAll<HTMLElement | SVGElement>('*')) {
    if (el instanceof SVGElement && !(el instanceof SVGSVGElement)) continue;
    if (seen.has(el) || el.closest('[data-swarm-skip]')) continue;
    // A [data-swarm-whole] group (a row of logo chips) is dragged out as one box; its insides aren't separate steps.
    const whole = el.closest('[data-swarm-whole]');
    if (whole && whole !== el) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2 || r.bottom <= top || r.top >= bottom || r.right <= 0 || r.left >= innerWidth) continue;
    if (r.width >= innerWidth * 0.98 && r.height >= innerHeight * 0.98) continue; // page-sized backgrounds stay
    // Not opacity: content further down is still mid-fade (scroll reveals) when it gets queued.
    if ('checkVisibility' in el && !el.checkVisibility({ visibilityProperty: true })) continue;
    const cs = getComputedStyle(el);
    if (cs.filter.includes('blur')) continue; // decorative glows
    const media = el instanceof SVGSVGElement || el.tagName === 'IMG';
    const kind: Kind | null = media || whole || isBox(cs) ? 'box' : hasOwnText(el) ? 'text' : null;
    if (!kind) continue;
    let parent: Task | undefined;
    for (let p = el.parentElement; p && p !== root && !parent; p = p.parentElement) parent = byEl.get(p);
    const t: Task = { el: el as Task['el'], kind, parent, taken: false, done: false, top: r.top + scrollY, bottom: r.bottom + scrollY };
    byEl.set(el, t);
    seen.add(el);
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
  const root = document.getElementById('root')!;
  const seen = new WeakSet<Element>();
  const hidden = new Set<Task['el']>();
  // Everything from here to the bottom of the page is hidden up front and built as it scrolls into view.
  const tasks = collect(root, 0, 1e7, seen);
  if (!tasks.length) return;
  const total = tasks.length;
  let built = 0;

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
  layer.innerHTML =
    '<div class="sb-bar"></div><div class="sb-stop" role="status"><span>Building <b>About</b></span><span class="sb-meter"><i></i></span><span class="sb-pct">0%</span><button type="button" aria-label="Stop the build animation"><svg width="9" height="9"><rect width="9" height="9" rx="1.5" fill="currentColor"/></svg>Stop</button></div>';
  document.body.appendChild(layer);
  for (const t of tasks) {
    t.el.setAttribute(HIDE, '');
    hidden.add(t.el);
  }

  // Progress readout: the shown number eases toward the real one, like a loader catching up.
  const label = layer.querySelector('.sb-stop b')!;
  const pct = layer.querySelector('.sb-pct')!;
  let shown = 0;
  const meter = () => {
    if (!alive) return;
    shown += (built / total - shown) * 0.12;
    layer.style.setProperty('--p', shown.toFixed(4));
    pct.textContent = `${Math.round(shown * 100)}%`;
    const mid = [...document.querySelectorAll('section[id]')].find((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= innerHeight * 0.6 && r.bottom > innerHeight * 0.4;
    });
    if (mid) label.textContent = mid.id[0].toUpperCase() + mid.id.slice(1);
    requestAnimationFrame(meter);
  };
  requestAnimationFrame(meter);

  // The visitor takes over the moment they do anything.
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab' && !e.metaKey && !e.ctrlKey && !e.altKey) stop();
  };
  const passive = { passive: true };
  addEventListener('wheel', stop, passive);
  addEventListener('touchstart', stop, passive);
  addEventListener('keydown', onKey);
  layer.addEventListener('pointerdown', stop);

  function stop() {
    if (!alive) return;
    alive = false;
    stopCurrent = null;
    for (const el of hidden) {
      el.removeAttribute(HIDE);
      el.style.clipPath = '';
    }
    removeEventListener('wheel', stop);
    removeEventListener('touchstart', stop);
    removeEventListener('keydown', onKey);
    layer.remove();
    document.documentElement.classList.remove('sb-running');
    onRunningChange(false);
  }
  stopCurrent = stop;
  onRunningChange(true);
  // The cursors are the reveal now; switch off the scroll fade-ins so they don't fight.
  document.documentElement.classList.add('sb-running');

  const crewSize = innerWidth < 640 ? 4 : 6;
  const makeCursor = (member: Member, x: number, y: number) => {
    const [name, color, ink, logo] = member;
    const el = document.createElement('div');
    el.className = 'sb-cursor';
    el.dataset.mode = 'arrow';
    el.innerHTML = `
      <svg class="sb-ptr sb-arrow" width="16" height="20"><path d="M1 1v15l4.2-4 2.9 6.6 2.6-1.1-2.9-6.5H14z" fill="${color}" stroke="#0d0d0d" stroke-width="1.2" stroke-linejoin="round"/></svg>
      <svg class="sb-ptr sb-cross" width="17" height="17"><path d="M8.5 0v17M0 8.5h17" stroke="#0d0d0d" stroke-width="3"/><path d="M8.5 0v17M0 8.5h17" stroke="${color}" stroke-width="1.2"/></svg>
      <svg class="sb-ptr sb-text" width="17" height="19"><path d="M5.5 1h6M5.5 18h6M8.5 1v17" stroke="#0d0d0d" stroke-width="3"/><path d="M5.5 1h6M5.5 18h6M8.5 1v17" stroke="${color}" stroke-width="1.2"/></svg>
      <span class="sb-name" style="background:${color};color:${ink}"><svg viewBox="0 0 24 24"><path d="${logo}" fill="currentColor"/></svg>${name}</span>`;
    layer.appendChild(el);
    const c = { el, color, ink, x, y, member, orbit: '' as '' | 'arriving' | 'on', slot: 0 };
    const set = (x: number, y: number) => {
      c.x = x;
      c.y = y;
      el.style.transform = `translate(${x}px,${y}px)`;
    };
    set(x, y);
    /** Arc to (x, y). With an anchor, the target rides along as the page scrolls under it. */
    const moveTo = (x: number, y: number, ms?: number, anchor?: Element) => {
      const x0 = c.x, y0 = c.y;
      const a0 = anchor ? anchor.getBoundingClientRect().top : 0;
      const dist = Math.hypot(x - x0, y - y0);
      // Slight arc: control point pushed sideways from the midpoint.
      const bend = (Math.random() - 0.5) * 0.4;
      const cx = (x0 + x) / 2 - (y - y0) * bend, cy = (y0 + y) / 2 + (x - x0) * bend;
      return tween(ms ?? clamp(250 + dist * 0.6, 250, 900), (k) => {
        const e = ease(k), u = 1 - e;
        const ty = anchor ? clamp(anchor.getBoundingClientRect().top - a0 + y, 56, innerHeight - 12) : y;
        set(u * u * x0 + 2 * u * e * cx + e * e * x, u * u * y0 + 2 * u * e * cy + e * e * ty);
      });
    };
    // Same object, not a copy: x/y must stay live for nearest-task picks and orbit hand-offs.
    return Object.assign(c, { set, moveTo, mode: (m: string) => (el.dataset.mode = m) });
  };
  // The main crew flies in from alternating screen edges.
  const cursors = CREW.slice(0, crewSize).map((m, i) => makeCursor(m, i % 2 ? innerWidth + 40 : -40, innerHeight * (0.15 + 0.12 * i)));
  cursors.forEach((c, i) => (c.slot = i));

  // Idle cursors circle an invisible point as logo "satellites" instead of loitering over the content.
  // In the empty right margin beside the content column when there's room; otherwise the bottom-right corner.
  const margin = (innerWidth - 1024) / 2;
  const roomy = margin >= 96;
  const R = roomy ? Math.min(64, (margin - 24) / 2) : innerWidth < 640 ? 40 : 56;
  const hub = roomy
    ? { x: innerWidth - margin / 2 - 14, y: innerHeight * 0.55 }
    : { x: innerWidth - R - 20, y: innerHeight - R * 0.55 - 110 };
  let theta = 0;
  // Offset so the logo chip, not the arrow tip, rides the ring.
  const orbitPos = (c: { slot: number }) => {
    const a = theta + (c.slot * Math.PI * 2) / cursors.length;
    return { x: hub.x + R * Math.cos(a) - 20, y: hub.y + R * 0.55 * Math.sin(a) - 26 };
  };
  let lastT = performance.now();
  const spin = (now: number) => {
    if (!alive) return;
    theta += ((now - lastT) / 1000) * 0.8;
    lastT = now;
    for (const c of cursors) if (c.orbit === 'on') {
      const p = orbitPos(c);
      c.set(p.x, p.y);
    }
    requestAnimationFrame(spin);
  };
  requestAnimationFrame(spin);
  const park = async (c: Cursor) => {
    if (c.orbit) return;
    c.orbit = 'arriving';
    c.mode('arrow');
    c.el.dataset.parked = '';
    const x0 = c.x, y0 = c.y;
    await tween(800, (k) => {
      if (c.orbit !== 'arriving') return; // called away mid-flight
      const e = ease(k), p = orbitPos(c);
      c.set(x0 + (p.x - x0) * e, y0 + (p.y - y0) * e);
    });
    if (c.orbit === 'arriving') c.orbit = 'on';
  };
  const unpark = (c: Cursor) => {
    c.orbit = '';
    delete c.el.dataset.parked;
  };
  // Helpers on the bench, called in for long paragraphs.
  const bench = [...CREW.slice(crewSize), ...HELPERS];
  type Cursor = (typeof cursors)[number];
  const onScreenY = (y: number) => clamp(y, 56, innerHeight - 12);

  async function dragBox(c: Cursor, el: Task['el']) {
    const r0 = el.getBoundingClientRect();
    await c.moveTo(r0.left, onScreenY(r0.top), undefined, el);
    if (!alive) return;
    c.mode('cross');
    const sel = document.createElement('div');
    sel.className = 'sb-sel';
    sel.style.setProperty('--c', c.color);
    sel.style.setProperty('--t', c.ink);
    sel.innerHTML = '<i></i><i></i><i></i><i></i><span class="sb-badge"></span>';
    layer.appendChild(sel);
    const badge = sel.querySelector('span')!;
    el.style.clipPath = 'inset(0 100% 100% 0)';
    el.removeAttribute(HIDE);
    await tween(clamp(350 + Math.sqrt(r0.width * r0.height) * 1.2, 400, 1100), (k) => {
      const r = el.getBoundingClientRect(); // live: the page is moving
      const e = ease(k), w = r.width * e, h = r.height * e;
      c.set(r.left + w, onScreenY(r.top + h));
      Object.assign(sel.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${w}px`, height: `${h}px` });
      badge.textContent = `${Math.round(w)} × ${Math.round(h)}`;
      el.style.clipPath = `inset(0 ${(1 - e) * 100}% ${(1 - e) * 100}% 0)`;
    });
    el.style.clipPath = '';
    sel.style.opacity = '0';
    setTimeout(() => sel.remove(), 250);
  }

  /** Type one line at the original speed. l.top/bottom are relative to el, so the caret rides the scroll. */
  async function typeLine(c: Cursor, el: Element, l: Line, charW: number, first: boolean, onProgress: (x: number) => void) {
    const midY = () => onScreenY(el.getBoundingClientRect().top + (l.top + l.bottom) / 2);
    await c.moveTo(l.left, midY(), first ? undefined : 120, el);
    if (!alive) return;
    c.mode('text');
    const caret = document.createElement('div');
    caret.className = 'sb-caret';
    caret.style.setProperty('--c', c.color);
    caret.style.height = `${l.bottom - l.top}px`;
    layer.appendChild(caret);
    await tween(clamp(((l.right - l.left) / charW) * 28, 120, 1600), (k) => {
      const x = l.left + (l.right - l.left) * k;
      c.set(x, midY());
      Object.assign(caret.style, { left: `${x}px`, top: `${el.getBoundingClientRect().top + l.top}px` });
      onProgress(x);
    });
    caret.remove();
  }

  async function typeText(c: Cursor, el: Task['el']) {
    const er = el.getBoundingClientRect();
    // Line tops relative to the element, so they stay right while the page scrolls.
    const lines = lineRects(el).map((l) => ({ ...l, top: l.top - er.top, bottom: l.bottom - er.top }));
    // Ancestor transforms (scale) mean viewport px != the element's own px.
    const sx = el instanceof HTMLElement && el.offsetWidth ? er.width / el.offsetWidth : 1;
    const sy = el instanceof HTMLElement && el.offsetHeight ? er.height / el.offsetHeight : 1;
    if (!lines.length) return el.removeAttribute(HIDE);
    const charW = parseFloat(getComputedStyle(el).fontSize) * 0.5;
    const ownW = er.width / sx;

    // Long paragraph: split the lines into chunks and call in helpers so several carets type at once.
    const helpersWanted = Math.min(4, lines.length - 1); // one extra caret per extra line, up to 4
    const crew: Cursor[] = [c];
    for (let i = 0; i < helpersWanted && bench.length; i++) {
      const l = lines[Math.round(((i + 1) * lines.length) / (helpersWanted + 1))];
      const fromLeft = l.left < innerWidth / 2;
      crew.push(makeCursor(bench.shift()!, fromLeft ? -40 : innerWidth + 40, onScreenY(er.top + l.top)));
    }
    const per = Math.ceil(lines.length / crew.length);
    const chunks = crew.map((_, i) => lines.slice(i * per, (i + 1) * per)).filter((ch) => ch.length);

    // Reveal: one rectangle per line, each as wide as its caret has reached (a union of sub-paths).
    const reached = lines.map(() => 0);
    const paint = () => {
      const d = lines
        .map((l, i) => {
          if (!reached[i]) return '';
          const yt = l.top / sy, yb = l.bottom / sy;
          const x = reached[i] >= Infinity ? ownW : (reached[i] - er.left) / sx;
          return `M0 ${yt}H${x}V${yb}H0Z`;
        })
        .join('');
      el.style.clipPath = d ? `path('${d}')` : 'inset(0 100% 100% 0)';
    };
    paint();
    let shown = false;
    await Promise.all(
      chunks.map(async (chunk, ci) => {
        const who = crew[ci];
        for (const [j, l] of chunk.entries()) {
          if (!alive) return;
          const i = lines.indexOf(l);
          await typeLine(who, el, l, charW, j === 0, (x) => {
            if (!shown) {
              el.removeAttribute(HIDE);
              shown = true;
            }
            reached[i] = x;
            paint();
          });
          reached[i] = Infinity;
          paint();
        }
        // Helpers head back to the nearest edge and leave.
        if (who !== c) {
          who.mode('arrow');
          await who.moveTo(who.x < innerWidth / 2 ? -60 : innerWidth + 60, who.y);
          who.el.remove();
          bench.push(who.member);
        }
      }),
    );
    el.removeAttribute(HIDE);
    el.style.clipPath = '';
  }

  // Work is whatever has scrolled into view (and whose container is already built), most urgent first.
  const ready = (t: Task) => !t.taken && (!t.parent || t.parent.done) && t.top - scrollY < innerHeight - 24;
  const work = async (c: Cursor) => {
    let idleSince = 0;
    while (alive) {
      const open = tasks.filter(ready).slice(0, 4);
      if (!open.length) {
        if (tasks.every((t) => t.taken)) return park(c);
        // Waited a while? Drift into orbit; it gets called back the moment work frees up.
        idleSince ||= performance.now();
        if (performance.now() - idleSince > 500) park(c);
        await sleep(50);
        continue;
      }
      // Of the most urgent few, grab the nearest so the crew spreads out naturally.
      const dist = (t: Task) => {
        const r = t.el.getBoundingClientRect();
        return Math.hypot(r.left - c.x, r.top - c.y);
      };
      const t = open.reduce((a, b) => (dist(b) < dist(a) ? b : a));
      t.taken = true;
      idleSince = 0;
      unpark(c);
      await (t.kind === 'text' ? typeText(c, t.el) : dragBox(c, t.el));
      t.done = true;
      built++;
      c.mode('arrow');
    }
  };

  // One continuous glide at a low, steady speed. It eases off (never jumps) while unbuilt work sits in
  // the top half of the screen, and picks back up once the crew has caught up.
  const cruise = innerWidth < 640 ? 70 : 60; // px per second
  const maxY = () => document.documentElement.scrollHeight - innerHeight;
  let pos = scrollY, v = 0, prev = performance.now();
  const glide = (now: number) => {
    if (!alive) return;
    const dt = Math.min(0.05, (now - prev) / 1000);
    prev = now;
    let behind = 0;
    for (const t of tasks) {
      if (t.done) continue;
      const y = t.top - scrollY;
      if (t.bottom - scrollY < 56 && !t.taken) {
        // Slipped past unbuilt (shouldn't happen): show it rather than leave a hole.
        t.taken = t.done = true;
        t.el.removeAttribute(HIDE);
        built++;
      } else if (y < innerHeight * 0.5) behind += y < innerHeight * 0.2 ? 3 : 1;
    }
    const target = cruise * clamp(1 - (behind - 1) / 5, 0, 1);
    v += (target - v) * Math.min(1, dt * 1.6);
    pos = Math.min(maxY(), pos + v * dt);
    scrollTo({ top: pos, behavior: 'instant' });
    requestAnimationFrame(glide);
  };
  requestAnimationFrame(glide);

  (async () => {
    await Promise.all(cursors.map(work));
    while (alive && pos < maxY() - 1) await sleep(100); // finish the glide to the bottom
    if (!alive) return;
    built = total;
    label.textContent = 'Done';
    await sleep(500);
    // Everyone leaves the way they came, then the real page takes over.
    cursors.forEach(unpark);
    layer.querySelector('.sb-stop')?.remove();
    await Promise.all(cursors.map((c, i) => c.moveTo(i % 2 ? innerWidth + 60 : -60, c.y)));
    stop();
  })();
}
