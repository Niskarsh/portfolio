'use client'
import { useState } from 'react'
import { Rnd } from 'react-rnd'

export default function Window(props:{
  title:string, z:number, onFocus:()=>void,
  onClose?:()=>void, onMinimize?:()=>void, onMaximize?:()=>void,
  default?:{x:number,y:number,w:number,h:number}, maximized?:boolean, minimized?:boolean,
  icon?:React.ReactNode, children:React.ReactNode
}){
  const {title,children,onClose,onFocus,onMinimize,onMaximize,z,icon,maximized,minimized}=props
  const def=props.default??{x:200,y:160,w:820,h:560}
  const [minAnim,setMinAnim]=useState(false)
  const style=maximized?{zIndex:z,position:'fixed' as const,top:48,left:88,right:16,bottom:16}:{zIndex:z,position:'fixed' as const}
  if(minimized) return null

  const onMinClick=()=>{
    setMinAnim(true)
    setTimeout(()=>{ setMinAnim(false); onMinimize && onMinimize() }, 180)
  }
  const animStyle = minAnim
    ? { transform:'translate(-60px, 280px) scale(0.85)', opacity:.0, transition:'transform .18s ease, opacity .18s ease' }
    : { transform:'translate(0,0) scale(1)', opacity:1, transition:'transform .18s ease, opacity .18s ease' }

  return (
    <Rnd default={{x:def.x,y:def.y,width:def.w,height:def.h}} bounds="window" dragHandleClassName="win-drag"
      className="yaru-window overflow-hidden" style={{...style, ...animStyle}} onMouseDown={onFocus} enableResizing={!maximized}>
      <div className="window-header win-drag cursor-move">
        <div className="window-controls">
          <span className="btn-ctl btn-close" onClick={onClose}>×</span>
          <span className="btn-ctl btn-min" onClick={onMinClick}>−</span>
          <span className="btn-ctl btn-max" onClick={onMaximize}>□</span>
        </div>
        <div className="window-title">{icon}<span>{title}</span></div><div className="w-16"/>
      </div>
      <div className="p-4 h-[calc(100%-44px)] overflow-auto">{children}</div>
    </Rnd>
  )
}
