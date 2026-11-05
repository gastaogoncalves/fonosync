import { useEffect } from 'react';
import { AudioWaveform, Gamepad2, Network, School, TriangleAlert } from 'lucide-react';
import Header from '../components/Header';
import Button from '../components/Button';
import FeatureRow from '../components/FeatureRow';
import PhoneticCard from '../components/PhoneticCard';
import StatsStrip from '../components/StatsStrip';
import Footer from '../components/Footer';
import { scrollToId } from '../utils/scroll';

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
    icon: AudioWaveform,
    title: 'Análise Fonética Inteligente',
    description: 'Envie ou grave áudio, visualize scores por fonema, receba alertas de confiança e valide profissionalmente cada resultado.',
    progress: {
      eyebrow: 'Análise do áudio',
      items: [
        { label: 'Precisão no fonema /r/', value: 64 },
        { label: 'Precisão no fonema /s/', value: 88 },
      ],
      note: {
        tone: 'success',
        title: 'Pronto para validação',
        text: 'Confira os trechos marcados antes de liberar o relatório.',
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

const featureIds = ['desafio', 'solucao', 'analise', 'jogos', 'escolas'];

export default function LandingPage() {
  useEffect(() => {
    document.title = 'FonoSync';
  }, []);

  const handleGoToTriagem = () => {
    window.location.hash = '#/triagem';
  };

  const handleScrollToFeatures = () => scrollToId('recursos');

  return (
    <div className="min-h-screen font-sans">
      <Header />

      <main>
        <section id="plataforma" className="scroll-mt-24 bg-mist">
          <div className="mx-auto grid max-w-360 items-center gap-12 px-6 md:px-18 py-18 lg:grid-cols-2">
            <div>
              <span className="mb-4 block text-sm font-bold tracking-wider text-primary uppercase">
                FONOAUDIOLOGIA CONECTADA E ACESSÍVEL
              </span>
              <h1 className="mb-6 text-4xl leading-tight text-navy md:text-5xl lg:text-6xl font-serif">
                Tecnologia que transforma a terapia fonoaudiológica.
              </h1>
              <p className="mb-10 max-w-xl text-xl text-muted">
                Conectamos pacientes, profissionais e avaliações inteligentes para tornar cada jornada terapêutica mais contínua, segura e humana.
              </p>
              
              {/* Botões CTA principais sem os links inferiores */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button variant="primary" onClick={handleGoToTriagem}>
                  Experimentar Avaliação
                </Button>
                <Button variant="secondary" onClick={handleScrollToFeatures}>
                  Conhecer Plataforma
                </Button>
              </div>
            </div>

            <PhoneticCard />
          </div>
        </section>

        <StatsStrip />

        <section id="recursos" className="mx-auto flex max-w-360 flex-col gap-20 px-6 md:px-18 py-20">
         {features.map((feature, index) => (
            <FeatureRow
              key={feature.title}
              id={featureIds[index]}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              progress={feature.progress}
              reverse={index % 2 === 1}
            />
          ))}
        </section>

        <section className="bg-mist py-24 text-center">
          <div className="mx-auto max-w-360 px-6 md:px-18">
            <h2 className="mb-6 text-3xl text-navy md:text-4xl font-serif">
              Uma terapia mais conectada começa com um próximo passo claro.
            </h2>
            <p className="mb-10 text-lg text-muted">
              Experimente a avaliação digital ou conheça a plataforma completa.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button variant="primary" onClick={handleGoToTriagem}>
                Experimentar Avaliação
              </Button>
              <Button variant="secondary" onClick={handleScrollToFeatures}>
                Conhecer Plataforma
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}