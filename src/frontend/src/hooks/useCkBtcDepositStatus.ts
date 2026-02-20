import { useQuery } from '@tanstack/react-query';
import { useCkBtcMinter } from './useCkBtcMinter';
import { useInternetIdentity } from './useInternetIdentity';

interface DepositStatus {
  hasPendingDeposits: boolean;
  utxos: Array<{
    confirmations: number;
    value: bigint;
    status: 'pending' | 'confirmed' | 'minted';
  }>;
}

export function useCkBtcDepositStatus() {
  const { minterClient, isInitializing } = useCkBtcMinter();
  const { identity } = useInternetIdentity();

  return useQuery<DepositStatus>({
    queryKey: ['ckBtcDepositStatus', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!minterClient || !identity) {
        throw new Error('ckBTC minter client or identity not available');
      }

      console.log('[useCkBtcDepositStatus] Checking deposit status...');

      const principal = identity.getPrincipal();
      
      console.log('[useCkBtcDepositStatus] Principal:', principal.toString());

      try {
        // Pass empty arrays for optional fields - the minter will use the caller's principal
        // by default when owner is not specified (empty optional)
        const updateResult = await minterClient.update_balance({
          owner: [],
          subaccount: [],
        });

        console.log('[useCkBtcDepositStatus] Update balance result:', updateResult);

        // Parse results to determine deposit status
        // The result is an array of Result<Nat64, UpdateBalanceError>
        const hasPendingDeposits = Array.isArray(updateResult) && 
          updateResult.length > 0 && 
          updateResult.some((result) => 'Ok' in result);

        return {
          hasPendingDeposits,
          utxos: [],
        };
      } catch (error: any) {
        console.error('[useCkBtcDepositStatus] Error checking deposit status:', error);
        
        // Check if this is a local development environment issue
        if (error?.message?.includes('Not a vector type') ||
            error?.message?.includes('has no query method') ||
            error?.message?.includes('Canister has no query method')) {
          // Return empty status for local development
          return {
            hasPendingDeposits: false,
            utxos: [],
          };
        }
        
        throw error;
      }
    },
    enabled: !!minterClient && !isInitializing && !!identity,
    refetchInterval: false, // Disable polling in local development
    retry: false, // Don't retry on local development errors
  });
}
