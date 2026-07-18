# User-controlled portfolio intro

**Date:** 2026-07-18  
**Status:** Approved in conversation

## Goal

Make the introduction lead with Parvez's identity and require an intentional
Send-button click before any portfolio content renders.

## Visual hierarchy

- `Hi, I am Parvez` is the large primary heading.
- `What would you like to know?` is a smaller supporting line.
- The existing prompt types `Tell me about yourself`.
- When typing finishes, the simulated cursor moves to the Send button and
  pulsates there until the user clicks Send.

## Interaction

- The intro remains visible indefinitely until the real Send button is clicked.
- The simulated cursor never clicks or launches the site automatically.
- Clicking elsewhere on the intro does not launch the site.
- Enter and Escape do not launch the site.
- Clicking the Send button runs the existing intro exit transition, reveals the
  app shell, and only then renders the home conversation.
- Theme and other intro controls retain their current behavior.

## Accessibility and motion

- The Send button remains a native keyboard-focusable button, so focused
  keyboard activation still works normally.
- Under `prefers-reduced-motion`, the completed prompt is shown immediately and
  the decorative cursor is hidden. Send must still be activated to continue.
- The app remains `aria-hidden="true"` until launch and becomes available only
  after Send activation.

## Implementation boundaries

The change is limited to the intro markup hierarchy, intro styling, and intro
launch logic. Portfolio content, navigation, theme selection, and conversation
rendering are unchanged.

## Verification

- Automated checks cover heading hierarchy and ensure only Send activates the
  launch path.
- Browser-level verification confirms the cursor rests and pulses over Send,
  the app does not appear while waiting, and Send reveals the home content.
- Reduced-motion behavior is checked separately.
