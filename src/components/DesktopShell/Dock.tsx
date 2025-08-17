'use client'
import { VscFiles } from 'react-icons/vsc'
import { MdWorkHistory, MdPerson } from 'react-icons/md'
import { FaMedium } from 'react-icons/fa6'

export type Kind = 'projects'|'work'|'about'
export type DockClick = (t: Kind) => void

export default function Dock({
  spawn, counts, onDockClick, mediumUrl
}:{ spawn: DockClick, counts: Record<Kind, number>, onDockClick: (t: Kind) => void, mediumUrl?: string }) {

  const items: { id: Kind | 'medium', label: string, icon: any, onClick: () => void, isApp: boolean }[] = [
    { id:'projects', label:'Projects', icon:<VscFiles size={32}/>, onClick:() => onDockClick('projects'), isApp: true },
    { id:'work',     label:'Work',     icon:<MdWorkHistory size={32}/>, onClick:() => onDockClick('work'), isApp: true },
    { id:'about',    label:'About',    icon:<MdPerson size={32}/>, onClick:() => onDockClick('about'), isApp: true },
    { id:'medium',   label:'Medium',   icon:<FaMedium size={28}/>, onClick:() => { window.open(mediumUrl || 'https://medium.com/@your-handle','_blank') }, isApp: false },
  ]

  return (
    <div className="fixed top-12 bottom-0 left-0 w-[88px] flex flex-col gap-5 py-5 items-center bg-black/30 backdrop-blur border-r border-[var(--border)] z-40">
      {items.map(it => {
        const isRunning = it.isApp && (counts as any)[it.id] > 0
        const dots = it.isApp ? Math.min((counts as any)[it.id] || 0, 3) : 0
        return (
          <div key={it.id} className="flex flex-col items-center">
            <button
              onClick={it.onClick}
              className={`w-16 h-16 rounded-2xl grid place-items-center transition text-white border ${isRunning ? 'bg-white/15 border-white/25' : 'bg-white/8 border-white/10 hover:bg-white/15'}`}
              title={it.label}
            >
              {it.icon}
            </button>
            <div className="mt-1 h-1.5 flex gap-1.5">
              {Array.from({ length: dots }).map((_,i)=> <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/70" />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
