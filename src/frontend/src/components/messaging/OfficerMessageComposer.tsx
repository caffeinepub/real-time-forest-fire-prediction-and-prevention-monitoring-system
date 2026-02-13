import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, Copy, Phone, Check, Info } from 'lucide-react';
import { useOfficers } from '../../hooks/useOfficers';
import { copyToClipboard } from '../../lib/clipboard';
import type { Telemetry } from '../../types/telemetry';
import type { AlertStatus } from '../../lib/alertStatus';

interface OfficerMessageComposerProps {
  telemetry: Telemetry;
  alertStatus: AlertStatus;
  demoMode: boolean;
}

export default function OfficerMessageComposer({ telemetry, alertStatus, demoMode }: OfficerMessageComposerProps) {
  const { officers } = useOfficers();
  const [selectedOfficer, setSelectedOfficer] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generateMessage = () => {
    const status = alertStatus.prevention.level === 'critical' ? 'FIRE ALERT' : 
                   alertStatus.prediction.level === 'warning' ? 'WARNING' : 'UPDATE';
    
    const lat = demoMode ? '12.9716' : telemetry.latitude?.toFixed(6) || 'N/A';
    const lng = demoMode ? '77.5946' : telemetry.longitude?.toFixed(6) || 'N/A';
    
    return `[${status}] Forest Fire Monitoring System\n\n` +
           `Status: ${alertStatus.prevention.level === 'critical' ? alertStatus.prevention.message : alertStatus.prediction.message}\n\n` +
           `Location: ${lat}°N, ${lng}°E\n` +
           `Temperature: ${demoMode ? '32°C' : telemetry.temperature ? `${telemetry.temperature}°C` : 'N/A'}\n` +
           `Humidity: ${demoMode ? '45%' : telemetry.humidity ? `${telemetry.humidity}%` : 'N/A'}\n\n` +
           `Please respond immediately.`;
  };

  const message = generateMessage();
  const selectedOfficerData = officers.find(o => o.name === selectedOfficer);

  const handleCopy = async () => {
    const success = await copyToClipboard(message);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-emerald-500" />
          Officer Messaging
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Select Officer</label>
          <Select value={selectedOfficer} onValueChange={setSelectedOfficer}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an officer..." />
            </SelectTrigger>
            <SelectContent>
              {officers.map((officer) => (
                <SelectItem key={officer.name} value={officer.name}>
                  {officer.name} - {officer.mobileNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Message</label>
          <Textarea
            value={message}
            readOnly
            rows={8}
            className="font-mono text-sm"
          />
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This web app composes and displays the alert message. Outbound SMS delivery is performed by the Arduino UNO GSM/GPRS module (SIM 9692162224). The same GSM/GPRS module is also used for GPS location tracking.
          </AlertDescription>
        </Alert>

        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleCopy} 
            disabled={!selectedOfficerData}
            className="flex-1 gap-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Alert Payload'}
          </Button>
          
          {selectedOfficerData && (
            <Button
              variant="outline"
              asChild
              className="gap-2"
            >
              <a href={`tel:${selectedOfficerData.mobileNumber}`}>
                <Phone className="h-4 w-4" />
                Call Officer
              </a>
            </Button>
          )}
        </div>

        {selectedOfficerData && (
          <div className="rounded-md border border-muted bg-muted/30 p-3 text-sm">
            <p className="font-medium">Selected Officer:</p>
            <p className="text-muted-foreground">{selectedOfficerData.name}</p>
            <p className="text-muted-foreground">{selectedOfficerData.mobileNumber}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
