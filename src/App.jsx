import React from 'react';
import { A11yProvider } from './context/A11yContext';
import { useHashRoute } from './hooks/useHashRoute';
import LandingPage from './pages/LandingPage';
import AccessArea from './pages/AccessArea';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import PatientDashboard from './pages/PatientDashboard';
import TriagemGame from './components/TriagemGame';
import AudioPlayerBar from './components/AudioPlayerBar';

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
          <h1 className="text-xl font-bold mb-2">⚠️ Ocorreu um erro na aplicação:</h1>
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

function Router() {
  const route = useHashRoute();

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
    <ErrorBoundary>
      <A11yProvider>
        <Router />
        <AudioPlayerBar />
      </A11yProvider>
    </ErrorBoundary>
  );
}