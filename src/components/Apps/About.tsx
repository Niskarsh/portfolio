export default function About(){
    const skills=['JavaScript', 'TypeScript', 'NodeJS', 'ExpressJS','Postgres', 'Redis', 'AWS Cloud Infra','Next.js']
    const publications=[{
      title: '6 things I haven’t done since ChatGPT (2025)',
      link: 'https://medium.com/everyday-ai/6-things-i-havent-done-since-chatgpt-29d862ad7503'
    },{
      title: 'Will I lose my job to AI? (2025)',
      link: 'https://medium.com/illumination/will-i-lose-my-job-to-ai-09673dc64ee7'
    }]
    const hobbies=['Singing','Guitar','Go-karting', 'Video editing', 'Music production', 'Reading (fiction)', 'Trading']
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
          <ul className="list-disc ms-5 space-y-1 text-sm">{publications.map(p=>
            <a href={p.link} target="__blank">
            <li key={p.title}>{p.title}</li>
            </a>
            )}</ul>
        </section>
        <section className="rounded-xl bg-white/5 border border-[var(--border)] p-4">
          <h3 className="font-semibold mb-2">Hobbies</h3>
          <ul className="list-disc ms-5 space-y-1 text-sm">{hobbies.map(h=><li key={h}>{h}</li>)}</ul>
        </section>
      </div>
    )
  }
  