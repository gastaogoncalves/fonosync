import { Check } from 'lucide-react';
import Reveal from './Reveal';

const panels = [
  {
    icon: '👨‍⚕️',
    title: 'Para fonoaudiólogos e clínicas',
    dark: true,
    items: [
      ['Mais organização', 'todos os prontuários, agendas e relatórios em um único lugar, acessível de qualquer dispositivo.'],
      ['Mais produtividade', 'automatize relatórios, lembretes e evoluções clínicas para dedicar mais tempo ao paciente.'],
      ['Melhor acompanhamento', 'visualize a evolução de cada paciente com gráficos e indicadores objetivos.'],
      ['Segurança total', 'criptografia de dados, controle de acesso RBAC e conformidade com a LGPD.'],
      ['IA como aliada', 'análise fonética assistida por inteligência artificial para apoiar decisões clínicas.'],
    ],
  },
  {
    icon: '🧒',
    title: 'Para pacientes e famílias',
    items: [
      ['Maior engajamento', 'atividades gamificadas que transformam a terapia em uma aventura divertida para as crianças.'],
      ['Exercícios em casa', 'acesso à plataforma do paciente para continuar as atividades terapêuticas fora do consultório.'],
      ['Evolução visível', 'acompanhe o progresso em tempo real com indicadores simples e motivadores.'],
      ['Comunicação direta', 'receba lembretes de sessões e informações do profissional de forma clara e ágil.'],
      ['Privacidade garantida', 'seus dados e os de seu filho são protegidos com os mais altos padrões de segurança.'],
    ],
  },
];

export default function Benefits() {
  return (
    <section id="beneficios" className="mx-auto max-w-360 scroll-mt-24 px-6 md:px-18 pb-24">
      <Reveal className="mb-14 text-center">
        <span className="mb-4 block text-sm font-bold tracking-wider text-primary uppercase">Benefícios</span>
        <h2 className="mb-4 text-3xl text-navy md:text-4xl">Para quem usa o FonoSync</h2>
        <p className="mx-auto max-w-xl text-lg text-muted">
          Uma plataforma desenhada para atender as necessidades reais de cada perfil.
        </p>
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-2">
        {panels.map((panel, index) => (
          <Reveal key={panel.title} delay={index * 120}>
            <div
              className={`h-full rounded-3xl p-10 ${
                panel.dark ? 'bg-navy text-white' : 'border border-navy/10 bg-mist text-navy'
              }`}
            >
              <span className="mb-5 block text-4xl">{panel.icon}</span>
              <h3 className="mb-6 text-2xl leading-snug">{panel.title}</h3>
              <ul className="flex flex-col gap-3.5">
                {panel.items.map(([title, text]) => (
                  <li
                    key={title}
                    className={`flex items-start gap-3 text-sm leading-relaxed ${
                      panel.dark ? 'text-white/75' : 'text-navy/80'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex size-5.5 shrink-0 items-center justify-center rounded-md ${
                        panel.dark ? 'bg-white/15' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <span>
                      <strong>{title}</strong> — {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}