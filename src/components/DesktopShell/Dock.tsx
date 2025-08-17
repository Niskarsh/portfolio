'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { VscFiles } from 'react-icons/vsc'
import { MdWorkHistory, MdPerson } from 'react-icons/md'

export type Kind = 'projects' | 'work' | 'about'

type Props = {
  counts: Record<Kind, number>
  onDockClick: (t: Kind) => void
}

type T = { s: number; tx: number; ty: number; rot: number }
type Pt = { x: number; y: number } | null

export default function Dock({ counts, onDockClick }: Props) {
  // items
  const items = useMemo(
    () => [
      { id: 'projects' as Kind, label: 'Projects', icon: <VscFiles size={28} /> },
      { id: 'work' as Kind, label: 'Work', icon: <MdWorkHistory size={28} /> },
      { id: 'about' as Kind, label: 'About', icon: <MdPerson size={28} /> },
    ],
    [],
  )

  // refs
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const itemWrapRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const curRef = useRef<Record<string, T>>({})
  const tgtRef = useRef<Record<string, T>>({})
  const mouse = useRef<Pt>(null)
  const rafId = useRef<number | null>(null)

  // ---- tuning (YOUR values) ----
  const SIGMA           = 30       // spread of influence (px)
  const VICINITY_BAND   = 140      // px above dock where it activates
  const HOVER_SCALE     = 1.2     // scale when pointer is over an icon
  const NEAR_SCALE      = 1.2     // scale for neighbors when near but not over
  const LIFT_HOVER      = 10       // px up on hover
  const LIFT_NEAR       = 3        // px up when near but not over
  const PUSH_NEAR_TOWARD= 16        // px nudge TOWARD cursor when near (subtle)
  const TILT_DEG        = 20      // deg tilt away from cursor when near
  const FOLLOW          = 0.18     // smoothing (lower = floatier)
  const EPS             = 0.15     // snap-to-rest epsilon for tx/ty/rot
  const EPS_SCALE       = 0.003    // snap-to-rest epsilon for (s-1)

  // init transform state once
  useEffect(() => {
    items.forEach(({ id }) => {
      curRef.current[id] = { s: 1, tx: 0, ty: 0, rot: 0 }
      tgtRef.current[id] = { s: 1, tx: 0, ty: 0, rot: 0 }
    })
  }, [items])

  // global pointer listener
  useEffect(() => {
    const onMove = (e: PointerEvent | MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    const onLeave = () => {
      mouse.current = null
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
    }
  }, [])

  // helpers
  const inVicinity = (pt: Pt) => {
    const box = wrapRef.current?.getBoundingClientRect()
    if (!pt || !box) return false
    const topBand = box.top - VICINITY_BAND
    const bottomBand = box.bottom + 24
    return (
      pt.y >= topBand &&
      pt.y <= bottomBand &&
      pt.x >= box.left - 60 &&
      pt.x <= box.right + 60
    )
  }

  const isOver = (pt: Pt, el: HTMLElement | null) => {
    if (!pt || !el) return false
    const r = el.getBoundingClientRect()
    const PAD = 4
    return pt.x >= r.left - PAD && pt.x <= r.right + PAD && pt.y >= r.top - PAD && pt.y <= r.bottom + PAD
  }

  // compute targets from pointer
  const computeTargets = () => {
    const pt = mouse.current
    const active = inVicinity(pt)

    items.forEach(({ id }) => {
      const btn = btnRefs.current[`dock-btn-${id}`]
      let t: T = { s: 1, tx: 0, ty: 0, rot: 0 }

      if (active && btn && pt) {
        const r = btn.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const dx = pt.x - cx
        const dist = Math.abs(dx)
        const dir = Math.sign(dx) // -1 left, 1 right

        if (isOver(pt, btn)) {
          // directly over icon: lift + expand only
          t.s = HOVER_SCALE
          t.ty = -LIFT_HOVER
        } else {
          // near but not over: subtle neighbor effect — tilt away, nudge toward cursor
          const strength = Math.exp(-(dist * dist) / (2 * SIGMA * SIGMA)) // 0..1
          t.s = 1 + (NEAR_SCALE - 1) * strength
          t.ty = -LIFT_NEAR * strength
          t.tx = -(dir !== 0 ? dir : 0) * PUSH_NEAR_TOWARD * strength // toward cursor
          t.rot = (dir !== 0 ? dir : 0) * TILT_DEG * strength // away (your negative value respected)
        }
      }
      tgtRef.current[id] = t
    })
  }

  // rAF loop — ease cur → tgt and write transform on the WRAPPER (dots + icon move together)
  useEffect(() => {
    const step = () => {
      computeTargets()

      items.forEach(({ id }) => {
        const cur = curRef.current[id]
        const tgt = tgtRef.current[id]

        cur.s += (tgt.s - cur.s) * FOLLOW
        cur.tx += (tgt.tx - cur.tx) * FOLLOW
        cur.ty += (tgt.ty - cur.ty) * FOLLOW
        cur.rot += (tgt.rot - cur.rot) * FOLLOW

        // snap tiny values to rest to prevent jitter
        if (Math.abs(cur.s - 1) < EPS_SCALE) cur.s = 1
        if (Math.abs(cur.tx) < EPS) cur.tx = 0
        if (Math.abs(cur.ty) < EPS) cur.ty = 0
        if (Math.abs(cur.rot) < 0.08) cur.rot = 0

        const w = itemWrapRefs.current[`dock-wrap-${id}`]
        if (w) {
          w.style.transformOrigin = 'bottom center'
          w.style.willChange = 'transform'
          w.style.transform = `translate3d(${cur.tx}px, ${cur.ty}px, 0) scale(${cur.s}) rotate(${cur.rot}deg)`
        }
      })

      rafId.current = requestAnimationFrame(step)
    }

    rafId.current = requestAnimationFrame(step)
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [items])

  // ---------- RENDER ----------
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[50vw] max-w-[1100px]">
      <div
        ref={wrapRef}
        className="pointer-events-auto rounded-3xl border border-[var(--border)] bg-black/45 backdrop-blur-xl shadow-yaru px-5 py-3"
      >
        <div className="flex items-end justify-center gap-8">
          {items.map((it) => {
            const count = counts[it.id] ?? 0
            const running = count > 0
            const dots = Math.min(count, 3)

            return (
              <div
                key={it.id}
                ref={(el) => {
                  itemWrapRefs.current[`dock-wrap-${it.id}`] = el
                }}
                role="button"
                tabIndex={0}
                onClick={() => onDockClick(it.id)} // wrapper handles clicks (dots + icon)
                className="flex flex-col items-center focus:outline-none select-none"
              >
                {/* dots ABOVE the icon (travel with wrapper) */}
                <div className="mb-1 h-1.5 flex gap-1.5">
                  {Array.from({ length: dots }).map((_, j) => (
                    <span key={j} className="w-1.5 h-1.5 rounded-full bg-white/70" />
                  ))}
                </div>

                <button
                  id={`dock-btn-${it.id}`}
                  ref={(el) => {
                    btnRefs.current[`dock-btn-${it.id}`] = el
                  }}
                  type="button"
                  aria-label={it.label}
                  title={it.label}
                  className={`w-14 h-14 rounded-2xl grid place-items-center text-white border ${
                    running ? 'bg-white/15 border-white/25' : 'bg-white/8 border-white/10 hover:bg-white/15'
                  }`}
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
