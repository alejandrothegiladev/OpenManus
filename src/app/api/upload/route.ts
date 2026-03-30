import { getSession } from '@/lib/auth'
import { uploadFile } from '@/lib/storage'
import { db, files } from '@/lib/db'
import { type NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const runId = formData.get('runId') as string | undefined

    if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })

    const { pathname } = await uploadFile(file, `users/${session.userId}`, 'private')

    const [record] = await db.insert(files).values({
      userId: session.userId,
      runId: runId ?? undefined,
      name: file.name,
      mimeType: file.type,
      size: file.size,
      blobPathname: pathname,
    }).returning()

    return Response.json({ file: record })
  } catch (error) {
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}
