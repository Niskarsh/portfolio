import Heatmap from './parts/Heatmap'

export default function Projects({username}:{username:string}){
  const items=[
    { title: 'Proof-of-Skill: scalable evaluation', impact: '↓11s → 3s via materialized views' },
    { title: 'Video ingestion pipeline', impact: 'Serverless uploads, MediaConvert automation' },
    { title: 'Recruiter unlock flow', impact: '+18% unlock rate after UX rewrite' },
  ]
  return (
    <div className="space-y-6">
      <Heatmap username={username} />
      <div className="space-y-3">
        {items.map(it => (
          <div key={it.title} className="rounded-xl bg-white/5 border border-[var(--border)] p-4">
            <div className="text-lg font-semibold">{it.title}</div>
            <div className="text-sm text-[var(--subtle)] mt-1">{it.impact}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
