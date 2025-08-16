'use client'
import { ReactNode } from 'react'
import { SiUbuntu, SiSlack } from "react-icons/si";
import { VscCode, VscFiles, VscTerminal, VscExtensions } from 'react-icons/vsc'
import { FaChrome } from 'react-icons/fa'

export function DefaultDock({ spawn }: { spawn: (type: string) => void }) {
  const items = [
    { id:'files', label:'Files', icon:<VscFiles size={22}/>, onClick:()=>spawn('projects') },
    { id:'docs', label:'Heatmap', icon:<VscExtensions size={22}/>, onClick:()=>spawn('heatmap') },
    { id:'chrome', label:'Browser', icon:<FaChrome size={22}/>, onClick:()=>spawn('browser') },
    { id:'terminal', label:'Terminal', icon:<VscTerminal size={22}/>, onClick:()=>spawn('terminal') },
    { id:'slack', label:'Chat', icon:<SiSlack size={22}/>, onClick:()=>spawn('chat') },
    { id:'vscode', label:'VS Code', icon:<VscCode size={22}/>, onClick:()=>spawn('projects') },
  ]
  const bottom = [{ id:'apps', label:'Show Applications', icon:<SiUbuntu size={22}/>, onClick:()=>spawn('schedule') }]
  return (
    <div className="fixed top-12 bottom-0 left-0 w-16 flex flex-col justify-between py-4 bg-black/25 backdrop-blur border-r border-white/10 z-40">
      <div className="flex flex-col items-center gap-4">
        {items.map(it => (
          <button key={it.id} onClick={it.onClick}
            className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 transition grid place-items-center text-white"
            title={it.label}>{it.icon}</button>
        ))}
      </div>
      <div className="flex flex-col items-center gap-4">
        {bottom.map(it => (
          <button key={it.id} onClick={it.onClick}
            className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 transition grid place-items-center text-white"
            title={it.label}>{it.icon}</button>
        ))}
      </div>
    </div>
  )
}
