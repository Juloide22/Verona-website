import type { Metadata } from 'next';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import Cursor from '@/components/ui/Cursor';
import ScrollToTop from '@/components/ui/ScrollToTop';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Verona | Vivir bien diseñado — Castelar Norte · Italia 944',
  description:
    'Un edificio de escala humana en Italia 944, Castelar Norte, Buenos Aires. Diez unidades premium de 3 y 4 ambientes con terrazas privadas y parrilla individual.',
  keywords: [
    'Verona',
    'Castelar Norte',
    'Italia 944',
    'Preventa Inmobiliaria',
    'Real Estate de lujo',
    'Edificio Verona',
    'Zona Oeste',
    'Departamentos Castelar',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${outfit.variable} scroll-smooth`}>
      <body className="bg-verona-bg text-text-primary font-sans antialiased">
        {/* Grain overlay layer */}
        <div className="grain-overlay" />

        {/* Custom cursor (Desktop only) */}
        <Cursor />

        {/* Scroll To Top Button */}
        <ScrollToTop />

        {/* Core application */}
        {children}
      </body>
    </html>
  );
}

