'use client'

import { motion } from 'framer-motion'
import {
  Globe, Github, FileText, Layers, Triangle, Database,
  AlertTriangle, Play, Flame, Mail, Calendar, HardDrive
} from 'lucide-react'

const connectors = [
  { name: 'Browser', icon: Globe, category: 'Automation' },
  { name: 'GitHub', icon: Github, category: 'Development' },
  { name: 'Notion', icon: FileText, category: 'Productivity' },
  { name: 'Linear', icon: Layers, category: 'Development' },
  { name: 'Vercel', icon: Triangle, category: 'Development' },
  { name: 'Neon', icon: Database, category: 'Data' },
  { name: 'Sentry', icon: AlertTriangle, category: 'Monitoring' },
  { name: 'Playwright', icon: Play, category: 'Testing' },
  { name: 'Firecrawl', icon: Flame, category: 'Research' },
  { name: 'Gmail', icon: Mail, category: 'Productivity' },
  { name: 'Google Calendar', icon: Calendar, category: 'Productivity' },
  { name: 'Google Drive', icon: HardDrive, category: 'Data' },
]

export function LandingConnectors() {
  return (
    <section className="px-6 py-24 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-xs text-text-tertiary uppercase tracking-[0.2em]">Connectors</span>
          <h2 className="font-serif text-4xl md:text-5xl text-text-primary leading-tight">
            Your stack, connected
          </h2>
          <p className="text-text-secondary text-base max-w-xl leading-relaxed">
            Real adapter interfaces to the tools your team already uses. Enable a connector and the agent can act on your behalf.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {connectors.map((c, i) => (
            <motion.div
              key={c.name}
              className="flex flex-col items-center gap-3 p-4 border border-border rounded hover:border-border-strong hover:bg-surface-elevated transition-colors duration-150 cursor-default"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <c.icon size={18} className="text-text-secondary" />
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xs font-medium text-text-primary text-center">{c.name}</span>
                <span className="text-xs text-text-tertiary">{c.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
