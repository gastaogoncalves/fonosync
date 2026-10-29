import { A11yProvider } from './context/A11yContext';
import { useHashRoute } from './hooks/useHashRoute';
import LandingPage from './pages/LandingPage';
import AccessArea from './pages/AccessArea';
import LoginPlaceholder from './pages/LoginPlaceholder';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import PatientDashboard from './pages/PatientDashboard';

function Router() {
  const route = useHashRoute();

  if (route === '/acesso') {
    return <AccessArea />;
  }

  if (route === '/profissional/entrar') {
    return <LoginPlaceholder title="Entrar na Área do Profissional" nextHref="#/profissional/dashboard" />;
  }

  if (route === '/paciente/entrar') {
    return <LoginPlaceholder title="Entrar na Área do Paciente" nextHref="#/paciente/dashboard" />;
  }

  if (route.startsWith('/profissional')) {
    const section = route.split('/')[2] || 'dashboard';
    return <ProfessionalDashboard section={section} />;
  }

  if (route.startsWith('/paciente')) {
    return <PatientDashboard />;
  }

  return <LandingPage />;
}

export default function App() {
  return (
    <A11yProvider>
      <Router />
    </A11yProvider>
  );
}
