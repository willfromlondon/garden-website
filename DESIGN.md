---
name: Garden
description: Application-led design for structured agent workflows
colors:
  ink: "#292825"
  ink-soft: "#55524d"
  muted: "#77736c"
  canvas: "#f8f7f3"
  surface: "#fffefa"
  surface-alt: "#f1efea"
  line: "rgba(55, 50, 44, 0.14)"
  orange: "#bd5124"
  orange-dark: "#a8421a"
  orange-soft: "#f3dfd4"
  green: "#3d7b55"
  green-soft: "#e1efe5"
  blue: "#527791"
  agent: "#fbf2ee"
  gate: "#f6f2e8"
  terminal: "#edf3ef"
typography:
  display:
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI Variable Text", "Segoe UI", sans-serif'
    fontSize: "clamp(52px, 6vw, 86px)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI Variable Text", "Segoe UI", sans-serif'
    fontSize: "clamp(40px, 4.6vw, 64px)"
    fontWeight: 680
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  body:
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI Variable Text", "Segoe UI", sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.01em"
  label:
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI Variable Text", "Segoe UI", sans-serif'
    fontSize: "11px"
    fontWeight: 760
    lineHeight: 1.2
    letterSpacing: "0.12em"
  mono:
    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace'
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  compact: "4px"
  utility: "8px"
  button: "10px"
  node: "12px"
  card: "15px"
  panel: "18px"
  shell: "20px"
  feature: "24px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  section: "48px"
components:
  button-primary:
    backgroundColor: "{colors.orange}"
    textColor: "#ffffff"
    typography: "{typography.body}"
    rounded: "{rounded.button}"
    padding: "0 16px"
    height: "42px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.button}"
    padding: "0 16px"
    height: "42px"
  run-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "16px"
  arch-node:
    backgroundColor: "{colors.agent}"
    textColor: "{colors.ink}"
    rounded: "{rounded.node}"
    padding: "13px"
    width: "155px"
  evidence-panel:
    backgroundColor: "{colors.green-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "20px"
---

# Design System: Garden

## Overview

**Creative North Star: "The Working Run"**

Garden looks like the desktop application in use: warm, precise, and operational. The system explains the product through code-built HTML, CSS, and SVG components, with the request -> plan -> Arch -> evidence sequence as its central visual grammar. Marketing surfaces borrow the application's controls, nodes, routes, status treatments, and ordinary language without turning them into decorative screenshots.

**Key Characteristics:**

- Warm neutral application surfaces
- Restrained orange action and selection
- Soft green evidence and readiness
- Thin rules, shallow elevation, and rounded utility controls
- Web-native product components instead of screenshot scenery

## Colors

Garden uses warm neutrals for structure, orange for action, green for evidence, and blue only as a supporting graph accent.

### Primary

- **Garden Orange:** Primary buttons, active tabs, selected nodes, ports, and section labels.
- **Deep Orange:** Hover states and text links that need stronger contrast.
- **Pale Orange:** Icons, counts, and low-emphasis action markers.

### Secondary

- **Evidence Green:** Supported outcomes, readiness, watching states, and positive controls.
- **Evidence Wash:** Evidence cards and completed-result surfaces.
- **Graph Blue:** A supporting colour for project and dependency visualisation.

### Neutral

- **Deep Ink:** Main text and the dark download surface.
- **Soft Ink and Muted Copy:** Supporting text, labels, and secondary navigation.
- **Warm Canvas, Surface, and Inset Surface:** Page, panel, and grouped-control layers.
- **Hairline:** Dividers, outlines, routes, and quiet boundaries.
- **Agent, Gate, and Terminal Tints:** Distinguish Arch node types without competing with state colours.

### Named Rules

**The Accent Rule.** Orange marks action and selection. Green marks evidence and readiness.

## Typography

**Display Font:** Self-hosted Inter variable with native system UI fallbacks<br>
**Body Font:** Self-hosted Inter variable with native system UI fallbacks<br>
**Label Font:** Self-hosted Inter variable with native system UI fallbacks<br>
**Mono Font:** SFMono-Regular with Consolas and Liberation Mono fallbacks

**Character:** One application-led sans serif voice keeps the site direct and familiar. Tight headline spacing supplies authority without introducing an editorial display style.

### Hierarchy

- **Display:** Large, tightly set hero statements at medium-bold weight.
- **Headline:** Responsive section titles with the same compact rhythm.
- **Title:** Compact panel and card headings.
- **Body:** Plain-language explanation at comfortable reading measure.
- **Label:** Small, bold, uppercase component labels with deliberate tracking.
- **Mono:** Installer commands and code only.

### Named Rules

**The Application Type Rule.** Use self-hosted Inter for all interface and marketing copy. Monospace is reserved for commands and code.

## Layout

The main content width is capped at 1240px with 24px desktop gutters. Sections use generous vertical separation, while product panels remain compact and information-dense. The run sequence is horizontal on wide screens and becomes a connected vertical sequence below 900px. Arch nodes move from a freeform routed workspace to a two-column grid below 900px and a single column below 620px. The primary responsive breakpoints are 1120px, 900px, and 620px.

## Elevation & Depth

Depth is shallow and functional. Warm tonal layers and thin rules do most of the separation; small and large ambient shadows lift cards, workspaces, the sticky header, and primary actions. Dotted canvases belong only inside workflow workspaces.

### Named Rules

**The Shallow Depth Rule.** Use elevation to separate functional workspaces and active controls, not to create decorative scenery.

## Shapes

Controls use compact rounded corners from 8px to 12px. Product cards use 15px to 18px corners, major shells use 20px, and feature panels use 24px. Pills are reserved for statuses. Arch nodes retain distinct soft tints and visible connection ports; routes stay thin and directional.

## Components

### Buttons

- **Shape:** Compact utility control with a 10px radius and 42px default height.
- **Primary:** White text on Garden Orange with a restrained warm shadow.
- **Secondary:** Warm white surface, thin border, and Deep Ink text.
- **Hover / Focus:** A 1px lift on hover and a 3px translucent orange focus outline.

### Cards / Containers

- **Run cards:** Warm surfaces, 15px corners, thin borders, and small ambient shadows.
- **Workspaces:** Warm inset canvases with dotted grids, thin routes, and framed toolbars.
- **Evidence panels:** Evidence Wash backgrounds, green borders, and supported-state chips.
- **Task plans:** Bordered panels split into request, scope, and action regions by thin rules.

### Navigation

The sticky header is a translucent warm canvas with a fine bottom rule. Desktop links are compact and quiet. Below 900px they move into a bordered utility menu with the download action retained.

### Arch Nodes

Agent, gate, terminal, and user-decision nodes use code-built HTML and SVG routes. Selection changes the border to orange and adds a soft focus ring. The inspector updates from the selected node without pretending to run a task.

## Do's and Don'ts

### Do:

- **Do** use self-hosted Inter, the application palette, node types, routes, and control language.
- **Do** present product behaviour as semantic HTML, CSS, and SVG.
- **Do** keep the request -> plan -> Arch -> evidence sequence legible on every viewport.
- **Do** reserve orange for action and green for evidence.

### Don't:

- **Do not** use editorial serif type, decorative paper texture, or ornamental labels.
- **Do not** use whole screenshots, distorted crops, or screenshots as background scenery.
- **Do not** invent product states, technical claims, or interface behaviour.
- **Do not** trade thin rules and compact controls for oversized decorative cards.
