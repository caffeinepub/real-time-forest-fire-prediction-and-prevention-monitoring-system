# Specification

## Summary
**Goal:** Help admins and Arduino writers reliably initialize and write telemetry into Firebase Realtime Database by documenting the canonical root schema and adding an admin-only bootstrap action in the web app.

**Planned changes:**
- Add `frontend/FIREBASE_RTDB_FIELDS.md` with a complete, copy-pasteable JSON example for the RTDB root (`/`) containing the canonical telemetry fields: `temperature`, `windSpeed`, `humidity`, `soilMoisture`, `pirDetection`, `flameDetected`, `smokeLevel`, `latitude`, `longitude`.
- Document that the app reads telemetry from the RTDB root path `/` at `https://forest-fire-iot-new-default-rtdb.asia-southeast1.firebasedatabase.app`, and that Arduino should write sensor values directly to those root-level fields.
- Document supported Arduino alias field names (e.g., `wind`, `earthMoisture`, `pir`, `flame`, `smoke`, `lat`/`lng`) and how they map to the canonical fields.
- Add an admin-only dashboard (or similarly discoverable) UI action (with confirmation) labeled in English to initialize the RTDB root telemetry fields with default placeholder values, without deleting unrelated nodes (e.g., `/officers`).
- Show clear success and error states in the UI for the initialization action, while preserving existing telemetry subscription behavior that reads from `/`.

**User-visible outcome:** Admins can initialize (bootstrap) the Firebase RTDB root telemetry fields from the web UI, and developers can copy a documented JSON schema to ensure Arduino writes match the app’s expected root-level telemetry fields and aliases.
