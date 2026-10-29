import React from 'react';
import logoImg from '../assets/images/logofonoSemNome.png';

export default function Header() {
  return (
    <header className="bg-white border-b border-[var(--color-line)] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#/" className="flex items-center gap-3">
          <img 
            src={logoImg} 
            alt="FonoSync Logo" 
            className="h-12 w-auto rounded-lg object-contain shadow-sm" 
          />
          <span className="font-serif font-bold text-xl text-[var(--color-navy)] hidden sm:inline">
            FonoSync
          </span>
        </a>

        <nav className="flex items-center gap-4">
          <a 
            href="#/acesso" 
            className="px-5 py-2.5 bg-[var(--color-primary)] text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md"
          >
            Acessar Plataforma
          </a>
        </nav>
      </div>
    </header>
  );
}