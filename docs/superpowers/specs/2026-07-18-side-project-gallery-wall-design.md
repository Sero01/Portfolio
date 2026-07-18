# Side Project Gallery Wall Design

## Goal

Turn the Side projects section into an editorial gallery wall where projects use varied tile sizes, their screenshots or GIFs are always visible, and tiles fade into view one after another at 500 ms intervals.

## Content

The wall contains seven linked projects in this order:

1. Speculum — `assets/projects/speculum.gif`
2. Memory Wiki — `assets/projects/memory-wiki.gif`
3. Norman — `assets/projects/Norman.webp`
4. Inklink — `assets/projects/inklink.gif`
5. Pickpath — `assets/projects/pickpath.gif`, linking to `https://pickpath-presell.pages.dev/`
6. Watchparty — `assets/projects/watchparty.webp`
7. Agent Guides — `assets/projects/agentguides.webp`

Emma and WhispnoteAI are removed from both the gallery data and the Side projects sidebar summary. Existing project destinations remain unchanged except for the new Pickpath destination.

## Layout

The Side projects conversation keeps the normal 790 px thread width. The desktop wall uses a two-column, row-major CSS grid, making each project roughly twice the width of the original four-column cards. Projects fill horizontally from left to right before starting the next row. Each tile's height is driven by its image or GIF rather than a fixed grid row, producing varied native proportions without empty letterbox bars or cropped edges.

At narrow mobile widths, the wall becomes one column. The thread remains capped by the available viewport width and does not create horizontal overflow.

## Tile Presentation

Each tile is a normal external link. Its image or GIF renders at `width: 100%` and `height: auto`, so the complete asset is visible at its intrinsic aspect ratio; animated GIFs play through the browser's native image behavior. A compact, always-visible placard overlays the bottom edge with the project name and metadata. There is no cover layer, hover reveal, hover translation, or hover-only information.

Keyboard focus remains visibly outlined. Links open in a new tab with `rel="noopener"`, and every image has a project-specific alt description.

## Reveal Sequence

When the Side projects response is rendered, each tile receives the existing cascade index and fades/slides gently into place. Each successive tile begins 500 ms after the prior tile. The sequence runs whenever the section is freshly rendered.

Users who prefer reduced motion see every tile immediately with no meaningful delay or movement.

As each tile reaches its 500 ms reveal point, the chat scrolls toward the current bottom so the newest project remains visible. Scheduled scrolls check the active render sequence and do nothing if the visitor has switched sections.

## Implementation Boundaries

- `script.js` owns project content, destination URLs, image paths, and generated gallery markup.
- `styles.css` owns the horizontal-first two-column grid, native-ratio image presentation, the 500 ms stagger calculation, responsive fallback, and reduced-motion behavior.
- `index.html` updates only the Side projects sidebar summary.
- `tests/gallery-wall.test.js` verifies project membership, assets and destination, removal of hover-driven markup/copy, varied layout hooks, stagger timing, and reduced-motion compatibility.

No new dependencies or image-processing steps are introduced.

## Verification

Automated tests inspect the rendered-source contract for the seven projects, Pickpath URL, GIF usage, absence of Emma/Whispnote and hover-reveal markup, varied size classes, and a 500 ms per-item animation delay. The full Node test suite must remain green. A browser smoke check should confirm the wall is visually varied, links and GIFs work, labels remain readable, and the responsive layouts do not overflow.
