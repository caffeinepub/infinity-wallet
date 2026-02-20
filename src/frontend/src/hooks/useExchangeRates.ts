import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export interface ExchangeRates {
  ICP?: number;
  ckBTC?: number;
  ckETH?: number;
  ckSOL?: number;
  'Infinity Coin'?: number;
}

interface ICPSwapTickData {
  data?: {
    [key: string]: {
      close?: number;
      [key: string]: any;
    };
  };
}

export function useExchangeRates() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ExchangeRates>({
    queryKey: ['exchangeRates'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        const response = await actor.getCurrentRates();
        console.log('Raw exchange rate response:', response);
        
        // Parse the JSON response from ICPSwap
        const data: ICPSwapTickData = JSON.parse(response);
        console.log('Parsed exchange rate data:', data);
        
        const rates: ExchangeRates = {};
        
        // Extract rates from the ICPSwap response
        // The API returns data with token pair keys like "ICP/USD", "BTC/USD", etc.
        if (data.data) {
          // Map ICPSwap token symbols to our token names
          const tokenMapping: { [key: string]: keyof ExchangeRates } = {
            'ICP': 'ICP',
            'BTC': 'ckBTC',
            'ETH': 'ckETH',
            'SOL': 'ckSOL',
          };
          
          // Look for USD pairs in the data
          Object.keys(data.data).forEach((key) => {
            const tickData = data.data![key];
            
            // Try to match token pairs like "ICP/USD", "ICP-USD", "ICPUSD", etc.
            for (const [symbol, tokenName] of Object.entries(tokenMapping)) {
              if (key.toUpperCase().includes(symbol) && key.toUpperCase().includes('USD')) {
                if (tickData.close && typeof tickData.close === 'number') {
                  rates[tokenName] = tickData.close;
                  console.log(`Found rate for ${tokenName}: $${tickData.close}`);
                }
                break;
              }
            }
          });
        }
        
        // For Infinity Coin, we'll use a mock rate since it's not on ICPSwap yet
        // In production, this would come from the actual market data
        rates['Infinity Coin'] = 0.01;
        
        console.log('Final exchange rates:', rates);
        return rates;
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        throw error;
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 60_000, // Cache for 60 seconds
    refetchInterval: 60_000, // Refetch every 60 seconds
    retry: 2,
  });
}
