'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Ubicación', href: '#ubicacion' },
    { label: 'El Edificio', href: '#edificio' },
    { label: 'Interiores', href: '#interiores' },
    { label: 'Unidades', href: '#unidades' },
    { label: 'Contacto', href: '#contacto' },
  ];

  return (
    <>
      {/* Floating Centered Capsule Navigation Bar */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl transition-all duration-500 ${
          scrolled
            ? 'top-4 bg-verona-bg/95 border border-verona-gold/30 shadow-[0_8px_32px_rgba(7,17,37,0.8)] py-3 px-6'
            : 'top-6 bg-verona-bg/65 border border-white/5 py-4 px-8'
        } backdrop-blur-md`}
        style={{
          boxShadow: scrolled ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)' : 'none',
        }}
      >
        <div className="flex justify-between items-center w-full">
          {/* Logo Section */}
          <a href="#hero" className="flex items-center gap-4 group cursor-none">
            <span className="font-display text-2xl tracking-widest text-text-primary transition-colors duration-300 group-hover:text-verona-gold">
              VERONA
            </span>
            <span className="h-4 w-[1px] bg-white/10" />
            <span className="font-sans text-[9px] uppercase tracking-extreme text-verona-gold/80 font-medium">
              Castelar Norte
            </span>
          </a>

          {/* Desktop Navigation Links (Centered) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-sans text-[11px] uppercase tracking-extreme text-text-secondary hover:text-verona-gold transition-colors duration-300 cursor-none"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <a
              href="#contacto"
              className="font-sans text-[11px] uppercase tracking-extreme border border-verona-gold px-6 py-2.5 text-verona-gold hover:bg-verona-gold/15 transition-colors duration-300 cursor-none"
            >
              Consultá
            </a>
          </div>

          {/* Mobile Hamburguer Button */}
          <button
            className="md:hidden text-text-primary hover:text-verona-gold transition-colors cursor-none"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-verona-bg z-50 flex flex-col justify-between p-8"
          >
            <div className="flex justify-between items-center">
              <a
                href="#hero"
                className="flex items-center gap-3 cursor-none"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="font-display text-2xl tracking-widest">VERONA</span>
                <span className="h-4 w-[1px] bg-white/10" />
                <span className="font-sans text-[10px] uppercase tracking-extreme text-verona-gold/80 font-medium">
                  Castelar Norte
                </span>
              </a>
              <button
                className="text-text-primary hover:text-verona-gold transition-colors cursor-none"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="flex flex-col gap-8 my-auto">
              {navLinks.map((link, idx) => (
                <motion.a
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display text-3xl tracking-wide text-text-primary hover:text-verona-gold transition-colors duration-300 cursor-none"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <div className="flex flex-col gap-4">
              <a
                href="#contacto"
                onClick={() => setMobileMenuOpen(false)}
                className="font-sans text-[12px] uppercase tracking-extreme border border-verona-gold w-full text-center py-4 text-verona-gold hover:bg-verona-gold/15 transition-colors duration-300 cursor-none"
              >
                Consultar Ahora
              </a>
              <p className="text-[10px] uppercase tracking-extreme text-text-secondary text-center">
                Castelar Norte · Buenos Aires
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
