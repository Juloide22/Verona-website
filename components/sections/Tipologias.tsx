'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { veronaConfig, Typology } from '@/config/verona';
import { Square, Shield, Car } from 'lucide-react';

export default function Tipologias() {
  const { typologies, technicalSpecs } = veronaConfig;
  const [selectedTypo, setSelectedTypo] = useState<Typology | null>(null);

  // Auto-select first typology on desktop
  useEffect(() => {
    if (window.innerWidth >= 768 && typologies.length > 0) {
      setSelectedTypo(typologies[0]);
    }
  }, [typologies]);

  const handleSelect = (typo: Typology) => {
    setSelectedTypo(selectedTypo?.id === typo.id ? null : typo);
  };

  const handleConsultar = (id: string) => {
    const event = new CustomEvent('verona-select-typology', { detail: id });
    window.dispatchEvent(event);

    const contactSection = document.getElementById('contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="unidades" className="w-full bg-verona-bg py-24 border-t border-border-subtle">
      {/* Strictly aligned to max-w-5xl container grid */}
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        
        {/* Centered Section Header */}
        <div className="mb-16 text-center">
          <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-extreme text-verona-gold font-medium mb-3 block">
            Tipologías
          </span>
          <h3 className="font-display text-4xl md:text-5xl font-light text-text-primary leading-tight">
            Encontrá <br className="hidden md:block" />
            tu unidad.
          </h3>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {typologies.map((typo) => {
            const isSelected = selectedTypo?.id === typo.id;

            return (
              <div
                key={typo.id}
                onClick={() => handleSelect(typo)}
                className={`border p-8 cursor-none flex flex-col justify-between min-h-[280px] transition-all duration-500 group relative ${
                  isSelected
                    ? 'border-verona-gold bg-verona-gold/[0.03]'
                    : 'border-border-subtle hover:border-verona-gold/40'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-sans text-[10px] uppercase tracking-extreme text-verona-gold">
                      {typo.floor}
                    </span>
                    <span className="font-sans text-[9px] uppercase tracking-extreme text-text-secondary bg-white/[0.03] border border-border-subtle px-2.5 py-1">
                      {typo.available} Disponibles
                    </span>
                  </div>

                  <h4 className="font-display text-2xl text-text-primary mb-2 tracking-wide font-normal group-hover:text-verona-gold transition-colors duration-300">
                    {typo.title}
                  </h4>
                  <span className="font-sans text-[10px] uppercase tracking-widest text-text-secondary">
                    {typo.sub}
                  </span>
                </div>

                <div className="mt-8 pt-6 border-t border-border-subtle flex justify-between text-xs">
                  <div>
                    <span className="text-text-secondary font-light block">Cubierta</span>
                    <span className="font-sans font-medium text-text-primary">{typo.coveredArea} m²</span>
                  </div>
                  <div>
                    <span className="text-text-secondary font-light block">Terraza</span>
                    <span className="font-sans font-medium text-text-primary">{typo.terraceArea} m²</span>
                  </div>
                  <div>
                    <span className="text-text-secondary font-light block">Cochera</span>
                    <span className="font-sans font-medium text-text-primary">{typo.garage ? 'Sí' : 'No'}</span>
                  </div>
                </div>

                <div
                  className={`absolute bottom-0 left-0 h-[2px] bg-verona-gold transition-all duration-500 ${
                    isSelected ? 'w-full' : 'w-0 group-hover:w-1/3'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Selected Unit Details Panel */}
        <div className="overflow-hidden mb-16">
          <AnimatePresence mode="wait">
            {selectedTypo && (
              <motion.div
                key={selectedTypo.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="border-t border-border-subtle pt-12"
              >
                <div className="flex flex-col items-center text-center">
                  
                  {/* SVG Blueprint Mockup (Centered at Top) */}
                  <div className="w-full max-w-2xl bg-[#050d1a] border border-border-subtle aspect-[16/10] relative mb-12 flex justify-center items-center py-8">
                    <svg
                      viewBox="0 0 300 200"
                      className="w-4/5 h-4/5 text-verona-gold/45 stroke-current fill-none stroke-[0.75]"
                    >
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(197, 168, 128, 0.03)" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" stroke="none" />

                      <path d={selectedTypo.svgPath} />

                      <text x="35" y="55" fill="rgba(197, 168, 128, 0.4)" fontSize="7" fontFamily="monospace">TERRAZA</text>
                      <text x="135" y="105" fill="rgba(197, 168, 128, 0.4)" fontSize="7" fontFamily="monospace">LIVING</text>
                      <text x="215" y="145" fill="rgba(197, 168, 128, 0.4)" fontSize="7" fontFamily="monospace">DORMITORIO</text>
                    </svg>

                    <div className="absolute bottom-4 left-4 font-sans text-[8px] uppercase tracking-extreme text-verona-gold/40">
                      esquema de planta arquitectónica sugerida
                    </div>
                  </div>

                  {/* Detailed Description & Specs */}
                  <div className="flex flex-col items-center max-w-2xl">
                    <span className="font-sans text-[10px] uppercase tracking-extreme text-verona-gold mb-3 font-semibold">
                      Ficha de Unidad
                    </span>
                    <h5 className="font-display text-3xl font-light text-text-primary tracking-wide mb-6">
                      {selectedTypo.title}
                    </h5>
                    <p className="font-sans text-sm text-text-secondary leading-relaxed mb-8 max-w-xl mx-auto">
                      {selectedTypo.description}
                    </p>

                    {/* Features list (Centered grid) */}
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-10 max-w-md mx-auto">
                      <div className="flex gap-3 items-center justify-start md:justify-center">
                        <Square className="w-4 h-4 text-verona-gold/60 flex-shrink-0" />
                        <span className="font-sans text-xs text-text-primary whitespace-nowrap">
                          {selectedTypo.coveredArea} m² Cubiertos
                        </span>
                      </div>
                      <div className="flex gap-3 items-center justify-start md:justify-center">
                        <Square className="w-4 h-4 text-verona-gold/60 flex-shrink-0" />
                        <span className="font-sans text-xs text-text-primary whitespace-nowrap">
                          {selectedTypo.terraceArea} m² Terraza
                        </span>
                      </div>
                      <div className="flex gap-3 items-center justify-start md:justify-center">
                        <Shield className="w-4 h-4 text-verona-gold/60 flex-shrink-0" />
                        <span className="font-sans text-xs text-text-primary whitespace-nowrap">
                          {selectedTypo.rooms} Ambientes | {selectedTypo.bathrooms} Baños
                        </span>
                      </div>
                      <div className="flex gap-3 items-center justify-start md:justify-center">
                        <Car className="w-4 h-4 text-verona-gold/60 flex-shrink-0" />
                        <span className="font-sans text-xs text-text-primary whitespace-nowrap">
                          Cochera {selectedTypo.garage ? 'Incluida' : 'No disponible'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={() => handleConsultar(selectedTypo.id)}
                        className="font-sans text-[11px] uppercase tracking-extreme border border-verona-gold px-8 py-3.5 text-verona-gold hover:bg-verona-gold/15 transition-colors duration-300 cursor-none"
                      >
                        Consultar esta unidad
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Technical specifications grid */}
        <div className="w-full border-t border-border-subtle pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {technicalSpecs.map((spec, index) => (
              <div
                key={spec.label}
                className={`flex flex-col gap-1 ${
                  index !== 0 ? 'md:border-l md:border-border-subtle md:pl-2' : ''
                }`}
              >
                <span className="font-sans text-[10px] uppercase tracking-extreme text-text-secondary">
                  {spec.label}
                </span>
                <span className="font-display text-xl text-verona-gold font-light">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
