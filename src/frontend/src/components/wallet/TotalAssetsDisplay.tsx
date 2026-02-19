import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { formatBalance } from '@/lib/validation';
import { TOKEN_INFINITY, TOKEN_ICP, TOKEN_CKBTC, TOKEN_CKETH, TOKEN_CKSOL } from '@/lib/branding';

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

  // Mock exchange rates (in reality, these would come from an API)
  // For now, we'll just display the sum in the selected token without conversion
  const calculateTotal = (): string => {
    // Since we don't have real exchange rates, we'll just show the balance of the selected token
    // In a real implementation, you would convert all balances to the selected denomination
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

  return (
    <Card className="border-accent/30 bg-gradient-to-br from-card/90 to-accent/5 backdrop-blur-sm shadow-glow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardDescription className="text-accent/80">Total Assets</CardDescription>
            <CardTitle className="text-5xl font-bold bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
              {isLoading ? (
                <Skeleton className="h-14 w-64" />
              ) : hasError ? (
                <span className="text-2xl text-destructive">Error</span>
              ) : (
                <>
                  {calculateTotal()} <span className="text-3xl">{getTokenLabel(denominationCurrency)}</span>
                </>
              )}
            </CardTitle>
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
        {!hasError && !isLoading && (
          <p className="text-xs text-muted-foreground">
            Note: Total shown in selected denomination. Exchange rate conversion not yet implemented.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
