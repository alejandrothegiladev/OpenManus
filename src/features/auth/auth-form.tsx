'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signInAction, signUpAction } from '@/server/actions/auth'
import { Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Mode = 'signin' | 'signup'

export function AuthForm() {
  const [mode, setMode] = useState<Mode>('signin')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const action = mode === 'signin' ? signInAction : signUpAction
      const result = await action(formData)
      if (result.success) {
        router.push(result.data.redirectTo)
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 grid-overlay">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(ellipse 70% 50% at 50% 30%, rgba(255,255,255,0.025) 0%, transparent 70%)`,
      }} />

      <motion.div
        className="relative z-10 w-full max-w-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-10">
          <div className="w-7 h-7 border border-border-strong rounded flex items-center justify-center">
            <Zap size={14} className="text-text-primary" />
          </div>
          <span className="font-mono text-xs text-text-tertiary uppercase tracking-[0.2em]">Velocity</span>
        </Link>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-text-primary">
            {mode === 'signin' ? 'Welcome back.' : 'Create account.'}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {mode === 'signin'
              ? 'Sign in to your workspace.'
              : 'Start building with Velocity.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {mode === 'signup' && (
              <motion.div
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  id="name"
                  name="name"
                  label="Name"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <Input
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder={mode === 'signup' ? 'At least 8 characters' : '••••••••'}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            required
          />

          {error && (
            <p className="text-xs text-danger bg-danger/5 border border-danger/20 rounded px-3 py-2">
              {error}
            </p>
          )}

          <Button
            variant="primary"
            size="md"
            type="submit"
            loading={isPending}
            className="w-full mt-1"
          >
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </Button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null) }}
              className="text-text-primary hover:underline underline-offset-4 transition-all"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
