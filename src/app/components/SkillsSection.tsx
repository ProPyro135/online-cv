import Reveal from './Reveal';
import TechChips from './TechChips';

const categories = [
  { title: 'Languages', skills: ['TypeScript', 'Python', 'C', 'C++', 'C#', 'PHP', 'Dart'] },
  { title: 'Frameworks', skills: ['Angular', 'React', 'Next.js', 'Ionic', 'Flutter', '.NET'] },
  { title: 'Data & Cloud', skills: ['PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Supabase', 'AWS', 'Docker'] },
  { title: 'Systems & Practice', skills: ['Linux', 'Apache', 'DNS', 'SSL/TLS', 'REST API', 'Agile', 'RUP'] },
];

// Simplified flags (SVG, since Windows shows flag emoji as letters).
const flags: Record<string, React.ReactNode> = {
  Indonesian: (
    <svg viewBox="0 0 3 2" preserveAspectRatio="xMidYMid slice">
      <path d="M0 0h3v1H0z" fill="#CE1126" />
      <path d="M0 1h3v1H0z" fill="#fff" />
    </svg>
  ),
  English: (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice">
      <path d="M0 0h60v30H0z" fill="#012169" />
      <path d="M0 0l60 30M60 0L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0l60 30M60 0L0 30" stroke="#C8102E" strokeWidth="2" />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  ),
  Malay: (
    <svg viewBox="0 0 28 14" preserveAspectRatio="xMidYMid slice">
      <path d="M0 0h28v14H0z" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((y) => (
        <path key={y} d={`M0 ${y}h28v1H0z`} fill="#CC0001" />
      ))}
      <path d="M0 0h14v8H0z" fill="#010066" />
      <circle cx="5.2" cy="4" r="2.6" fill="#FC0" />
      <circle cx="6" cy="4" r="2.1" fill="#010066" />
      <path d="M9.6 2.3l.45 1.2 1.25-.2-.8 1 .8 1-1.25-.2-.45 1.2-.45-1.2-1.25.2.8-1-.8-1 1.25.2z" fill="#FC0" />
    </svg>
  ),
  German: (
    <svg viewBox="0 0 5 3" preserveAspectRatio="xMidYMid slice">
      <path d="M0 0h5v1H0z" fill="#000" />
      <path d="M0 1h5v1H0z" fill="#D00" />
      <path d="M0 2h5v1H0z" fill="#FFCE00" />
    </svg>
  ),
};

const spokenLanguages = [
  { name: 'Indonesian', level: 'Native' },
  { name: 'English', level: 'Fluent · IELTS 6.5' },
  { name: 'Malay', level: 'Fluent' },
  { name: 'German', level: 'B2' },
];

export default function SkillsSection() {
  return (
    <>
      <Reveal className="mb-12 md:mb-16">
        <h2 className="text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.07] tracking-[-0.025em]">Skills.</h2>
        <p className="mt-4 max-w-2xl text-[19px] leading-[1.42] text-[var(--ink-2)]">The tools behind the projects above.</p>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {categories.map((c) => (
          <Reveal key={c.title} className="tile rounded-[24px] p-6">
            <h3 className="text-[17px] font-semibold">{c.title}</h3>
            <TechChips className="mt-4" items={c.skills} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-4 grid grid-cols-2 gap-4 md:mt-5 md:grid-cols-4 md:gap-5">
        {spokenLanguages.map((l) => (
          <div key={l.name} className="tile flex items-center gap-4 rounded-[20px] p-5">
            <span className="block h-7 w-10 shrink-0 overflow-hidden rounded-[5px] ring-1 ring-white/15 [&>svg]:h-full [&>svg]:w-full">
              {flags[l.name]}
            </span>
            <div className="min-w-0">
              <p className="text-[17px] font-semibold tracking-[-0.01em]">{l.name}</p>
              <p className="text-[14px] text-[var(--ink-2)]">{l.level}</p>
            </div>
          </div>
        ))}
      </Reveal>
    </>
  );
}
