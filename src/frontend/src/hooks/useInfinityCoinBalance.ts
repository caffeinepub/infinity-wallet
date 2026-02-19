import { useQuery } from '@tanstack/react-query';
import { useInfinityLedger } from './useInfinityLedger';
import { getDefaultAccount } from '@/lib/infinityLedger';
import { useInternetIdentity } from './useInternetIdentity';

/**
 * Hook to fetch Infinity Coin balance from the live ICRC-1 ledger with comprehensive debugging
 */
export function useInfinityCoinBalance() {
  const { ledgerClient, isInitializing, isAuthenticated } = useInfinityLedger();
  const { identity } = useInternetIdentity();

  const query = useQuery<bigint>({
    queryKey: ['infinityCoinBalance', identity?.getPrincipal().toString()],
    queryFn: async () => {
      const timestamp = new Date().toISOString();
      console.group(`🔍 [${timestamp}] Infinity Coin Balance Fetch`);

      try {
        // Log identity state
        console.log('📋 Identity State:', {
          hasIdentity: !!identity,
          principal: identity?.getPrincipal().toString(),
          principalType: identity?.getPrincipal().constructor.name,
        });

        if (!ledgerClient || !identity) {
          console.error('❌ Missing dependencies:', {
            hasLedgerClient: !!ledgerClient,
            hasIdentity: !!identity,
          });
          throw new Error('Ledger client or identity not available');
        }

        // Construct and log the Account object
        const principal = identity.getPrincipal();
        const account = getDefaultAccount(principal);
        
        console.log('📦 Account Object Construction:', {
          owner: account.owner.toString(),
          ownerType: typeof account.owner,
          ownerConstructor: account.owner.constructor.name,
          subaccount: account.subaccount,
          subaccountType: typeof account.subaccount,
          subaccountIsArray: Array.isArray(account.subaccount),
          subaccountLength: account.subaccount.length,
          subaccountValue: `Array(${account.subaccount.length}) - represents default/None`,
          fullAccountObject: {
            owner: account.owner.toString(),
            subaccount: account.subaccount,
          },
        });

        // Log the call being made
        console.log('🚀 Calling icrc1_balance_of with account:', {
          owner: account.owner.toString(),
          subaccount: account.subaccount,
        });

        // Make the balance call
        const balance = await ledgerClient.icrc1_balance_of(account);

        // Log successful response
        console.log('✅ Balance fetch successful:', {
          balance: balance.toString(),
          balanceType: typeof balance,
          balanceE8s: balance,
        });

        console.groupEnd();
        return balance;
      } catch (error: any) {
        // Log detailed error information
        console.error('❌ Balance fetch failed:', {
          errorMessage: error?.message || 'Unknown error',
          errorName: error?.name,
          errorStack: error?.stack,
          errorType: typeof error,
          fullError: error,
        });

        // Try to extract more details from the error
        if (error?.message) {
          console.error('📝 Error Message Details:', error.message);
        }
        if (error?.stack) {
          console.error('📚 Error Stack Trace:', error.stack);
        }

        console.groupEnd();
        throw error;
      }
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
