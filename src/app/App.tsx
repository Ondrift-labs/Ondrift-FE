import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { HomePage } from '../features/dashboard/HomePage'
import { ModulePage } from '../features/modules/ModulePage'
import { modules } from './modules'
import { useEffect, useState } from 'react'
import { getAccessToken } from '../lib/api'
import { LoginPage } from '../features/auth/LoginPage'
import { LandingPage } from '../features/landing/LandingPage'

// Ondrift-FE's dashboard is an earlier, deprecated prototype (see README). The public root now
// belongs to the Ondrift extension's marketing landing page; the dashboard prototype and its
// login form moved to /login so it stays reachable without competing with the landing page.
export function App() {
  const [authenticated, setAuthenticated] = useState(() => Boolean(getAccessToken() || sessionStorage.getItem('ondrift_demo_mode')))
  useEffect(() => {
    const logout = () => setAuthenticated(false)
    window.addEventListener('ondrift:unauthorized', logout)
    window.addEventListener('ondrift:logout', logout)
    return () => { window.removeEventListener('ondrift:unauthorized', logout); window.removeEventListener('ondrift:logout', logout) }
  }, [])
  if (!authenticated) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage onAuthenticated={() => setAuthenticated(true)} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        {modules.filter((module) => module.path !== '/').map((module) => <Route key={module.path} path={module.path} element={<ModulePage module={module} />} />)}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
