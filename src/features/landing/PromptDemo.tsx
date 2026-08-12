import { Check } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { LandingCopy } from './landingCopy'
import { usePrefersReducedMotion } from './useReveal'

const SCORE_BEFORE = 42
const SCORE_AFTER = 91
const RING_LENGTH = 170

// Each phase gets enough hold time to actually read it before the loop moves on.
const DRAFT_HOLD_MS = 3800
const SCORING_HOLD_MS = 1000
const TYPING_MS = 3600
const RESULT_HOLD_MS = 5400
const CYCLE_MS = DRAFT_HOLD_MS + SCORING_HOLD_MS + TYPING_MS + RESULT_HOLD_MS

type Phase = 'draft' | 'scoring' | 'typing' | 'result'

/** Drives the hero's before/after loop: draft -> scoring -> typing -> result -> repeat. */
function usePromptDemo(reducedMotion: boolean, beforePrompt: string, afterPrompt: string) {
  const [phase, setPhase] = useState<Phase>(reducedMotion ? 'result' : 'draft')
  const [score, setScore] = useState(reducedMotion ? SCORE_AFTER : SCORE_BEFORE)
  const [displayedPrompt, setDisplayedPrompt] = useState(reducedMotion ? afterPrompt : beforePrompt)
  const rafRef = useRef(0)

  useEffect(() => {
    if (reducedMotion) return
    const timers: number[] = []
    function cycle() {
      setPhase('draft')
      timers.push(window.setTimeout(() => setPhase('scoring'), DRAFT_HOLD_MS))
      timers.push(window.setTimeout(() => setPhase('typing'), DRAFT_HOLD_MS + SCORING_HOLD_MS))
      timers.push(window.setTimeout(() => setPhase('result'), DRAFT_HOLD_MS + SCORING_HOLD_MS + TYPING_MS))
    }
    cycle()
    const loop = window.setInterval(cycle, CYCLE_MS)
    return () => { timers.forEach(window.clearTimeout); window.clearInterval(loop) }
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion) return
    if (phase === 'draft' || phase === 'scoring') {
      setDisplayedPrompt(beforePrompt)
      return
    }
    if (phase === 'result') {
      setDisplayedPrompt(afterPrompt)
      return
    }

    const characters = Array.from(afterPrompt)
    const start = performance.now()
    const timer = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - start) / TYPING_MS)
      const length = Math.max(1, Math.floor(characters.length * progress))
      setDisplayedPrompt(characters.slice(0, length).join(''))
      if (progress >= 1) window.clearInterval(timer)
    }, 24)
    setDisplayedPrompt('')
    return () => window.clearInterval(timer)
  }, [afterPrompt, beforePrompt, phase, reducedMotion])

  useEffect(() => {
    if (reducedMotion) return
    if (phase !== 'result') { setScore(SCORE_BEFORE); return }
    const start = performance.now()
    const duration = 1100
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setScore(Math.round(SCORE_BEFORE + (SCORE_AFTER - SCORE_BEFORE) * eased))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [phase, reducedMotion])

  return { phase, score, displayedPrompt }
}

function DemoCardContent({ phase, prompt, score, showResult, showCaret, copy }: {
  phase: Phase
  prompt: string
  score: number
  showResult: boolean
  showCaret: boolean
  copy: LandingCopy['demo']
}) {
  const offset = RING_LENGTH - (RING_LENGTH * score) / 100

  return (
    <>
      <div className="demo-chrome">
        <span className="demo-dot" /><span className="demo-dot" /><span className="demo-dot" />
        <span className="demo-url">chatgpt.com</span>
        <span className="demo-model">{copy.model}</span>
      </div>
      <div className="demo-body">
        <p className="demo-editor">
          {prompt}
          {showCaret && <span className="demo-caret" aria-hidden="true" />}
        </p>
        <div className={`demo-result ${showResult ? 'is-shown' : ''}`} aria-hidden={!showResult}>
          <div className="demo-score">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <circle cx="32" cy="32" r="27" className="demo-score-track" />
              <circle cx="32" cy="32" r="27" className="demo-score-fill" strokeDasharray={RING_LENGTH} strokeDashoffset={offset} />
            </svg>
            <strong>{score}</strong>
          </div>
          <ul className="demo-rationale">
            {copy.rationale.map((reason) => <li key={reason}><Check size={13} aria-hidden="true" />{reason}</li>)}
          </ul>
        </div>
      </div>
      <div className="demo-foot">
        <span className={`demo-status demo-status--${phase}`}>
          {copy.status[phase]}
        </span>
      </div>
    </>
  )
}

export function PromptDemo({ copy }: { copy: LandingCopy['demo'] }) {
  const reducedMotion = usePrefersReducedMotion()
  const { phase, score, displayedPrompt } = usePromptDemo(reducedMotion, copy.before, copy.after)
  const cardRef = useRef<HTMLDivElement>(null)
  const heightRef = useRef<number | null>(null)
  const showResult = phase === 'result'

  useLayoutEffect(() => {
    const card = cardRef.current
    if (!card) return

    const previousHeight = heightRef.current ?? card.offsetHeight
    card.style.height = 'auto'
    const nextHeight = card.offsetHeight
    heightRef.current = nextHeight

    if (reducedMotion || Math.abs(previousHeight - nextHeight) < 1) {
      card.style.height = `${nextHeight}px`
      return
    }

    card.style.height = `${previousHeight}px`
    void card.offsetHeight
    const frame = requestAnimationFrame(() => {
      card.style.height = `${nextHeight}px`
    })
    return () => cancelAnimationFrame(frame)
  }, [displayedPrompt, phase, reducedMotion])

  useEffect(() => {
    const syncHeight = () => {
      const card = cardRef.current
      if (!card) return
      card.style.height = 'auto'
      const nextHeight = card.offsetHeight
      heightRef.current = nextHeight
      card.style.height = `${nextHeight}px`
    }
    window.addEventListener('resize', syncHeight)
    return () => window.removeEventListener('resize', syncHeight)
  }, [])

  return (
    <div className="demo-stage">
      <div className="demo-card demo-card--spacer" aria-hidden="true">
        <DemoCardContent phase="result" prompt={copy.after} score={SCORE_AFTER} showResult showCaret={false} copy={copy} />
      </div>
      <div ref={cardRef} className={`demo-card demo-card--live demo-card--${phase}`}>
        <DemoCardContent
          phase={phase}
          prompt={displayedPrompt}
          score={score}
          showResult={showResult}
          showCaret={phase === 'draft' || phase === 'typing'}
          copy={copy}
        />
      </div>
    </div>
  )
}
