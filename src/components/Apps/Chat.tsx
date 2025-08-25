// @/components/Apps/Chat.tsx
'use client'
import { useEffect, useRef, useState } from 'react'

type Msg = { role: 'user' | 'assistant'; content: string }

export default function Chat() {
  // keep literals narrow from the start
  const [messages, setMessages] = useState<Msg[]>(() => [
    { role: 'assistant', content: "Hi—I'm Niskarsh’s AI. Ask me about my work, stack, or projects." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async () => {
    if (!input.trim()) return

    // ---- keep union literal, avoid widening ----
    const userMsg: Msg = { role: 'user', content: input }
    const next: Msg[] = [...messages, userMsg]

    setMessages(next)
    setInput('')
    setLoading(true)

    const res = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: next }),
    })
    const data = await res.json()

    const assistantMsg: Msg = { role: 'assistant', content: String(data.text ?? '') }
    setMessages([...next, assistantMsg])
    setLoading(false)
  }

  return (
    // Fill parent window and force readable foreground (with fallbacks)
    <div className="h-full w-full min-h-0 min-w-0 flex flex-col
                    text-[color:var(--fg,#e5e7eb)] selection:bg-[color:var(--brand,#ff6a00)]/30">

      {/* Messages */}
      <main className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3
                       bg-[color:var(--panel,#0f1115)]">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={`inline-block rounded-2xl px-3 py-2 shadow
              ${m.role==='user'
                ? 'bg-[color:var(--fg,#e5e7eb)] text-[color:var(--panel,#0f1115)]'
                : 'bg-[color:var(--panel-2,#171a21)] text-[color:var(--fg,#e5e7eb)]'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-sm text-[color:var(--subtle,#9ca3af)]">typing…</div>}
        <div ref={endRef} />
      </main>

      {/* Composer */}
      <footer className="p-3 border-t border-[color:var(--border,#2a2f3a)]
                         bg-[color:var(--panel,#0f1115)] flex gap-2">
        <input
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          onKeyDown={(e)=>e.key==='Enter' && send()}
          placeholder="Ask about experience, stack, projects…"
          className="flex-1 rounded-xl px-3 py-2 outline-none appearance-none
                     bg-[color:var(--panel-2,#171a21)]
                     !text-[color:var(--fg,#e5e7eb)]
                     border border-[color:var(--border,#2a2f3a)]
                     placeholder:!text-[color:var(--subtle,#9ca3af)]
                     focus:ring-2 ring-[color:var(--brand,#ff6a00)]/60"
          style={{
            color: 'var(--fg, #e5e7eb)',
            WebkitTextFillColor: 'var(--fg, #e5e7eb)',
            caretColor: 'var(--fg, #e5e7eb)',
          }}
          autoComplete="off"
        />
        <button
          onClick={send}
          disabled={loading}
          className="px-4 py-2 rounded-xl font-semibold
                     bg-[color:var(--brand,#ff6a00)] text-black disabled:opacity-50">
          Send
        </button>
      </footer>
    </div>
  )
}
