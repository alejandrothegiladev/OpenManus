import { getSession } from '@/lib/auth'
import { db, runs } from '@/lib/db'
import { runSteps } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { getStreamChunks } from '@/lib/redis'
import { startRun } from '@/lib/agent/runner'
import { type NextRequest } from 'next/server'

// GET /api/runs/[id] — fetch run + steps + stream buffer
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const { id } = await params
  const [run] = await db.select().from(runs)
    .where(and(eq(runs.id, id), eq(runs.userId, session.userId)))
    .limit(1)
  if (!run) return new Response('Not found', { status: 404 })

  const steps = await db.select().from(runSteps).where(eq(runSteps.runId, id)).orderBy(runSteps.stepIndex)
  const streamChunks = await getStreamChunks(id)

  return Response.json({ run, steps, streamChunks })
}

// POST /api/runs/[id]/start — trigger run execution
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const { id } = await params
  const [run] = await db.select().from(runs)
    .where(and(eq(runs.id, id), eq(runs.userId, session.userId)))
    .limit(1)
  if (!run) return new Response('Not found', { status: 404 })

  // Kick off async — respond immediately
  startRun(id).catch((err) => console.error(`[run ${id}] execution failed:`, err))

  return Response.json({ started: true, runId: id })
}
