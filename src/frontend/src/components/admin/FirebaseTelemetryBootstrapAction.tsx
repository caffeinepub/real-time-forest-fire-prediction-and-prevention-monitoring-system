import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Database, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { initializeTelemetryFields } from '@/lib/telemetryBootstrap';

export default function FirebaseTelemetryBootstrapAction() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInitialize = async () => {
    setIsInitializing(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await initializeTelemetryFields();
      setSuccessMessage(
        'Firebase telemetry fields initialized successfully! Arduino devices can now write sensor data to the database root.'
      );
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unknown error occurred while initializing Firebase telemetry fields.');
      }
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <Card className="border-emerald-800/30 bg-emerald-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald-100">
          <Database className="h-5 w-5 text-emerald-500" />
          Firebase Database Setup
        </CardTitle>
        <CardDescription className="text-emerald-200/70">
          Initialize telemetry fields in Firebase Realtime Database for Arduino sensor data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-emerald-100/80">
          This action will create placeholder telemetry fields at the database root path (<code className="rounded bg-emerald-900/50 px-1 py-0.5 font-mono text-xs">/</code>) 
          so Arduino devices can write sensor values directly. Existing data (like officer records) will be preserved.
        </p>

        {successMessage && (
          <Alert className="border-emerald-700 bg-emerald-950/50">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <AlertTitle className="text-emerald-100">Success</AlertTitle>
            <AlertDescription className="text-emerald-200/80">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Initialization Failed</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full border-emerald-700 bg-emerald-900/30 text-emerald-100 hover:bg-emerald-800/50 hover:text-emerald-50"
              disabled={isInitializing}
            >
              {isInitializing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Initialize Firebase Telemetry Fields
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Initialize Firebase Telemetry Fields?</AlertDialogTitle>
              <AlertDialogDescription>
                This will create the following fields at the database root path (<code>/</code>):
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                  <li>temperature</li>
                  <li>windSpeed</li>
                  <li>humidity</li>
                  <li>soilMoisture</li>
                  <li>pirDetection</li>
                  <li>flameDetected</li>
                  <li>smokeLevel</li>
                  <li>latitude</li>
                  <li>longitude</li>
                </ul>
                <p className="mt-3 text-sm font-medium">
                  Existing data (such as officer records) will NOT be deleted.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleInitialize}>
                Initialize Fields
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="rounded-md border border-emerald-800/30 bg-emerald-950/30 p-3">
          <p className="text-xs text-emerald-200/70">
            <strong className="text-emerald-100">Note:</strong> After initialization, Arduino devices can write sensor values 
            directly to the database root using the canonical field names or their aliases (e.g., <code className="rounded bg-emerald-900/50 px-1 py-0.5">wind</code> for <code className="rounded bg-emerald-900/50 px-1 py-0.5">windSpeed</code>). 
            See <code className="rounded bg-emerald-900/50 px-1 py-0.5">FIREBASE_RTDB_FIELDS.md</code> for complete documentation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
