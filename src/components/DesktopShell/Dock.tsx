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

  // Compute scale for each icon based on distance to cursor (mac-like magnification)
  const scaleFor = (id: Kind) => {
    const base = 1
    if (mouseX == null) return base
    const btn = btnRefs.current[`dock-btn-${id}`]
    if (!btn) return base
    const r = btn.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const dist = Math.abs(mouseX - cx)
    const sigma = 80 // spread; smaller = tighter pop
    const gain = 0.45 // how big the main pop gets
    return base + gain * Math.exp(-(dist*dist)/(2*sigma*sigma))
  }

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[50vw] max-w-[1100px]">
      <div ref={containerRef} className="pointer-events-auto rounded-3xl border border-[var(--border)] bg-black/45 backdrop-blur-xl shadow-yaru px-5 py-3">
        <div className="flex items-end justify-center gap-6">
          {items.map(it => {
            const count = counts[it.id] ?? 0
            const running = count > 0
            const dots = Math.min(count, 3)
            const scale = scaleFor(it.id)

            return (
              <div key={it.id} className="flex flex-col items-center">
                {/* dots ABOVE */}
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
                  className={`w-14 h-14 rounded-2xl grid place-items-center transition text-white border ${
                    running ? 'bg-white/15 border-white/25' : 'bg-white/8 border-white/10 hover:bg-white/15'
                  }`}
                  style={{ transform: `translateZ(0) scale(${scale})`, transition: 'transform 120ms cubic-bezier(.2,.8,.2,1)' }}
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
