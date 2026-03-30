import { requireAuth } from '@/server/actions/auth'
import { getSettingsAction } from '@/server/actions/connectors'
import { listChatsAction } from '@/server/actions/workspace'
import { WorkspaceSidebar } from '@/features/workspace/sidebar'
import { SettingsClient } from '@/features/settings/settings-client'
import { Divider } from '@/components/ui/primitives'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const user = await requireAuth()
  const [chats, settings] = await Promise.all([listChatsAction(), getSettingsAction()])

  const displayName = user.name === 'Aaron' ? 'Master Aaron' : (user.name ?? 'User')

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkspaceSidebar chats={chats} userName={user.name} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="flex flex-col gap-1.5 mb-8">
            <h1 className="font-serif text-3xl text-text-primary">Settings</h1>
            <p className="text-sm text-text-secondary">Manage your workspace preferences.</p>
          </div>

          {/* Account */}
          <section className="flex flex-col gap-4 mb-8">
            <h2 className="font-mono text-xs text-text-tertiary uppercase tracking-wider">Account</h2>
            <div className="bg-surface border border-border rounded-lg divide-y divide-border">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-text-secondary">Name</span>
                <span className="text-sm text-text-primary">{displayName}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-text-secondary">Email</span>
                <span className="text-sm text-text-primary font-mono">{user.email}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-text-secondary">User ID</span>
                <span className="font-mono text-xs text-text-tertiary">{user.id.slice(0, 8)}&hellip;</span>
              </div>
            </div>
          </section>

          <Divider className="mb-8" />

          {/* Preferences */}
          <section>
            <h2 className="font-mono text-xs text-text-tertiary uppercase tracking-wider mb-4">Preferences</h2>
            <SettingsClient settings={settings} />
          </section>
        </div>
      </main>
    </div>
  )
}
