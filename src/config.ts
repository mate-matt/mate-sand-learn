export const SAND = {
  resolution: 512, extent: 0.8, depth: 0.032, floor: 0.003,
  repose: 0.72, dynamicRepose: 0.58, rate: 32,
  // Glass mode: dig hard to floor so scraped cells clear for photos
  step: 1 / 120, maxSteps: 4, radius: 0.026, indentation: 0.072,
  impactSpeedStart: 0.35, impactSpeedFull: 0.95, impactIndentation: 0.030,
  impactEvacuation: 0.98, impactEjectionFraction: 0.11,
  impactParticleMassMin: 0.0000012, impactParticleMassMax: 0.0000032,
  airborneGrainRadius: 0.00016, airborneReferenceMass: 0.000004,
  airborneShadowResolution: 512, airborneShadowStrength: 1.7,
  particles: 16384, maxContacts: 8,
} as const

/** Idle sand refill after scrape pause (glass mode). */
export const IDLE_REFILL = {
  /** Wait after last finger activity before sand starts rising. */
  graceMs: 500,
  /** Ease-in window after grace before full refill rate. */
  rampMs: 1100,
  /** Per-sim-step base mix toward packed base height (pour jitter amplifies locally). */
  mix: 0.018,
  /** Per-cell rate multiplier range for pour-like jitter. */
  jitterMin: 0.22,
  jitterMax: 1.95,
  /** Chance a cell skips this refill step (grain bursts / uneven advance). */
  skipChance: 0.30,
  /** Extra rate when a taller neighbor is spilling sand in. */
  edgeBoost: 0.95,
} as const

/** Cleared-glass photo traction while wiping (screen px). */
export const PHOTO_DRAG = {
  maxPx: 4.2,
  /** Bed-space velocity → screen px scale. */
  velocityScale: 26,
  follow: 0.4,
  spring: 0.78,
} as const

export type Point = { x: number; y: number }
export type Stroke = {
  from: Point
  to: Point
  velocity: Point
  radius: number
  pressure: number
  active: boolean
}
export const idleStroke = (): Stroke => ({
  from: { x: 0, y: 0 }, to: { x: 0, y: 0 }, velocity: { x: 0, y: 0 },
  radius: SAND.radius, pressure: 0, active: false,
})
