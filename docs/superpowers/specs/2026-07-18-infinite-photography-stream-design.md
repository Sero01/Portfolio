# Infinite Photography Stream Design

## Goal

Turn Photography into a continuously arriving vertical chat stream that cycles through all 14 photos and supplied captions at approximately one photo per second without allowing the DOM to grow indefinitely.

## Content

The stream uses `assets/photos/photo-01.webp` through `photo-14.webp` in numeric order with these exact captions:

1. Bangalore traffic
2. Koi fish
3. Sinhagargh, Pune
4. Melancholic dusk
5. Street lamp
6. Marigold
7. Muscat view point
8. Bandar Al Khairan
9. Sultan's cruise
10. Between the walls
11. Flowers beyond
12. Sonder
13. The fishermen
14. The arch

After photo 14, the sequence restarts at photo 1.

## Rendering and Timing

The existing Photography heading renders first. The stream then appends one assistant photo message at the existing photo cadence: typing delay plus reveal and inter-message gap total approximately one second. Each inserted photo scrolls into view through the existing chat scroll behavior.

The loop is tied to the active render sequence. Switching to another portfolio section invalidates the sequence, so the next scheduled iteration exits without appending another photo.

## Bounded DOM

After each photo finishes rendering, photo-loop messages whose bottom edge is fully above the chat viewport are removed. The currently visible message and any partially visible message remain. Non-photo messages, including the Photography heading, are never removed by the pruning function.

## Accessibility and Motion

Every image uses its caption as alt text and retains the visible `FR-XX · caption` label. Reduced-motion mode skips typing animation but preserves the stream cadence and scrolling behavior. Image sizing continues to preserve native aspect ratio.

## Verification

Source-contract tests verify the complete ordered photo set, exact captions, wraparound indexing, roughly one-second cadence, active-render cancellation, viewport-based pruning, and protection of non-photo messages. The full Node test suite must pass.
