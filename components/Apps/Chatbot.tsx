'use client'
import { useChat } from '@ai-sdk/react'
import { useEffect, useRef } from 'react'
export default function Chatbot() {
  const { messages, input, setInput, handleSubmit, isLoading } = useChat({ api: '/api/chat' })
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => { ref.current?.scrollTo(0, ref.current.scrollHeight) }, [messages])
  return (
    <div className="flex flex-col h-full">
      <div ref={ref} className="flex-1 overflow-auto space-y-4">
        {messages.map(m => (
          <div key={m.id} className={m.role === 'user' ? 'text-right' : ''}>
            <div className="inline-block px-3 py-2 rounded-xl bg-white/10 border border-white/15">
              {m.parts?.map((p:any, i:number) => p.type === 'text' ? <span key={i}>{p.text}</span> : null)}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 outline-none"
          value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Ask my AI Avatar anything…" />
        <button disabled={isLoading} className="px-4 py-2 rounded-lg bg-ubuntu-orange text-black font-medium disabled:opacity-60">{isLoading ? '…' : 'Send'}</button>
      </form>
      <p className="text-xs text-white/60 mt-2">I’ll share my Calendly when you want to book.</p>
    </div>
  )
}
