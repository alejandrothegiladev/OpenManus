'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WorkspaceTopBar } from './topbar'
import { WorkspaceComposer } from './composer'
import { WorkspaceRightPanel } from './right-panel'
import { MessageThread } from './message-thread'
import { createRunAction, createChatAction } from '@/server/actions/workspace'
import { Zap, MessageSquare, Plus } from 'lucide-react'
import { EmptyState, Button } from '@/components/ui/primitives'
import { StatusBadge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import type { Chat, Run } from '@/lib/db/schema'

interface WorkspaceClientProps {
  chats: Chat[]
  recentRuns: Run[]
  userName?: string | null
}

type Mode = 'run' | 'chat'

export function WorkspaceClient({ chats, recentRuns, userName }: WorkspaceClientProps) {
  const [mode, setMode] = useState<Mode>('run')
  const [model, setModel] = useState('grok-4')
  const [activeRun, setActiveRun] = useState<Run | null>(null)
  const [activeChat, setActiveChat] = useState<Chat | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const handleRunSubmit = async (content: string, selectedModel: string) => {
    setSubmitting(true)
    try {
      const result = await createRunAction(content)
      if (result.success) {
        setActiveRun(result.data)
        // Trigger run start
        fetch(`/api/runs/${result.data.id}`, { method: 'POST' })
        router.refresh()
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleChatSubmit = async (content: string, selectedModel: string) => {
    setSubmitting(true)
    try {
      // If no active chat, create one
      if (!activeChat) {
        const formData = new FormData()
        formData.append('title', content.substring(0, 50))
        formData.append('model', selectedModel)
        const result = await createChatAction(formData)
        if (result.success && result.data) {
          setActiveChat(result.data)
        }
      }
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

  const handleNewChat = async () => {
    const formData = new FormData()
    formData.append('title', 'New Chat')
    formData.append('model', model)
    const result = await createChatAction(formData)
    if (result.success && result.data) {
      setActiveChat(result.data)
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <WorkspaceTopBar selectedModel={model} onModelChange={setModel} userName={userName} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with chat/run tabs */}
        <aside className="hidden sm:flex flex-col w-48 border-r border-border bg-surface-elevated shrink-0 overflow-y-auto">
          <div className="flex flex-col gap-2 p-3 border-b border-border">
            <button
              onClick={() => setMode('run')}
              className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors ${
                mode === 'run'
                  ? 'bg-accent text-background'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Zap size={14} />
              <span>Runs</span>
            </button>
            <button
              onClick={() => setMode('chat')}
              className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors ${
                mode === 'chat'
                  ? 'bg-accent text-background'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <MessageSquare size={14} />
              <span>Chats</span>
            </button>
          </div>

          {mode === 'chat' && (
            <div className="p-3 border-b border-border">
              <Button
                onClick={handleNewChat}
                size="xs"
                className="w-full gap-2 flex items-center justify-center"
              >
                <Plus size={12} />
                <span>New chat</span>
              </Button>
            </div>
          )}

          <div className="flex-1 flex flex-col gap-1 p-3">
            {mode === 'chat' ? (
              chats.length > 0 ? (
                chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={`text-left p-2 rounded text-xs transition-colors ${
                      activeChat?.id === chat.id
                        ? 'bg-surface text-text-primary'
                        : 'text-text-tertiary hover:text-text-secondary'
                    }`}
                    title={chat.title}
                  >
                    <div className="truncate">{chat.title}</div>
                  </button>
                ))
              ) : (
                <p className="text-xs text-text-tertiary p-2">No chats yet</p>
              )
            ) : (
              recentRuns.length > 0 ? (
                recentRuns.slice(0, 10).map((run) => (
                  <button
                    key={run.id}
                    onClick={() => setActiveRun(run)}
                    className={`text-left p-2 rounded text-xs transition-colors truncate ${
                      activeRun?.id === run.id
                        ? 'bg-surface text-text-primary'
                        : 'text-text-tertiary hover:text-text-secondary'
                    }`}
                    title={run.objective}
                  >
                    {run.objective}
                  </button>
                ))
              ) : (
                <p className="text-xs text-text-tertiary p-2">No runs yet</p>
              )
            )}
          </div>
        </aside>

        {/* Main area */}
        <main className="flex flex-col flex-1 overflow-hidden">
          {/* Content area */}
          <div className="flex-1 overflow-y-auto">
            {mode === 'chat' && activeChat ? (
              <MessageThread chatId={activeChat.id} />
            ) : mode === 'run' && activeRun ? (
              <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-4">
                <div className="flex items-start gap-3 p-4 bg-surface-elevated border border-border rounded-lg">
                  <div className="w-6 h-6 border border-border-strong rounded flex items-center justify-center shrink-0 mt-0.5">
                    <Zap size={12} className="text-text-primary" />
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-text-secondary">Task assigned</span>
                      <StatusBadge status={activeRun.status} />
                    </div>
                    <p className="text-sm text-text-primary">{activeRun.objective}</p>
                  </div>
                </div>
                <p className="text-xs text-text-tertiary text-center">
                  Velocity is working on your task. See the execution trace in the right panel.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full px-6 py-16">
                <div className="flex flex-col items-center gap-5 max-w-sm text-center">
                  <div className="w-12 h-12 border border-border rounded-lg flex items-center justify-center">
                    {mode === 'chat' ? (
                      <MessageSquare size={20} className="text-text-secondary" />
                    ) : (
                      <Zap size={20} className="text-text-secondary" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="font-serif text-2xl text-text-primary">
                      {mode === 'chat' ? 'Start a chat' : 'Assign a task'}
                    </h2>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {mode === 'chat'
                        ? 'Have a conversation with Velocity about your project.'
                        : 'Tell Velocity what you need built, researched, or executed. It will plan and run it autonomously.'}
                    </p>
                  </div>

                  {mode === 'run' && recentRuns.length > 0 && (
                    <div className="w-full flex flex-col gap-2 mt-2">
                      <span className="text-xs text-text-tertiary text-left">Recent runs</span>
                      {recentRuns.slice(0, 3).map((run) => (
                        <button
                          key={run.id}
                          onClick={() => setActiveRun(run)}
                          className="flex items-center gap-3 p-3 bg-surface-elevated border border-border rounded-lg hover:border-border-strong transition-colors text-left w-full"
                        >
                          <StatusBadge status={run.status} />
                          <span className="text-xs text-text-secondary truncate flex-1">{run.objective}</span>
                          <span className="text-xs text-text-tertiary shrink-0">{formatRelativeTime(run.createdAt)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-border">
            <WorkspaceComposer
              onSubmit={mode === 'chat' ? handleChatSubmit : handleRunSubmit}
              model={model}
              disabled={submitting}
              placeholder={mode === 'chat' ? 'Ask Velocity anything...' : 'Describe what you need...'}
            />
          </div>
        </main>

        {/* Right panel - only show for run mode */}
        {mode === 'run' && <WorkspaceRightPanel activeRun={activeRun} />}
      </div>
    </div>
  )
}
