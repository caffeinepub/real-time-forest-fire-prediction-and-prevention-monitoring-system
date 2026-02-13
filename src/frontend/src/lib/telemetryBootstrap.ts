/**
 * Firebase Realtime Database telemetry bootstrap helper
 * 
 * Provides a function to initialize/merge canonical telemetry fields
 * at the database root without destroying unrelated nodes like /officers.
 */

import { firebaseConfig } from './firebase';

export interface TelemetryBootstrapPayload {
  temperature: number | null;
  windSpeed: number | null;
  humidity: number | null;
  soilMoisture: number | null;
  pirDetection: boolean;
  flameDetected: boolean;
  smokeLevel: number | null;
  latitude: number | null;
  longitude: number | null;
}

/**
 * Initialize Firebase RTDB root telemetry fields with placeholder defaults.
 * Uses PATCH to merge fields without deleting unrelated nodes (e.g., /officers).
 * 
 * @returns Promise that resolves on success or rejects with a human-readable error
 */
export async function initializeTelemetryFields(): Promise<void> {
  const payload: TelemetryBootstrapPayload = {
    temperature: null,
    windSpeed: null,
    humidity: null,
    soilMoisture: null,
    pirDetection: false,
    flameDetected: false,
    smokeLevel: null,
    latitude: null,
    longitude: null,
  };

  try {
    // Use PATCH to merge fields at root without destroying existing data
    const url = `${firebaseConfig.databaseURL}/.json`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Firebase initialization failed: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    // Success - fields are now initialized at root
    console.log('Firebase telemetry fields initialized successfully');
  } catch (error) {
    // Network error or other failure
    if (error instanceof Error) {
      throw new Error(`Failed to initialize Firebase telemetry fields: ${error.message}`);
    } else {
      throw new Error('Failed to initialize Firebase telemetry fields: Unknown error');
    }
  }
}
