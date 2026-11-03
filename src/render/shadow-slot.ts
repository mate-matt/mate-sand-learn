/**
 * Placeholder for the sand shader's tree-shadow bindings.
 * Vocab mode does not draw a coconut tree. Opacity stays 0, so treeShadow()
 * is a no-op and grain lighting is unchanged.
 */
export class ShadowSlot {
  readonly sampler: GPUSampler
  readonly texture: GPUTexture
  readonly opacity = 0
  readonly centerX = 0
  readonly centerZ = 0
  /** Nonzero so the shader's shadow UV divide stays defined. Opacity is 0. */
  readonly halfWidth = 0.001
  readonly halfHeight = 0.001

  constructor(device: GPUDevice) {
    this.sampler = device.createSampler({
      label: 'Tree shadow sampler',
      magFilter: 'linear',
      minFilter: 'linear',
      addressModeU: 'clamp-to-edge',
      addressModeV: 'clamp-to-edge',
    })
    this.texture = device.createTexture({
      label: 'Tree shadow (unused)',
      size: [1, 1],
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    })
    device.queue.writeTexture(
      { texture: this.texture },
      new Uint8Array([0, 0, 0, 0]),
      { bytesPerRow: 4 },
      [1, 1],
    )
  }

  async initialize() {}

  resize(width: number, height: number) {
    void width
    void height
  }

  encode(encoder: GPUCommandEncoder, now: number) {
    void encoder
    void now
  }

  dispose() {
    this.texture.destroy()
  }
}
