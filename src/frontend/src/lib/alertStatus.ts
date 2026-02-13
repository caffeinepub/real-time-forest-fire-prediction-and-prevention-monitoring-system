import type { Telemetry } from '../types/telemetry';

export interface AlertLevel {
  level: 'safe' | 'warning' | 'critical';
  message: string;
}

export interface AlertStatus {
  prediction: AlertLevel;
  prevention: AlertLevel;
}

export function getAlertStatus(telemetry: Telemetry): AlertStatus {
  // Prevention: Active fire detection (flame + smoke)
  if (telemetry.flameDetected || (telemetry.smokeLevel && telemetry.smokeLevel !== 'Low')) {
    return {
      prediction: { level: 'warning', message: 'Environmental conditions monitored' },
      prevention: {
        level: 'critical',
        message: 'Fire detected! Flame sensor and/or smoke sensor activated. Immediate response required.',
      },
    };
  }

  // Prediction: High risk conditions
  const temp = telemetry.temperature || 0;
  const humidity = telemetry.humidity || 100;
  const soilMoisture = telemetry.soilMoisture || 100;

  if (temp > 35 && humidity < 30 && soilMoisture < 20) {
    return {
      prediction: {
        level: 'warning',
        message: 'Elevated fire risk: High temperature, low humidity, and dry soil conditions detected.',
      },
      prevention: { level: 'safe', message: 'No active fire detected' },
    };
  }

  return {
    prediction: { level: 'safe', message: 'Environmental conditions normal' },
    prevention: { level: 'safe', message: 'No active fire detected' },
  };
}
