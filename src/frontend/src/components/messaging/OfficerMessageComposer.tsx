import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, Copy, Phone, Check, Info, MessageCircle } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { useOfficers } from '../../hooks/useOfficers';
import { copyToClipboard } from '../../lib/clipboard';
import { openWhatsAppChat } from '../../lib/whatsapp';
import { sendSms } from '../../lib/sms';
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
  const [smsError, setSmsError] = useState(false);

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

  const handleWhatsAppOpen = async () => {
    if (!selectedOfficerData) return;
    
    setWhatsappError(false);
    const success = await openWhatsAppChat(selectedOfficerData.mobileNumber, message);
    
    if (!success) {
      setWhatsappError(true);
    }
  };

  const handleSendSms = async () => {
    if (!selectedOfficerData) return;
    
    setSmsError(false);
    const success = await sendSms(selectedOfficerData.mobileNumber, message);
    
    if (!success) {
      setSmsError(true);
      toast.error('Could not open SMS app. Use the copy button to manually send the message.');
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
            <strong>Messaging Options:</strong> WhatsApp opens WhatsApp Web/app with prefilled message. SMS opens your device's SMS app via sms: link. Call uses tel: link to initiate a phone call from your device/browser. The Arduino GSM module (SIM 9692162224) handles device-side SMS alerts independently.
          </AlertDescription>
        </Alert>

        {whatsappError && (
          <Alert variant="destructive">
            <AlertDescription>
              Could not open WhatsApp. Please check your popup blocker settings or use the "Copy Message" button below.
            </AlertDescription>
          </Alert>
        )}

        {smsError && (
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between">
              <span>Could not open SMS app. Click "Copy Message" to manually send.</span>
              <Button size="sm" variant="outline" onClick={handleCopy}>
                <Copy className="mr-2 h-3 w-3" />
                Copy
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleWhatsAppOpen}
            disabled={!selectedOfficerData}
            className="flex-1 gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white"
          >
            <SiWhatsapp className="h-4 w-4" />
            Open WhatsApp Chat
          </Button>

          <Button 
            onClick={handleSendSms}
            disabled={!selectedOfficerData}
            variant="outline"
            className="flex-1 gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Send SMS from This Device
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
          
          {selectedOfficerData && (
            <Button
              variant="outline"
              asChild
              className="gap-2"
            >
              <a href={`tel:${selectedOfficerData.mobileNumber}`}>
                <Phone className="h-4 w-4" />
                Call from This Device
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
