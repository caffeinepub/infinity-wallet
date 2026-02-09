import { useState } from 'react';
import { useGetContacts } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Users, Check } from 'lucide-react';
import { truncatePrincipal } from '@/lib/utils';

interface RecipientPickerProps {
  onSelect: (address: string) => void;
}

export default function RecipientPicker({ onSelect }: RecipientPickerProps) {
  const [open, setOpen] = useState(false);
  const { data: contacts } = useGetContacts();

  const handleSelect = (address: string) => {
    onSelect(address);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" type="button">
          <Users className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="end">
        <Command>
          <CommandInput placeholder="Search contacts..." />
          <CommandList>
            <CommandEmpty>No contacts found.</CommandEmpty>
            <CommandGroup heading="Contacts">
              {contacts?.map((contact) => (
                <CommandItem
                  key={contact.id.toString()}
                  onSelect={() => handleSelect(contact.address)}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{contact.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {truncatePrincipal(contact.address, 10, 6)}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
