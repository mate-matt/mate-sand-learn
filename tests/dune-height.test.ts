import { describe, expect, it } from 'vitest'
import { SAND } from '../src/config'
import {
  DUNE,
  DUNE_WGSL,
  cellPosition,
  envelopeHeight,
  restingHeight,
  thinnessAt,
} from '../src/simulation/dune-height'
import { VOCAB, layoutSpots } from '../src/render/vocab-art'

describe('dune height field', () => {
  const resolution = SAND.resolution
  const spacing = SAND.extent / resolution

  it('keeps wind ripples and dunes under the dynamic angle of repose', () => {
    let maxSlope = 0
    for (let y = 0; y < resolution - 1; y++) {
      for (let x = 0; x < resolution - 1; x++) {
        const here = cellPosition(x, y, resolution)
        const east = cellPosition(x + 1, y, resolution)
        const north = cellPosition(x, y + 1, resolution)
        const diag = cellPosition(x + 1, y + 1, resolution)
        const h = restingHeight(here.x, here.y, x, y)
        const he = restingHeight(east.x, east.y, x + 1, y)
        const hn = restingHeight(north.x, north.y, x, y + 1)
        const hd = restingHeight(diag.x, diag.y, x + 1, y + 1)
        maxSlope = Math.max(
          maxSlope,
          Math.abs(he - h) / spacing,
          Math.abs(hn - h) / spacing,
          Math.abs(hd - h) / (spacing * Math.SQRT2),
        )
      }
    }
    // dynamicRepose is the slope limit once the bed is moving (refill / scrape).
    expect(maxSlope).toBeLessThan(SAND.dynamicRepose * 0.92)
  })

  it('is thicker on the left and thinner on the right', () => {
    let left = 0
    let right = 0
    let leftN = 0
    let rightN = 0
    const samples = 96
    for (let y = 0; y < samples; y++) {
      for (let x = 0; x < samples; x++) {
        const cellX = Math.floor((x + 0.5) / samples * resolution)
        const cellY = Math.floor((y + 0.5) / samples * resolution)
        const p = cellPosition(cellX, cellY, resolution)
        const env = envelopeHeight(p.x, p.y)
        if (x < samples * 0.28) { left += env; leftN++ }
        if (x > samples * 0.72) { right += env; rightN++ }
      }
    }
    expect(left / leftN).toBeGreaterThan(right / rightN + 0.004)
  })

  it('has a rhythmic wind-ripple field around the envelope', () => {
    const x = Math.floor(resolution / 2)
    let crossings = 0
    let prev = 0
    let energy = 0
    let count = 0
    for (let y = 0; y < resolution; y++) {
      const p = cellPosition(x, y, resolution)
      const ripple = restingHeight(p.x, p.y, x, y) - envelopeHeight(p.x, p.y)
      energy += ripple * ripple
      count++
      if (y > 0 && prev * ripple < 0) crossings++
      prev = ripple
    }
    const rms = Math.sqrt(energy / count)
    expect(crossings).toBeGreaterThan(20)
    expect(rms).toBeGreaterThan(0.00035)
  })

  it('lets ripple troughs stay optically full via clearance', () => {
    let worstGap = 0
    for (let y = 0; y < resolution; y += 2) {
      for (let x = 0; x < resolution; x += 2) {
        const p = cellPosition(x, y, resolution)
        const env = envelopeHeight(p.x, p.y)
        const rest = restingHeight(p.x, p.y, x, y)
        worstGap = Math.max(worstGap, env - rest)
        expect(env).toBeGreaterThan(SAND.floor + 0.01)
      }
    }
    expect(worstGap).toBeLessThan(DUNE.clearance)
  })

  it('shares the packed-bed constants with the WGSL solver snippet', () => {
    expect(DUNE_WGSL).toContain('fn restingHeight')
    expect(DUNE_WGSL).toContain('fn envelopeHeight')
    expect(DUNE_WGSL).toContain(String(DUNE.rippleFreq))
    expect(DUNE_WGSL).toContain(String(DUNE.duneAmp))
    expect(DUNE_WGSL).toContain(String(DUNE.rippleAmp))
  })

  it('marks the right half thinner than the left for the underlay bleed', () => {
    const left = thinnessAt(-0.28, 0)
    const right = thinnessAt(0.28, 0)
    expect(right).toBeGreaterThan(left + 0.25)
  })
})

describe('vocab cards', () => {
  it('scatters the seven lesson words on both layouts', () => {
    expect(VOCAB.map((card) => card.en)).toEqual(['apple', 'book', 'cat', 'coffee', 'train', 'camera', 'leaf'])
    for (const portrait of [false, true]) {
      const ids = layoutSpots(portrait).map((spot) => spot.id)
      expect(new Set(ids)).toEqual(new Set(VOCAB.map((card) => card.id)))
    }
  })
})
