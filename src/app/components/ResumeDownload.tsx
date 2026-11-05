import { FileDown } from 'lucide-react';
import resumeEn from '../../imports/Alfeus_Xiesi_Delroy_-_Resume.pdf';
import resumeId from '../../imports/Alfeus_Xiesi_Delroy_-_Resume_ID.pdf';

import type { Copy, Lang } from '../i18n';

// SVG, not emoji: Windows renders flag emoji as plain letters.
export const flags: Record<Lang, React.ReactNode> = {
  en: (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <path d="M0 0h60v30H0z" fill="#012169" />
      <path d="M0 0l60 30M60 0L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0l60 30M60 0L0 30" stroke="#C8102E" strokeWidth="2" />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  ),
  id: (
    <svg viewBox="0 0 3 2" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <path d="M0 0h3v1H0z" fill="#CE1126" />
      <path d="M0 1h3v1H0z" fill="#fff" />
    </svg>
  ),
};

const options: { lang: Lang; label: string; file: string; name: string }[] = [
  { lang: 'en', label: 'English', file: resumeEn, name: 'Alfeus_Xiesi_Delroy_Resume_EN.pdf' },
  { lang: 'id', label: 'Bahasa Indonesia', file: resumeId, name: 'Alfeus_Xiesi_Delroy_Resume_ID.pdf' },
];

export default function ResumeDownload({ lang, onLang, c }: { lang: Lang; onLang: (l: Lang) => void; c: Copy }) {
  const current = options.find((o) => o.lang === lang)!;
  return (
    <div className="inline-flex items-center gap-3">
      <a
        href={current.file}
        download={current.name}
        className="press inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-[15px] font-medium text-white hover:bg-[var(--accent-hover)]"
      >
        <FileDown className="h-4 w-4" />
        {c.download}
      </a>
      <div role="radiogroup" aria-label={c.resumeLangAria} className="inline-flex rounded-full bg-white/[0.08] p-1">
        {options.map((o) => (
          <button
            key={o.lang}
            type="button"
            role="radio"
            aria-checked={lang === o.lang}
            aria-label={o.label}
            title={o.label}
            onClick={() => onLang(o.lang)}
            className={`press inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
              lang === o.lang ? 'bg-white/[0.18] text-[var(--ink)]' : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
            }`}
          >
            <span className="block h-3 w-[18px] overflow-hidden rounded-[2px] ring-1 ring-white/20">{flags[o.lang]}</span>
            {o.lang.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
