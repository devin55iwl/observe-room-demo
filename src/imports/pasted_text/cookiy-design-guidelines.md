# Cookiy Design Guidelines

## General

* Use `react-router` v7 (not `react-router-dom`) with `createBrowserRouter` and `RouterProvider`.
* Use `motion` (imported as `import { motion } from "motion/react"`). Never call it "Framer Motion".
* All custom components live in `/src/app/components/`. Import with relative paths.
* Keep file sizes small. Extract sub-views (e.g. `RecruitmentTab.tsx`) into their own files and import them from the parent page.
* Prefer flexbox and CSS grid for layout. Only use absolute positioning for decorative overlays, tooltips, and dropdowns.
* Refactor as you go to keep code clean; avoid duplicating style strings across files.

---

## Color Palette

Strictly **pure black, grey, and white**. No purple, indigo, blue brand colors, or any hue-based accent.

| Token | Value | Usage |
|---|---|---|
| Primary text | `text-black` or `text-black/80` | Headings, active labels |
| Secondary text | `text-black/50` or `text-black/40` | Body copy, descriptions |
| Tertiary text | `text-black/30` or `text-black/25` | Captions, metadata, inactive items |
| Disabled text | `text-black/15` or `text-black/20` | Placeholder, ghost elements |
| Primary button | `bg-black text-white` | CTAs (Share, pagination active) |
| Primary button hover | `hover:bg-[#333]` | Dark buttons |
| Primary button shadow | `shadow-[0_2px_16px_rgba(0,0,0,0.2)]` | Elevated CTA emphasis |

### Status Badges (exception to monochrome rule)

Status badges are the **only** elements that use color, via soft Tailwind utility backgrounds:

| Status | Background | Text |
|---|---|---|
| In Progress | `bg-blue-100` | `text-blue-600` |
| Complete / Approved | `bg-emerald-100` | `text-emerald-600` |
| Draft | `bg-gray-100` | `text-gray-500` |
| Pending | `bg-amber-100` | `text-amber-600` |
| Paused | `bg-amber-100` | `text-amber-600` |
| Rejected | `bg-red-100` | `text-red-600` |

Badge shape: `font-['Inter',sans-serif] text-[11px] px-2 py-0.5 rounded-md inline-flex items-center w-fit`

---

## Typography

* **Primary font**: `font-['Geist',sans-serif]` for all UI text (labels, headings, body, navigation).
* **Badge font**: `font-['Inter',sans-serif]` for status badges and small pill labels only.
* Fonts are imported via Google Fonts in `/src/styles/fonts.css`.
* Do **not** use Tailwind font-size classes (e.g. `text-2xl`) or font-weight classes (e.g. `font-bold`) unless explicitly asked. Use explicit `text-[Xpx]` values instead.
* Common sizes:
  - Page title: `text-[28px]` or `text-[32px]`, `tracking-tight`
  - Section heading: `text-[22px]`, `tracking-tight`
  - Body text: `text-[15px]`, `leading-[1.8]` (via style prop)
  - UI labels / buttons: `text-sm` (14px)
  - Small labels / metadata: `text-xs` (12px)
  - Micro labels: `text-[10px]` or `text-[11px]`
  - Table headers: `text-[10px] uppercase tracking-[0.15em]`
  - Section labels: `text-[10px] uppercase tracking-[0.15em]` or `tracking-[0.12em]`

---

## Frosted Glass System

The core visual identity. Three tiers of translucency:

### 1. Navigation (transparent - blends into background)

Sidebar and toolbars have **no visible container boundary** against the gradient background. They use subtle translucent fills that merge with the ambient blobs.

```
Sidebar:        bg-white/40 backdrop-blur-2xl border-r border-white/50 shadow-[1px_0_12px_rgba(0,0,0,0.03)]
Top nav bar:    bg-white/60 backdrop-blur-2xl border-b border-white/70 shadow-[0_1px_8px_rgba(0,0,0,0.03)]
Secondary bar:  bg-white/50 backdrop-blur-xl border-b border-white/60
```

### 2. Content Cards (frosted glass panels)

Individual content elements use semi-transparent white backgrounds with blur:

```
Standard card:      bg-white/50 backdrop-blur-xl rounded-2xl border border-white/70 shadow-[0_2px_16px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.7)]
Elevated card:      bg-white/55 backdrop-blur-2xl rounded-2xl border border-white/70 shadow-[0_2px_20px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.7)]
Nested inner card:  bg-white/40 backdrop-blur-sm rounded-xl border border-white/60
```

The `inset_0_1px_0_rgba(255,255,255,0.7)` inner highlight is critical for the glass edge effect.

### 3. Interactive Elements (subtle glass)

Buttons, toggles, search bars, and inputs use lighter glass:

```
Search bar:        bg-white/50 backdrop-blur-xl border border-white/60 rounded-full shadow-[0_1px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.6)]
Active pill tab:   bg-white/60 border border-white/70 shadow-[0_1px_6px_rgba(0,0,0,0.04)]
Hover state:       hover:bg-white/50 or hover:bg-white/40
Active nav item:   bg-white/60 border border-white/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)]
```

---

## Background

Defined in `GradientBackground.tsx`. Fixed position, layered:

1. Base gradient: `bg-gradient-to-br from-[#f0f1f3] via-[#f3f3f5] to-[#f0f2f4]`
2. Ambient blobs: 5 large `radial-gradient` circles in neutral grays (`rgba(170-190, 175-190, 185-200, 0.10-0.14)`)
3. Noise texture: SVG `feTurbulence` at `opacity-[0.015]`

Never add colored blobs. Keep all gradients in the gray/neutral range.

---

## Layout Patterns

### Sidebar (`Sidebar.tsx`)

* Fixed left, full height. Two widths: expanded `w-[260px]`, collapsed `w-[68px]`.
* Collapse state managed via `SidebarContext.tsx` (`useSidebar()` hook).
* Main content uses `ml-[260px]` or `ml-[68px]` with `transition-all duration-300`.
* Nav items: `flex items-center gap-2.5 py-2 rounded-xl` with `px-3` (expanded) or `justify-center px-0` (collapsed).
* Active nav item gets `bg-white/60 border border-white/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)]`.
* Inactive nav items get `hover:bg-white/50 transition-all`.

### Top-Level Tabs (Study Detail)

Centered using a 3-column grid: `grid grid-cols-[1fr_auto_1fr] items-center`

* Tab style: `text-sm`, icon + label, no background.
* Active: `text-black/80` with a 2px underline indicator `absolute bottom-[-9px] left-3 right-3 h-[2px] rounded-full bg-black/70`.
* Inactive: `text-black/30 hover:text-black/50`.

### Second-Level Tabs (Sub-tabs)

Left-aligned pill tabs (not centered, no underline):

* Active: `bg-white/60 border border-white/70 text-black/80 shadow-[0_1px_6px_rgba(0,0,0,0.04)] rounded-xl`
* Inactive: `text-black/30 hover:text-black/50 hover:bg-white/40 rounded-xl`

---

## Shapes & Corners

* Cards and panels: `rounded-2xl` (16px)
* Buttons and interactive elements: `rounded-xl` (12px)
* Search bars, CTAs, pill toggles: `rounded-full`
* Status badges: `rounded-md`
* Small stat boxes and nested elements: `rounded-xl`

---

## Icons

* Primary icon library: **lucide-react**.
* Custom SVG icons imported from `/src/imports/svg-*.ts` files for brand-specific icons (Cookiy logo, folder shapes, filter icon, view toggles).
* Custom SVGs use ~18x18 viewBox with `strokeWidth="1.25"`.
* Lucide icons at `w-5 h-5` should use `strokeWidth={1.67}` to visually match the custom SVG stroke weight (due to lucide's 24x24 viewBox).
* Lucide icons at `w-4 h-4` for inline/toolbar use: `strokeWidth={1.75}`.
* Lucide icons at `w-3.5 h-3.5` for compact use: default stroke or `strokeWidth={1.75}`.
* Icon colors follow text opacity hierarchy: `text-black/50` default, `text-black/30` muted, `text-black/25` disabled.

---

## Study Cards (`StudyCard.tsx`)

Folder-shaped cards with a tab extending from the top-left corner:

* **Clip path**: SVG `clipPath` with `clipPathUnits="objectBoundingBox"` coordinates. The tab uses a smooth concave S-curve dip where it meets the body.
* **Border**: Separate SVG overlay with `vectorEffect="non-scaling-stroke"` for a consistent 1px border regardless of card size.
* **Hover**: Background transitions from `bg-white/45` to `group-hover:bg-white/70`.
* **Selected**: `bg-white/70 shadow-[0_4px_24px_rgba(0,0,0,0.08)]`.
* **Document preview**: `DocPreview.tsx` renders miniature Google Doc-style content inside the card thumbnail.
* **Shadow overlay**: 28px tall gradient (`rgba(0,0,0,0.12)`) at the thumbnail bottom for a 3D tucked-in effect. Fades out on click via Motion animation.
* **Owner avatar**: `OwnerAvatar.tsx` with neutral gray background (`bg-black/[0.06] text-black/40`), generates initials from name.

---

## Tables

### Cell-Based Glass Pattern

The frosted glass background is applied to **every individual `<th>` and `<td>` cell** rather than the table wrapper:

```
th: bg-white/50 backdrop-blur-xl
td: bg-white/50 backdrop-blur-xl
```

This prevents double-layering opacity mismatch where sticky columns would appear more opaque than non-sticky cells.

### Table Wrapper

The wrapper only handles structure and decoration:

```
border border-white/60 rounded-2xl shadow-[0_1px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.6)] overflow-hidden
```

### Table Headers

```
font-['Geist',sans-serif] text-[10px] text-black/30 uppercase tracking-[0.15em] py-3 px-3
```

### Sticky Columns

Name column (left) and Actions column (right) use `position: sticky` with `borderRight`/`borderLeft: 1px solid rgba(0,0,0,0.08)`.

### Pagination

* Per-page selector (5, 10, 15, 25, 50) positioned left of page buttons.
* Row count indicator left-aligned: `text-xs text-black/30`.
* Active page: `bg-black text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] rounded-lg`.
* Inactive page: `text-black/40 hover:bg-white/50 rounded-lg`.

---

## Scrollbars

Avoid complex inline Tailwind v4 arbitrary selectors for scrollbar styling. Use the `.scrollbar-white` CSS class defined in `/src/styles/theme.css`:

```css
.scrollbar-white::-webkit-scrollbar { height: 8px; }
.scrollbar-white::-webkit-scrollbar-track { background: transparent; }
.scrollbar-white::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.6); border-radius: 9999px; }
.scrollbar-white::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.8); }
```

For Firefox, use inline style props:

```tsx
style={{ scrollbarColor: 'rgba(255,255,255,0.6) transparent', scrollbarWidth: 'thin' }}
```

---

## Modals & Overlays