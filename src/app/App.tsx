import { LandingPage } from '../features/landing/LandingPage'
import type { LandingLanguage } from '../features/landing/landingCopy'

export function App({ initialLanguage }: { initialLanguage?: LandingLanguage } = {}) {
  return <LandingPage initialLanguage={initialLanguage} />
}
