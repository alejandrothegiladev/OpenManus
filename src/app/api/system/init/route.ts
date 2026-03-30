import { VelocityOS } from '@/lib/velocity-os'
import { MultiAgentOrchestrator } from '@/lib/agents/orchestrator'
import { NextResponse } from 'next/server'

/**
 * System Initialization Endpoint
 * Sets up Velocity 2.0 foundation and agents on server startup
 */

export async function POST() {
  try {
    console.log('[INIT] Starting Velocity 2.0 initialization...')

    // Initialize Velocity OS foundation
    await VelocityOS.initialize()

    // Check health
    const health = await VelocityOS.healthCheck()
    if (health.status !== 'healthy') {
      throw new Error(`Velocity OS health check failed: ${JSON.stringify(health)}`)
    }

    // Initialize agents
    const agents = await MultiAgentOrchestrator.initializeAgents()

    console.log(`[INIT] Velocity 2.0 initialized with ${agents.length} agents`)

    return NextResponse.json({
      success: true,
      timestamp: new Date(),
      systems: {
        velocityOS: 'initialized',
        agents: agents.length,
        health: health.status,
      },
    })
  } catch (error) {
    console.error('[INIT] Initialization failed:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const health = await VelocityOS.healthCheck()
    const agents = MultiAgentOrchestrator.getAgents()

    return NextResponse.json({
      status: 'running',
      health: health.status,
      subsystems: health.subsystems,
      agents: agents.length,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
