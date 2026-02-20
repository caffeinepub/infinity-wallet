import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { formatBalance, formatUSD } from '@/lib/validation';

interface BalanceCardProps {
  tokenName: string;
  tokenIcon: string;
  balance: bigint;
  isLoading: boolean;
  error: Error | null;
  onRefresh: () => void;
  isRefetching?: boolean;
  usdValue?: number;
}

export default function BalanceCard({
  tokenName,
  tokenIcon,
  balance,
  isLoading,
  error,
  onRefresh,
  isRefetching = false,
  usdValue,
}: BalanceCardProps) {
  return (
    <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow-sm hover:shadow-glow transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={tokenIcon} alt={tokenName} className="h-10 w-10 rounded-full" />
            <div>
              <CardTitle className="text-lg">{tokenName}</CardTitle>
              <CardDescription className="text-xs">Balance</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={isRefetching}
            className="h-8 w-8 hover:bg-primary/10"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Failed to load balance: {error.message}
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {formatBalance(balance)}
            </div>
            {usdValue !== undefined && (
              <div className="text-sm text-muted-foreground mt-1">
                {formatUSD(usdValue)}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
