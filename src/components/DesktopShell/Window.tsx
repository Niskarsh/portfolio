'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd'

const TOP = 48   // top bar height
const LEFT = 88  // dock width
const PAD = 16   // outer padding

type Size = { w:number, h:number }
type Pos  = { x:number, y:number }

export default function Window(props:{
  title:string, z:number, onFocus:()=>void,
  onClose?:()=>void, onMinimize?:()=>void, onMaximize?:()=>void,
  default?:{x:number,y:number,w:number,h:number}, maximized?:boolean, minimized?:boolean,
  icon?:React.ReactNode, children:React.ReactNode
}) {
  const { title, children, onClose, onFocus, onMinimize, onMaximize, z, icon } = props
  const def = props.default ?? { x: 220, y: 160, w: 860, h: 600 }
  const [pos, setPos] = useState<Pos>({ x: def.x, y: def.y })
  const [size, setSize] = useState<Size>({ w: def.w, h: def.h })
  const [maxed, setMaxed] = useState<boolean>(!!props.maximized)
  const [minimized, setMinimized] = useState<boolean>(!!props.minimized)
  const [minimizing, setMinimizing] = useState(false)

  const rndRef = useRef<Rnd>(null)

  // Compute full-bleed size inside the desktop when maximized
  const maxTarget = useMemo(() => {
    const W = typeof window !== 'undefined' ? window.innerWidth : 1280
    const H = typeof window !== 'undefined' ? window.innerHeight : 800
    return {
      x: LEFT,
      y: TOP,
      w: Math.max(320, W - LEFT - PAD),
      h: Math.max(240, H - TOP - PAD)
    }
  }, [])

  // Keep maximized window fitted on resize
  useEffect(() => {
    if (!maxed) return
    const onResize = () => {
      const W = window.innerWidth, H = window.innerHeight
      setPos({ x: LEFT, y: TOP })
      setSize({ w: Math.max(320, W - LEFT - PAD), h: Math.max(240, H - TOP - PAD) })
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [maxed])

  if (minimized) return null

  const onDragStop: RndDragCallback = (_e, d) => setPos({ x: d.x, y: d.y })
  const onResizeStop: RndResizeCallback = (_e, _dir, ref, _delta, position) => {
    setSize({ w: ref.offsetWidth, h: ref.offsetHeight })
    setPos({ x: position.x, y: position.y })
  }

  const handleMinimize = () => {
    // play CSS keyframe, then actually hide
    setMinimizing(true)
  }

  const handleMaximize = () => {
    if (maxed) {
      // restore
      setMaxed(false)
    } else {
      // store current pos/size implicitly in state; then set maxed
      setPos({ x: maxTarget.x, y: maxTarget.y })
      setSize({ w: maxTarget.w, h: maxTarget.h })
      setMaxed(true)
    }
    onMaximize?.()
  }

  const style = { zIndex: z, position: 'fixed' as const }
  const animClass = minimizing ? 'win-minimizing' : ''

  return (
    <Rnd
      ref={rndRef}
      position={maxed ? { x: maxTarget.x, y: maxTarget.y } : pos}
      size={maxed ? { width: maxTarget.w, height: maxTarget.h } : { width: size.w, height: size.h }}
      bounds="window"
      dragHandleClassName="win-drag"
      enableResizing={!maxed}
      disableDragging={maxed}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      className={`yaru-window overflow-hidden ${animClass}`}
      style={style}
      onMouseDown={onFocus}
      onAnimationEnd={() => {
        if (minimizing) {
          setMinimizing(false)
          setMinimized(true)
          onMinimize?.()
        }
      }}
    >
      <div className="window-header win-drag cursor-move">
        <div className="window-controls">
          <span className="btn-ctl btn-close" onClick={onClose}>×</span>
          <span className="btn-ctl btn-min" onClick={handleMinimize}>−</span>
          <span className="btn-ctl btn-max" onClick={handleMaximize}>□</span>
        </div>
        <div className="window-title">{icon}<span>{title}</span></div>
        <div className="w-16" />
      </div>
      <div className="p-4 h-[calc(100%-44px)] overflow-auto">{children}</div>
    </Rnd>
  )
}
