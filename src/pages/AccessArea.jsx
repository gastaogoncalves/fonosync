import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Lock, PersonStanding, ShieldCheck, User, UserCheck, Volume2, VolumeX } from 'lucide-react';
import logoImg from '../assets/images/ModeloA_Semnome.jpg';
import { useA11y } from '../hooks/useA11y';
import A11yModal from '../components/A11yModal';
import InfoDialog from '../components/InfoDialog';
import Notice from '../components/Notice';
import { buttonClass } from '../components/buttonStyles';
import { INFO_PAGES } from '../utils/constants';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function identifierError(value, userType) {
  const text = value.trim();
  if (!text) return userType === 'profissional' ? 'Informe seu e-mail profissional ou CRFa.' : 'Informe seu e-mail ou CPF.';
  if (EMAIL.test(text)) return '';
  if (userType === 'profissional' && /^crfa\s*[\d\s-]+$/i.test(text)) return '';
  if (userType === 'paciente' && text.replace(/\D/g, '').length === 11) return '';
  return userType === 'profissional'
    ? 'Use um e-mail válido ou o CRFa (ex.: CRFa 2-19876).'
    : 'Use um e-mail válido ou um CPF com 11 números.';
}

function TextField({ id, label, icon: Icon, error, hint, trailing, ...props }) {
  const describedBy = error ? `${id}-erro` : hint ? `${id}-dica` : undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-bold uppercase text-navy">
        {label}
      </label>
      <div
        className={`flex items-center gap-2 rounded-md border bg-surface p-3 text-sm focus-within:outline-3 focus-within:outline-focus ${
          error ? 'border-danger' : 'border-line'
        }`}
      >
        <Icon size={18} className="shrink-0 text-muted" aria-hidden="true" />
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className="w-full bg-transparent font-semibold text-ink outline-none"
          {...props}
        />
        {trailing}
      </div>
      {error ? (
        <p id={`${id}-erro`} className="mt-1 text-xs font-bold text-danger">{error}</p>
      ) : hint ? (
        <p id={`${id}-dica`} className="mt-1 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export default function AccessArea() {
  const [userType, setUserType] = useState('profissional');
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', identifier: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showA11y, setShowA11y] = useState(false);
  const { isPlayerOpen, speakPageContent, stopSpeaking } = useA11y();

  const isPro = userType === 'profissional';

  const update = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
    setErrors({ ...errors, [field]: '' });
  };

  const changeUserType = (type) => {
    setUserType(type);
    setErrors({});
    setNotice(null);
  };

  const changeMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setErrors({});
    setNotice(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const next = {
      name: mode === 'register' && form.name.trim().length < 3 ? 'Informe seu nome completo.' : '',
      identifier: identifierError(form.identifier, userType),
      password: form.password.length < 8 ? 'Use ao menos 8 caracteres.' : '',
    };
    setErrors(next);

    const firstInvalid = ['name', 'identifier', 'password'].find((key) => next[key]);
    if (firstInvalid) {
      document.getElementById(`acesso-${firstInvalid}`)?.focus();
      return;
    }

    window.location.hash = isPro ? '#/profissional/dashboard' : '#/paciente/inicio';
  };

  const handleForgot = () => {
    if (!EMAIL.test(form.identifier.trim())) {
      setErrors({ identifier: 'Informe o e-mail cadastrado para recuperar a senha.' });
      document.getElementById('acesso-identifier')?.focus();
      return;
    }
    setErrors({});
    setNotice({
      title: 'Confira seu e-mail',
      text: 'Se o endereço estiver cadastrado, você receberá as instruções.',
    });
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-canvas font-sans">
      <header className="sticky top-0 z-40 border-b border-line bg-surface/95 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-360 items-center justify-between">
          <a href="#/" className="flex items-center gap-3">
            <img src={logoImg} alt="FonoSync Logo" className="h-9 w-auto rounded bg-white object-contain" />
            <span className="font-serif text-xl font-bold text-navy">FonoSync</span>
          </a>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setShowA11y(true)}
              className="flex min-h-11 items-center gap-1.5 rounded-lg border border-navy px-3.5 text-xs font-bold text-navy hover:bg-mist"
            >
              <PersonStanding size={16} aria-hidden="true" /> Acessibilidade
            </button>
            <button
              type="button"
              onClick={() => (isPlayerOpen ? stopSpeaking() : speakPageContent())}
              className={`flex min-h-11 items-center gap-1.5 rounded-lg border px-3.5 text-xs font-bold ${
                isPlayerOpen ? 'border-danger bg-danger text-on-primary' : 'border-line text-navy hover:bg-mist'
              }`}
            >
              {isPlayerOpen ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
              {isPlayerOpen ? 'Parar leitura' : 'Ouvir página'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-line bg-surface p-8 shadow-xl">
          <div className="space-y-2 text-center">
            <h1 className="font-serif text-3xl font-bold text-navy">
              {mode === 'login' ? 'Acessar FonoSync' : 'Criar cadastro'}
            </h1>
            <p className="text-xs text-muted">Selecione o seu perfil para entrar na plataforma</p>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-xl border border-line bg-mist p-1.5">
            {[
              { id: 'profissional', label: 'Profissional', icon: UserCheck },
              { id: 'paciente', label: 'Paciente', icon: User },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={userType === id}
                onClick={() => changeUserType(id)}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-lg text-xs font-bold transition-all ${
                  userType === id ? 'bg-primary text-on-primary shadow-sm' : 'text-ink hover:text-navy'
                }`}
              >
                <Icon size={16} aria-hidden="true" /> {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {mode === 'register' && (
              <TextField
                id="acesso-name"
                label="Nome completo"
                icon={User}
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={update('name')}
                error={errors.name}
                placeholder="Seu nome"
              />
            )}

            <TextField
              id="acesso-identifier"
              label={isPro ? 'E-mail profissional / CRFa' : 'E-mail ou CPF do responsável'}
              icon={User}
              type="text"
              autoComplete="username"
              value={form.identifier}
              onChange={update('identifier')}
              error={errors.identifier}
              placeholder={isPro ? 'renata.lima@fonosync.com.br' : 'clara.ferreira@email.com'}
            />

            <TextField
              id="acesso-password"
              label="Senha de acesso"
              icon={Lock}
              type={showPassword ? 'text' : 'password'}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={form.password}
              onChange={update('password')}
              error={errors.password}
              hint="Use ao menos 8 caracteres."
              placeholder="••••••••"
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  className="rounded p-1 text-muted hover:text-navy"
                >
                  {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              }
            />

            <div role="status">
              {notice && (
                <Notice tone="info" title={notice.title}>
                  {notice.text}
                </Notice>
              )}
            </div>

            <button type="submit" className={`${buttonClass('primary')} w-full`}>
              {mode === 'login'
                ? `Entrar como ${isPro ? 'fonoaudiólogo' : 'paciente'}`
                : `Criar conta de ${isPro ? 'fonoaudiólogo' : 'paciente'}`}
              <ArrowRight size={16} aria-hidden="true" />
            </button>

            <div className="flex flex-wrap items-center justify-between gap-2">
              {mode === 'login' ? (
                <button type="button" onClick={handleForgot} className={buttonClass('tertiary')}>
                  Esqueci minha senha
                </button>
              ) : (
                <span />
              )}
              <button type="button" onClick={changeMode} className={buttonClass('secondary')}>
                {mode === 'login' ? 'Criar cadastro' : 'Já tenho cadastro'}
              </button>
            </div>
          </form>

          <div className="flex flex-col items-center gap-1 border-t border-line pt-4 text-center text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-success" aria-hidden="true" /> Ambiente seguro e em conformidade com a LGPD
            </span>
            <button
              type="button"
              onClick={() => setShowPrivacy(true)}
              className="font-bold text-primary underline-offset-4 hover:underline"
            >
              Política de Privacidade e LGPD
            </button>
          </div>
        </div>
      </main>

      <footer className="border-t border-line bg-surface py-4 text-center text-xs text-muted">
        © 2026 FonoSync. Todos os direitos reservados.
      </footer>

      <InfoDialog isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title={INFO_PAGES.privacidade.title}>
        {INFO_PAGES.privacidade.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </InfoDialog>

      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />
    </div>
  );
}