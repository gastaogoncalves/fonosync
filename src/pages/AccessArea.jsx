import React from 'react';
import { UserCheck, HeartPulse, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function AccessArea() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-band)] via-[var(--color-navy)] to-[var(--color-primary)] flex flex-col justify-center items-center p-6 text-white relative overflow-hidden">
      {/* Elementos decorativos no fundo */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl pointer-events-none" />

      <header className="text-center max-w-2xl mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide uppercase mb-4 text-[var(--color-accent)]">
          <Sparkles className="w-4 h-4" /> Plataforma Integrada FonoSync
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold font-serif mb-4 leading-tight">
          Como você deseja acessar o FonoSync hoje?
        </h1>
        <p className="text-lg text-white/80">
          Escolha o seu perfil para vivenciar a experiência personalizada de terapia e gestão fonoaudiológica.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full relative z-10">
        {/* CARD PROFISSIONAL */}
        <a
          href="#/profissional/entrar"
          className="group relative bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/50 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/15 flex flex-col justify-between"
        >
          <div>
            <div className="w-16 h-16 rounded-xl bg-[var(--color-primary)] flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform">
              <UserCheck className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-wider">Para Fonoaudiólogos</span>
            <h2 className="text-2xl font-bold font-serif text-white mt-1 mb-3">Sou Profissional</h2>
            <p className="text-sm text-white/75 leading-relaxed mb-6">
              Acesse a gestão clínica completa, prontuários eletrônicos, análise fonética por IA, agenda de atendimentos e relatórios.
            </p>
          </div>
          <div className="flex items-center text-sm font-semibold text-white group-hover:text-[var(--color-accent)] transition-colors">
            Acessar painel profissional <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </a>

        {/* CARD PACIENTE */}
        <a
          href="#/paciente/entrar"
          className="group relative bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/50 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/15 flex flex-col justify-between"
        >
          <div>
            <div className="w-16 h-16 rounded-xl bg-emerald-600 flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform">
              <HeartPulse className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Para Pacientes e Famílias</span>
            <h2 className="text-2xl font-bold font-serif text-white mt-1 mb-3">Sou Paciente</h2>
            <p className="text-sm text-white/75 leading-relaxed mb-6">
              Acompanhe seu progresso, realize exercícios prescritos, participe de jogos terapêuticos e fale com sua fonoaudióloga.
            </p>
          </div>
          <div className="flex items-center text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
            Acessar área do paciente <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </a>
      </div>

      <footer className="mt-12 text-xs text-white/50 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4" /> Ambiente Seguro e em Conformidade com a LGPD
      </footer>
    </div>
  );
}