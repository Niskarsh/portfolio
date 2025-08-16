export default function Projects() {
  const items = [
    { title: 'Proof-of-Skill: scalable evaluation', impact: '↓11s query time → 3s via materialized views' },
    { title: 'Video ingestion pipeline', impact: 'Serverless, resumable uploads, MediaConvert automation' },
    { title: 'Recruiter unlock flow', impact: '+18% unlock rate after UX rewrite' },
  ]
  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.title} className="rounded-xl bg-white/5 border border-white/10 p-4">
          <div className="text-lg font-semibold">{it.title}</div>
          <div className="text-sm text-white/70 mt-1">{it.impact}</div>
        </div>
      ))}
      <p className="text-sm text-white/60 mt-6">Click dock icons to open multiple windows—like Ubuntu.</p>
    </div>
  )
}
