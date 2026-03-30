'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/primitives'
import { StatusBadge } from './badge'
import { CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react'
import type { Run } from '@/lib/db/schema'

interface RunExecutionProps {
  run: Run & { steps?: { id: string; stepIndex: number; title: string; status: string; logs?: string[] }[] }
  onStreamUpdate?: (chunk: string) => void
}

export function RunExecution({ run, onStreamUpdate }: RunExecutionProps) {
  const [logs, setLogs] = useState<string[]>([])
  const [isStreaming, setIsStreaming] = useState(false)

  useEffect(() => {
    if (run.status === 'running' || run.status === 'pending') {
      setIsStreaming(true)

      const eventSource = new EventSource(`/api/runs/${run.id}/stream`)

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'log') {
            setLogs((prev) => [...prev, data.message])
            onStreamUpdate?.(data.message)
          } else if (data.type === 'complete') {
            setIsStreaming(false)
            eventSource.close()
          }
        } catch (e) {
          console.error('Failed to parse stream data', e)
        }
      }

      eventSource.onerror = () => {
        setIsStreaming(false)
        eventSource.close()
      }

      return () => eventSource.close()
    }
  }, [run.id, run.status, onStreamUpdate])

  const steps = run.steps ?? []
  const completedSteps = steps.filter((s) => s.status === 'completed').length
  const failedSteps = steps.filter((s) => s.status === 'failed').length

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-surface-elevated border border-border rounded-lg">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-text-secondary" />
            <span className="text-sm font-medium text-text-primary">{run.objective}</span>
          </div>
          <p className="text-xs text-text-tertiary">
            {completedSteps} / {steps.length} steps completed
            {failedSteps > 0 && ` • ${failedSteps} failed`}
          </p>
        </div>
        <StatusBadge status={run.status} />
      </div>

      {/* Steps */}
      {steps.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Steps</span>
          {steps.map((step, idx) => (
            <div key={step.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium',
                    step.status === 'completed' && 'bg-success/10 border-success text-success',
                    step.status === 'failed' && 'bg-danger/10 border-danger text-danger',
                    step.status === 'running' && 'border-accent text-accent',
                    step.status === 'pending' && 'border-border text-text-tertiary'
                  )}
                >
                  {step.status === 'completed' && <CheckCircle2 size={12} />}
                  {step.status === 'failed' && <AlertCircle size={12} />}
                  {step.status === 'running' && <Spinner />}
                  {step.status === 'pending' && idx + 1}
                </div>
                {idx < steps.length - 1 && <div className="w-px h-3 bg-border mt-0.5" />}
              </div>
              <div className="flex flex-col gap-1 pb-2">
                <p className="text-xs font-medium text-text-primary">{step.title}</p>
                <StatusBadge status={step.status as never} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Logs */}
      {logs.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Execution Log</span>
          <div className="bg-background border border-border rounded-lg p-3 font-mono text-xs text-text-secondary leading-relaxed max-h-64 overflow-y-auto">
            {logs.map((log, idx) => (
              <div key={idx} className="whitespace-pre-wrap break-words">
                {log}
              </div>
            ))}
            {isStreaming && (
              <div className="flex items-center gap-2 mt-2 text-text-tertiary">
                <Spinner />
                <span>Running...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
