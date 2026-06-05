import { motion } from 'motion/react';
import { Code, Globe, Award, Wrench } from 'lucide-react';

const categories = [
  {
    icon: Code,
    title: 'Languages',
    delay: 0.1,
    skills: ['Python', 'JavaScript', 'TypeScript', 'C/C++', 'PHP', 'Dart'],
  },
  {
    icon: Globe,
    title: 'Frameworks & Tools',
    delay: 0.2,
    skills: ['React', 'Angular', 'Ionic', 'Flutter', 'MySQL', 'SQLite', 'Supabase'],
  },
  {
    icon: Wrench,
    title: 'Cloud & DevOps',
    delay: 0.3,
    skills: ['AWS (EC2, Lambda, RDS)', 'Git', 'Linux (RHEL)', 'Agile'],
  },
  {
    icon: Award,
    title: 'Professional',
    delay: 0.4,
    skills: ['Leadership', 'Problem Solving', 'Critical Thinking', 'Public Speaking', 'Team Collaboration'],
  },
];

const spokenLanguages = [
  { name: 'English', level: 'Fluent', pct: 100 },
  { name: 'Indonesian', level: 'Fluent', pct: 100 },
  { name: 'Malay', level: 'Fluent', pct: 100 },
  { name: 'German', level: 'Intermediate', pct: 70 },
];

export default function SkillsSection() {
  return (
    <div className="mx-auto max-w-6xl px-6 w-full">
      {/* Heading */}
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <Code className="h-8 w-8 text-amber-500" />
          <h2 className="text-5xl md:text-6xl font-bold text-white">Skills & Expertise</h2>
        </div>
        <motion.div
          className="h-1 w-32 bg-amber-500 rounded-full mx-auto"
          initial={{ width: 0 }}
          whileInView={{ width: 128 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </motion.div>

      {/* 2×2 skill categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {categories.map((cat) => (
          <motion.div
            key={cat.title}
            className="rounded-2xl border border-white/10 bg-[#1f1f1f]/80 backdrop-blur-sm p-7 hover:border-amber-500/30 transition-colors duration-500"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: cat.delay, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6, boxShadow: "0 24px 48px rgba(0,0,0,0.3)" }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <cat.icon className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">{cat.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/80 hover:border-amber-500/30 hover:text-amber-400 transition-all"
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: cat.delay + i * 0.04, ease: [0.34, 1.56, 0.64, 1] }}
                  whileHover={{ scale: 1.07, y: -2 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Spoken languages — full-width */}
      <motion.div
        className="rounded-2xl border border-white/10 bg-[#1f1f1f]/80 backdrop-blur-sm p-7 hover:border-amber-500/30 transition-colors duration-500"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -6, boxShadow: "0 24px 48px rgba(0,0,0,0.3)" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Globe className="h-5 w-5 text-amber-500" />
          </div>
          <h3 className="text-lg font-semibold text-white">Spoken Languages</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
          {spokenLanguages.map((lang, i) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.55 + i * 0.08 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white font-medium text-sm">{lang.name}</span>
                <span className="text-xs text-amber-500">{lang.level}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${lang.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.6 + i * 0.08, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
