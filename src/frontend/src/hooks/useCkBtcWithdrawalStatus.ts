import { useQuery } from '@tanstack/react-query';
import { useCkBtcMinter } from './useCkBtcMinter';
import { type RetrieveBtcStatus } from '@/lib/ckBtcMinter';

export function useCkBtcWithdrawalStatus(blockIndex: bigint | null) {
  const { minterClient, isInitializing } = useCkBtcMinter();

  return useQuery<RetrieveBtcStatus | null>({
    queryKey: ['ckBtcWithdrawalStatus', blockIndex?.toString()],
    queryFn: async () => {
      if (!minterClient || !blockIndex) {
        return null;
      }

      console.log('[useCkBtcWithdrawalStatus] Checking withdrawal status for block:', blockIndex.toString());

      const status = await minterClient.retrieve_btc_status({
        block_index: blockIndex,
      });

      console.log('[useCkBtcWithdrawalStatus] Status:', status);
      return status;
    },
    enabled: !!minterClient && !isInitializing && blockIndex !== null,
    refetchInterval: (data) => {
      // Stop polling if confirmed
      if (data && 'Confirmed' in data) {
        return false;
      }
      return 10000; // Poll every 10 seconds
    },
    retry: 2,
  });
}
