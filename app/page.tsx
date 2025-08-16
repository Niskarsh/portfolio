'use client'
import Wallpaper from '../components/DesktopShell/Wallpaper'
import TopBar from '../components/DesktopShell/TopBar'
import { DefaultDock } from '../components/DesktopShell/Dock'
import WindowManager from '../components/DesktopShell/WindowManager'
import { useState } from 'react'

export default function Page() {
  const { wins, spawn, render } = WindowManager()
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <main className="relative h-dvh w-dvw overflow-hidden">
      <Wallpaper />
      <TopBar onOpenChat={() => { setChatOpen(true); spawn('chat') }} />
      <DefaultDock spawn={spawn} />
      {wins.map(w => render(w))}
    </main>
  )
}
