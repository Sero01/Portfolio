# Composer-Driven Guided Tour Design

## Goal

Turn the currently inert bottom composer into the engine of a guided walkthrough. When a section finishes rendering, the composer types out the prompt that leads to the next section, its send button pulsates, and clicking send advances there — mirroring the intro screen's type-and-pulse pattern.

## Behavior

Sections have a fixed order: `home → work → experience → projects → photos → contact`.

When a section's content finishes rendering, the composer types (character by character) the **next** section's own opening prompt into the composer text, then the send button begins to pulsate. The prompt text is reused verbatim from the next section's opening user bubble, so no new copy is authored and the typed text matches the user bubble that appears once that section renders. For example, on `home` the composer types "Show me your strongest work"; sending renders `work`, whose thread opens with that same line.

Clicking the composer send button while a prompt is pending advances to that pending section. It works even while the prompt is still typing — the click jumps straight to the next section.

`contact` is the terminus: it has no next section, so the composer stays at its idle placeholder and the send button does not pulsate. The tour ends where the visitor should act — the contact form.

Navigation is not strictly linear. The sidebar still jumps to any section directly. Landing anywhere recomputes the composer's next prompt for that spot, so the guided flow resumes from wherever the visitor is.

Under reduced motion, the next prompt is set instantly without the typing animation, and the send button does **not** pulsate (an endlessly pulsing control is exactly what reduced motion opts out of); the button remains clickable.

## Architecture

**Tour order.** Add `TOUR_ORDER = ['home', 'work', 'experience', 'projects', 'photos', 'contact']` and a `nextSection(key)` helper returning the following key, or `null` for `contact`. The prefill text for a target section is `content[target].thread[0].u` — every section's thread already opens with a `{u: … }` bubble, so this needs no new content.

**Composer as typed display.** The existing `.composer-placeholder` span is the text target (it stays a display element — not editable). A blinking caret reuses the intro's `.typing-caret` element and `blink` keyframe. A state class on `.composer` (e.g. `.has-prompt`) un-mutes the text color and reveals the caret; its absence restores the idle muted placeholder.

**Completion hook.** `render()`'s internal `next()` recursion already reaches one terminal point when its queue empties. Call a new `onSectionComplete(key, seq)` there — this covers normal sections and `photos` (which starts its infinite loop at that same point, so the next prompt appears while photos keep streaming below). The hook computes `nextSection(key)`; when a next section exists it types the prompt into the composer (sequence-guarded, char by char like `typeIntro`) and, on finish, adds `.pulse` to `.composer-send` and sets a module-level `pendingNext` to the destination key. When there is no next section it leaves the composer idle with no pulse and `pendingNext = null`.

**Send wiring.** A click handler on `.composer-send` renders `pendingNext` when it is set.

**Reset on every render.** At the top of `render()`, clear any composer-typing timer, remove `.pulse` from `.composer-send`, reset the composer to its idle placeholder, and clear `pendingNext`. All composer async is guarded by the existing `renderSeq`, so navigating away mid-type cancels cleanly.

**CSS.** Add `.composer-send.pulse` reusing the existing `@keyframes sendPulse`, plus the `.composer.has-prompt` state rule for the un-muted text and caret.

## Testing

Add `tests/composer-tour.test.js` with static source assertions, matching the existing test style:

- `TOUR_ORDER` is present and in the exact section order.
- `nextSection` returns the following section and `null` for `contact`.
- The prefill text is sourced from `thread[0].u`, not a hand-written duplicate.
- `onSectionComplete` is invoked from the render completion path (queue-empty terminal), covering the photos loop start.
- Composer typing is sequence-guarded against stale renders and clears its timer on re-render.
- `.composer-send` click renders `pendingNext`.
- `.composer-send.pulse` reuses `sendPulse` in the CSS.
- Reduced motion sets the prompt text instantly and skips the pulse.

Run the new test first and confirm it fails, then implement and run the full suite.

## Out of Scope

- Making the composer an editable free-text input with query handling.
- Any looping back to `home` after `contact`.
- New transition copy — prompts are reused from each section's opening bubble.
- Changing existing section content, reveal timing, or the intro screen behavior.
