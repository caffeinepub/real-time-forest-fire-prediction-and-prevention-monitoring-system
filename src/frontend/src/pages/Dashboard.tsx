import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Thermometer, Wind, Droplets, Sprout, User, Flame, CloudFog, MapPin, AlertTriangle } from 'lucide-react';
import { useTelemetry } from '../hooks/useTelemetry';
import { getAlertStatus } from '../lib/alertStatus';
import SummaryCards from '../components/dashboard/SummaryCards';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import LineTrendChart from '../components/charts/LineTrendChart';
import StatusPieChart from '../components/charts/StatusPieChart';
import OfficerMessageComposer from '../components/messaging/OfficerMessageComposer';
import FirebaseTelemetryBootstrapAction from '../components/admin/FirebaseTelemetryBootstrapAction';

export default function Dashboard() {
  const { telemetry, isLoading, isEmpty, timeSeries } = useTelemetry();
  const [demoMode, setDemoMode] = useState(false);
  const alertStatus = getAlertStatus(telemetry);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading telemetry data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div
        className="relative overflow-hidden rounded-lg bg-cover bg-center p-8 text-white shadow-lg"
        style={{ backgroundImage: 'url(/assets/generated/ff-dashboard-hero.dim_1600x400.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-slate-900/80 to-orange-950/90" />
        <div className="relative z-10">
          <h1 className="mb-2 text-3xl font-bold">Real-time Forest Fire Monitoring</h1>
          <p className="text-emerald-100/90">
            Live sensor data and predictive analytics for forest fire prevention
          </p>
        </div>
      </div>

      {/* Firebase Database Setup (Admin Only - shown when no data) */}
      {isEmpty && (
        <FirebaseTelemetryBootstrapAction />
      )}

      {/* Demo Mode Toggle */}
      {isEmpty && (
        <Card className="border-amber-800/30 bg-amber-950/20">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <div>
                <p className="font-medium text-amber-100">No live data available</p>
                <p className="text-sm text-amber-200/70">Enable demo mode to preview the dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="demo-mode" className="text-amber-100">Demo Mode</Label>
              <Switch
                id="demo-mode"
                checked={demoMode}
                onCheckedChange={setDemoMode}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alert Status */}
      <AlertsPanel alertStatus={alertStatus} telemetry={telemetry} demoMode={demoMode} />

      {/* Summary Cards */}
      <SummaryCards telemetry={telemetry} demoMode={demoMode} />

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <LineTrendChart timeSeries={timeSeries} demoMode={demoMode} isEmpty={isEmpty} />
        <StatusPieChart alertStatus={alertStatus} demoMode={demoMode} />
      </div>

      {/* GPS Location */}
      {(telemetry.latitude || demoMode) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-500" />
              GPS Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Latitude</p>
                <p className="font-mono text-lg font-semibold">
                  {demoMode ? '12.9716° N' : telemetry.latitude ? `${telemetry.latitude}°` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Longitude</p>
                <p className="font-mono text-lg font-semibold">
                  {demoMode ? '77.5946° E' : telemetry.longitude ? `${telemetry.longitude}°` : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Officer Messaging */}
      <OfficerMessageComposer telemetry={telemetry} alertStatus={alertStatus} demoMode={demoMode} />
    </div>
  );
}
