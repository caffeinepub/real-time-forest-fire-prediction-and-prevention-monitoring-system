import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search } from 'lucide-react';
import { useOfficers } from '../hooks/useOfficers';
import OfficerList from '../components/officers/OfficerList';
import OfficerFormDialog from '../components/officers/OfficerFormDialog';

export default function Officers() {
  const { officers, isLoading } = useOfficers();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredOfficers = officers.filter((officer) =>
    officer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    officer.mobileNumber.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Officers Directory</h1>
          <p className="text-muted-foreground">
            Manage contact information for emergency response officers. SMS and calls are initiated from your current device/browser via sms: and tel: links. WhatsApp actions open WhatsApp (Web/app) depending on your environment.
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Officer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Officers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or mobile number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <OfficerList officers={filteredOfficers} isLoading={isLoading} />

      <OfficerFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        mode="add"
      />
    </div>
  );
}
