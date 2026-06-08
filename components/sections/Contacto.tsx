'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Send, CheckCircle, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';
import { veronaConfig } from '@/config/verona';

export default function Contacto() {
  const { contacto, typologies } = veronaConfig;

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tipologia, setTipologia] = useState('Consulta general');
  const [mensaje, setMensaje] = useState('');

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleSelectTypo = (e: Event) => {
      const customEvent = e as CustomEvent;
      const typoId = customEvent.detail;
      const found = typologies.find((t) => t.id === typoId);
      if (found) {
        setTipologia(found.title);
      } else {
        setTipologia('Consulta general');
      }
    };

    window.addEventListener('verona-select-typology', handleSelectTypo);
    return () => {
      window.removeEventListener('verona-select-typology', handleSelectTypo);
    };
  }, [typologies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) {
      setStatus('error');
      setErrorMessage('Por favor completá los campos obligatorios (Nombre y Email).');
      return;
    }

    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          email,
          telefono,
          tipologia,
          mensaje,
          proyecto: 'Verona',
          fecha: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        setStatus('success');
        setNombre('');
        setEmail('');
        setTelefono('');
        setTipologia('Consulta general');
        setMensaje('');
      } else {
        throw new Error(data.error || 'Ocurrió un error al enviar el formulario.');
      }
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'Error de conexión. Intentá de nuevo.');
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <section id="contacto" className="w-full bg-verona-bg pt-28 border-t border-border-subtle flex flex-col justify-between">
      {/* Strictly aligned outer wrapper to max-w-5xl */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 w-full pb-12">
        
        {/* Centered Heading */}
        <div className="mb-16 text-center">
          <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-extreme text-verona-gold font-medium mb-3 block">
            Contacto
          </span>
          <h3 className="font-display text-4xl md:text-5xl font-light text-text-primary leading-tight">
            Encontrá <br className="hidden md:block" />
            tu lugar en Verona.
          </h3>
        </div>

        {/* Centered Contact Form */}
        <div className="max-w-2xl mx-auto w-full mb-20">
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-verona-gold/30 bg-verona-gold/[0.02] p-8 flex flex-col items-center text-center w-full mx-auto"
            >
              <CheckCircle className="w-12 h-12 text-verona-gold mb-4 stroke-[1]" />
              <h4 className="font-display text-2xl text-text-primary mb-3">Mensaje Recibido</h4>
              <p className="font-sans text-sm text-text-secondary leading-relaxed mb-6">
                Gracias por tu interés en Verona. Nos pondremos en contacto a la brevedad para asesorarte en detalle.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="font-sans text-[10px] uppercase tracking-extreme border border-verona-gold px-6 py-2.5 text-verona-gold hover:bg-verona-gold/15 transition-colors cursor-none"
              >
                Enviar otra consulta
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label htmlFor="nombre" className="font-sans text-[9px] uppercase tracking-extreme text-text-secondary">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    placeholder="Ej: Sofía Rodríguez"
                    className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-text-primary focus:outline-none focus:border-verona-gold/50 transition-colors placeholder:text-white/10 cursor-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-sans text-[9px] uppercase tracking-extreme text-text-secondary">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Ej: sofia@correo.com"
                    className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-text-primary focus:outline-none focus:border-verona-gold/50 transition-colors placeholder:text-white/10 cursor-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label htmlFor="telefono" className="font-sans text-[9px] uppercase tracking-extreme text-text-secondary">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Ej: +54 9 11 1234 5678"
                    className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-text-primary focus:outline-none focus:border-verona-gold/50 transition-colors placeholder:text-white/10 cursor-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="tipologia" className="font-sans text-[9px] uppercase tracking-extreme text-text-secondary">
                    Unidad de Interés
                  </label>
                  <select
                    id="tipologia"
                    value={tipologia}
                    onChange={(e) => setTipologia(e.target.value)}
                    className="w-full bg-verona-bg border-b border-white/10 py-3 text-sm text-text-primary focus:outline-none focus:border-verona-gold/50 transition-colors cursor-none appearance-none"
                  >
                    <option value="Consulta general">Consulta general</option>
                    {typologies.map((t) => (
                      <option key={t.id} value={t.title}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="mensaje" className="font-sans text-[9px] uppercase tracking-extreme text-text-secondary">
                  Mensaje / Consulta
                </label>
                <textarea
                  id="mensaje"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  rows={4}
                  placeholder="Quisiera recibir información sobre formas de pago y financiación..."
                  className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-text-primary focus:outline-none focus:border-verona-gold/50 transition-colors placeholder:text-white/10 resize-none cursor-none"
                />
              </div>

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 text-red-400 text-xs border border-red-500/20 bg-red-500/[0.02] p-4"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              <div className="mt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="font-sans text-[11px] uppercase tracking-extreme border border-verona-gold px-12 py-4 text-verona-gold hover:bg-verona-gold/15 transition-all duration-300 flex items-center gap-3 disabled:opacity-50 cursor-none"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar Consulta
                      <Send className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Centered Horizontal Contact Channels Bar */}
        <div className="w-full border-t border-border-subtle pt-12 mb-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            {/* Whatsapp */}
            <div className="flex flex-col items-center gap-2">
              <Phone className="w-4 h-4 text-verona-gold/60" />
              <span className="font-sans text-[9px] uppercase tracking-widest text-text-secondary">Llamanos o escribinos</span>
              <a
                href={`https://wa.me/${contacto.phoneFormatted}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-lg text-text-primary hover:text-verona-gold transition-colors cursor-none"
              >
                {contacto.phone}
              </a>
            </div>

            {/* Email */}
            <div className="flex flex-col items-center gap-2 md:border-l md:border-r md:border-border-subtle md:px-4">
              <Mail className="w-4 h-4 text-verona-gold/60" />
              <span className="font-sans text-[9px] uppercase tracking-widest text-text-secondary">Correo Directo</span>
              <a
                href={`mailto:${contacto.email}`}
                className="font-display text-lg text-text-primary hover:text-verona-gold transition-colors cursor-none"
              >
                {contacto.email}
              </a>
            </div>

            {/* Location */}
            <div className="flex flex-col items-center gap-2">
              <MapPin className="w-4 h-4 text-verona-gold/60" />
              <span className="font-sans text-[9px] uppercase tracking-widest text-text-secondary">Ubicación</span>
              <a
                href="https://www.google.com/maps/place/Italia+944,+B1712JZH+Castelar,+Provincia+de+Buenos+Aires/@-34.6497956,-58.6468091,174a,35y,282h/data=!3m1!1e3!4m6!3m5!1s0x95bcbf54bf42839b:0x9e3e3ea474920429!8m2!3d-34.6497333!4d-58.6469445!16s%2Fg%2F11ky7ld8xm?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs text-text-primary leading-relaxed max-w-[240px] hover:text-verona-gold transition-colors duration-300 cursor-none"
              >
                {contacto.address}
              </a>
            </div>

          </div>
        </div>

        {/* Centered Construction work progress bar */}
        <div className="max-w-xl mx-auto flex flex-col gap-3 text-center mb-12">
          <div className="flex justify-between items-baseline px-1">
            <span className="font-sans text-[9px] uppercase tracking-extreme text-text-secondary">
              Avance de Obra
            </span>
            <span className="font-sans text-xs font-semibold text-verona-gold">
              {contacto.workProgress}%
            </span>
          </div>
          <div className="w-full h-[2px] bg-white/5 relative overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${contacto.workProgress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full bg-verona-gold"
            />
          </div>
        </div>

      </div>

      {/* Footer strip */}
      <footer className="w-full border-t border-border-subtle py-8 bg-[#040b15]">
        <div className="max-w-5xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <a
              href="https://www.carfi.com.ar/d/64397-VERONA-en-Castelar-Norte"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-xl tracking-widest text-text-primary hover:text-verona-gold transition-colors duration-300 cursor-none"
            >
              VERONA
            </a>
            <span className="font-sans text-[9px] uppercase tracking-extreme text-text-secondary md:border-l md:border-white/10 md:pl-6">
              {currentYear} © Todos los derechos reservados.
            </span>
            <a
              href="https://www.google.com/maps/place/Italia+944,+B1712JZH+Castelar,+Provincia+de+Buenos+Aires/@-34.6497956,-58.6468091,174a,35y,282h/data=!3m1!1e3!4m6!3m5!1s0x95bcbf54bf42839b:0x9e3e3ea474920429!8m2!3d-34.6497333!4d-58.6469445!16s%2Fg%2F11ky7ld8xm?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[9px] uppercase tracking-extreme text-verona-gold/70 md:border-l md:border-white/10 md:pl-6 flex flex-col md:flex-row md:items-center gap-1 md:gap-2 hover:text-verona-gold transition-colors duration-300 cursor-none"
            >
              <span>Castelar Norte · Buenos Aires</span>
              <span className="text-[7.5px] opacity-75 normal-case font-light md:border-l md:border-white/10 md:pl-2">Italia 944</span>
            </a>
          </div>

          <a
            href="https://www.instagram.com/mad__viz/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 opacity-65 hover:opacity-100 transition-opacity duration-300 cursor-none select-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/mad-logo.png" alt="MAD Logo" className="h-3.5 w-auto object-contain" />
            <span className="font-sans text-[9px] uppercase tracking-extreme text-text-secondary font-medium">
              MAD - Experiencias visuales
            </span>
          </a>
        </div>
      </footer>
    </section>
  );
}
