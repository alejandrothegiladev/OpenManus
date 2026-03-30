'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { updateSettingsAction } from '@/server/actions/connectors'
import { cn } from '@/lib/utils'
import type { Settings } from '@/lib/db/schema'

const MODELS = [
  { id: 'grok-4', label: 'Grok 4', description: 'xAI — Best for planning & reasoning' },
  { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', description: 'Groq — Fast execution & simple tasks' },
]

export function SettingsClient({ settings }: { settings: Settings | null }) {
  const [defaultModel, setDefaultModel] = useState(settings?.defaultModel ?? 'grok-4')
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    startTransition(async () => {
      await updateSettingsAction({ defaultModel })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Default model */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium text-text-primary">Default Model</h2>
          <p className="text-xs text-text-secondary">The primary model used for new runs and chats.</p>
        </div>

        <div className="flex flex-col gap-2">
          {MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => setDefaultModel(m.id)}
              className={cn(
                'flex items-start gap-3 p-4 border rounded-lg text-left transition-colors',
                defaultModel === m.id
                  ? 'border-border-strong bg-surface-elevated'
                  : 'border-border hover:border-border-strong hover:bg-surface-elevated'
              )}
            >
              <div className={cn(
                'w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 transition-colors',
                defaultModel === m.id ? 'border-text-primary bg-text-primary' : 'border-border'
              )} />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-text-primary">{m.label}</span>
                <span className="text-xs text-text-secondary">{m.description}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={handleSave} loading={isPending}>
          Save changes
        </Button>
        {saved && <span className="text-xs text-success font-mono">Saved.</span>}
      </div>
    </div>
  )
}
