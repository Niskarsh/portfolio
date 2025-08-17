'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Rnd, RndDragCallback, RndResizeCallback, RndDragStartCallback } from 'react-rnd'

/** Layout chrome (keep in sync with TopBar + Dock) */
const TOP_BAR = 48           // px
const DOCK_H  = 96           // px (bottom dock height incl. shadow/padding)
const EDGE_PAD = 16          // px (safe padding at edges)

type Size = { w:number, h:number }
type Pos  = { x:number, y:number }

export default function Window(props:{
  title:string, z:number, onFocus:()=>void,
  onClose?:()=>void, onMinimize?:()=>void, onMaximize?:()=>void,
  default?:{x:number,y:number,w:number,h:number},
  maximized?:boolean, minimized?:boolean,
  icon?:React.ReactNode, children:React.ReactNode
}) {
  const { title, children, onClose, onFocus, onMinimize, onMaximize, z, icon } = props
  const def = props.default ?? { x: 220, y: 160, w: 860, h: 600 }

  // live geometry
  const [pos,  setPos]  = useState<Pos>({ x: def.x, y: def.y })
  const [size, setSize] = useState<Size>({ w: def.w, h: def.h })

  // saved "normal" geometry when not maximized (used to restore)
  const normalRef = useRef<{ pos:Pos, size:Size }>({ pos:{...pos}, size:{...size} })

  const [maxed, setMaxed] = useState<boolean>(!!props.maximized)
  const [minimized, setMinimized] = useState<boolean>(!!props.minimized)
  const [minimizing, setMinimizing] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [dragging, setDragging] = useState(false)

  // computed maximize target (keeps windows clear of top bar + bottom dock)
  const maxTarget = useMemo(() => {
    const W = typeof window !== 'undefined' ? window.innerWidth  : 1280
    const H = typeof window !== 'undefined' ? window.innerHeight : 800
    return {
      x: EDGE_PAD,
      y: TOP_BAR,
      w: Math.max(320, W - EDGE_PAD*2),
      h: Math.max(240, H - TOP_BAR - DOCK_H - EDGE_PAD)
    }
  }, [])

  // keep maximized fit on viewport resize
  useEffect(() => {
    if (!maxed) return
    const onResize = () => {
      const W = window.innerWidth, H = window.innerHeight
      setPos({ x: EDGE_PAD, y: TOP_BAR })
      setSize({ w: Math.max(320, W - EDGE_PAD*2), h: Math.max(240, H - TOP_BAR - DOCK_H - EDGE_PAD) })
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

  const handleMinimize = () => {
    setAnimate(false)            // ensure we only run the keyframes for minimize
    setMinimizing(true)          // adds .win-minimizing class
  }

  const handleMaximize = () => {
    setAnimate(true)             // enable smooth transition for the geometry change
    if (maxed) {
      // restore to last normal geometry
      const { pos: p, size: s } = normalRef.current
      setMaxed(false)
      setPos({ ...p }); setSize({ ...s })
    } else {
      // save current as normal, then maximize
      normalRef.current = { pos: { ...pos }, size: { ...size } }
      setMaxed(true)
      setPos({ x: maxTarget.x, y: maxTarget.y })
      setSize({ w: maxTarget.w, h: maxTarget.h })
    }
    onMaximize?.()
    // drop the animate class after the transition completes
    setTimeout(() => setAnimate(false), 220)
  }

  const style = { zIndex: z, position: 'fixed' as const }
  const classes = [
    'yaru-window', 'overflow-hidden',
    animate ? 'win-animate' : '',
    minimizing ? 'win-minimizing' : ''
  ].join(' ').trim()

  return (
    <Rnd
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
        if (minimizing) {
          setMinimizing(false)
          setMinimized(true)
          onMinimize?.()
        }
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
      <div className="p-4 h-[calc(100%-44px)] overflow-auto">{children}</div>
    </Rnd>
  )
}
