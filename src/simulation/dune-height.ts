import { SAND } from '../config'

/**
 * Packed-bed shape for Experiment 1.
 *
 * This is only a height target for the existing Sandboard solver (init, idle
 * refill, wave reset). It does not replace transport, grain lighting, or scrape.
 * Amplitudes stay under the dynamic angle of repose so ripples are not avalanched
 * flat the moment the bed wakes up.
 *
 * KEEP the TS formulas in sync with DUNE_WGSL below.
 */
export const DUNE = {
  /** Right-half packed depth as a fraction of SAND.depth. Left half stays full. */
  thinScale: 0.76,
  /** Soft large-dune amplitude (metres in bed space). */
  duneAmp: 0.0054,
  /** Wind-ripple fundamental, radians per bed-space unit across the ridges. */
  rippleFreq: 236,
  rippleAmp: 0.0009,
  rippleHarmonic: 0.2,
  fineFreq: 470,
  fineAmp: 0.00022,
  /** Uncorrelated cell noise, kept smaller than the original glass init wobble. */
  micro: 0.0001,
  /**
   * Added to bed height before coverage is computed so ripple troughs still
   * read as full sand. Must exceed the most negative (ripple + micro) offset.
   */
  clearance: 0.00215,
} as const

export function cellPosition(cellX: number, cellY: number, resolution = SAND.resolution) {
  const spacing = SAND.extent / resolution
  return {
    x: (cellX + 0.5) * spacing - SAND.extent * 0.5,
    y: (cellY + 0.5) * spacing - SAND.extent * 0.5,
  }
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function hashDune(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return n - Math.floor(n)
}

export function splitAmount(x: number, y: number) {
  const nx = x / (SAND.extent * 0.5)
  const ny = y / (SAND.extent * 0.5)
  const organic = Math.sin(y * 7.4) * 0.16 + Math.sin(x * 3.1 + y * 5.4) * 0.1 + Math.sin(x * 12) * 0.04
  return smoothstep(-0.22, 0.62, nx * 0.82 + ny * 0.1 + organic)
}

export function duneSignal(x: number, y: number) {
  const a = Math.sin(x * 8.4 + y * 3.6 + 0.4)
  const b = Math.sin(x * 4.7 - y * 6.9 + 1.2)
  const c = Math.sin(y * 5.5 + x * 1.6)
  return (a * 0.52 + b * 0.33 + c * 0.22) / 1.07
}

/** Large-scale packed height: thick/thin split + gentle dunes. No wind ripples. */
export function envelopeHeight(x: number, y: number) {
  const split = splitAmount(x, y)
  const bed = SAND.depth + (SAND.depth * DUNE.thinScale - SAND.depth) * split
  return bed + duneSignal(x, y) * DUNE.duneAmp
}

export function rippleOffset(x: number, y: number) {
  const curve = Math.sin(x * 4.6) * 0.0105 + Math.sin(x * 10.5 + y * 2.2) * 0.0035
  const warp = 1 + 0.07 * Math.sin(x * 3)
  const across = y * warp + x * 0.16 + curve
  const primary = Math.sin(across * DUNE.rippleFreq)
  const harmonic = Math.sin(across * DUNE.rippleFreq * 2 + 0.7)
  const fine = Math.sin(across * DUNE.fineFreq + x * 18)
  const breakUp = 0.86 + 0.14 * Math.sin(x * 47 + y * 13)
  return (primary + harmonic * DUNE.rippleHarmonic) * DUNE.rippleAmp * breakUp + fine * DUNE.fineAmp
}

export function restingHeight(x: number, y: number, cellX = 0, cellY = 0) {
  const micro = (hashDune(cellX + 19.4, cellY + 7.2) - 0.5) * DUNE.micro
  return envelopeHeight(x, y) + rippleOffset(x, y) + micro
}

/** 0 on thick crests, 1 in the thin half's troughs. Drives underlay bleed only. */
export function thinnessAt(x: number, y: number) {
  const split = splitAmount(x, y)
  const trough = Math.max(0, Math.min(1, 0.5 - 0.5 * duneSignal(x, y)))
  return Math.max(0, Math.min(1, split * 0.75 + trough * 0.35))
}

const thinDepth = SAND.depth * DUNE.thinScale

export const DUNE_WGSL = `
fn hashDune(position: vec2f) -> f32 {
  return fract(sin(dot(position, vec2f(127.1, 311.7))) * 43758.5453);
}
fn splitAmount(position: vec2f) -> f32 {
  let nx = position.x / ${SAND.extent * 0.5};
  let ny = position.y / ${SAND.extent * 0.5};
  let organic = sin(position.y * 7.4) * 0.16 + sin(position.x * 3.1 + position.y * 5.4) * 0.10 + sin(position.x * 12.0) * 0.04;
  return smoothstep(-0.22, 0.62, nx * 0.82 + ny * 0.10 + organic);
}
fn duneSignal(position: vec2f) -> f32 {
  let a = sin(position.x * 8.4 + position.y * 3.6 + 0.4);
  let b = sin(position.x * 4.7 - position.y * 6.9 + 1.2);
  let c = sin(position.y * 5.5 + position.x * 1.6);
  return (a * 0.52 + b * 0.33 + c * 0.22) / 1.07;
}
fn envelopeHeight(position: vec2f) -> f32 {
  let split = splitAmount(position);
  let bed = mix(${SAND.depth}, ${thinDepth}, split);
  return bed + duneSignal(position) * ${DUNE.duneAmp};
}
fn rippleOffset(position: vec2f) -> f32 {
  let curve = sin(position.x * 4.6) * 0.0105 + sin(position.x * 10.5 + position.y * 2.2) * 0.0035;
  let warp = 1.0 + 0.07 * sin(position.x * 3.0);
  let across = position.y * warp + position.x * 0.16 + curve;
  let primary = sin(across * ${DUNE.rippleFreq});
  let harmonic = sin(across * ${DUNE.rippleFreq * 2.0} + 0.7);
  let fine = sin(across * ${DUNE.fineFreq} + position.x * 18.0);
  let breakUp = 0.86 + 0.14 * sin(position.x * 47.0 + position.y * 13.0);
  return (primary + harmonic * ${DUNE.rippleHarmonic}) * ${DUNE.rippleAmp} * breakUp + fine * ${DUNE.fineAmp};
}
fn restingHeight(position: vec2f, cell: vec2f) -> f32 {
  let micro = (hashDune(cell + vec2f(19.4, 7.2)) - 0.5) * ${DUNE.micro};
  return envelopeHeight(position) + rippleOffset(position) + micro;
}
fn thinnessAt(position: vec2f) -> f32 {
  let split = splitAmount(position);
  let trough = saturate(0.5 - 0.5 * duneSignal(position));
  return saturate(split * 0.75 + trough * 0.35);
}
`
