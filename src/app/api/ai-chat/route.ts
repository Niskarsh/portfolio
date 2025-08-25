// app/api/ai-chat/route.ts
import OpenAI from "openai"
import { NextRequest } from "next/server"
import { portfolioContext } from "./portfolio-context"

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  const { messages = [] } = await req.json()

  const system = `
You are Niskarsh's portfolio AI. Speak in first person ("I").
Answer ONLY from the provided context; if unsure, say you'll follow up.
Be concise, friendly, and concrete. Offer links from the context when relevant.

Context (JSON):
${JSON.stringify(portfolioContext)}
`.trim()

  const completion = await client.responses.create({
    model: "gpt-4o-mini",
    input: [{ role: "system", content: system }, ...messages]
  })

  return Response.json({ text: completion.output_text })
}
