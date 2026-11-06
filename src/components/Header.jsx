import { useState } from 'react';
import { PersonStanding, Volume2 } from 'lucide-react';
import logoImg from '../assets/images/ModeloA_Semnome.jpg';
import A11yModal from './A11yModal';
import { buttonClass } from './buttonStyles';
import { useA11y } from '../hooks/useA11y';

const links = [
  { label: 'Plataforma', href: '#plataforma' },
  { label: 'Soluções', href: '#solucao' },
  { label: 'Jogos', href: '#jogos' },
  { label: 'Para Escolas', href: '#escolas' },
];

export default function Header() {
  const [showA11y, setShowA11y] = useState(false);
  const { speakPageContent, isPlayerOpen } = useA11y();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-surface/95 px-6 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-360 items-center justify-between gap-4">
          <a href="#/" className="flex items-center gap-3">
            <img src={logoImg} alt="FonoSync Logo" className="h-9 w-auto rounded object-contain" />
            <span className="font-serif text-xl font-bold text-navy">FonoSync</span>
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex gap-6">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm font-semibold text-ink decoration-2 underline-offset-4 hover:text-primary hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowA11y(true)} className={buttonClass('secondary')}>
              <PersonStanding size={16} aria-hidden="true" />
              <span className="hidden sm:inline">Acessibilidade</span>
              <span className="sr-only sm:hidden">Acessibilidade</span>
            </button>
            <span className="hidden md:inline-flex">
              <button
                type="button"
                aria-pressed={isPlayerOpen}
                onClick={() => speakPageContent()}
                className={buttonClass(isPlayerOpen ? 'primary' : 'tertiary')}
              >
                <Volume2 size={16} aria-hidden="true" />
                Ouvir página
              </button>
            </span>
            <a href="#/acesso" className={buttonClass('primary')}>
              Entrar
            </a>
          </div>
        </div>
      </header>

      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />
    </>
  );
}
