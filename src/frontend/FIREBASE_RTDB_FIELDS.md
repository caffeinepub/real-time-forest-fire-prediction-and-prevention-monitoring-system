# Firebase Realtime Database Field Reference

This document describes the Firebase Realtime Database structure used by the Forest Fire Monitoring System.

## Database Configuration

**Database URL:** `https://forest-fire-iot-new-default-rtdb.asia-southeast1.firebasedatabase.app`

**Region:** Asia Southeast 1 (Singapore)

## Manual Database Setup

You can manually create and populate the Firebase Realtime Database using the Firebase Console, REST API, or IoT devices. Below are the exact field names and paths the application expects.

---

## Root Path Telemetry Fields (`/`)

**Important:** The application reads real-time sensor data from the **root path** (`/`) of the database. Each sensor value should be written **directly at the root level**.

### Canonical Field Names and Supported Aliases

| Canonical Name | Supported Alias(es) | Type | Description | Example Value |
|----------------|---------------------|------|-------------|---------------|
| `temperature` | - | number | Temperature in °C | `28.5` |
| `windSpeed` | `wind` | number | Wind speed in km/h | `12.3` |
| `humidity` | - | number | Relative humidity (%) | `65` |
| `soilMoisture` | `earthMoisture` | number | Soil moisture (%) | `45` |
| `pirDetection` | `pir` | boolean | PIR motion sensor status | `true` or `false` |
| `flameDetected` | `flame` | boolean | Flame sensor status | `true` or `false` |
| `smokeLevel` | `smoke` | number | Smoke level (0-100) | `15` |
| `latitude` | `lat` | number | GPS latitude | `20.2961` |
| `longitude` | `lng` | number | GPS longitude | `85.8245` |

**Note:** The frontend will recognize both the canonical name and any listed aliases. For example, you can write either `windSpeed` or `wind`, and the app will read it correctly.

### Device Implementation Requirements

**Arduino UNO Integration:**

The Arduino UNO device (with GSM/GPRS module using SIM 9692162224) is responsible for:

1. **Writing telemetry to Firebase RTDB root path** (`/`) using the canonical field names listed above
2. **Obtaining GPS coordinates** from the GSM/GPRS module's built-in GPS receiver and writing `latitude` and `longitude` fields
3. **Sending SMS alerts** to officers via GSM AT commands when fire conditions are detected

**REST API Write Method:**

The Arduino device uses Firebase REST API with PATCH method to write telemetry:

