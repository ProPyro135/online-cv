import type { Lang } from '../i18n';
import { flags } from './ResumeDownload';

/** EN / ID switch for the whole site, in the nav. */
export default function LangSwitch({ lang, onLang, label }: { lang: Lang; onLang: (l: Lang) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="ml-2 inline-flex rounded-full bg-white/[0.08] p-0.5">
      {(['en', 'id'] as const).map((l) => (
        <button
          key={l}
          type="button"
          role="radio"
          aria-checked={lang === l}
          aria-label={l === 'en' ? 'English' : 'Bahasa Indonesia'}
          onClick={() => onLang(l)}
          className={`press inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors ${
            lang === l ? 'bg-white/[0.18] text-[var(--ink)]' : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
          }`}
        >
          <span className="hidden h-2.5 w-[15px] overflow-hidden min-[400px]:block rounded-[2px] ring-1 ring-white/20">{flags[l]}</span>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
