'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd'

const TOP_BAR_FALLBACK = 48

type Size = { w:number, h:number }
type Pos  = { x:number, y:number }

export default function Window(props:{
  id:number,
  title:string, z:number, onFocus:()=>void,
  onClose?:()=>void, onMinimize?:()=>void, onRestore?:()=>void, onMaximize?:()=>void,
  default?:{x:number,y:number,w:number,h:number},
  maximized?:boolean, minimized?:boolean,
  icon?:React.ReactNode, children:React.ReactNode,
  dockTargetId: string,
  registerMinimizer: (id:number, fn:(dockEl:HTMLElement)=>void)=>void
}) {
  const {
    id, title, children, onClose, onFocus,
    onMinimize, onMaximize, z, icon,
    dockTargetId, registerMinimizer
  } = props

  const def = props.default ?? { x: 220, y: 160, w: 880, h: 620 }

  const [pos,  setPos]  = useState<Pos>({ x: def.x, y: def.y })
  const [size, setSize] = useState<Size>({ w: def.w, h: def.h })
  const [maxed, setMaxed] = useState<boolean>(!!props.maximized)
  const [minimized, setMinimized] = useState<boolean>(!!props.minimized)

  // animation flags
  const [spawning, setSpawning]   = useState(true)
  const [restoring, setRestoring] = useState(false)
  const [animate, setAnimate]     = useState(false)
  const [dragging, setDragging]   = useState(false)

  const prevMinRef  = useRef(minimized)
  const rndRef      = useRef<Rnd>(null)
  const outerRef    = useRef<HTMLElement | null>(null)
  const frameRef    = useRef<HTMLDivElement | null>(null)
  const minAnimRef  = useRef<Animation | null>(null)
  const normalRef   = useRef<{ pos:Pos, size:Size }>({ pos:{...pos}, size:{...size} })

  // ---- helpers --------------------------------------------------------------
  const getTopBarHeight = () =>
    document.getElementById('topbar')?.offsetHeight ?? TOP_BAR_FALLBACK

  const getViewport = () => {
    const vh = (window.visualViewport?.height ?? document.documentElement.clientHeight)
    const vw = (window.visualViewport?.width  ?? document.documentElement.clientWidth)
    return { vw, vh }
  }

  const applyFullBleed = () => {
    const { vh, vw } = getViewport()
    const bar = getTopBarHeight()
    setPos({ x: 0, y: bar })
    setSize({ w: vw, h: Math.max(260, vh - bar) })
  }

  useEffect(()=> setMinimized(!!props.minimized), [props.minimized])
  useEffect(()=> setMaxed(!!props.maximized),     [props.maximized])

  // capture outer node for geometry
  useLayoutEffect(() => {
    const el =
      (rndRef.current as any)?.resizableElement?.current as HTMLElement
      || (rndRef.current as any)?.getSelfElement?.() as HTMLElement
    outerRef.current = el ?? null
  }, [])

  // center on first open
  useLayoutEffect(() => {
    const { vw, vh } = getViewport()
    const bar = getTopBarHeight()
    setPos({
      x: Math.max(16, Math.round((vw - size.w)/2)),
      y: Math.max(bar, Math.round((vh - size.h)/2)),
    })
    const t = setTimeout(()=>setSpawning(false), 420)
    return ()=>clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // trigger restore anim when minimized -> false
  useEffect(() => {
    if (prevMinRef.current && !minimized) setRestoring(true)
    prevMinRef.current = minimized
  }, [minimized])

  // clear WAAPI residue before restore
  useEffect(() => {
    if (!restoring) return
    const frame = frameRef.current
    if (!frame) return
    frame.getAnimations().forEach(a => a.cancel())
    frame.style.transform = ''
    frame.style.opacity   = ''
    void frame.offsetWidth
  }, [restoring])

  // keep maximized responsive (resize, zoom, soft-keyboard, etc.)
  useEffect(() => {
    if (!maxed) return
    const onR = () => applyFullBleed()
    onR()
    window.addEventListener('resize', onR)
    window.visualViewport?.addEventListener('resize', onR)
    window.visualViewport?.addEventListener('scroll', onR)
    return () => {
      window.removeEventListener('resize', onR)
      window.visualViewport?.removeEventListener('resize', onR)
      window.visualViewport?.removeEventListener('scroll', onR)
    }
  }, [maxed])

  // drag/resize
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

  // ---- minimize to dock (single vector) ------------------------------------
  const runMinimize = (dockEl: HTMLElement) => {
    const outer = outerRef.current
    const frame = frameRef.current
    if (!outer || !frame) return

    frame.getAnimations().forEach(a => a.cancel())
    minAnimRef.current?.cancel()

    const wr = outer.getBoundingClientRect()
    const ir = dockEl.getBoundingClientRect()
    const dx = (ir.left + ir.width/2) - (wr.left + wr.width/2)
    const dy = (ir.top  + ir.height/2) - (wr.top  + wr.height/2)

    setRestoring(false); setSpawning(false)

    minAnimRef.current = frame.animate(
      [
        { transform: 'translate3d(0,0,0)',               opacity: 1 },
        { transform: `translate3d(${dx}px, ${dy}px, 0)`, opacity: 0 }
      ],
      { duration: 260, easing: 'cubic-bezier(.25,.8,.25,1)', fill: 'forwards' }
    )
    minAnimRef.current.finished.then(() => {
      setMinimized(true)
      onMinimize?.()
    }).catch(()=>{})
  }

  // dock trigger
  useEffect(() => {
    registerMinimizer(id, (dockEl: HTMLElement) => runMinimize(dockEl))
  }, [id, registerMinimizer])

  // header minimize
  const handleMinimize = () => {
    const iconEl = document.getElementById(dockTargetId) as HTMLElement | null
    if (iconEl) runMinimize(iconEl)
  }

  // toggle maximize (full-bleed under top bar)
  const handleMaximize = () => {
    setAnimate(true)
    if (maxed) {
      const { pos: p, size: s } = normalRef.current
      setMaxed(false); setPos({ ...p }); setSize({ ...s })
    } else {
      normalRef.current = { pos: { ...pos }, size: { ...size } }
      setMaxed(true)
      applyFullBleed()
    }
    onMaximize?.(); setTimeout(() => setAnimate(false), 420)
  }

  return (
    <Rnd
      ref={rndRef}
      position={{ x: pos.x, y: pos.y }}
      size={{ width: size.w, height: size.h }}
      bounds="window"
      dragHandleClassName="win-drag"
      enableResizing={!maxed}
      disableDragging={maxed}
      onDragStart={() => setDragging(true)}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      className={`yaru-window ${animate ? 'win-animate' : ''}`}
      style={{ zIndex: z, display: minimized ? 'none' : undefined }}
      onMouseDown={onFocus}
    >
      <div
        ref={frameRef}
        className={[
          'win-frame',
          spawning  ? 'win-spawn'   : '',
          restoring ? 'win-restore' : '',
        ].join(' ')}
        onAnimationEnd={(e) => {
          if (e.animationName === 'winSpawn') {
            if (spawning)  setSpawning(false)
            if (restoring) setRestoring(false)
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
        <div className="p-4 h-[calc(100%-44px)] overflow-auto">
          {children}
        </div>
      </div>
    </Rnd>
  )
}
