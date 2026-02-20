import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, DollarSign } from 'lucide-react';
import { formatBalance, formatUSD } from '@/lib/validation';
import { TOKEN_INFINITY, TOKEN_ICP, TOKEN_CKBTC, TOKEN_CKETH, TOKEN_CKSOL } from '@/lib/branding';
import { useExchangeRates } from '../../hooks/useExchangeRates';

interface TotalAssetsDisplayProps {
  infinityCoinBalance: bigint;
  icpBalance: bigint;
  ckBtcBalance: bigint;
  ckEthBalance: bigint;
  ckSolBalance: bigint;
  isLoading: boolean;
  hasError: boolean;
}

type DenominationOption = 'USD' | 'Infinity Coin' | 'ICP' | 'ckBTC' | 'ckETH' | 'ckSOL';

export default function TotalAssetsDisplay({
  infinityCoinBalance,
  icpBalance,
  ckBtcBalance,
  ckEthBalance,
  ckSolBalance,
  isLoading,
  hasError,
}: TotalAssetsDisplayProps) {
  const [denomination, setDenomination] = useState<DenominationOption>('USD');
  const { data: exchangeRates, isLoading: ratesLoading, error: ratesError } = useExchangeRates();

  const calculateTotalUSD = (): number => {
    if (!exchangeRates) return 0;
    
    const infinityCoinUsd = (Number(infinityCoinBalance) / 100_000_000) * (exchangeRates['Infinity Coin'] || 0);
    const icpUsd = (Number(icpBalance) / 100_000_000) * (exchangeRates.ICP || 0);
    const ckBtcUsd = (Number(ckBtcBalance) / 100_000_000) * (exchangeRates.ckBTC || 0);
    const ckEthUsd = (Number(ckEthBalance) / 100_000_000) * (exchangeRates.ckETH || 0);
    const ckSolUsd = (Number(ckSolBalance) / 100_000_000) * (exchangeRates.ckSOL || 0);
    
    return infinityCoinUsd + icpUsd + ckBtcUsd + ckEthUsd + ckSolUsd;
  };

  const convertToToken = (totalUsd: number, tokenRate: number): number => {
    if (tokenRate === 0) return 0;
    return totalUsd / tokenRate;
  };

  const getDisplayValue = (): string => {
    if (isLoading || ratesLoading) return '...';
    if (hasError || ratesError) return 'Error';
    
    const totalUsd = calculateTotalUSD();
    
    if (denomination === 'USD') {
      return formatUSD(totalUsd);
    }
    
    const tokenRates: Record<string, number> = {
      'Infinity Coin': exchangeRates?.['Infinity Coin'] || 0,
      'ICP': exchangeRates?.ICP || 0,
      'ckBTC': exchangeRates?.ckBTC || 0,
      'ckETH': exchangeRates?.ckETH || 0,
      'ckSOL': exchangeRates?.ckSOL || 0,
    };
    
    const rate = tokenRates[denomination];
    const tokenAmount = convertToToken(totalUsd, rate);
    const tokenAmountE8s = BigInt(Math.floor(tokenAmount * 100_000_000));
    
    return formatBalance(tokenAmountE8s);
  };

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-md shadow-glow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          Total Assets
        </CardTitle>
        <CardDescription className="text-xs">Combined value across all tokens</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {hasError || ratesError ? (
          <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-3 w-3" />
            <AlertDescription className="text-xs">
              Failed to calculate total assets
            </AlertDescription>
          </Alert>
        ) : isLoading || ratesLoading ? (
          <>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-7 w-32" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent break-all">
              {getDisplayValue()}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Show in:</span>
              <Select value={denomination} onValueChange={(value) => setDenomination(value as DenominationOption)}>
                <SelectTrigger className="w-32 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD" className="text-xs">USD</SelectItem>
                  <SelectItem value="Infinity Coin" className="text-xs">{TOKEN_INFINITY}</SelectItem>
                  <SelectItem value="ICP" className="text-xs">{TOKEN_ICP}</SelectItem>
                  <SelectItem value="ckBTC" className="text-xs">{TOKEN_CKBTC}</SelectItem>
                  <SelectItem value="ckETH" className="text-xs">{TOKEN_CKETH}</SelectItem>
                  <SelectItem value="ckSOL" className="text-xs">{TOKEN_CKSOL}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
