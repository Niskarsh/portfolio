// app/page.tsx
'use client'
import Wallpaper from '@/components/DesktopShell/Wallpaper'
import TopBar from '@/components/DesktopShell/TopBar'
import WindowManager from '@/components/DesktopShell/WindowManager'
import Dock from '@/components/DesktopShell/Dock'

export default function Page(){
  const wm = WindowManager()
  return (
    <main className="relative h-dvh w-dvw overflow-hidden">
      <Wallpaper/>
      <TopBar onOpenChat={() => wm.onDockClick('chat')} />  {/* ← change 'about' → 'chat' */}
      <Dock counts={wm.counts} onDockClick={wm.onDockClick} />
      {wm.wins.map(w => wm.render(w))}
    </main>
  )
}
