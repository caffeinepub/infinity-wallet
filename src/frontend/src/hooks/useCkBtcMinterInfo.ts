import { useQuery } from '@tanstack/react-query';
import { useCkBtcMinter } from './useCkBtcMinter';
import { type MinterInfo } from '@/lib/ckBtcMinter';

export function useCkBtcMinterInfo() {
  const { minterClient, isInitializing } = useCkBtcMinter();

  return useQuery<MinterInfo>({
    queryKey: ['ckBtcMinterInfo'],
    queryFn: async () => {
      if (!minterClient) {
        throw new Error('ckBTC minter client not available');
      }

      console.log('[useCkBtcMinterInfo] Fetching minter info...');
      const info = await minterClient.get_minter_info();
      console.log('[useCkBtcMinterInfo] Minter info:', info);
      return info;
    },
    enabled: !!minterClient && !isInitializing,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
