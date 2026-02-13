import { create } from 'zustand';
import type { Telemetry } from '../types/telemetry';

interface TelemetryStore {
  telemetry: Telemetry;
  setTelemetry: (telemetry: Telemetry) => void;
}

export const useTelemetryStore = create<TelemetryStore>((set) => ({
  telemetry: {},
  setTelemetry: (telemetry) => set({ telemetry }),
}));
