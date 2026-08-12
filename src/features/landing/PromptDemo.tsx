import { Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from './useReveal'

const BEFORE_PROMPT = '회의 녹취 정리해줘'
const AFTER_PROMPT = '아래 회의 녹취를 참석자별 발언 요약, 결정 사항, 담당자·기한이 포함된 후속 조치 세 섹션으로 정리해줘. 표는 마크다운으로 작성해줘.'
const RATIONALE = ['목표를 구체적으로 명시', '출력 형식(표) 지정', '담당자·기한 같은 제약 추가']
const SCORE_BEFORE = 42
const SCORE_AFTER = 91
const RING_LENGTH = 170

type Phase = 'draft' | 'scoring' | 'result'

/** Drives the hero's before/after loop: draft -> scoring -> result -> (hold) -> repeat. */
function usePromptDemo(reducedMotion: boolean) {
  const [phase, setPhase] = useState<Phase>(reducedMotion ? 'result' : 'draft')
  const [score, setScore] = useState(reducedMotion ? SCORE_AFTER : SCORE_BEFORE)
  const rafRef = useRef(0)

  useEffect(() => {
    if (reducedMotion) return
    const timers: number[] = []
    function cycle() {
      setPhase('draft')
      timers.push(window.setTimeout(() => setPhase('scoring'), 2600))
      timers.push(window.setTimeout(() => setPhase('result'), 3300))
    }
    cycle()
    const loop = window.setInterval(cycle, 7300)
    return () => { timers.forEach(window.clearTimeout); window.clearInterval(loop) }
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion) return
    if (phase !== 'result') { setScore(SCORE_BEFORE); return }
    const start = performance.now()
    const duration = 800
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setScore(Math.round(SCORE_BEFORE + (SCORE_AFTER - SCORE_BEFORE) * eased))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [phase, reducedMotion])

  return { phase, score }
}

export function PromptDemo() {
  const reducedMotion = usePrefersReducedMotion()
  const { phase, score } = usePromptDemo(reducedMotion)
  const showResult = phase !== 'draft'
  const offset = RING_LENGTH - (RING_LENGTH * score) / 100
  return (
    <div className={`demo-card demo-${phase}`}>
      <div className="demo-chrome">
        <span className="demo-dot" /><span className="demo-dot" /><span className="demo-dot" />
        <span className="demo-url">chatgpt.com</span>
      </div>
      <div className="demo-body">
        <p className="demo-editor">
          {phase === 'result' ? AFTER_PROMPT : BEFORE_PROMPT}
          {phase === 'draft' && <span className="demo-caret" aria-hidden="true" />}
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
            {RATIONALE.map((reason) => <li key={reason}><Check size={13} aria-hidden="true" />{reason}</li>)}
          </ul>
        </div>
      </div>
      <div className="demo-foot">
        <span className={`demo-status demo-status--${phase}`}>
          {phase === 'draft' ? '작성 중' : phase === 'scoring' ? 'Ondrift가 검토하는 중…' : '재작성 완료 · 적용 대기'}
        </span>
      </div>
    </div>
  )
}
