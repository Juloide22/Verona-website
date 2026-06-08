import React from 'react';

interface SectionDividerProps {
  number: string;
  title: string;
  subtitle?: string;
  id?: string;
}

export default function SectionDivider({ number, title, subtitle, id }: SectionDividerProps) {
  return (
    <div
      id={id}
      className="w-full bg-verona-bg pt-28 pb-12 px-6 md:px-12 max-w-5xl mx-auto border-t border-border-subtle"
    >
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-6">
          <span className="font-sans text-xs tracking-extreme text-verona-gold uppercase font-semibold">
            {number}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-light tracking-wide text-text-primary">
            {title}
          </h2>
        </div>
        {subtitle && (
          <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-extreme text-text-secondary">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
