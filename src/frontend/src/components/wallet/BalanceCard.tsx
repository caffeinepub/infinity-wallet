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
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={tokenIcon} alt={tokenName} className="h-7 w-7 rounded-full" />
            <div>
              <CardTitle className="text-sm">{tokenName}</CardTitle>
              <CardDescription className="text-xs">Balance</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={isRefetching}
            className="h-6 w-6 hover:bg-primary/10"
          >
            <RefreshCw className={`h-3 w-3 ${isRefetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-3 w-3" />
            <AlertDescription className="text-xs">
              Failed to load balance: {error.message}
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <>
            <Skeleton className="h-6 w-24 mb-1.5" />
            <Skeleton className="h-3 w-20" />
          </>
        ) : (
          <>
            <div className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {formatBalance(balance)}
            </div>
            {usdValue !== undefined && (
              <div className="text-xs text-muted-foreground mt-1 break-all">
                {formatUSD(usdValue)}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
