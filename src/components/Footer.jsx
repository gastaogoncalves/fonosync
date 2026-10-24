import logoImg from '../assets/images/logofonoSemNome.png';

export default function Footer() {
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

        {/* Lado direito: links úteis */}
        <div className="flex flex-col gap-8 text-sm text-on-band-muted sm:flex-row">
          <div className="flex flex-col gap-3">
            <a href="#pesquisa" className="rounded-md transition-colors hover:text-white">
              Pesquisa e validação
            </a>
            <a href="#privacidade" className="rounded-md transition-colors hover:text-white">
              Privacidade e LGPD
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <a href="#acessibilidade" className="rounded-md transition-colors hover:text-white">
              Acessibilidade
            </a>
            <a href="#contato" className="rounded-md transition-colors hover:text-white">
              Contato acadêmico
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
