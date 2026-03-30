'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import { EmptyState } from '@/components/ui/primitives'
import {
  ChevronRight, Activity, FileText, Image as ImageIcon,
  Code2, Table2, Link2, BookOpen, Cpu
} from 'lucide-react'
import Link from 'next/link'
import type { Run } from '@/lib/db/schema'

interface RightPanelProps {
  activeRun: (Run & { steps?: unknown[] }) | null
}

const tabs = ['Plan', 'Steps', 'Logs', 'Artifacts'] as const
type Tab = typeof tabs[number]

export function WorkspaceRightPanel({ activeRun }: RightPanelProps) {
  const [tab, setTab] = useState<Tab>('Plan')

  if (!activeRun) {
    return (
      <aside className="hidden lg:flex flex-col w-72 border-l border-border bg-surface shrink-0">
        <div className="p-4 border-b border-border">
          <span className="font-mono text-xs text-text-tertiary uppercase tracking-wider">Execution</span>
        </div>
        <EmptyState
          icon={<Activity size={20} />}
          title="No active run"
          description="Assign a task to see the execution trace here."
        />
      </aside>
    )
  }

  const plan = activeRun.plan as { steps?: { index: number; title: string; description: string }[] } | null
  const steps = (activeRun as Run & { steps?: { id: string; stepIndex: number; title: string; status: string; logLines?: string[] }[] }).steps ?? []

  return (
    <aside className="hidden lg:flex flex-col w-72 border-l border-border bg-surface shrink-0 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-2 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-text-tertiary uppercase tracking-wider">Execution</span>
          <StatusBadge status={activeRun.status} />
        </div>
        <p className="text-xs text-text-secondary truncate">{activeRun.objective}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${
              tab === t
                ? 'text-text-primary border-b border-accent -mb-px'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 'Plan' && (
          <div className="p-4 flex flex-col gap-3">
            {plan?.steps?.map((step) => (
              <div key={step.index} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center shrink-0">
                    <span className="font-mono text-xs text-text-tertiary">{step.index + 1}</span>
                  </div>
                  {step.index < (plan?.steps?.length ?? 1) - 1 && (
                    <div className="w-px flex-1 bg-border mt-1" />
                  )}
                </div>
                <div className="flex flex-col gap-0.5 pb-3">
                  <p className="text-xs font-medium text-text-primary">{step.title}</p>
                  <p className="text-xs text-text-tertiary leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
            {!plan?.steps?.length && (
              <p className="text-xs text-text-tertiary">Plan will appear here once generated.</p>
            )}
          </div>
        )}

        {tab === 'Steps' && (
          <div className="p-4 flex flex-col gap-2">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-2.5 p-3 bg-surface-elevated rounded border border-border">
                <Cpu size={13} className="text-text-tertiary shrink-0" />
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">{step.title}</p>
                  <StatusBadge status={step.status as never} />
                </div>
              </div>
            ))}
            {steps.length === 0 && (
              <p className="text-xs text-text-tertiary">Steps will appear here during execution.</p>
            )}
          </div>
        )}

        {tab === 'Logs' && (
          <div className="p-3">
            <div className="bg-background rounded border border-border p-3 font-mono text-xs text-text-secondary leading-relaxed max-h-[400px] overflow-y-auto">
              {steps.flatMap((s) => s.logLines ?? []).join('\n') || (
                <span className="text-text-tertiary">Logs will stream here during execution.</span>
              )}
            </div>
          </div>
        )}

        {tab === 'Artifacts' && (
          <div className="p-4">
            <EmptyState
              icon={<FileText size={16} />}
              title="No artifacts yet"
              description="Generated outputs will appear here."
            />
          </div>
        )}
      </div>

      {/* Link to full run */}
      <div className="p-3 border-t border-border">
        <Link href={`/runs/${activeRun.id}`}>
          <Button variant="ghost" size="xs" className="w-full justify-between">
            <span>Full run view</span>
            <ChevronRight size={12} />
          </Button>
        </Link>
      </div>
    </aside>
  )
}
