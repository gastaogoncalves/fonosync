// src/hooks/useA11y.jsx

import { createContext, useContext } from 'react';
import { DEFAULT_SETTINGS, DEFAULT_VOICE } from '../utils/constants';

const noop = () => {};

export const A11yContext = createContext({
  settings: DEFAULT_SETTINGS,
  draft: DEFAULT_SETTINGS,
  updateDraft: noop,
  hasUnsavedChanges: false,
  discardDraft: noop,
  savePreferences: noop,
  resetDefaults: noop,
  saveStatus: null,
  voiceGender: DEFAULT_VOICE.gender,
  setVoiceGender: noop,
  speechRate: DEFAULT_VOICE.rate,
  setSpeechRate: noop,
  isPlaying: false,
  isPlayerOpen: false,
  playerStatus: 'idle',
  currentTime: 0,
  duration: 0,
  speed: DEFAULT_VOICE.rate,
  volume: 100,
  pageTitle: '',
  speakPageContent: noop,
  speakText: noop,
  stopSpeaking: noop,
  playAudio: noop,
  pauseAudio: noop,
  stopAudio: noop,
  restartAudio: noop,
  setSpeed: noop,
  setVolume: noop,
});

export const useA11y = () => useContext(A11yContext);
