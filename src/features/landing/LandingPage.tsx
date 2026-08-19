import { ArrowRight, ArrowUpRight, Bug, Check, Chrome, ChevronDown, Database, KeyRound, Languages, Lightbulb, MessageCircleQuestion, ShieldOff } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { ArchitectureDiagram } from './ArchitectureDiagram'
import { PromptDemo } from './PromptDemo'
import { trackLandingCta, trackLandingPageView } from './analytics'
import { LANDING_COPY, LANGUAGE_OPTIONS, type LandingLanguage } from './landingCopy'
import { LANGUAGE_PATHS, SITE_REPOSITORY_URL, languageFromPathname, languageUrl } from './seo'
import { useReveal } from './useReveal'
import './landing.css'

const REPO_URL = SITE_REPOSITORY_URL
const CHROME_STORE_URL = 'https://chromewebstore.google.com/detail/aonkgefdmgjcnhopbkeehmoacncpkeje'
const CONTACT_CHANNELS = [
  { href: `${REPO_URL}/issues/new?template=bug_report.yml`, icon: Bug, target: 'contact_bug' as const },
  { href: `${REPO_URL}/issues/new?template=feature_request.yml`, icon: Lightbulb, target: 'contact_feature' as const },
  { href: `${REPO_URL}/discussions/new?category=q-a`, icon: MessageCircleQuestion, target: 'contact_question' as const },
]
const LANGUAGE_STORAGE_KEY = 'ondrift-landing-language'
// Derived once from LANGUAGE_OPTIONS so a future language only needs to be added there --
// this used to be a second, separately-hardcoded list of the same four codes.
const LANDING_LANGUAGES = new Set<LandingLanguage>(LANGUAGE_OPTIONS.map((option) => option.code))

// 'system' is a preference, not a piece of content -- there's no LANDING_COPY['system'].
// It means "keep matching the browser's language", as opposed to a visitor having
// explicitly pinned one of the four concrete languages from the dropdown.
const LANGUAGE_SYSTEM = 'system'
type LanguagePreference = LandingLanguage | typeof LANGUAGE_SYSTEM

const SITES = ['ChatGPT', 'Claude', 'Gemini', 'Perplexity']
const PRIVACY_ICONS = [Database, ShieldOff, KeyRound]

function detectBrowserLanguage(): LandingLanguage {
  if (typeof navigator === 'undefined') return 'en'
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const raw of candidates) {
    const code = raw?.split('-')[0]?.toLowerCase()
    if (code && LANDING_LANGUAGES.has(code as LandingLanguage)) return code as LandingLanguage
  }
  return 'en'
}

function resolveLanguage(preference: LanguagePreference): LandingLanguage {
  return preference === LANGUAGE_SYSTEM ? detectBrowserLanguage() : preference
}

function readSavedPreference(): string | null {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
    return null
  }
}

function getInitialPreference(initialLanguage?: LandingLanguage): LanguagePreference {
  if (initialLanguage) return initialLanguage
  if (typeof window === 'undefined') return LANGUAGE_SYSTEM

  // A URL that already encodes a language -- a shared /ko/ link, a search result --
  // always wins over any saved preference or the browser's language.
  const pathLanguage = languageFromPathname(window.location.pathname)
  if (pathLanguage !== 'en') return pathLanguage

  const saved = readSavedPreference()
  if (saved && LANDING_LANGUAGES.has(saved as LandingLanguage)) return saved as LandingLanguage
  // Nothing explicitly chosen yet (or the visitor picked "System"): match the browser.
  return LANGUAGE_SYSTEM
}

function Reveal({ children, className = '', delay }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  )
}

function setAttr(selector: string, attr: string, value: string): void {
  document.querySelector(selector)?.setAttribute(attr, value)
}

function RisingBars() {
  return (
    <div className="rising-bars" aria-hidden="true">
      <span /><span /><span />
    </div>
  )
}

export function LandingPage({ initialLanguage }: { initialLanguage?: LandingLanguage } = {}) {
  const [preference, setPreference] = useState<LanguagePreference>(() => getInitialPreference(initialLanguage))
  const language = resolveLanguage(preference)
  const copy = LANDING_COPY[language]

  function changeLanguage(nextPreference: LanguagePreference) {
    window.history.pushState({}, '', LANGUAGE_PATHS[resolveLanguage(nextPreference)])
    setPreference(nextPreference)
  }

  useEffect(() => {
    trackLandingPageView()
  }, [])

  useEffect(() => {
    // window.history.pushState() in changeLanguage() doesn't fire popstate, and by design
    // nothing else here listens for the browser's Back/Forward buttons -- without this, the
    // address bar moves but `preference` (and everything derived from it: <html lang>,
    // title, meta tags) stays wherever it was, permanently out of sync with the URL for the
    // rest of the session. Re-derive it the same way the very first render did.
    function handlePopState() {
      setPreference(getInitialPreference())
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    // The canonical/og:url must match the URL actually in the address bar, not the
    // resolved *display* language -- those two diverge whenever `preference` is 'system'
    // and the browser's language isn't English: the page renders in, say, Korean while the
    // path is still '/' (root is intentionally left language-ambiguous; see main.tsx).
    // Pointing canonical at a URL other than the one being served is the wrong URL to tell
    // search engines about, not a matter of picking the "nicer" one.
    const currentUrl = languageUrl(languageFromPathname(window.location.pathname))
    document.documentElement.lang = language
    document.title = copy.meta.title
    setAttr('meta[name="description"]', 'content', copy.meta.description)
    setAttr('link[rel="canonical"]', 'href', currentUrl)
    setAttr('meta[property="og:url"]', 'content', currentUrl)
    setAttr('meta[property="og:title"]', 'content', copy.meta.title)
    setAttr('meta[property="og:description"]', 'content', copy.meta.description)
    setAttr('meta[name="twitter:title"]', 'content', copy.meta.title)
    setAttr('meta[name="twitter:description"]', 'content', copy.meta.description)
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, preference)
    } catch {
      // The language still applies for the current session when storage is unavailable.
    }
  }, [copy, language, preference])

  return (
    <div className="landing">
      <div className="landing-grain" aria-hidden="true" />

      <header className="landing-nav">
        <a className="landing-brand" href={LANGUAGE_PATHS[language]} aria-label="Ondrift home">
          <img src="/ondrift-mark.png" alt="" width={26} height={26} />
          Ondrift
        </a>
        <nav className="landing-nav-links">
          <a href="#how">{copy.nav.how}</a>
          <a href="#privacy">{copy.nav.privacy}</a>
          <a href="#faq">{copy.nav.faq}</a>
          <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={13} /></a>
        </nav>
        <label className="landing-language-select">
          <Languages size={15} aria-hidden="true" />
          <select
            aria-label={copy.nav.languageLabel}
            value={preference}
            onChange={(event) => changeLanguage(event.target.value as LanguagePreference)}
          >
            <option value={LANGUAGE_SYSTEM}>{copy.nav.systemLanguage} ({copy.languages.defaultLabel})</option>
            {LANGUAGE_OPTIONS.map((option) => <option key={option.code} value={option.code}>{option.label}</option>)}
          </select>
          <ChevronDown size={13} aria-hidden="true" />
        </label>
        <a className="ui-button ui-button--primary landing-nav-cta" href={CHROME_STORE_URL} target="_blank" rel="noreferrer" onClick={() => trackLandingCta('install_nav')}>
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
              <a className="ui-button ui-button--primary" href={CHROME_STORE_URL} target="_blank" rel="noreferrer" onClick={() => trackLandingCta('install_hero')}>
                <Chrome size={16} />{copy.hero.install}
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

        <section id="faq" className="landing-section landing-faq">
          <Reveal className="landing-section-head">
            <span className="ui-eyebrow">{copy.faq.eyebrow}</span>
            <h2>{copy.faq.title}</h2>
          </Reveal>
          <div className="landing-faq-list">
            {copy.faq.items.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="contact" className="landing-section landing-contact">
          <Reveal className="landing-section-head">
            <span className="ui-eyebrow">{copy.contact.eyebrow}</span>
            <h2>{copy.contact.title}</h2>
            <p>{copy.contact.body}</p>
          </Reveal>
          <div className="landing-contact-grid">
            {copy.contact.cards.map((card, index) => {
              const channel = CONTACT_CHANNELS[index]
              const Icon = channel.icon
              return (
                <Reveal key={card.title} delay={index * 120} className="landing-contact-card">
                  <Icon size={20} aria-hidden="true" />
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                  <a
                    className="ui-button ui-button--secondary"
                    href={channel.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackLandingCta(channel.target)}
                  >
                    {card.action}<ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                  <span>{card.note}</span>
                </Reveal>
              )
            })}
          </div>
        </section>

        <section className="landing-cta">
          <Reveal className="landing-cta-inner">
            <h2>{copy.cta.title}</h2>
            <ol className="landing-cta-steps">
              {copy.cta.steps.map((step) => <li key={step}><Check size={14} aria-hidden="true" />{step}</li>)}
            </ol>
            <div className="landing-hero-actions">
              <a className="ui-button ui-button--primary" href={CHROME_STORE_URL} target="_blank" rel="noreferrer" onClick={() => trackLandingCta('install_final')}>
                <Chrome size={16} />{copy.cta.release}
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
          <a href="#contact">{copy.footer.contact}</a>
        </nav>
        <p className="landing-footer-note">
          {copy.footer.note}
        </p>
      </footer>
    </div>
  )
}
