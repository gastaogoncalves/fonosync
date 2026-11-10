import { createContext, useContext } from 'react';
import { DEFAULT_SETTINGS, DEFAULT_VOICE } from '../utils/constants';

const noop = () => {};

export const A11yContext = createContext({
  settings: DEFAULT_SETTINGS,
  updateSettings: noop,
  hasUnsavedChanges: false,
  savePreferences: noop,
  resetDefaults: noop,
  saveStatus: null,
  voiceGender: DEFAULT_VOICE.gender,
  setVoiceGender: noop,
  speechSupported: false,
  voiceInfo: { exact: false, hasPortuguese: false, name: null },
  speechRate: DEFAULT_VOICE.rate,
  setSpeechRate: noop,
  isPlaying: false,
  playerStatus: 'idle',
  pageTitle: '',
  speakPageContent: noop,
  speakText: noop,
  stopSpeaking: noop,
});

export const useA11y = () => useContext(A11yContext);
