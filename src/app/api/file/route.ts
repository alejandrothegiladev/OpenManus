import { getSession } from '@/lib/auth'
import { getPrivateFile } from '@/lib/storage'
import { type NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const pathname = req.nextUrl.searchParams.get('pathname')
  if (!pathname) return new Response('Missing pathname', { status: 400 })

  try {
    const result = await getPrivateFile(pathname, req.headers.get('if-none-match'))
    if (!result) return new Response('Not found', { status: 404 })

    if (result.statusCode === 304) {
      return new Response(null, {
        status: 304,
        headers: { ETag: result.blob.etag, 'Cache-Control': 'private, no-cache' },
      })
    }

    return new Response(result.stream, {
      headers: {
        'Content-Type': result.blob.contentType,
        ETag: result.blob.etag,
        'Cache-Control': 'private, no-cache',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
