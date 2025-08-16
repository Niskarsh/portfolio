'use client'
import { useState } from 'react'
export default function Browser() {
  const [url, setUrl] = useState('https://ubuntu.com')
  return (
    <div className="h-full flex flex-col">
      <form onSubmit={(e)=>{e.preventDefault()}} className="mb-2 flex gap-2">
        <input value={url} onChange={(e)=>setUrl(e.target.value)} className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1 outline-none" />
        <button className="px-3 py-1 rounded bg-white/10 border border-white/20">Go</button>
      </form>
      <iframe src={url} className="flex-1 rounded-lg border border-white/10" />
    </div>
  )
}
