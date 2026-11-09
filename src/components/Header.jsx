import { useState } from 'react';
import { Accessibility } from 'lucide-react';
import logoImg from '../assets/images/ModeloA_Semnome.jpg';
import A11yModal from './A11yModal';

export default function Header() {
  const [showA11y, setShowA11y] = useState(false);

  // Rola até a seção sem alterar o hash (o app usa rotas por hash).
  // Se o usuário estiver em outra tela, volta para a landing e rola em seguida.
  const goTo = (id) => (e) => {
    e.preventDefault();
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    if (document.getElementById(id)) {
      scroll();
    } else {
      window.location.hash = '#/';
      setTimeout(scroll, 150);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-line px-6 py-4">
        <div className="mx-auto flex max-w-360 items-center justify-between">
          <a href="#/" className="flex items-center gap-3">
            <img src={logoImg} alt="FonoSync Logo" className="h-9 w-auto rounded object-contain" />
            <span className="font-serif font-bold text-xl text-navy">FonoSync</span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-ink">
            <a href="#sobre" onClick={goTo('sobre')} className="hover:text-primary transition-colors">Sobre</a>
            <a href="#recursos" onClick={goTo('recursos')} className="hover:text-primary transition-colors">Recursos</a>
            <a href="#beneficios" onClick={goTo('beneficios')} className="hover:text-primary transition-colors">Benefícios</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowA11y(true)}
              className="px-3.5 py-2 rounded-lg border border-navy text-navy font-bold text-xs flex items-center gap-1.5 hover:bg-mist transition-colors"
            >
              <Accessibility size={16} /> Acessibilidade
            </button>

            <a
              href="#/acesso"
              className="px-4 py-2 rounded-lg bg-primary text-white font-bold text-xs hover:brightness-90 transition-all shadow-sm"
            >
              Entrar
            </a>
          </div>
        </div>
      </header>

      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />
    </>
  );
}