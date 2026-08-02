# Hero Growth Refinement Design

## Goal

Refine the first-load growth animation around the word “grow” so it feels like a restrained botanical illustration rather than short decorative strokes. Vines must extend substantially farther from the word, curve organically, include a few controlled loops, connect every leaf visibly to a stem, and remain behind every page element while staying above the site background.

## Visual Design

Keep six vines so growth continues in every direction: upper-left, lower-left, upward, upper-right, lower-right, and downward. Each vine begins at the outside contour of “grow” and extends roughly three to four times farther than the current version. Long cubic Bézier sections create flowing changes of direction; three of the six vines include one loose loop each. The other vines remain curved but unlooped so the composition stays dainty rather than tangled.

The existing small flowers remain. Each vine carries two restrained leaves. One is always present and the other remains optional for per-load variation. A leaf group contains a short petiole, a shaped blade, and a fine central vein. Its translation point must equal an explicit endpoint in the associated stem path, ensuring the petiole begins directly on the vine rather than near it.

## Layering

The main page establishes the stacking context. The growth SVG uses a negative layer within that context, placing it above the body background but below all headings, cards, controls, diagrams, and other page content. The word-level stacking context is removed so the SVG can sit below the complete page foreground rather than only below the letters in “grow.” The SVG retains visible overflow so the longer paths are not clipped.

## Motion and Variation

Retain the current deliberate draw duration and reduced-motion behavior. Variation remains bounded to animation timing, optional secondary leaves, and muted flower colours. The hand-authored path geometry does not randomize, preventing vines from crossing the text unpredictably or producing awkward shapes.

## Scope

Only the hero growth SVG markup and its existing CSS/JavaScript behavior are changed. No dependencies, canvas renderer, procedural path generator, unrelated page styling, or automated tests are added.

## Verification

- Check JavaScript syntax and Git whitespace integrity.
- Confirm the served HTML, CSS, and JavaScript load successfully.
- Confirm six extended paths, exact leaf attachment coordinates, visible SVG overflow, and the background-only stacking layer in source.
- Visually confirm on reload that the vines sit behind all content and that every petiole touches its stem when a browser is available.
- Confirm reduced-motion users receive the finished static illustration.
