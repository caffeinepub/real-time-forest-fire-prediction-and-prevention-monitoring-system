import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Phone } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Officer } from '../../lib/officersRtdb';
import OfficerFormDialog from './OfficerFormDialog';
import { useDeleteOfficer } from '../../hooks/useOfficers';

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
                        <DropdownMenuItem asChild>
                          <a href={`tel:${officer.mobileNumber}`} className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Call
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingOfficer(officer)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(officer.name)}
                          className="text-destructive"
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
