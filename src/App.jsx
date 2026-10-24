import { A11yProvider } from './context/A11yContext'
import LandingPage from './pages/LandingPage'

export default function App() {
  return (
    <A11yProvider>
      <LandingPage />
    </A11yProvider>
  )
}
