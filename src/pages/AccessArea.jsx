import { useState } from 'react';
import { ArrowRight, BadgeCheck, Eye, EyeOff, Lock, PersonStanding, Phone, ShieldCheck, Stethoscope, User, UserCheck, Volume2, VolumeX } from 'lucide-react';
import logoImg from '../assets/images/ModeloA_Semnome.jpg';
import { useA11y } from '../hooks/useA11y';
import A11yModal from '../components/A11yModal';
import InfoDialog from '../components/InfoDialog';
import Notice from '../components/Notice';
import { buttonClass } from '../components/buttonStyles';
import { INFO_PAGES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import { homeFor } from '../services/authService';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [form, setForm] = useState({ name: '', crfa: '', phone: '', specialty: '', identifier: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showA11y, setShowA11y] = useState(false);
  const { isPlayerOpen, speakPageContent, stopSpeaking } = useA11y();
  const { login, register } = useAuth();

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = form.identifier.trim();
    const registering = mode === 'register';
    const next = {
      name: registering && form.name.trim().length < 3 ? 'Informe seu nome completo.' : '',
      crfa: registering && isPro && !form.crfa.trim() ? 'Informe seu CRFa.' : '',
      identifier: !email ? 'Informe seu e-mail.' : !EMAIL.test(email) ? 'Use um e-mail válido.' : '',
      password: !form.password
        ? 'Informe sua senha.'
        : mode === 'register' && form.password.length < 6
          ? 'Use ao menos 6 caracteres.'
          : '',
    };
    setErrors(next);

    const firstInvalid = ['name', 'crfa', 'identifier', 'password'].find((key) => next[key]);
    if (firstInvalid) {
      document.getElementById(`acesso-${firstInvalid}`)?.focus();
      return;
    }

    setLoading(true);
    setNotice(null);
    try {
      const session =
        mode === 'login'
          ? await login(email, form.password)
          : await register(
              email,
              form.password,
              isPro ? 'ROLE_FONO' : 'ROLE_PACIENTE',
              isPro
                ? { name: form.name.trim(), crfa: form.crfa.trim(), phone: form.phone.trim(), specialty: form.specialty.trim() }
                : { name: form.name.trim(), phone: form.phone.trim() },
            );
      window.location.hash = homeFor(session.role);
    } catch (error) {
      setNotice({ tone: 'danger', title: mode === 'login' ? 'Não foi possível entrar' : 'Não foi possível criar a conta', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = () => {
    if (!EMAIL.test(form.identifier.trim())) {
      setErrors({ identifier: 'Informe o e-mail cadastrado para recuperar a senha.' });
      document.getElementById('acesso-identifier')?.focus();
      return;
    }
    setErrors({});
    setNotice({
      tone: 'info',
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
              <>
                <TextField
                  id="acesso-name"
                  label="Nome completo"
                  icon={User}
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={update('name')}
                  error={errors.name}
                />
                {isPro && (
                  <TextField
                    id="acesso-crfa"
                    label="CRFa"
                    icon={BadgeCheck}
                    type="text"
                    value={form.crfa}
                    onChange={update('crfa')}
                    error={errors.crfa}
                    placeholder="2-12345"
                  />
                )}
                <TextField
                  id="acesso-phone"
                  label="Telefone / WhatsApp"
                  icon={Phone}
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={update('phone')}
                  placeholder="(11) 99999-9999"
                />
                {isPro && (
                  <TextField
                    id="acesso-specialty"
                    label="Especialidade principal"
                    icon={Stethoscope}
                    type="text"
                    value={form.specialty}
                    onChange={update('specialty')}
                    placeholder="Fluência, linguagem, voz..."
                  />
                )}
              </>
            )}

            <TextField
              id="acesso-identifier"
              label={isPro ? 'E-mail profissional' : 'E-mail'}
              icon={User}
              type="email"
              autoComplete="username"
              value={form.identifier}
              onChange={update('identifier')}
              error={errors.identifier}
              placeholder="seu@email.com"
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
              hint={mode === 'register' ? 'Use ao menos 6 caracteres.' : undefined}
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
                <Notice tone={notice.tone} title={notice.title}>
                  {notice.text}
                </Notice>
              )}
            </div>

            <button type="submit" disabled={loading} className={`${buttonClass('primary')} w-full`}>
              {loading
                ? 'Aguarde...'
                : mode === 'login'
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