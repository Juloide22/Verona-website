'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { veronaConfig } from '@/config/verona';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function InterioresGallery() {
  const { interiores } = veronaConfig;
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  // Drag-to-scroll mouse state tracking
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftVal, setScrollLeftVal] = useState(0);

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

  // Mouse drag-to-scroll events handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftVal(scrollRef.current.scrollLeft);
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
    // Walk factor (multiplier for dragging sensitivity)
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftVal - walk;
  };

  return (
    <section id="interiores" className="w-full overflow-hidden bg-verona-bg py-24 border-t border-border-subtle">
      {/* Header with scroll controls */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-extreme text-verona-gold font-medium mb-3 block text-center md:text-left">
            Interiores
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
              className="flex-shrink-0 w-[80vw] md:w-[42vw] flex flex-col group"
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
                    draggable={false} // Prevent browser default drag behavior on images
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
    </section>
  );
}
