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
        let icpUsdRate: number | undefined;
        let ckBtcIcpRate: number | undefined;
        let ckEthIcpRate: number | undefined;
        let ckSolIcpRate: number | undefined;
        let infinityCoinRate: number | undefined;
        
        // Extract rates from the ICPSwap response
        if (data.data) {
          Object.keys(data.data).forEach((key) => {
            const tickData = data.data![key];
            const upperKey = key.toUpperCase();
            
            // ICP/USD - direct USD rate
            if (upperKey.includes('ICP') && upperKey.includes('USD') && tickData.close) {
              icpUsdRate = tickData.close;
              rates.ICP = tickData.close;
              console.log(`Found ICP/USD rate: $${tickData.close}`);
            }
            
            // ckBTC/ICP - needs to be converted to USD using ICP rate
            if (upperKey.includes('CKBTC') && upperKey.includes('ICP') && !upperKey.includes('USD') && tickData.close) {
              ckBtcIcpRate = tickData.close;
              console.log(`Found ckBTC/ICP rate: ${tickData.close} ICP`);
            }
            
            // ckETH/ICP - needs to be converted to USD using ICP rate
            if (upperKey.includes('CKETH') && upperKey.includes('ICP') && !upperKey.includes('USD') && tickData.close) {
              ckEthIcpRate = tickData.close;
              console.log(`Found ckETH/ICP rate: ${tickData.close} ICP`);
            }
            
            // ckSOL/ICP - needs to be converted to USD using ICP rate
            if (upperKey.includes('CKSOL') && upperKey.includes('ICP') && !upperKey.includes('USD') && tickData.close) {
              ckSolIcpRate = tickData.close;
              console.log(`Found ckSOL/ICP rate: ${tickData.close} ICP`);
            }
            
            // Infinity Coin - look for various possible naming patterns
            if ((upperKey.includes('INFINITY') || upperKey.includes('INFINITYCOIN')) && tickData.close) {
              if (upperKey.includes('USD')) {
                // Direct USD rate
                infinityCoinRate = tickData.close;
                console.log(`Found Infinity Coin/USD rate: $${tickData.close}`);
              } else if (upperKey.includes('ICP')) {
                // ICP rate - will convert to USD later
                infinityCoinRate = tickData.close;
                console.log(`Found Infinity Coin/ICP rate: ${tickData.close} ICP (will convert to USD)`);
              }
            }
          });
        }
        
        // Calculate USD values for tokens priced in ICP
        if (icpUsdRate) {
          if (ckBtcIcpRate) {
            rates.ckBTC = ckBtcIcpRate * icpUsdRate;
            console.log(`Calculated ckBTC USD rate: $${rates.ckBTC} (${ckBtcIcpRate} ICP × $${icpUsdRate})`);
          }
          
          if (ckEthIcpRate) {
            rates.ckETH = ckEthIcpRate * icpUsdRate;
            console.log(`Calculated ckETH USD rate: $${rates.ckETH} (${ckEthIcpRate} ICP × $${icpUsdRate})`);
          }
          
          if (ckSolIcpRate) {
            rates.ckSOL = ckSolIcpRate * icpUsdRate;
            console.log(`Calculated ckSOL USD rate: $${rates.ckSOL} (${ckSolIcpRate} ICP × $${icpUsdRate})`);
          }
          
          // If Infinity Coin rate is in ICP, convert to USD
          if (infinityCoinRate && !rates['Infinity Coin']) {
            rates['Infinity Coin'] = infinityCoinRate * icpUsdRate;
            console.log(`Calculated Infinity Coin USD rate: $${rates['Infinity Coin']} (${infinityCoinRate} ICP × $${icpUsdRate})`);
          }
        }
        
        // If we still don't have Infinity Coin rate, use a very small default
        // This matches the user's stated price of $0.00000129
        if (!rates['Infinity Coin']) {
          rates['Infinity Coin'] = 0.00000129;
          console.log('Using default Infinity Coin rate: $0.00000129');
        }
        
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
