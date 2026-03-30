import { createRunAction } from '@/server/actions/workspace'
import { getSession } from '@/lib/auth'
import { type NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const { objective, connectorIds } = await req.json()

    if (!objective) {
      return new Response(JSON.stringify({ error: 'Objective required' }), { status: 400 })
    }

    const result = await createRunAction(objective, connectorIds || [])

    if (!result.data) {
      return new Response(JSON.stringify({ error: result.error || 'Failed to create run' }), { status: 500 })
    }

    return new Response(JSON.stringify(result.data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[runs route]', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
