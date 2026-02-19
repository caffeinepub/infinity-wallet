import { useInfinityCoinBalance } from '../hooks/useInfinityCoinBalance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle, Download, History, Copy } from 'lucide-react';
import { formatBalance } from '@/lib/validation';
import { TOKEN_INFINITY } from '@/lib/branding';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { INFINITY_COIN_LEDGER_CANISTER_ID } from '@/lib/infinityLedger/config';
import { useState } from 'react';

type Page = 'dashboard' | 'send' | 'contacts' | 'history' | 'receive' | 'contracts';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { balance, isLoading, error, refetch, isRefetching } = useInfinityCoinBalance();
  const { identity } = useInternetIdentity();
  const [copied, setCopied] = useState(false);

  const errorTimestamp = error ? new Date().toISOString() : null;
  const principal = identity?.getPrincipal().toString() || 'Not authenticated';

  // Log error details when error changes
  if (error) {
    console.error('🚨 Dashboard Balance Error:', {
      timestamp: errorTimestamp,
      principal,
      ledgerCanisterId: INFINITY_COIN_LEDGER_CANISTER_ID,
      errorMessage: (error as Error).message,
      errorStack: (error as Error).stack,
      fullError: error,
    });
  }

  const copyErrorDetails = () => {
    const errorDetails = `
Infinity Wallet - Balance Error Debug Info
==========================================
Timestamp: ${errorTimestamp}
Principal: ${principal}
Ledger Canister ID: ${INFINITY_COIN_LEDGER_CANISTER_ID}
Error Message: ${(error as Error).message}
Error Stack: ${(error as Error).stack || 'No stack trace available'}

Full Error Object:
${JSON.stringify(error, null, 2)}
    `.trim();

    navigator.clipboard.writeText(errorDetails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">View your wallet balance</p>
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
          <AlertDescription className="space-y-3">
            <div className="font-semibold">Failed to load balance</div>
            <div className="text-sm space-y-2">
              <div>
                <span className="font-medium">Error:</span> {(error as Error).message}
              </div>
              <div>
                <span className="font-medium">Principal:</span> {principal}
              </div>
              <div>
                <span className="font-medium">Ledger Canister:</span> {INFINITY_COIN_LEDGER_CANISTER_ID}
              </div>
              <div>
                <span className="font-medium">Timestamp:</span> {errorTimestamp}
              </div>
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyErrorDetails}
                className="gap-2 h-8 text-xs"
              >
                <Copy className="h-3 w-3" />
                {copied ? 'Copied!' : 'Copy Error Details'}
              </Button>
            </div>
            <div className="text-xs text-muted-foreground pt-2 border-t border-destructive/20">
              💡 Check the browser console (F12) for detailed debugging logs
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {/* Infinity Coin Balance Card */}
        <Card className="border-accent/30 bg-gradient-to-br from-card/90 to-accent/5 backdrop-blur-sm shadow-glow hover:shadow-glow-lg transition-all">
          <CardHeader>
            <CardDescription className="text-accent/80">Infinity Coin Balance</CardDescription>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
              {isLoading ? (
                <Skeleton className="h-12 w-48" />
              ) : (
                <>
                  {formatBalance(balance)} <span className="text-2xl">{TOKEN_INFINITY}</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your Infinity Coin</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Button
            onClick={() => onNavigate('receive')}
            variant="outline"
            className="gap-2 border-primary/30 hover:shadow-glow-sm transition-all"
          >
            <Download className="h-4 w-4" />
            Receive
          </Button>
          <Button
            onClick={() => onNavigate('history')}
            variant="outline"
            className="gap-2 border-primary/30 hover:shadow-glow-sm transition-all"
          >
            <History className="h-4 w-4" />
            View History
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
