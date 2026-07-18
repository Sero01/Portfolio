# Global Twenty-Percent Scale Design

## Goal

Make the entire portfolio interface appear 20% larger without clipping the application or changing individual component proportions.

## Design

Apply `zoom: 1.2` to the document body so typography, spacing, controls, imagery, borders, and animation distances scale together. Compensate the body's layout dimensions to `83.333333%` for both width and height, because `1 / 1.2 = 0.83333333`. After zoom is applied, the body occupies the full visual viewport rather than overflowing it.

Keep the existing `html` viewport dimensions and overflow containment. Existing responsive breakpoints remain based on the browser viewport, and components retain their current internal proportions.

## Compatibility and Fallback

Use the standard CSS `zoom` property. Browsers without effective zoom support retain the current unscaled layout rather than receiving a transform-based fallback that could clip fixed elements or break pointer coordinates.

## Testing

Add a focused static assertion that the body has `zoom:1.2` and compensated width and height. Confirm the test fails before changing production CSS, then run the complete suite.

## Out of Scope

- Retuning individual font sizes or spacing values
- Changing responsive breakpoint values
- Scaling browser chrome or operating-system UI
- Adding user-selectable zoom controls
