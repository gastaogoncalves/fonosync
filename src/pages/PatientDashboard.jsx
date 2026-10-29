import React, { useState } from 'react';
import { Home, Gamepad2, Settings, Calendar, Activity, CheckCircle2, TrendingUp, LogOut, Lock, User, Bell } from 'lucide-react';
import TriagemGame from '../components/TriagemGame';


export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('inicio');

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] flex flex-col md:flex-row">
      {/* SIDEBAR DO PACIENTE */}
      <aside className="w-full md:w-64 bg-[var(--color-band)] text-white p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center font-bold text-white text-xl">
              FS
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg">FonoSync</h2>
              <p className="text-[10px] uppercase text-[var(--color-on-band-muted)] tracking-wider">Área do Paciente</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('inicio')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'inicio' ? 'bg-[var(--color-primary)] text-white' : 'text-white/70 hover:bg-white/10'}`}
            >
              <Home className="w-4 h-4" /> Página Inicial
            </button>
            <button
              onClick={() => setActiveTab('jogos')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'jogos' ? 'bg-[var(--color-primary)] text-white' : 'text-white/70 hover:bg-white/10'}`}
            >
              <Gamepad2 className="w-4 h-4" /> Jogos de Triagem
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === 'config' ? 'bg-[var(--color-primary)] text-white' : 'text-white/70 hover:bg-white/10'}`}
            >
              <Settings className="w-4 h-4" /> Configurações
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">
              ML
            </div>
            <div>
              <p className="text-xs font-bold">Maria Luiza</p>
              <p className="text-[10px] text-white/60">Paciente</p>
            </div>
          </div>
          <a href="#/acesso" className="text-white/60 hover:text-white" title="Sair">
            <LogOut className="w-4 h-4" />
          </a>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        {/* PÁGINA INICIAL */}
        {activeTab === 'inicio' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[var(--color-navy)] to-[var(--color-primary)] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
              <h1 className="text-3xl font-bold font-serif mb-2">Bem-vinda de volta, Maria Luiza! 👋</h1>
              <p className="text-sm text-white/80">Sua próxima sessão de acompanhamento está agendada para <strong>Quarta-feira às 10:30</strong>.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-[var(--color-line)] shadow-sm">
                <span className="text-xs font-bold uppercase text-[var(--color-muted)]">Sessões Realizadas</span>
                <p className="text-3xl font-bold font-serif text-[var(--color-navy)] mt-2">24</p>
                <span className="text-xs text-emerald-600 font-semibold">100% de presença</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[var(--color-line)] shadow-sm">
                <span className="text-xs font-bold uppercase text-[var(--color-muted)]">Índice de Fluência</span>
                <p className="text-3xl font-bold font-serif text-emerald-600 mt-2">72%</p>
                <span className="text-xs text-emerald-600 font-semibold">↑ +28% desde o início</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[var(--color-line)] shadow-sm">
                <span className="text-xs font-bold uppercase text-[var(--color-muted)]">Exercícios Concluídos</span>
                <p className="text-3xl font-bold font-serif text-[var(--color-primary)] mt-2">2 / 4</p>
                <span className="text-xs text-[var(--color-muted)]">Atividades de hoje</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[var(--color-line)] p-6 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-[var(--color-navy)] mb-4">Exercícios Prescritos para Hoje</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-bold text-emerald-900">Respiração costodiafragmática</p>
                      <p className="text-xs text-emerald-700">Inspire 3s · Segure 2s · Expire 5s — 5 séries</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full">Concluído</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-canvas)] border border-[var(--color-line)]">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-[var(--color-primary)]" />
                    <div>
                      <p className="text-sm font-bold">Leitura oral progressiva</p>
                      <p className="text-xs text-[var(--color-muted)]">Leia em voz alta por 5 minutos com pausas de velocidade</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold px-3 py-1 bg-[var(--color-primary)] text-white rounded-full">Praticar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PÁGINA DE JOGOS DE TRIAGEM */}
        {activeTab === 'jogos' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold font-serif text-[var(--color-navy)]">Jogos de Triagem Fonológica</h1>
              <p className="text-sm text-[var(--color-muted)]">Pratique sua dicção, articulação e rima com os jogos terapêuticos integrados.</p>
            </div>
            <TriagemGame />
          </div>
        )}

        {/* PÁGINA DE CONFIGURAÇÕES */}
        {activeTab === 'config' && (
          <div className="bg-white rounded-2xl border border-[var(--color-line)] p-8 shadow-sm space-y-6">
            <h1 className="text-2xl font-bold font-serif text-[var(--color-navy)]">Configurações do Perfil</h1>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--color-muted)] mb-1">Nome Completo</label>
                <input type="text" defaultValue="Maria Luiza Ferreira" className="w-full p-3 border border-[var(--color-line)] rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--color-muted)] mb-1">E-mail de Contato</label>
                <input type="email" defaultValue="maria@fonosync.com.br" className="w-full p-3 border border-[var(--color-line)] rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--color-muted)] mb-1">Alterar Senha</label>
                <input type="password" placeholder="••••••••" className="w-full p-3 border border-[var(--color-line)] rounded-xl text-sm" />
              </div>
              <button className="px-6 py-3 bg-[var(--color-primary)] text-white font-bold text-sm rounded-xl hover:opacity-90">
                Salvar Alterações
              </button>
            </div>
          </div>
        )}
      </main>

      <FonoBot />
    </div>
  );
}
