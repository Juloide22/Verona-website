'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { veronaConfig } from '@/config/verona';
import { ArrowLeft, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function InterioresGallery() {
  const { interiores } = veronaConfig;
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  // Drag-to-scroll mouse state tracking
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftVal, setScrollLeftVal] = useState(0);
  const [draggedDistance, setDraggedDistance] = useState(0);

  // Lightbox index state
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const cardWidth = window.innerWidth >= 768 ? window.innerWidth * 0.42 : window.innerWidth * 0.8;
      const gap = 24;
      const amount = cardWidth + gap;

      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - amount : scrollLeft + amount,
        behavior: 'smooth',
      });
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (activeIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setActiveIdx((prev) => (prev !== null && prev < interiores.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setActiveIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : interiores.length - 1));
      } else if (e.key === 'Escape') {
        setActiveIdx(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx, interiores.length]);

  // Drag-to-scroll event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftVal(scrollRef.current.scrollLeft);
    setDraggedDistance(0);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftVal - walk;

    // Track total dragged distance
    setDraggedDistance((prev) => prev + Math.abs(x - startX));
  };

  const handleCardClick = (index: number, e: React.MouseEvent) => {
    // Prevent opening lightbox if they dragged to scroll
    if (draggedDistance > 8) {
      e.preventDefault();
      return;
    }
    setActiveIdx(index);
  };

  // Handle Swipe/Drag end inside Lightbox
  const handleLightboxDragEnd = (event: any, info: any) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      // Swiped Left -> Next Image
      setActiveIdx((prev) => (prev !== null && prev < interiores.length - 1 ? prev + 1 : 0));
    } else if (info.offset.x > threshold) {
      // Swiped Right -> Previous Image
      setActiveIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : interiores.length - 1));
    }
  };

  return (
    <section id="interiores" className="w-full overflow-hidden bg-verona-bg py-24 border-t border-border-subtle">
      {/* Header with scroll controls */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-extreme text-verona-gold font-medium mb-3 block text-center md:text-left">
            El Proyecto
          </span>
          <h3 className="font-display text-4xl md:text-5xl font-light text-text-primary leading-tight max-w-lg text-center md:text-left">
            Cada espacio, <br />
            cuidado al mínimo detalle.
          </h3>
        </div>

        {/* Navigation Arrow buttons */}
        <div className="flex gap-4 justify-center md:justify-end">
          <button
            onClick={() => scroll('left')}
            className="w-12 h-12 border border-verona-gold/30 hover:border-verona-gold text-verona-gold/70 hover:text-verona-gold transition-all duration-300 flex items-center justify-center cursor-none"
            aria-label="Deslizar a la izquierda"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-12 h-12 border border-verona-gold/30 hover:border-verona-gold text-verona-gold/70 hover:text-verona-gold transition-all duration-300 flex items-center justify-center cursor-none"
            aria-label="Deslizar a la derecha"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal scrolling gallery container (Draggable) */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`w-full overflow-x-auto no-scrollbar pb-12 flex gap-6 px-6 md:px-12 scroll-smooth select-none cursor-grab active:cursor-grabbing`}
      >
        {interiores.map((card, index) => {
          const hasFailed = failedImages[card.id];

          return (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              key={card.id}
              onClick={(e) => handleCardClick(index, e)}
              className="flex-shrink-0 w-[80vw] md:w-[42vw] flex flex-col group cursor-none"
            >
              {/* Image / Placeholder Area */}
              <div
                className="w-full aspect-[4/3] relative overflow-hidden bg-verona-bg border border-border-subtle flex items-center justify-center"
                style={{ backgroundColor: card.placeholderBg }}
              >
                {!hasFailed ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={card.src}
                    alt={card.title}
                    onError={() => handleImageError(card.id)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    draggable={false}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col justify-center items-center p-6 bg-black/45">
                    <span className="font-display text-[10px] uppercase tracking-extreme text-verona-gold/30 mb-2">
                      {card.id} / Render
                    </span>
                    <span className="font-sans text-xs tracking-extreme text-verona-gold/25 uppercase font-medium">
                      Render próximamente
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 border border-white/5 pointer-events-none" />
              </div>

              {/* Card Meta Content */}
              <div className="mt-6 flex gap-4 items-baseline">
                <span className="font-sans text-[10px] uppercase tracking-extreme text-verona-gold">
                  {card.id}
                </span>
                <div>
                  <h4 className="font-display text-lg text-text-primary mb-2 tracking-wide font-normal group-hover:text-verona-gold transition-colors duration-300">
                    {card.title}
                  </h4>
                  <p className="font-sans text-xs text-text-secondary leading-relaxed max-w-sm">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Cinematic Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between p-6 md:p-12 cursor-none select-none"
            onClick={() => setActiveIdx(null)}
          >
            {/* Top Bar (Close and index) */}
            <div className="w-full flex justify-between items-center z-10">
              <span className="font-sans text-[11px] uppercase tracking-extreme text-verona-gold font-semibold">
                {String(activeIdx + 1).padStart(2, '0')} / {String(interiores.length).padStart(2, '0')}
              </span>
              <button
                onClick={() => setActiveIdx(null)}
                className="w-12 h-12 border border-white/10 hover:border-white/20 text-white/60 hover:text-white transition-all duration-300 flex items-center justify-center cursor-none bg-black/20 backdrop-blur-sm"
                aria-label="Cerrar visor"
              >
                <X size={18} />
              </button>
            </div>

            {/* Middle Image Area with drag / swipe and navigation buttons */}
            <div className="relative w-full flex-grow flex items-center justify-center my-6 md:my-12">
              
              {/* Prev Button (Desktop and tablet only for clean phone view) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : interiores.length - 1));
                }}
                className="hidden md:flex absolute left-4 w-14 h-14 border border-white/10 hover:border-verona-gold text-white/40 hover:text-verona-gold transition-all duration-300 items-center justify-center cursor-none bg-black/10 backdrop-blur-sm z-10 rounded-full"
                aria-label="Imagen anterior"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Centered Image display container */}
              <div 
                className="relative max-w-full max-h-[70vh] flex items-center justify-center px-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image container
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img
                    key={activeIdx}
                    src={interiores[activeIdx].src}
                    alt={interiores[activeIdx].title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.5}
                    onDragEnd={handleLightboxDragEnd}
                    className="max-w-full max-h-[68vh] object-contain select-none cursor-grab active:cursor-grabbing shadow-[0_24px_50px_rgba(0,0,0,0.8)] border border-white/5"
                  />
                </AnimatePresence>
              </div>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev !== null && prev < interiores.length - 1 ? prev + 1 : 0));
                }}
                className="hidden md:flex absolute right-4 w-14 h-14 border border-white/10 hover:border-verona-gold text-white/40 hover:text-verona-gold transition-all duration-300 items-center justify-center cursor-none bg-black/10 backdrop-blur-sm z-10 rounded-full"
                aria-label="Siguiente imagen"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Bar: Titles, Description and Swipe indicator */}
            <div className="w-full flex flex-col items-center text-center z-10 max-w-xl mx-auto pointer-events-none mt-auto">
              <h4 className="font-display text-xl md:text-2xl text-text-primary tracking-wide mb-2">
                {interiores[activeIdx].title}
              </h4>
              <p className="font-sans text-xs text-text-secondary leading-relaxed max-w-md">
                {interiores[activeIdx].description}
              </p>
              <span className="font-sans text-[8px] uppercase tracking-widest text-text-secondary/40 mt-4 block md:hidden">
                Deslizá para navegar
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
