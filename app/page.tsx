import Nav from '@/components/ui/Nav';
import Hero from '@/components/sections/Hero';
import SectionDivider from '@/components/ui/SectionDivider';
import ScrollCanvas from '@/components/scroll/ScrollCanvas';
import InterioresGallery from '@/components/sections/InterioresGallery';
import Viewer360 from '@/components/sections/Viewer360';
import Tipologias from '@/components/sections/Tipologias';
import Contacto from '@/components/sections/Contacto';
import { veronaConfig } from '@/config/verona';

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-verona-bg selection:bg-verona-gold/20 selection:text-text-primary">
      {/* Sticky Top Header Navigation */}
      <Nav />

      {/* Main Experience Layout */}
      <main className="w-full">
        {/* HERO SECTION */}
        <Hero />

        {/* SECTION 1 - ZOOM SATELITAL (Ubicación) */}
        <SectionDivider
          number="01"
          title="Ubicación"
          subtitle="Castelar Norte · Buenos Aires"
          id="ubicacion-divider"
        />
        <ScrollCanvas
          folder="zoom"
          frameCount={90}
          beats={veronaConfig.zoomBeats}
          scrollHeight="400vh"
          sectionId="ubicacion"
        />

        {/* SECTION 2 - SECUENCIA CONSTRUCTIVA (El Edificio) */}
        <SectionDivider
          number="02"
          title="El Edificio"
          subtitle="Secuencia constructiva"
          id="edificio-divider"
        />
        <ScrollCanvas
          folder="construccion"
          frameCount={60}
          frameExt="jpg"
          beats={veronaConfig.constructionBeats}
          scrollHeight="500vh"
          sectionId="edificio"
        />

        {/* SECTION 3 - GALERÍA DE INTERIORES */}
        <SectionDivider
          number="03"
          title="Interiores"
          subtitle="Renders y acabados"
          id="interiores-divider"
        />
        <InterioresGallery />

        {/* SECTION 4 - VISOR 360° */}
        <SectionDivider
          number="04"
          title="Experiencia 360°"
          subtitle="Entorno inmersivo"
          id="360-divider"
        />
        <Viewer360 />

        {/* SECTION 5 - TIPOLOGÍAS (Unidades) */}
        <SectionDivider
          number="05"
          title="Unidades"
          subtitle="3 y 4 ambientes"
          id="unidades-divider"
        />
        <Tipologias />

        {/* SECTION 6 - CONTACTO & FOOTER */}
        <Contacto />
      </main>
    </div>
  );
}
