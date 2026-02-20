import { useQuery } from '@tanstack/react-query';
import { useCkBtcMinter } from './useCkBtcMinter';
import { useInternetIdentity } from './useInternetIdentity';

export function useCkBtcDepositAddress() {
  const { minterClient, isInitializing } = useCkBtcMinter();
  const { identity } = useInternetIdentity();

  return useQuery<string>({
    queryKey: ['ckBtcDepositAddress', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!minterClient || !identity) {
        throw new Error('ckBTC minter client or identity not available');
      }

      console.log('[useCkBtcDepositAddress] Fetching Bitcoin deposit address...');
      
      const principal = identity.getPrincipal();
      
      console.log('[useCkBtcDepositAddress] Principal:', principal.toString());
      
      try {
        // Pass empty arrays for optional fields - the minter will use the caller's principal
        // by default when owner is not specified (empty optional)
        const address = await minterClient.get_btc_address({
          owner: [],
          subaccount: [],
        });

        console.log('[useCkBtcDepositAddress] Bitcoin address:', address);
        return address;
      } catch (error: any) {
        console.error('[useCkBtcDepositAddress] Error fetching address:', error);
        
        // Check if this is a local development environment issue
        if (error?.message?.includes('has no query method') || 
            error?.message?.includes('Canister has no query method')) {
          throw new Error('ckBTC minter is only available on mainnet. Please deploy to mainnet to use Bitcoin deposits.');
        }
        
        throw error;
      }
    },
    enabled: !!minterClient && !isInitializing && !!identity,
    staleTime: Infinity, // Address doesn't change
    retry: false, // Don't retry on local development errors
  });
}
