'use client'

import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'
import type { HTMLAttributes } from 'react'

interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function Dialog({ open, onClose, title, description, children, className }: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div
        className={cn(
          'relative z-10 w-full max-w-md bg-surface-elevated border border-border rounded-lg p-6',
          'shadow-2xl shadow-black/60',
          'animate-slide-up',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        aria-describedby={description ? 'dialog-desc' : undefined}
      >
        {title && (
          <h2 id="dialog-title" className="text-lg font-semibold text-text-primary mb-1">{title}</h2>
        )}
        {description && (
          <p id="dialog-desc" className="text-sm text-text-secondary mb-4">{description}</p>
        )}
        {children}
      </div>
    </div>
  )
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export function Card({ hover = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-lg',
        hover && 'hover:bg-surface-elevated hover:border-border-strong transition-colors duration-150 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-0 border-t border-border', className)} />
}

export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <span
      className="inline-block border border-text-tertiary border-t-text-primary rounded-full animate-spin"
      style={{ width: size, height: size }}
      aria-label="Loading"
    />
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
      {icon && <div className="text-text-tertiary">{icon}</div>}
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        {description && <p className="text-xs text-text-tertiary max-w-xs">{description}</p>}
      </div>
      {action}
    </div>
  )
}
