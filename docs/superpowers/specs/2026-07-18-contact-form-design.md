# Contact Form Design

## Goal

Add a screenshot-inspired contact form to the “Let’s talk” section that submits to Formspree and reports success inline.

## Form Structure

The form posts to `https://formspree.io/f/xdaqgnvj` with method `POST`. Its fields are:

- Name: text input, required
- Email: email input, required
- Service Needed?: select, required, with an empty prompt followed by Build agentic systems, AI Automations, Frontend design, Backend Development, and Others
- What can I help you…: textarea, optional

Every field has a visible label and a stable `name` for Formspree. Native browser validation remains enabled. The existing email, GitHub, and LinkedIn links remain available below the form.

## Visual Design

Follow the reference composition: Name and Email share a two-column row on wider screens, while Service and Message span the full width. Controls use generous padding, rounded corners, subdued surfaces, and the portfolio’s orange accent for labels, focus states, and the submit button. On narrow screens, Name and Email stack into one column. Colors come from existing theme variables so the form works in light and dark modes.

## Submission Flow

JavaScript listens for `submit`, disables the submit button, and sends the form with `fetch`, `FormData`, and `Accept: application/json`. A successful Formspree response resets the form and replaces its status area with an inline success message. A failed response or network error preserves the entered values, restores the button, and displays an inline error with a retry instruction.

If JavaScript is unavailable, the native form action still submits to Formspree, providing progressive enhancement.

## Accessibility

- Labels are explicitly associated with controls.
- Required fields use the HTML `required` attribute.
- Email uses `type="email"`.
- Submission status uses an `aria-live="polite"` region.
- Disabled and focus states remain visually distinguishable.

## Testing

Static tests verify the endpoint, method, field names, required/optional rules, exact service choices, inline status region, fetch submission, success reset/message, failure message, and responsive form styling. Tests are written and observed failing before production changes, then the full suite is run.

## Out of Scope

- File attachments
- CAPTCHA configuration
- Persisting drafts
- Custom server-side processing
- Changing the global header contact link
