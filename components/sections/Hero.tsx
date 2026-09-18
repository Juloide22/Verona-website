'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { veronaConfig } from '@/config/verona';
import { Compass, Camera, SkipForward } from 'lucide-react';

interface HeroProps {
  onEnterProject: (targetId: string) => void;
  isPortalOpen: boolean;
}

export default function Hero({ onEnterProject, isPortalOpen }: HeroProps) {
  const { hero } = veronaConfig;

  // Timed reveal states:
  // - 0s to 2s: Clean video (no overlay, no text)
  // - At 2s: Logo "Verona" PNG reveals directly in the top sky area (statically positioned)
  // - At 5s: 50% blue dim overlay fades in, CTA buttons & description reveal in center
  const [showLogo, setShowLogo] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  const [hasVideoError, setHasVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lock body scroll while portal is open
  useEffect(() => {
    if (isPortalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [isPortalOpen]);

  const videoSrc = isMobile
    ? hero.videoMobile || '/videos/hero-mobile.mp4'
    : hero.videoDesktop || '/videos/hero-desktop.mp4';

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curTime = videoRef.current.currentTime;
    if (curTime >= 2.0 && !showLogo) {
      setShowLogo(true);
    }
    if (curTime >= 5.0 && !showFullContent) {
      setShowFullContent(true);
    }
  };

  // Fallback timers to guarantee timing even if timeupdate events fluctuate
  useEffect(() => {
    const t2 = setTimeout(() => setShowLogo(true), 2000);
    const t5 = setTimeout(() => setShowFullContent(true), 5000);
    return () => {
      clearTimeout(t2);
      clearTimeout(t5);
    };
  }, []);

  const handleVideoError = () => {
    setHasVideoError(true);
    setShowLogo(true);
    setShowFullContent(true);
  };

  const skipIntro = () => {
    setShowLogo(true);
    setShowFullContent(true);
  };

  const contentContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <div
      className={`${
        isPortalOpen
          ? 'fixed inset-0 z-50 w-screen h-screen overflow-hidden'
          : 'relative w-full min-h-screen'
      } bg-[#071125] flex flex-col justify-between items-center px-6 md:px-12 select-none pt-8 pb-6 md:pt-12 md:pb-8`}
    >
      {/* Background Video Layer with continuous infinite loop */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {!hasVideoError ? (
          <video
            ref={videoRef}
            key={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onError={handleVideoError}
            className="w-full h-full object-cover scale-[1.02]"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          /* Fallback image if video fails to load */
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src="/images/hero-bg.jpg"
            alt="Verona Fachada"
            className="w-full h-full object-cover"
            draggable={false}
          />
        )}

        {/* Signature Verona Blue Dimming Overlay (#071125) - Fades to 50% opacity at 5 seconds */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showFullContent ? 0.50 : 0 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
          className="absolute inset-0 bg-[#071125]"
        />

        {/* Bottom linear gradient fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showFullContent ? 0.75 : 0 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#071125]/40 to-verona-bg"
        />
      </div>

      {/* Skip Intro button before full content reveals */}
      {!showFullContent && !hasVideoError && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          onClick={skipIntro}
          className="absolute top-6 right-6 z-30 flex items-center gap-2 bg-[#071125]/70 border border-white/10 backdrop-blur-md px-4 py-2 text-[10px] uppercase tracking-widest text-text-secondary hover:text-verona-gold hover:border-verona-gold/40 transition-all duration-300 rounded-full cursor-pointer"
        >
          <span>Ver opciones</span>
          <SkipForward size={12} />
        </motion.button>
      )}

      {/* 1. TOP SKY REGION: VERONA LOGO PNG (Statically positioned at top from 2s mark) */}
      <div className="relative z-10 w-full flex flex-col items-center text-center mt-2 md:mt-4">
        <AnimatePresence>
          {showLogo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="Verona"
                className="w-[58vw] max-w-[200px] md:max-w-[320px] lg:max-w-[400px] h-auto object-contain drop-shadow-[0_10px_35px_rgba(0,0,0,0.85)] filter brightness-110"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. FOCAL CENTER & LOWER REGION: CTA BUTTONS & DESCRIPTION (Reveals smoothly at 5s) */}
      <div className="relative z-10 max-w-3xl w-full flex flex-col items-center text-center my-auto -translate-y-12 md:-translate-y-20 lg:-translate-y-24">
        <AnimatePresence>
          {showFullContent && (
            <motion.div
              variants={contentContainerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center w-full max-w-2xl"
            >
              {/* DUAL ACTION BUTTONS (Shifted upward into red boxes marked on upper balcony) */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-8 -translate-y-8 md:-translate-y-12"
              >
                {/* Button 1: Recorrer Verona (360° Tour) */}
                <button
                  onClick={() => onEnterProject('360')}
                  className="w-full sm:w-auto min-w-[190px] flex items-center justify-center gap-3 bg-verona-gold text-black font-sans text-[11px] font-semibold uppercase tracking-extreme py-3.5 px-7 shadow-[0_4px_24px_rgba(212,175,55,0.35)] hover:bg-white hover:shadow-[0_6px_32px_rgba(255,255,255,0.4)] transition-all duration-300 group cursor-pointer"
                >
                  <Compass size={15} className="transition-transform duration-300 group-hover:rotate-45" />
                  <span>Recorrer Verona</span>
                </button>

                {/* Button 2: Galería del proyecto (Renders Gallery - Interiores & Unidades) */}
                <button
                  onClick={() => onEnterProject('unidades')}
                  className="w-full sm:w-auto min-w-[190px] flex items-center justify-center gap-3 bg-[#071125]/90 border border-verona-gold/70 text-verona-gold font-sans text-[11px] font-semibold uppercase tracking-extreme py-3.5 px-7 backdrop-blur-md hover:bg-verona-gold/20 hover:border-verona-gold hover:text-white transition-all duration-300 group cursor-pointer"
                >
                  <Camera size={15} className="transition-transform duration-300 group-hover:scale-110" />
                  <span>Galería y Unidades</span>
                </button>
              </motion.div>

              {/* Eyebrow label */}
              <motion.span
                variants={itemVariants}
                className="font-sans text-[10px] md:text-[11px] uppercase tracking-extreme text-verona-gold mb-2 font-semibold flex flex-col items-center gap-0.5"
              >
                <span>{hero.eyebrow}</span>
                <span className="text-[8.5px] md:text-[9px] opacity-75 normal-case font-light tracking-widest text-text-secondary">
                  Italia 944
                </span>
              </motion.span>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="font-display text-base md:text-xl lg:text-2xl italic text-text-secondary mb-2"
              >
                {hero.subtitle}
              </motion.p>

              {/* Decorative Gold Separator */}
              <motion.div variants={itemVariants} className="w-10 h-[1px] bg-verona-gold/30 mb-2.5" />

              {/* Dataline */}
              <motion.span
                variants={itemVariants}
                className="font-sans text-xs md:text-sm uppercase tracking-extreme text-verona-gold/80 mb-2 font-medium"
              >
                {hero.dataLine}
              </motion.span>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="font-sans text-xs md:text-sm text-text-secondary max-w-xl leading-relaxed font-light"
              >
                {hero.description}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Side subtle decorative grid lines */}
      <div className="absolute left-12 top-0 h-full w-[1px] bg-border-subtle hidden lg:block" />
      <div className="absolute right-12 top-0 h-full w-[1px] bg-border-subtle hidden lg:block" />
    </div>
  );
}
