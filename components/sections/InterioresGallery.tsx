'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { veronaConfig } from '@/config/verona';
import { ArrowLeft, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';

const FILTER_TABS = [
  { id: 'todas', label: 'Todas' },
  { id: 'tipo-a', label: 'Tipología A' },
  { id: 'tipo-b', label: 'Tipología B' },
  { id: 'tipo-c', label: 'Tipología C' },
  { id: 'exteriores', label: 'Exteriores' },
] as const;

export type FilterId = (typeof FILTER_TABS)[number]['id'];

interface InterioresGalleryProps {
  activeFilter?: FilterId;
  onFilterChange?: (filterId: FilterId) => void;
  hideHeader?: boolean;
  hideTabs?: boolean;
}

export default function InterioresGallery({
  activeFilter: externalFilter,
  onFilterChange,
  hideHeader = false,
  hideTabs = false,
}: InterioresGalleryProps) {
  const { interiores } = veronaConfig;
  const [internalFilter, setInternalFilter] = useState<FilterId>('todas');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const activeFilter = externalFilter ?? internalFilter;

  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  // Drag-to-scroll mouse state tracking
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftVal, setScrollLeftVal] = useState(0);
  const [draggedDistance, setDraggedDistance] = useState(0);

  // Lightbox index state
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // Filter items based on active tab selection
  const filteredInteriores = activeFilter === 'todas'
    ? interiores
    : interiores.filter((item) => item.typology === activeFilter);

  const handleFilterChange = (filterId: FilterId) => {
    if (onFilterChange) {
      onFilterChange(filterId);
    } else {
      setInternalFilter(filterId);
    }
    setActiveIdx(null);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

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

  // Keyboard navigation for Lightbox & Strict Scroll Locking
  useEffect(() => {
    if (activeIdx === null) return;

    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Lock any parent scrollable modal containers
    const scrollContainers = document.querySelectorAll('.overflow-y-auto');
    const originalContainerStyles: { el: HTMLElement; style: string }[] = [];
    scrollContainers.forEach((el) => {
      const htmlEl = el as HTMLElement;
      originalContainerStyles.push({ el: htmlEl, style: htmlEl.style.overflow });
      htmlEl.style.overflow = 'hidden';
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setActiveIdx((prev) => (prev !== null && prev < filteredInteriores.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setActiveIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredInteriores.length - 1));
      } else if (e.key === 'Escape') {
        setActiveIdx(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalBodyOverflow;
      originalContainerStyles.forEach(({ el, style }) => {
        el.style.overflow = style;
      });
    };
  }, [activeIdx, filteredInteriores.length]);

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
      setActiveIdx((prev) => (prev !== null && prev < filteredInteriores.length - 1 ? prev + 1 : 0));
    } else if (info.offset.x > threshold) {
      // Swiped Right -> Previous Image
      setActiveIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredInteriores.length - 1));
    }
  };

  const containerContent = (
    <>
      {/* Header with scroll controls */}
      {!hideHeader && (
        <div className="max-w-5xl mx-auto px-6 md:px-12 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-extreme text-verona-gold font-medium mb-3 block text-center md:text-left">
              El Proyecto
            </span>
            <h3 className="font-display text-4xl md:text-5xl font-light text-text-primary leading-tight max-w-lg text-center md:text-left">
              Galería de Renders.
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
      )}

      {/* Typology Filter Tabs */}
      {!hideTabs && (
        <div className="max-w-5xl mx-auto px-6 md:px-12 mb-12 flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleFilterChange(tab.id)}
                className={`relative px-5 py-2.5 text-xs font-sans tracking-wider uppercase transition-all duration-300 cursor-none border ${
                  isActive
                    ? 'bg-verona-gold text-black font-semibold border-verona-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                    : 'bg-black/30 text-text-secondary hover:text-verona-gold border-white/10 hover:border-verona-gold/40'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Horizontal scrolling gallery header controls if header is hidden */}
      {hideHeader && (
        <div className="max-w-5xl mx-auto px-6 md:px-12 mb-6 flex items-center justify-between">
          <span className="font-sans text-[11px] uppercase tracking-extreme text-verona-gold font-medium">
            Renders de {activeFilter === 'todas' ? 'todas las unidades' : activeFilter === 'exteriores' ? 'exteriores' : FILTER_TABS.find(t => t.id === activeFilter)?.label}
          </span>
          <div className="flex gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 border border-verona-gold/30 hover:border-verona-gold text-verona-gold/70 hover:text-verona-gold transition-all duration-300 flex items-center justify-center cursor-none"
              aria-label="Deslizar a la izquierda"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 border border-verona-gold/30 hover:border-verona-gold text-verona-gold/70 hover:text-verona-gold transition-all duration-300 flex items-center justify-center cursor-none"
              aria-label="Deslizar a la derecha"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Horizontal scrolling gallery container (Draggable) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`w-full overflow-x-auto no-scrollbar pb-12 flex gap-6 px-6 md:px-12 scroll-smooth select-none cursor-grab active:cursor-grabbing`}
        >
          {filteredInteriores.length === 0 ? (
            <div className="w-full py-16 text-center text-text-secondary font-sans text-sm">
              No hay renders disponibles para esta categoría.
            </div>
          ) : (
            filteredInteriores.map((card, index) => {
              const hasFailed = failedImages[card.id];

              return (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
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
            })
          )}
        </motion.div>
      </AnimatePresence>

      {/* Cinematic Fullscreen Lightbox Modal (Mounted via React Portal directly into document.body) */}
      {mounted && activeIdx !== null && filteredInteriores[activeIdx] && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="fixed inset-0 w-screen h-screen max-h-screen z-[9999] bg-[#050811] backdrop-blur-2xl flex flex-col justify-between p-6 md:p-12 cursor-none select-none overflow-hidden"
            onClick={() => setActiveIdx(null)}
          >
            {/* Top Bar (Close and index) */}
            <div className="w-full flex justify-between items-center z-10">
              <span className="font-sans text-[11px] uppercase tracking-extreme text-verona-gold font-semibold">
                {String(activeIdx + 1).padStart(2, '0')} / {String(filteredInteriores.length).padStart(2, '0')}
              </span>
              <button
                onClick={() => setActiveIdx(null)}
                className="w-12 h-12 border border-white/10 hover:border-white/20 text-white/60 hover:text-white transition-all duration-300 flex items-center justify-center cursor-none bg-black/40 backdrop-blur-md"
                aria-label="Cerrar visor"
              >
                <X size={18} />
              </button>
            </div>

            {/* Middle Image Area with drag / swipe and navigation buttons */}
            <div className="relative w-full flex-grow flex items-center justify-center my-4 md:my-8 overflow-hidden">
              
              {/* Prev Button (Desktop and tablet only for clean phone view) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredInteriores.length - 1));
                }}
                className="hidden md:flex absolute left-4 w-14 h-14 border border-white/10 hover:border-verona-gold text-white/40 hover:text-verona-gold transition-all duration-300 items-center justify-center cursor-none bg-black/40 backdrop-blur-md z-10 rounded-full"
                aria-label="Imagen anterior"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Centered Image display container */}
              <div 
                className="relative max-w-full max-h-[75vh] flex items-center justify-center px-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image container
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img
                    key={activeIdx}
                    src={filteredInteriores[activeIdx].src}
                    alt={filteredInteriores[activeIdx].title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.5}
                    onDragEnd={handleLightboxDragEnd}
                    className="max-w-full max-h-[72vh] object-contain select-none cursor-grab active:cursor-grabbing shadow-[0_24px_60px_rgba(0,0,0,0.95)] border border-white/10"
                  />
                </AnimatePresence>
              </div>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev !== null && prev < filteredInteriores.length - 1 ? prev + 1 : 0));
                }}
                className="hidden md:flex absolute right-4 w-14 h-14 border border-white/10 hover:border-verona-gold text-white/40 hover:text-verona-gold transition-all duration-300 items-center justify-center cursor-none bg-black/40 backdrop-blur-md z-10 rounded-full"
                aria-label="Siguiente imagen"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Bar: Titles, Description and Swipe indicator */}
            <div className="w-full flex flex-col items-center text-center z-10 max-w-xl mx-auto pointer-events-none mt-auto pb-2">
              <h4 className="font-display text-xl md:text-2xl text-text-primary tracking-wide mb-1">
                {filteredInteriores[activeIdx].title}
              </h4>
              <p className="font-sans text-xs text-text-secondary leading-relaxed max-w-md">
                {filteredInteriores[activeIdx].description}
              </p>
              <span className="font-sans text-[8px] uppercase tracking-widest text-text-secondary/40 mt-3 block md:hidden">
                Deslizá para navegar
              </span>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );

  if (hideHeader) {
    return <div className="w-full overflow-hidden bg-verona-bg pt-6 pb-12">{containerContent}</div>;
  }

  return (
    <section id="interiores" className="w-full overflow-hidden bg-verona-bg py-24 border-t border-border-subtle">
      {containerContent}
    </section>
  );
}
