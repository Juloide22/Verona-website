'use client';

import { motion } from 'framer-motion';
import { veronaConfig } from '@/config/verona';

export default function Hero() {
  const { hero } = veronaConfig;

  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as const, // Custom cinematic bezier curves
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen bg-verona-bg flex flex-col justify-center items-center px-6 md:px-12 overflow-hidden py-24"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl w-full flex flex-col items-center text-center"
      >
        {/* Eyebrow label */}
        <motion.span
          variants={itemVariants}
          className="font-sans text-[10px] md:text-[11px] uppercase tracking-extreme text-verona-gold mb-8 font-semibold"
        >
          {hero.eyebrow}
        </motion.span>

        {/* Huge display title */}
        <motion.h1
          variants={titleVariants}
          className="font-display text-[14vw] md:text-[12vw] lg:text-[10vw] font-light leading-[0.9] tracking-wider text-text-primary mb-6 selection:bg-verona-gold/10"
        >
          {hero.title}
        </motion.h1>

        {/* Large italic subtitle */}
        <motion.p
          variants={itemVariants}
          className="font-display text-xl md:text-2xl lg:text-3xl italic text-text-secondary mb-12"
        >
          {hero.subtitle}
        </motion.p>

        {/* Dataline separator */}
        <motion.div variants={itemVariants} className="w-12 h-[1px] bg-verona-gold/20 mb-8" />

        {/* Main project dataline */}
        <motion.span
          variants={itemVariants}
          className="font-sans text-xs md:text-sm uppercase tracking-extreme text-verona-gold/60 mb-6 font-medium"
        >
          {hero.dataLine}
        </motion.span>

        {/* Short descriptive paragraph */}
        <motion.p
          variants={itemVariants}
          className="font-sans text-sm md:text-base text-text-secondary max-w-2xl leading-relaxed font-light mb-16"
        >
          {hero.description}
        </motion.p>

        {/* Animated pulsing scroll indicator vertical line */}
        <motion.a
          href="#ubicacion"
          variants={itemVariants}
          className="flex flex-col items-center group cursor-none"
        >
          <span className="font-sans text-[9px] uppercase tracking-extreme text-text-secondary group-hover:text-verona-gold transition-colors duration-300">
            Descubrir
          </span>
          <motion.div
            animate={{
              y: [0, 12, 0],
              height: [24, 48, 24],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: 'easeInOut',
            }}
            className="w-[1px] bg-verona-gold/80 mt-4 origin-top"
          />
        </motion.a>
      </motion.div>

      {/* Side subtle decorative grids */}
      <div className="absolute left-12 top-0 h-full w-[1px] bg-border-subtle hidden lg:block" />
      <div className="absolute right-12 top-0 h-full w-[1px] bg-border-subtle hidden lg:block" />
    </section>
  );
}
