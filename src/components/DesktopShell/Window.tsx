'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Rnd, RndDragCallback, RndResizeCallback, RndDragStartCallback } from 'react-rnd'

const TOP_BAR  = 48   // px
const EDGE_PAD = 16   // px

type Size = { w:number, h:number }
type Pos  = { x:number, y:number }

export default function Window(props:{
  title:string, z:number, onFocus:()=>void,
  onClose?:()=>void, onMinimize?:()=>void, onMaximize?:()=>void,
  default?:{x:number,y:number,w:number,h:number},
  maximized?:boolean, minimized?:boolean,
  icon?:React.ReactNode, children:React.ReactNode,
  dockTargetId: string,                    // e.g. dock-btn-projects
}) {
  const { title, children, onClose, onFocus, onMinimize, onMaximize, z, icon, dockTargetId } = props
  const def = props.default ?? { x: 220, y: 160, w: 880, h: 620 }

  const [pos,  setPos]  = useState<Pos>({ x: def.x, y: def.y })
  const [size, setSize] = useState<Size>({ w: def.w, h: def.h })
  const normalRef = useRef<{ pos:Pos, size:Size }>({ pos:{...pos}, size:{...size} })
  const [maxed, setMaxed] = useState<boolean>(!!props.maximized)
  const [minimized, setMinimized] = useState<boolean>(!!props.minimized)
  const [minimizing, setMinimizing] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [dragging, setDragging] = useState(false)

  const rndRef = useRef<Rnd>(null)
  const selfElRef = useRef<HTMLElement | null>(null)

  // capture our real DOM node once mounted
  useEffect(() => {
    const el =
      (rndRef.current as any)?.resizableElement?.current as HTMLElement
      || (rndRef.current as any)?.getSelfElement?.() as HTMLElement
    selfElRef.current = el ?? null
  }, [])

  // maximize target: fill to bottom (dock floats above)
  const maxTarget = useMemo(() => {
    const W = typeof window !== 'undefined' ? window.innerWidth  : 1280
    const H = typeof window !== 'undefined' ? window.innerHeight : 800
    return { x: EDGE_PAD, y: TOP_BAR, w: Math.max(360, W - EDGE_PAD * 2), h: Math.max(260, H - TOP_BAR - EDGE_PAD) }
  }, [])

  useEffect(() => {
    if (!maxed) return
    const onResize = () => {
      const W = window.innerWidth, H = window.innerHeight
      setPos({ x: EDGE_PAD, y: TOP_BAR })
      setSize({ w: Math.max(360, W - EDGE_PAD*2), h: Math.max(260, H - TOP_BAR - EDGE_PAD) })
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [maxed])

  if (minimized) return null

  const onDragStart: RndDragStartCallback = () => setDragging(true)
  const onDragStop: RndDragCallback = (_e, d) => {
    setDragging(false)
    setPos({ x: d.x, y: d.y })
    if (!maxed) normalRef.current.pos = { x: d.x, y: d.y }
  }
  const onResizeStop: RndResizeCallback = (_e, _dir, ref, _delta, position) => {
    const s = { w: ref.offsetWidth, h: ref.offsetHeight }
    const p = { x: position.x, y: position.y }
    setSize(s); setPos(p)
    if (!maxed) normalRef.current = { size: s, pos: p }
  }

  // Minimize to the exact dock icon center
  const handleMinimize = () => {
    const winEl = selfElRef.current
    const iconEl = document.getElementById(dockTargetId)
    if (winEl && iconEl) {
      const wr = winEl.getBoundingClientRect()
      const ir = iconEl.getBoundingClientRect()
      const dx = (ir.left + ir.width/2) - (wr.left + wr.width/2)
      const dy = (ir.top  + ir.height/2) - (wr.top  + wr.height/2)
      winEl.style.setProperty('--min-x', `${dx}px`)
      winEl.style.setProperty('--min-y', `${dy}px`)
    }
    setMinimizing(true)
  }

  // Toggle maximize ⇄ restore (restore to LAST unmaxed geometry)
  const handleMaximize = () => {
    setAnimate(true)
    if (maxed) {
      const { pos: p, size: s } = normalRef.current
      setMaxed(false); setPos({ ...p }); setSize({ ...s })
    } else {
      normalRef.current = { pos: { ...pos }, size: { ...size } }
      setMaxed(true); setPos({ x: maxTarget.x, y: maxTarget.y }); setSize({ w: maxTarget.w, h: maxTarget.h })
    }
    onMaximize?.()
    setTimeout(() => setAnimate(false), 420)
  }

  const style = { zIndex: z, position: 'fixed' as const }
  const classes = ['yaru-window','overflow-hidden', animate ? 'win-animate' : '', minimizing ? 'win-minimizing' : ''].join(' ').trim()

  return (
    <Rnd
      ref={rndRef}
      position={maxed ? { x: maxTarget.x, y: maxTarget.y } : pos}
      size={maxed ? { width: maxTarget.w, height: maxTarget.h } : { width: size.w, height: size.h }}
      bounds="window"
      dragHandleClassName="win-drag"
      enableResizing={!maxed}
      disableDragging={maxed}
      onDragStart={onDragStart}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      className={classes}
      style={style}
      onMouseDown={onFocus}
      onAnimationEnd={() => {
        if (minimizing) { setMinimizing(false); setMinimized(true); onMinimize?.() }
      }}
    >
      <div
        className={`window-header win-drag ${dragging ? 'cursor-grabbing' : 'cursor-default'}`}
        onMouseDown={() => setDragging(true)}
        onMouseUp={() => setDragging(false)}
      >
        <div className="window-controls">
          <span className="btn-ctl btn-close" onClick={onClose}>×</span>
          <span className="btn-ctl btn-min"   onClick={handleMinimize}>−</span>
          <span className="btn-ctl btn-max"   onClick={handleMaximize}>□</span>
        </div>
        <div className="window-title">{icon}<span>{title}</span></div>
        <div className="w-16" />
      </div>
      {/* inner holder just to be safe for getBoundingClientRect() */}
      <div ref={(el)=>{ /* capture outer element if needed */ if(el && !selfElRef.current) selfElRef.current = el.parentElement as HTMLElement }}
           className="p-4 h-[calc(100%-44px)] overflow-auto">
        {children}
      </div>
    </Rnd>
  )
}
