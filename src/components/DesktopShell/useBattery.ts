'use client'
import { useEffect, useState } from 'react'
type Battery = { level: number; charging: boolean }

export default function useBattery(): Battery {
  const [s, setS] = useState<Battery>({ level: 1, charging: false })
  useEffect(() => {
    let b: any = null
    ;(async () => {
      try {
        const nav: any = navigator
        if (!nav.getBattery) { setS({ level: 1, charging: false }); return }
        b = await nav.getBattery()
        const u = () => setS({ level: b.level ?? 1, charging: !!b.charging })
        u(); b.addEventListener('levelchange', u); b.addEventListener('chargingchange', u)
      } catch { setS({ level: 1, charging: false }) }
    })()
    return () => {}
  }, [])
  return s
}
