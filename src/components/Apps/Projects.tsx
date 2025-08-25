import Heatmap from './parts/Heatmap'

export default function Projects({username}:{username:string}){
  const items=[
    { title: 'Sales Skill Evaluator  (OpenAI Realtime: gpt-4o-realtime-preview-2024-12-17) ', impact: 'https://sales-ai-pilot.vercel.app' },
    { title: 'Portfolio (Ubuntu 22.04 flavored Portfolio) - Still in work', impact: 'https://niskarsh.vercel.app/' },
    // { title: 'Video ingestion pipeline', impact: 'Uploads via IVS, MediaConvert automation' },
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
