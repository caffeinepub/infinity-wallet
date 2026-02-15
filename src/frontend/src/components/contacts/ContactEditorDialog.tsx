import { useState, useEffect } from 'react';
import { useSaveContact, useUpdateContact } from '../../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { validateRecipient } from '@/lib/validation';
import type { Contact } from '../../backend';

interface ContactEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
}

export default function ContactEditorDialog({ open, onOpenChange, contact }: ContactEditorDialogProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<{ name?: string; address?: string }>({});

  const saveContact = useSaveContact();
  const updateContact = useUpdateContact();

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setAddress(contact.address);
    } else {
      setName('');
      setAddress('');
    }
    setErrors({});
  }, [contact, open]);

  const handleValidate = () => {
    const newErrors: { name?: string; address?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    const addressValidation = validateRecipient(address);
    if (!addressValidation.valid) {
      newErrors.address = addressValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!handleValidate()) return;

    try {
      if (contact) {
        await updateContact.mutateAsync({
          contactId: contact.id,
          name: name.trim(),
          address: address.trim(),
        });
      } else {
        await saveContact.mutateAsync({
          name: name.trim(),
          address: address.trim(),
        });
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save contact:', error);
    }
  };

  const isPending = saveContact.isPending || updateContact.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{contact ? 'Edit Contact' : 'Add Contact'}</DialogTitle>
          <DialogDescription>
            {contact ? 'Update the contact details' : 'Add a new contact to your address book'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter contact name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="ICP Account ID (Account Identifier) or Principal"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (errors.address) setErrors({ ...errors, address: undefined });
              }}
              className={errors.address ? 'border-destructive' : ''}
            />
            {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
