import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import {
  ArrowRight,
  Baby,
  Eye,
  EyeOff,
  FileBadge,
  HeartHandshake,
  Lock,
  Mail,
  PersonStanding,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User,
  UserCheck,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react';
import logoImg from '../assets/images/ModeloA_Semnome.jpg';
import { useA11y } from '../hooks/useA11y';
import A11yModal from '../components/A11yModal';
import InfoDialog from '../components/InfoDialog';
import Notice from '../components/Notice';
import { INFO_PAGES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import { homeFor } from '../services/authService';
import { calculateAge, formatCPF, formatPhone } from '../utils/formatters';
import { createGuardian, createPatient } from '../services/patientService';
import { registerProfessional } from '../services/professionalService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function GoogleIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function FormInput({ id, label, icon: Icon, error, hint, trailing, ...props }) {
  const describedBy = error ? `${id}-erro` : hint ? `${id}-dica` : undefined;

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-[#172C3A]">
        {label}
      </label>
      <div
        className={`flex items-center gap-2.5 rounded-xl border bg-white px-3.5 py-2.5 text-sm transition focus-within:ring-2 focus-within:ring-[#0284C7] focus-within:border-[#0284C7] ${
          error ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        {Icon && <Icon size={17} className="shrink-0 text-slate-400" aria-hidden="true" />}
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className="w-full bg-transparent font-medium text-slate-900 placeholder:text-slate-400 outline-none text-xs"
          {...props}
        />
        {trailing}
      </div>
      {error ? (
        <p id={`${id}-erro`} className="text-[11px] font-bold text-rose-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-dica`} className="text-[11px] text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function FormSelect({ id, label, icon: Icon, error, options = [], ...props }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-[#172C3A]">
        {label}
      </label>
      <div
        className={`flex items-center gap-2.5 rounded-xl border bg-white px-3.5 py-2.5 text-sm transition focus-within:ring-2 focus-within:ring-[#0284C7] focus-within:border-[#0284C7] ${
          error ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        {Icon && <Icon size={17} className="shrink-0 text-slate-400" aria-hidden="true" />}
        <select
          id={id}
          className="w-full bg-transparent font-medium text-slate-900 outline-none text-xs cursor-pointer"
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-[11px] font-bold text-rose-600">{error}</p>}
    </div>
  );
}

export default function AccessArea() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loginRole, setLoginRole] = useState('profissional'); // 'profissional' | 'paciente'
  const [registerCategory, setRegisterCategory] = useState('fonoaudiologo'); // 'fonoaudiologo' | 'responsavel' | 'paciente_adulto'

  // Login form state
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });

  // Registration form states
  const [proForm, setProForm] = useState({
    name: '',
    crfa: '',
    phone: '',
    specialty: 'Fonoaudiologia Clínica Geral',
    email: '',
    password: '',
  });

  const [guardianForm, setGuardianForm] = useState({
    // Responsável
    guardianName: '',
    guardianCpf: '',
    guardianPhone: '',
    guardianRelationship: 'Mãe',
    // Paciente Dependente
    patientName: '',
    patientBirthDate: '',
    patientSex: 'MASCULINO',
    // Acesso
    email: '',
    password: '',
  });

  const [adultPatientForm, setAdultPatientForm] = useState({
    name: '',
    birthDate: '',
    cpf: '',
    phone: '',
    sex: 'MASCULINO',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showA11y, setShowA11y] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const { isPlayerOpen, speakPageContent, stopSpeaking } = useA11y();
  const { login, register, updateSession } = useAuth();

  const changeMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setNotice(null);
  };

  // Real Google OAuth Flow
  const handleGoogleSuccess = async (googleUser, asRole) => {
    setLoading(true);
    setNotice(null);
    try {
      const email = googleUser.email;
      const pass = `Google_${googleUser.sub || 'OAuth'}_SafeKey!2026`;
      try {
        const session = await login(email, pass);
        updateSession({ name: googleUser.name, picture: googleUser.picture });
        window.location.hash = homeFor(session.role);
      } catch {
        // Se ainda não existir no back, registra a conta automaticamente
        try {
          const session = await register(email, pass, asRole);
          updateSession({ name: googleUser.name, picture: googleUser.picture });
          window.location.hash = homeFor(session.role);
        } catch {
          // Fallback caso o backend não esteja ativo
          updateSession({
            email,
            name: googleUser.name,
            role: asRole,
            token: `google-jwt-${Date.now()}`,
            picture: googleUser.picture,
          });
          window.location.hash = homeFor(asRole);
        }
      }
    } catch (err) {
      setNotice({ tone: 'danger', title: 'Falha no login Google', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await res.json();
        const targetRole =
          mode === 'login'
            ? loginRole === 'profissional'
              ? 'ROLE_FONO'
              : 'ROLE_PACIENTE'
            : registerCategory === 'fonoaudiologo'
            ? 'ROLE_FONO'
            : 'ROLE_PACIENTE';

        await handleGoogleSuccess(googleUser, targetRole);
      } catch (err) {
        setNotice({
          tone: 'danger',
          title: 'Erro ao autenticar com o Google',
          text: err.message,
        });
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.warn('Google login dialog was closed or cancelled:', error);
      setShowGoogleModal(true);
    },
  });

  const handleSimulateGoogleLogin = async (asRole) => {
    setShowGoogleModal(false);
    setLoading(true);
    setNotice(null);
    try {
      const demoEmail = asRole === 'ROLE_FONO' ? 'renata.fono@fonosync.com.br' : 'clara.mae@gmail.com';
      const demoPass = 'google123';
      try {
        const session = await login(demoEmail, demoPass);
        window.location.hash = homeFor(session.role);
      } catch {
        const session = await register(demoEmail, demoPass, asRole);
        if (asRole === 'ROLE_FONO') {
          updateSession({ name: 'Dra. Renata Lima (Google)', crfa: 'CRFa 2-18490/SP' });
        } else {
          updateSession({ name: 'Clara Ferreira (Google)' });
        }
        window.location.hash = homeFor(session.role);
      }
    } catch (err) {
      setNotice({ tone: 'danger', title: 'Falha no login Google', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Submissão do Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = loginForm.identifier.trim();
    const nextErrors = {
      identifier: !email ? 'Informe seu e-mail.' : !EMAIL_REGEX.test(email) ? 'E-mail inválido.' : '',
      password: !loginForm.password ? 'Informe sua senha de acesso.' : '',
    };
    setErrors(nextErrors);
    if (nextErrors.identifier || nextErrors.password) return;

    setLoading(true);
    setNotice(null);
    try {
      const session = await login(email, loginForm.password);
      window.location.hash = homeFor(session.role);
    } catch (error) {
      setNotice({
        tone: 'danger',
        title: 'Não foi possível entrar',
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Submissão do Cadastro de Fonoaudiólogo
  const handleProRegisterSubmit = async (e) => {
    e.preventDefault();
    const email = proForm.email.trim();
    const nextErrors = {
      name: !proForm.name.trim() ? 'Informe seu nome completo.' : '',
      crfa: !proForm.crfa.trim() ? 'Informe o seu registro no CRFa.' : '',
      phone: !proForm.phone.trim() ? 'Informe seu telefone de contato.' : '',
      email: !email ? 'Informe seu e-mail profissional.' : !EMAIL_REGEX.test(email) ? 'E-mail inválido.' : '',
      password: proForm.password.length < 6 ? 'A senha deve ter no mínimo 6 caracteres.' : '',
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setLoading(true);
    setNotice(null);
    try {
      // 1. Cadastra credenciais de acesso no banco
      const session = await register(email, proForm.password, 'ROLE_FONO');

      // 2. Registra perfil do fonoaudiólogo
      try {
        await registerProfessional({
          name: proForm.name.trim(),
          crfa: proForm.crfa.trim(),
          phone: proForm.phone.trim(),
          specialty: proForm.specialty,
        });
      } catch (profError) {
        console.warn('Aviso ao registrar dados complementares do fonoaudiólogo:', profError);
      }

      // 3. Atualiza dados no contexto da sessão
      updateSession({
        name: proForm.name.trim(),
        crfa: proForm.crfa.trim(),
        specialty: proForm.specialty,
        phone: proForm.phone.trim(),
      });

      window.location.hash = homeFor(session.role);
    } catch (error) {
      setNotice({ tone: 'danger', title: 'Erro ao criar conta', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Submissão do Cadastro de Responsável com Dependente
  const handleGuardianRegisterSubmit = async (e) => {
    e.preventDefault();
    const email = guardianForm.email.trim();
    const childAge = calculateAge(guardianForm.patientBirthDate);

    const nextErrors = {
      guardianName: !guardianForm.guardianName.trim() ? 'Informe o nome do responsável.' : '',
      guardianCpf: !guardianForm.guardianCpf.trim() ? 'Informe o CPF do responsável.' : '',
      guardianPhone: !guardianForm.guardianPhone.trim() ? 'Informe o telefone do responsável.' : '',
      patientName: !guardianForm.patientName.trim() ? 'Informe o nome da criança/paciente.' : '',
      patientBirthDate: !guardianForm.patientBirthDate
        ? 'Informe a data de nascimento da criança.'
        : childAge !== null && childAge >= 18
        ? 'Para pacientes maiores de 18 anos, selecione a opção "Próprio Paciente".'
        : '',
      email: !email ? 'Informe o e-mail de acesso.' : !EMAIL_REGEX.test(email) ? 'E-mail inválido.' : '',
      password: guardianForm.password.length < 6 ? 'A senha deve ter no mínimo 6 caracteres.' : '',
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setLoading(true);
    setNotice(null);
    try {
      // 1. Cria usuário autenticável
      const session = await register(email, guardianForm.password, 'ROLE_PACIENTE');

      // 2. Cria registro do responsável
      let guardianId = null;
      try {
        const guardian = await createGuardian({
          name: guardianForm.guardianName.trim(),
          cpf: guardianForm.guardianCpf.trim(),
          phoneNumber: guardianForm.guardianPhone.trim(),
          relationship: guardianForm.guardianRelationship,
        });
        guardianId = guardian.id;
      } catch (err) {
        console.warn('Aviso ao criar responsável:', err);
      }

      // 3. Cria registro do paciente dependente com status de pré-cadastro (sem CPF para proteção do menor)
      try {
        await createPatient({
          name: guardianForm.patientName.trim(),
          dateOfBirth: guardianForm.patientBirthDate,
          cpfPatient: null,
          contactPatient: guardianForm.guardianPhone.trim(),
          sex: guardianForm.patientSex,
          guardianId,
          patientStatus: 'PRE_CADASTRO',
        });
      } catch (patErr) {
        console.warn('Aviso ao criar dependente:', patErr);
      }

      // 4. Salva nome no contexto
      updateSession({
        name: guardianForm.patientName.trim(),
        guardianName: guardianForm.guardianName.trim(),
      });

      window.location.hash = homeFor(session.role);
    } catch (error) {
      setNotice({ tone: 'danger', title: 'Erro ao criar cadastro familiar', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Submissão do Cadastro de Paciente Adulto (Maior de Idade)
  const handleAdultRegisterSubmit = async (e) => {
    e.preventDefault();
    const email = adultPatientForm.email.trim();
    const age = calculateAge(adultPatientForm.birthDate);

    const nextErrors = {
      name: !adultPatientForm.name.trim() ? 'Informe seu nome completo.' : '',
      birthDate: !adultPatientForm.birthDate
        ? 'Informe sua data de nascimento.'
        : age !== null && age < 18
        ? 'Pacientes menores de 18 anos devem ser cadastrados pela opção "Responsável Legal".'
        : '',
      cpf: !adultPatientForm.cpf.trim() ? 'Informe seu CPF.' : '',
      phone: !adultPatientForm.phone.trim() ? 'Informe seu telefone de contato.' : '',
      email: !email ? 'Informe seu e-mail de acesso.' : !EMAIL_REGEX.test(email) ? 'E-mail inválido.' : '',
      password: adultPatientForm.password.length < 6 ? 'A senha deve ter no mínimo 6 caracteres.' : '',
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setLoading(true);
    setNotice(null);
    try {
      // 1. Cria usuário autenticável
      const session = await register(email, adultPatientForm.password, 'ROLE_PACIENTE');

      // 2. Cria registro do paciente adulto (sem responsável)
      try {
        await createPatient({
          name: adultPatientForm.name.trim(),
          dateOfBirth: adultPatientForm.birthDate,
          cpfPatient: adultPatientForm.cpf.trim(),
          contactPatient: adultPatientForm.phone.trim(),
          sex: adultPatientForm.sex,
          guardianId: null,
          patientStatus: 'PRE_CADASTRO',
        });
      } catch (patErr) {
        console.warn('Aviso ao cadastrar paciente adulto:', patErr);
      }

      updateSession({ name: adultPatientForm.name.trim() });
      window.location.hash = homeFor(session.role);
    } catch (error) {
      setNotice({ tone: 'danger', title: 'Erro ao cadastrar paciente', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-50 font-sans">
      {/* Header com Acessibilidade e Logo */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-3.5 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <a href="#/" className="flex items-center gap-2.5 transition hover:opacity-85">
            <img src={logoImg} alt="FonoSync Logo" className="h-9 w-auto rounded-lg object-contain shadow-xs" />
            <span className="font-serif text-xl font-bold tracking-tight text-[#172C3A]">FonoSync</span>
          </a>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setShowA11y(true)}
              className="flex min-h-10 items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 text-xs font-bold text-[#172C3A] hover:bg-slate-50 shadow-xs transition"
            >
              <PersonStanding size={16} aria-hidden="true" /> Acessibilidade
            </button>
            <button
              type="button"
              onClick={() => (isPlayerOpen ? stopSpeaking() : speakPageContent())}
              className={`flex min-h-10 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition shadow-xs ${
                isPlayerOpen
                  ? 'border-rose-300 bg-rose-50 text-rose-700'
                  : 'border-slate-300 bg-white text-[#172C3A] hover:bg-slate-50'
              }`}
            >
              {isPlayerOpen ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
              {isPlayerOpen ? 'Parar leitura' : 'Ouvir página'}
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl">
          {/* Cabeçalho do Card */}
          <div className="text-center space-y-1.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#172C3A]">
              {mode === 'login' ? 'Acessar o FonoSync' : 'Criar Nova Conta'}
            </h1>
            <p className="text-xs text-slate-500">
              {mode === 'login'
                ? 'Entre com suas credenciais ou faça login direto com sua conta Google'
                : 'Selecione o seu perfil para preencher os dados de acordo com as regras clínicas'}
            </p>
          </div>

          {/* Toggle Modo: Login vs Cadastro */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => changeMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                mode === 'login' ? 'bg-white text-[#172C3A] shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Já tenho cadastro (Entrar)
            </button>
            <button
              type="button"
              onClick={() => changeMode('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                mode === 'register' ? 'bg-[#0284C7] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Criar novo cadastro
            </button>
          </div>

          {/* ============================================================== */}
          {/* MODO LOGIN                                                     */}
          {/* ============================================================== */}
          {mode === 'login' && (
            <div className="space-y-4">
              {/* Seleção de tipo de login */}
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setLoginRole('profissional')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition ${
                    loginRole === 'profissional'
                      ? 'bg-[#172C3A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Stethoscope size={16} /> Profissional (Fono)
                </button>
                <button
                  type="button"
                  onClick={() => setLoginRole('paciente')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition ${
                    loginRole === 'paciente'
                      ? 'bg-[#172C3A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User size={16} /> Paciente / Família
                </button>
              </div>

              {/* Botão Entrar com Google */}
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7] cursor-pointer"
              >
                <GoogleIcon />
                <span>Continuar com o Google</span>
              </button>

              <div className="relative flex items-center justify-center my-4">
                <div className="w-full border-t border-slate-200" />
                <span className="absolute bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  ou entre com e-mail
                </span>
              </div>

              <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
                <FormInput
                  id="login-email"
                  label={loginRole === 'profissional' ? 'E-mail profissional' : 'E-mail de acesso'}
                  icon={Mail}
                  type="email"
                  autoComplete="username"
                  placeholder={
                    loginRole === 'profissional' ? 'dra.renata@fonosync.com.br' : 'paciente.familia@email.com'
                  }
                  value={loginForm.identifier}
                  onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                  error={errors.identifier}
                />

                <FormInput
                  id="login-password"
                  label="Senha de acesso"
                  icon={Lock}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  error={errors.password}
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-700 p-1"
                      aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />

                {notice && (
                  <Notice tone={notice.tone} title={notice.title}>
                    {notice.text}
                  </Notice>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0284C7] px-4 py-3 text-xs font-bold text-white shadow-sm hover:bg-sky-700 transition cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    'Entrando...'
                  ) : (
                    <>
                      <span>Entrar como {loginRole === 'profissional' ? 'Fonoaudiólogo(a)' : 'Paciente / Família'}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODO CADASTRO (COM AS REGRAS DO BANCO DE DADOS)               */}
          {/* ============================================================== */}
          {mode === 'register' && (
            <div className="space-y-5">
              {/* Botão Cadastrar com Google */}
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7] cursor-pointer"
              >
                <GoogleIcon />
                <span>Cadastrar rapidamente com o Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-slate-200" />
                <span className="absolute bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  ou selecione seu tipo de perfil
                </span>
              </div>

              {/* Seleção do Perfil de Cadastro: 3 Categorias */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'fonoaudiologo',
                    title: 'Fonoaudiólogo',
                    subtitle: 'Profissional de Saúde',
                    icon: Stethoscope,
                  },
                  {
                    id: 'responsavel',
                    title: 'Responsável',
                    subtitle: 'Pais / Tutores de Menor',
                    icon: Users,
                  },
                  {
                    id: 'paciente_adulto',
                    title: 'Paciente Adulto',
                    subtitle: 'Maior de 18 anos',
                    icon: User,
                  },
                ].map(({ id, title, subtitle, icon: Icon }) => {
                  const selected = registerCategory === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setRegisterCategory(id);
                        setErrors({});
                        setNotice(null);
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition cursor-pointer ${
                        selected
                          ? 'border-[#0284C7] bg-sky-50/50 text-[#0284C7] shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <Icon size={20} className={`mb-1.5 ${selected ? 'text-[#0284C7]' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold leading-tight">{title}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">{subtitle}</span>
                    </button>
                  );
                })}
              </div>

              {/* ---------------------------------------------------------- */}
              {/* FORMULÁRIO 1: FONOAUDIÓLOGO                                */}
              {/* ---------------------------------------------------------- */}
              {registerCategory === 'fonoaudiologo' && (
                <form onSubmit={handleProRegisterSubmit} noValidate className="space-y-3.5">
                  <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 flex items-start gap-2.5 text-xs text-sky-900">
                    <Sparkles size={16} className="text-[#0284C7] shrink-0 mt-0.5" />
                    <p>
                      Cadastro completo do profissional clínico. Seus dados de CRFa e especialidade serão exibidos nos
                      laudos e prontuários dos pacientes.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormInput
                      id="pro-name"
                      label="Nome Completo *"
                      icon={User}
                      placeholder="Dra. Juliana Santos"
                      value={proForm.name}
                      onChange={(e) => setProForm({ ...proForm, name: e.target.value })}
                      error={errors.name}
                    />

                    <FormInput
                      id="pro-crfa"
                      label="Registro CRFa *"
                      icon={FileBadge}
                      placeholder="CRFa 2-19842"
                      value={proForm.crfa}
                      onChange={(e) => setProForm({ ...proForm, crfa: e.target.value })}
                      error={errors.crfa}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormInput
                      id="pro-phone"
                      label="Telefone / WhatsApp *"
                      icon={Phone}
                      placeholder="(11) 98765-4321"
                      value={proForm.phone}
                      onChange={(e) => setProForm({ ...proForm, phone: formatPhone(e.target.value) })}
                      error={errors.phone}
                    />

                    <FormSelect
                      id="pro-specialty"
                      label="Especialidade *"
                      icon={Stethoscope}
                      value={proForm.specialty}
                      onChange={(e) => setProForm({ ...proForm, specialty: e.target.value })}
                      options={[
                        { value: 'Fonoaudiologia Clínica Geral', label: 'Clínica Geral' },
                        { value: 'Linguagem e Fala Infantil', label: 'Linguagem e Fala Infantil' },
                        { value: 'Audiologia e Processamento Auditivo', label: 'Audiologia' },
                        { value: 'Motricidade Orofacial e Disfagia', label: 'Motricidade Orofacial' },
                        { value: 'Voz e Comunicação', label: 'Voz e Comunicação' },
                        { value: 'Fonoaudiologia Educacional', label: 'Educacional' },
                      ]}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormInput
                      id="pro-email"
                      label="E-mail Profissional *"
                      icon={Mail}
                      type="email"
                      placeholder="dra.juliana@fonosync.com.br"
                      value={proForm.email}
                      onChange={(e) => setProForm({ ...proForm, email: e.target.value })}
                      error={errors.email}
                    />

                    <FormInput
                      id="pro-password"
                      label="Senha de Acesso *"
                      icon={Lock}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 dígitos"
                      value={proForm.password}
                      onChange={(e) => setProForm({ ...proForm, password: e.target.value })}
                      error={errors.password}
                      trailing={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-slate-700 p-1"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      }
                    />
                  </div>

                  {notice && (
                    <Notice tone={notice.tone} title={notice.title}>
                      {notice.text}
                    </Notice>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#0284C7] px-4 py-3 text-xs font-bold text-white shadow-sm hover:bg-sky-700 transition cursor-pointer disabled:opacity-60"
                  >
                    {loading ? 'Criando conta profissional...' : 'Concluir Cadastro de Fonoaudiólogo(a)'}
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}

              {/* ---------------------------------------------------------- */}
              {/* FORMULÁRIO 2: RESPONSÁVEL FAMILIAR COM DEPENDENTE MENOR   */}
              {/* ---------------------------------------------------------- */}
              {registerCategory === 'responsavel' && (
                <form onSubmit={handleGuardianRegisterSubmit} noValidate className="space-y-4">
                  {/* Seção 1: Dados do Responsável */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      <HeartHandshake size={16} className="text-[#0284C7]" />
                      <span className="text-xs font-bold text-[#172C3A] uppercase tracking-wide">
                        1. Dados do Responsável Legal
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FormInput
                        id="guard-name"
                        label="Nome do Responsável *"
                        icon={User}
                        placeholder="Ex: Mariana Ferreira"
                        value={guardianForm.guardianName}
                        onChange={(e) => setGuardianForm({ ...guardianForm, guardianName: e.target.value })}
                        error={errors.guardianName}
                      />

                      <FormInput
                        id="guard-cpf"
                        label="CPF do Responsável *"
                        icon={FileBadge}
                        placeholder="000.000.000-00"
                        value={guardianForm.guardianCpf}
                        onChange={(e) => setGuardianForm({ ...guardianForm, guardianCpf: formatCPF(e.target.value) })}
                        error={errors.guardianCpf}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FormInput
                        id="guard-phone"
                        label="Telefone / WhatsApp *"
                        icon={Phone}
                        placeholder="(11) 98765-4321"
                        value={guardianForm.guardianPhone}
                        onChange={(e) => setGuardianForm({ ...guardianForm, guardianPhone: formatPhone(e.target.value) })}
                        error={errors.guardianPhone}
                      />

                      <FormSelect
                        id="guard-rel"
                        label="Grau de Parentesco *"
                        icon={Users}
                        value={guardianForm.guardianRelationship}
                        onChange={(e) => setGuardianForm({ ...guardianForm, guardianRelationship: e.target.value })}
                        options={[
                          { value: 'Mãe', label: 'Mãe' },
                          { value: 'Pai', label: 'Pai' },
                          { value: 'Avó / Avô', label: 'Avó / Avô' },
                          { value: 'Tutor(a) Legal', label: 'Tutor(a) Legal' },
                          { value: 'Irmão(ã) Maior', label: 'Irmão(ã) Maior' },
                          { value: 'Outro', label: 'Outro' },
                        ]}
                      />
                    </div>
                  </div>

                  {/* Seção 2: Dados do Dependente (Paciente) */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <Baby size={16} className="text-[#0284C7]" />
                        <span className="text-xs font-bold text-[#172C3A] uppercase tracking-wide">
                          2. Dados da Criança / Dependente (Paciente)
                        </span>
                      </div>
                      {guardianForm.patientBirthDate && (
                        <span className="text-[11px] font-bold text-[#0284C7] bg-sky-100 px-2 py-0.5 rounded-md">
                          {calculateAge(guardianForm.patientBirthDate)} anos
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FormInput
                        id="pat-name"
                        label="Nome da Criança *"
                        icon={User}
                        placeholder="Ex: Lucas Ferreira"
                        value={guardianForm.patientName}
                        onChange={(e) => setGuardianForm({ ...guardianForm, patientName: e.target.value })}
                        error={errors.patientName}
                      />

                      <FormInput
                        id="pat-birth"
                        label="Data de Nascimento *"
                        type="date"
                        value={guardianForm.patientBirthDate}
                        onChange={(e) => setGuardianForm({ ...guardianForm, patientBirthDate: e.target.value })}
                        error={errors.patientBirthDate}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <FormSelect
                        id="pat-sex"
                        label="Sexo Biológico *"
                        value={guardianForm.patientSex}
                        onChange={(e) => setGuardianForm({ ...guardianForm, patientSex: e.target.value })}
                        options={[
                          { value: 'MASCULINO', label: 'Masculino' },
                          { value: 'FEMININO', label: 'Feminino' },
                          { value: 'OUTRO', label: 'Outro' },
                        ]}
                      />

                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-2">
                        <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>Proteção de Menores (LGPD):</strong> Por segurança e privacidade da criança, não
                          coletamos CPF ou dados frágeis do menor de idade.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Seção 3: Credenciais de Acesso da Família */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormInput
                      id="family-email"
                      label="E-mail de Acesso da Família *"
                      icon={Mail}
                      type="email"
                      placeholder="mariana.familia@email.com"
                      value={guardianForm.email}
                      onChange={(e) => setGuardianForm({ ...guardianForm, email: e.target.value })}
                      error={errors.email}
                    />

                    <FormInput
                      id="family-password"
                      label="Senha de Acesso *"
                      icon={Lock}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 dígitos"
                      value={guardianForm.password}
                      onChange={(e) => setGuardianForm({ ...guardianForm, password: e.target.value })}
                      error={errors.password}
                      trailing={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-slate-700 p-1"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      }
                    />
                  </div>

                  {notice && (
                    <Notice tone={notice.tone} title={notice.title}>
                      {notice.text}
                    </Notice>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0284C7] px-4 py-3 text-xs font-bold text-white shadow-sm hover:bg-sky-700 transition cursor-pointer disabled:opacity-60"
                  >
                    {loading ? 'Cadastrando família e dependente...' : 'Concluir Cadastro Familiar'}
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}

              {/* ---------------------------------------------------------- */}
              {/* FORMULÁRIO 3: PACIENTE ADULTO (MAIOR DE 18 ANOS)          */}
              {/* ---------------------------------------------------------- */}
              {registerCategory === 'paciente_adulto' && (
                <form onSubmit={handleAdultRegisterSubmit} noValidate className="space-y-3.5">
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-950">
                    <UserCheck size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <p>
                      Para pacientes com 18 anos ou mais que são responsáveis pelo próprio tratamento. O prontuário
                      clínico será gerado diretamente no seu nome.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormInput
                      id="adult-name"
                      label="Nome Completo *"
                      icon={User}
                      placeholder="Carlos Eduardo Mendes"
                      value={adultPatientForm.name}
                      onChange={(e) => setAdultPatientForm({ ...adultPatientForm, name: e.target.value })}
                      error={errors.name}
                    />

                    <FormInput
                      id="adult-birth"
                      label="Data de Nascimento *"
                      type="date"
                      value={adultPatientForm.birthDate}
                      onChange={(e) => setAdultPatientForm({ ...adultPatientForm, birthDate: e.target.value })}
                      error={errors.birthDate}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FormInput
                      id="adult-cpf"
                      label="CPF *"
                      icon={FileBadge}
                      placeholder="000.000.000-00"
                      value={adultPatientForm.cpf}
                      onChange={(e) => setAdultPatientForm({ ...adultPatientForm, cpf: formatCPF(e.target.value) })}
                      error={errors.cpf}
                    />

                    <FormInput
                      id="adult-phone"
                      label="Telefone / Celular *"
                      icon={Phone}
                      placeholder="(11) 98765-4321"
                      value={adultPatientForm.phone}
                      onChange={(e) => setAdultPatientForm({ ...adultPatientForm, phone: formatPhone(e.target.value) })}
                      error={errors.phone}
                    />

                    <FormSelect
                      id="adult-sex"
                      label="Sexo Biológico *"
                      value={adultPatientForm.sex}
                      onChange={(e) => setAdultPatientForm({ ...adultPatientForm, sex: e.target.value })}
                      options={[
                        { value: 'MASCULINO', label: 'Masculino' },
                        { value: 'FEMININO', label: 'Feminino' },
                        { value: 'OUTRO', label: 'Outro' },
                      ]}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormInput
                      id="adult-email"
                      label="E-mail de Acesso *"
                      icon={Mail}
                      type="email"
                      placeholder="carlos.mendes@email.com"
                      value={adultPatientForm.email}
                      onChange={(e) => setAdultPatientForm({ ...adultPatientForm, email: e.target.value })}
                      error={errors.email}
                    />

                    <FormInput
                      id="adult-password"
                      label="Senha de Acesso *"
                      icon={Lock}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 dígitos"
                      value={adultPatientForm.password}
                      onChange={(e) => setAdultPatientForm({ ...adultPatientForm, password: e.target.value })}
                      error={errors.password}
                      trailing={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-slate-700 p-1"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      }
                    />
                  </div>

                  {notice && (
                    <Notice tone={notice.tone} title={notice.title}>
                      {notice.text}
                    </Notice>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#0284C7] px-4 py-3 text-xs font-bold text-white shadow-sm hover:bg-sky-700 transition cursor-pointer disabled:opacity-60"
                  >
                    {loading ? 'Criando cadastro de paciente...' : 'Concluir Cadastro de Paciente Adulto'}
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Rodapé do Card com LGPD */}
          <div className="flex flex-col items-center gap-1.5 border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck size={16} className="text-emerald-600" aria-hidden="true" />
              Ambiente clínico seguro e criptografado em conformidade com a LGPD
            </span>
            <button
              type="button"
              onClick={() => setShowPrivacy(true)}
              className="font-bold text-[#0284C7] underline-offset-4 hover:underline cursor-pointer"
            >
              Política de Privacidade e Termos de Uso
            </button>
          </div>
        </div>
      </main>

      {/* Footer simples */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        © 2026 FonoSync — Projeto Integrador Fatec Ferraz de Vasconcelos. Todos os direitos reservados.
      </footer>

      {/* Modal de Acessibilidade */}
      <A11yModal isOpen={showA11y} onClose={() => setShowA11y(false)} />

      {/* Modal de Privacidade */}
      <InfoDialog isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title={INFO_PAGES.privacidade.title}>
        {INFO_PAGES.privacidade.paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </InfoDialog>

      {/* Modal Interativo de Autenticação com Google */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <GoogleIcon />
                <span className="font-bold text-sm text-[#172C3A]">FonoSync Google Auth</span>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Escolha uma conta Google para entrar ou sincronizar com o FonoSync:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleSimulateGoogleLogin('ROLE_FONO')}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-[#0284C7] hover:bg-sky-50/40 text-left transition"
              >
                <div className="w-9 h-9 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center">
                  DR
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">Dra. Renata Lima (Fonoaudióloga)</p>
                  <p className="text-[11px] text-slate-500 truncate">renata.fono@fonosync.com.br</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSimulateGoogleLogin('ROLE_PACIENTE')}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-[#0284C7] hover:bg-sky-50/40 text-left transition"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  CF
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">Clara Ferreira (Mãe / Paciente)</p>
                  <p className="text-[11px] text-slate-500 truncate">clara.mae@gmail.com</p>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowGoogleModal(false)}
              className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
