import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'muted'
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'text-text-primary bg-accent-muted',
  success: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
  danger: 'text-danger bg-danger/10',
  muted: 'text-text-tertiary bg-surface-elevated',
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export type RunStatus =
  | 'queued'
  | 'planning'
  | 'executing'
  | 'waiting_input'
  | 'completed'
  | 'failed'
  | 'cancelled'

const statusMap: Record<RunStatus, { label: string; variant: BadgeProps['variant'] }> = {
  queued: { label: 'Queued', variant: 'muted' },
  planning: { label: 'Planning', variant: 'warning' },
  executing: { label: 'Executing', variant: 'default' },
  waiting_input: { label: 'Waiting', variant: 'warning' },
  completed: { label: 'Completed', variant: 'success' },
  failed: { label: 'Failed', variant: 'danger' },
  cancelled: { label: 'Cancelled', variant: 'muted' },
}

export function StatusBadge({ status }: { status: RunStatus }) {
  const { label, variant } = statusMap[status] ?? { label: status, variant: 'muted' }
  return (
    <Badge variant={variant}>
      {status !== 'queued' && status !== 'cancelled' && status !== 'failed' && status !== 'completed' && (
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      )}
      {label}
    </Badge>
  )
}
