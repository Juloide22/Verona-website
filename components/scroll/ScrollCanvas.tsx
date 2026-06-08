'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Beat } from '@/config/verona';

interface ScrollCanvasProps {
  folder: string;
  frameCount: number;
  framePad?: number;
  frameExt?: string;
  bgColor?: string;
  scrollHeight?: string;
  beats?: Beat[];
  sectionId?: string;
}

export default function ScrollCanvas({
  folder,
  frameCount,
  framePad = 3,
  frameExt = 'webp',
  bgColor = '#060606',
  scrollHeight = '500vh',
  beats = [],
  sectionId,
}: ScrollCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [usingFallback, setUsingFallback] = useState(false);
  const [progress, setProgress] = useState(0);

  // Hook scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setProgress(latest);
  });

  // Test the first frame availability to decide if we use fallback or load everything
  useEffect(() => {
    let active = true;
    setLoading(true);

    const testImg = new Image();
    const firstFrameIndex = String(0).padStart(framePad, '0');
    testImg.src = `/${folder}/frame_${firstFrameIndex}.${frameExt}`;

    testImg.onload = () => {
      if (!active) return;
      loadAllImages();
    };

    testImg.onerror = () => {
      if (!active) return;
      console.warn(`Frames not found for folder "/${folder}". Running procedural premium vectors.`);
      setUsingFallback(true);
      setLoading(false);
    };

    const loadAllImages = () => {
      let loadedCount = 0;
      const loadedImages: HTMLImageElement[] = [];

      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        const frameIndex = String(i).padStart(framePad, '0');
        img.src = `/${folder}/frame_${frameIndex}.${frameExt}`;

        img.onload = () => {
          if (!active) return;
          loadedImages[i] = img;
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / frameCount) * 100));
          if (loadedCount === frameCount) {
            setImages(loadedImages);
            setLoading(false);
          }
        };

        img.onerror = () => {
          if (!active) return;
          // Even if some load fails, keep compiling what we have
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / frameCount) * 100));
          if (loadedCount === frameCount) {
            setImages(loadedImages);
            setLoading(false);
          }
        };
      }
    };

    return () => {
      active = false;
    };
  }, [folder, frameCount, framePad, frameExt]);

  // Procedural vector zoom drawings
  const drawZoomFallback = (ctx: CanvasRenderingContext2D, width: number, height: number, prog: number) => {
    const cx = width / 2;
    const cy = height / 2;
    const goldColor = '#b8975a';

    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';

    // Scaling grid mapping
    const zoomScale = 1 + prog * 4.5;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(zoomScale, zoomScale);
    ctx.strokeStyle = 'rgba(184, 151, 90, 0.08)';

    const gridSize = 80;
    for (let x = -width; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, -height);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = -height; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(-width, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Street schematic block shapes
    ctx.strokeStyle = 'rgba(184, 151, 90, 0.15)';
    ctx.beginPath();
    ctx.moveTo(-width, -100);
    ctx.lineTo(width, 100);
    ctx.moveTo(-200, -height);
    ctx.lineTo(100, height);
    ctx.stroke();

    // Verona parcel
    if (prog > 0.5) {
      ctx.fillStyle = 'rgba(184, 151, 90, 0.12)';
      ctx.strokeStyle = goldColor;
      ctx.lineWidth = 1.5 / zoomScale;
      ctx.fillRect(-15, -15, 30, 30);
      ctx.strokeRect(-15, -15, 30, 30);
    }
    ctx.restore();

    // Static overlay HUD
    ctx.strokeStyle = 'rgba(184, 151, 90, 0.2)';
    ctx.beginPath();
    ctx.moveTo(40, cy);
    ctx.lineTo(width - 40, cy);
    ctx.moveTo(cx, 40);
    ctx.lineTo(cx, height - 40);
    ctx.stroke();

    const baseRadius = Math.min(width, height) * 0.15;
    ctx.beginPath();
    ctx.arc(cx, cy, baseRadius * 2, 0, Math.PI * 2);
    ctx.arc(cx, cy, baseRadius * 1.2, 0, Math.PI * 2);
    ctx.stroke();

    // Rotating HUD sweeping scanner line
    const angle = (Date.now() / 2500) % (Math.PI * 2);
    ctx.strokeStyle = 'rgba(184, 151, 90, 0.06)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * baseRadius * 2, cy + Math.sin(angle) * baseRadius * 2);
    ctx.stroke();

    // Top-left dashboard HUD text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px Courier New, monospace';
    ctx.fillText('SYS: SAT-LOCATOR | COMPILING Castelar Norte', 50, 60);
    ctx.fillText(`MAGNIFICATION: ${(zoomScale * 100).toFixed(0)}%`, 50, 78);
    ctx.fillText('TARGET COORDS: 34°39\'36.4"S 58°37\'12.1"W', 50, 96);

    // Pulsing target locator
    if (prog > 0.6) {
      const pulse = 6 + Math.sin(Date.now() / 200) * 3;
      ctx.fillStyle = goldColor;
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = goldColor;
      ctx.beginPath();
      ctx.arc(cx, cy, pulse, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = goldColor;
      ctx.font = '12px var(--font-display), serif';
      ctx.fillText('EDIFICIO VERONA', cx + 20, cy - 5);
    }
  };

  // Procedural vector construction sequence drawings
  const drawConstructionFallback = (ctx: CanvasRenderingContext2D, width: number, height: number, prog: number) => {
    const cx = width / 2;
    const cy = height * 0.72; // Anchored closer to the bottom
    const bWidth = Math.min(width * 0.6, 420);
    const bHeight = Math.min(height * 0.45, 320);
    const floorHeight = bHeight / 4;
    const goldColor = '#b8975a';

    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';

    // HUD overlays
    ctx.font = '10px Courier New, monospace';
    ctx.fillText('ENGINEERING MODEL: SECCIÓN CONSTRUCTIVA', 50, 60);
    ctx.fillText(`ESTRUCTURA INTEGRAL: ${(prog * 100).toFixed(0)}%`, 50, 78);

    let stepText = '';
    if (prog < 0.15) stepText = 'FASE 1: EXCAVACIÓN Y PREPARACIÓN DEL SUELO';
    else if (prog < 0.35) stepText = 'FASE 2: ESTRUCTURA HORMIGÓN ARMADO (PISOS 1-4)';
    else if (prog < 0.52) stepText = 'FASE 3: MAMPOSTERÍA Y ADAPTACIONES INTERIORES';
    else if (prog < 0.68) stepText = 'FASE 4: PARRILLAS Y TERRAZAS EXCLUSIVAS';
    else if (prog < 0.84) stepText = 'FASE 5: COLOCACIÓN DE MADERAS Y CUARZOS';
    else stepText = 'FASE 6: FINALIZADO - APTO ENTREGA 2026';

    ctx.fillStyle = goldColor;
    ctx.fillText(stepText, 50, 96);

    // Ground plane
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(cx - bWidth, cy);
    ctx.lineTo(cx + bWidth, cy);
    ctx.stroke();

    // Foundations excavation
    if (prog > 0.02) {
      const fProg = Math.min(prog / 0.15, 1);
      ctx.strokeStyle = 'rgba(184, 151, 90, 0.3)';
      ctx.beginPath();
      ctx.moveTo(cx - bWidth * 0.8, cy);
      ctx.lineTo(cx - bWidth * 0.8, cy + 25 * fProg);
      ctx.lineTo(cx + bWidth * 0.8, cy + 25 * fProg);
      ctx.lineTo(cx + bWidth * 0.8, cy);
      ctx.stroke();

      // Foundation structural piles
      for (let x = cx - bWidth * 0.6; x <= cx + bWidth * 0.6; x += bWidth * 0.4) {
        ctx.beginPath();
        ctx.moveTo(x, cy);
        ctx.lineTo(x, cy + 40 * fProg);
        ctx.stroke();
      }
    }

    // Columns & Floor Slabs (Structure)
    if (prog >= 0.15) {
      const sProg = Math.min((prog - 0.15) / 0.20, 1); // maps 0.15-0.35 to 0-1
      const columnsCount = 5;

      for (let f = 0; f < 4; f++) {
        const slabY = cy - f * floorHeight;
        const targetSlabY = cy - (f + 1) * floorHeight;
        const floorProgress = Math.max(0, Math.min(sProg * 4 - f, 1));

        if (floorProgress > 0) {
          // Horizontal slab
          ctx.strokeStyle = 'rgba(184, 151, 90, 0.7)';
          ctx.beginPath();
          ctx.moveTo(cx - bWidth / 2, targetSlabY);
          ctx.lineTo(cx - bWidth / 2 + bWidth * floorProgress, targetSlabY);
          ctx.stroke();

          // Vertical columns
          ctx.strokeStyle = 'rgba(184, 151, 90, 0.35)';
          for (let col = 0; col < columnsCount; col++) {
            const colX = cx - bWidth / 2 + col * (bWidth / (columnsCount - 1));
            ctx.beginPath();
            ctx.moveTo(colX, slabY);
            ctx.lineTo(colX, slabY - floorHeight * floorProgress);
            ctx.stroke();
          }
        }
      }
    }

    // Partition walls & window wireframes
    if (prog >= 0.35) {
      const uProg = Math.min((prog - 0.35) / 0.17, 1); // 0.35 to 0.52
      ctx.strokeStyle = 'rgba(184, 151, 90, 0.2)';

      for (let f = 0; f < 4; f++) {
        const slabY = cy - f * floorHeight;
        const targetSlabY = cy - (f + 1) * floorHeight;

        if (uProg > f / 4) {
          // Divisions
          ctx.beginPath();
          ctx.moveTo(cx - bWidth * 0.25, slabY);
          ctx.lineTo(cx - bWidth * 0.25, targetSlabY);
          ctx.moveTo(cx, slabY);
          ctx.lineTo(cx, targetSlabY);
          ctx.moveTo(cx + bWidth * 0.25, slabY);
          ctx.lineTo(cx + bWidth * 0.25, targetSlabY);
          ctx.stroke();

          // Windows bounding boxes
          ctx.strokeStyle = 'rgba(184, 151, 90, 0.35)';
          ctx.strokeRect(cx - bWidth * 0.42, slabY - floorHeight * 0.75, 25, 20);
          ctx.strokeRect(cx - bWidth * 0.16, slabY - floorHeight * 0.75, 25, 20);
          ctx.strokeRect(cx + bWidth * 0.08, slabY - floorHeight * 0.75, 25, 20);
          ctx.strokeRect(cx + bWidth * 0.32, slabY - floorHeight * 0.75, 25, 20);
        }
      }
    }

    // Top terraces structures
    if (prog >= 0.52) {
      const tProg = Math.min((prog - 0.52) / 0.16, 1); // 0.52 to 0.68
      ctx.strokeStyle = goldColor;
      const roofY = cy - bHeight;

      // Rooftop railing
      ctx.beginPath();
      ctx.moveTo(cx - bWidth / 2, roofY);
      ctx.lineTo(cx - bWidth / 2, roofY - 14 * tProg);
      ctx.lineTo(cx + bWidth / 2, roofY - 14 * tProg);
      ctx.lineTo(cx + bWidth / 2, roofY);
      ctx.stroke();

      // Rooftop pergola columns
      ctx.beginPath();
      ctx.moveTo(cx - bWidth * 0.25, roofY);
      ctx.lineTo(cx - bWidth * 0.25, roofY - 22 * tProg);
      ctx.lineTo(cx - bWidth * 0.05, roofY - 22 * tProg);
      ctx.lineTo(cx - bWidth * 0.05, roofY);
      ctx.stroke();

      // Outdoor grill (Parrilla) outline
      ctx.strokeRect(cx + bWidth * 0.22, roofY - 24 * tProg, 16, 24);
    }

    // Windows & finishes detail overlays
    if (prog >= 0.68) {
      const fnProg = Math.min((prog - 0.68) / 0.16, 1);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';

      for (let f = 0; f < 4; f++) {
        const slabY = cy - f * floorHeight;
        ctx.beginPath();
        // Glass diagonals
        ctx.moveTo(cx - bWidth * 0.38, slabY - 20);
        ctx.lineTo(cx - bWidth * 0.38 + 8 * fnProg, slabY - 20 - 12 * fnProg);

        ctx.moveTo(cx + bWidth * 0.12, slabY - 20);
        ctx.lineTo(cx + bWidth * 0.12 + 8 * fnProg, slabY - 20 - 12 * fnProg);
        ctx.stroke();
      }
    }

    // Building Completed highlight and indicators
    if (prog >= 0.84) {
      const glowProg = Math.min((prog - 0.84) / 0.16, 1);
      ctx.fillStyle = `rgba(184, 151, 90, ${0.04 * glowProg})`;
      ctx.fillRect(cx - bWidth / 2, cy - bHeight, bWidth, bHeight);

      ctx.fillStyle = goldColor;
      ctx.font = '9px Courier New, monospace';
      ctx.fillText('PLANTA EXCLUSIVA 4° PISO', cx - bWidth / 2 - 130, cy - bHeight + 25);
      ctx.fillText('TERRAZAS PRIVADAS C/PARRILLA', cx - bWidth / 2 - 130, cy - bHeight + 45);
      ctx.fillText('ENTREGA PREVISTA 2026', cx + bWidth / 2 + 20, cy - 20);

      ctx.beginPath();
      ctx.arc(cx - bWidth / 2, cy - bHeight + 20, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Central draw coordinator
  const draw = useCallback(
    (prog: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set pixel values
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!usingFallback && images.length > 0) {
        const frameIndex = Math.min(Math.floor(prog * frameCount), frameCount - 1);
        const img = images[frameIndex];
        if (img) {
          const canvasRatio = canvas.width / canvas.height;
          const imgRatio = img.width / img.height;
          let drawWidth = canvas.width;
          let drawHeight = canvas.height;
          let drawX = 0;
          let drawY = 0;

          if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            drawY = (canvas.height - drawHeight) / 2;
          } else {
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgRatio;
            drawX = (canvas.width - drawWidth) / 2;
          }

          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        }
      } else {
        if (folder.includes('zoom')) {
          drawZoomFallback(ctx, canvas.width, canvas.height, prog);
        } else {
          drawConstructionFallback(ctx, canvas.width, canvas.height, prog);
        }
      }
    },
    [usingFallback, images, frameCount, bgColor, folder]
  );

  // Resize listener setup
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      draw(progress);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [draw, progress]);

  // Redraw when progress changes
  useEffect(() => {
    draw(progress);
  }, [progress, draw]);

  // Compute active beat based on scroll progress
  const activeBeat = beats.find(
    (beat) => progress >= beat.progressStart && progress <= beat.progressEnd
  );

  // Map alignments to classes
  const getAlignmentClasses = (align: 'center' | 'left' | 'right') => {
    switch (align) {
      case 'left':
        return 'left-6 md:left-24 text-left max-w-xs md:max-w-md';
      case 'right':
        return 'right-6 md:right-24 text-right max-w-xs md:max-w-md ml-auto';
      default:
        return 'left-1/2 -translate-x-1/2 text-center max-w-md';
    }
  };

  return (
    <div ref={containerRef} id={sectionId} className="relative w-full" style={{ height: scrollHeight }}>
      {/* Sticky Canvas Wrap */}
      <div className="sticky top-0 h-screen w-full bg-verona-bg overflow-hidden flex items-center justify-center">
        
        {/* Loading Overlay */}
        {loading && !usingFallback && (
          <div className="absolute inset-0 z-30 bg-verona-bg flex flex-col justify-center items-center gap-4">
            <span className="font-sans text-[11px] uppercase tracking-extreme text-verona-gold font-medium">
              Cargando Verona
            </span>
            <div className="w-48 h-[1px] bg-border-subtle overflow-hidden">
              <motion.div
                className="h-full bg-verona-gold"
                initial={{ width: 0 }}
                animate={{ width: `${loadProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="font-sans text-[9px] tracking-widest text-text-secondary">
              {loadProgress}%
            </span>
          </div>
        )}

        {/* The Scrollytelling Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover block z-10" />

        {/* Progress bar on the left edge */}
        <div className="absolute left-0 top-0 h-full w-[1px] bg-white/5 z-20">
          <div
            className="w-full bg-verona-gold transition-all duration-75 origin-top"
            style={{ height: `${progress * 100}%` }}
          />
        </div>

        {/* Text Beats Overlay */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 pointer-events-none px-6 md:px-12 w-full max-w-5xl flex items-center">
          <div className="w-full relative">
            <AnimatePresence mode="wait">
              {activeBeat && (
                <motion.div
                  key={`${activeBeat.label}-${activeBeat.headline}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`absolute w-full [text-shadow:0_2px_10px_rgba(7,17,37,0.95)] ${getAlignmentClasses(activeBeat.align)}`}
                >
                  <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-extreme text-verona-gold font-semibold mb-3 block">
                    {activeBeat.label}
                  </span>
                  <h3 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-text-primary leading-tight tracking-wide whitespace-pre-line mb-4">
                    {activeBeat.headline}
                  </h3>
                  {activeBeat.body && (
                    <p className="font-sans text-xs md:text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                      {activeBeat.body}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Aesthetic overlay grain lines or grid indices */}
        <div className="absolute inset-0 pointer-events-none border border-border-subtle z-25" />
      </div>
    </div>
  );
}
