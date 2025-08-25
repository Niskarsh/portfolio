export default function Work(){
    const roles=[
      { company:'Proof Of Skill', title:'Senior Product Architect', range:'2024 — Present',
        bullets:[
          'Led a cross-functional team of 5 engineers.',
          'Owned end-to-end product architecture.',
          'Accelerated engineering with AI agents/tools: DevinAI, ChatGPT, Jazzberry AI',
          'Implemented realtime voicebot for language evaluation: OpenAI Realtime',
          'Phone calling agent for evaluations — Vapi AI + Twilio + Gemini 2.0 Flash (async)',
          'Performance hardening of read models: >9 s → <2 s worst case (≥78% faster), ~1s on average (≥89% faster).',
          'Designed the platform’s unified logging architecture and oversaw adoption across all apps',
          'On-chain audit trail for platform actions(Monad)',
          'Robust live video streaming (screen & camera upload; survives page refresh/crashes)(for proctoring) — Amazon IVS + EventBridge + MediaConvert + Lambda + S3',
          'Edge traffic split & routing for experiments — Cloudflare Workers (50/50 subdomain steering)',
          'Harden config & secrets — AWS Secrets Manager',
        ]},
      { company:'School Of Accelerated Learning', title:'Full Stack Developer', range:'2019 — 2024', bullets:[
        'Beckn partnership (BPP + provider app) - React.js + Node.js/Express, PostgreSQL, Redis, Beckn protocol.',
        'Learner platform (DELTA) backend - Node.js/Express, PostgreSQL/MongoDB, Redis.',
        'WhatsApp notifications - Node.js/Express, WhatsApp Business Platform, Webhooks.',
        'Payments - Node.js/Express, Instamojo API, Webhooks',
        'Ops messaging - Node.js/Express, Slack Web API',
        'Learner code signals - React.js + Node.js/Express, GitHub REST API',
        'Test platform UI - React.js + TypeScript',
        'Admin Platform UI - React.js + TypeScript',
      ]},
    ]
    return (
      <ol className="relative border-s border-[var(--border)] ms-4">
        {roles.map((r, idx) => (
          <li key={idx} className="mb-8 ms-6">
            <span className="absolute -start-3.5 mt-1.5 w-3 h-3 rounded-full bg-[var(--brand)] border border-[var(--border)]" />
            <h3 className="font-semibold">{r.title} • {r.company}</h3>
            <div className="text-sm text-[var(--subtle)]">{r.range}</div>
            <ul className="list-disc ms-5 mt-1 text-sm space-y-1">{r.bullets.map((b,i)=>(<li key={i}>{b}</li>))}</ul>
          </li>
        ))}
      </ol>
    )
  }
  