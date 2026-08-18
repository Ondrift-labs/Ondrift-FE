import { LandingPage } from '../features/landing/LandingPage'
import type { LandingLanguage } from '../features/landing/landingCopy'

// AppShell/HomePage/ModulePage/LoginPage (and the modules/lib/hooks/types they alone
// depend on) are an earlier prototype dashboard and are intentionally not wired up here --
// see README "Status of this repository". This component tree is the active client.
export function App({ initialLanguage }: { initialLanguage?: LandingLanguage } = {}) {
  return <LandingPage initialLanguage={initialLanguage} />
}
