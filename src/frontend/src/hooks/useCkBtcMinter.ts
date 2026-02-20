import { useState, useEffect } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import { createCkBtcMinterClient, type CkBtcMinterClient } from '@/lib/ckBtcMinter';

export function useCkBtcMinter() {
  const { identity } = useInternetIdentity();
  const [minterClient, setMinterClient] = useState<CkBtcMinterClient | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (!identity) {
      console.log('[useCkBtcMinter] No identity available, clearing client');
      setMinterClient(null);
      return;
    }

    setIsInitializing(true);
    console.log('[useCkBtcMinter] Creating ckBTC minter client...');

    createCkBtcMinterClient(identity)
      .then((client) => {
        console.log('[useCkBtcMinter] ckBTC minter client created successfully');
        setMinterClient(client);
      })
      .catch((error) => {
        console.error('[useCkBtcMinter] Failed to create ckBTC minter client:', error);
        setMinterClient(null);
      })
      .finally(() => {
        setIsInitializing(false);
      });
  }, [identity]);

  return {
    minterClient,
    isInitializing,
  };
}
