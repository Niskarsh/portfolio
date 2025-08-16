'use client'
import { useEffect, useRef, useState } from 'react'
import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6'
import { MdEmail, MdFileDownload } from 'react-icons/md'

function formatClock(d: Date) {
  const month = d.toLocaleString(undefined, { month: 'short' })
  const day = d.getDate().toString().padStart(2, '0')
  const hh = d.getHours().toString().padStart(2, '0')
  const mm = d.getMinutes().toString().padStart(2, '0')
  return `${month} ${day} ${hh}:${mm}`
}

export default function TopBar({ onOpenChat }: { onOpenChat: () => void }) {
  const [time, setTime] = useState<string>('')
  const [openMenu, setOpenMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => { const tick = () => setTime(formatClock(new Date())); tick(); const id = setInterval(tick, 1000); return () => clearInterval(id) }, [])
  useEffect(() => { const onDoc = (e: MouseEvent) => { if (!menuRef.current) return; if (!menuRef.current.contains(e.target as Node)) setOpenMenu(false) }
                    document.addEventListener('mousedown', onDoc); return () => document.removeEventListener('mousedown', onDoc) }, [])

  const socials = [
    { id:'gh', label:'GitHub', href:'https://github.com/your-handle', icon:<FaGithub/> },
    { id:'li', label:'LinkedIn', href:'https://www.linkedin.com/in/your-handle', icon:<FaLinkedin/> },
    { id:'tw', label:'X / Twitter', href:'https://x.com/your-handle', icon:<FaXTwitter/> },
    { id:'em', label:'Email', href:'mailto:you@example.com', icon:<MdEmail/> },
  ]

  return (
    <div className="fixed top-0 left-0 right-0 h-12 px-3 flex items-center justify-between bg-black/40 backdrop-blur border-b border-white/10 z-50">
      <div className="flex items-center gap-3"><span className="text-sm font-medium">Activities</span><span className="text-sm text-white/80">Portfolio OS</span></div>
      <div className="text-sm">{time}</div>
      <div className="relative" ref={menuRef}>
        <button onClick={() => setOpenMenu(v=>!v)} className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 transition text-sm">few social icons +</button>
        {openMenu && (
          <div className="absolute right-0 mt-2 w-[360px] rounded-2xl bg-[var(--ubuntu-panel)] border border-white/10 shadow-yaru p-3">
            <div className="grid grid-cols-2 gap-2">
              {socials.map(s => (
                <a key={s.id} href={s.href} target="_blank" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10">
                  <span className="text-xl">{s.icon}</span><span className="text-sm">{s.label}</span>
                </a>
              ))}
              <a href="/Niskarsh_Resume.pdf" download className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10">
                <MdFileDownload className="text-xl" /><span className="text-sm">Download Résumé</span>
              </a>
              <button onClick={onOpenChat} className="flex items-center justify-center gap-3 px-3 py-2 rounded-xl bg-ubuntu-orange text-black font-medium hover:brightness-110 col-span-2">
                Talk to my AI Avatar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
