'use client'
import { VscFiles } from 'react-icons/vsc'
import { MdWorkHistory, MdPerson } from 'react-icons/md'

export type Kind = 'projects'|'work'|'about'
export type DockClick = (t: Kind) => void

export default function Dock({
  counts, onDockClick
}:{ counts: Record<Kind, number>, onDockClick: (t: Kind) => void }) {

  const items: { id: Kind, label: string, icon: any }[] = [
    { id:'projects', label:'Projects', icon:<VscFiles size={32}/> },
    { id:'work',     label:'Work',     icon:<MdWorkHistory size={32}/> },
    { id:'about',    label:'About',    icon:<MdPerson size={32}/> },
  ]

  return (
    <div className="fixed top-12 bottom-0 left-0 w-[88px] flex flex-col gap-5 py-5 items-center bg-black/30 backdrop-blur border-r border-[var(--border)] z-40">
      {items.map(it => {
        const count = counts[it.id] || 0
        const running = count > 0
        const dots = Math.min(count, 3)
        return (
          <div key={it.id} className="flex flex-col items-center">
            <button
              onClick={() => onDockClick(it.id)}
              className={`w-16 h-16 rounded-2xl grid place-items-center transition text-white border ${running ? 'bg-white/15 border-white/25' : 'bg-white/8 border-white/10 hover:bg-white/15'}`}
              title={it.label}
            >
              {it.icon}
            </button>
            {/* label */}
            <span className="mt-1 text-[10px] tracking-wide text-[var(--subtle)]">{it.label}</span>
            {/* running indicators */}
            <div className="mt-1 h-1.5 flex gap-1.5">
              {Array.from({ length: dots }).map((_,i)=> <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/70" />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
