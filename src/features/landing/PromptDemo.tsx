import { Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from './useReveal'

const BEFORE_PROMPT = '회의 녹취 정리해줘'
const AFTER_PROMPT = `다음 회의 녹취를 실행 가능한 회의록으로 바꿔줘.

출력:
1. 참석자별 핵심 발언
2. 결정 사항과 근거
3. 후속 조치 — 담당자 | 할 일 | 기한 표

불명확한 담당자·기한은 추측하지 말고 ‘확인 필요’로 표시하고, 수치와 날짜는 원문 그대로 유지해줘.`
const RATIONALE = ['업무 목적을 실행 중심으로 구체화', '결과를 세 가지 섹션으로 구조화', '누락 정보 처리·정확성 규칙 추가']
const SCORE_BEFORE = 42
const SCORE_AFTER = 91
const RING_LENGTH = 170

// Each phase gets enough hold time to actually read it before the loop moves on.
const DRAFT_HOLD_MS = 3800
const SCORING_HOLD_MS = 1000
const RESULT_HOLD_MS = 5400
const CYCLE_MS = DRAFT_HOLD_MS + SCORING_HOLD_MS + RESULT_HOLD_MS

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
      timers.push(window.setTimeout(() => setPhase('scoring'), DRAFT_HOLD_MS))
      timers.push(window.setTimeout(() => setPhase('result'), DRAFT_HOLD_MS + SCORING_HOLD_MS))
    }
    cycle()
    const loop = window.setInterval(cycle, CYCLE_MS)
    return () => { timers.forEach(window.clearTimeout); window.clearInterval(loop) }
  }, [reducedMotion])

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

  return { phase, score }
}

export function PromptDemo() {
  const reducedMotion = usePrefersReducedMotion()
  const { phase, score } = usePromptDemo(reducedMotion)
  const showResult = phase !== 'draft'
  const offset = RING_LENGTH - (RING_LENGTH * score) / 100
  return (
    <div className={`demo-card demo-card--${phase}`}>
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
          {phase === 'draft' ? '작성 중' : phase === 'scoring' ? 'Ondrift가 검토하는 중…' : '재작성 완료 · 적용 대기 · 결과는 모델에 따라 달라질 수 있어요'}
        </span>
      </div>
    </div>
  )
}
