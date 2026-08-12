import { useReveal } from './useReveal'

/** Schematic of the real data path: editor -> Gemini / local storage, with no Ondrift server on it. */
export function ArchitectureDiagram() {
  const { ref, visible } = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={`arch-diagram ${visible ? 'is-visible' : ''}`}>
      <svg viewBox="0 0 480 260" role="img" aria-label="확장 프로그램이 브라우저에서 곧장 Gemini API를 호출하고, 설정과 기록은 로컬 저장소에만 남기는 구조도. Ondrift가 운영하는 서버는 이 경로에 없습니다.">
        <path className="arch-line" d="M118 130 H 260" />
        <path className="arch-line" d="M260 130 V 62 H 350" />
        <path className="arch-line" d="M260 130 V 198 H 350" />
        <path className="arch-dashed" d="M189 130 V 160" />

        <g className="arch-ghost">
          <rect x="141" y="160" width="96" height="42" rx="8" />
          <path className="arch-x" d="M151 170 L 227 192 M227 170 L 151 192" />
        </g>
        <text x="189" y="219" className="arch-ghost-label">Ondrift 서버 (없음)</text>

        <g className="arch-node arch-node--source">
          <rect x="10" y="102" width="108" height="56" rx="10" />
          <text x="64" y="126">프롬프트</text>
          <text x="64" y="144" className="arch-node-sub">편집기</text>
        </g>
        <g className="arch-node arch-node--accent">
          <rect x="350" y="34" width="120" height="56" rx="10" />
          <text x="410" y="58">Gemini API</text>
          <text x="410" y="76" className="arch-node-sub">내 API 키로 직접 호출</text>
        </g>
        <g className="arch-node arch-node--accent">
          <rect x="350" y="170" width="120" height="56" rx="10" />
          <text x="410" y="194">로컬 저장소</text>
          <text x="410" y="212" className="arch-node-sub">storage · IndexedDB</text>
        </g>
      </svg>
    </div>
  )
}
