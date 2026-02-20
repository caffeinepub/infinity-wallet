import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCkBtcMinter } from './useCkBtcMinter';
import { formatRetrieveBtcError } from '@/lib/ckBtcMinter';

interface WithdrawBtcArgs {
  address: string;
  amountSatoshis: bigint;
}

export function useCkBtcWithdraw() {
  const { minterClient } = useCkBtcMinter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ address, amountSatoshis }: WithdrawBtcArgs) => {
      if (!minterClient) {
        throw new Error('ckBTC minter client not available');
      }

      console.log('[useCkBtcWithdraw] Initiating Bitcoin withdrawal...');
      console.log('[useCkBtcWithdraw] Address:', address);
      console.log('[useCkBtcWithdraw] Amount (satoshis):', amountSatoshis.toString());

      const result = await minterClient.retrieve_btc({
        address,
        amount: amountSatoshis,
      });

      if ('Err' in result) {
        const errorMessage = formatRetrieveBtcError(result.Err);
        console.error('[useCkBtcWithdraw] Withdrawal failed:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log('[useCkBtcWithdraw] Withdrawal initiated. Block index:', result.Ok);
      return result.Ok;
    },
    onSuccess: (blockIndex) => {
      console.log('[useCkBtcWithdraw] Withdrawal successful, invalidating queries...');
      queryClient.invalidateQueries({ queryKey: ['ckBtcBalance'] });
      queryClient.invalidateQueries({ queryKey: ['transactionHistory'] });
      queryClient.invalidateQueries({ queryKey: ['ckBtcWithdrawalStatus', blockIndex] });
    },
  });
}
