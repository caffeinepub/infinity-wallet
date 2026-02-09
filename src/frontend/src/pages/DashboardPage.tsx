import { useGetBalances } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { formatBalance } from '@/lib/validation';
import { TOKEN_ICP, TOKEN_INFINITY } from '@/lib/branding';

export default function DashboardPage() {
  const { data: balances, isLoading, error, refetch, isRefetching } = useGetBalances();

  const icpBalance = balances ? balances[0] : BigInt(0);
  const infinityBalance = balances ? balances[1] : BigInt(0);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">View your wallet balances</p>
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

      {error && (
        <Alert variant="destructive" className="border-destructive/50 shadow-glow-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load balances: {(error as Error).message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* ICP Balance Card */}
        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow-sm hover:shadow-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{TOKEN_ICP}</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 shadow-glow-sm">
              <span className="text-lg font-bold text-primary">₿</span>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {formatBalance(icpBalance)}
                </div>
                <CardDescription className="text-xs">Internet Computer Protocol</CardDescription>
              </>
            )}
          </CardContent>
        </Card>

        {/* Infinity Coin Balance Card */}
        <Card className="border-accent/20 bg-card/80 backdrop-blur-sm shadow-glow-accent hover:shadow-glow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{TOKEN_INFINITY}</CardTitle>
            <div className="relative">
              <img
                src="/assets/generated/infinity-coin-icon.dim_512x512.png"
                alt={TOKEN_INFINITY}
                className="h-10 w-10 rounded-full shadow-glow-accent"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mix-blend-overlay pointer-events-none" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent">
                  {formatBalance(infinityBalance)}
                </div>
                <CardDescription className="text-xs">Your custom token</CardDescription>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-glow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Manage your wallet</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="border-primary/30 hover:shadow-glow-sm transition-all">
            Receive
          </Button>
          <Button variant="outline" size="sm" className="border-primary/30 hover:shadow-glow-sm transition-all">
            View History
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
