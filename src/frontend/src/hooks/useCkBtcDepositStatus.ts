import { useQuery } from '@tanstack/react-query';
import { useCkBtcMinter } from './useCkBtcMinter';
import { useInternetIdentity } from './useInternetIdentity';
import type { UpdateBalanceResult, UtxoStatus } from '../lib/ckBtcMinter/client';

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
        // update_balance is an UPDATE call (not query)
        // Pass empty arrays for optional fields - the minter will use the caller's principal
        // by default when owner is not specified (empty optional)
        const updateResult = await minterClient.update_balance({
          owner: [],
          subaccount: [],
        });

        console.log('[useCkBtcDepositStatus] Update balance result:', updateResult);

        // Parse results to determine deposit status
        // The result is an array of Result<UtxoStatus, UpdateBalanceError>
        const utxos: Array<{
          confirmations: number;
          value: bigint;
          status: 'pending' | 'confirmed' | 'minted';
        }> = [];

        if (Array.isArray(updateResult)) {
          for (const result of updateResult) {
            if ('Ok' in result) {
              const utxoStatus = result.Ok;
              
              if ('Checked' in utxoStatus) {
                // Pending UTXO with confirmations
                utxos.push({
                  confirmations: utxoStatus.Checked.confirmations,
                  value: utxoStatus.Checked.value,
                  status: 'pending',
                });
              } else if ('Minted' in utxoStatus) {
                // Already minted
                utxos.push({
                  confirmations: 0,
                  value: utxoStatus.Minted.minted_amount,
                  status: 'minted',
                });
              }
            }
          }
        }

        const hasPendingDeposits = utxos.some((utxo) => utxo.status === 'pending');

        return {
          hasPendingDeposits,
          utxos,
        };
      } catch (error: any) {
        console.error('[useCkBtcDepositStatus] Error checking deposit status:', error);
        
        // Check if this is a local development environment issue or mainnet-only feature
        if (error?.message?.includes('Not a vector type') ||
            error?.message?.includes('has no query method') ||
            error?.message?.includes('has no update method') ||
            error?.message?.includes('Canister has no query method') ||
            error?.message?.includes('Canister rejected the message') ||
            error?.message?.includes('Canister not found')) {
          // Return empty status for local development or when minter is unavailable
          console.log('[useCkBtcDepositStatus] Returning empty status (local dev or unavailable minter)');
          return {
            hasPendingDeposits: false,
            utxos: [],
          };
        }
        
        throw error;
      }
    },
    enabled: !!minterClient && !isInitializing && !!identity,
    refetchInterval: false, // Disable polling to avoid repeated errors in local development
    retry: false, // Don't retry on local development errors
    staleTime: 30_000, // Cache for 30 seconds
  });
}
