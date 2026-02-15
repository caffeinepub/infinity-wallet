import { useEffect, useState } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import { createInfinityLedgerClient, type ICRC1LedgerActor } from '@/lib/infinityLedger';

/**
 * Hook to get an authenticated Infinity Coin ledger client
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
      if (!identity) {
        setLedgerClient(null);
        return;
      }

      setIsInitializing(true);
      try {
        const client = await createInfinityLedgerClient(identity);
        if (!cancelled) {
          setLedgerClient(client);
        }
      } catch (error) {
        console.error('Failed to initialize Infinity Ledger client:', error);
        if (!cancelled) {
          setLedgerClient(null);
        }
      } finally {
        if (!cancelled) {
          setIsInitializing(false);
        }
      }
    }

    initClient();

    return () => {
      cancelled = true;
    };
  }, [identity]);

  return {
    ledgerClient,
    isInitializing,
    isAuthenticated: !!identity,
    loginStatus,
  };
}
