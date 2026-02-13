import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAddOfficer } from '../../hooks/useOfficers';
import type { Officer } from '../../lib/officersRtdb';

interface OfficerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'add' | 'edit';
  officer?: Officer;
}

export default function OfficerFormDialog({ open, onOpenChange, mode, officer }: OfficerFormDialogProps) {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [validationError, setValidationError] = useState('');
  const [firebaseError, setFirebaseError] = useState('');
  const addOfficer = useAddOfficer();

  useEffect(() => {
    if (officer) {
      setName(officer.name);
      setMobileNumber(officer.mobileNumber);
    } else {
      setName('');
      setMobileNumber('');
    }
    setValidationError('');
    setFirebaseError('');
  }, [officer, open]);

  const validateInputs = (): boolean => {
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Name is required');
      return false;
    }

    if (!mobileNumber.trim()) {
      setValidationError('Mobile number is required');
      return false;
    }

    // Validate mobile number format (digits, spaces, +, -, parentheses)
    if (!/^\+?[\d\s\-()]+$/.test(mobileNumber)) {
      setValidationError('Invalid mobile number format. Use only digits, spaces, +, -, and parentheses.');
      return false;
    }

    // Check minimum length (at least 10 digits)
    const digitsOnly = mobileNumber.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setValidationError('Mobile number must contain at least 10 digits');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFirebaseError('');

    // Validate inputs before attempting Firebase write
    if (!validateInputs()) {
      return;
    }

    try {
      await addOfficer.mutateAsync({ 
        name: name.trim(), 
        mobileNumber: mobileNumber.trim() 
      });
      onOpenChange(false);
    } catch (err) {
      // Display Firebase-specific error with context
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to save officer. Please check your connection and try again.';
      setFirebaseError(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Officer' : 'Edit Officer'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setValidationError('');
              }}
              placeholder="Enter officer name"
              disabled={mode === 'edit'}
              className={validationError && !name.trim() ? 'border-destructive' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              value={mobileNumber}
              onChange={(e) => {
                setMobileNumber(e.target.value);
                setValidationError('');
              }}
              placeholder="+1234567890"
              className={validationError && validationError.includes('Mobile') ? 'border-destructive' : ''}
            />
          </div>

          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          {firebaseError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{firebaseError}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={addOfficer.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={addOfficer.isPending}>
              {addOfficer.isPending ? 'Saving...' : mode === 'add' ? 'Add Officer' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
