'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { signOutAction } from '@/server/actions/auth'
import {
  MessageSquare, History, Plug, Settings, Zap,
  ChevronRight, Plus, LogOut, Package
} from 'lucide-react'
import type { Chat } from '@/lib/db/schema'

interface WorkspaceSidebarProps {
  chats: Chat[]
  userName?: string | null
}

const navItems = [
  { href: '/workspace', label: 'Workspace', icon: MessageSquare },
  { href: '/history', label: 'History', icon: History },
  { href: '/connectors', label: 'Connectors', icon: Plug },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function WorkspaceSidebar({ chats, userName }: WorkspaceSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-surface border-r border-border shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-border">
        <div className="w-6 h-6 border border-border-strong rounded flex items-center justify-center">
          <Zap size={12} className="text-text-primary" />
        </div>
        <span className="font-mono text-xs text-text-secondary uppercase tracking-[0.2em]">Velocity</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 p-2 border-b border-border">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors duration-100',
              pathname === item.href
                ? 'bg-accent-muted text-text-primary'
                : 'text-text-secondary hover:text-text-primary hover:bg-accent-muted'
            )}
          >
            <item.icon size={15} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Recent chats */}
      <div className="flex flex-col flex-1 overflow-hidden p-2">
        <div className="flex items-center justify-between px-2 py-1.5 mb-1">
          <span className="font-mono text-xs text-text-tertiary uppercase tracking-wider">Chats</span>
          <Link href="/workspace">
            <button className="text-text-tertiary hover:text-text-secondary transition-colors" aria-label="New chat">
              <Plus size={13} />
            </button>
          </Link>
        </div>
        <div className="flex flex-col gap-0.5 overflow-y-auto flex-1">
          {chats.slice(0, 20).map((chat) => (
            <Link
              key={chat.id}
              href={`/workspace?chat=${chat.id}`}
              className="flex items-center gap-2 px-3 py-2 rounded text-xs text-text-secondary hover:text-text-primary hover:bg-accent-muted transition-colors group"
            >
              <span className="truncate flex-1">{chat.title}</span>
              <ChevronRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
          ))}
          {chats.length === 0 && (
            <p className="px-3 py-2 text-xs text-text-tertiary">No chats yet</p>
          )}
        </div>
      </div>

      {/* User footer */}
      <div className="p-2 border-t border-border">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-text-primary">{userName ?? 'User'}</span>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-text-tertiary hover:text-danger transition-colors"
              aria-label="Sign out"
            >
              <LogOut size={14} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
