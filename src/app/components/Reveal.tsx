import { motion } from 'motion/react';

// Critically damped (no overshoot): nothing here was flicked, so nothing should bounce.
const settle = { type: 'spring', bounce: 0, duration: 0.6 } as const;

export default function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={settle}
    >
      {children}
    </motion.div>
  );
}
