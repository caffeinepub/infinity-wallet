import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, DollarSign } from 'lucide-react';
import { formatBalance, formatUSD } from '@/lib/validation';
import { TOKEN_INFINITY, TOKEN_ICP, TOKEN_CKBTC, TOKEN_CKETH, TOKEN_CKSOL } from '@/lib/branding';
import { useExchangeRates } from '@/hooks/useExchangeRates';

type TokenType = 'infinityCoin' | 'icp' | 'ckBtc' | 'ckEth' | 'ckSol';

interface TotalAssetsDisplayProps {
  infinityCoinBalance: bigint;
  icpBalance: bigint;
  ckBtcBalance: bigint;
  ckEthBalance: bigint;
  ckSolBalance: bigint;
  isLoading: boolean;
  hasError: boolean;
}

export default function TotalAssetsDisplay({
  infinityCoinBalance,
  icpBalance,
  ckBtcBalance,
  ckEthBalance,
  ckSolBalance,
  isLoading,
  hasError,
}: TotalAssetsDisplayProps) {
  const [denominationCurrency, setDenominationCurrency] = useState<TokenType>('infinityCoin');
  const { data: exchangeRates, isLoading: ratesLoading, error: ratesError } = useExchangeRates();

  // Calculate total USD value
  const calculateTotalUSD = (): number => {
    if (!exchangeRates) return 0;

    const infinityCoinUSD = (Number(infinityCoinBalance) / 100_000_000) * (exchangeRates['Infinity Coin'] || 0);
    const icpUSD = (Number(icpBalance) / 100_000_000) * (exchangeRates.ICP || 0);
    const ckBtcUSD = (Number(ckBtcBalance) / 100_000_000) * (exchangeRates.ckBTC || 0);
    const ckEthUSD = (Number(ckEthBalance) / 100_000_000) * (exchangeRates.ckETH || 0);
    const ckSolUSD = (Number(ckSolBalance) / 100_000_000) * (exchangeRates.ckSOL || 0);

    return infinityCoinUSD + icpUSD + ckBtcUSD + ckEthUSD + ckSolUSD;
  };

  const calculateTotal = (): string => {
    switch (denominationCurrency) {
      case 'infinityCoin':
        return formatBalance(infinityCoinBalance);
      case 'icp':
        return formatBalance(icpBalance);
      case 'ckBtc':
        return formatBalance(ckBtcBalance);
      case 'ckEth':
        return formatBalance(ckEthBalance);
      case 'ckSol':
        return formatBalance(ckSolBalance);
      default:
        return '0.00';
    }
  };

  const getTokenLabel = (token: TokenType): string => {
    switch (token) {
      case 'infinityCoin':
        return TOKEN_INFINITY;
      case 'icp':
        return TOKEN_ICP;
      case 'ckBtc':
        return TOKEN_CKBTC;
      case 'ckEth':
        return TOKEN_CKETH;
      case 'ckSol':
        return TOKEN_CKSOL;
      default:
        return '';
    }
  };

  const totalUSD = calculateTotalUSD();

  return (
    <Card className="border-accent/30 bg-gradient-to-br from-card/90 to-accent/5 backdrop-blur-sm shadow-glow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardDescription className="text-accent/80 mb-2">Total Assets</CardDescription>
            
            {/* USD Value Display */}
            {isLoading || ratesLoading ? (
              <Skeleton className="h-16 w-80 mb-2" />
            ) : hasError || ratesError ? (
              <div className="text-2xl text-destructive mb-2">Error loading value</div>
            ) : (
              <div className="mb-3">
                <div className="flex items-baseline gap-2">
                  <DollarSign className="h-8 w-8 text-primary" />
                  <CardTitle className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                    {formatUSD(totalUSD).replace('$', '')}
                  </CardTitle>
                  <span className="text-2xl text-muted-foreground">USD</span>
                </div>
              </div>
            )}

            {/* Token Denomination Display */}
            <div className="text-sm text-muted-foreground">
              {isLoading ? (
                <Skeleton className="h-6 w-48" />
              ) : hasError ? (
                <span className="text-destructive">Error</span>
              ) : (
                <span>
                  {calculateTotal()} {getTokenLabel(denominationCurrency)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <label className="text-xs text-muted-foreground">Denomination</label>
            <Select value={denominationCurrency} onValueChange={(value) => setDenominationCurrency(value as TokenType)}>
              <SelectTrigger className="w-[180px] border-primary/30 shadow-glow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="infinityCoin">{TOKEN_INFINITY}</SelectItem>
                <SelectItem value="icp">{TOKEN_ICP}</SelectItem>
                <SelectItem value="ckBtc">{TOKEN_CKBTC}</SelectItem>
                <SelectItem value="ckEth">{TOKEN_CKETH}</SelectItem>
                <SelectItem value="ckSol">{TOKEN_CKSOL}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {hasError && (
          <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Unable to calculate total assets. Some balances failed to load.
            </AlertDescription>
          </Alert>
        )}
        {ratesError && !hasError && (
          <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Unable to fetch current exchange rates. USD values may be unavailable.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
