// Chave usada para guardar as preferências de acessibilidade neste navegador
export const A11Y_STORAGE_KEY = 'fonosync:acessibilidade';

export const FONT_MIN = 80;
export const FONT_MAX = 140;
export const FONT_STEP = 10;

export const DEFAULT_SETTINGS = Object.freeze({
  fontPercent: 100,
  highContrast: false,
  darkMode: false,
  reduceMotion: false,
  largeTargets: false,
  bgColor: 'default',
  textColor: 'default',
  leading: 'normal',
  tracking: 'normal',
  colorVision: 'normal',
});

export const DEFAULT_VOICE = Object.freeze({ gender: 'female', rate: 1 });

export const BACKGROUND_OPTIONS = [
  { id: 'default', label: 'Padrão', hex: null, preview: '#ffffff' },
  { id: 'bege', label: 'Bege', hex: '#f6ecd8', preview: '#f6ecd8' },
  { id: 'azul', label: 'Azul claro', hex: '#d8ebf7', preview: '#d8ebf7' },
  { id: 'verde', label: 'Verde claro', hex: '#dcefe2', preview: '#dcefe2' },
];

// vermelho escuro para manter o contraste AA
export const TEXT_OPTIONS = [
  { id: 'default', label: 'Padrão', hex: null, preview: '#172c3a' },
  { id: 'preto', label: 'Preto', hex: '#000000', preview: '#000000' },
  { id: 'vermelho', label: 'Vermelho', hex: '#b3001b', preview: '#b3001b' },
];

export const LEADING_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: '1.5', label: '1,5×' },
  { value: '2', label: '2×' },
];

export const TRACKING_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: '0.05em', label: 'Ampliado' },
  { value: '0.12em', label: 'Máximo' },
];

export const COLOR_VISION_OPTIONS = [
  { value: 'normal', label: 'Padrão' },
  { value: 'red-green', label: 'Protanopia ou deuteranopia (vermelho e verde)' },
  { value: 'tritan', label: 'Tritanopia (azul e amarelo)' },
  { value: 'mono', label: 'Monocromático (sem cores)' },
];

export const VOICE_OPTIONS = [
  { value: 'female', label: 'Feminina' },
  { value: 'male', label: 'Masculina' },
];

export const SPEECH_RATES = [
  { value: 0.75, label: '0,75× (lento)' },
  { value: 1, label: '1× (normal)' },
  { value: 1.25, label: '1,25× (rápido)' },
  { value: 1.5, label: '1,5× (muito rápido)' },
  { value: 2, label: '2× (máximo)' },
];

export const FEATURE_DETAILS = {
  desafio: [
    'Prontuário, sessões e exercícios ficam em lugares diferentes.',
    'A família só recebe retorno durante as sessões.',
    'A escola raramente participa do plano terapêutico.',
  ],
  solucao: [
    'Prontuário, agenda, exercícios e mensagens na mesma jornada.',
    'Paciente, família e profissional veem os mesmos dados, em linguagem clara.',
    'As preferências de acessibilidade acompanham a pessoa em todas as telas.',
  ],
  analise: [
    'Envio ou gravação de áudio.',
    'Score por fonema, com alerta de confiança.',
    'Nenhum resultado é liberado sem validação do profissional.',
  ],
  jogos: [
    'Atividades por faixa etária, de 0 a 6+ anos.',
    'Desempenho integrado ao acompanhamento terapêutico.',
    'Instruções narradas e linguagem acolhedora.',
  ],
  escolas: [
    'Triagem orientada para a turma.',
    'Checklist do professor para sinais observados em sala.',
    'Encaminhamento claro para avaliação fonoaudiológica.',
  ],
};

export const INFO_PAGES = {
  pesquisa: {
    title: 'Pesquisa e validação',
    paragraphs: [
      'O FonoSync é uma plataforma acadêmico-clínica de apoio à terapia fonoaudiológica.',
      'Triagens e análises fonéticas indicam sinais e próximos passos. Cada resultado precisa ser validado por um profissional antes de orientar uma decisão.',
      'Triagem não substitui avaliação fonoaudiológica profissional.',
    ],
  },
  privacidade: {
    title: 'Privacidade e LGPD',
    paragraphs: [
      'Esta é uma versão de demonstração: pacientes, profissionais e sessões exibidos são fictícios.',
      'Suas preferências de acessibilidade ficam guardadas apenas neste navegador e podem ser apagadas em “Restaurar padrão”.',
      'O resultado e o histórico da triagem ficam só na memória da página e somem ao recarregar.',
      'Em uma versão real, dados de saúde dependem de consentimento claro, conforme a LGPD.',
    ],
  },
};