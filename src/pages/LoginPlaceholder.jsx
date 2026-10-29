import React, { useState } from 'react';

export default function LoginPlaceholder({ title = "Entrar na área do sistema", nextHref = "#/profissional" }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      window.location.hash = nextHref;
      return;
    }
    if (email && password) {
      window.location.hash = nextHref;
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-band)] flex items-center justify-center p-6 text-[var(--color-ink)]">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-[var(--color-line)]">
        <h2 className="text-2xl font-bold font-serif text-center text-[var(--color-navy)] mb-2">{title}</h2>
        <p className="text-xs text-center text-[var(--color-muted)] mb-6">
          {isRegister ? 'Preencha os dados para criar sua nova conta no FonoSync' : 'Acesse com suas credenciais de demonstração'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            Preencha todos os campos para continuar.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-[var(--color-muted)] mb-1 uppercase">Nome Completo</label>
              <input type="text" required placeholder="Seu nome" className="w-full p-3 border border-[var(--color-line)] rounded-xl text-sm" />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[var(--color-muted)] mb-1 uppercase">E-mail</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="w-full p-3 border border-[var(--color-line)] rounded-xl text-sm" />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--color-muted)] mb-1 uppercase">Senha</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full p-3 border border-[var(--color-line)] rounded-xl text-sm" />
          </div>

          {!isRegister && (
            <div className="text-right">
              <a href="#" className="text-xs text-[var(--color-primary)] font-bold hover:underline">Esqueci minha senha</a>
            </div>
          )}

          <button type="submit" className="w-full py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl text-sm hover:opacity-90">
            {isRegister ? 'Criar Minha Conta' : 'Entrar no Sistema'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs">
          <button onClick={() => setIsRegister(!isRegister)} className="text-[var(--color-primary)] font-bold hover:underline">
            {isRegister ? 'Já possui conta? Faça login' : 'Ainda não tem conta? Cadastre-se'}
          </button>
        </div>
      </div>
    </div>
  );
}