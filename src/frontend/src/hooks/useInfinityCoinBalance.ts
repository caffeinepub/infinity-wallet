import { useQuery } from '@tanstack/react-query';
import { useInfinityLedger } from './useInfinityLedger';
import { getDefaultAccount } from '@/lib/infinityLedger';
import { useInternetIdentity } from './useInternetIdentity';

/**
 * Hook to fetch Infinity Coin balance from the live ICRC-1 ledger
 */
export function useInfinityCoinBalance() {
  const { ledgerClient, isInitializing, isAuthenticated } = useInfinityLedger();
  const { identity } = useInternetIdentity();

  const query = useQuery<bigint>({
    queryKey: ['infinityCoinBalance', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!ledgerClient || !identity) {
        throw new Error('Ledger client or identity not available');
      }

      const account = getDefaultAccount(identity.getPrincipal());
      const balance = await ledgerClient.icrc1_balance_of(account);
      return balance;
    },
    enabled: !!ledgerClient && !!identity && !isInitializing && isAuthenticated,
    retry: 2,
    staleTime: 10000, // Consider data fresh for 10 seconds
  });

  return {
    ...query,
    isLoading: isInitializing || query.isLoading,
    balance: query.data ?? BigInt(0),
  };
}
