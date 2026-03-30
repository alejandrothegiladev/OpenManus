import { streamAgentChat } from '@/lib/ai'
import { getSession } from '@/lib/auth'
import { checkRateLimit } from '@/lib/redis'
import { db, messages } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { type NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const { allowed } = await checkRateLimit(session.userId, 60)
  if (!allowed) return new Response('Rate limit exceeded', { status: 429 })

  try {
    const { chatId, messages: clientMessages, model } = await req.json()

    if (chatId) {
      const [chat] = await db.select().from(chats)
        .where(and(eq(chats.id, chatId), eq(chats.userId, session.userId)))
        .limit(1)
      if (!chat) return new Response('Chat not found', { status: 404 })
    }

    const modelKey = model === 'llama-3.3-70b-versatile' ? 'executor' : 'planner'
    const result = streamAgentChat(clientMessages, modelKey)
    return result.toUIMessageStreamResponse({
      onFinish: async ({ text }) => {
        if (chatId && text) {
          await db.insert(messages).values({ chatId, role: 'assistant', content: text })
        }
      },
    })
  } catch (error) {
    console.error('[chat route]', error)
    return new Response('Internal server error', { status: 500 })
  }
}
