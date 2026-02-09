import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Contact, TransactionHistoryItem, CoinType } from '../backend';
import { toast } from 'sonner';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save profile: ${error.message}`);
    },
  });
}

// Balance Queries
export function useGetBalances() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<[bigint, bigint]>({
    queryKey: ['balances'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBalances();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useRecordBalance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ coinType, balance }: { coinType: CoinType; balance: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordBalance(coinType, balance);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balances'] });
    },
  });
}

// Transaction Queries
export function useGetTransactionHistory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TransactionHistoryItem[]>({
    queryKey: ['transactionHistory'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTransactionHistory();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useRecordTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      recipient,
      amountE8,
      coinType,
    }: {
      recipient: string;
      amountE8: bigint;
      coinType: CoinType;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.recordTransaction(recipient, amountE8, coinType);
      return { recipient, amountE8, coinType };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactionHistory'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      toast.success('Transaction recorded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Transaction failed: ${error.message}`);
    },
  });
}

// Contact Queries
export function useGetContacts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getContacts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, address }: { name: string; address: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveContact(name, address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact saved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save contact: ${error.message}`);
    },
  });
}

export function useUpdateContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contactId,
      name,
      address,
    }: {
      contactId: bigint;
      name: string;
      address: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateContact(contactId, name, address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update contact: ${error.message}`);
    },
  });
}

export function useDeleteContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contactId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteContact(contactId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete contact: ${error.message}`);
    },
  });
}
