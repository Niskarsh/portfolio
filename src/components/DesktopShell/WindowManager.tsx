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
  const [wins,setWins]=useState<Win[]>([])
  const [zTop,setZTop]=useState(1)

  const bumpZ = () => setZTop(z => z + 1)

  const spawn=(kind:Kind)=>{
    const title={projects:'Projects',work:'Work Experience',about:'About Me'}[kind]
    setWins(ws => {
      const zNew = (zTop + 1)
      setZTop(zNew)
      return [...ws, {id:_id++,kind,title,z:zNew,minimized:false,maximized:false}]
    })
  }
  const focus=(id:number)=>{
    setZTop(z => {
      const zNew = z + 1
      setWins(ws => ws.map(w=>w.id===id?{...w,z:zNew}:w))
      return zNew
    })
  }
  const close=(id:number)=>setWins(ws=>ws.filter(w=>w.id!==id))
  const minimize=(id:number)=>setWins(ws=>ws.map(w=>w.id===id?{...w,minimized:true,maximized:false}:w))
  const maximize=(id:number)=>setWins(ws=>ws.map(w=>w.id===id?{...w,maximized:!w.maximized,minimized:false}:w))

  // Dock click: restore one minimized (if any) → else focus existing → else spawn
  const onDockClick=(kind:Kind)=>{
    setWins(ws=>{
      const minimized = ws.filter(w=>w.kind===kind && w.minimized).sort((a,b)=>b.z-a.z)
      if(minimized.length){
        const id = minimized[0].id
        const zNew = zTop + 1
        setZTop(zNew)
        return ws.map(w=>w.id===id?{...w,minimized:false,z:zNew}:w)
      }
      const existing = ws.filter(w=>w.kind===kind && !w.minimized).sort((a,b)=>b.z-a.z)
      if(existing.length){ focus(existing[0].id); return ws }
      // spawn
      const zNew = zTop + 1
      const title={projects:'Projects',work:'Work Experience',about:'About Me'}[kind]
      return [...ws,{id:_id++,kind,title,z:zNew,minimized:false,maximized:false}]
    })
  }

  const counts: Record<Kind, number> = useMemo(() => ({
    projects: wins.filter(w=>w.kind==='projects').length,
    work:     wins.filter(w=>w.kind==='work').length,
    about:    wins.filter(w=>w.kind==='about').length,
  }), [wins])

  const icon=(k:Kind)=>k==='projects'?<VscFiles/>:k==='work'?<MdWorkHistory/>:<MdPerson/>
  const render=(w:Win)=>{
    const common={
      onClose:()=>close(w.id),
      onFocus:()=>focus(w.id),
      onMinimize:()=>minimize(w.id),
      onMaximize:()=>maximize(w.id),
      z:w.z,title:w.title,maximized:w.maximized,minimized:w.minimized,icon:icon(w.kind),
      dockTargetId:`dock-btn-${w.kind}`,
    }
    switch(w.kind){
      case 'projects': return <Window key={w.id} {...common}><Projects username={process.env.NEXT_PUBLIC_GITHUB_USERNAME||'octocat'}/></Window>
      case 'work':     return <Window key={w.id} {...common}><Work/></Window>
      case 'about':    return <Window key={w.id} {...common}><About/></Window>
    }
  }

  return { wins, render, onDockClick, counts }
}
