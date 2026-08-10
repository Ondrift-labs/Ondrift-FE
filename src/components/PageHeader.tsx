import { Download, Plus } from 'lucide-react'

export function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <header className="page-header">
      <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>
      <div className="page-actions"><button className="button secondary"><Download size={16} />내보내기</button><button className="button primary"><Plus size={16} />신규 등록</button></div>
    </header>
  )
}
