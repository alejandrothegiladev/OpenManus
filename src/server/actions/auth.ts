'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { signUp, signIn, createSession, destroySession, getCurrentUser, SESSION_COOKIE } from '@/lib/auth'
import { signUpSchema, signInSchema } from '@/lib/validations'
import { db } from '@/lib/db'
import { settings } from '@/lib/db/schema'

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function signUpAction(
  formData: FormData
): Promise<ActionResult<{ redirectTo: string }>> {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    name: formData.get('name') as string | undefined,
  }

  const parsed = signUpSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    const user = await signUp(parsed.data.email, parsed.data.password, parsed.data.name)
    // Create default settings
    await db.insert(settings).values({ userId: user.id }).onConflictDoNothing()
    const token = await createSession(user.id)
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 86400,
      path: '/',
    })
    return { success: true, data: { redirectTo: '/workspace' } }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Sign up failed' }
  }
}

export async function signInAction(
  formData: FormData
): Promise<ActionResult<{ redirectTo: string }>> {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const parsed = signInSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    const user = await signIn(parsed.data.email, parsed.data.password)
    const token = await createSession(user.id)
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 86400,
      path: '/',
    })
    return { success: true, data: { redirectTo: '/workspace' } }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Sign in failed' }
  }
}

export async function signOutAction(): Promise<void> {
  await destroySession()
  redirect('/auth')
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth')
  return user
}
