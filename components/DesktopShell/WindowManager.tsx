'use client'
import { useState } from 'react'
import Window from './Window'
import Projects from '../Apps/Projects'
import Heatmap from '../Apps/Heatmap'
import Chatbot from '../Apps/Chatbot'
import Schedule from '../Apps/Schedule'
import Terminal from '../Apps/Terminal'
import Browser from '../Apps/Browser'

type WinType = 'projects'|'heatmap'|'chat'|'schedule'|'terminal'|'browser'
type Win = { id: number, type: WinType, title: string, z: number }
let _id = 1

export default function WindowManager() {
  const [wins, setWins] = useState<Win[]>([{ id: _id++, type:'projects', title:'Projects', z:1 }])
  const [zTop, setZTop] = useState(1)

  const spawn = (type: WinType) => {
    const title = ({projects:'Projects', heatmap:'GitHub Heatmap', chat:'AI Avatar', schedule:'Schedule', terminal:'Terminal', browser:'Browser'})[type]
    const w: Win = { id: _id++, type, title, z: zTop + 1 }
    setZTop(zTop + 1); setWins(ws => [...ws, w])
  }
  const focus = (id: number) => { setZTop(zTop + 1); setWins(ws => ws.map(w => w.id===id?{...w, z: zTop + 1}:w)) }
  const close = (id: number) => setWins(ws => ws.filter(w => w.id !== id))

  const render = (w: Win) => {
    const common = { onClose: () => close(w.id), onFocus: () => focus(w.id), z: w.z, title: w.title }
    switch (w.type) {
      case 'projects': return <Window key={w.id} {...common}><Projects/></Window>
      case 'heatmap':  return <Window key={w.id} {...common}><Heatmap username={process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'octocat'} /></Window>
      case 'chat':     return <Window key={w.id} {...common}><Chatbot/></Window>
      case 'schedule': return <Window key={w.id} {...common} default={{x:180,y:180,w:900,h:720}}><Schedule url={process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com'} /></Window>
      case 'terminal': return <Window key={w.id} {...common}><Terminal/></Window>
      case 'browser':  return <Window key={w.id} {...common} default={{x:220,y:200,w:900,h:600}}><Browser/></Window>
    }
  }

  return { wins, spawn, render }
}
