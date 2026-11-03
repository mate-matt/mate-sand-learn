# 沙子 · 单词

Experiment 1 of the mate-sand-learn lab: English vocabulary cards under a photoreal WebGPU sand bed.

Wipe the sand to read a word. One half of the bed is packed thicker, the other thinner, with wind ripples and soft dunes in the height field. After you lift your finger the sand pours back.

**Live:** https://mate-matt.github.io/mate-sand-learn/

**GPLv3 derivative** of [Sandboard](https://github.com/scottstts/Sandboard) by [Scott Sun](https://sand.scottsun.io). Grain, lighting, airborne grains, and scrape are the Sandboard / [mate-sand-glass](https://mate-sand-glass.pages.dev) engine. This page does not put a Sandboard badge in the corner; attribution is this file, [LICENSE](./LICENSE), and [NOTICE](./NOTICE).

## Run

```bash
npm install
npm run dev
npm test
npm run build
```

Needs a browser with hardware WebGPU (current Chrome, Edge, or Safari). If WebGPU is missing, the page stays on a Chinese explanation and does not draw a fake sand overlay.

Vite `base` is `/mate-sand-learn/` so the production build matches GitHub Pages.

## Experiment notes

- Cards (apple / book / cat / coffee / train / camera / leaf) are canvas polaroids: large English, small Chinese gloss, simple illustrations. They sit on a warm board under the sand.
- The packed height is not flat. A soft organic split makes the left side thicker and the right side thinner, plus a few broad dunes. Fine wind ripples ride on that envelope. Slope stays under the solver’s dynamic angle of repose, so the ripple crust is not immediately avalanched away.
- Idle refill (grace 500ms, pour jitter) and the R-key wave reset target that same rippled height, so the crust comes back instead of a flat slab.
- Where sand still covers a card, the surface shader mixes a blurred, desaturated, grain-broken tint into the sand albedo. It is stronger on the thin half and in dune troughs, and it is not a sharp reveal. Scraping down to the floor still shows the card crisply, using the original coverage curve relative to the local packed height.
- Ripple clearance keeps troughs looking like full sand at rest, so the grain lighting is not striped into glass.

## Known limits

- WebGPU only. No WebGL or CSS fallback.
- Sand color and the lighting model are the Sandboard bed. Dune color in the reference photo is not a texture overlay.
- Chinese glosses use a subset of Noto Sans SC (OFL). English captions use Nunito (OFL).

## License

GNU General Public License v3.0 only (GPL-3.0-only), same as upstream Sandboard.

Source for this deployed build is this repository: https://github.com/mate-matt/mate-sand-learn
