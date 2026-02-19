import { useQuery } from '@tanstack/react-query';
import { useCkSolLedger } from './useCkSolLedger';
import { getDefaultAccount } from '@/lib/ckSolLedger';
import { useInternetIdentity } from './useInternetIdentity';

/**
 * Hook to fetch ckSOL balance from the live ICRC-1 ledger with comprehensive debugging
 */
export function useCkSolBalance() {
  const { ledgerClient, isInitializing, isAuthenticated } = useCkSolLedger();
  const { identity } = useInternetIdentity();

  const query = useQuery<bigint>({
    queryKey: ['ckSolBalance', identity?.getPrincipal().toString()],
    queryFn: async () => {
      const timestamp = new Date().toISOString();
      console.group(`🔍 [${timestamp}] ckSOL Balance Fetch`);

      try {
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

        console.log('🚀 Calling icrc1_balance_of with account:', {
          owner: account.owner.toString(),
          subaccount: account.subaccount,
        });

        const balance = await ledgerClient.icrc1_balance_of(account);

        console.log('✅ Balance fetch successful:', {
          balance: balance.toString(),
          balanceType: typeof balance,
          balanceE8s: balance,
        });

        console.groupEnd();
        return balance;
      } catch (error: any) {
        console.error('❌ Balance fetch failed:', {
          errorMessage: error?.message || 'Unknown error',
          errorName: error?.name,
          errorStack: error?.stack,
          errorType: typeof error,
          fullError: error,
        });

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
    staleTime: 10000,
  });

  return {
    ...query,
    isLoading: isInitializing || query.isLoading,
    balance: query.data ?? BigInt(0),
  };
}
