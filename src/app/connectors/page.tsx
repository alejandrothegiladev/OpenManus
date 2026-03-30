import { requireAuth } from '@/server/actions/auth'
import { listConnectorsAction } from '@/server/actions/connectors'
import { listChatsAction } from '@/server/actions/workspace'
import { WorkspaceSidebar } from '@/features/workspace/sidebar'
import { ConnectorsClient } from '@/features/connectors/connectors-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Connectors' }

export default async function ConnectorsPage() {
  const user = await requireAuth()
  const [chats, connectors] = await Promise.all([listChatsAction(), listConnectorsAction()])

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkspaceSidebar chats={chats} userName={user.name} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex flex-col gap-1.5 mb-8">
            <h1 className="font-serif text-3xl text-text-primary">Connectors</h1>
            <p className="text-sm text-text-secondary">
              Manage integrations that agents can use when executing tasks.
            </p>
          </div>

          <ConnectorsClient connectors={connectors as never} />
        </div>
      </main>
    </div>
  )
}
