export default function About(){
    const skills=['TypeScript','Next.js','Node','Postgres','AWS','Three.js','Tailwind']
    const publications=['Efficient Eval Pipelines (2024)','Talk: Building Micro-SaaS (2023)']
    const hobbies=['Cycling','Photography','Chess']
    return (
      <div className="grid gap-6 md:grid-cols-3">
        <section className="rounded-xl bg-white/5 border border-[var(--border)] p-4">
          <h3 className="font-semibold mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map(s=><span key={s} className="px-2 py-1 rounded-lg bg-white/10 border border-white/15 text-sm">{s}</span>)}
          </div>
        </section>
        <section className="rounded-xl bg-white/5 border border-[var(--border)] p-4">
          <h3 className="font-semibold mb-2">Publications</h3>
          <ul className="list-disc ms-5 space-y-1 text-sm">{publications.map(p=><li key={p}>{p}</li>)}</ul>
        </section>
        <section className="rounded-xl bg-white/5 border border-[var(--border)] p-4">
          <h3 className="font-semibold mb-2">Hobbies</h3>
          <ul className="list-disc ms-5 space-y-1 text-sm">{hobbies.map(h=><li key={h}>{h}</li>)}</ul>
        </section>
      </div>
    )
  }
  