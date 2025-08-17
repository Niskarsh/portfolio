'use client'
import { useEffect, useRef, useState } from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa6'
import { MdFileDownload, MdDarkMode, MdLightMode } from 'react-icons/md'
import { MdBatteryChargingFull, MdBattery0Bar, MdBattery1Bar, MdBattery2Bar, MdBattery3Bar, MdBattery4Bar, MdBattery5Bar, MdBattery6Bar } from 'react-icons/md'
import useBattery from './useBattery'
import { useTheme } from '@/components/Theme/ThemeProvider'

function clock(d: Date) {
  const mon = d.toLocaleString(undefined, { month: 'short' })
  const day = d.getDate().toString().padStart(2, '0')
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  return `${mon} ${day} ${h}:${m}`
}
function BatteryGlyph({ pct, charging }:{ pct:number, charging:boolean }) {
  if (charging) return <MdBatteryChargingFull size={18} />
  if (pct <= 5) return <MdBattery0Bar size={18} />
  if (pct <= 15) return <MdBattery1Bar size={18} />
  if (pct <= 30) return <MdBattery2Bar size={18} />
  if (pct <= 45) return <MdBattery3Bar size={18} />
  if (pct <= 60) return <MdBattery4Bar size={18} />
  if (pct <= 80) return <MdBattery5Bar size={18} />
  return <MdBattery6Bar size={18} />
}

export default function TopBar({ onOpenChat }:{ onOpenChat: () => void }) {
  const [time, setTime] = useState('')
  const [open, setOpen] = useState(false)
  const { level, charging } = useBattery()
  const { theme, toggle } = useTheme()
  const pct = Math.round((level || 1) * 100)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { const f = () => setTime(clock(new Date())); f(); const id = setInterval(f,1000); return () => clearInterval(id) }, [])
  useEffect(() => { const h = (e:MouseEvent) => { if (!ref.current) return; if (!ref.current.contains(e.target as Node)) setOpen(false) }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h) }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-12 px-4 flex items-center justify-between bg-black/55 backdrop-blur border-b border-[var(--border)] z-50">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Activities</span>
        <span className="text-sm text-[var(--subtle)]">Portfolio OS</span>
      </div>

      <div className="text-sm">{time}</div>

      <div className="relative flex items-center gap-2" ref={ref}>
        <a href="https://github.com/your-handle" target="_blank" className="w-9 h-9 grid place-items-center rounded-xl bg-white/10 hover:bg-white/20"><FaGithub size={18}/></a>
        <a href="https://www.linkedin.com/in/your-handle" target="_blank" className="w-9 h-9 grid place-items-center rounded-xl bg-white/10 hover:bg-white/20"><FaLinkedin size={18}/></a>

        <button onClick={()=>setOpen(o=>!o)} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-[var(--border)]">
          <BatteryGlyph pct={pct} charging={charging}/><span className="text-sm">{pct||100}%</span>
        </button>

        {open && (
          <div className="absolute right-0 top-12 w-[420px] rounded-2xl bg-[var(--panel)] border border-[var(--border)] shadow-yaru p-3 z-[60]">
            {/* pointer arrow */}
            <div className="absolute -top-2 right-6 w-3 h-3 rotate-45 bg-[var(--panel)] border-l border-t border-[var(--border)]"></div>
            <div className="grid grid-cols-2 gap-2">
              {/* GNOME-like theme pill */}
              <button onClick={toggle} className="col-span-2 flex items-center justify-between px-3 py-2 rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] hover:bg-[var(--hover)]">
                <div className="flex items-center gap-3">
                  {theme==='dark' ? <MdDarkMode/> : <MdLightMode/>}
                  <div className="text-left">
                    <div className="text-sm font-medium">{theme==='dark' ? 'Dark Style' : 'Light Style'}</div>
                    <div className="text-xs text-[var(--subtle)]">Toggle theme</div>
                  </div>
                </div>
                <div className="text-xs px-2 py-1 rounded-full bg-white/10 border border-[var(--border)]">{theme}</div>
              </button>

              <a href="/Niskarsh_Resume.pdf" download className="flex items-center justify-between px-3 py-2 rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] hover:bg-[var(--hover)]">
                <div className="text-sm">Résumé</div><MdFileDownload/>
              </a>
              <button onClick={onOpenChat} className="flex items-center justify-between px-3 py-2 rounded-2xl border border-[var(--border)] bg-[var(--brand)] text-black font-medium hover:brightness-110">
                Talk to my AI Avatar<span>→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
