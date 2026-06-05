import { motion } from 'motion/react';
import profilePhoto from '../../imports/1651352529991.jpg';

export default function ProfilePhoto() {
  return (
    <motion.div
      className="relative h-80 w-80 rounded-3xl overflow-hidden border-2 border-amber-500/20 bg-[#1f1f1f]/80 backdrop-blur-sm"
      whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
    >
      <img
        src={profilePhoto}
        alt="Alfeus Xiesi Delroy"
        className="w-full h-full object-cover object-top"
      />

      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        animate={{
          boxShadow: [
            "0 0 20px rgba(245, 158, 11, 0.2)",
            "0 0 40px rgba(245, 158, 11, 0.4)",
            "0 0 20px rgba(245, 158, 11, 0.2)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}
