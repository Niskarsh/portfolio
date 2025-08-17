'use client'
import { VscFiles } from 'react-icons/vsc'
import { MdWorkHistory, MdPerson } from 'react-icons/md'

export type Kind = 'projects'|'work'|'about'

export default function Dock({
  counts, onDockClick
}:{ counts: Record<Kind, number>, onDockClick: (t: Kind) => void }) {

  const items: { id: Kind, label: string, icon: any }[] = [
    { id:'projects', label:'Projects', icon:<VscFiles size={28}/> },
    { id:'work',     label:'Work',     icon:<MdWorkHistory size={28}/> },
    { id:'about',    label:'About',    icon:<MdPerson size={28}/> },
  ]

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[60vw] max-w-[1100px]">
      <div className="pointer-events-auto rounded-3xl border border-[var(--border)] bg-black/45 backdrop-blur-xl shadow-yaru px-5 py-3">
        <div className="flex items-end justify-center gap-6">
          {items.map(it => {
            const count = counts[it.id] || 0
            const running = count > 0
            const dots = Math.min(count, 3)

            return (
              <div key={it.id} className="flex flex-col items-center">
                {/* dots ABOVE the icon */}
                <div className="mb-1 h-1.5 flex gap-1.5">
                  {Array.from({ length: dots }).map((_,i)=> (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/70" />
                  ))}
                </div>

                <button
                  id={`dock-btn-${it.id}`}                       {/* <-- minimize target */}
                  onClick={() => onDockClick(it.id)}
                  className={`dock-item w-14 h-14 rounded-2xl grid place-items-center transition text-white border
                    ${running ? 'bg-white/15 border-white/25' : 'bg-white/8 border-white/10 hover:bg-white/15'}`}
                  title={it.label}
                >
                  {it.icon}
                </button>

                {/* label */}
                <span className="mt-1 text-[11px] tracking-wide text-[var(--subtle)]">{it.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
