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
  colorMode: 'default', // value de COLOR_MODE_OPTIONS (daltonismo)
  textColor: 'default', // id de TEXT_OPTIONS
  buttonColor: 'default', // id de BUTTON_OPTIONS
  leading: 'normal',
  tracking: 'normal',
});

export const DEFAULT_VOICE = Object.freeze({ gender: 'female', rate: 1 });

// Modos para daltonismo. Os três primeiros redistribuem as cores para que o par
// confundido (vermelho/verde ou azul/amarelo) fique mais fácil de distinguir.
// Os filtros em si ficam no A11yContext (componente ColorFilters).
export const COLOR_MODE_OPTIONS = [
  { value: 'default', label: 'Padrão' },
  { value: 'protanopia', label: 'Protanopia (dificuldade com vermelho)' },
  { value: 'deuteranopia', label: 'Deuteranopia (dificuldade com verde)' },
  { value: 'tritanopia', label: 'Tritanopia (dificuldade com azul)' },
  { value: 'achromatopsia', label: 'Tons de cinza (acromatopsia)' },
];

// Cores de texto. Todas têm contraste acima de 7:1 sobre branco.
// "Padrão" não tem hex: mantém as cores originais do design.
export const TEXT_OPTIONS = [
  { id: 'default', label: 'Padrão', hex: null },
  { id: 'preto', label: 'Preto', hex: '#000000' },
  { id: 'grafite', label: 'Grafite azulado', hex: '#14283a' },
  { id: 'marinho', label: 'Azul-marinho', hex: '#0a2f5a' },
  { id: 'marrom', label: 'Marrom', hex: '#4a2a0f' },
  { id: 'vinho', label: 'Vinho', hex: '#5a0f22' },
];

// Cores dos botões (e demais elementos da cor primária: links, ícones, barras).
// Todas têm contraste acima de 4,5:1 com o texto branco que fica sobre elas.
export const BUTTON_OPTIONS = [
  { id: 'default', label: 'Padrão', hex: null },
  { id: 'verde', label: 'Verde', hex: '#1f6b45' },
  { id: 'roxo', label: 'Roxo', hex: '#5b3fa0' },
  { id: 'carmim', label: 'Carmim', hex: '#8c1d40' },
  { id: 'laranja', label: 'Laranja', hex: '#b04a0b' },
  { id: 'preto', label: 'Preto', hex: '#000000' },
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

export const VOICE_OPTIONS = [
  { value: 'female', label: 'Feminina' },
  { value: 'male', label: 'Masculina' },
];

// Velocidade da fala (SpeechSynthesisUtterance.rate): de 0,5× a 2,5×, de 0,25 em 0,25
export const SPEECH_RATE_MIN = 0.5;
export const SPEECH_RATE_MAX = 2.5;
export const SPEECH_RATE_STEP = 0.25;

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