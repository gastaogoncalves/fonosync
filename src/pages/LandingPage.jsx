import { useEffect } from 'react';
import { AudioWaveform, Gamepad2, Network, School, TriangleAlert } from 'lucide-react';
import Header from '../components/Header';
import FeatureRow from '../components/FeatureRow';
import PhoneticCard from '../components/PhoneticCard';
import StatsStrip from '../components/StatsStrip';
import About from '../components/About';
import Benefits from '../components/Benefits';
import { buttonClass } from '../components/buttonStyles';
import Reveal from '../components/Reveal';
import Footer from '../components/Footer';

const features = [
  {
    icon: TriangleAlert,
    title: 'O Desafio',
    description: 'Informações fragmentadas, avaliações manuais e pouca continuidade entre clínica, casa e escola dificultam decisões rápidas e seguras.',
    progress: {
      eyebrow: 'Sem integração',
      items: [
        { label: 'Sessões sem registro compartilhado', value: 62 },
        { label: 'Famílias sem retorno entre sessões', value: 71 },
      ],
      note: {
        tone: 'warning',
        title: 'Ponto de atenção',
        text: 'Sem histórico unificado, cada profissional começa do zero.',
      },
    },
  },
  {
    icon: Network,
    title: 'A Solução',
    description: 'O FonoSync organiza prontuário, sessões, exercícios e comunicação em uma única jornada, com dados compreensíveis para todos.',
    progress: {
      eyebrow: 'Cuidado conectado',
      items: [
        { label: 'Aderência ao plano terapêutico', value: 84 },
        { label: 'Frequência das sessões', value: 92 },
      ],
      note: {
        tone: 'success',
        title: 'Próxima recomendação',
        text: 'Revisar exercício de fluência antes da próxima sessão.',
      },
    },
  },
  {
    icon: Gamepad2,
    title: 'Jogos que avaliam e tratam',
    description: 'Atividades por faixa etária combinam acolhimento e rigor clínico, com desempenho integrado ao acompanhamento terapêutico.',
    progress: {
      eyebrow: 'Desempenho nos jogos',
      items: [
        { label: 'Acertos em Caça-Sons', value: 78 },
        { label: 'Missões da semana concluídas', value: 80 },
      ],
      note: {
        tone: 'success',
        title: 'Próxima fase',
        text: 'Liberar o nível 3 de Caça-Sons para este paciente.',
      },
    },
  },
  {
    icon: School,
    title: 'Para Escolas',
    description: 'Triagens orientadas, checklist do professor e encaminhamentos claros fortalecem a colaboração com famílias e profissionais.',
    progress: {
      eyebrow: 'Triagem escolar',
      items: [
        { label: 'Alunos do 2º ano B triados', value: 90 },
        { label: 'Checklists do professor enviados', value: 75 },
      ],
      note: {
        tone: 'success',
        title: 'Encaminhamento',
        text: '3 alunos indicados para avaliação fonoaudiológica.',
      },
    },
  },
];

// Rola até a seção sem mexer no hash (o app usa rotas por hash).
const scrollToSection = (id) => (e) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export default function LandingPage() {
  useEffect(() => {
    document.title = 'FonoSync';
  }, []);

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero */}
        <section className="bg-mist">
          <div className="mx-auto grid max-w-360 items-center gap-12 px-18 py-18 lg:grid-cols-2">
            <div>
              <span className="mb-4 block text-sm font-bold tracking-wider text-primary uppercase">
                FONOAUDIOLOGIA CONECTADA E ACESSÍVEL
              </span>
              <h1 className="mb-6 text-4xl leading-tight text-navy md:text-5xl lg:text-6xl">
                Tecnologia que transforma a terapia fonoaudiológica.
              </h1>
              <p className="mb-10 max-w-xl text-xl text-muted">
                Conectamos pacientes, profissionais e avaliações inteligentes para tornar cada jornada terapêutica mais contínua, segura e humana.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a href="#/triagem" className={buttonClass('primary')}>Experimentar Avaliação</a>
                <a href="#sobre" onClick={scrollToSection('sobre')} className={buttonClass('secondary')}>Conhecer Plataforma</a>
              </div>
            </div>

            {/* Mesmo efeito do mockup antigo: inclinação 3D que se endireita no hover */}
            <div className="drop-shadow-[0_28px_36px_rgba(13,51,71,0.24)] transition-transform duration-500 lg:[transform:perspective(1000px)_rotateY(-4deg)_rotateX(2deg)_scale(1.08)] lg:hover:[transform:perspective(1000px)_rotateY(-1deg)_rotateX(1deg)_scale(1.08)]">
              <PhoneticCard />
            </div>
          </div>
        </section>

        <StatsStrip />

        {/* Sobre */}
        <About />

        {/* Barrinha separadora com 3px de espessura */}
        <div className="mx-auto max-w-360 px-18 my-8">
          <div className="h-[3px] w-full rounded-full bg-slate-200/80" />
        </div>

        {/* Seções de funcionalidades (Desafio, Solução, etc.) */}
        <section className="mx-auto flex max-w-360 flex-col gap-20 px-18 py-20">
          {features.map((feature, index) => (
            <Reveal
              key={feature.title}
              id={index === 0 ? 'recursos' : undefined}
              className="scroll-mt-24"
            >
              <FeatureRow
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                progress={feature.progress}
                reverse={index % 2 === 1}
              />
            </Reveal>
          ))}
        </section>

        {/* Barrinha separadora com 3px de espessura entre Recursos e Benefícios */}
        <div className="mx-auto max-w-360 px-18 my-8">
          <div className="h-[3px] w-full rounded-full bg-slate-200/80" />
        </div>

        {/* Benefícios */}
        <Benefits />

        {/* Barrinha separadora com 3px de espessura entre Benefícios e CTA */}
        <div className="mx-auto max-w-360 px-18 my-8">
          <div className="h-[3px] w-full rounded-full bg-slate-200/80" />
        </div>

        {/* CTA final */}
        <section className="bg-mist py-24 text-center">
          <Reveal className="mx-auto max-w-360 px-18">
            <h2 className="mb-6 text-3xl text-navy md:text-4xl">
              Uma terapia mais conectada começa com um próximo passo claro.
            </h2>
            <p className="mb-10 text-lg text-muted">
              Experimente a avaliação digital ou conheça a plataforma completa.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a href="#/triagem" className={buttonClass('primary')}>Experimentar Avaliação</a>
              <a href="#sobre" onClick={scrollToSection('sobre')} className={buttonClass('secondary')}>Conhecer Plataforma</a>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}