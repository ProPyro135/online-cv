import { Mail, Phone, Linkedin, Menu, X, MousePointer2, Github, ChevronRight } from 'lucide-react';
import { MotionConfig } from 'motion/react';
import { useState, useEffect } from 'react';
import Backdrop from './components/Backdrop';
import ProfilePhoto from './components/ProfilePhoto';
import Reveal from './components/Reveal';
import SkillsSection from './components/SkillsSection';
import TechChips from './components/TechChips';
import { toggleSwarmBuild } from './swarmBuild';
import devmatchTeam from '../imports/devmatch-team.jpg';
import devmatchStage from '../imports/devmatch-stage.jpg';
import devmatchSelfie from '../imports/devmatch-selfie.jpg';
import ResumeDownload, { type Lang } from './components/ResumeDownload';

function SectionHead({ title, lede }: { title: string; lede?: string }) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <h2 className="text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.07] tracking-[-0.025em] text-[var(--ink)]">{title}</h2>
      {lede && <p className="mt-4 max-w-2xl text-[19px] leading-[1.42] text-[var(--ink-2)]">{lede}</p>}
    </Reveal>
  );
}

/** Résumé row: when/where on the left, what on the right. Stacks on phones. */
function Row({ when, where, children }: { when: string; where?: string; children: React.ReactNode }) {
  return (
    <Reveal className="grid gap-2 border-t border-[var(--line)] py-8 md:grid-cols-[220px_1fr] md:gap-10">
      <div className="text-[15px] leading-[1.45] text-[var(--ink-2)]">
        <p>{when}</p>
        {where && <p>{where}</p>}
      </div>
      <div>{children}</div>
    </Reveal>
  );
}

const navigation = [
  { name: 'About', href: '#about' },
  { name: 'Education', href: '#education' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' },
];

const projects = [
  {
    title: 'Ivision Chatbot',
    accent: '#30d158',
    subtitle: 'WhatsApp chatbot that answers from each business’s own catalogue and prices.',
    date: '2026 – Present',
    tech: ['TypeScript', 'Next.js', 'Fastify', 'PostgreSQL', 'Redis', 'Supabase', 'Docker', 'WhatsApp'],
    points: ['Multi-tenant, isolated with PostgreSQL row-level security', 'Encrypted credentials (AES-256-GCM), HMAC-verified messages'],
    repo: 'ProPyro135/Ivision-Chatbot',
  },
  {
    title: 'One Screener',
    accent: '#ffd60a',
    subtitle: 'Screens IDX stocks, forex and gold against your own criteria.',
    date: '2026 – Present',
    tech: ['Python', 'Streamlit'],
    points: ['Historical market data with integrity checks'],
  },
  {
    title: 'Propertus',
    accent: '#2997ff',
    subtitle: 'Property management platform with four role-based dashboards.',
    date: 'Oct 2025',
    tech: ['React', 'TypeScript', '.NET', 'MySQL', 'AWS', 'Stripe', 'Vercel'],
    points: ['Stripe Connect rent payments and payouts', 'JWT + 2FA, deployed on AWS'],
    repo: 'sqd2/Property-Management-System-AWS',
  },
  {
    title: 'Geofence Patrol Verification',
    accent: '#ff9f0a',
    subtitle: 'Final Year Project: a GPS app that proves guards walked their route.',
    date: 'Jan 2026',
    tech: ['Ionic', 'Angular', 'Capacitor', 'Supabase'],
    points: ['Hash-verified, tamper-proof patrol reports', 'Offline-first with live monitoring'],
    repo: 'ProPyro135/GSM',
  },
  {
    title: 'Orb',
    accent: '#bf5af2',
    subtitle: 'A 3D globe you steer with hand gestures.',
    date: '2026',
    tech: ['TypeScript', 'Three.js', 'MediaPipe', 'Vite'],
    points: ['Webcam, Ultraleap or mouse, with automatic fallback'],
    repo: 'ProPyro135/Ivision-3d-Hand-track',
  },
];

const highlights = [
  { value: '1st', label: 'DEVMatch Hackathon 2024' },
  { value: '5', label: 'Projects built' },
  { value: '3.03', label: 'CGPA, dual degree UK × MY' },
  { value: '4', label: 'Spoken languages' },
];

const contactLinks = [
  { href: 'mailto:dalfeusxiesi@gmail.com', icon: Mail, label: 'Email', value: 'dalfeusxiesi@gmail.com' },
  { href: 'tel:+628811232486', icon: Phone, label: 'Phone', value: '+62 881 1232 486' },
  { href: 'https://www.linkedin.com/in/alfeus-xiesi-delroy', icon: Linkedin, label: 'LinkedIn', value: 'alfeus-xiesi-delroy', external: true },
];

const btnSecondary =
  'press inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-5 py-2.5 text-[15px] text-[var(--ink)] hover:bg-white/[0.14]';
const link = 'inline-flex items-center gap-0.5 text-[var(--link)] hover:underline underline-offset-4';

export default function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const onScroll = () => {
      const current = navigation
        .map((n) => n.href.slice(1))
        .find((id) => {
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
            <button onClick={() => go('#about')} className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--ink)]">
              Alfeus Xiesi Delroy
            </button>

            <div className="flex items-center gap-1">
              <div className="hidden items-center md:flex">
                {navigation.slice(1).map((item) => (
                  <button
                    key={item.name}
                    onClick={() => go(item.href)}
                    className={`px-3 py-1 text-[13px] transition-colors ${
                      activeSection === item.href.slice(1) ? 'text-[var(--ink)]' : 'text-[var(--ink-2)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsMobileNavOpen(false);
                  toggleSwarmBuild(setIsBuilding);
                }}
                className="press motion-reduce:hidden ml-2 inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] px-3 py-1 text-[13px] text-[var(--ink)] hover:bg-white/[0.14]"
                aria-label={isBuilding ? 'Stop the build animation' : 'Replay the build animation'}
              >
                {isBuilding ? <X className="h-3.5 w-3.5" /> : <MousePointer2 className="h-3.5 w-3.5" />}
                {isBuilding ? 'Stop' : 'Replay build'}
              </button>

              <button
                type="button"
                onClick={() => setIsMobileNavOpen((o) => !o)}
                className="p-2 text-[var(--ink-2)] md:hidden"
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileNavOpen}
              >
                {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {isMobileNavOpen && (
            <div className="border-t border-[var(--line)] px-4 pb-3 md:hidden">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => go(item.href)}
                  className={`block w-full border-b border-[var(--line)] py-3 text-left text-[17px] last:border-0 ${
                    activeSection === item.href.slice(1) ? 'text-[var(--ink)]' : 'text-[var(--ink-2)]'
                  }`}
                >
                  {item.name}
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
                <p className="text-[19px] font-medium text-[var(--ink-2)]">Computer Science Graduate · Full Stack Developer</p>
                <h1 className="mt-3 text-[clamp(3rem,9vw,5.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[var(--ink)]">
                  Alfeus Xiesi Delroy
                </h1>
                <p className="mt-6 text-[21px] leading-[1.38] tracking-[-0.01em] text-[var(--ink-2)]">
                  I build <span className="text-[var(--ink)]">offline-first mobile apps</span> and{' '}
                  <span className="text-[var(--ink)]">full-stack platforms</span>.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <ResumeDownload lang={lang} onLang={setLang} />
                  <a href="mailto:dalfeusxiesi@gmail.com" className={btnSecondary}>
                    <Mail className="h-4 w-4" />
                    Email me
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

            <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-[22px] border border-[var(--line)] bg-[var(--line)] md:grid-cols-4">
              {highlights.map((h) => (
                <div key={h.label} className="bg-[rgba(10,10,11,0.93)] px-5 py-5 md:px-6">
                  <dd className="text-[28px] font-semibold leading-none tracking-[-0.025em] text-[var(--ink)]">{h.value}</dd>
                  <dt className="mt-2 text-[15px] leading-[1.35] text-[var(--ink-2)]">{h.label}</dt>
                </div>
              ))}
            </dl>
          </section>

          <section id="education" className="scroll-mt-12 py-24 md:py-32">
            <SectionHead title="Education." lede="A dual degree between Malaysia and the United Kingdom." />
            <Row when="Mar 2023 – Feb 2026" where="Kuala Lumpur, Malaysia">
              <h3 className="text-[21px] font-semibold leading-[1.3] tracking-[-0.015em]">Asia Pacific University of Technology & Innovation</h3>
              <p className="mt-1 text-[17px] text-[var(--ink-2)]">BSc (Hons) Computer Science · Dual degree with De Montfort University, Leicester, UK</p>
              <dl className="mt-6 flex flex-wrap gap-x-12 gap-y-4">
                <div>
                  <dt className="text-[15px] text-[var(--ink-2)]">CGPA</dt>
                  <dd className="text-[28px] font-semibold tracking-[-0.02em]">3.03</dd>
                </div>
                <div>
                  <dt className="text-[15px] text-[var(--ink-2)]">Classification</dt>
                  <dd className="text-[28px] font-semibold tracking-[-0.02em]">Second Class Honours, First Division</dd>
                </div>
              </dl>
            </Row>
          </section>

          <section id="experience" className="scroll-mt-12 py-24 md:py-32">
            <SectionHead title="Experience." lede="Where the offline-first work started." />
            <Row when="Dec 2024 – May 2025" where="Internship">
              <h3 className="text-[21px] font-semibold leading-[1.3] tracking-[-0.015em]">Web Developer Intern</h3>
              <p className="mt-1 text-[17px] text-[var(--ink-2)]">PT Setrakarya Manunggal (Karyamas Plantation Group)</p>
              <ul className="mt-5 list-disc space-y-1.5 pl-5 text-[17px] leading-[1.47] marker:text-[var(--ink-3)]">
                <li>Trip Monitoring app for plantation vehicle logs</li>
                <li>Works offline, syncs automatically</li>
                <li>Backend for master data, tariffs and reports</li>
              </ul>
              <TechChips className="mt-5" items={['Angular', 'Ionic', 'SQLite', 'PHP', 'MySQL', 'REST API']} />
            </Row>

            <h3 className="mb-2 mt-20 text-[28px] font-semibold tracking-[-0.02em]">Awards</h3>
            <Row when="Sep 2024" where="Kuala Lumpur">
              <h4 className="text-[21px] font-semibold leading-[1.3] tracking-[-0.015em]">1st Place, DEVMatch Hackathon</h4>
              <p className="mt-1 text-[17px] text-[var(--ink-2)]">MasChain Tourism Track</p>
              <p className="mt-3 text-[17px] leading-[1.47]">Built the UI for DocTour, a blockchain medical tourism app.</p>
              {/* Proof: the winners' screen at the awards (opens full size) */}
              <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-[1.78fr_1fr_1fr] md:gap-3">
                {[
                  { src: devmatchTeam, alt: 'The DocTour team on stage under the “MasChain Tourism 1st – 1000 USD DocTour” winners screen', wide: true },
                  { src: devmatchStage, alt: 'Team photo beside the APUBCC banner after winning the MasChain Tourism track' },
                  { src: devmatchSelfie, alt: 'Selfie with the team in front of the DocTour winners screen' },
                ].map((ph) => (
                  <a
                    key={ph.src}
                    href={ph.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`press block overflow-hidden rounded-[18px] ${ph.wide ? 'col-span-2 aspect-[4/3] md:col-span-1 md:aspect-auto' : 'aspect-[3/4]'}`}
                  >
                    <img src={ph.src} alt={ph.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]" />
                  </a>
                ))}
              </div>
              <p className="mt-2 text-[13px] text-[var(--ink-3)]">Awards night, MasChain Tourism Track · tap a photo to view it full size</p>
            </Row>
            <Row when="Nov 2023" where="Kuala Lumpur">
              <h4 className="text-[21px] font-semibold leading-[1.3] tracking-[-0.015em]">2nd Place, APU Entrepreneurship</h4>
              <p className="mt-1 text-[17px] text-[var(--ink-2)]">Pitch Presenter & Concept Developer</p>
              <p className="mt-3 text-[17px] leading-[1.47]">Pitched a walking app that rewards distance travelled.</p>
            </Row>
          </section>

          <section id="projects" className="scroll-mt-12 py-24 md:py-32">
            <SectionHead title="Projects." lede="Things I've built and shipped, from client platforms to experiments." />
            <div className="grid gap-4 md:grid-cols-2 md:gap-5">
              {projects.map((p, i) => (
                <Reveal key={p.title} className={`h-full ${i === 0 ? 'md:col-span-2' : ''}`}>
                <article className="tile relative flex h-full flex-col overflow-hidden rounded-[28px] p-7 md:p-9" style={{ '--hue': p.accent } as React.CSSProperties}>
                  <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[var(--hue)] opacity-[0.16] blur-[70px]" />
                  <p className="relative flex items-center gap-2 text-[15px] text-[var(--ink-2)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--hue)]" />
                    {p.date}
                  </p>
                  <h3 className="relative mt-2 text-[28px] font-semibold leading-[1.14] tracking-[-0.02em]">{p.title}</h3>
                  <p className="mt-2 text-[17px] leading-[1.42] text-[var(--ink-2)]">{p.subtitle}</p>
                  <ul className="mt-4 space-y-1.5 text-[15px] leading-[1.45]">
                    {p.points.map((pt) => (
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
                        View on GitHub <ChevronRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </article>
                </Reveal>
              ))}
            </div>
          </section>

          <section id="skills" className="scroll-mt-12 py-24 md:py-32">
            <SkillsSection />
          </section>

          <section id="contact" className="scroll-mt-12 py-24 md:py-32">
            <SectionHead title="Let's talk." lede="Open to graduate and junior developer roles across frontend, backend, cloud and AI-powered systems." />
            <Reveal>
              <ResumeDownload lang={lang} onLang={setLang} />
              <div className="mt-12 grid gap-4 md:grid-cols-3">
                {contactLinks.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target={c.external ? '_blank' : undefined}
                    rel={c.external ? 'noopener noreferrer' : undefined}
                    className="tile press group rounded-[22px] p-6"
                  >
                    <c.icon className="h-5 w-5 text-[var(--ink-2)]" />
                    <p className="mt-4 text-[15px] text-[var(--ink-2)]">{c.label}</p>
                    <p className="mt-0.5 truncate text-[17px] text-[var(--ink)] group-hover:text-[var(--link)]">{c.value}</p>
                  </a>
                ))}
              </div>
            </Reveal>
          </section>
        </main>

        <footer className="relative mx-auto max-w-[1024px] border-t border-[var(--line)] px-4 py-8 text-[13px] text-[var(--ink-3)] md:px-6">
          © 2026 Alfeus Xiesi Delroy. Built with React, TypeScript and Motion.
        </footer>
      </div>
    </MotionConfig>
  );
}
