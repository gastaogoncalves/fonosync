import { A11yProvider } from './context/A11yContext'
import { useHashRoute } from './hooks/useHashRoute'
import LandingPage from './pages/LandingPage'
import LoginPlaceholder from './pages/LoginPlaceholder'
import ProfessionalDashboard from './pages/ProfessionalDashboard'

function Router() {
  const route = useHashRoute()

  if (route === '/profissional/entrar') {
    return <LoginPlaceholder title="Entrar na área profissional" nextHref="#/profissional" />
  }
  if (route === '/paciente/entrar') {
    return <LoginPlaceholder title="Entrar na área do paciente" />
  }
  if (route.startsWith('/profissional')) {
    const section = route.split('/')[2] || 'dashboard'
    return <ProfessionalDashboard section={section} />
  }
  return <LandingPage />
}

export default function App() {
  return (
    <A11yProvider>
      <Router />
    </A11yProvider>
  )
}
