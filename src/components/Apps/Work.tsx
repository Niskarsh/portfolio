export default function Work(){
    const roles=[
      { company:'Acme Corp', title:'Senior Full-Stack Engineer', range:'2023 — Present', bullets:['Led Proof-of-Skill evaluation (11s → 3s).','Shipped video ingestion pipeline on AWS.']},
      { company:'Beta Labs', title:'Software Engineer', range:'2021 — 2023', bullets:['Drove +18% conversion on unlock flow.','Built CI and internal tooling.']},
    ]
    return (
      <ol className="relative border-s border-[var(--border)] ms-4">
        {roles.map((r, idx) => (
          <li key={idx} className="mb-8 ms-6">
            <span className="absolute -start-3.5 mt-1.5 w-3 h-3 rounded-full bg-[var(--brand)] border border-[var(--border)]" />
            <h3 className="font-semibold">{r.title} • {r.company}</h3>
            <div className="text-sm text-[var(--subtle)]">{r.range}</div>
            <ul className="list-disc ms-5 mt-1 text-sm space-y-1">{r.bullets.map((b,i)=>(<li key={i}>{b}</li>))}</ul>
          </li>
        ))}
      </ol>
    )
  }
  