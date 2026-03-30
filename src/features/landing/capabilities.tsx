'use client'

import { motion } from 'framer-motion'
import {
  BrainCircuit, Zap, Eye, Package, ShieldCheck, GitBranch
} from 'lucide-react'

const capabilities = [
  {
    icon: BrainCircuit,
    title: 'Autonomous Planning',
    description: 'Velocity interprets your goal and generates a structured, step-by-step execution plan using Grok — before running a single line of code.',
  },
  {
    icon: Zap,
    title: 'Fast Execution',
    description: 'Each step is executed by Groq\'s ultra-fast inference, routing tool calls to the right connectors and adapters with minimal latency.',
  },
  {
    icon: Eye,
    title: 'Full Transparency',
    description: 'Watch every step, tool call, and decision unfold in real-time. The execution trace is always visible and auditable.',
  },
  {
    icon: Package,
    title: 'Artifact Generation',
    description: 'Code, documents, spreadsheets, diagrams, and deployment links — every output is stored, versioned, and accessible from your workspace.',
  },
  {
    icon: GitBranch,
    title: 'Connector Ecosystem',
    description: 'GitHub, Notion, Linear, Gmail, Google Drive, Vercel, Neon, and more. Agents with access to your real stack.',
  },
  {
    icon: ShieldCheck,
    title: 'Built for Production',
    description: 'Session management, rate limiting, Redis queuing, Postgres persistence — engineered for teams shipping at scale.',
  },
]

export function LandingCapabilities() {
  return (
    <section className="px-6 py-24 max-w-6xl mx-auto">
      <div className="flex flex-col gap-3 mb-16">
        <span className="font-mono text-xs text-text-tertiary uppercase tracking-[0.2em]">Capabilities</span>
        <h2 className="font-serif text-4xl md:text-5xl text-text-primary leading-tight">
          Everything an agent needs
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
        {capabilities.map((cap, i) => (
          <motion.div
            key={cap.title}
            className="bg-background p-8 flex flex-col gap-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
          >
            <cap.icon size={20} className="text-text-secondary" />
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium text-text-primary">{cap.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{cap.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
