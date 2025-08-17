'use client'
import { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react'
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd'

type Size = { w:number, h:number }
type Pos  = { x:number, y:number }

const EDGE_PAD = 16
const TOPBAR_FALLBACK = 48

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

  // geometry state (these actually render)
  const [pos,  setPos]  = useState<Pos>({ x: def.x, y: def.y })
  const [size, setSize] = useState<Size>({ w: def.w, h: def.h })
  const [minimized, setMinimized] = useState<boolean>(!!props.minimized)

  // refs (source of truth)
  const maxedRef = useRef<boolean>(!!props.maximized)        // <- requested: ref, not state
  const prevMinRef = useRef(minimized)
  const normalRef  = useRef<{ pos:Pos, size:Size }>({ pos:{...pos}, size:{...size} })

  // animation bits
  const [spawning, setSpawning] = useState(true)
  const [restoring, setRestoring] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [dragging, setDragging] = useState(false)

  // force re-render when we flip maxedRef so RND props update
  const [, force] = useReducer((x:number)=>x+1, 0)

  // dom refs
  const rndRef   = useRef<Rnd>(null)
  const outerRef = useRef<HTMLElement | null>(null)     // RND self element (has transform)
  const frameRef = useRef<HTMLDivElement | null>(null)  // inner visual frame
  const minAnimRef = useRef<Animation | null>(null)

  // helpers
  const getTopbar = () =>
    parseInt(getComputedStyle(document.documentElement).getPropertyValue('--topbar-h')) ||
    document.getElementById('topbar')?.offsetHeight ||
    TOPBAR_FALLBACK

  const getViewport = () => ({
    vw: (window.visualViewport?.width  ?? document.documentElement.clientWidth),
    vh: (window.visualViewport?.height ?? document.documentElement.clientHeight),
  }) // visualViewport avoids mobile UI quirks. :contentReference[oaicite:2]{index=2}

  const applyFullBleed = () => {
    const { vw, vh } = getViewport()
    const bar = getTopbar()
    setPos({ x: 0, y: bar })
    setSize({ w: vw, h: Math.max(260, vh - bar) })
    // also make the RND node full-bleed (neutralize transform)
    outerRef.current?.classList.add('rnd-full')
  }

  const removeFullBleed = () => {
    outerRef.current?.classList.remove('rnd-full')
  }

  // capture RND outer node
  useLayoutEffect(() => {
    const el =
      (rndRef.current as any)?.resizableElement?.current as HTMLElement
      || (rndRef.current as any)?.getSelfElement?.() as HTMLElement
    outerRef.current = el ?? null
    // honor initial maximize from props
    if (maxedRef.current) {
      applyFullBleed()
    }
  }, [])

  // center on first open
  useLayoutEffect(() => {
    if (maxedRef.current) return
    const { vw, vh } = getViewport()
    const bar = getTopbar()
    setPos({
      x: Math.max(EDGE_PAD, Math.round((vw - size.w)/2)),
      y: Math.max(bar,      Math.round((vh - size.h)/2)),
    })
    const t = setTimeout(()=>setSpawning(false), 420)
    return ()=>clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // sync minimized from props
  useEffect(()=> setMinimized(!!props.minimized), [props.minimized])

  // detect restore transition (minimized -> false)
  useEffect(() => {
    if (prevMinRef.current && !minimized) setRestoring(true)
    prevMinRef.current = minimized
  }, [minimized])

  // clean up any WAAPI residue before restore anim
  useEffect(() => {
    if (!restoring) return
    const frame = frameRef.current
    if (!frame) return
    frame.getAnimations().forEach(a => a.cancel())
    frame.style.transform = ''; frame.style.opacity = ''
    void frame.offsetWidth
  }, [restoring])

  // keep maximized responsive without relying on stale state (checks ref)
  useEffect(() => {
    const onR = () => { if (maxedRef.current) applyFullBleed() }
    window.addEventListener('resize', onR)
    window.visualViewport?.addEventListener('resize', onR)
    window.visualViewport?.addEventListener('scroll', onR)
    return () => {
      window.removeEventListener('resize', onR)
      window.visualViewport?.removeEventListener('resize', onR)
      window.visualViewport?.removeEventListener('scroll', onR)
    }
  }, [])

  // react-rnd handlers
  const onDragStop: RndDragCallback = (_e, d) => {
    setDragging(false)
    setPos({ x: d.x, y: d.y })
    if (!maxedRef.current) normalRef.current.pos = { x: d.x, y: d.y }
  }
  const onResizeStop: RndResizeCallback = (_e, _dir, ref, _delta, position) => {
    const s = { w: ref.offsetWidth, h: ref.offsetHeight }
    const p = { x: position.x, y: position.y }
    setSize(s); setPos(p)
    if (!maxedRef.current) normalRef.current = { size: s, pos: p }
  }

  // minimize to dock (single vector)
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

    setSpawning(false); setRestoring(false)

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

  useEffect(() => {
    props.registerMinimizer(id, (dockEl: HTMLElement) => runMinimize(dockEl))
  }, [id, props.registerMinimizer])

  const handleMinimize = () => {
    const el = document.getElementById(props.dockTargetId) as HTMLElement | null
    if (el) runMinimize(el)
  }

  // === ref-based maximize toggle ============================================
  const setMaximized = (next:boolean, withAnim=true) => {
    if (maxedRef.current === next) return
    maxedRef.current = next
    if (withAnim) { setAnimate(true); setTimeout(()=>setAnimate(false), 420) }

    if (next) {
      // remember normal size/pos before going full-bleed
      normalRef.current = { pos: { ...pos }, size: { ...size } }
      applyFullBleed()
    } else {
      removeFullBleed()
      const { pos: p, size: s } = normalRef.current
      setPos({ ...p }); setSize({ ...s })
    }
    onMaximize?.()
    force() // re-render so RND props (drag/resize flags) reflect new state
  }

  const handleMaximize = () => setMaximized(!maxedRef.current, true)

  return (
    <div className="win-content">
    <Rnd
      ref={rndRef}
      // Position/size always driven from state; .rnd-full overrides when maxed
      position={{ x: pos.x, y: pos.y }}
      size={{ width: size.w, height: size.h }}
      bounds="window"
      dragHandleClassName="win-drag"
      enableResizing={!maxedRef.current}
      disableDragging={maxedRef.current}
      onDragStart={() => setDragging(true)}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      className={`yaru-window ${animate ? 'win-animate' : ''} ${maxedRef.current ? 'rnd-full' : ''}`}
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
    </div>
  )
}
