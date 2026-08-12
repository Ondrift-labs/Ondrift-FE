import { useReveal } from './useReveal'
import type { LandingCopy } from './landingCopy'

/** Schematic of the real data path: editor -> AI provider / local storage, with no Ondrift server on it. */
export function ArchitectureDiagram({ copy }: { copy: LandingCopy['architecture'] }) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={`arch-diagram ${visible ? 'is-visible' : ''}`}>
      <svg viewBox="0 0 480 260" role="img" aria-label={copy.label}>
        <path className="arch-line" d="M118 130 H 260" />
        <path className="arch-line" d="M260 130 V 62 H 350" />
        <path className="arch-line" d="M260 130 V 198 H 350" />
        <path className="arch-dashed" d="M189 130 V 160" />

        <g className="arch-ghost">
          <rect x="141" y="160" width="96" height="42" rx="8" />
          <path className="arch-x" d="M151 170 L 227 192 M227 170 L 151 192" />
        </g>
        <text x="189" y="219" className="arch-ghost-label">{copy.noServer}</text>

        <g className="arch-node arch-node--source">
          <rect x="10" y="102" width="108" height="56" rx="10" />
          <text x="64" y="126">{copy.prompt}</text>
          <text x="64" y="144" className="arch-node-sub">{copy.editor}</text>
        </g>
        <g className="arch-node arch-node--accent arch-node--gemini">
          <rect x="350" y="34" width="120" height="56" rx="10" />
          <text x="410" y="58">{copy.provider}</text>
          <text x="410" y="76" className="arch-node-sub">{copy.providerSub}</text>
        </g>
        <g className="arch-node arch-node--accent arch-node--storage">
          <rect x="350" y="170" width="120" height="56" rx="10" />
          <text x="410" y="194">{copy.storage}</text>
          <text x="410" y="212" className="arch-node-sub">{copy.storageSub}</text>
        </g>
      </svg>
    </div>
  )
}
