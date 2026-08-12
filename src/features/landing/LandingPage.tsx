import { ArrowRight, ArrowUpRight, Check, ChevronDown, Database, Github, KeyRound, Languages, ShieldOff } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { ArchitectureDiagram } from './ArchitectureDiagram'
import { PromptDemo } from './PromptDemo'
import { trackLandingCta, trackLandingPageView } from './analytics'
import { LANDING_COPY, LANGUAGE_OPTIONS, type LandingLanguage } from './landingCopy'
import { LANGUAGE_PATHS, languageFromPathname, languageUrl } from './seo'
import { useReveal } from './useReveal'
import './landing.css'

const REPO_URL = 'https://github.com/Ondrift-labs/Ondrift-Extension'
const RELEASE_URL = `${REPO_URL}/releases/latest`
const LANGUAGE_STORAGE_KEY = 'ondrift-landing-language'

const SITES = ['ChatGPT', 'Claude', 'Gemini', 'Perplexity']
const PRIVACY_ICONS = [Database, ShieldOff, KeyRound]

function getInitialLanguage(initialLanguage?: LandingLanguage): LandingLanguage {
  if (initialLanguage) return initialLanguage
  if (typeof window === 'undefined') return 'en'

  const pathLanguage = languageFromPathname(window.location.pathname)
  if (pathLanguage !== 'en' || window.location.pathname === '/') return pathLanguage

  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (saved === 'en' || saved === 'ko' || saved === 'ja') return saved
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }
  return 'en'
}

function Reveal({ children, className = '', delay }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  )
}

function RisingBars() {
  return (
    <div className="rising-bars" aria-hidden="true">
      <span /><span /><span />
    </div>
  )
}

export function LandingPage({ initialLanguage }: { initialLanguage?: LandingLanguage } = {}) {
  const [language, setLanguage] = useState<LandingLanguage>(() => getInitialLanguage(initialLanguage))
  const copy = LANDING_COPY[language]

  function changeLanguage(nextLanguage: LandingLanguage) {
    window.history.pushState({}, '', LANGUAGE_PATHS[nextLanguage])
    setLanguage(nextLanguage)
  }

  useEffect(() => {
    trackLandingPageView()
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    document.title = copy.meta.title
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', copy.meta.description)
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', languageUrl(language))
    document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', languageUrl(language))
    document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', copy.meta.title)
    document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', copy.meta.description)
    document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', copy.meta.title)
    document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute('content', copy.meta.description)
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    } catch {
      // The language still applies for the current session when storage is unavailable.
    }
  }, [copy, language])

  return (
    <div className="landing">
      <div className="landing-grain" aria-hidden="true" />

      <header className="landing-nav">
        <a className="landing-brand" href="#top">
          <img src="/ondrift-mark.png" alt="" width={26} height={26} />
          Ondrift
        </a>
        <nav className="landing-nav-links">
          <a href="#how">{copy.nav.how}</a>
          <a href="#privacy">{copy.nav.privacy}</a>
          <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={13} /></a>
        </nav>
        <label className="landing-language-select">
          <Languages size={15} aria-hidden="true" />
          <select
            aria-label={copy.nav.languageLabel}
            value={language}
            onChange={(event) => changeLanguage(event.target.value as LandingLanguage)}
          >
            {LANGUAGE_OPTIONS.map((option) => <option key={option.code} value={option.code}>{option.label}</option>)}
          </select>
          <ChevronDown size={13} aria-hidden="true" />
        </label>
        <a className="ui-button ui-button--primary landing-nav-cta" href={RELEASE_URL} target="_blank" rel="noreferrer" onClick={() => trackLandingCta('install_nav')}>
          <span>{copy.nav.install}</span><ArrowRight size={15} />
        </a>
      </header>

      <main id="top">
        <section className="landing-hero">
          <RisingBars />
          <div className="landing-hero-copy">
            <p className="ui-eyebrow">{copy.hero.eyebrow}</p>
            <h1>{copy.hero.line1}<br />{copy.hero.line2}</h1>
            <p className="landing-hero-sub">{copy.hero.body}</p>
            <div className="landing-hero-actions">
              <a className="ui-button ui-button--primary" href={RELEASE_URL} target="_blank" rel="noreferrer" onClick={() => trackLandingCta('install_hero')}>
                <Github size={16} />{copy.hero.install}
              </a>
              <a className="ui-button ui-button--secondary" href="#how" onClick={() => trackLandingCta('how_it_works')}>{copy.hero.how}</a>
            </div>
            <p className="landing-hero-meta">{copy.hero.meta}</p>
          </div>
          <div className="landing-hero-demo">
            <PromptDemo key={language} copy={copy.demo} />
          </div>
        </section>

        <section className="landing-compat" aria-label={copy.supportedSites}>
          <span className="landing-compat-label">{copy.supportedSites}</span>
          <ul className="landing-compat-list">
            {SITES.map((site) => <li key={site}>{site}</li>)}
          </ul>
        </section>

        <section id="how" className="landing-section">
          <Reveal className="landing-section-head">
            <span className="ui-eyebrow">{copy.how.eyebrow}</span>
            <h2>{copy.how.title}</h2>
          </Reveal>
          <div className="landing-steps">
            {copy.how.steps.map((step, index) => (
              <Reveal key={step.n} delay={index * 140} className="landing-step">
                <span className="landing-step-n">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="privacy" className="landing-section landing-section--privacy">
          <Reveal className="landing-privacy-copy">
            <span className="ui-eyebrow">{copy.privacy.eyebrow}</span>
            <h2>{copy.privacy.title}</h2>
            <p>{copy.privacy.body}</p>
            <ul className="landing-privacy-list">
              {copy.privacy.points.map((text, index) => {
                const Icon = PRIVACY_ICONS[index]
                return (
                <li key={text}><Icon size={17} aria-hidden="true" /><span>{text}</span></li>
                )
              })}
            </ul>
          </Reveal>
          <Reveal delay={120} className="landing-privacy-diagram">
            <ArchitectureDiagram copy={copy.architecture} />
          </Reveal>
        </section>

        <section className="landing-langs" aria-label={copy.languages.eyebrow}>
          <Reveal className="landing-langs-inner">
            <span className="ui-eyebrow">{copy.languages.eyebrow}</span>
            <div className="landing-langs-pills">
              {LANGUAGE_OPTIONS.map((option) => (
                <span key={option.code}>{option.label}{option.code === 'en' ? ` · ${copy.languages.defaultLabel}` : ''}</span>
              ))}
            </div>
            <p>{copy.languages.body}</p>
          </Reveal>
        </section>

        <section className="landing-cta">
          <Reveal className="landing-cta-inner">
            <h2>{copy.cta.title}</h2>
            <ol className="landing-cta-steps">
              {copy.cta.steps.map((step) => <li key={step}><Check size={14} aria-hidden="true" />{step}</li>)}
            </ol>
            <div className="landing-hero-actions">
              <a className="ui-button ui-button--primary" href={RELEASE_URL} target="_blank" rel="noreferrer" onClick={() => trackLandingCta('install_final')}>
                <Github size={16} />{copy.cta.release}
              </a>
              <a className="ui-button ui-button--secondary" href={REPO_URL} target="_blank" rel="noreferrer" onClick={() => trackLandingCta('guide_final')}>
                {copy.cta.guide}<ArrowUpRight size={14} />
              </a>
            </div>
            <p className="landing-hero-meta">{copy.cta.note}</p>
          </Reveal>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-brand">
          <img src="/ondrift-mark.png" alt="" width={20} height={20} />
          <span>Ondrift</span>
        </div>
        <nav className="landing-footer-links">
          <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub</a>
          <a href={`${REPO_URL}/blob/main/PRIVACY.md`} target="_blank" rel="noreferrer">{copy.footer.privacy}</a>
          <a href={`${REPO_URL}#install-from-a-github-zip`} target="_blank" rel="noreferrer">{copy.footer.guide}</a>
        </nav>
        <p className="landing-footer-note">
          {copy.footer.note}
        </p>
      </footer>
    </div>
  )
}
