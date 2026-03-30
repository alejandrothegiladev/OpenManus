'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { X, Eye, EyeOff } from 'lucide-react'
import { updateConnectorAction } from '@/server/actions/connectors'

interface ConnectorModalProps {
  connectorId: string
  connectorName: string
  requiredFields: { name: string; type: 'text' | 'password' | 'textarea' }[]
  onClose: () => void
}

export function ConnectorModal({
  connectorId,
  connectorName,
  requiredFields,
  onClose,
}: ConnectorModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTogglePassword = (field: string) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate all fields
    for (const field of requiredFields) {
      if (!formData[field.name]?.trim()) {
        setError(`${field.name} is required`)
        return
      }
    }

    startTransition(async () => {
      const result = await updateConnectorAction(connectorId, formData)
      if (result.success) {
        onClose()
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg border border-border w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-surface">
          <h2 className="font-serif text-lg text-text-primary">Connect {connectorName}</h2>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          {requiredFields.map((field) => (
            <div key={field.name}>
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.name}
                  label={field.name}
                  placeholder={`Enter your ${field.name.toLowerCase()}`}
                  value={formData[field.name] ?? ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  disabled={isPending}
                />
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={field.name} className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                    {field.name}
                  </label>
                  <div className="relative">
                    <Input
                      id={field.name}
                      type={field.type === 'password' && !showPasswords[field.name] ? 'password' : 'text'}
                      placeholder={`Enter your ${field.name.toLowerCase()}`}
                      value={formData[field.name] ?? ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      disabled={isPending}
                      className="pr-10"
                    />
                    {field.type === 'password' && (
                      <button
                        type="button"
                        onClick={() => handleTogglePassword(field.name)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                        aria-label={showPasswords[field.name] ? 'Hide' : 'Show'}
                      >
                        {showPasswords[field.name] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {error && (
            <p className="text-xs text-danger bg-danger/5 border border-danger/20 rounded px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              loading={isPending}
              className="flex-1"
            >
              Connect
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
