import { useState } from 'react';
import logoImg from '../assets/images/ModeloA_Semnome.jpg';
import A11yModal from './A11yModal';
import Button from './Button';
import InfoDialog from './InfoDialog';
import Notice from './Notice';
import { INFO_PAGES } from '../utils/constants';

const fieldClass = 'min-h-11 w-full rounded-md border border-muted/60 bg-surface px-3 text-sm text-ink';

function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div role="status">
        <Notice tone="success" title="Mensagem recebida">
          Obrigado pelo contato. Responderemos em breve.
        </Notice>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
      className="flex flex-col gap-3"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contato-nome" className="font-bold text-ink">Nome</label>
        <input id="contato-nome" type="text" required className={fieldClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contato-email" className="font-bold text-ink">E-mail</label>
        <input id="contato-email" type="email" required className={fieldClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contato-mensagem" className="font-bold text-ink">Mensagem</label>
        <textarea id="contato-mensagem" rows={4} required className={`${fieldClass} py-2`} />
      </div>
      <div>
        <Button variant="primary" type="submit">Enviar mensagem</Button>
      </div>
    </form>
  );
}

export default function Footer() {
  const [dialog, setDialog] = useState(null); // 'pesquisa' | 'privacidade' | 'contato' | null
  const [showA11y, setShowA11y] = useState(false);

  const info = dialog && dialog !== 'contato' ? INFO_PAGES[dialog] : null;
  const linkClass = 'rounded-md text-left underline-offset-4 transition-colors hover:text-white hover:underline';

  return (
    <footer className="bg-band py-12 text-white">
      <div className="mx-auto flex max-w-360 flex-col items-start justify-between gap-8 px-18 md:flex-row">
        <div className="max-w-md">
          <div className="mb-4 flex items-center gap-2">
            <div className="relative h-20 w-20">
              <div className="absolute top-[35%] left-[50%] h-8 w-8 -translate-x-1/2 -translate-y-2 rounded-full bg-white"></div>
              <img src={logoImg} alt="" className="relative z-10 h-20 w-20 object-contain" />
            </div>
            <span className="font-serif text-xl">FonoSync</span>
          </div>
          <p className="text-sm leading-relaxed text-on-band-muted">
            Plataforma acadêmico-clínica para apoio à terapia fonoaudiológica. Triagem não substitui avaliação profissional.
          </p>
        </div>

        <nav aria-label="Links úteis" className="flex flex-col gap-8 text-sm text-on-band-muted sm:flex-row">
          <div className="flex flex-col items-start gap-3">
            <button type="button" onClick={() => setDialog('pesquisa')} className={linkClass}>
              Pesquisa e validação
            </button>
            <button type="button" onClick={() => setDialog('privacidade')} className={linkClass}>
              Privacidade e LGPD
            </button>
          </div>
          <div className="flex flex-col items-start gap-3">
            <button type="button" onClick={() => setShowA11y(true)} className={linkClass}>
              Acessibilidade
            </button>
            <button type="button" onClick={() => setDialog('contato')} className={linkClass}>
              Contato acadêmico
            </button>
          </div>
        </nav>
      </div>

      <InfoDialog isOpen={Boolean(info)} onClose={() => setDialog(null)} title={info?.title ?? ''}>
        {info?.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </InfoDialog>

      <InfoDialog isOpen={dialog === 'contato'} onClose={() => setDialog(null)} title="Contato acadêmico" footer={false}>
        <ContactForm />
      </InfoDialog>

      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />
    </footer>
  );
}