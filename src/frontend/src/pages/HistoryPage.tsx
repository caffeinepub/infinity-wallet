import { useState } from 'react';
import { useGetTransactionHistory } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, AlertCircle, History, ArrowUpRight } from 'lucide-react';
import { formatBalance } from '@/lib/validation';
import { formatTimestamp, truncatePrincipal } from '@/lib/utils';
import { TOKEN_INFINITY, TOKEN_ICP, TOKEN_CKBTC, TOKEN_CKETH, TOKEN_CKSOL } from '@/lib/branding';
import { CoinType } from '../backend';

export default function HistoryPage() {
  const { data: transactions, isLoading, error, refetch, isRefetching } = useGetTransactionHistory();
  const [filterToken, setFilterToken] = useState<string>('all');

  const getTokenLabel = (coinType: CoinType): string => {
    switch (coinType) {
      case CoinType.infinityCoin:
        return TOKEN_INFINITY;
      case CoinType.icp:
        return TOKEN_ICP;
      case CoinType.ckBtc:
        return TOKEN_CKBTC;
      case CoinType.ckEth:
        return TOKEN_CKETH;
      case CoinType.ckSol:
        return TOKEN_CKSOL;
      default:
        return 'Unknown';
    }
  };

  const getTokenIcon = (coinType: CoinType): string => {
    switch (coinType) {
      case CoinType.infinityCoin:
        return '/assets/generated/infinity-coin-icon.dim_512x512.png';
      case CoinType.icp:
        return '/assets/generated/icp-logo.dim_64x64.png';
      case CoinType.ckBtc:
        return '/assets/generated/ckbtc-logo.dim_64x64.png';
      case CoinType.ckEth:
        return '/assets/generated/cketh-logo.dim_64x64.png';
      case CoinType.ckSol:
        return '/assets/generated/cksol-logo.dim_64x64.png';
      default:
        return '';
    }
  };

  const filteredTransactions = transactions?.filter((tx) => {
    if (filterToken === 'all') return true;
    return tx.coinType === filterToken;
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Transaction History
          </h1>
          <p className="text-muted-foreground">View your recent transactions</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="gap-2 border-primary/30 hover:shadow-glow-sm transition-all"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Alert className="border-accent/30 bg-accent/5 shadow-glow-sm">
        <AlertCircle className="h-4 w-4 text-accent" />
        <AlertDescription className="text-xs">
          This displays locally recorded transaction submissions. Your actual token balances and transfers are controlled by the live ICRC-1 ledgers. Native on-chain transfers will be marked accordingly once chain-key integration is complete.
        </AlertDescription>
      </Alert>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-muted-foreground">Filter by token:</label>
        <Select value={filterToken} onValueChange={setFilterToken}>
          <SelectTrigger className="w-[200px] border-primary/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tokens</SelectItem>
            <SelectItem value={CoinType.infinityCoin}>{TOKEN_INFINITY}</SelectItem>
            <SelectItem value={CoinType.icp}>{TOKEN_ICP}</SelectItem>
            <SelectItem value={CoinType.ckBtc}>{TOKEN_CKBTC}</SelectItem>
            <SelectItem value={CoinType.ckEth}>{TOKEN_CKETH}</SelectItem>
            <SelectItem value={CoinType.ckSol}>{TOKEN_CKSOL}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Alert variant="destructive" className="border-destructive/50 shadow-glow-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load history: {(error as Error).message}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-border/50 pb-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : filteredTransactions && filteredTransactions.length > 0 ? (
        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <Card 
              key={tx.id.toString()} 
              className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow-sm hover:shadow-glow transition-all"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <img src={getTokenIcon(tx.coinType)} alt={getTokenLabel(tx.coinType)} className="h-6 w-6 rounded-full" />
                      <ArrowUpRight className="h-4 w-4 text-accent" />
                      <CardTitle className="text-base">Sent</CardTitle>
                      <Badge 
                        variant="outline" 
                        className="text-xs border-accent/30 text-accent"
                      >
                        {getTokenLabel(tx.coinType)}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      To: <span className="font-mono">{truncatePrincipal(tx.recipient, 10, 6)}</span>
                    </CardDescription>
                    <CardDescription className="text-xs text-muted-foreground">
                      {formatTimestamp(tx.timestamp)}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {formatBalance(tx.amountE8)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getTokenLabel(tx.coinType)}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 shadow-glow-sm mb-4">
              <History className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              {filterToken === 'all' ? 'No transactions yet' : `No ${getTokenLabel(filterToken as CoinType)} transactions yet`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
