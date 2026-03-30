import { requireAuth } from '@/server/actions/auth'
import { listRunsAction } from '@/server/actions/workspace'
import { WorkspaceSidebar } from '@/features/workspace/sidebar'
import { listChatsAction } from '@/server/actions/workspace'
import { StatusBadge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import { EmptyState } from '@/components/ui/primitives'
import { History, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'History' }

export default async function HistoryPage() {
  const user = await requireAuth()
  const [chats, runs] = await Promise.all([listChatsAction(), listRunsAction()])

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkspaceSidebar chats={chats} userName={user.name} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex flex-col gap-1.5 mb-8">
            <h1 className="font-serif text-3xl text-text-primary">History</h1>
            <p className="text-sm text-text-secondary">All past runs and sessions.</p>
          </div>

          {runs.length === 0 ? (
            <EmptyState
              icon={<History size={20} />}
              title="No runs yet"
              description="Assign your first task in the workspace to get started."
              action={
                <Link href="/workspace">
                  <span className="text-xs text-text-secondary hover:text-text-primary underline underline-offset-4">
                    Go to workspace
                  </span>
                </Link>
              }
            />
          ) : (
            <div className="flex flex-col divide-y divide-border border border-border rounded-lg overflow-hidden">
              {runs.map((run) => (
                <Link
                  key={run.id}
                  href={`/runs/${run.id}`}
                  className="flex items-center gap-4 px-4 py-3 bg-surface hover:bg-surface-elevated transition-colors group"
                >
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <p className="text-sm text-text-primary truncate">{run.objective}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-text-tertiary">{formatRelativeTime(run.createdAt)}</span>
                      <span className="text-text-tertiary text-xs">&middot;</span>
                      <span className="font-mono text-xs text-text-tertiary">{run.model}</span>
                    </div>
                  </div>
                  <StatusBadge status={run.status} />
                  <ChevronRight size={14} className="text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
