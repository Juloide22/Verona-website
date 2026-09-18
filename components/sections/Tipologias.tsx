'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { veronaConfig, Typology } from '@/config/verona';
import { Square, Shield, Car, X, ArrowRight, ArrowLeft, MessageCircle } from 'lucide-react';
import InterioresGallery, { FilterId } from '@/components/sections/InterioresGallery';

export default function Tipologias() {
  const { typologies, technicalSpecs, contacto } = veronaConfig;
  const [selectedModalTypo, setSelectedModalTypo] = useState<Typology | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedModalTypo) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedModalTypo]);

  // Keyboard navigation (Escape closes modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedModalTypo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleConsultar = (id: string) => {
    setSelectedModalTypo(null);
    const event = new CustomEvent('verona-select-typology', { detail: id });
    window.dispatchEvent(event);

    const contactSection = document.getElementById('contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getWhatsAppLink = (typo: Typology) => {
    const msg = encodeURIComponent(
      `Hola! Me interesa obtener más información sobre la ${typo.title} (${typo.sub}) del proyecto Verona.`
    );
    return `https://wa.me/${contacto.phoneFormatted}?text=${msg}`;
  };

  return (
    <section id="unidades" className="w-full bg-verona-bg py-24 border-t border-border-subtle">
      {/* Anchor alias for #interiores links */}
      <div id="interiores" className="scroll-mt-24" />

      {/* Strictly aligned to max-w-5xl container grid */}
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        
        {/* Centered Section Header */}
        <div className="mb-16 text-center">
          <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-extreme text-verona-gold font-medium mb-3 block">
            Tipologías de Unidades
          </span>
          <h3 className="font-display text-4xl md:text-5xl font-light text-text-primary leading-tight">
            Encontrá tu espacio.
          </h3>
          <p className="font-sans text-xs md:text-sm text-text-secondary mt-3 max-w-md mx-auto">
            Seleccioná una tipología para ver su ficha completa, plano arquitectónico y galería de renders.
          </p>
        </div>

        {/* 3 Main Typology Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {typologies.map((typo) => {
            return (
              <div
                key={typo.id}
                onClick={() => setSelectedModalTypo(typo)}
                className="border border-border-subtle hover:border-verona-gold p-8 cursor-none flex flex-col justify-between min-h-[340px] bg-black/20 hover:bg-verona-gold/[0.04] transition-all duration-500 group relative shadow-lg"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex justify-between items-start mb-6">
                    <span className="font-sans text-[10px] uppercase tracking-extreme text-verona-gold font-semibold">
                      {typo.floor}
                    </span>
                    <span className="font-sans text-[9px] uppercase tracking-extreme text-text-secondary bg-white/[0.03] border border-border-subtle px-2.5 py-1">
                      {typo.available} Disponibles
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h4 className="font-display text-3xl text-text-primary mb-2 tracking-wide font-normal group-hover:text-verona-gold transition-colors duration-300">
                    {typo.title}
                  </h4>
                  <div className="flex flex-col gap-1 mb-4">
                    <span className="font-sans text-[10px] uppercase tracking-widest text-text-secondary">
                      {typo.sub}
                    </span>
                    <span className="font-sans text-sm font-semibold text-verona-gold mt-2">
                      {typo.price}
                    </span>
                  </div>
                </div>

                {/* Specs overview footer */}
                <div>
                  <div className="pt-6 border-t border-border-subtle flex justify-between text-xs mb-6">
                    <div>
                      <span className="text-text-secondary font-light block">Total</span>
                      <span className="font-sans font-medium text-text-primary">{typo.totalArea} m²</span>
                    </div>
                    <div>
                      <span className="text-text-secondary font-light block">Cubierta</span>
                      <span className="font-sans font-medium text-text-primary">{typo.coveredArea} m²</span>
                    </div>
                    <div>
                      <span className="text-text-secondary font-light block">Cochera</span>
                      <span className="font-sans font-medium text-text-primary">{typo.garage ? 'Sí' : 'No'}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="w-full border border-verona-gold/40 group-hover:border-verona-gold group-hover:bg-verona-gold group-hover:text-black text-verona-gold py-3 px-4 text-center font-sans text-[10px] uppercase tracking-extreme transition-all duration-300 flex items-center justify-center gap-2">
                    <span>Ver Ficha & Renders</span>
                    <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Bottom line accent */}
                <div className="absolute bottom-0 left-0 h-[2px] bg-verona-gold w-0 group-hover:w-full transition-all duration-500" />
              </div>
            );
          })}
        </div>

        {/* Technical specifications grid */}
        <div className="w-full border-t border-border-subtle pt-10">
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

      {/* FULL-PAGE TYPOLOGY DETAIL MODAL ("NUEVA PESTAÑA") MOUNTED DIRECTLY TO DOCUMENT.BODY */}
      {mounted && selectedModalTypo && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[100] bg-verona-bg/98 backdrop-blur-xl overflow-y-auto select-none cursor-none flex flex-col justify-between"
          >
            {/* Top Navigation Bar inside Modal */}
            <div className="sticky top-0 z-30 w-full bg-verona-bg/90 border-b border-border-subtle backdrop-blur-md px-6 md:px-12 py-4 flex items-center justify-between">
              {/* Return button */}
              <button
                onClick={() => setSelectedModalTypo(null)}
                className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-extreme text-text-secondary hover:text-verona-gold transition-colors duration-300 cursor-none"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Volver a Unidades</span>
              </button>

              {/* Central Typology Tabs within Modal */}
              <div className="flex items-center gap-2">
                {typologies.map((t) => {
                  const isActive = t.id === selectedModalTypo.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedModalTypo(t)}
                      className={`px-3 md:px-5 py-2 text-[10px] md:text-xs font-sans tracking-wider uppercase transition-all duration-300 cursor-none border ${
                        isActive
                          ? 'bg-verona-gold text-black font-semibold border-verona-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                          : 'bg-black/30 text-text-secondary hover:text-verona-gold border-white/10 hover:border-verona-gold/40'
                      }`}
                    >
                      {t.title}
                    </button>
                  );
                })}
              </div>

              {/* Close (X) button */}
              <button
                onClick={() => setSelectedModalTypo(null)}
                className="w-10 h-10 border border-white/10 hover:border-verona-gold text-text-secondary hover:text-verona-gold transition-all duration-300 flex items-center justify-center cursor-none bg-black/20"
                aria-label="Cerrar ventana"
              >
                <X size={18} />
              </button>
            </div>

            {/* Main Modal Body */}
            <div className="max-w-5xl mx-auto w-full px-6 md:px-12 py-12 flex-grow">
              
              {/* Header Title Section */}
              <div className="text-center mb-10">
                <span className="font-sans text-[10px] uppercase tracking-extreme text-verona-gold mb-2 block font-semibold">
                  Ficha Completa de Unidad · {selectedModalTypo.floor}
                </span>
                <h2 className="font-display text-4xl md:text-6xl text-text-primary font-light mb-3">
                  {selectedModalTypo.title}
                </h2>
                <p className="font-sans text-sm md:text-base text-text-secondary max-w-lg mx-auto">
                  {selectedModalTypo.sub}
                </p>
                <span className="font-sans text-xl md:text-2xl font-semibold text-verona-gold mt-3 block">
                  Valor: {selectedModalTypo.price}
                </span>
              </div>

              {/* Direct Project Renders Gallery in Upper Sector */}
              <div className="w-full mb-12 border-t border-b border-border-subtle/50 py-6">
                <div className="text-center mb-4">
                  <span className="font-sans text-[10px] uppercase tracking-extreme text-verona-gold font-medium block">
                    Galería de Renders del Proyecto
                  </span>
                </div>
                <InterioresGallery
                  activeFilter={selectedModalTypo.id as FilterId}
                  hideHeader
                  hideTabs
                />
              </div>

              {/* Description & Detailed Features */}
              <div className="max-w-2xl mx-auto text-center mb-12">
                <p className="font-sans text-sm md:text-base text-text-secondary leading-relaxed mb-10">
                  {selectedModalTypo.description}
                </p>

                {/* Specs Features Grid */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-10 max-w-lg mx-auto bg-black/20 p-6 border border-border-subtle">
                  <div className="flex gap-3 items-center justify-center">
                    <Square className="w-4 h-4 text-verona-gold flex-shrink-0" />
                    <span className="font-sans text-xs md:text-sm text-text-primary">
                      {selectedModalTypo.totalArea} m² Sup. Total
                    </span>
                  </div>
                  <div className="flex gap-3 items-center justify-center">
                    <Square className="w-4 h-4 text-verona-gold flex-shrink-0" />
                    <span className="font-sans text-xs md:text-sm text-text-primary">
                      {selectedModalTypo.coveredArea} m² Cubierta
                    </span>
                  </div>
                  <div className="flex gap-3 items-center justify-center">
                    <Shield className="w-4 h-4 text-verona-gold flex-shrink-0" />
                    <span className="font-sans text-xs md:text-sm text-text-primary">
                      {selectedModalTypo.rooms} Ambientes | {selectedModalTypo.bathrooms} {selectedModalTypo.bathrooms === 1 ? 'Baño' : 'Baños'}
                    </span>
                  </div>
                  <div className="flex gap-3 items-center justify-center">
                    <Car className="w-4 h-4 text-verona-gold flex-shrink-0" />
                    <span className="font-sans text-xs md:text-sm text-text-primary">
                      Cochera {selectedModalTypo.garage ? 'Incluida' : 'No disponible'}
                    </span>
                  </div>
                </div>

                {/* Dual Contact CTA Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={getWhatsAppLink(selectedModalTypo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[11px] uppercase tracking-extreme bg-verona-gold text-black font-semibold px-8 py-3.5 hover:bg-white transition-colors duration-300 cursor-none flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageCircle size={16} />
                    <span>Consultar por WhatsApp</span>
                  </a>
                  <button
                    onClick={() => handleConsultar(selectedModalTypo.id)}
                    className="font-sans text-[11px] uppercase tracking-extreme border border-verona-gold px-8 py-3.5 text-verona-gold hover:bg-verona-gold/15 transition-colors duration-300 cursor-none"
                  >
                    Formulario de Contacto
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Footer bar inside Modal */}
            <div className="w-full bg-verona-bg border-t border-border-subtle py-4 px-6 md:px-12 text-center">
              <span className="font-sans text-[10px] uppercase tracking-extreme text-text-secondary/50">
                Verona Castelar Norte · Italia 944
              </span>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
