import { openai } from '@ai-sdk/openai'
import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from 'ai'
export const maxDuration = 30
export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()
  const result = streamText({
    model: openai('gpt-4o-mini'),
    messages: convertToModelMessages([
      { role:'system', content:[{ type:'text', text:"You are Niskarsh's portfolio AI Avatar. Voice: sharp, friendly, a bit sassy but never rude. Keep answers concise unless asked to expand. Use first person ('I'). When users express interview intent or say 'book', 'schedule', 'meet', call the calendly tool. Knowledge: Proof-of-Skill eval (11s->3s); Video ingestion pipeline; Recruiter unlock flow." }]},
      ...messages
    ]),
    stopWhen: stepCountIs(3),
    tools: {
      calendly: tool({ description:'Open the Calendly booking widget when the user wants to meet', parameters:{ type:'object', properties:{ reason:{ type:'string'} } }, execute: async ({ reason }) => ({ ok:true, action:'OPEN_CALENDLY', reason }) })
    }
  })
  return result.toAIStreamResponse()
}
