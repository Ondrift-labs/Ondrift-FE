import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { HomePage } from '../features/dashboard/HomePage'
import { ModulePage } from '../features/modules/ModulePage'
import { modules } from './modules'
import { useEffect, useState } from 'react'
import { getAccessToken } from '../lib/api'
import { LoginPage } from '../features/auth/LoginPage'

export function App() {
  const [authenticated, setAuthenticated] = useState(() => Boolean(getAccessToken() || sessionStorage.getItem('ondrift_demo_mode')))
  useEffect(() => {
    const logout = () => setAuthenticated(false)
    window.addEventListener('ondrift:unauthorized', logout)
    window.addEventListener('ondrift:logout', logout)
    return () => { window.removeEventListener('ondrift:unauthorized', logout); window.removeEventListener('ondrift:logout', logout) }
  }, [])
  if (!authenticated) return <LoginPage onAuthenticated={() => setAuthenticated(true)} />
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
