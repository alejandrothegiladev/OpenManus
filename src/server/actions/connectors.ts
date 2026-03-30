'use server'

import { db, connectors, settings } from '@/lib/db'
import { eq, and } from 'drizzle-orm'
import { connectorToggleSchema, updateSettingsSchema } from '@/lib/validations'
import { CONNECTOR_REGISTRY, type ConnectorType } from '@/lib/connectors'
import { requireAuth } from './auth'
import { revalidatePath } from 'next/cache'

// ─── Connectors ────────────────────────────────────────────────────────────

export async function listConnectorsAction() {
  const user = await requireAuth()
  const userConnectors = await db.select().from(connectors).where(eq(connectors.userId, user.id))

  // Return all known connector types, merged with DB state
  return Object.values(CONNECTOR_REGISTRY).map((def) => {
    const dbRecord = userConnectors.find((c) => c.type === def.type)
    return {
      ...def,
      id: dbRecord?.id ?? null,
      status: dbRecord?.status ?? 'disconnected',
      enabled: dbRecord?.enabled ?? false,
      lastSyncedAt: dbRecord?.lastSyncedAt ?? null,
      config: dbRecord?.config ?? null,
    }
  })
}

export async function toggleConnectorAction(connectorId: string, enabled: boolean) {
  const user = await requireAuth()
  const parsed = connectorToggleSchema.safeParse({ connectorId, enabled })
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0].message }

  await db.update(connectors)
    .set({ enabled, updatedAt: new Date() })
    .where(and(eq(connectors.id, connectorId), eq(connectors.userId, user.id)))

  revalidatePath('/connectors')
  return { success: true as const }
}

export async function connectConnectorAction(type: string, config?: Record<string, unknown>) {
  const user = await requireAuth()
  if (!CONNECTOR_REGISTRY[type as ConnectorType]) {
    return { success: false as const, error: 'Unknown connector type' }
  }

  const def = CONNECTOR_REGISTRY[type as ConnectorType]
  const existing = await db.select().from(connectors)
    .where(and(eq(connectors.userId, user.id), eq(connectors.type, type)))
    .limit(1)

  if (existing.length > 0) {
    await db.update(connectors)
      .set({ status: 'connected', enabled: true, config: config as never, updatedAt: new Date() })
      .where(eq(connectors.id, existing[0].id))
  } else {
    await db.insert(connectors).values({
      userId: user.id,
      name: def.name,
      type,
      status: 'connected',
      enabled: true,
      config: config as never,
    })
  }

  revalidatePath('/connectors')
  return { success: true as const }
}

export async function disconnectConnectorAction(connectorId: string) {
  const user = await requireAuth()
  await db.update(connectors)
    .set({ status: 'disconnected', enabled: false, updatedAt: new Date() })
    .where(and(eq(connectors.id, connectorId), eq(connectors.userId, user.id)))
  revalidatePath('/connectors')
  return { success: true as const }
}

// ─── Settings ──────────────────────────────────────────────────────────────

export async function getSettingsAction() {
  const user = await requireAuth()
  const [s] = await db.select().from(settings).where(eq(settings.userId, user.id)).limit(1)
  return s ?? null
}

export async function updateSettingsAction(data: unknown) {
  const user = await requireAuth()
  const parsed = updateSettingsSchema.safeParse(data)
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0].message }

  await db.update(settings)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(settings.userId, user.id))

  revalidatePath('/settings')
  return { success: true as const }
}
