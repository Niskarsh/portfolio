'use client'
import { useState } from 'react'
export default function Terminal() {
  const [lines, setLines] = useState<string[]>(['NiskarshOS 1.0 (web) — type `help`'])
  const [input, setInput] = useState('')
  const run = (cmd: string) => {
    if (cmd === 'help') setLines(l => [...l, 'commands: help, about, projects, clear'])
    else if (cmd === 'about') setLines(l => [...l, 'Full‑stack dev. I build practical systems that ship.'])
    else if (cmd === 'projects') setLines(l => [...l, 'Proof-of-Skill • Video pipeline • Unlock flow'])
    else if (cmd === 'clear') setLines([])
    else setLines(l => [...l, `command not found: ${cmd}`])
  }
  return (
    <div className="font-mono text-sm">
      {lines.map((ln,i)=>(<div key={i}>{ln}</div>))}
      <form onSubmit={(e)=>{e.preventDefault(); run(input.trim()); setInput('')}} className="flex gap-2 mt-2">
        <span>$</span><input value={input} onChange={(e)=>setInput(e.target.value)} className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1 outline-none" />
      </form>
    </div>
  )
}
