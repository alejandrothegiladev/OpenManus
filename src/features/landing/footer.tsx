'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap } from 'lucide-react'

const footerLinks = [
  { label: 'Workspace', href: '/workspace' },
  { label: 'History', href: '/history' },
  { label: 'Connectors', href: '/connectors' },
  { label: 'Settings', href: '/settings' },
]

export function LandingFooter() {
  return (
    <footer className="border-t border-border px-6 py-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 border border-border-strong rounded flex items-center justify-center">
              <Zap size={12} className="text-text-primary" />
            </div>
            <span className="font-mono text-xs text-text-secondary uppercase tracking-[0.2em]">Velocity</span>
          </div>
          <p className="text-xs text-text-tertiary max-w-xs leading-relaxed">
            An autonomous agent workspace built for production. Cloud speed. Local control. Zero compromise.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-text-secondary hover:text-text-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/auth">
            <Button variant="outline" size="sm" className="gap-1.5 self-start">
              Get started
              <ArrowRight size={13} />
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-border flex items-center justify-between">
        <span className="text-xs text-text-tertiary">
          &copy; {new Date().getFullYear()} Velocity. All rights reserved.
        </span>
        <span className="font-mono text-xs text-text-tertiary">v0.1.0</span>
      </div>
    </footer>
  )
}
