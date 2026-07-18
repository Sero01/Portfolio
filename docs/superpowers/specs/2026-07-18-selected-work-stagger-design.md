# Selected Work One-Second Stagger Design

## Goal

Reveal the three cards in the Selected Work section sequentially: the first card immediately, the second after one second, and the third after two seconds.

## Design

Keep the existing `rise` animation and the indices already assigned by `cascadeBlocks`. Add a Selected Work-specific CSS rule for `.work-card.rise` whose animation delay is `calc(var(--i) * 1s)`. This overrides the shared 70ms stagger only for work cards, so animation timing in every other section remains unchanged.

The existing reduced-motion rule continues to remove animation delays and display all cards immediately.

## Testing

Add a focused assertion to the Selected Work test that verifies the scoped one-second delay rule. Run that test first and confirm it fails before changing production CSS, then run the full test suite after implementation.

## Out of Scope

- Changing the card animation style or duration
- Delaying the Selected Work heading or introductory copy
- Changing reveal timing in the side-project gallery or other sections
- Adding JavaScript timers or scroll-following behavior
