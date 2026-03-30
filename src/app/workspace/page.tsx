import { requireAuth } from '@/server/actions/auth'
import { listChatsAction, listRunsAction } from '@/server/actions/workspace'
import { WorkspaceSidebar } from '@/features/workspace/sidebar'
import { WorkspaceClient } from '@/features/workspace/workspace-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Workspace' }

export default async function WorkspacePage() {
  const user = await requireAuth()
  const [chats, runs] = await Promise.all([listChatsAction(), listRunsAction()])

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkspaceSidebar chats={chats} userName={user.name} />
      <WorkspaceClient
        chats={chats}
        recentRuns={runs}
        userName={user.name}
      />
    </div>
  )
}
