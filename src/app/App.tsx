import { Mail, Phone, Linkedin, Menu, X, MousePointer2, Github, ChevronRight } from 'lucide-react';
import { MotionConfig } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import Backdrop from './components/Backdrop';
import ProfilePhoto from './components/ProfilePhoto';
import Reveal from './components/Reveal';
import SkillsSection from './components/SkillsSection';
import TechChips from './components/TechChips';
import { toggleSwarmBuild } from './swarmBuild';
import devmatchTeam from '../imports/devmatch-team.webp';
import devmatchStage from '../imports/devmatch-stage.webp';
import devmatchSelfie from '../imports/devmatch-selfie.webp';
import ResumeDownload from './components/ResumeDownload';
import LangSwitch from './components/LangSwitch';
import { COPY, initialLang, type Lang } from './i18n';

function SectionHead({ title, lede }: { title: string; lede?: string }) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <h2 className="text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.07] tracking-[-0.025em] text-[var(--ink)]">{title}</h2>
      {lede && <p className="mt-4 max-w-2xl text-[19px] leading-[1.42] text-[var(--ink-2)]">{lede}</p>}
    </Reveal>
  );
}

/** Résumé row: when/where on the left, what on the right. Stacks on phones. */
function Row({ when, where, children, wide }: { when: string; where?: string; children: React.ReactNode; wide?: React.ReactNode }) {
  return (
    <Reveal className="grid gap-2 border-t border-[var(--line)] py-8 md:grid-cols-[220px_1fr] md:gap-x-10 md:gap-y-0">
      <div className="text-[15px] leading-[1.45] text-[var(--ink-2)]">
        <p>{when}</p>
        {where && <p>{where}</p>}
      </div>
      <div>{children}</div>
      {/* Full-width extra (e.g. a photo gallery) that shouldn't be squeezed into the right column */}
      {wide && <div className="md:col-span-2">{wide}</div>}
    </Reveal>
  );
}

const devmatchPhotos = [{ src: devmatchTeam, wide: true }, { src: devmatchStage }, { src: devmatchSelfie }];

/** Hackathon photos. Desktop: one row at full width, every photo uncropped and the same height
 *  (flex-grow = aspect ratio). Phones: the wide one on top, two portraits below. Tap opens a lightbox. */
function Gallery({ alts, caption }: { alts: string[]; caption: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open !== null) dialog.current?.showModal();
  }, [open]);
  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-2 md:mt-10 md:flex md:gap-3">
        {devmatchPhotos.map((ph, i) => (
          <a
            key={ph.src}
            href={ph.src}
            onClick={(e) => {
              e.preventDefault();
              setOpen(i);
            }}
            style={{ flex: `${ph.wide ? 4 / 3 : 3 / 4} 1 0` }}
            className={`press group relative block min-w-0 overflow-hidden rounded-[20px] shadow-[0_1px_2px_rgba(0,0,0,0.5),0_12px_32px_-8px_rgba(0,0,0,0.6)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-inset after:ring-white/10 ${
              ph.wide ? 'col-span-2 aspect-[4/3]' : 'aspect-[3/4]'
            }`}
          >
            <img
              src={ph.src}
              alt={alts[i]}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </a>
        ))}
      </div>
      <p className="mt-3 text-[13px] text-[var(--ink-3)]">{caption}</p>
      {open !== null && (
        <dialog
          ref={dialog}
          data-swarm-skip
          onClose={() => setOpen(null)}
          onClick={() => dialog.current?.close()}
          className="lightbox m-auto cursor-zoom-out bg-transparent p-0 outline-none"
        >
          <img src={devmatchPhotos[open].src} alt={alts[open]} className="max-h-[88vh] max-w-[92vw] rounded-[20px] shadow-[0_24px_80px_rgba(0,0,0,0.7)]" />
        </dialog>
      )}
    </>
  );
}

const navigation = ['about', 'education', 'experience', 'projects', 'skills', 'contact'] as const;

// Non-text project data; the words are in i18n.ts (same order).
const projects = [
  { title: 'Ivision Chatbot', accent: '#30d158', tech: ['TypeScript', 'Next.js', 'Fastify', 'PostgreSQL', 'Redis', 'Supabase', 'Docker', 'WhatsApp'], repo: 'ProPyro135/Ivision-Chatbot' },
  { title: 'One Screener', accent: '#ffd60a', tech: ['Python', 'Streamlit'] },
  { title: 'Propertus', accent: '#2997ff', tech: ['React', 'TypeScript', '.NET', 'MySQL', 'AWS', 'Stripe', 'Vercel'], repo: 'sqd2/Property-Management-System-AWS' },
  { title: 'Geofence Patrol Verification', accent: '#ff9f0a', tech: ['Ionic', 'Angular', 'Capacitor', 'Supabase'], repo: 'ProPyro135/GSM' },
  { title: 'Orb', accent: '#bf5af2', tech: ['TypeScript', 'Three.js', 'MediaPipe', 'Vite'], repo: 'ProPyro135/Ivision-3d-Hand-track' },
];


const contactLinks = [
  { href: 'mailto:dalfeusxiesi@gmail.com', icon: Mail, key: 'email', value: 'dalfeusxiesi@gmail.com' },
  { href: 'tel:+628811232486', icon: Phone, key: 'phone', value: '+62 881 1232 486' },
  { href: 'https://www.linkedin.com/in/alfeus-xiesi-delroy', icon: Linkedin, key: 'linkedin', value: 'alfeus-xiesi-delroy', external: true },
];

const btnSecondary =
  'press inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-5 py-2.5 text-[15px] text-[var(--ink)] hover:bg-white/[0.14]';
const link = 'inline-flex items-center gap-0.5 text-[var(--link)] hover:underline underline-offset-4';

export default function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  // Site language (EN/ID). The résumé picker follows it but can still be switched on its own.
  const [lang, setLang] = useState<Lang>(initialLang);
  const [resumeLang, setResumeLang] = useState<Lang>(lang);
  const c = COPY[lang];
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === 'id' ? 'Alfeus Xiesi Delroy | CV Online' : 'Alfeus Xiesi Delroy | Online CV';
    setResumeLang(lang);
    // Shareable link: ?lang=id
    const u = new URL(location.href);
    if (lang === 'en') u.searchParams.delete('lang');
    else u.searchParams.set('lang', lang);
    history.replaceState(null, '', u);
  }, [lang]);

  useEffect(() => {
    const onScroll = () => {
      const current = navigation.find((id) => {
          const r = document.getElementById(id)?.getBoundingClientRect();
          return r && r.top <= 120 && r.bottom >= 120;
        });
      if (current) setActiveSection(current);
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  // The cursor build is the page's entrance: play it once fonts have laid out, unless the visitor asked for less motion.
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Full movie on the first visit only; returning visitors get the page at once ("Replay build" is in the nav).
    try {
      if (localStorage.getItem('cv-seen-build')) return;
      localStorage.setItem('cv-seen-build', '1');
    } catch {
      /* storage blocked: just play it */
    }
    // The movie always starts at the top, not wherever the browser restored the scroll to.
    history.scrollRestoration = 'manual';
    scrollTo(0, 0);
    let cancelled = false;
    // Wait for fonts and the profile photo (slow on phones), but never more than 2.5s.
    const photo = document.querySelector<HTMLImageElement>('img[data-hero-photo]');
    const ready = Promise.all([document.fonts.ready, photo?.decode().catch(() => {})]);
    Promise.race([ready, new Promise((r) => setTimeout(r, 2500))]).then(() =>
      requestAnimationFrame(() => {
        if (!cancelled) toggleSwarmBuild(setIsBuilding);
      }),
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const go = (href: string) => {
    setIsMobileNavOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
        <Backdrop />
        {/* Translucent nav: content scrolls underneath it */}
        <nav data-swarm-skip className="glass fixed inset-x-0 top-0 z-50">
          <div className="mx-auto flex h-12 max-w-[1024px] items-center justify-between px-4 md:px-6">
            <button onClick={() => go('#about')} className="min-w-0 truncate whitespace-nowrap text-[15px] font-semibold tracking-[-0.01em] text-[var(--ink)]">
              Alfeus Xiesi Delroy
            </button>

            <div className="flex items-center gap-1">
              <div className="hidden items-center md:flex">
                {navigation.slice(1).map((id) => (
                  <button
                    key={id}
                    onClick={() => go(`#${id}`)}
                    className={`px-3 py-1 text-[13px] transition-colors ${
                      activeSection === id ? 'text-[var(--ink)]' : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {c.nav[id]}
                  </button>
                ))}
              </div>

              <LangSwitch
                lang={lang}
                onLang={(l) => {
                  // Text is about to change under the cursors: end the movie first.
                  if (isBuilding) toggleSwarmBuild(setIsBuilding);
                  setLang(l);
                }}
                label={c.siteLangAria}
              />

              <button
                type="button"
                onClick={() => {
                  setIsMobileNavOpen(false);
                  toggleSwarmBuild(setIsBuilding);
                }}
                className="press motion-reduce:hidden ml-2 inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] px-3 py-1 text-[13px] text-[var(--ink)] hover:bg-white/[0.14]"
                aria-label={isBuilding ? c.stopAria : c.replayAria}
              >
                {isBuilding ? <X className="h-3.5 w-3.5" /> : <MousePointer2 className="h-3.5 w-3.5" />}
                {/* Keyed element, not a bare text swap: Chrome's auto-translate replaces text nodes, and React
                    editing a replaced node crashed the whole page (blank screen) when the movie ended. */}
                <span key={`${isBuilding}-${lang}`} className="hidden sm:inline">{isBuilding ? c.stop : c.replay}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMobileNavOpen((o) => !o)}
                className="p-2 text-[var(--ink-2)] md:hidden"
                aria-label={c.menuAria}
                aria-expanded={isMobileNavOpen}
              >
                {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {isMobileNavOpen && (
            <div className="border-t border-[var(--line)] px-4 pb-3 md:hidden">
              {navigation.map((id) => (
                <button
                  key={id}
                  onClick={() => go(`#${id}`)}
                  className={`block w-full border-b border-[var(--line)] py-3 text-left text-[17px] last:border-0 ${
                    activeSection === id ? 'text-[var(--ink)]' : 'text-[var(--ink-2)]'
                  }`}
                >
                  {c.nav[id]}
                </button>
              ))}
            </div>
          )}
        </nav>

        <main className="relative mx-auto max-w-[1024px] px-4 md:px-6">
          {/* Hero — no entrance animation of its own: the cursor build is the entrance */}
          <section id="about" className="flex min-h-[100svh] flex-col justify-center pb-16 pt-24">
            <div className="flex flex-col-reverse gap-10 md:flex-row md:items-end md:justify-between">
              <div className="max-w-[620px]">
                <p className="text-[19px] font-medium text-[var(--ink-2)]">{c.role}</p>
                <h1 className="mt-3 text-[clamp(3rem,9vw,5.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[var(--ink)]">
                  Alfeus Xiesi Delroy
                </h1>
                <p className="mt-6 text-[21px] leading-[1.38] tracking-[-0.01em] text-[var(--ink-2)]">
                  {c.tagline[0]}
                  <span className="whitespace-nowrap text-[var(--ink)]">{c.tagline[1]}</span>
                  {c.tagline[2]}
                  <span className="whitespace-nowrap text-[var(--ink)]">{c.tagline[3]}</span>
                  {c.tagline[4]}
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <ResumeDownload lang={resumeLang} onLang={setResumeLang} c={c} />
                  <a href="mailto:dalfeusxiesi@gmail.com" className={btnSecondary}>
                    <Mail className="h-4 w-4" />
                    {c.emailMe}
                  </a>
                </div>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
                  <a href="https://www.linkedin.com/in/alfeus-xiesi-delroy" target="_blank" rel="noopener noreferrer" className={link}>
                    LinkedIn <ChevronRight className="h-4 w-4" />
                  </a>
                  <a href="https://github.com/ProPyro135" target="_blank" rel="noopener noreferrer" className={link}>
                    GitHub <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <ProfilePhoto />
            </div>

            <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--line)] shadow-[var(--lift)] md:grid-cols-4">
              {c.highlights.map((h) => (
                <div key={h.label} className="bg-[rgba(10,10,11,0.93)] px-5 py-5 md:px-6">
                  <dd className="text-[28px] font-semibold leading-none tracking-[-0.025em] text-[var(--ink)]">{h.value}</dd>
                  <dt className="mt-2 text-[15px] leading-[1.35] text-[var(--ink-2)]">{h.label}</dt>
                </div>
              ))}
            </dl>
          </section>

          <section id="education" className="scroll-mt-12 py-20 md:py-24">
            <SectionHead title={c.education.title} lede={c.education.lede} />
            <Row when={c.education.when} where={c.education.where}>
              <h3 className="text-[21px] font-semibold leading-[1.3] tracking-[-0.015em]">Asia Pacific University of Technology & Innovation</h3>
              <p className="mt-1 text-[17px] text-[var(--ink-2)]">{c.education.degree}</p>
              <dl className="mt-6 flex flex-wrap gap-x-12 gap-y-4">
                <div>
                  <dt className="text-[15px] text-[var(--ink-2)]">{c.education.gpa}</dt>
                  <dd className="text-[28px] font-semibold tracking-[-0.02em]">3.03</dd>
                </div>
                <div>
                  <dt className="text-[15px] text-[var(--ink-2)]">{c.education.classification}</dt>
                  <dd className="text-[28px] font-semibold tracking-[-0.02em]">Second Class Honours, First Division</dd>
                </div>
              </dl>
            </Row>
          </section>

          <section id="experience" className="scroll-mt-12 py-20 md:py-24">
            <SectionHead title={c.experience.title} lede={c.experience.lede} />
            <Row when={c.experience.when} where={c.experience.where}>
              <h3 className="text-[21px] font-semibold leading-[1.3] tracking-[-0.015em]">{c.experience.role}</h3>
              <p className="mt-1 text-[17px] text-[var(--ink-2)]">PT Setrakarya Manunggal (Karyamas Plantation Group)</p>
              <ul className="mt-5 list-disc space-y-1.5 pl-5 text-[17px] leading-[1.47] marker:text-[var(--ink-3)]">
                {c.experience.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
              <TechChips className="mt-5" items={['Angular', 'Ionic', 'SQLite', 'PHP', 'MySQL', 'REST API']} />
            </Row>

            <h3 className="mb-2 mt-16 text-[28px] font-semibold tracking-[-0.02em]">{c.awards.title}</h3>
            <Row when="Sep 2024" where="Kuala Lumpur" wide={<Gallery alts={c.awards.alts} caption={c.awards.caption} />}>
              <h4 className="text-[21px] font-semibold leading-[1.3] tracking-[-0.015em]">{c.awards.first}</h4>
              <p className="mt-1 text-[17px] text-[var(--ink-2)]">MasChain Tourism Track</p>
              <p className="mt-3 text-[17px] leading-[1.47]">{c.awards.firstText}</p>
            </Row>
            <Row when="Nov 2023" where="Kuala Lumpur">
              <h4 className="text-[21px] font-semibold leading-[1.3] tracking-[-0.015em]">{c.awards.second}</h4>
              <p className="mt-1 text-[17px] text-[var(--ink-2)]">Pitch Presenter & Concept Developer</p>
              <p className="mt-3 text-[17px] leading-[1.47]">{c.awards.secondText}</p>
            </Row>
          </section>

          <section id="projects" className="scroll-mt-12 py-20 md:py-24">
            <SectionHead title={c.projects.title} lede={c.projects.lede} />
            <div className="grid gap-4 md:grid-cols-2 md:gap-5">
              {projects.map((p, i) => {
                const t = c.projects.items[i];
                return (
                <Reveal key={p.title} className={`h-full ${i === 0 ? 'md:col-span-2' : ''}`}>
                <article className="tile relative flex h-full flex-col overflow-hidden rounded-[28px] p-7 md:p-9" style={{ '--hue': p.accent } as React.CSSProperties}>
                  <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[var(--hue)] opacity-[0.16] blur-[70px]" />
                  <p className="relative flex items-center gap-2 text-[15px] text-[var(--ink-2)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--hue)]" />
                    {t.date}
                  </p>
                  <h3 className="relative mt-2 text-[28px] font-semibold leading-[1.14] tracking-[-0.02em]">{p.title}</h3>
                  <p className="mt-2 text-[17px] leading-[1.42] text-[var(--ink-2)]">{t.subtitle}</p>
                  <ul className="mt-4 space-y-1.5 text-[15px] leading-[1.45]">
                    {t.points.map((pt) => (
                      <li key={pt} className="flex gap-2">
                        <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--hue)]" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <TechChips items={p.tech} />
                    {p.repo && (
                      <a href={`https://github.com/${p.repo}`} target="_blank" rel="noopener noreferrer" className={`${link} mt-3 text-[15px]`}>
                        <Github className="mr-1.5 h-4 w-4" />
                        {c.projects.github} <ChevronRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </article>
                </Reveal>
                );
              })}
            </div>
          </section>

          <section id="skills" className="scroll-mt-12 py-20 md:py-24">
            <SkillsSection c={c.skills} />
          </section>

          <section id="contact" className="scroll-mt-12 py-20 md:py-24">
            <SectionHead title={c.contact.title} lede={c.contact.lede} />
            <Reveal>
              <ResumeDownload lang={resumeLang} onLang={setResumeLang} c={c} />
              <div className="mt-12 grid gap-4 md:grid-cols-3">
                {contactLinks.map((l) => (
                  <a
                    key={l.key}
                    href={l.href}
                    target={l.external ? '_blank' : undefined}
                    rel={l.external ? 'noopener noreferrer' : undefined}
                    className="tile press group rounded-[24px] p-6"
                  >
                    <l.icon className="h-5 w-5 text-[var(--ink-2)]" />
                    <p className="mt-4 text-[15px] text-[var(--ink-2)]">{l.key === 'linkedin' ? 'LinkedIn' : c.contact[l.key as 'email' | 'phone']}</p>
                    <p className="mt-0.5 truncate text-[17px] text-[var(--ink)] group-hover:text-[var(--link)]">{l.value}</p>
                  </a>
                ))}
              </div>
            </Reveal>
          </section>
        </main>

        <footer className="relative mx-auto max-w-[1024px] border-t border-[var(--line)] px-4 py-8 text-[13px] text-[var(--ink-3)] md:px-6">
          {c.footer}
        </footer>
      </div>
    </MotionConfig>
  );
}
