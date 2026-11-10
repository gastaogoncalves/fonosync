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
  colorMode: 'default',
  textColor: 'default',
  buttonColor: 'default',
  leading: 'normal',
  tracking: 'normal',
});

export const DEFAULT_VOICE = Object.freeze({ gender: 'female', rate: 1 });

export const COLOR_MODE_OPTIONS = [
  { value: 'default', label: 'Padrão' },
  { value: 'red-green', label: 'Protanopia ou deuteranopia (vermelho e verde)' },
  { value: 'tritan', label: 'Tritanopia (azul e amarelo)' },
  { value: 'mono', label: 'Monocromático (sem cores)' },
];

// no claro, cores escuras; no escuro, cores claras
export const TEXT_OPTIONS = {
  light: [
    { id: 'default', label: 'Padrão', hex: null },
    { id: 'preto', label: 'Preto', hex: '#000000' },
    { id: 'grafite', label: 'Grafite', hex: '#172c3a' },
    { id: 'azul-escuro', label: 'Azul-escuro', hex: '#0b2e4f' },
    { id: 'marrom', label: 'Marrom', hex: '#4a2c12' },
    { id: 'vinho', label: 'Vinho', hex: '#5a1023' },
  ],
  dark: [
    { id: 'default', label: 'Padrão', hex: null },
    { id: 'branco', label: 'Branco', hex: '#ffffff' },
    { id: 'cinza-claro', label: 'Cinza-claro', hex: '#d7dde3' },
    { id: 'creme', label: 'Creme', hex: '#f5ecd7' },
    { id: 'amarelo-claro', label: 'Amarelo-claro', hex: '#fff3b0' },
    { id: 'azul-claro', label: 'Azul-claro', hex: '#cfe6f7' },
  ],
};

export const BUTTON_OPTIONS = {
  light: [
    { id: 'default', label: 'Padrão', hex: null },
    { id: 'verde', label: 'Verde', hex: '#1f6f43' },
    { id: 'roxo', label: 'Roxo', hex: '#5b3fa0' },
    { id: 'vinho', label: 'Vinho', hex: '#8a1c3c' },
    { id: 'laranja', label: 'Laranja', hex: '#a3470d' },
    { id: 'preto', label: 'Preto', hex: '#000000' },
  ],
  dark: [
    { id: 'default', label: 'Padrão', hex: null },
    { id: 'verde-claro', label: 'Verde-claro', hex: '#7fd1a6' },
    { id: 'lilas', label: 'Lilás', hex: '#b9a5ec' },
    { id: 'rosa', label: 'Rosa', hex: '#f2a2bb' },
    { id: 'pessego', label: 'Pêssego', hex: '#f5b47a' },
    { id: 'branco', label: 'Branco', hex: '#ffffff' },
  ],
};

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
      'Suas preferências de acessibilidade ficam guardadas apenas neste navegador e podem ser apagadas no botão Restaurar padrão do painel.',
      'O resultado e o histórico da triagem ficam só na memória da página e somem ao recarregar.',
      'Dados de saúde só são tratados com consentimento claro, conforme a LGPD.',
    ],
  },
};