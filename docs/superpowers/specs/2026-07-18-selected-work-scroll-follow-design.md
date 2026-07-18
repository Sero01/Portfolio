# Selected Work Scroll-Follow Design

## Goal

Keep each Selected Work card visible as it reveals, reinforcing the feel of sequential incoming messages.

## Behavior

When the Selected Work answer renders, the chat follows the three cards at their reveal points: immediately for the first card, after one second for the second, and after two seconds for the third. Each follow action smoothly scrolls the corresponding card to the end of the chat viewport.

If the user changes sections before a scheduled follow action runs, that stale callback does nothing. Under reduced motion, the final card is brought into view immediately without smooth scrolling or delayed callbacks.

## Architecture

Add a `followWorkReveals(answer, seq)` helper beside the existing project reveal follower. It queries `.work-list .work-card`, schedules each card using its zero-based position and the same one-second interval as the reveal CSS, and validates the current render sequence before scrolling. Call it from the assistant-message completion path after reveal classes and indices are assigned.

## Testing

Add static behavior assertions covering:

- Selection of work cards only
- Delays of `index * 1000`
- Stale render-sequence protection
- Smooth end-aligned scrolling for normal motion
- Immediate final-card scrolling for reduced motion
- Invocation during assistant message completion

Run the focused Selected Work test first and confirm it fails, then implement the helper and run the full test suite.

## Out of Scope

- Changing the card reveal intervals
- Changing the side-project gallery follower
- Auto-scrolling after the reveal sequence finishes
- Forcing the scroll position after user navigation
