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
      <TopBar onOpenChat={() => wm.onDockClick('about')} />
      <Dock
        counts={wm.counts}
        spawn={() => {}}
        onDockClick={wm.onDockClick}
        mediumUrl={process.env.NEXT_PUBLIC_MEDIUM_URL || 'https://medium.com/@your-handle'}
      />
      {wm.wins.map(w => wm.render(w))}
    </main>
  )
}
