/**
 * Vocab underlay for Experiment 1.
 * Polaroid word cards are painted on a warm board and sampled by the sand shader.
 * The sand engine itself is unchanged — this file only fills the underlay textures.
 */
import { cardById, drawIllustration, layoutSpots, BOARD_HEX, type VocabId } from './vocab-art'

export class GlassLayer {
  readonly sampler: GPUSampler
  private photoTexture: GPUTexture | undefined
  private glassCoatTexture: GPUTexture | undefined
  private leafTexture: GPUTexture | undefined
  private readonly photoCanvas = document.createElement('canvas')
  private readonly glassCanvas = document.createElement('canvas')
  private readonly photoCtx = this.photoCanvas.getContext('2d', { alpha: false })!
  private readonly glassCtx = this.glassCanvas.getContext('2d', { alpha: false })!
  private width = 0
  private height = 0
  private ready = false

  private readonly device: GPUDevice

  constructor(device: GPUDevice) {
    this.device = device
    this.sampler = device.createSampler({
      label: 'Vocab underlay sampler',
      magFilter: 'linear',
      minFilter: 'linear',
      mipmapFilter: 'nearest',
      addressModeU: 'clamp-to-edge',
      addressModeV: 'clamp-to-edge',
    })
  }

  async initialize() {
    await loadCardFonts()
    this.ensureTextures(4, 4)
    this.paintPhotos(4, 4)
    this.paintGlassCoat(4, 4)
    this.uploadPhoto()
    this.uploadGlassCoat()
    this.uploadLeaf()
    this.ready = true
  }

  get underlayView() {
    if (!this.photoTexture) throw new Error('Vocab underlay not ready')
    return this.photoTexture.createView()
  }

  get photoView() {
    return this.underlayView
  }

  get glassCoatView() {
    if (!this.glassCoatTexture) throw new Error('Glass coat not ready')
    return this.glassCoatTexture.createView()
  }

  get leafView() {
    if (!this.leafTexture) throw new Error('Leaf texture not ready')
    return this.leafTexture.createView()
  }

  resize(width: number, height: number) {
    if (!this.ready) return
    const w = Math.max(2, Math.min(2560, Math.floor(width)))
    const h = Math.max(2, Math.min(2560, Math.floor(height)))
    if (w === this.width && h === this.height) return
    this.ensureTextures(w, h)
    this.paintPhotos(w, h)
    this.paintGlassCoat(w, h)
    this.uploadPhoto()
    this.uploadGlassCoat()
  }

  tick(now: number) {
    void now
  }

  private ensureTextures(width: number, height: number) {
    this.width = width
    this.height = height
    this.photoCanvas.width = width
    this.photoCanvas.height = height
    this.glassCanvas.width = width
    this.glassCanvas.height = height
    this.photoTexture?.destroy()
    this.glassCoatTexture?.destroy()
    this.photoTexture = this.device.createTexture({
      label: 'Vocab card underlay',
      size: [width, height],
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    })
    this.glassCoatTexture = this.device.createTexture({
      label: 'Glass coat (unused clear)',
      size: [width, height],
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    })
    if (!this.leafTexture) {
      this.leafTexture = this.device.createTexture({
        label: 'Neutral imprint slot',
        size: [1, 1],
        format: 'rgba8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
      })
    }
  }

  private paintPhotos(w: number, h: number) {
    paintVocabBoard(this.photoCtx, w, h)
  }

  private paintGlassCoat(w: number, h: number) {
    this.glassCtx.fillStyle = '#000000'
    this.glassCtx.fillRect(0, 0, w, h)
  }

  private uploadPhoto() {
    if (!this.photoTexture) return
    this.device.queue.copyExternalImageToTexture(
      { source: this.photoCanvas },
      { texture: this.photoTexture },
      [this.width, this.height],
    )
  }

  private uploadGlassCoat() {
    if (!this.glassCoatTexture) return
    this.device.queue.copyExternalImageToTexture(
      { source: this.glassCanvas },
      { texture: this.glassCoatTexture },
      [this.width, this.height],
    )
  }

  private uploadLeaf() {
    if (!this.leafTexture) return
    this.device.queue.writeTexture(
      { texture: this.leafTexture },
      new Uint8Array([160, 140, 110, 255]),
      { bytesPerRow: 4 },
      [1, 1],
    )
  }

  dispose() {
    this.photoTexture?.destroy()
    this.glassCoatTexture?.destroy()
    this.leafTexture?.destroy()
  }
}

export function paintVocabBoard(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = BOARD_HEX
  ctx.fillRect(0, 0, w, h)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  const portrait = w / h < 0.92
  const spots = layoutSpots(portrait)
  const cardH = (portrait ? 0.158 : 0.30) * h
  const cardW = cardH / 1.28
  const order = spots.map((spot, index) => ({ spot, index })).sort((a, b) => a.spot.y - b.spot.y || a.index - b.index)
  for (const { spot } of order) {
    drawPolaroid(ctx, spot.id, spot.x * w, spot.y * h, cardW, cardH, spot.rot)
  }
}

async function loadCardFonts() {
  if (!document.fonts?.load) return
  await Promise.all([
    document.fonts.load('800 64px Nunito'),
    document.fonts.load('700 48px Nunito'),
    document.fonts.load('400 32px "Noto Sans SC"'),
  ]).catch(() => undefined)
}

function drawPolaroid(
  ctx: CanvasRenderingContext2D,
  id: VocabId,
  cx: number,
  cy: number,
  cardW: number,
  cardH: number,
  rot: number,
) {
  const card = cardById(id)
  const side = cardW * 0.055
  const bottom = cardW * 0.25
  const photoW = cardW - side * 2
  const photoH = cardH - side - bottom
  const photoX = -cardW / 2 + side
  const photoY = -cardH / 2 + side

  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(rot)

  ctx.shadowColor = 'rgba(70, 46, 24, 0.28)'
  ctx.shadowBlur = Math.max(8, cardW * 0.07)
  ctx.shadowOffsetX = cardW * 0.012
  ctx.shadowOffsetY = cardW * 0.028
  ctx.fillStyle = '#fffcf7'
  ctx.beginPath()
  ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, cardW * 0.035)
  ctx.fill()

  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  drawIllustration(ctx, id, photoX, photoY, photoW, photoH)
  ctx.strokeStyle = 'rgba(40, 30, 20, 0.06)'
  ctx.lineWidth = Math.max(1, cardW * 0.004)
  ctx.strokeRect(photoX, photoY, photoW, photoH)

  const bandCenter = cardH / 2 - bottom * 0.52
  let enSize = cardW * 0.105
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#2a241c'
  ctx.font = `800 ${enSize}px Nunito, "Arial Rounded MT Bold", ui-rounded, sans-serif`
  while (ctx.measureText(card.en).width > photoW * 0.92 && enSize > 11) {
    enSize *= 0.92
    ctx.font = `800 ${enSize}px Nunito, "Arial Rounded MT Bold", ui-rounded, sans-serif`
  }
  const zhSize = Math.max(11, enSize * 0.52)
  ctx.fillText(card.en, 0, bandCenter - zhSize * 0.48)
  ctx.fillStyle = '#8d7b68'
  ctx.font = `400 ${zhSize}px "Noto Sans SC", "WenQuanYi Micro Hei", "PingFang SC", "Microsoft YaHei", sans-serif`
  ctx.fillText(card.zh, 0, bandCenter + enSize * 0.42)
  ctx.restore()
}
