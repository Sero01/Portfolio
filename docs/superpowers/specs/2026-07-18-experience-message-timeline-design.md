# Experience message timeline

**Date:** 2026-07-18  
**Status:** Approved in conversation

## Goal

Present each professional role as its own assistant message while preserving the
visual continuity of the existing vertical timeline and its orange role dots.

## Conversation sequence

The Experience section contains five assistant messages after the existing user
prompt:

1. A short introduction with the eyebrow and heading.
2. Senior Analyst — AI Engineer, Northern Trust, Apr 2026–present.
3. Analyst, Software Engineer, Northern Trust, Aug 2024–Mar 2026.
4. Front-End Engineering Intern, Northern Trust, Jun–Sep 2023.
5. Full-Stack Developer Intern, Skoda Volkswagen Training Academy,
   Oct 2022–Mar 2023.

Each role retains its current date, organization, and bullet-point copy.

## Timeline presentation

- Every role is rendered through the existing assistant-message pipeline, not as
  a visually divided block inside one answer.
- Role messages share a timeline marker class so CSS can draw the connector in
  the answer column across the gaps between messages.
- Each role has one orange dot aligned with its role header.
- The first role begins the line at its dot; the last role ends the line at its
  dot. Middle roles connect in both directions.
- The assistant `P` mark remains visible for each separate message.
- Every role's bullet-point story is visible as soon as its message renders.
- Roles are static content: no hover expansion, click toggling, pointer cursor,
  or disclosure hint is shown.

## Motion and responsiveness

- Messages use the current staged thinking/reveal cadence.
- The timeline line remains continuous at desktop and mobile widths.
- Reduced-motion mode displays the same message structure without animation.
- Navigating away invalidates the existing render sequence so queued Experience
  messages do not continue rendering in another section.

## Implementation boundaries

The change is limited to the Experience content queue, assistant-row metadata,
and timeline CSS. Other sections, role copy, counter timing, and intro behavior
remain unchanged.

## Verification

- Automated checks confirm one intro plus four distinct Experience assistant
  messages and first/middle/last timeline marker metadata.
- Browser verification confirms separate `P` messages, a visually continuous
  connector and four aligned dots at desktop and mobile widths.
- The full static test suite and JavaScript syntax checks remain green.
