'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { VscFiles } from 'react-icons/vsc'
import { MdWorkHistory, MdPerson } from 'react-icons/md'

export type Kind = 'projects'|'work'|'about'

type Props = {
  counts: Record<Kind, number>
  onDockClick: (t: Kind) => void
}

export default function Dock({ counts, onDockClick }: Props) {
  const items: { id: Kind; label: string; icon: React.ReactNode }[] = useMemo(() => ([
    { id:'projects', label:'Projects', icon:<VscFiles size={28}/> },
    { id:'work',     label:'Work',     icon:<MdWorkHistory size={28}/> },
    { id:'about',    label:'About',    icon:<MdPerson size={28}/> },
  ]), [])

  const containerRef = useRef<HTMLDivElement>(null)
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const [mouseX, setMouseX] = useState<number | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const move = (e: MouseEvent) => setMouseX(e.clientX)
    const leave = () => setMouseX(null)
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave) }
  }, [])

  // Distance-based transform (Gaussian falloff) with lift + horizontal push + tilt.
  function transforms(id: Kind) {
    const baseScale = 1
    const btn = btnRefs.current[`dock-btn-${id}`]
    if (!btn || mouseX == null) return { scale: baseScale, tx: 0, ty: 0, rot: 0 }

    const r = btn.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const dx = cx - mouseX
    const dist = Math.abs(dx)

    // Tune these to taste
    const sigma = 90        // spread of the influence (px)
    const pop   = 0.55      // how large the main icon gets
    const liftY = 22        // max pixels the main icon rises
    const pushX = 28        // max pixels neighbors move away
    const tilt  = 8         // max rotation (deg)

    // 0..1 strength (Gaussian)
    const s = Math.exp(-(dist * dist) / (2 * sigma * sigma))

    // Move away from cursor horizontally; dx>0 means icon is to the right → push right
    const dir = Math.sign(dx) || 0
    const scale = baseScale + pop * s
    const ty = -liftY * s
    const tx = pushX * s * dir
    const rot = tilt * s * dir // tilt away from cursor

    return { scale, tx, ty, rot }
  }

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[50vw] max-w-[1100px]">
      <div
        ref={containerRef}
        className="pointer-events-auto rounded-3xl border border-[var(--border)] bg-black/45 backdrop-blur-xl shadow-yaru px-5 py-3"
      >
        <div className="flex items-end justify-center gap-8">
          {items.map((it) => {
            const count = counts[it.id] ?? 0
            const running = count > 0
            const dots = Math.min(count, 3)

            const { scale, tx, ty, rot } = transforms(it.id)

            return (
              <div key={it.id} className="flex flex-col items-center">
                {/* Dots ABOVE the icon */}
                <div className="mb-1 h-1.5 flex gap-1.5">
                  {Array.from({ length: dots }).map((_, i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/70" />
                  ))}
                </div>

                <button
                  id={`dock-btn-${it.id}`}
                  ref={(el) => (btnRefs.current[`dock-btn-${it.id}`] = el)}
                  type="button"
                  onClick={() => onDockClick(it.id)}
                  className={`w-14 h-14 rounded-2xl grid place-items-center text-white border ${
                    running ? 'bg-white/15 border-white/25' : 'bg-white/8 border-white/10 hover:bg-white/15'
                  }`}
                  style={{
                    transform: `translate3d(${tx}px, ${ty}px, 0) scale(${scale}) rotate(${rot}deg)`,
                    transformOrigin: 'bottom center',
                    transition: 'transform 120ms cubic-bezier(.2,.8,.2,1)',
                    willChange: 'transform',
                  }}
                  title={it.label}
                >
                  {it.icon}
                </button>

                <span className="mt-1 text-[11px] tracking-wide text-[var(--subtle)]">{it.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
