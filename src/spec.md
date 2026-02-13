# Specification

## Summary
**Goal:** Update the app’s contact email everywhere, and restore “send SMS from this device” deep-link actions alongside existing WhatsApp and phone-call actions with clear, accurate labels.

**Planned changes:**
- Replace `arinfotech@gmail.com` with `arinfotech1993@gmail.com` across all frontend UI surfaces and repository documentation references.
- On the Dashboard “Officer Messaging” card, add/restore an `sms:` deep-link action that opens the current device’s SMS app with the selected officer’s number and the composed message body, while keeping existing WhatsApp and `tel:` actions.
- Add “Send SMS from This Device” to each officer row in the Officers Directory, using an `sms:` deep link to that officer’s mobile number.
- Add inline fallback behavior for SMS deep-link failures on Dashboard and Officers screens: show a clear English error state and provide a one-click copy-to-clipboard for the message text.
- Update help text/labels to clearly distinguish WhatsApp handoff vs SMS via `sms:` link vs calling via `tel:` link, and avoid implying SMS is sent via any Arduino GSM/GPRS module.

**User-visible outcome:** Users see the updated contact email, can initiate SMS and phone calls from their current device via `sms:`/`tel:` links, and can still hand off messaging to WhatsApp—each option clearly labeled with a copy-message fallback if SMS deep linking can’t be opened.
