import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Flame, CheckCircle } from 'lucide-react';
import type { AlertStatus } from '../../lib/alertStatus';
import type { Telemetry } from '../../types/telemetry';

interface AlertsPanelProps {
  alertStatus: AlertStatus;
  telemetry: Telemetry;
  demoMode: boolean;
}

export default function AlertsPanel({ alertStatus, telemetry, demoMode }: AlertsPanelProps) {
  const { prediction, prevention } = alertStatus;

  if (prevention.level === 'critical') {
    return (
      <Alert className="animate-pulse-border border-red-600 bg-red-950/30">
        <Flame className="h-5 w-5 text-red-500" />
        <AlertTitle className="text-lg font-bold text-red-100">
          FIRE ALERT - IMMEDIATE ACTION REQUIRED
        </AlertTitle>
        <AlertDescription className="text-red-200">
          {prevention.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (prediction.level === 'warning') {
    return (
      <Alert className="border-amber-600 bg-amber-950/30">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <AlertTitle className="text-lg font-bold text-amber-100">
          Elevated Fire Risk
        </AlertTitle>
        <AlertDescription className="text-amber-200">
          {prediction.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-emerald-600 bg-emerald-950/30">
      <CheckCircle className="h-5 w-5 text-emerald-500" />
      <AlertTitle className="text-lg font-bold text-emerald-100">
        All Systems Normal
      </AlertTitle>
      <AlertDescription className="text-emerald-200">
        No immediate fire risk detected. Monitoring continues.
      </AlertDescription>
    </Alert>
  );
}
