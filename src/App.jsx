import React, { useEffect } from 'react';
import { A11yProvider } from './context/A11yContext';
import { useHashRoute } from './hooks/useHashRoute';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { homeFor } from './services/authService';
import LandingPage from './pages/LandingPage';
import AccessArea from './pages/AccessArea';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import PatientDashboard from './pages/PatientDashboard';
import TriagemGame from './components/TriagemGame';
import PageReader from './components/PageReader';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 text-red-900 min-h-screen font-sans">
          <h1 className="text-xl font-bold mb-2">Ocorreu um erro na aplicação:</h1>
          <pre className="bg-white p-4 rounded border border-red-300 font-mono text-xs overflow-auto">
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-700 text-white font-bold text-xs rounded"
          >
            Recarregar Página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Redirect({ to }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return null;
}

function Router() {
  const route = useHashRoute();
  const role = useAuth().session?.role;

  if (route === '/triagem') {
    return (
      <div className="min-h-screen bg-canvas p-6">
        <TriagemGame />
      </div>
    );
  }

  if (route === '/acesso') {
    return <AccessArea />;
  }

  if (route.startsWith('/profissional')) {
    if (!role) return <Redirect to="#/acesso" />;
    if (role === 'ROLE_PACIENTE') return <Redirect to={homeFor(role)} />;
    const [, , section = 'dashboard', recordId] = route.split('/');
    return <ProfessionalDashboard section={section} recordId={recordId} />;
  }

  if (route.startsWith('/paciente')) {
    if (!role) return <Redirect to="#/acesso" />;
    if (role !== 'ROLE_PACIENTE') return <Redirect to={homeFor(role)} />;
    return <PatientDashboard />;
  }

  return <LandingPage />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <A11yProvider>
          <Router />
          <PageReader />
        </A11yProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}