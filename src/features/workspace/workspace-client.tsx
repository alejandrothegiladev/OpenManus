'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WorkspaceTopBar } from './topbar'
import { WorkspaceComposer } from './composer'
import { WorkspaceRightPanel } from './right-panel'
import { createRunAction } from '@/server/actions/workspace'
import { Zap, MessageSquare } from 'lucide-react'
import { EmptyState } from '@/components/ui/primitives'
import { StatusBadge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import type { Chat, Run } from '@/lib/db/schema'

interface WorkspaceClientProps {
  chats: Chat[]
  recentRuns: Run[]
  userName?: string | null
}

export function WorkspaceClient({ chats, recentRuns, userName }: WorkspaceClientProps) {
  const [model, setModel] = useState('grok-4')
  const [activeRun, setActiveRun] = useState<Run | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (content: string, selectedModel: string) => {
    setSubmitting(true)
    try {
      const result = await createRunAction(content)
      if (result.success) {
        setActiveRun(result.data)
        // Trigger run start
        fetch(`/api/runs/${result.data.id}`, { method: 'POST' })
        router.refresh()
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <WorkspaceTopBar selectedModel={model} onModelChange={setModel} userName={userName} />

      <div className="flex flex-1 overflow-hidden">
        {/* Main area */}
        <main className="flex flex-col flex-1 overflow-hidden">
          {/* Content area */}
          <div className="flex-1 overflow-y-auto">
            {activeRun ? (
              <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-4">
                <div className="flex items-start gap-3 p-4 bg-surface-elevated border border-border rounded-lg">
                  <div className="w-6 h-6 border border-border-strong rounded flex items-center justify-center shrink-0 mt-0.5">
                    <Zap size={12} className="text-text-primary" />
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-text-secondary">Task assigned</span>
                      <StatusBadge status={activeRun.status} />
                    </div>
                    <p className="text-sm text-text-primary">{activeRun.objective}</p>
                  </div>
                </div>
                <p className="text-xs text-text-tertiary text-center">
                  Velocity is working on your task. See the execution trace in the right panel.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full px-6 py-16">
                <div className="flex flex-col items-center gap-5 max-w-sm text-center">
                  <div className="w-12 h-12 border border-border rounded-lg flex items-center justify-center">
                    <Zap size={20} className="text-text-secondary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="font-serif text-2xl text-text-primary">Assign a task</h2>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      Tell Velocity what you need built, researched, or executed. It will plan and run it autonomously.
                    </p>
                  </div>

                  {recentRuns.length > 0 && (
                    <div className="w-full flex flex-col gap-2 mt-2">
                      <span className="text-xs text-text-tertiary text-left">Recent runs</span>
                      {recentRuns.slice(0, 3).map((run) => (
                        <button
                          key={run.id}
                          onClick={() => setActiveRun(run)}
                          className="flex items-center gap-3 p-3 bg-surface-elevated border border-border rounded-lg hover:border-border-strong transition-colors text-left w-full"
                        >
                          <StatusBadge status={run.status} />
                          <span className="text-xs text-text-secondary truncate flex-1">{run.objective}</span>
                          <span className="text-xs text-text-tertiary shrink-0">{formatRelativeTime(run.createdAt)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-border">
            <WorkspaceComposer
              onSubmit={handleSubmit}
              model={model}
              disabled={submitting}
            />
          </div>
        </main>

        {/* Right panel */}
        <WorkspaceRightPanel activeRun={activeRun} />
      </div>
    </div>
  )
}
