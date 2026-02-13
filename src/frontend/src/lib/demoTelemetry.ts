import type { Telemetry, TelemetryTimeSeries } from '../types/telemetry';

export function getDemoTelemetry(): Telemetry {
  return {
    temperature: 32,
    windSpeed: 15,
    humidity: 45,
    soilMoisture: 28,
    pirDetection: false,
    flameDetected: false,
    smokeLevel: 'Low',
    latitude: 12.9716,
    longitude: 77.5946,
  };
}

export function getDemoTimeSeries(): TelemetryTimeSeries[] {
  const now = Date.now();
  const data: TelemetryTimeSeries[] = [];
  
  for (let i = 11; i >= 0; i--) {
    const time = new Date(now - i * 3600000);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      temperature: 25 + Math.random() * 10,
      humidity: 40 + Math.random() * 20,
    });
  }
  
  return data;
}
