'use client'
import { useMemo, useRef, useState } from 'react'
import Window from './Window'
import Projects from '@/components/Apps/Projects'
import Work from '@/components/Apps/Work'
import About from '@/components/Apps/About'
import { VscFiles } from 'react-icons/vsc'
import { MdWorkHistory, MdPerson } from 'react-icons/md'

export type Kind = 'projects' | 'work' | 'about'

type Win = {
  id: number
  kind: Kind
  title: string
  z: number
  minimized: boolean
  maximized: boolean
}

let _id = 1

export default function WindowManager() {
  const [wins, setWins] = useState<Win[]>([])
  const [zTop, setZTop] = useState(1)

  // Windows register their imperative minimize fn here (WAAPI)
  const minimizers = useRef<Map<number, (dockEl: HTMLElement) => void>>(new Map())

  const spawn = (kind: Kind) => {
    const title = { projects: 'Projects', work: 'Work Experience', about: 'About Me' }[kind]
    setWins(ws => {
      const zNew = zTop + 1
      setZTop(zNew)
      return [...ws, { id: _id++, kind, title, z: zNew, minimized: false, maximized: false }]
    })
  }

  const focus = (id: number) => {
    setZTop(z => {
      const zNew = z + 1
      setWins(ws => ws.map(w => (w.id === id ? { ...w, z: zNew } : w)))
      return zNew
    })
  }

  const close = (id: number) => setWins(ws => ws.filter(w => w.id !== id))
  const setMinimized = (id: number, val: boolean) =>
    setWins(ws => ws.map(w => (w.id === id ? { ...w, minimized: val } : w)))
  const toggleMax = (id: number) =>
    setWins(ws => ws.map(w => (w.id === id ? { ...w, maximized: !w.maximized, minimized: false } : w)))

  // ---- Dock click toggle (RESTORE → MINIMIZE → SPAWN) ----
  const onDockClick = (kind: Kind) => {
    setWins(prev => {
      // 1) If any minimized → restore the most recent one and bring to front
      const minimizedList = prev.filter(w => w.kind === kind && w.minimized).sort((a, b) => b.z - a.z)
      if (minimizedList.length) {
        const id = minimizedList[0].id
        const zNew = zTop + 1
        setZTop(zNew)
        return prev.map(w => (w.id === id ? { ...w, minimized: false, z: zNew } : w))
      }

      // 2) Else, if any visible → minimize the topmost via its registered WAAPI function
      const visibles = prev.filter(w => w.kind === kind && !w.minimized).sort((a, b) => b.z - a.z)
      if (visibles.length) {
        const id = visibles[0].id
        const iconEl = document.getElementById(`dock-btn-${kind}`) as HTMLElement | null
        const fn = minimizers.current.get(id)
        if (iconEl && fn) fn(iconEl)
        // Do NOT flip state here; the window will set minimized:true on animation end
        return prev
      }

      // 3) Else spawn a new window
      const zNew = zTop + 1
      setZTop(zNew)
      const title = { projects: 'Projects', work: 'Work Experience', about: 'About Me' }[kind]
      return [...prev, { id: ++_id, kind, title, z: zNew, minimized: false, maximized: false }]
    })
  }

  const counts: Record<Kind, number> = useMemo(
    () => ({
      projects: wins.filter(w => w.kind === 'projects').length,
      work: wins.filter(w => w.kind === 'work').length,
      about: wins.filter(w => w.kind === 'about').length,
    }),
    [wins],
  )

  const icon = (k: Kind) => (k === 'projects' ? <VscFiles /> : k === 'work' ? <MdWorkHistory /> : <MdPerson />)

  const render = (w: Win) => {
    const common = {
      id: w.id,
      z: w.z,
      title: w.title,
      icon: icon(w.kind),
      minimized: w.minimized,
      maximized: w.maximized,
      onFocus: () => focus(w.id),
      onClose: () => close(w.id),
      onMinimize: () => setMinimized(w.id, true), // called after WAAPI finishes
      onRestore: () => setMinimized(w.id, false),
      onMaximize: () => toggleMax(w.id),
      dockTargetId: `dock-btn-${w.kind}`,
      registerMinimizer: (id: number, fn: (dockEl: HTMLElement) => void) => {
        minimizers.current.set(id, fn)
      },
    }
    switch (w.kind) {
      case 'projects':
        return (
          <Window key={w.id} {...common}>
            <Projects username={process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'octocat'} />
          </Window>
        )
      case 'work':
        return (
          <Window key={w.id} {...common}>
            <Work />
          </Window>
        )
      case 'about':
        return (
          <Window key={w.id} {...common}>
            <About />
          </Window>
        )
    }
  }

  return { wins, render, onDockClick, counts }
}
