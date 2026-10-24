import Header from '../components/Header';
import Button from '../components/Button';
import FeatureRow from '../components/FeatureRow';
import PhoneticCard from '../components/PhoneticCard';
import StatsStrip from '../components/StatsStrip';
import Footer from '../components/Footer';

export default function LandingPage() {
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
                <Button variant="primary">Experimentar Avaliação</Button>
                <Button variant="secondary">Conhecer Plataforma</Button>
              </div>
            </div>

            <PhoneticCard />
          </div>
        </section>

        <StatsStrip />

        {/* Seções de funcionalidades */}
        <section className="mx-auto max-w-360 space-y-32 px-18 py-24">
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

        {/* CTA final */}
        <section className="bg-mist py-24 text-center">
          <div className="mx-auto max-w-360 px-18">
            <h2 className="mb-6 text-3xl text-navy md:text-4xl">
              Uma terapia mais conectada começa com um próximo passo claro.
            </h2>
            <p className="mb-10 text-lg text-muted">
              Experimente a avaliação digital ou conheça a plataforma completa.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
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
