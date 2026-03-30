'use client'

import { useState, useEffect, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { cn } from '@/lib/utils'
import { StatusBadge } from './badge'
import { Spinner } from '@/components/ui/primitives'
import { Copy, Check } from 'lucide-react'

interface MessageThreadProps {
  chatId?: string
}

export function MessageThread({ chatId }: MessageThreadProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, append, isLoading } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    body: chatId ? { chatId } : undefined,
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-4">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-sm text-text-secondary">No messages yet. Start a conversation.</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'rounded-lg px-4 py-2 text-sm max-w-md',
                  message.role === 'user'
                    ? 'bg-accent text-background'
                    : 'bg-surface-elevated border border-border text-text-primary'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="leading-relaxed break-words">
                    {message.content}
                  </p>
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(message.content, message.id)}
                      className="shrink-0 text-text-tertiary hover:text-text-secondary transition-colors mt-1"
                      title="Copy message"
                    >
                      {copied === message.id ? (
                        <Check size={13} />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="bg-surface-elevated border border-border rounded-lg px-4 py-2">
                <Spinner />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}
