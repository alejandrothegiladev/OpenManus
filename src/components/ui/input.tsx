import { cn } from '@/lib/utils'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'w-full bg-surface-elevated border border-border rounded px-3 py-2 text-sm text-text-primary',
          'placeholder:text-text-tertiary',
          'focus:outline-none focus:border-border-strong',
          'transition-colors duration-150',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          error && 'border-danger/50',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          'w-full bg-surface-elevated border border-border rounded px-3 py-2 text-sm text-text-primary',
          'placeholder:text-text-tertiary resize-none',
          'focus:outline-none focus:border-border-strong',
          'transition-colors duration-150',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          error && 'border-danger/50',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
