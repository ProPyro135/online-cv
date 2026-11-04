import Reveal from './Reveal';

const categories = [
  { title: 'Languages', skills: ['TypeScript', 'Python', 'C', 'C++', 'C#', 'PHP', 'Dart'] },
  { title: 'Frameworks', skills: ['Angular', 'React', 'Next.js', 'Ionic', 'Flutter', '.NET', 'ASP.NET Core'] },
  { title: 'Database & Cloud', skills: ['PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Supabase', 'AWS (EC2, RDS, Lambda, S3)', 'Docker'] },
  { title: 'Systems & Methodology', skills: ['Linux', 'DNS', 'Apache', 'SSL/TLS', 'REST API', 'Agile', 'RUP'] },
];

const spokenLanguages = [
  { name: 'Indonesian', level: 'Native' },
  { name: 'English', level: 'Fluent · IELTS 6.5' },
  { name: 'Malay', level: 'Fluent' },
  { name: 'German', level: 'Upper Intermediate · B2' },
];

export default function SkillsSection() {
  return (
    <>
      <Reveal className="mb-12 md:mb-16">
        <h2 className="text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.07] tracking-[-0.025em]">Skills.</h2>
        <p className="mt-4 max-w-2xl text-[19px] leading-[1.42] text-[var(--ink-2)]">The tools behind the projects above.</p>
      </Reveal>

      <dl>
        {categories.map((c) => (
          <Reveal key={c.title} className="grid gap-2 border-t border-[var(--line)] py-6 md:grid-cols-[220px_1fr] md:gap-10">
            <dt className="text-[15px] leading-[1.6] text-[var(--ink-2)]">{c.title}</dt>
            <dd className="text-[19px] leading-[1.45] tracking-[-0.01em]">{c.skills.join(', ')}</dd>
          </Reveal>
        ))}
      </dl>

      <Reveal className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {spokenLanguages.map((l) => (
          <div key={l.name} className="rounded-[22px] bg-[var(--tile)] p-6">
            <p className="text-[21px] font-semibold tracking-[-0.015em]">{l.name}</p>
            <p className="mt-1 text-[15px] text-[var(--ink-2)]">{l.level}</p>
          </div>
        ))}
      </Reveal>
    </>
  );
}
