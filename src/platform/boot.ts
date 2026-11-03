import type { InterfaceElements } from '../ui/interface'

export class BootMonitor {
  private currentStage = 'Starting'
  private failure: Error | undefined
  private stop: (() => void) | undefined
  private adapter = 'unavailable'
  private readonly ui: InterfaceElements

  constructor(ui: InterfaceElements) { this.ui = ui }
  stage(stage: string) { this.assertHealthy(); this.currentStage = stage; this.ui.status.textContent = `${stage}…` }
  setAdapter(description: string) { this.adapter = description }
  setStop(stop: () => void) { this.stop = stop }
  assertHealthy() { if (this.failure) throw this.failure }

  async run(start: () => Promise<void>) {
    const work = start()
    // The watchdog may win while start() is still pending. Swallow that later
    // rejection so it does not surface as an unhandled promise.
    work.catch(() => undefined)
    let timer = 0
    const watchdog = new Promise<never>((_, reject) => {
      timer = window.setTimeout(() => reject(new Error(`启动超时（${this.currentStage}）`)), 40_000)
    })
    try {
      await Promise.race([work, watchdog])
      window.clearTimeout(timer)
      this.assertHealthy()
      this.currentStage = 'Running'
      this.ui.overlay.classList.add('ready')
      this.ui.overlay.setAttribute('aria-hidden', 'true')
    } catch (error) {
      window.clearTimeout(timer)
      this.fail(error)
    }
  }

  fail(reason: unknown) {
    if (this.failure) return
    const error = reason instanceof Error ? reason : new Error(String(reason))
    this.failure = error
    this.stop?.()
    this.ui.overlay.classList.remove('ready')
    this.ui.overlay.classList.add('failed')
    this.ui.overlay.removeAttribute('aria-hidden')
    const webgpuMissing = /WebGPU is unavailable|No hardware WebGPU adapter|hardware WebGPU adapter is required|could not create a WebGPU canvas context/i.test(error.message)
    if (webgpuMissing) {
      this.ui.title.textContent = '需要 WebGPU 才能显示真实沙子'
      this.ui.status.textContent = '「沙子 · 单词」使用与 mate-sand-glass / Sandboard 相同的 WebGPU 沙床引擎。请用较新的 Chrome、Edge 或 Safari（需硬件加速 WebGPU）。无软件回退。'
    } else {
      this.ui.title.textContent = '沙子没有铺好'
      this.ui.status.textContent = error.message
    }
    this.ui.diagnostics.hidden = false
    this.ui.diagnostics.textContent = [
      `Stage: ${this.currentStage}`, `Error: ${error.message}`,
      `Viewport: ${window.innerWidth} × ${window.innerHeight}; device DPR: ${window.devicePixelRatio}`,
      `Drawing buffer: ${this.ui.canvas.width} × ${this.ui.canvas.height}`,
      `Adapter: ${this.adapter}`, `Platform: ${navigator.userAgent}`,
    ].join('\n')
    this.ui.reload.hidden = false
    console.error(`[Sandboard: ${this.currentStage}]`, error)
  }
}
