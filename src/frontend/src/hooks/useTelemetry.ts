import { useEffect, useState } from 'react';
import { database, ref, onValue, off } from '../lib/firebase';
import type { Telemetry, TelemetryTimeSeries } from '../types/telemetry';
import { getDemoTimeSeries } from '../lib/demoTelemetry';
import { useTelemetryStore } from '../state/telemetryStore';

export function useTelemetry() {
  const [telemetry, setTelemetry] = useState<Telemetry>({});
  const [timeSeries, setTimeSeries] = useState<TelemetryTimeSeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const updateStore = useTelemetryStore((state) => state.setTelemetry);

  useEffect(() => {
    const telemetryRef = ref(database, '/');
    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = onValue(
        telemetryRef,
        (snapshot) => {
          const data = snapshot.val();
          setIsLoading(false);

          if (!data || Object.keys(data).length === 0) {
            setIsEmpty(true);
            setTelemetry({});
            setTimeSeries([]);
            updateStore({});
            return;
          }

          setIsEmpty(false);
          const parsed: Telemetry = {
            temperature: data.temperature || null,
            windSpeed: data.windSpeed || data.wind || null,
            humidity: data.humidity || null,
            soilMoisture: data.soilMoisture || data.earthMoisture || null,
            pirDetection: data.pirDetection || data.pir || false,
            flameDetected: data.flameDetected || data.flame || false,
            smokeLevel: data.smokeLevel || data.smoke || null,
            latitude: data.latitude || data.lat || null,
            longitude: data.longitude || data.lng || null,
          };

          setTelemetry(parsed);
          updateStore(parsed);

          // Build time series from historical data if available
          if (data.history && Array.isArray(data.history)) {
            const series = data.history.map((item: any, index: number) => ({
              time: item.timestamp || `T-${data.history.length - index}`,
              temperature: item.temperature || 0,
              humidity: item.humidity || 0,
            }));
            setTimeSeries(series);
          } else {
            setTimeSeries([]);
          }
        },
        (error) => {
          console.error('Firebase error:', error);
          setIsLoading(false);
          setIsEmpty(true);
        }
      );
    } catch (error) {
      console.error('Failed to setup Firebase listener:', error);
      setIsLoading(false);
      setIsEmpty(true);
    }

    return () => {
      try {
        if (telemetryRef) {
          off(telemetryRef);
        }
        if (unsubscribe) {
          unsubscribe();
        }
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    };
  }, [updateStore]);

  return {
    telemetry,
    timeSeries: timeSeries.length > 0 ? timeSeries : getDemoTimeSeries(),
    isLoading,
    isEmpty,
  };
}
