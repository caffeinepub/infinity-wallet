import { useState } from 'react';
import { useGetContacts, useDeleteContact } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, AlertCircle, Users } from 'lucide-react';
import ContactEditorDialog from '../components/contacts/ContactEditorDialog';
import type { Contact } from '../backend';
import { truncatePrincipal } from '@/lib/utils';

export default function ContactsPage() {
  const { data: contacts, isLoading, error } = useGetContacts();
  const deleteContact = useDeleteContact();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setEditorOpen(true);
  };

  const handleAdd = () => {
    setEditingContact(null);
    setEditorOpen(true);
  };

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (contactToDelete) {
      await deleteContact.mutateAsync(contactToDelete.id);
      setDeleteDialogOpen(false);
      setContactToDelete(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Address Book
          </h1>
          <p className="text-muted-foreground">Manage your saved contacts</p>
        </div>
        <Button onClick={handleAdd} className="gap-2 shadow-glow hover:shadow-glow-lg transition-all">
          <Plus className="h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="border-destructive/50 shadow-glow-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load contacts: {(error as Error).message}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow-sm">
          <CardContent className="pt-6">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : contacts && contacts.length > 0 ? (
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <Card 
              key={contact.id.toString()} 
              className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow-sm hover:shadow-glow transition-all"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {contact.name}
                    </CardTitle>
                    <CardDescription className="font-mono text-xs">
                      {truncatePrincipal(contact.address, 12, 8)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(contact)}
                      className="hover:bg-primary/10 hover:text-primary transition-all"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(contact)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 shadow-glow-sm mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">No contacts yet</p>
            <Button 
              onClick={handleAdd} 
              variant="outline" 
              size="sm"
              className="border-primary/30 hover:shadow-glow-sm transition-all"
            >
              Add Your First Contact
            </Button>
          </CardContent>
        </Card>
      )}

      <ContactEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        contact={editingContact}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-destructive/30 bg-card/95 backdrop-blur-sm shadow-glow">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{contactToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-primary/30">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-glow-sm"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
