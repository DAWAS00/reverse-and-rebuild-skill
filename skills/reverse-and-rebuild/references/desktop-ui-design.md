# Designing the desktop UI (egui)

Use this when you design or review a screen of the rebuilt app. It applies the priorities of the `ui-ux-pro-max` skill to a **native desktop editor** (Rust/egui, mouse and keyboard, resizable window), not a phone app. Where the project has its own rules file (`UI-RULES.md`), that file wins; this guide says how to think about them. Mobile-only rules (safe areas, haptics, swipe) do not apply.

## Priorities (check in this order)

| # | Area | Must have | Avoid |
|---|---|---|---|
| 1 | Accessibility | contrast ≥ 4.5:1 text and ≥ 3:1 for icons and borders; visible focus ring; accessible name on every control; full keyboard path | removing focus rings; icon-only buttons with no label; meaning by colour alone |
| 2 | Interaction | targets ≥ 32 pt high with ≥ 8 pt gaps; press, hover and disabled states that differ; feedback within ~100 ms | hover-only actions; controls that look usable but do nothing |
| 3 | Style | one style across all screens; one icon family and stroke width; one primary action per screen | mixing flat and glossy; emoji as icons |
| 4 | Layout | works at 800×500, 1280×800 and 1440×900 with no overlap and no clipped text; consistent regions | fixed pixel widths that overflow; nested scroll areas |
| 5 | Type and colour | a small set of text roles; semantic colour tokens | raw hex or ad-hoc font sizes in a screen |
| 6 | Motion | short (150–250 ms), only to explain a change; honour reduced motion | decorative animation; blocking input while animating |
| 7 | Forms and feedback | visible labels; errors in words next to the field; fields keep focus on error | placeholder-only labels; errors only in a banner |
| 8 | Navigation | the same place for the same thing; current location shown; Escape always backs out | modals as main navigation |

## Layout and hierarchy

- A fixed shape for the editor: **menu bar**, **tool row**, **left navigator** (project tree), **centre canvas** with tabs, **right inspector**, **status bar**. Keep each in the same place on every screen.
- The canvas gets the space. Side panels are resizable and collapse at small widths; at 800×500 the inspector becomes a drawer, opened by a labelled button.
- Hierarchy through size, weight, spacing and contrast, not colour alone. One primary action per dialog; secondary actions are visually quieter; destructive actions use the danger colour and sit apart.
- Spacing on a 4/8 pt scale. Group related controls; separate groups with space, not boxes everywhere.
- Empty states say what is missing and give the next action ("No classes yet. Choose Class, then click the canvas.").

## Tokens (one file, no literals in screens)

Define once (for example `ui/theme.rs`) and use only these in screens:

- **Colour roles:** background, surface, surface-raised, border, text, text-muted, accent, accent-text, danger, warning, success, focus, selection, canvas-grid. Each defined for light **and** dark, designed together, not inverted.
- **Text roles:** title, heading, body, label, caption, mono (for member text). A minimum size for body text (≥ 13 pt on desktop).
- **Spacing and size:** the 4/8 scale, control height (32), icon sizes, corner radius, stroke widths, elevation levels.
- **Motion:** one duration and one easing for UI changes.
- A test that scans screen code for colour literals and raw sizes is cheap and keeps the rule honest.

## Accessibility

- Every control has a **visible label** and an **accessible name** that matches it. Icon buttons get both a tooltip and a name.
- Tab order follows visual order. Focus is always visible and never trapped.
- **Escape order:** closes the text field first, then the dialog, then the drawer, then the selection. Focus returns to the control that opened the thing.
- Do not rely on colour: pair status colours with text or an icon.
- Support system text scale and Windows display scaling; check long and right-to-left names (Arabic) and mixed text for clipping and caret behaviour.
- Test through the accessibility tree (what a screen reader sees), not only pixels.

## Themes

- Light and dark are designed together and tested separately: contrast, borders, dividers, selection, focus ring and disabled state all checked in both.
- Canvas content (shapes, lines, text) uses theme roles too, so exports can choose a fixed light palette on purpose.
- Never judge dark mode from the light values.

## States every control needs

default · hover · pressed · focused · selected · disabled (**with a stated reason**) · busy · error. Also for a screen: empty, loading (skeleton or progress after 300 ms), error with a recovery action, and unsaved/dirty.

- A disabled control explains why in a tooltip or nearby text ("Not available yet: …"). Do not hide it.
- Destructive actions confirm, or offer Undo, and say how many items are affected.
- Errors say the cause and the fix, in words ("Multiplicity must be like 1, 0..1 or 0..*").

## Keyboard

- Every action has a keyboard path; shortcuts are defined in one table (`commands`) and shown in menus and tooltips.
- Do not override system shortcuts. Offer keyboard alternatives for anything done by dragging (move by arrow keys, connect from a menu).
- Command search (Ctrl+K) lists every command with its shortcut and disabled reason.
- Enter commits a field, Escape cancels it, Tab moves on; the field keeps focus when validation fails.

## Window sizes

Design and test at **800×500**, **1280×800** and **1440×900**.

- No horizontal page scroll; no text clipped; no overlapping controls at any of the three.
- At the smallest size: panels collapse to drawers, toolbars wrap or move into an overflow menu with labelled items, the canvas stays usable.
- Add each screen to the usability-audit test so a layout regression fails a test.

## Canvas interaction design

- Selection, hover and drag states are visible; handles are large enough to hit (≥ 12 pt hit area).
- A drag starts only after a small movement threshold; Escape cancels it; one drag is one Undo step.
- Connectors follow moved shapes; end labels (parent/child, multiplicity) are readable and do not overlap shapes.
- Zoom and pan have buttons and shortcuts as well as the mouse wheel.

## Review checklist

- [ ] Every control labelled, named, ≥ 32 pt, with a reason when disabled
- [ ] Only theme tokens and text roles; no literals
- [ ] Light and dark checked; contrast measured
- [ ] Keyboard-only run of the screen, Escape order and focus return
- [ ] 800×500, 1280×800, 1440×900 screenshots saved; no overlap or clipping
- [ ] Empty, error, busy and dirty states exist and are worded
- [ ] Headless test and an audit entry added; real window checked
