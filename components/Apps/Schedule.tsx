'use client'
import { useEffect, useRef } from 'react'
export default function Schedule({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { const s = document.createElement('script'); s.src='https://assets.calendly.com/assets/external/widget.js'; s.async=true; document.body.appendChild(s); return () => { document.body.removeChild(s) } }, [])
  return (<div><div className="mb-3 text-sm text-white/80">Book time with me directly below:</div><div ref={ref} className="calendly-inline-widget min-h-[700px]" data-url={url} style={{minWidth:'320px',height:'700px'} as any} /></div>)
}
