'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

const MODELS = [
  { id: 'grok-4', label: 'Grok 4', provider: 'xAI', description: 'Planning & complex reasoning' },
  { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', provider: 'Groq', description: 'Fast execution' },
]

interface WorkspaceTopBarProps {
  selectedModel: string
  onModelChange: (model: string) => void
  userName?: string | null
}

export function WorkspaceTopBar({ selectedModel, onModelChange, userName }: WorkspaceTopBarProps) {
  const [open, setOpen] = useState(false)
  const current = MODELS.find((m) => m.id === selectedModel) ?? MODELS[0]

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-20">
      {/* Model picker */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-1.5 rounded border border-border hover:border-border-strong transition-colors text-sm text-text-primary"
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span className="font-medium">{current.label}</span>
          <span className="text-text-tertiary text-xs">{current.provider}</span>
          <ChevronDown size={13} className={cn('text-text-tertiary transition-transform', open && 'rotate-180')} />
        </button>

        {open && (
          <div
            className="absolute top-full left-0 mt-1 w-64 bg-surface-elevated border border-border rounded shadow-xl shadow-black/40 z-30"
            role="listbox"
          >
            {MODELS.map((m) => (
              <button
                key={m.id}
                role="option"
                aria-selected={m.id === selectedModel}
                onClick={() => { onModelChange(m.id); setOpen(false) }}
                className={cn(
                  'w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-accent-muted transition-colors',
                  m.id === selectedModel && 'bg-accent-muted'
                )}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-text-primary">{m.label}</span>
                  <span className="text-xs text-text-tertiary">{m.description}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-text-tertiary hidden sm:block">
          {userName === 'Aaron' ? 'Master Aaron' : (userName ?? 'User')}
        </span>
      </div>
    </header>
  )
}
