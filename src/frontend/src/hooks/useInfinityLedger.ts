import { useEffect, useState } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import { createInfinityLedgerClient, type ICRC1LedgerActor } from '@/lib/infinityLedger';

/**
 * Hook to get an authenticated Infinity Coin ledger client with comprehensive debugging
 * 
 * Returns null if the user is not signed in.
 */
export function useInfinityLedger() {
  const { identity, loginStatus } = useInternetIdentity();
  const [ledgerClient, setLedgerClient] = useState<ICRC1LedgerActor | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function initClient() {
      const timestamp = new Date().toISOString();
      console.group(`🔧 [${timestamp}] Infinity Ledger Client Initialization`);

      console.log('📋 Hook Invoked:', {
        hasIdentity: !!identity,
        principal: identity?.getPrincipal().toString(),
        loginStatus,
      });

      if (!identity) {
        console.log('⚠️ No identity available, clearing ledger client');
        setLedgerClient(null);
        console.groupEnd();
        return;
      }

      setIsInitializing(true);
      try {
        console.log('🚀 Creating Infinity Ledger client...');
        const client = await createInfinityLedgerClient(identity);
        
        if (!cancelled) {
          console.log('✅ Ledger client created successfully');
          
          // Verify actor methods
          console.log('🔍 Verifying actor methods:', {
            hasBalanceMethod: typeof client.icrc1_balance_of === 'function',
            hasTransferMethod: typeof client.icrc1_transfer === 'function',
            hasFeeMethod: typeof client.icrc1_fee === 'function',
            hasDecimalsMethod: typeof client.icrc1_decimals === 'function',
            hasNameMethod: typeof client.icrc1_name === 'function',
            hasSymbolMethod: typeof client.icrc1_symbol === 'function',
          });
          
          setLedgerClient(client);
        }
      } catch (error: any) {
        console.error('❌ Failed to initialize Infinity Ledger client:', {
          errorMessage: error?.message || 'Unknown error',
          errorName: error?.name,
          errorStack: error?.stack,
          fullError: error,
        });
        
        if (!cancelled) {
          setLedgerClient(null);
        }
      } finally {
        if (!cancelled) {
          setIsInitializing(false);
        }
        console.groupEnd();
      }
    }

    initClient();

    return () => {
      cancelled = true;
    };
  }, [identity, loginStatus]);

  return {
    ledgerClient,
    isInitializing,
    isAuthenticated: !!identity,
    loginStatus,
  };
}
