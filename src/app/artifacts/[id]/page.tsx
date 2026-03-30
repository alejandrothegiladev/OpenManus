import { requireAuth } from '@/server/actions/auth'
import { getArtifactAction } from '@/server/actions/workspace'
import { listChatsAction } from '@/server/actions/workspace'
import { WorkspaceSidebar } from '@/features/workspace/sidebar'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { FileText, Code2, Image as ImageIcon, Table2, Link2, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Artifact' }

const typeIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  code: Code2,
  document: FileText,
  spreadsheet: Table2,
  image: ImageIcon,
  diagram: FileText,
  deployment: Link2,
  prompt: BookOpen,
  summary: FileText,
}

export default async function ArtifactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireAuth()
  const [artifact, chats] = await Promise.all([getArtifactAction(id), listChatsAction()])

  if (!artifact) notFound()

  const Icon = typeIconMap[artifact.type] ?? FileText

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <WorkspaceSidebar chats={chats} userName={user.name} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex flex-col gap-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-border rounded flex items-center justify-center">
                <Icon size={15} className="text-text-secondary" />
              </div>
              <Badge variant="muted" className="capitalize">{artifact.type}</Badge>
            </div>
            <h1 className="font-serif text-3xl text-text-primary">{artifact.title}</h1>
            <p className="font-mono text-xs text-text-tertiary">{formatDate(artifact.createdAt)}</p>
          </div>

          {/* Content */}
          {artifact.type === 'code' ? (
            <div className="bg-surface border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                <span className="font-mono text-xs text-text-tertiary">Output</span>
              </div>
              <pre className="p-4 font-mono text-sm text-text-secondary leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {artifact.content ?? 'No content yet.'}
              </pre>
            </div>
          ) : artifact.blobPathname ? (
            <div className="flex flex-col gap-2">
              {artifact.type === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/file?pathname=${encodeURIComponent(artifact.blobPathname)}`}
                  alt={artifact.title}
                  className="rounded-lg border border-border max-w-full"
                />
              ) : (
                <a
                  href={`/api/file?pathname=${encodeURIComponent(artifact.blobPathname)}`}
                  className="inline-flex items-center gap-2 text-sm text-text-primary underline underline-offset-4 hover:text-text-secondary"
                  download
                >
                  <Icon size={14} />
                  Download {artifact.title}
                </a>
              )}
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-lg p-6">
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                {artifact.content ?? 'No content available.'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
