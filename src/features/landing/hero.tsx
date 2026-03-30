'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 grid-overlay overflow-hidden">
      {/* Noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,255,255,0.03) 0%, transparent 70%)`,
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center gap-8 max-w-4xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Wordmark */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-7 h-7 border border-border-strong rounded flex items-center justify-center">
            <Zap size={14} className="text-text-primary" />
          </div>
          <span className="font-mono text-xs text-text-tertiary uppercase tracking-[0.2em]">
            Velocity
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-[clamp(3rem,10vw,7rem)] leading-[0.92] tracking-[-0.02em] text-text-primary text-balance">
          Cloud speed.<br />
          Local control.<br />
          <span className="text-text-secondary">Zero compromise.</span>
        </h1>

        {/* Subline */}
        <p className="text-base text-text-secondary max-w-lg leading-relaxed text-pretty">
          Velocity is an autonomous agent workspace for builders, operators, and founders. Assign a goal. Watch it execute.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          <Link href="/auth">
            <Button variant="primary" size="lg" className="gap-2 min-w-[160px]">
              Start building
              <ArrowRight size={15} />
            </Button>
          </Link>
          <Link href="/workspace">
            <Button variant="ghost" size="lg" className="min-w-[160px]">
              View workspace
            </Button>
          </Link>
        </div>

        {/* Model badges */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-xs text-text-tertiary">Powered by</span>
          <span className="font-mono text-xs text-text-secondary border border-border px-2 py-0.5 rounded">Grok</span>
          <span className="text-text-tertiary text-xs">+</span>
          <span className="font-mono text-xs text-text-secondary border border-border px-2 py-0.5 rounded">Groq</span>
          <span className="text-text-tertiary text-xs">+</span>
          <span className="font-mono text-xs text-text-secondary border border-border px-2 py-0.5 rounded">Neon</span>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
