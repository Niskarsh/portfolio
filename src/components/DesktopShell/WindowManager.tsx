'use client'
import { useMemo, useState } from 'react'
import Window from './Window'
import Projects from '@/components/Apps/Projects'
import Work from '@/components/Apps/Work'
import About from '@/components/Apps/About'
import { VscFiles } from 'react-icons/vsc'
import { MdWorkHistory, MdPerson } from 'react-icons/md'
import type { Kind } from './Dock'

type Win = { id:number, kind:Kind, title:string, z:number, minimized:boolean, maximized:boolean }
let _id=1

export default function WindowManager(){
  const [wins,setWins]=useState<Win[]>([
    {id:_id++,kind:'projects',title:'Projects',z:1,minimized:false,maximized:false}
  ])
  const [zTop,setZTop]=useState(1)

  const spawn=(kind:Kind)=>{
    const title={projects:'Projects',work:'Work Experience',about:'About Me'}[kind]
    const w:Win={id:_id++,kind,title,z:zTop+1,minimized:false,maximized:false}
    setZTop(zTop+1); setWins(ws=>[...ws,w])
  }
  const focus=(id:number)=>{setZTop(zTop+1); setWins(ws=>ws.map(w=>w.id===id?{...w,z:zTop+1}:w))}
  const close=(id:number)=>setWins(ws=>ws.filter(w=>w.id!==id))
  const minimize=(id:number)=>setWins(ws=>ws.map(w=>w.id===id?{...w,minimized:true,maximized:false}:w))
  const maximize=(id:number)=>setWins(ws=>ws.map(w=>w.id===id?{...w,maximized:!w.maximized,minimized:false}:w))

  // Dock click: restore latest minimized, else focus existing, else spawn
  const onDockClick=(kind:Kind)=>{
    const minimized = wins.filter(w=>w.kind===kind && w.minimized).sort((a,b)=>b.z-a.z)
    if(minimized.length){ const id=minimized[0].id; setWins(ws=>ws.map(w=>w.id===id?{...w,minimized:false}:w)); focus(id); return }
    const existing = wins.filter(w=>w.kind===kind && !w.minimized).sort((a,b)=>b.z-a.z)
    if(existing.length){ focus(existing[0].id); return }
    spawn(kind)
  }

  const counts: Record<Kind, number> = useMemo(() => ({
    projects: wins.filter(w=>w.kind==='projects').length,
    work:     wins.filter(w=>w.kind==='work').length,
    about:    wins.filter(w=>w.kind==='about').length,
  }), [wins])

  const icon=(k:Kind)=>k==='projects'?<VscFiles/>:k==='work'?<MdWorkHistory/>:<MdPerson/>
  const render=(w:Win)=>{
    const common={onClose:()=>close(w.id),onFocus:()=>focus(w.id),onMinimize:()=>minimize(w.id),onMaximize:()=>maximize(w.id),
      z:w.z,title:w.title,maximized:w.maximized,minimized:w.minimized,icon:icon(w.kind)}
    switch(w.kind){
      case 'projects': return <Window key={w.id} {...common}><Projects username={process.env.NEXT_PUBLIC_GITHUB_USERNAME||'octocat'}/></Window>
      case 'work':     return <Window key={w.id} {...common}><Work/></Window>
      case 'about':    return <Window key={w.id} {...common}><About/></Window>
    }
  }

  return { wins, render, onDockClick, counts }
}
