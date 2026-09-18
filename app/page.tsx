'use client';

import { useState } from 'react';
import Nav from '@/components/ui/Nav';
import Hero from '@/components/sections/Hero';
import SectionDivider from '@/components/ui/SectionDivider';
import Viewer360 from '@/components/sections/Viewer360';
import Tipologias from '@/components/sections/Tipologias';
import Contacto from '@/components/sections/Contacto';

export default function Home() {
  const [isPortalOpen, setIsPortalOpen] = useState(true);

  const handleEnterProject = (targetSectionId: string) => {
    setIsPortalOpen(false);
    setTimeout(() => {
      const el = document.getElementById(targetSectionId);
      if (el) {
        const yOffset = -20;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
      }
    }, 50);
  };

  const handleReturnToPortal = () => {
    setIsPortalOpen(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="relative w-full min-h-screen bg-verona-bg selection:bg-verona-gold/20 selection:text-text-primary">
      {/* Intro Portal Full-screen Video Landing Page */}
      {isPortalOpen && (
        <Hero isPortalOpen={true} onEnterProject={handleEnterProject} />
      )}

      {/* Main Experience Web Application (Unlocked upon clicking CTA button) */}
      {!isPortalOpen && (
        <>
          {/* Sticky Top Header Navigation */}
          <Nav onHomeClick={handleReturnToPortal} />

          <main className="w-full pt-16">
            {/* SECTION 01 - VISOR 360° */}
            <div id="360" className="scroll-mt-24">
              <SectionDivider
                number="01"
                title="Experiencia 360°"
                subtitle="Entorno inmersivo"
                id="360-divider"
              />
              <Viewer360 />
            </div>

            {/* SECTION 02 - UNIDADES & GALERÍA */}
            <div id="unidades" className="scroll-mt-24">
              <SectionDivider
                number="02"
                title="Unidades & Galería"
                subtitle="3 y 4 ambientes con expansiones exclusivas"
                id="unidades-divider"
              />
              <Tipologias />
            </div>

            {/* SECTION 03 - CONTACTO & FOOTER */}
            <div id="contacto" className="scroll-mt-24">
              <Contacto />
            </div>
          </main>
        </>
      )}
    </div>
  );
}
