import { LandingHero } from '@/features/landing/hero'
import { LandingCapabilities } from '@/features/landing/capabilities'
import { LandingConnectors } from '@/features/landing/connectors'
import { LandingFooter } from '@/features/landing/footer'

export default function HomePage() {
  return (
    <main className="bg-background min-h-screen">
      <LandingHero />
      <LandingCapabilities />
      <LandingConnectors />
      <LandingFooter />
    </main>
  )
}
