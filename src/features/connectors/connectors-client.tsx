'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/primitives'
import { toggleConnectorAction, connectConnectorAction, disconnectConnectorAction } from '@/server/actions/connectors'
import { formatRelativeTime } from '@/lib/utils'
import {
  Globe, Github, FileText, Layers, Triangle, Database,
  AlertTriangle, Play, Flame, Mail, Calendar, HardDrive,
  CheckCircle2, XCircle, ToggleLeft, ToggleRight, Settings
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Globe, Github, FileText, Layers, Triangle, Database,
  AlertTriangle, Play, Flame, Mail, Calendar, HardDrive,
}

interface ConnectorRow {
  type: string
  name: string
  description: string
  icon: string
  category: string
  permissions: string[]
  authType: string
  id: string | null
  status: string
  enabled: boolean
  lastSyncedAt: Date | null
  config: unknown
}

interface ConnectorsClientProps {
  connectors: ConnectorRow[]
}

export function ConnectorsClient({ connectors }: ConnectorsClientProps) {
  const [isPending, startTransition] = useTransition()
  const [localState, setLocalState] = useState<Record<string, boolean>>(
    Object.fromEntries(connectors.map((c) => [c.type, c.enabled]))
  )

  const categories = ['development', 'productivity', 'data', 'browser'] as const
  const grouped = categories.map((cat) => ({
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    items: connectors.filter((c) => c.category === cat),
  }))

  function handleToggle(connector: ConnectorRow) {
    if (!connector.id) {
      startTransition(async () => {
        await connectConnectorAction(connector.type)
        setLocalState((s) => ({ ...s, [connector.type]: true }))
      })
    } else {
      const next = !localState[connector.type]
      setLocalState((s) => ({ ...s, [connector.type]: next }))
      startTransition(async () => {
        if (!next) {
          await disconnectConnectorAction(connector.id!)
        } else {
          await toggleConnectorAction(connector.id!, next)
        }
      })
    }
  }

  return (
    <div className="flex flex-col gap-10">
      {grouped.map(({ label, items }) => (
        <section key={label}>
          <h2 className="font-mono text-xs text-text-tertiary uppercase tracking-wider mb-4">{label}</h2>
          <div className="flex flex-col divide-y divide-border border border-border rounded-lg overflow-hidden">
            {items.map((connector) => {
              const Icon = iconMap[connector.icon] ?? Globe
              const isEnabled = localState[connector.type] ?? false
              const isConnected = connector.status === 'connected'

              return (
                <div key={connector.type} className="flex items-center gap-4 px-4 py-4 bg-surface hover:bg-surface-elevated transition-colors">
                  <div className="w-8 h-8 border border-border rounded flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-text-secondary" />
                  </div>

                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">{connector.name}</span>
                      {isConnected && (
                        <Badge variant="success" className="text-xs px-1.5 py-0">Connected</Badge>
                      )}
                    </div>
                    <p className="text-xs text-text-tertiary truncate">{connector.description}</p>
                    {connector.lastSyncedAt && (
                      <p className="text-xs text-text-tertiary font-mono">
                        Last sync: {formatRelativeTime(connector.lastSyncedAt)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-text-tertiary hidden md:block font-mono">{connector.authType}</span>
                    <button
                      onClick={() => handleToggle(connector)}
                      disabled={isPending}
                      className="text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
                      aria-label={isEnabled ? `Disable ${connector.name}` : `Enable ${connector.name}`}
                    >
                      {isEnabled ? (
                        <ToggleRight size={20} className="text-success" />
                      ) : (
                        <ToggleLeft size={20} />
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
