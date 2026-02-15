import { useGetTransactionHistory } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, AlertCircle, History, ArrowUpRight } from 'lucide-react';
import { formatBalance } from '@/lib/validation';
import { formatTimestamp, truncatePrincipal } from '@/lib/utils';
import { TOKEN_INFINITY } from '@/lib/branding';

export default function HistoryPage() {
  const { data: transactions, isLoading, error, refetch, isRefetching } = useGetTransactionHistory();

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
          This displays locally recorded transaction submissions. Your actual Infinity Coin balance and transfers are controlled by the live ICRC-1 ledger.
        </AlertDescription>
      </Alert>

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
      ) : transactions && transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <Card 
              key={tx.id.toString()} 
              className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow-sm hover:shadow-glow transition-all"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4 text-accent" />
                      <CardTitle className="text-base">Sent</CardTitle>
                      <Badge 
                        variant="outline" 
                        className="text-xs border-accent/30 text-accent"
                      >
                        {TOKEN_INFINITY}
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
                      {TOKEN_INFINITY}
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
            <p className="text-sm text-muted-foreground">No transactions yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
