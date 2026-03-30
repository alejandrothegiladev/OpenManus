'use server'

import { db, runs, runSteps, chats, messages, artifacts } from '@/lib/db'
import { eq, desc, and } from 'drizzle-orm'
import { createRunSchema, createChatSchema, sendMessageSchema } from '@/lib/validations'
import { enqueueRun } from '@/lib/redis'
import { requireAuth } from './auth'
import { revalidatePath } from 'next/cache'

// ─── Chats ─────────────────────────────────────────────────────────────────

export async function createChatAction(formData: FormData) {
  const user = await requireAuth()
  const parsed = createChatSchema.safeParse({
    title: formData.get('title') ?? 'New Chat',
    model: formData.get('model') ?? 'grok-4',
  })
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0].message }

  const [chat] = await db.insert(chats).values({ userId: user.id, ...parsed.data }).returning()
  revalidatePath('/workspace')
  return { success: true as const, data: chat }
}

export async function listChatsAction() {
  const user = await requireAuth()
  return db.select().from(chats).where(eq(chats.userId, user.id)).orderBy(desc(chats.updatedAt)).limit(50)
}

export async function sendMessageAction(chatId: string, content: string) {
  const user = await requireAuth()
  const [chat] = await db.select().from(chats).where(and(eq(chats.id, chatId), eq(chats.userId, user.id))).limit(1)
  if (!chat) return { success: false as const, error: 'Chat not found' }

  const [msg] = await db.insert(messages).values({ chatId, role: 'user', content }).returning()
  revalidatePath('/workspace')
  return { success: true as const, data: msg }
}

// ─── Runs ──────────────────────────────────────────────────────────────────

export async function createRunAction(objective: string, chatId?: string) {
  const user = await requireAuth()
  const parsed = createRunSchema.safeParse({ objective, chatId })
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0].message }

  const [run] = await db.insert(runs).values({
    userId: user.id,
    objective: parsed.data.objective,
    chatId: parsed.data.chatId,
    model: parsed.data.model,
  }).returning()

  await enqueueRun(run.id)
  revalidatePath('/workspace')
  revalidatePath('/history')
  return { success: true as const, data: run }
}

export async function listRunsAction() {
  const user = await requireAuth()
  return db.select().from(runs).where(eq(runs.userId, user.id)).orderBy(desc(runs.createdAt)).limit(100)
}

export async function getRunAction(runId: string) {
  const user = await requireAuth()
  const [run] = await db.select().from(runs)
    .where(and(eq(runs.id, runId), eq(runs.userId, user.id)))
    .limit(1)
  if (!run) return null

  const steps = await db.select().from(runSteps)
    .where(eq(runSteps.runId, runId))
    .orderBy(runSteps.stepIndex)

  return { ...run, steps }
}

export async function cancelRunAction(runId: string) {
  const user = await requireAuth()
  await db.update(runs)
    .set({ status: 'cancelled', completedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(runs.id, runId), eq(runs.userId, user.id)))
  revalidatePath(`/runs/${runId}`)
  return { success: true as const }
}

// ─── Artifacts ─────────────────────────────────────────────────────────────

export async function listArtifactsAction() {
  const user = await requireAuth()
  return db.select().from(artifacts).where(eq(artifacts.userId, user.id)).orderBy(desc(artifacts.createdAt)).limit(100)
}

export async function getArtifactAction(artifactId: string) {
  const user = await requireAuth()
  const [artifact] = await db.select().from(artifacts)
    .where(and(eq(artifacts.id, artifactId), eq(artifacts.userId, user.id)))
    .limit(1)
  return artifact ?? null
}
