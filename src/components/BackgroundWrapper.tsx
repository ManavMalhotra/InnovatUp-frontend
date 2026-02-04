import { motion } from 'motion/react';

export default function BackgroundWrapper() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Blob 1 - Indigo */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-indigo-500/20 blur-[100px]"
        style={{ top: '-10%', left: '-10%' }}
        animate={{
          x: [0, 100, 50, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Blob 2 - Teal */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-teal-500/20 blur-[100px]"
        style={{ top: '40%', right: '-15%' }}
        animate={{
          x: [0, -80, -40, 0],
          y: [0, 60, -30, 0],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Blob 3 - Purple */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/15 blur-[100px]"
        style={{ bottom: '-10%', left: '30%' }}
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.3, 0.85, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
