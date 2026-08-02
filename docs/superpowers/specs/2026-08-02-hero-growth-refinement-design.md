# Hero Growth Refinement Design

## Goal

Refine the first-load growth animation around the word “grow” so it reads as a restrained climbing plant rather than fungal tendrils or a radial web. The illustration must remain expansive and directional while using recognisably botanical stems, foliage, flowers, and growth timing.

## Visual Design

Keep six outward directions, but stop weighting them equally. Three principal vines form broad asymmetric S-curves and carry the composition. Three secondary sprigs remain shorter and lighter, preserving growth in every direction without producing a six-legged starburst. Remove all large circular loops. At most two vine tips may finish in small open hooks; no path doubles back into a closed or near-circular shape.

Increase the stem weight slightly and soften its green so the lines resemble young plant growth rather than wire. Principal vines carry three or four larger leaves, arranged alternately on opposite sides of the stem. Secondary sprigs carry one or two. Leaves retain a short petiole, shaped blade, and fine central vein; each petiole begins at an explicit point in its associated stem path.

Keep three small four-petal flowers. Every flower uses the same muted clay red (`#b47f68`) with the existing subdued ochre centre. Remove runtime flower-colour randomisation completely.

## Layering

The hero establishes the stacking context because it owns the opaque gradient. The growth SVG uses a negative layer inside that context, placing it above the hero background but below headings, cards, controls, diagrams, and other hero content. The SVG retains visible overflow internally while the hero bounds the overall composition.

## Motion and Variation

Increase the stem draw duration from 1.5 seconds to 4.2 seconds, with no more than 600 milliseconds of stagger across all stems. Leaves unfurl progressively behind the moving growth point instead of appearing on an independent early schedule. Flowers open after their supporting vines have substantially completed. Per-load variation is limited to small timing jitter and optional secondary leaves; path geometry and flower colour remain deterministic. Reduced-motion users receive the completed static illustration immediately.

## Scope

Only the hero growth SVG markup and its existing CSS/JavaScript behavior are changed. No dependencies, canvas renderer, procedural path generator, unrelated page styling, or automated tests are added.

## Verification

- Check JavaScript syntax and Git whitespace integrity.
- Confirm the served HTML, CSS, and JavaScript load successfully.
- Confirm three principal paths, three secondary paths, no closed loops, exact leaf attachment coordinates, uniform flower colour, and the hero-owned background-only stacking layer in source.
- Visually confirm on reload that the composition reads as foliage rather than a radial web, remains behind all content, and keeps every petiole attached when a browser is available.
- Confirm reduced-motion users receive the finished static illustration.
