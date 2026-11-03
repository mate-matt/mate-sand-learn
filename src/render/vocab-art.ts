/** Cute cartoon-realistic vocab illustrations painted into polaroid windows. */

export const BOARD_HEX = '#efe4d2'
export const BOARD_SRGB = [0xef / 255, 0xe4 / 255, 0xd2 / 255] as const

export type VocabId = 'apple' | 'book' | 'cat' | 'coffee' | 'train' | 'camera' | 'leaf'

export type VocabCard = { id: VocabId, en: string, zh: string }

export const VOCAB: readonly VocabCard[] = [
  { id: 'apple', en: 'apple', zh: '苹果' },
  { id: 'book', en: 'book', zh: '书' },
  { id: 'cat', en: 'cat', zh: '猫' },
  { id: 'coffee', en: 'coffee', zh: '咖啡' },
  { id: 'train', en: 'train', zh: '火车' },
  { id: 'camera', en: 'camera', zh: '相机' },
  { id: 'leaf', en: 'leaf', zh: '叶子' },
]

export type CardSpot = { id: VocabId, x: number, y: number, rot: number }

const LANDSCAPE: readonly CardSpot[] = [
  { id: 'apple', x: 0.17, y: 0.24, rot: -0.075 },
  { id: 'book', x: 0.50, y: 0.18, rot: 0.048 },
  { id: 'cat', x: 0.83, y: 0.25, rot: -0.038 },
  { id: 'leaf', x: 0.34, y: 0.50, rot: 0.062 },
  { id: 'coffee', x: 0.17, y: 0.76, rot: 0.05 },
  { id: 'train', x: 0.52, y: 0.78, rot: -0.046 },
  { id: 'camera', x: 0.84, y: 0.72, rot: 0.04 },
]

const PORTRAIT: readonly CardSpot[] = [
  { id: 'apple', x: 0.28, y: 0.11, rot: -0.05 },
  { id: 'cat', x: 0.73, y: 0.13, rot: 0.04 },
  { id: 'book', x: 0.30, y: 0.32, rot: -0.03 },
  { id: 'coffee', x: 0.72, y: 0.33, rot: 0.055 },
  { id: 'train', x: 0.28, y: 0.54, rot: 0.035 },
  { id: 'leaf', x: 0.73, y: 0.55, rot: -0.045 },
  { id: 'camera', x: 0.50, y: 0.78, rot: 0.03 },
]

export function layoutSpots(portrait: boolean): readonly CardSpot[] {
  return portrait ? PORTRAIT : LANDSCAPE
}

export function cardById(id: VocabId): VocabCard {
  const card = VOCAB.find((entry) => entry.id === id)
  if (!card) throw new Error(`Missing vocab card ${id}`)
  return card
}

function backdrop(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, inner: string, outer: string) {
  const g = ctx.createRadialGradient(x + w * 0.45, y + h * 0.4, Math.min(w, h) * 0.08, x + w * 0.5, y + h * 0.5, Math.min(w, h) * 0.72)
  g.addColorStop(0, inner)
  g.addColorStop(1, outer)
  ctx.fillStyle = g
  ctx.fillRect(x, y, w, h)
}

function drawApple(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  backdrop(ctx, x, y, w, h, '#fff4ee', '#f3c2b4')
  const s = Math.min(w, h)
  const cx = x + w * 0.5
  const cy = y + h * 0.56
  ctx.fillStyle = '#e23d3a'
  ctx.beginPath()
  ctx.ellipse(cx, cy, s * 0.30, s * 0.26, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#ef5348'
  ctx.beginPath()
  ctx.ellipse(cx - s * 0.1, cy - s * 0.04, s * 0.16, s * 0.2, -0.45, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + s * 0.1, cy - s * 0.04, s * 0.16, s * 0.2, 0.45, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.42)'
  ctx.beginPath()
  ctx.ellipse(cx - s * 0.1, cy - s * 0.12, s * 0.065, s * 0.04, -0.7, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#6b4428'
  ctx.lineWidth = Math.max(2, s * 0.028)
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(cx, cy - s * 0.22)
  ctx.quadraticCurveTo(cx + s * 0.04, cy - s * 0.34, cx + s * 0.09, cy - s * 0.38)
  ctx.stroke()
  ctx.fillStyle = '#3f9d4e'
  ctx.beginPath()
  ctx.ellipse(cx + s * 0.16, cy - s * 0.34, s * 0.09, s * 0.042, -0.9, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#2f7a3c'
  ctx.lineWidth = Math.max(1, s * 0.012)
  ctx.beginPath()
  ctx.moveTo(cx + s * 0.1, cy - s * 0.34)
  ctx.lineTo(cx + s * 0.22, cy - s * 0.34)
  ctx.stroke()
}

function drawBook(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  backdrop(ctx, x, y, w, h, '#f4f7fb', '#d5e2ee')
  const s = Math.min(w, h)
  const left = x + w * 0.22
  const top = y + h * 0.24
  const bw = s * 0.56
  const bh = s * 0.46
  ctx.fillStyle = 'rgba(70,50,30,0.12)'
  ctx.beginPath()
  ctx.roundRect(left + s * 0.03, top + s * 0.04, bw, bh, s * 0.03)
  ctx.fill()
  ctx.fillStyle = '#f7f1e6'
  ctx.beginPath()
  ctx.roundRect(left + s * 0.035, top + s * 0.02, bw * 0.92, bh, s * 0.02)
  ctx.fill()
  ctx.fillStyle = '#3c758f'
  ctx.beginPath()
  ctx.roundRect(left, top, bw * 0.9, bh, s * 0.035)
  ctx.fill()
  ctx.fillStyle = '#f2c14e'
  ctx.fillRect(left + bw * 0.16, top + bh * 0.28, bw * 0.5, Math.max(2, s * 0.018))
  ctx.fillRect(left + bw * 0.16, top + bh * 0.4, bw * 0.36, Math.max(2, s * 0.014))
  ctx.fillStyle = '#e25b4a'
  ctx.beginPath()
  ctx.moveTo(left + bw * 0.72, top)
  ctx.lineTo(left + bw * 0.84, top)
  ctx.lineTo(left + bw * 0.84, top + bh * 0.28)
  ctx.lineTo(left + bw * 0.78, top + bh * 0.22)
  ctx.lineTo(left + bw * 0.72, top + bh * 0.28)
  ctx.closePath()
  ctx.fill()
}

function drawCat(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  backdrop(ctx, x, y, w, h, '#fff6ea', '#f3d7b0')
  const s = Math.min(w, h)
  const cx = x + w * 0.5
  const cy = y + h * 0.56
  ctx.fillStyle = '#f0a14a'
  ctx.beginPath()
  ctx.moveTo(cx - s * 0.28, cy - s * 0.08)
  ctx.lineTo(cx - s * 0.34, cy - s * 0.34)
  ctx.lineTo(cx - s * 0.1, cy - s * 0.16)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(cx + s * 0.28, cy - s * 0.08)
  ctx.lineTo(cx + s * 0.34, cy - s * 0.34)
  ctx.lineTo(cx + s * 0.1, cy - s * 0.16)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#f7c7c0'
  ctx.beginPath()
  ctx.moveTo(cx - s * 0.24, cy - s * 0.1)
  ctx.lineTo(cx - s * 0.28, cy - s * 0.26)
  ctx.lineTo(cx - s * 0.14, cy - s * 0.16)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(cx + s * 0.24, cy - s * 0.1)
  ctx.lineTo(cx + s * 0.28, cy - s * 0.26)
  ctx.lineTo(cx + s * 0.14, cy - s * 0.16)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#f0a14a'
  ctx.beginPath()
  ctx.ellipse(cx, cy, s * 0.3, s * 0.26, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#d9843a'
  ctx.lineWidth = Math.max(1.5, s * 0.02)
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(cx - s * 0.08, cy - s * 0.2)
  ctx.quadraticCurveTo(cx - s * 0.12, cy - s * 0.08, cx - s * 0.05, cy - s * 0.02)
  ctx.moveTo(cx + s * 0.06, cy - s * 0.2)
  ctx.quadraticCurveTo(cx + s * 0.12, cy - s * 0.1, cx + s * 0.04, cy)
  ctx.stroke()
  const eye = (ex: number) => {
    ctx.fillStyle = '#2b241c'
    ctx.beginPath()
    ctx.ellipse(ex, cy - s * 0.02, s * 0.045, s * 0.055, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(ex - s * 0.012, cy - s * 0.04, s * 0.016, 0, Math.PI * 2)
    ctx.fill()
  }
  eye(cx - s * 0.1)
  eye(cx + s * 0.1)
  ctx.fillStyle = '#f08a9a'
  ctx.beginPath()
  ctx.ellipse(cx, cy + s * 0.06, s * 0.035, s * 0.025, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#2b241c'
  ctx.lineWidth = Math.max(1.25, s * 0.016)
  ctx.beginPath()
  ctx.moveTo(cx, cy + s * 0.07)
  ctx.lineTo(cx, cy + s * 0.1)
  ctx.moveTo(cx, cy + s * 0.1)
  ctx.quadraticCurveTo(cx - s * 0.04, cy + s * 0.13, cx - s * 0.07, cy + s * 0.1)
  ctx.moveTo(cx, cy + s * 0.1)
  ctx.quadraticCurveTo(cx + s * 0.04, cy + s * 0.13, cx + s * 0.07, cy + s * 0.1)
  ctx.stroke()
  ctx.strokeStyle = '#c9844a'
  ctx.lineWidth = Math.max(1, s * 0.012)
  ctx.beginPath()
  ctx.moveTo(cx - s * 0.12, cy + s * 0.05)
  ctx.lineTo(cx - s * 0.3, cy + s * 0.02)
  ctx.moveTo(cx - s * 0.12, cy + s * 0.08)
  ctx.lineTo(cx - s * 0.3, cy + s * 0.1)
  ctx.moveTo(cx + s * 0.12, cy + s * 0.05)
  ctx.lineTo(cx + s * 0.3, cy + s * 0.02)
  ctx.moveTo(cx + s * 0.12, cy + s * 0.08)
  ctx.lineTo(cx + s * 0.3, cy + s * 0.1)
  ctx.stroke()
  ctx.fillStyle = 'rgba(255,150,150,0.35)'
  ctx.beginPath()
  ctx.ellipse(cx - s * 0.18, cy + s * 0.08, s * 0.05, s * 0.03, 0, 0, Math.PI * 2)
  ctx.ellipse(cx + s * 0.18, cy + s * 0.08, s * 0.05, s * 0.03, 0, 0, Math.PI * 2)
  ctx.fill()
}

function drawCoffee(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  backdrop(ctx, x, y, w, h, '#fff8f0', '#f0dcc4')
  const s = Math.min(w, h)
  const cx = x + w * 0.48
  const cy = y + h * 0.58
  ctx.strokeStyle = 'rgba(180,150,120,0.7)'
  ctx.lineWidth = Math.max(2, s * 0.02)
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(cx - s * 0.08, cy - s * 0.34)
  ctx.quadraticCurveTo(cx - s * 0.16, cy - s * 0.48, cx - s * 0.06, cy - s * 0.56)
  ctx.moveTo(cx + s * 0.08, cy - s * 0.32)
  ctx.quadraticCurveTo(cx + s * 0.18, cy - s * 0.46, cx + s * 0.08, cy - s * 0.58)
  ctx.stroke()
  ctx.fillStyle = 'rgba(90,60,40,0.12)'
  ctx.beginPath()
  ctx.ellipse(cx, cy + s * 0.28, s * 0.34, s * 0.07, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#fbf7f2'
  ctx.beginPath()
  ctx.moveTo(cx - s * 0.2, cy - s * 0.16)
  ctx.lineTo(cx - s * 0.16, cy + s * 0.2)
  ctx.quadraticCurveTo(cx, cy + s * 0.28, cx + s * 0.16, cy + s * 0.2)
  ctx.lineTo(cx + s * 0.2, cy - s * 0.16)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#fbf7f2'
  ctx.lineWidth = Math.max(3, s * 0.045)
  ctx.beginPath()
  ctx.arc(cx + s * 0.22, cy + s * 0.02, s * 0.09, -1.2, 1.2)
  ctx.stroke()
  ctx.fillStyle = '#6b3e2a'
  ctx.beginPath()
  ctx.ellipse(cx, cy - s * 0.12, s * 0.16, s * 0.055, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.moveTo(cx, cy - s * 0.1)
  ctx.bezierCurveTo(cx - s * 0.06, cy - s * 0.16, cx - s * 0.07, cy - s * 0.08, cx, cy - s * 0.06)
  ctx.bezierCurveTo(cx + s * 0.07, cy - s * 0.08, cx + s * 0.06, cy - s * 0.16, cx, cy - s * 0.1)
  ctx.fill()
}

function drawTrain(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  backdrop(ctx, x, y, w, h, '#f3faf6', '#d5ebe2')
  const s = Math.min(w, h)
  const base = y + h * 0.7
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.beginPath()
  ctx.arc(x + w * 0.72, y + h * 0.28, s * 0.06, 0, Math.PI * 2)
  ctx.arc(x + w * 0.8, y + h * 0.22, s * 0.045, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#3e7d86'
  ctx.beginPath()
  ctx.roundRect(x + w * 0.16, base - s * 0.28, s * 0.62, s * 0.28, s * 0.08)
  ctx.fill()
  ctx.fillStyle = '#2f636c'
  ctx.beginPath()
  ctx.roundRect(x + w * 0.42, base - s * 0.46, s * 0.28, s * 0.26, s * 0.06)
  ctx.fill()
  ctx.fillStyle = '#f4e2a8'
  ctx.beginPath()
  ctx.roundRect(x + w * 0.5, base - s * 0.4, s * 0.14, s * 0.14, s * 0.03)
  ctx.fill()
  ctx.fillStyle = '#f2d15a'
  ctx.beginPath()
  ctx.arc(x + w * 0.22, base - s * 0.14, s * 0.035, 0, Math.PI * 2)
  ctx.fill()
  const wheel = (wx: number) => {
    ctx.fillStyle = '#2c2622'
    ctx.beginPath()
    ctx.arc(wx, base + s * 0.02, s * 0.055, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#d9c3a2'
    ctx.beginPath()
    ctx.arc(wx, base + s * 0.02, s * 0.022, 0, Math.PI * 2)
    ctx.fill()
  }
  wheel(x + w * 0.3)
  wheel(x + w * 0.48)
  wheel(x + w * 0.64)
}

function drawCamera(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  backdrop(ctx, x, y, w, h, '#f7f4fb', '#ddd4ee')
  const s = Math.min(w, h)
  const left = x + w * 0.18
  const top = y + h * 0.34
  ctx.fillStyle = '#4c4658'
  ctx.beginPath()
  ctx.roundRect(left + s * 0.16, top - s * 0.08, s * 0.22, s * 0.1, s * 0.02)
  ctx.fill()
  ctx.fillStyle = '#2e2a36'
  ctx.beginPath()
  ctx.roundRect(left, top, s * 0.64, s * 0.4, s * 0.06)
  ctx.fill()
  ctx.fillStyle = '#1b1a22'
  ctx.beginPath()
  ctx.arc(left + s * 0.34, top + s * 0.2, s * 0.13, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#6e8ea8'
  ctx.beginPath()
  ctx.arc(left + s * 0.34, top + s * 0.2, s * 0.085, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.beginPath()
  ctx.arc(left + s * 0.3, top + s * 0.16, s * 0.028, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#e25b4a'
  ctx.beginPath()
  ctx.arc(left + s * 0.54, top + s * 0.08, s * 0.025, 0, Math.PI * 2)
  ctx.fill()
}

function drawLeaf(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  backdrop(ctx, x, y, w, h, '#f4fbf3', '#d7ecd4')
  const s = Math.min(w, h)
  const cx = x + w * 0.48
  const cy = y + h * 0.52
  ctx.strokeStyle = '#6b4428'
  ctx.lineWidth = Math.max(2, s * 0.03)
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(cx - s * 0.02, cy + s * 0.28)
  ctx.quadraticCurveTo(cx + s * 0.02, cy + s * 0.1, cx, cy - s * 0.02)
  ctx.stroke()
  const grad = ctx.createLinearGradient(cx, cy - s * 0.32, cx, cy + s * 0.2)
  grad.addColorStop(0, '#8fd18a')
  grad.addColorStop(1, '#2f8f45')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.moveTo(cx, cy - s * 0.34)
  ctx.bezierCurveTo(cx + s * 0.34, cy - s * 0.16, cx + s * 0.22, cy + s * 0.16, cx, cy + s * 0.08)
  ctx.bezierCurveTo(cx - s * 0.26, cy + s * 0.18, cx - s * 0.32, cy - s * 0.14, cx, cy - s * 0.34)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.55)'
  ctx.lineWidth = Math.max(1, s * 0.012)
  ctx.beginPath()
  ctx.moveTo(cx, cy - s * 0.26)
  ctx.quadraticCurveTo(cx + s * 0.02, cy - s * 0.04, cx, cy + s * 0.06)
  ctx.moveTo(cx, cy - s * 0.12)
  ctx.lineTo(cx + s * 0.1, cy - s * 0.04)
  ctx.moveTo(cx, cy - s * 0.04)
  ctx.lineTo(cx - s * 0.1, cy + s * 0.02)
  ctx.stroke()
}

const DRAW: Record<VocabId, (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void> = {
  apple: drawApple,
  book: drawBook,
  cat: drawCat,
  coffee: drawCoffee,
  train: drawTrain,
  camera: drawCamera,
  leaf: drawLeaf,
}

export function drawIllustration(ctx: CanvasRenderingContext2D, id: VocabId, x: number, y: number, w: number, h: number) {
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()
  DRAW[id](ctx, x, y, w, h)
  ctx.restore()
}
