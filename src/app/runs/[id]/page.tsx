import { requireAuth } from '@/server/actions/auth'
import { getRunAction } from '@/server/actions/workspace'
import { listChatsAction } from '@/server/actions/workspace'
import { WorkspaceSidebar } from '@/features/workspace/sidebar'
import { StatusBadge } from '@/components/ui/badge'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import { Card, EmptyState } from '@/components/ui/primitives'
import { notFound } from 'next/navigation'
import { Cpu, Clock, AlertTriangle, CheckCircle2, FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Run' }

export default async function RunPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireAuth()
  const [run, chats] = await Promise.all([getRunAction(id), listChatsAction()])

  if (!run) notFound()

  const plan = run.plan as { steps?: { index: number; title: string; description: string }[] } | null

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkspaceSidebar chats={chats} userName={user.name} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-serif text-2xl md:text-3xl text-text-primary leading-tight text-pretty">
                {run.objective}
              </h1>
              <StatusBadge status={run.status} />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-text-tertiary font-mono">
              <span>{run.id.slice(0, 8)}</span>
              <span>Created {formatDate(run.createdAt)}</span>
              {run.startedAt && <span>Started {formatRelativeTime(run.startedAt)}</span>}
              {run.completedAt && <span>Completed {formatRelativeTime(run.completedAt)}</span>}
              <span>{run.model}</span>
            </div>
          </div>

          {/* Error banner */}
          {run.errorMessage && (
            <div className="flex items-start gap-3 p-4 bg-danger/5 border border-danger/20 rounded-lg mb-6">
              <AlertTriangle size={15} className="text-danger shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-danger">Execution failed</span>
                <p className="text-xs text-danger/80 font-mono">{run.errorMessage}</p>
              </div>
            </div>
          )}

          {/* Summary */}
          {run.summary && (
            <div className="flex items-start gap-3 p-4 bg-success/5 border border-success/20 rounded-lg mb-6">
              <CheckCircle2 size={15} className="text-success shrink-0 mt-0.5" />
              <p className="text-xs text-success/80 leading-relaxed">{run.summary}</p>
            </div>
          )}

          {/* Plan */}
          {plan?.steps && plan.steps.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs font-mono text-text-tertiary uppercase tracking-wider mb-4">Plan</h2>
              <div className="flex flex-col gap-3">
                {plan.steps.map((step) => (
                  <div key={step.index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center shrink-0">
                        <span className="font-mono text-xs text-text-tertiary">{step.index + 1}</span>
                      </div>
                      {step.index < plan.steps!.length - 1 && <div className="w-px flex-1 bg-border my-1" />}
                    </div>
                    <div className="flex flex-col gap-0.5 pb-3">
                      <p className="text-sm font-medium text-text-primary">{step.title}</p>
                      {step.description && (
                        <p className="text-xs text-text-secondary leading-relaxed">{step.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Steps */}
          {run.steps && run.steps.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs font-mono text-text-tertiary uppercase tracking-wider mb-4">Execution Steps</h2>
              <div className="flex flex-col gap-3">
                {run.steps.map((step) => (
                  <div key={step.id} className="bg-surface border border-border rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between gap-2 px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Cpu size={13} className="text-text-tertiary" />
                        <span className="text-sm font-medium text-text-primary">{step.title}</span>
                      </div>
                      <StatusBadge status={step.status as never} />
                    </div>
                    {step.logLines && step.logLines.length > 0 && (
                      <div className="border-t border-border bg-background px-4 py-3 font-mono text-xs text-text-secondary leading-relaxed max-h-48 overflow-y-auto">
                        {step.logLines.join('\n')}
                      </div>
                    )}
                    {step.errorMessage && (
                      <div className="border-t border-danger/20 bg-danger/5 px-4 py-2 font-mono text-xs text-danger">
                        {step.errorMessage}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {!plan && run.steps?.length === 0 && (
            <EmptyState
              icon={<Clock size={18} />}
              title="Run is queued"
              description="Execution details will appear here once the run begins."
            />
          )}
        </div>
      </main>
    </div>
  )
}
