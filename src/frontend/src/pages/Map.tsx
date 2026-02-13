import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Copy, Check } from 'lucide-react';
import { useTelemetryStore } from '../state/telemetryStore';
import { formatCoordinates, isValidCoordinate } from '../lib/geo';
import { copyToClipboard } from '../lib/clipboard';

export default function Map() {
  const telemetry = useTelemetryStore((state) => state.telemetry);
  const [copied, setCopied] = useState(false);
  const [mapError, setMapError] = useState(false);

  const hasValidCoords = isValidCoordinate(telemetry.latitude, telemetry.longitude);
  const lat = telemetry.latitude || 12.9716;
  const lng = telemetry.longitude || 77.5946;

  const handleCopyCoordinates = async () => {
    const coords = formatCoordinates(lat, lng);
    const success = await copyToClipboard(coords);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // OpenStreetMap tile URL with satellite imagery (using Esri World Imagery)
  const mapUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/15/${Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, 15))}/${Math.floor((lng + 180) / 360 * Math.pow(2, 15))}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Location Map</h1>
        <p className="text-muted-foreground">
          Satellite view of the monitoring station location
        </p>
      </div>

      {!hasValidCoords && (
        <Alert className="border-amber-800/30 bg-amber-950/20">
          <MapPin className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-100">
            No GPS coordinates available. Showing default location for demonstration.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-500" />
              GPS Coordinates
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCoordinates}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Latitude</p>
              <p className="font-mono text-xl font-semibold">{lat.toFixed(6)}°</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Longitude</p>
              <p className="font-mono text-xl font-semibold">{lng.toFixed(6)}°</p>
            </div>
          </div>

          {/* Map Container */}
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`}
              className="h-full w-full"
              style={{ border: 0 }}
              title="Location Map"
              onError={() => setMapError(true)}
            />
            {mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90">
                <div className="text-center">
                  <MapPin className="mx-auto mb-2 h-12 w-12 text-emerald-500" />
                  <p className="text-lg font-semibold">Map View</p>
                  <p className="text-sm text-muted-foreground">
                    Location: {lat.toFixed(4)}°, {lng.toFixed(4)}°
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-emerald-800/30 bg-emerald-950/20 p-4">
            <p className="text-sm text-emerald-100/90">
              <strong>Note:</strong> The map shows the real-time location of the forest fire monitoring station based on GPS data from the GSM/GPRS module.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
