# Specification

## Summary
**Goal:** Ensure officers can be contacted only via a WhatsApp Calling handoff (no SMS actions and no device `tel:` calling links), while keeping the alert message copy-to-clipboard workflow.

**Planned changes:**
- Remove all SMS-related UI actions and related interaction/error states from the officer messaging composer and officers list actions.
- Remove all device-based calling via `tel:` links from the officer messaging composer and officers list actions.
- Update the Dashboard Officer Messaging card to present a WhatsApp call handoff action (open WhatsApp, then guide the user in English to start the voice call inside WhatsApp) and ensure all help text references only WhatsApp handoff and copying the message.

**User-visible outcome:** Users can no longer send SMS or place device calls from the app; they can open WhatsApp for an officer and are guided to start the voice call inside WhatsApp, while still being able to copy the composed alert message.
