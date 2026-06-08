'use client';

import { useEffect, useRef, useState } from 'react';
import { Orbit, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface PanoramaOption {
  id: string;
  label: string;
  src: string;
}

const PANORAMAS: PanoramaOption[] = [
  { id: 'estar', label: 'Estar Principal', src: '/images/360/panorama.jpg' },
  { id: 'cocina', label: 'Cocina', src: '/images/360/cocina.jpg' },
  { id: 'dormitorio-1', label: 'Dormitorio 1', src: '/images/360/dormitorio-1.jpg' },
  { id: 'dormitorio-2', label: 'Dormitorio 2', src: '/images/360/dormitorio-2.jpg' },
];

export default function Viewer360() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inViewport, setInViewport] = useState(false);
  const [imageExists, setImageExists] = useState<boolean | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [viewerInitialized, setViewerInitialized] = useState(false);
  const [selectedPano, setSelectedPano] = useState<PanoramaOption>(PANORAMAS[0]);

  // Validate panorama image existence (using default)
  useEffect(() => {
    const img = new Image();
    img.src = PANORAMAS[0].src;
    img.onload = () => setImageExists(true);
    img.onerror = () => setImageExists(false);
  }, []);

  // Intersection observer to trigger script injection only when section is in viewport
  useEffect(() => {
    if (imageExists === false) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInViewport(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [imageExists]);

  // Inject Pannellum scripts dynamically
  useEffect(() => {
    if (!inViewport || imageExists !== true) return;

    // Inject CSS
    if (!document.getElementById('pannellum-css')) {
      const link = document.createElement('link');
      link.id = 'pannellum-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
      document.head.appendChild(link);
    }

    // Inject JS
    if (!document.getElementById('pannellum-js')) {
      const script = document.createElement('script');
      script.id = 'pannellum-js';
      script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      const checkPannellum = setInterval(() => {
        if ((window as any).pannellum) {
          setScriptLoaded(true);
          clearInterval(checkPannellum);
        }
      }, 100);
      return () => clearInterval(checkPannellum);
    }
  }, [inViewport, imageExists]);

  // Initialize Pannellum Viewer
  useEffect(() => {
    if (!scriptLoaded || !inViewport || imageExists !== true) return;

    const pnl = (window as any).pannellum;
    if (pnl) {
      let viewer: any = null;
      try {
        setViewerInitialized(false);
        viewer = pnl.viewer('pannellum-container', {
          type: 'equirectangular',
          panorama: selectedPano.src,
          autoLoad: true,
          autoRotate: -2,
          hfov: 100,
          showZoomCtrl: false,
          showFullscreenCtrl: false,
          compass: false,
          mouseZoom: false,
          keyboardZoom: false,
        });

        // Set initialized when loaded
        viewer.on('load', () => {
          setViewerInitialized(true);
        });

        // Safety timeout to avoid getting stuck on black screen if load event is missed
        const safetyTimeout = setTimeout(() => {
          setViewerInitialized(true);
        }, 1500);

        return () => {
          clearTimeout(safetyTimeout);
          if (viewer) {
            try {
              viewer.destroy();
            } catch (e) {
              // catch silent errors
            }
          }
          setViewerInitialized(false);
        };
      } catch (err) {
        console.error('Failed to initialize Pannellum:', err);
        setViewerInitialized(true);
      }
    }
  }, [scriptLoaded, inViewport, imageExists, selectedPano]);

  const handlePanoChange = (option: PanoramaOption) => {
    if (option.id === selectedPano.id) return;
    setViewerInitialized(false); // Immediate fade-to-black transition triggers
    setSelectedPano(option);
  };

  return (
    <section
      ref={sectionRef}
      id="360"
      className="w-full h-screen relative bg-verona-bg border-t border-border-subtle overflow-hidden"
    >
      {/* Top subtle dark gradient overlay for text readability */}
      <div className="absolute top-0 left-0 w-full h-44 bg-gradient-to-b from-[#071125]/85 to-transparent z-15 pointer-events-none" />

      {/* Absolute Overlay Heading */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-25 text-center w-full px-6 pointer-events-none [text-shadow:0_2px_10px_rgba(7,17,37,0.95)]">
        <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-extreme text-verona-gold font-semibold mb-3 block">
          Experiencia 360°
        </span>
        <h3 className="font-display text-4xl md:text-5xl font-light text-text-primary leading-tight">
          Entrá al espacio <br className="hidden md:block" />
          antes de que exista.
        </h3>
      </div>

      {/* Floating Panorama Selector HUD (Always visible for fluid control) */}
      {imageExists === true && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-35 flex flex-wrap gap-2 md:gap-3 bg-[#071125]/80 backdrop-blur-md px-4 py-3 border border-border-subtle rounded-full max-w-[90vw] justify-center shadow-lg shadow-black/40">
          {PANORAMAS.map((option) => {
            const isActive = selectedPano.id === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handlePanoChange(option)}
                className={`font-sans text-[9px] md:text-[10px] uppercase tracking-extreme px-4 py-2 rounded-full border transition-all duration-300 cursor-none ${
                  isActive
                    ? 'border-verona-gold text-verona-gold bg-verona-gold/10 font-medium'
                    : 'border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Full Screen Viewer Container */}
      <div className="w-full h-full bg-[#050d1a] relative flex items-center justify-center overflow-hidden">
        
        {/* Main Viewer Render Container */}
        {imageExists === true ? (
          <>
            <div id="pannellum-container" className="w-full h-full relative z-10" />
            
            {/* Smooth Transition Overlay Cover */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: viewerInitialized ? 0 : 1 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute inset-0 bg-[#071125] z-20 flex flex-col items-center justify-center gap-3"
              style={{ pointerEvents: viewerInitialized ? 'none' : 'auto' }}
            >
              <Loader2 className="w-6 h-6 animate-spin text-verona-gold" />
              <span className="font-sans text-[10px] uppercase tracking-extreme text-verona-gold">
                Cargando espacio interactivo
              </span>
            </motion.div>
          </>
        ) : (
          // Placeholder Fallback
          <div className="absolute inset-0 flex flex-col justify-center items-center p-8 bg-[#050d1a]">
            <div className="w-16 h-16 rounded-full border border-verona-gold/10 flex items-center justify-center mb-6 relative">
              <Orbit className="w-6 h-6 text-verona-gold/40 animate-pulse" />
              <div className="absolute inset-0 border border-verona-gold/5 rounded-full animate-ping [animation-duration:3s]" />
            </div>
            <span className="font-sans text-[11px] tracking-extreme text-verona-gold/30 uppercase font-semibold mb-2">
              Experiencia Inmersiva 360°
            </span>
            <span className="font-sans text-xs tracking-widest text-text-secondary">
              Vista 360° próximamente
            </span>
          </div>
        )}

        {/* Bounding HUD Corner Indicators */}
        <div className="absolute top-4 left-4 w-4 h-[1px] bg-verona-gold/30 z-25" />
        <div className="absolute top-4 left-4 w-[1px] h-4 bg-verona-gold/30 z-25" />
        <div className="absolute top-4 right-4 w-4 h-[1px] bg-verona-gold/30 z-25" />
        <div className="absolute top-4 right-4 w-[1px] h-4 bg-verona-gold/30 z-25" />
        <div className="absolute bottom-4 left-4 w-4 h-[1px] bg-verona-gold/30 z-25" />
        <div className="absolute bottom-4 left-4 w-[1px] h-4 bg-verona-gold/30 z-25" />
        <div className="absolute bottom-4 right-4 w-4 h-[1px] bg-verona-gold/30 z-25" />
        <div className="absolute bottom-4 right-4 w-[1px] h-4 bg-verona-gold/30 z-25" />
      </div>
    </section>
  );
}
