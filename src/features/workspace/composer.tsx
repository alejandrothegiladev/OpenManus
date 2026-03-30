'use client'

import { useState, useRef, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Send, Paperclip, Wrench, Plug, Mic, X, ArrowUp
} from 'lucide-react'

interface WorkspaceComposerProps {
  onSubmit: (content: string, model: string) => Promise<void>
  model: string
  disabled?: boolean
  placeholder?: string
}

export function WorkspaceComposer({
  onSubmit,
  model,
  disabled = false,
  placeholder = 'Assign a task to Velocity...',
}: WorkspaceComposerProps) {
  const [value, setValue] = useState('')
  const [isPending, startTransition] = useTransition()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (!value.trim() || isPending || disabled) return
    const content = value.trim()
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    startTransition(() => onSubmit(content, model))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px'
  }

  return (
    <div className="p-4">
      <div className={cn(
        'bg-surface-elevated border border-border rounded-lg transition-colors duration-150',
        'focus-within:border-border-strong',
      )}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isPending}
          rows={1}
          className={cn(
            'w-full bg-transparent px-4 pt-4 pb-2 text-sm text-text-primary resize-none',
            'placeholder:text-text-tertiary',
            'focus:outline-none',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'max-h-[200px] overflow-y-auto',
          )}
          aria-label="Task input"
        />

        {/* Action bar */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          <div className="flex items-center gap-1">
            <button
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs text-text-tertiary hover:text-text-secondary hover:bg-accent-muted transition-colors"
              title="Attach file"
              type="button"
            >
              <Paperclip size={13} />
              <span className="hidden sm:inline">Files</span>
            </button>
            <button
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs text-text-tertiary hover:text-text-secondary hover:bg-accent-muted transition-colors"
              title="Skills & tools"
              type="button"
            >
              <Wrench size={13} />
              <span className="hidden sm:inline">Skills</span>
            </button>
            <button
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs text-text-tertiary hover:text-text-secondary hover:bg-accent-muted transition-colors"
              title="Connect tools"
              type="button"
            >
              <Plug size={13} />
              <span className="hidden sm:inline">Connectors</span>
            </button>
            <button
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs text-text-tertiary hover:text-text-secondary hover:bg-accent-muted transition-colors"
              title="Voice input (coming soon)"
              type="button"
              disabled
            >
              <Mic size={13} />
            </button>
          </div>

          <Button
            variant="primary"
            size="xs"
            onClick={handleSubmit}
            loading={isPending}
            disabled={!value.trim() || disabled}
            className="rounded-md px-3 py-1.5 gap-1.5"
          >
            <ArrowUp size={13} />
            <span className="sr-only sm:not-sr-only text-xs">Send</span>
          </Button>
        </div>
      </div>

      <p className="text-center text-xs text-text-tertiary mt-2">
        Press <kbd className="font-mono px-1 py-0.5 bg-surface-elevated border border-border rounded text-xs">Enter</kbd> to send,{' '}
        <kbd className="font-mono px-1 py-0.5 bg-surface-elevated border border-border rounded text-xs">Shift+Enter</kbd> for new line.
      </p>
    </div>
  )
}
