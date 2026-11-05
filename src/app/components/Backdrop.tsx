import { useEffect, useRef } from 'react';

// A design-canvas dot grid behind the whole page. Dots near the pointer swell, brighten
// toward the accent and lean away from it; the grid drifts at a fraction of scroll speed for depth.
// Also drives the pointer glow, the hero aurora fade and each card's --lx/--ly spotlight.
const GAP = 28;
const REACH = 170;

export default function Backdrop() {
  const ref = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const auroraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const glow = glowRef.current!, aurora = auroraRef.current!;
    const tiles = document.getElementsByClassName('tile') as HTMLCollectionOf<HTMLElement>; // live list
    const ctx = canvas.getContext('2d')!;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = { x: innerWidth * 0.7, y: innerHeight * 0.35 };
    const p = { ...target };
    let w = 0, h = 0, raf = 0, idle = 0;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth;
      h = innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const off = -((scrollY * 0.3) % GAP);
      for (let y = off; y < h + GAP; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          const dx = x - p.x, dy = y - p.y;
          const d = Math.hypot(dx, dy);
          const t = still || d > REACH ? 0 : (1 - d / REACH) ** 2;
          const push = t * 7;
          const nx = d ? dx / d : 0, ny = d ? dy / d : 0;
          ctx.fillStyle = t
            ? `rgba(${Math.round(255 - 214 * t)},${Math.round(255 - 104 * t)},255,${0.13 + 0.7 * t})`
            : 'rgba(255,255,255,0.13)';
          ctx.beginPath();
          ctx.arc(x + nx * push, y + ny * push, 1 + 1.8 * t, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    // Only animate while the pointer is settling or the page scrolls; sleep otherwise.
    const tick = () => {
      p.x += (target.x - p.x) * 0.16;
      p.y += (target.y - p.y) * 0.16;
      // Write only to the elements that use these values; a variable on <html> would make the browser
      // re-style the whole page every frame.
      glow.style.background = `radial-gradient(520px circle at ${p.x}px ${p.y}px, rgba(41,151,255,0.09), transparent 70%)`;
      aurora.style.opacity = `${Math.max(0, 1 - scrollY / (h * 0.9))}`;
      if (!still) {
        for (const t of tiles) {
          const r = t.getBoundingClientRect();
          const near = p.x > r.left - 260 && p.x < r.right + 260 && p.y > r.top - 260 && p.y < r.bottom + 260;
          if (near || t.dataset.lit) {
            t.style.setProperty('--lx', near ? `${p.x - r.left}px` : '-999px');
            t.style.setProperty('--ly', near ? `${p.y - r.top}px` : '-999px');
            if (near) t.dataset.lit = '1';
            else delete t.dataset.lit;
          }
        }
      }
      draw();
      const moving = Math.abs(target.x - p.x) + Math.abs(target.y - p.y) > 0.3;
      raf = moving || ++idle < 2 ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => {
      idle = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      wake();
    };

    resize();
    addEventListener('resize', resize);
    addEventListener('scroll', wake, { passive: true });
    if (!still) addEventListener('pointermove', onMove, { passive: true });
    wake();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      removeEventListener('scroll', wake);
      removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0">
      {/* Aurora that belongs to the hero: fades out as you scroll past it */}
      <div ref={auroraRef} className="aurora absolute inset-0" />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      {/* Soft light that follows the pointer */}
      <div ref={glowRef} className="absolute inset-0" />
    </div>
  );
}
