import { ArrowRight, ArrowUpRight, Check, Database, Github, KeyRound, ShieldOff } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { ArchitectureDiagram } from './ArchitectureDiagram'
import { PromptDemo } from './PromptDemo'
import { trackLandingCta, trackLandingPageView } from './analytics'
import { useReveal } from './useReveal'
import './landing.css'

const REPO_URL = 'https://github.com/Ondrift-labs/Ondrift-Extension'
const RELEASE_URL = `${REPO_URL}/releases/latest`

const SITES = ['ChatGPT', 'Claude', 'Gemini', 'Perplexity']
const LANGUAGES = [
  { code: 'KO', label: '한국어' },
  { code: 'EN', label: 'English' },
  { code: 'JA', label: '日本語' },
]
const STEPS = [
  { n: '01', title: '그대로 씁니다', body: '평소처럼 ChatGPT, Claude, Gemini, Perplexity에 프롬프트를 작성합니다. 확장을 켜둔 것도 잊게 됩니다.' },
  { n: '02', title: '점수와 재작성', body: 'Ondrift 위젯에서 재작성을 요청하면 명확성·맥락·제약을 검토해 점수, 근거, 다시 쓴 버전을 함께 보여줍니다.' },
  { n: '03', title: '검토 후 적용', body: '마음에 들면 한 클릭으로 적용하고, 아니면 그대로 무시합니다. 프롬프트 편집기 안에서 계속 고칠 수 있습니다.' },
]
const PRIVACY_POINTS = [
  { icon: Database, text: '설정은 chrome.storage.local에, 선택한 경우의 기록은 로컬 IndexedDB에만 남습니다.' },
  { icon: ShieldOff, text: '재작성을 요청한 프롬프트만 전송되며, AI 응답 본문은 수집하거나 저장하지 않습니다.' },
  { icon: KeyRound, text: '필요한 건 내 Gemini API 키뿐입니다 — 그만큼 키 관리도 내 몫이라는 뜻이기도 합니다.' },
]

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

export function LandingPage() {
  useEffect(() => {
    trackLandingPageView()
  }, [])

  return (
    <div className="landing">
      <div className="landing-grain" aria-hidden="true" />

      <header className="landing-nav">
        <a className="landing-brand" href="#top">
          <img src="/ondrift-mark.png" alt="" width={26} height={26} />
          Ondrift
        </a>
        <nav className="landing-nav-links">
          <a href="#how">동작 방식</a>
          <a href="#privacy">프라이버시</a>
          <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={13} /></a>
        </nav>
        <a className="ui-button ui-button--primary landing-nav-cta" href={RELEASE_URL} target="_blank" rel="noreferrer" onClick={() => trackLandingCta('install_nav')}>
          확장 설치하기<ArrowRight size={15} />
        </a>
      </header>

      <main id="top">
        <section className="landing-hero">
          <RisingBars />
          <div className="landing-hero-copy">
            <p className="ui-eyebrow">로컬 우선 프롬프트 도구</p>
            <h1>보내기 전에,<br />한 번 더 다듬습니다.</h1>
            <p className="landing-hero-sub">
              ChatGPT, Claude, Gemini, Perplexity의 입력창 안에서 프롬프트를 검토하고 점수와 근거를 보여준 뒤,
              원하면 한 클릭으로 다시 씁니다. 계정도 서버도 없이 내 Gemini 키로 동작합니다.
            </p>
            <div className="landing-hero-actions">
              <a className="ui-button ui-button--primary" href={RELEASE_URL} target="_blank" rel="noreferrer" onClick={() => trackLandingCta('install_hero')}>
                <Github size={16} />GitHub에서 설치 (무료)
              </a>
              <a className="ui-button ui-button--secondary" href="#how" onClick={() => trackLandingCta('how_it_works')}>동작 방식 보기</a>
            </div>
            <p className="landing-hero-meta">Chrome 확장 · 한국어 · English · 日本語 · Gemini API 키 필요</p>
          </div>
          <div className="landing-hero-demo">
            <PromptDemo />
          </div>
        </section>

        <section className="landing-compat" aria-label="지원 사이트">
          <span className="landing-compat-label">지원 사이트</span>
          <ul className="landing-compat-list">
            {SITES.map((site) => <li key={site}>{site}</li>)}
          </ul>
        </section>

        <section id="how" className="landing-section">
          <Reveal className="landing-section-head">
            <span className="ui-eyebrow">HOW IT WORKS</span>
            <h2>세 단계면 충분합니다</h2>
          </Reveal>
          <div className="landing-steps">
            {STEPS.map((step, index) => (
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
            <span className="ui-eyebrow">왜 서버가 없나요</span>
            <h2>계정도, Ondrift 서버도 없습니다</h2>
            <p>
              다시 쓸 프롬프트를 직접 고르면, 그 프롬프트만 내 브라우저에서 Gemini로 곧장 전송됩니다.
              그 사이에 Ondrift가 운영하는 서버는 없습니다.
            </p>
            <ul className="landing-privacy-list">
              {PRIVACY_POINTS.map(({ icon: Icon, text }) => (
                <li key={text}><Icon size={17} aria-hidden="true" /><span>{text}</span></li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120} className="landing-privacy-diagram">
            <ArchitectureDiagram />
          </Reveal>
        </section>

        <section className="landing-langs" aria-label="지원 언어">
          <Reveal className="landing-langs-inner">
            <span className="ui-eyebrow">지원 언어</span>
            <div className="landing-langs-pills">
              {LANGUAGES.map((lang) => <span key={lang.code}>{lang.label}</span>)}
            </div>
            <p>설정 화면, 다시 쓴 프롬프트, 근거 설명까지 선택한 언어로 표시됩니다.</p>
          </Reveal>
        </section>

        <section className="landing-cta">
          <Reveal className="landing-cta-inner">
            <h2>지금 브라우저에 설치하세요</h2>
            <ol className="landing-cta-steps">
              <li><Check size={14} aria-hidden="true" />최신 릴리스 ZIP을 내려받고 전체 압축 해제</li>
              <li><Check size={14} aria-hidden="true" /><code>chrome://extensions</code>에서 개발자 모드 켜기</li>
              <li><Check size={14} aria-hidden="true" />“압축해제된 확장 프로그램을 로드”로 폴더 선택</li>
              <li><Check size={14} aria-hidden="true" />내 Gemini API 키를 등록하고 사용 시작</li>
            </ol>
            <div className="landing-hero-actions">
              <a className="ui-button ui-button--primary" href={RELEASE_URL} target="_blank" rel="noreferrer" onClick={() => trackLandingCta('install_final')}>
                <Github size={16} />최신 릴리스 받기
              </a>
              <a className="ui-button ui-button--secondary" href={REPO_URL} target="_blank" rel="noreferrer" onClick={() => trackLandingCta('guide_final')}>
                설치 가이드 전체 보기<ArrowUpRight size={14} />
              </a>
            </div>
            <p className="landing-hero-meta">Chrome 웹 스토어 등록 준비 중 — 지금은 GitHub 릴리스로 설치합니다.</p>
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
          <a href={`${REPO_URL}/blob/main/PRIVACY.md`} target="_blank" rel="noreferrer">개인정보 처리방침</a>
          <a href={`${REPO_URL}#install-from-a-github-zip`} target="_blank" rel="noreferrer">설치 가이드</a>
        </nav>
        <p className="landing-footer-note">
          Google, Gemini, ChatGPT, Claude, Perplexity는 각 소유자의 상표이며 Ondrift와 제휴 관계가 없습니다.
        </p>
      </footer>
    </div>
  )
}
