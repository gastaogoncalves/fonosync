import { useEffect, useState } from 'react';
import { A11yContext } from '../hooks/useA11y';

const STORAGE_KEY = 'fonosync-a11y';

const fontSteps = [0.875, 1, 1.125, 1.25, 1.375, 1.5];

function defaultSettings() {
  return {
    fontStep: 1,
    highContrast: false,
    darkMode: false,
    reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    largeTargets: false,
    colorVision: 'normal',
    // cores escolhidas no painel, guardadas separadas para o tema claro e o escuro
    textLight: '',
    textDark: '',
    buttonLight: '',
    buttonDark: '',
    leading: 'normal',
    tracking: 'normal',
  };
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...defaultSettings(), ...saved };
  } catch {
    return defaultSettings();
  }
}

function setFlag(root, name, value) {
  if (value) {
    root.setAttribute(name, value);
  } else {
    root.removeAttribute(name);
  }
}

function setVariable(root, name, value) {
  if (value) {
    root.style.setProperty(name, value);
  } else {
    root.style.removeProperty(name);
  }
}

export function A11yProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    const root = document.documentElement;

    root.style.fontSize = `${fontSteps[settings.fontStep] * 100}%`;
    setFlag(root, 'data-theme', settings.darkMode && 'dark');
    setFlag(root, 'data-contrast', settings.highContrast && 'high');
    setFlag(root, 'data-motion', settings.reduceMotion && 'reduce');
    setFlag(root, 'data-targets', settings.largeTargets && 'large');
    setFlag(root, 'data-color-vision', settings.colorVision !== 'normal' && settings.colorVision);

    setFlag(root, 'data-leading', settings.leading !== 'normal' && settings.leading);
    setVariable(root, '--a11y-leading', settings.leading !== 'normal' && settings.leading);
    setFlag(root, 'data-tracking', settings.tracking !== 'normal' && settings.tracking);
    setVariable(root, '--a11y-tracking', settings.tracking !== 'normal' && settings.tracking);

    const text = settings.darkMode ? settings.textDark : settings.textLight;
    const button = settings.darkMode ? settings.buttonDark : settings.buttonLight;
    setVariable(root, '--color-ink', text);
    setVariable(root, '--color-navy', text);
    setVariable(root, '--color-muted', text);
    setVariable(root, '--color-primary', button);
    setVariable(root, '--color-on-primary', button && (settings.darkMode ? '#0f1c25' : '#ffffff'));
    // fundos com texto branco precisam de um tom escuro, mesmo no modo escuro
    setVariable(root, '--color-primary-fill', button && (settings.darkMode ? `color-mix(in oklab, ${button} 45%, black)` : button));
  }, [settings]);

  function update(key, value) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function changeFont(step) {
    setSettings((current) => {
      const fontStep = Math.min(Math.max(current.fontStep + step, 0), fontSteps.length - 1);
      return { ...current, fontStep };
    });
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      return true;
    } catch {
      return false;
    }
  }

  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // sem acesso ao localStorage
    }
    setSettings(defaultSettings());
  }

  const value = {
    settings,
    update,
    reset,
    save,
    increaseFont: () => changeFont(1),
    decreaseFont: () => changeFont(-1),
    canIncreaseFont: settings.fontStep < fontSteps.length - 1,
    canDecreaseFont: settings.fontStep > 0,
    fontPercent: Math.round(fontSteps[settings.fontStep] * 100),
  };

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}
