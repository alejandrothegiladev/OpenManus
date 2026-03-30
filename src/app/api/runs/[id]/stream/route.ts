import { getSession } from '@/lib/auth'
import { getStreamChunks } from '@/lib/redis'
import { type NextRequest } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const { id } = await params

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      // Poll Redis for chunks every 500ms, stream as SSE
      let cursor = 0
      let failedPolls = 0

      const poll = async () => {
        const chunks = await getStreamChunks(id)
        const newChunks = chunks.slice(cursor)
        cursor = chunks.length

        for (const chunk of newChunks) {
          controller.enqueue(encoder.encode(`data: ${chunk}\n\n`))
          // Check if run is done
          try {
            const parsed = JSON.parse(chunk)
            if (parsed.type === 'status' && (parsed.status === 'completed' || parsed.status === 'failed' || parsed.status === 'cancelled')) {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'))
              controller.close()
              return
            }
          } catch {}
        }

        if (failedPolls > 120) { // ~60s timeout
          controller.close()
          return
        }
        failedPolls++
        setTimeout(poll, 500)
      }

      await poll()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
