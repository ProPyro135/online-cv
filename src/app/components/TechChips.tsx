import { TECH } from '../techLogos';

/** A row of tech logos. The cursor build drags the whole row out as one box (data-swarm-whole). */
export default function TechChips({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul data-swarm-whole className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((name) => {
        const logo = TECH[name];
        return (
          <li
            key={name}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] py-1 pl-2 pr-3 text-[14px] text-[var(--ink)]"
          >
            {logo ? (
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 shrink-0">
                <path d={logo.path} fill={logo.color} />
              </svg>
            ) : (
              <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ink-3)]" />
            )}
            {name}
          </li>
        );
      })}
    </ul>
  );
}
