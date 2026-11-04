import { useEffect, useRef } from 'react';

// A design-canvas dot grid behind the whole page. Dots near the pointer swell, brighten
// toward the accent and lean away from it; the grid drifts at a fraction of scroll speed for depth.
// Also feeds --px/--py (smoothed pointer) to the page for the hero glow and tile spotlights.
const GAP = 28;
const REACH = 170;

export default function Backdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
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
      document.documentElement.style.setProperty('--px', `${p.x}px`);
      document.documentElement.style.setProperty('--py', `${p.y}px`);
      document.documentElement.style.setProperty('--hero', `${Math.max(0, 1 - scrollY / (h * 0.9))}`);
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
      <div className="aurora absolute inset-0" />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      {/* Soft light that follows the pointer */}
      <div className="absolute inset-0 bg-[radial-gradient(520px_circle_at_var(--px)_var(--py),rgba(41,151,255,0.09),transparent_70%)]" />
    </div>
  );
}
