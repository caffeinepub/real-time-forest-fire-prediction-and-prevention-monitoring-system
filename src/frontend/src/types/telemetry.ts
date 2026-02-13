export interface Telemetry {
  temperature?: number | null;
  windSpeed?: number | null;
  humidity?: number | null;
  soilMoisture?: number | null;
  pirDetection?: boolean;
  flameDetected?: boolean;
  smokeLevel?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface TelemetryTimeSeries {
  time: string;
  temperature: number;
  humidity: number;
}
