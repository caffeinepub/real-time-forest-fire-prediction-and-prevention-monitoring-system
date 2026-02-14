import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, Copy, Check, Info, PhoneCall } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { useOfficers } from '../../hooks/useOfficers';
import { copyToClipboard } from '../../lib/clipboard';
import { openWhatsAppChat } from '../../lib/whatsapp';
import { toast } from 'sonner';
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
  const [whatsappError, setWhatsappError] = useState(false);

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
      toast.success('Message copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy message');
    }
  };

  const handleWhatsAppChat = async () => {
    if (!selectedOfficerData) return;
    
    setWhatsappError(false);
    const success = await openWhatsAppChat(selectedOfficerData.mobileNumber, message);
    
    if (!success) {
      setWhatsappError(true);
    }
  };

  const handleWhatsAppCall = async () => {
    if (!selectedOfficerData) return;
    
    setWhatsappError(false);
    const success = await openWhatsAppChat(selectedOfficerData.mobileNumber);
    
    if (success) {
      toast.info('WhatsApp opened. Start the voice call from within WhatsApp.', {
        duration: 5000,
      });
    } else {
      setWhatsappError(true);
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
            <strong>Contact Options:</strong> WhatsApp Chat opens WhatsApp with the prefilled alert message. WhatsApp Call opens WhatsApp where you must start the voice call manually. Copy Message allows you to paste the alert text into any messaging app.
          </AlertDescription>
        </Alert>

        {whatsappError && (
          <Alert variant="destructive">
            <AlertDescription>
              Could not open WhatsApp. Please check your popup blocker settings or use the "Copy Message" button below.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleWhatsAppChat}
            disabled={!selectedOfficerData}
            className="flex-1 gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white"
          >
            <SiWhatsapp className="h-4 w-4" />
            WhatsApp Chat
          </Button>

          <Button 
            onClick={handleWhatsAppCall}
            disabled={!selectedOfficerData}
            variant="outline"
            className="flex-1 gap-2"
          >
            <PhoneCall className="h-4 w-4" />
            WhatsApp Call
          </Button>

          <Button 
            onClick={handleCopy} 
            disabled={!selectedOfficerData}
            variant="outline"
            className="gap-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Message'}
          </Button>
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
