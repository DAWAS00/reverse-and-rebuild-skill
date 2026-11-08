# Splitting and testing a Rust/egui GUI

The full rules for Diagram Studio are in `.claude/skills/diagram-studio-maintainability/` (architecture and testing references, plus a script). This is the transferable recipe.

## Shape

```
diagram-core      model, typed IDs, commands, validation, history (Undo/Redo). No egui, no SQL.
diagram-canvas    scene (shapes, anchors, hit areas), picking, gestures, viewport, SVG. Depends on core.
diagram-storage   schema v1, DTOs, save (temp file, check, replace), load, recovery. Depends on core.
diagram-desktop   egui shell: session, read model, intents, coordinator, one module per surface.
```

Why: anything pure can be tested with plain `cargo test`, without a window.

## Frame flow

1. A `Session` owns the core `Document` and its history.
2. A **read model** turns the document into plain rows (project panel, canvas, inspector). Pure functions, unit-tested.
3. Widgets draw from the read model and edit **drafts** (text being typed). They never change the document; they queue a typed `UiIntent`.
4. The **coordinator** (`apply_intents`) validates each intent and applies it as a core command. Results from background workers (save, load) come back through it too.
5. Painting never does I/O.

## Splitting a big file

1. Measure first (the maintainability script reports file size and public fields).
2. Move one surface at a time (entry screens, tabs, canvas, navigator, inspector) into its own module. Aim below ~500 lines; split before ~1,000.
3. A pure move is its own commit, with no behaviour change and all tests green before and after.
4. Move shared test helpers (`harness`, `harness_at`) into `tests/common/mod.rs`.
5. Make state private behind methods; each slice should lower, not raise, the count of public fields.

## Typed identity

Replace `SelectClass(usize)`-style intents with `ElementId`, `ViewId`, `RelationId` and `DiagramId`. Add tests that a stale ID (after delete or undo) is ignored with a written message, never a panic. Indexes drift when a list changes; IDs do not.

## Test layers

| Layer | Where | Proves |
|---|---|---|
| Pure unit | core, canvas, read model | rules, parsing, geometry, transitions |
| Storage | `diagram-storage/tests` | round trip, injected failure keeps the old file, corrupt and truncated files fail with a message, newer schema refused |
| Headless UI | `egui_kittest`, finding widgets by accessible name | a surface behaves; Enter commits, Escape cancels, errors keep focus |
| Usability audit | `tests/ui_audit.rs` | every screen: labels, ≥32 pt targets, no overlap at 800×500, 1280×800, 1440×900; disabled controls state why |
| Journey | `tests/journey.rs` | the whole path by keyboard through the accessibility tree |
| Real window | hand test with screenshots | what the user actually sees |

## UI rules to enforce

Every control has a visible label and accessible name; disabled controls say why; errors are words and fields keep focus; everything works from the keyboard; Escape closes text field, then dialog, then drawer, then selection, and focus returns to the opener; use only the theme tokens and shortcuts defined in one place.

## Gates

```bash
cargo fmt --all -- --check
cargo clippy --workspace --all-targets --all-features --locked -- -D warnings
cargo test --workspace --locked
cargo doc --workspace --no-deps --locked
```
