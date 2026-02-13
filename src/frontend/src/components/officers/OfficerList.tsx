import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Phone, Copy, MessageCircle } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Officer } from '../../lib/officersRtdb';
import OfficerFormDialog from './OfficerFormDialog';
import { useDeleteOfficer } from '../../hooks/useOfficers';
import { copyToClipboard } from '../../lib/clipboard';
import { openWhatsAppChat } from '../../lib/whatsapp';
import { sendSms, generateDefaultSmsMessage } from '../../lib/sms';

interface OfficerListProps {
  officers: Officer[];
  isLoading: boolean;
}

export default function OfficerList({ officers, isLoading }: OfficerListProps) {
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);
  const deleteOfficer = useDeleteOfficer();

  const handleDelete = async (name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteOfficer.mutateAsync(name);
        toast.success(`${name} has been deleted`);
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to delete officer. Please try again.';
        toast.error(errorMessage);
      }
    }
  };

  const handleCopyNumber = async (officer: Officer) => {
    const success = await copyToClipboard(officer.mobileNumber);
    if (success) {
      toast.success(`Copied ${officer.name}'s number`);
    } else {
      toast.error('Failed to copy number');
    }
  };

  const handleWhatsAppChat = async (officer: Officer) => {
    const success = await openWhatsAppChat(officer.mobileNumber);
    if (!success) {
      toast.error('Could not open WhatsApp. Please check your popup blocker settings.');
    }
  };

  const handleWhatsAppCall = async (officer: Officer) => {
    const success = await openWhatsAppChat(officer.mobileNumber);
    if (success) {
      toast.info('WhatsApp opened. Start the voice call from within WhatsApp.');
    } else {
      toast.error('Could not open WhatsApp. Please check your popup blocker settings.');
    }
  };

  const handleSendSms = async (officer: Officer) => {
    const message = generateDefaultSmsMessage(officer.name);
    const success = await sendSms(officer.mobileNumber, message);
    
    if (!success) {
      // Show error and offer to copy the message
      const copySuccess = await copyToClipboard(message);
      if (copySuccess) {
        toast.error('Could not open SMS app. Message copied to clipboard - paste it manually in your SMS app.');
      } else {
        toast.error('Could not open SMS app. Please try again or use the "Copy Number" option.');
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading officers...
        </CardContent>
      </Card>
    );
  }

  if (officers.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No officers found. Add your first officer to get started.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Officers ({officers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Mobile Number</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {officers.map((officer) => (
                <TableRow key={officer.name}>
                  <TableCell className="font-medium">{officer.name}</TableCell>
                  <TableCell className="font-mono">{officer.mobileNumber}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleWhatsAppChat(officer)}>
                          <SiWhatsapp className="mr-2 h-4 w-4 text-[#25D366]" />
                          Open WhatsApp Chat (handoff)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleWhatsAppCall(officer)}>
                          <SiWhatsapp className="mr-2 h-4 w-4 text-[#25D366]" />
                          WhatsApp Call (start inside app)
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleSendSms(officer)}>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Send SMS from This Device
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={`tel:${officer.mobileNumber}`} className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Call from This Device
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopyNumber(officer)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Number
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setEditingOfficer(officer)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(officer.name)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingOfficer && (
        <OfficerFormDialog
          open={!!editingOfficer}
          onOpenChange={(open) => !open && setEditingOfficer(null)}
          mode="edit"
          officer={editingOfficer}
        />
      )}
    </>
  );
}
