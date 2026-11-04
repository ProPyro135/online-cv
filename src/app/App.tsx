import { Award, Briefcase, GraduationCap, Code, ArrowUp, Mail, Phone, Linkedin, FileDown, ChevronDown, Menu, X, MousePointer2, Github } from 'lucide-react';
import { motion, useScroll, useTransform, useInView, useSpring } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import ProfilePhoto from './components/ProfilePhoto';
import SkillsSection from './components/SkillsSection';
import { toggleSwarmBuild } from './swarmBuild';
import { useIsMobile } from './components/ui/use-mobile';
import resumePdf from '../imports/Alfeus_Xiesi_Delroy_-_Resume.pdf';

function FullScreenSection({ children, id }: { children: React.ReactNode; id?: string }) {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.35,
  });
  const opacity = useTransform(smoothProgress, [0, 0.18, 0.82, 1], [0, 1, 1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.94, 1, 1, 0.97]);
  const y = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [72, 0, 0, -72]);
  const railScale = useTransform(smoothProgress, [0.18, 0.78], [0, 1]);
  const railOpacity = useTransform(smoothProgress, [0.08, 0.22, 0.82, 0.95], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={ref}
      id={id}
      className="relative min-h-screen flex items-start justify-center pt-28 md:pt-32 pb-16 md:pb-20 scroll-mt-24 md:scroll-mt-28"
      style={isMobile ? { opacity: 1, scale: 1, y: 0 } : { opacity, scale, y }}
    >
      <motion.div
        className="pointer-events-none absolute left-5 top-36 bottom-24 hidden w-px overflow-hidden bg-white/10 md:block"
        style={{ opacity: railOpacity }}
      >
        <motion.div
          className="h-full w-full origin-top bg-amber-500"
          style={{ scaleY: railScale }}
        />
      </motion.div>
      {children}
    </motion.section>
  );
}

function AnimatedContent({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
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
    subtitle: 'WhatsApp chatbot platform for businesses',
    date: '2026 – Present',
    tech: ['TypeScript', 'Next.js', 'Fastify', 'PostgreSQL', 'Redis', 'Supabase', 'Docker', 'WhatsApp Business API'],
    points: [
      'Automated WhatsApp chatbot connected to each business’s product catalogue and price list',
      'Multi-tenant architecture with PostgreSQL Row-Level Security (RLS) isolating each business’s data',
      'Credential encryption (AES-256-GCM) and HMAC verification of incoming messages',
    ],
    repo: 'ProPyro135/Ivision-Chatbot',
  },
  {
    title: 'One Screener',
    subtitle: 'Web screener for stocks, forex & gold',
    date: '2026 – Present',
    tech: ['Python', 'Streamlit'],
    points: [
      'Screens Indonesia Stock Exchange (IDX) stocks, forex and gold against user-defined criteria, replacing one-by-one manual checks',
      'Manages historical market data with integrity checks and only displays metrics that have been measured',
    ],
  },
  {
    title: 'Propertus',
    subtitle: 'Cloud-based property management system',
    date: 'Oct 2025',
    tech: ['React', 'TypeScript', 'ASP.NET Core 8', 'MySQL', 'AWS', 'Stripe', 'Vercel'],
    points: [
      'Four role-based dashboards covering assets, payments and maintenance',
      'Stripe and Stripe Connect integration for rent payments and automatic fund distribution',
      'JWT token authentication and two-factor verification (2FA/TOTP)',
      'Deployed on AWS (EC2, RDS, Lambda, S3), including cloud storage and automatic thumbnail generation',
    ],
    repo: 'sqd2/Property-Management-System-AWS',
  },
  {
    title: 'Geofence Security Patrol Verification System',
    subtitle: 'Final Year Project',
    date: 'Jan 2026',
    tech: ['Ionic', 'Angular', 'Capacitor', 'Supabase'],
    points: [
      'GPS geofencing mobile app validating guards’ patrol routes and dwell time at each checkpoint',
      'Hash-based verification to prevent tampering and keep patrol reports trustworthy',
      'Offline-first architecture with automatic sync, real-time monitoring and report export',
      'Managed with the RUP methodology and validated through User Acceptance Testing (UAT)',
    ],
    repo: 'ProPyro135/GSM',
  },
  {
    title: 'Orb',
    subtitle: '3D globe controlled by hand gestures',
    date: '2026',
    tech: ['TypeScript', 'Three.js', 'MediaPipe', 'Vite'],
    points: [
      'Web app that controls a 3D globe in real time through camera-based hand tracking',
      'Supports webcam, Ultraleap sensor and mouse, with automatic fallback when a device fails',
    ],
    repo: 'ProPyro135/Ivision-3d-Hand-track',
  },
];

const contactLinks = [
  { href: "mailto:dalfeusxiesi@gmail.com", icon: Mail, label: "Email", value: "dalfeusxiesi@gmail.com" },
  { href: "tel:+628811232486", icon: Phone, label: "Phone", value: "+62 881 1232 486" },
  { href: "https://www.linkedin.com/in/alfeus-xiesi-delroy", icon: Linkedin, label: "LinkedIn", value: "alfeus-xiesi-delroy", external: true },
];

export default function App() {
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.3,
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const heroRef = useRef(null);

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(heroScrollProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 0.7], [1, 0.8]);
  const heroY = useTransform(heroScrollProgress, [0, 0.7], [0, -200]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);

      // Track active section
      const sections = ['about', 'education', 'experience', 'projects', 'skills', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    setIsMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href: string) => {
    setIsMobileNavOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative dark min-h-screen bg-gradient-to-b from-[#0d0d0d] via-[#1a1a1a] to-[#1a1a1a]">
      {/* Scroll progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 origin-left z-[60]"
        style={{ scaleX: smoothScrollProgress }}
      />

      {/* Sticky Navigation */}
      <motion.nav
        data-swarm-skip
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0d0d0d]/90 border-b border-white/5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={scrollToTop}
              className="text-lg font-medium text-white/90 hover:text-amber-500 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              AXD
            </motion.button>

            <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="relative px-4 py-2 text-sm transition-colors"
                >
                  <span className={`relative z-10 ${
                    activeSection === item.href.slice(1)
                      ? 'text-amber-500'
                      : 'text-white/60 hover:text-white/90'
                  } transition-colors`}>
                    {item.name}
                  </span>
                  {activeSection === item.href.slice(1) && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-0 bg-amber-500/10 rounded-md border border-amber-500/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => { setIsMobileNavOpen(false); toggleSwarmBuild(setIsBuilding); }}
              className="motion-reduce:hidden flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-500 transition-colors hover:border-amber-500/40"
              aria-label={isBuilding ? 'Stop the build animation' : 'Watch this view get built by animated cursors'}
            >
              {isBuilding ? <X className="h-4 w-4" /> : <MousePointer2 className="h-4 w-4" />}
              <span className="hidden sm:inline">{isBuilding ? 'Stop' : 'Watch it build'}</span>
            </button>

            <motion.button
              type="button"
              onClick={() => setIsMobileNavOpen((open) => !open)}
              className="md:hidden p-2 rounded-lg border border-white/10 bg-white/5 text-white/80"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileNavOpen}
              whileTap={{ scale: 0.94 }}
            >
              {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
            </div>
          </div>
        </div>
        {isMobileNavOpen && (
          <motion.div
            className="md:hidden border-t border-white/5 bg-[#0d0d0d]/95 px-4 pb-4"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-2 pt-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`rounded-lg border px-3 py-3 text-sm transition-colors ${
                    activeSection === item.href.slice(1)
                      ? 'border-amber-500/30 bg-amber-500/10 text-amber-500'
                      : 'border-white/10 bg-white/5 text-white/70'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.nav>

      <div className="relative">
        {/* Hero Section with Dramatic Scroll Animation */}
        <motion.section
          ref={heroRef}
          id="about"
          className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
          style={isMobile ? { opacity: 1, scale: 1, y: 0 } : {
            opacity: heroOpacity,
            scale: heroScale,
            y: heroY,
          }}
        >
          {/* Animated background elements */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 30% 50%, rgba(245, 158, 11, 0.08) 0%, transparent 50%)',
            }}
          />

          <div className="mx-auto max-w-6xl px-6 w-full relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-16">
              {/* Left side - Text */}
              <motion.div
                className="flex-1 max-w-2xl"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.h1
                    className="mb-6 text-6xl md:text-8xl font-bold text-white leading-tight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.7 }}
                  >
                    Alfeus Xiesi
                    <br />
                    <motion.span
                      className="text-amber-500"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1, delay: 0.9 }}
                    >
                      Delroy
                    </motion.span>
                  </motion.h1>
                </motion.div>

                <motion.p
                  className="mb-8 text-xl md:text-2xl text-white/60 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.1 }}
                >
                  Computer Science Graduate
                  <br />
                  <span className="text-white/90">Full Stack Developer</span>
                </motion.p>

                <motion.p
                  className="mb-8 max-w-xl text-base leading-relaxed text-white/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                >
                  I build offline-first mobile apps and full-stack platforms, from plantation vehicle logging to GPS-verified security patrols. Interested in full-stack development, AWS cloud deployment and applied AI.
                </motion.p>

                <motion.div
                  className="flex flex-wrap gap-3 mb-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.3 }}
                >
                  {['TypeScript', 'React', 'Angular', 'AWS'].map((tech, i) => (
                    <motion.span
                      key={tech}
                      className="px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm text-amber-500 backdrop-blur-sm"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.4 + i * 0.1, ease: "backOut" }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </motion.div>

                <motion.div
                  className="flex flex-col gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.6 }}
                >
                  <div className="flex flex-wrap gap-3">
                    <motion.a
                      href={resumePdf}
                      download="Alfeus_Xiesi_Delroy_Resume.pdf"
                      className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-[#0d0d0d] shadow-lg shadow-amber-500/20 transition-colors hover:bg-amber-400"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.7 }}
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <FileDown className="h-4 w-4 flex-shrink-0" />
                      Download Resume
                    </motion.a>
                    {contactLinks.map((item, i) => (
                      <motion.a
                        key={item.label}
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-2 px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white/70 hover:text-amber-500 hover:border-amber-500/30 transition-all text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.8 + i * 0.1 }}
                        whileHover={{ scale: 1.03, y: -2 }}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {item.label}
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Right side - Photo */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProfilePhoto />

                {/* Floating decorative elements */}
                <motion.div
                  className="absolute -z-10 top-10 -right-10 hidden w-72 h-72 bg-amber-500/15 rounded-full blur-3xl md:block"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.button
            type="button"
            onClick={() => scrollToSection('#education')}
            aria-label="Scroll to education section"
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2, repeat: Infinity, repeatType: "reverse" }}
            whileHover={{ scale: 1.06, y: 4 }}
            whileTap={{ scale: 0.96 }}
          >
            <div className="flex flex-col items-center gap-2 text-white/40">
              <span className="text-xs uppercase tracking-wider">Scroll</span>
              <motion.div
                className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.div
                  className="w-1 h-2 bg-amber-500/70 rounded-full"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
              <motion.div
                animate={{ y: [0, 5, 0], opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="h-4 w-4 text-amber-500/80" />
              </motion.div>
            </div>
          </motion.button>
        </motion.section>

        {/* Main Content Container */}
        <div className="mx-auto max-w-6xl px-6 pb-20 space-y-32">

          {/* Education Section */}
          <FullScreenSection id="education">
            <div className="mx-auto max-w-6xl px-6 w-full">
              <AnimatedContent>
                <div className="mb-16">
                  <motion.div
                    className="flex items-center gap-4 mb-4"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <GraduationCap className="h-8 w-8 text-amber-500" />
                    <h2 className="text-5xl md:text-6xl font-bold text-white">Education</h2>
                  </motion.div>
                  <motion.div
                    className="h-1 w-32 bg-amber-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: 128 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
              </AnimatedContent>

              <AnimatedContent delay={0.2}>
                <motion.div
                  className="rounded-2xl border border-white/10 bg-[#1f1f1f]/80 backdrop-blur-sm p-10 hover:border-amber-500/30 transition-all duration-500 group"
                  whileHover={{
                    y: -8,
                    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.3)"
                  }}
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 mb-6">
                    <div>
                      <motion.h3
                        className="text-2xl font-semibold text-white mb-3 group-hover:text-amber-500 transition-colors"
                      >
                        Asia Pacific University of Technology & Innovation (APU)
                      </motion.h3>
                      <p className="text-lg text-white/60">Bachelor of Science (Honours) in Computer Science</p>
                      <p className="mt-1 text-white/50">Dual degree with De Montfort University (DMU), Leicester, UK</p>
                    </div>
                    <div className="text-sm text-white/50 md:text-right md:whitespace-nowrap">
                      <p>March 2023 – February 2026</p>
                      <p>Kuala Lumpur, Malaysia</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <motion.div
                      className="inline-block px-6 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="text-amber-500 font-semibold text-lg">CGPA: 3.03</span>
                    </motion.div>
                    <div className="inline-block px-6 py-3 rounded-lg border border-white/10 bg-white/5">
                      <span className="text-white/70 text-lg">Second Class Honours, First Division</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatedContent>
            </div>
          </FullScreenSection>

          {/* Experience Section */}
          <FullScreenSection id="experience">
            <div className="mx-auto max-w-6xl px-6 w-full">
              <AnimatedContent>
                <div className="mb-16">
                  <motion.div
                    className="flex items-center gap-4 mb-4"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Briefcase className="h-8 w-8 text-amber-500" />
                    <h2 className="text-5xl md:text-6xl font-bold text-white">Experience</h2>
                  </motion.div>
                  <motion.div
                    className="h-1 w-32 bg-amber-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: 128 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
              </AnimatedContent>

              <div className="space-y-8">
                <AnimatedContent delay={0.2}>
                  <motion.div
                    className="rounded-2xl border border-white/10 bg-[#1f1f1f]/80 backdrop-blur-sm p-6 md:p-10 hover:border-amber-500/30 transition-all duration-500 group"
                    whileHover={{
                      y: -8,
                      boxShadow: "0 30px 60px rgba(0, 0, 0, 0.3)"
                    }}
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-3 md:gap-6 mb-6 md:mb-8">
                      <div className="min-w-0">
                        <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 md:mb-3 group-hover:text-amber-500 transition-colors">Web Developer Intern</h3>
                        <p className="text-base md:text-lg text-amber-500">PT Setrakarya Manunggal (Karyamas Plantation Group)</p>
                      </div>
                      <span className="text-sm text-white/50 md:whitespace-nowrap">December 2024 – May 2025</span>
                    </div>

                    <ul className="space-y-3 md:space-y-4 text-white/60">
                      {[
                        'Developed a Trip Monitoring mobile app for logging vehicle crossings as the internship project',
                        'Designed an offline-first architecture, from data entry to reporting, that keeps working without internet and syncs automatically',
                        'Built the backend for master data management, tariff configuration and operational monitoring reports',
                        'Tech: Angular, Ionic, SQLite, PHP, MySQL, REST API'
                      ].map((item, index) => (
                        <motion.li
                          key={index}
                          className="flex gap-3 md:gap-4 items-start"
                          initial={{ opacity: 0, x: isMobile ? 0 : -30, y: isMobile ? 12 : 0 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <span className="text-amber-500 mt-1.5 flex-shrink-0 text-lg">•</span>
                          <span className="text-sm md:text-base leading-relaxed">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatedContent>

                {/* Awards */}
                <AnimatedContent delay={0.4}>
                  <motion.div
                    className="rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm p-6 md:p-10 relative overflow-hidden group hover:border-amber-500/40 transition-colors duration-500"
                    whileHover={{
                      y: -8,
                      boxShadow: "0 30px 60px rgba(245, 158, 11, 0.2)",
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="absolute top-0 right-0 hidden w-64 h-64 bg-amber-500/10 rounded-full blur-3xl md:block"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                    <div className="relative">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6 mb-6">
                        <div className="flex items-start gap-3 md:gap-4">
                          <motion.div
                            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Award className="h-8 w-8 text-amber-500" />
                          </motion.div>
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-amber-500 transition-colors">DEVMatch Hackathon – 1st Place</h3>
                            <p className="text-amber-500">Maschain Tourism Track</p>
                          </div>
                        </div>
                        <div className="text-left md:text-right text-sm text-white/50 md:whitespace-nowrap">
                          <p>Sep 2024</p>
                          <p>Kuala Lumpur</p>
                        </div>
                      </div>
                      <p className="text-white/60 text-base">
                        Developer of "DocTour", a blockchain-based medical tourism app, responsible for building the user interface and integrating the system with the MasChain API.
                      </p>
                    </div>
                  </motion.div>
                </AnimatedContent>

                <AnimatedContent delay={0.5}>
                  <motion.div
                    className="rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm p-6 md:p-10 relative overflow-hidden group hover:border-amber-500/40 transition-colors duration-500"
                    whileHover={{
                      y: -8,
                      boxShadow: "0 30px 60px rgba(245, 158, 11, 0.2)",
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6 mb-6">
                        <div className="flex items-start gap-3 md:gap-4">
                          <Award className="h-8 w-8 text-amber-500 flex-shrink-0" />
                          <div>
                            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-amber-500 transition-colors">APU Entrepreneurship – 2nd Place</h3>
                            <p className="text-amber-500">Pitch Presenter & Concept Developer</p>
                          </div>
                        </div>
                        <div className="text-left md:text-right text-sm text-white/50 md:whitespace-nowrap">
                          <p>Nov 2023</p>
                          <p>Kuala Lumpur</p>
                        </div>
                      </div>
                      <p className="text-white/60 text-base">
                        Developed the concept for a gamified walking app that rewards users by distance travelled, and pitched its value and market potential to the judging panel.
                      </p>
                    </div>
                  </motion.div>
                </AnimatedContent>
              </div>
            </div>
          </FullScreenSection>


          {/* Projects Section */}
          <FullScreenSection id="projects">
            <div className="mx-auto max-w-6xl px-6 w-full">
              <AnimatedContent>
                <div className="mb-16">
                  <motion.div
                    className="flex items-center gap-4 mb-4"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Code className="h-8 w-8 text-amber-500" />
                    <h2 className="text-5xl md:text-6xl font-bold text-white">Projects</h2>
                  </motion.div>
                  <motion.div
                    className="h-1 w-32 bg-amber-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: 128 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
              </AnimatedContent>

              <div className="grid md:grid-cols-2 gap-8">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.title}
                    className="group rounded-2xl border border-white/10 bg-[#1f1f1f]/80 backdrop-blur-sm p-8 hover:border-amber-500/30 transition-all duration-500 relative overflow-hidden"
                    initial={{ opacity: 0, y: 60, rotateX: 10 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: 0.1 + (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{
                      y: -12,
                      rotateX: 2,
                      boxShadow: "0 30px 60px rgba(0, 0, 0, 0.3)"
                    }}
                  >
                    <motion.div
                      className="absolute -top-20 -right-20 hidden w-40 h-40 bg-amber-500/15 rounded-full blur-3xl md:block"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 4, repeat: Infinity, delay: index }}
                    />
                    <div className="relative mb-6">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-xl font-semibold text-white group-hover:text-amber-500 transition-colors">
                          {project.title}
                        </h3>
                        <span className="text-xs text-white/50 whitespace-nowrap">{project.date}</span>
                      </div>
                      <p className="mb-4 text-sm text-amber-500/80">{project.subtitle}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, i) => (
                          <motion.span
                            key={tech}
                            className="px-3 py-1.5 rounded-full bg-amber-500/10 text-xs text-amber-500 border border-amber-500/20"
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.3 + i * 0.05, ease: "backOut" }}
                            whileHover={{ scale: 1.1, y: -2 }}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                    <ul className="relative space-y-3 text-sm text-white/60">
                      {project.points.map((point) => (
                        <li key={point} className="flex gap-2">
                          <span className="text-amber-500 mt-1 flex-shrink-0">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    {project.repo && (
                      <a
                        href={`https://github.com/${project.repo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative mt-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-amber-500 transition-colors"
                      >
                        <Github className="h-4 w-4" />
                        {project.repo}
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </FullScreenSection>

          {/* Skills Section */}
          <FullScreenSection id="skills">
            <SkillsSection />
          </FullScreenSection>

          {/* Contact Section */}
          <FullScreenSection id="contact">
            <div className="mx-auto max-w-6xl px-6 w-full">
              <AnimatedContent>
                <div className="mb-16">
                  <motion.div
                    className="flex items-center gap-4 mb-4"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Mail className="h-8 w-8 text-amber-500" />
                    <h2 className="text-5xl md:text-6xl font-bold text-white">Contact</h2>
                  </motion.div>
                  <motion.div
                    className="h-1 w-32 bg-amber-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: 128 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
              </AnimatedContent>

              <AnimatedContent delay={0.2}>
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <motion.div
                    className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 md:p-10"
                    whileHover={{ y: -6, boxShadow: "0 24px 48px rgba(245, 158, 11, 0.14)" }}
                  >
                    <p className="mb-4 text-sm uppercase tracking-wider text-amber-500">Available for opportunities</p>
                    <h3 className="mb-4 text-3xl font-semibold text-white">Let&apos;s connect.</h3>
                    <p className="mb-8 max-w-xl text-base leading-relaxed text-white/60">
                      I am open to graduate and junior developer roles where I can contribute across frontend, backend, cloud and AI-powered systems.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <motion.a
                        href={resumePdf}
                        download="Alfeus_Xiesi_Delroy_Resume.pdf"
                        className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-[#0d0d0d] transition-colors hover:bg-amber-400"
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <FileDown className="h-4 w-4" />
                        Download Resume
                      </motion.a>
                      <motion.a
                        href="mailto:dalfeusxiesi@gmail.com"
                        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/80 transition-colors hover:border-amber-500/30 hover:text-amber-500"
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Mail className="h-4 w-4" />
                        Email Me
                      </motion.a>
                    </div>
                  </motion.div>

                  <div className="grid gap-4">
                    {contactLinks.map((item, i) => (
                      <motion.a
                        key={item.label}
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-[#1f1f1f]/80 p-5 transition-colors hover:border-amber-500/30"
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.35 + i * 0.08 }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
                          <item.icon className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-white/40">{item.label}</p>
                          <p className="truncate text-base text-white/80 group-hover:text-amber-500">{item.value}</p>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </AnimatedContent>
            </div>
          </FullScreenSection>

          {/* Footer */}
          <motion.footer
            className="mt-32 py-12 text-center text-sm text-white/50 border-t border-border"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-base">© 2026 Alfeus Xiesi Delroy. All rights reserved.</p>
            <motion.p
              className="mt-2 text-xs"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Built with React, TypeScript & Motion
            </motion.p>
          </motion.footer>
        </div>
      </div>

      {/* Scroll to top button */}
      <motion.button
        data-swarm-skip
        className="fixed bottom-8 right-8 p-4 rounded-full bg-amber-500 text-white shadow-lg z-50 backdrop-blur-sm"
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0,
          rotate: showScrollTop ? 0 : -180,
        }}
        whileHover={{
          scale: 1.15,
          rotate: -90,
          boxShadow: "0 0 40px rgba(245, 158, 11, 0.6)",
        }}
        whileTap={{ scale: 0.9 }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <ArrowUp className="h-6 w-6" />
      </motion.button>
    </div>
  );
}
