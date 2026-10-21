import React from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import FeatureRow from '../components/FeatureRow';
import Footer from '../components/Footer';


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section[cite: 8] */}
        <section className="container mx-auto px-4 pt-16 pb-20 lg:pt-24 lg:pb-32 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-bold tracking-wider text-[#176B9B] uppercase mb-4 block">
              FONOAUDIOLOGIA CONECTADA E ACESSÍVEL
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-[#103D5A] font-serif">
              Tecnologia que transforma a terapia fonoaudiológica.
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-xl">
              Conectamos pacientes, profissionais e avaliações inteligentes para tornar cada jornada terapêutica mais contínua, segura e humana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary">Experimentar Avaliação</Button>
              <Button variant="secondary">Conhecer Plataforma</Button>
            </div>
          </div>
          
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
             <div className="h-72 bg-[#EAF2F8] rounded-xl flex items-center justify-center text-[#176B9B]">
                Gráfico de Análise Fonética Inteligente
             </div>
          </div>
        </section>

        {/* Banner de Destaques[cite: 8] */}
        <section className="bg-[#103D5A] text-white py-12">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-around gap-8 text-center md:text-left">
            <div>
              <span className="text-3xl font-bold block mb-1">4+ jogos</span>
              <span className="text-blue-200 text-sm">Avaliar e tratar</span>
            </div>
            <div>
              <span className="text-3xl font-bold block mb-1">100% digital e seguro</span>
              <span className="text-blue-200 text-sm">Do cadastro ao relatório</span>
            </div>
            <div>
              <span className="text-3xl font-bold block mb-1">LGPD</span>
              <span className="text-blue-200 text-sm">Privacidade por princípio</span>
            </div>
          </div>
        </section>

        {/* Seções de Funcionalidades[cite: 8] */}
        <section className="container mx-auto px-4 py-24 space-y-32">
          <FeatureRow 
            title="O Desafio"
            description="Informações fragmentadas, avaliações manuais e pouca continuidade entre clínica, casa e escola dificultam decisões rápidas e seguras."
            badge="⚠️"
          />
          <FeatureRow 
            title="A Solução"
            description="O FonoSync organiza prontuário, sessões, exercícios e comunicação em uma única jornada, com dados compreensíveis para todos."
            badge="🧩"
            reverse
          />
          <FeatureRow 
            title="Análise Fonética Inteligente"
            description="Envie ou grave áudio, visualize scores por fonema, receba alertas de confiança e valide profissionalmente cada resultado."
            badge="🎙️"
          />
        </section>

        {/* Call to Action (CTA) Final[cite: 8] */}
        <section className="bg-[#EAF2F8] py-24 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif text-[#103D5A]">
              Uma terapia mais conectada começa com um próximo passo claro.
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Experimente a avaliação digital ou conheça a plataforma completa.
            </p>
            <div className="flex justify-center flex-col sm:flex-row gap-4">
              <Button variant="primary">Experimentar Avaliação</Button>
              <Button variant="secondary">Conhecer Plataforma</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}