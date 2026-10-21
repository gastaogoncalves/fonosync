import React from 'react';
import logoImg from '../assets/images/logofonoSemNome.png';

export default function Footer() {
  return (
    <footer className="bg-[#103D5A] text-white py-12 border-t border-[#0b2b40]">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="max-w-md">
            <div className="flex items-center gap-2 mb-4">
                <div className="relative w-20 h-20">
                    <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-2 w-8 h-8 bg-white rounded-full"></div>
        <img src={logoImg} alt="Logótipo FonoSync" className="relative z-10 w-20 h-20 object-contain"/>
    </div>

    <span className="text-xl font-bold font-serif">FonoSync</span>
  </div>
          <p className="text-sm text-blue-200/80 leading-relaxed">
            Plataforma acadêmico-clínica para apoio à terapia fonoaudiológica. Triagem não substitui avaliação profissional.
          </p>  
        </div>

        {/* Lado Direito: Links Úteis[cite: 8] */}
        <div className="flex flex-col sm:flex-row gap-8 text-sm text-blue-200/80">
          <div className="flex flex-col gap-3">
            <a href="#pesquisa" className="hover:text-white transition-colors focus:ring-2 focus:ring-amber-500 rounded outline-none">
              Pesquisa e validação
            </a>
            <a href="#privacidade" className="hover:text-white transition-colors focus:ring-2 focus:ring-amber-500 rounded outline-none">
              Privacidade e LGPD
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <a href="#acessibilidade" className="hover:text-white transition-colors focus:ring-2 focus:ring-amber-500 rounded outline-none">
              Acessibilidade
            </a>
            <a href="#contato" className="hover:text-white transition-colors focus:ring-2 focus:ring-amber-500 rounded outline-none">
              Contato acadêmico
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}