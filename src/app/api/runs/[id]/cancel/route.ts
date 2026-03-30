import { cancelRunAction } from '@/server/actions/workspace'
import { getSession } from '@/lib/auth'
import { type NextRequest } from 'next/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const { id } = await params
    const result = await cancelRunAction(id)

    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Failed to cancel run' }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[cancel route]', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
