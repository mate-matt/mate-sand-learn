export type InterfaceElements = ReturnType<typeof createInterface>

export function createInterface(root: HTMLDivElement) {
  root.innerHTML = `
    <canvas class="surface" aria-label="抹开沙子看单词。半边沙薄，半边沙厚。按 R 重置。" tabindex="0"></canvas>
    <div class="chrome title" id="titleBlock">「沙子 · 单词」</div>
    <div class="chrome hint" id="hint">半边沙薄，半边沙厚 · 抹开看单词</div>
    <div class="chrome bottom" aria-hidden="true"><span></span><span>R 重置沙层</span></div>
    <!-- Keep radius/reset for InputController; hidden in glass mode -->
    <div class="bg-controls" hidden>
      <input id="radius" type="range" min="6" max="28" step="1" value="26" aria-hidden="true" />
      <button id="reset" type="button" aria-hidden="true">Reset</button>
    </div>
    <section class="overlay" aria-live="polite">
      <div class="boot-panel">
        <h2>正在铺满沙子…</h2>
        <p class="status">加载 WebGPU 沙床…</p>
        <div class="boot-line"></div>
        <pre class="diagnostics" hidden></pre>
        <button id="reload" hidden>重试</button>
      </div>
    </section>`
  const element = <ElementType extends HTMLElement>(selector: string) => root.querySelector<ElementType>(selector)!
  element<HTMLButtonElement>('#reload').onclick = () => window.location.reload()
  return {
    canvas: element<HTMLCanvasElement>('canvas'), overlay: element<HTMLElement>('.overlay'),
    title: element<HTMLElement>('.boot-panel h2'), status: element<HTMLElement>('.status'),
    diagnostics: element<HTMLElement>('.diagnostics'), reload: element<HTMLButtonElement>('#reload'),
    radius: element<HTMLInputElement>('#radius'), reset: element<HTMLButtonElement>('#reset'),
    hint: element<HTMLElement>('#hint'), titleBlock: element<HTMLElement>('#titleBlock'),
  }
}
