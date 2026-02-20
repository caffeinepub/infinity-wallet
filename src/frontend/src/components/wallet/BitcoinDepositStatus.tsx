import { useCkBtcDepositStatus } from '@/hooks/useCkBtcDepositStatus';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock, CheckCircle2 } from 'lucide-react';

export function BitcoinDepositStatus() {
  const { data: depositStatus, isLoading, error, refetch } = useCkBtcDepositStatus();

  // Don't show anything if there are no pending deposits or if there's an error
  if (error || isLoading || !depositStatus?.hasPendingDeposits) {
    return null;
  }

  return (
    <Alert className="border-orange-500/30 bg-orange-500/5">
      <Clock className="h-4 w-4 text-orange-500" />
      <AlertTitle className="text-orange-500">Bitcoin Deposit Pending</AlertTitle>
      <AlertDescription className="space-y-2">
        <p className="text-sm">
          Your Bitcoin deposit is being processed. ckBTC will be minted automatically once the
          transaction receives enough confirmations.
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="border-orange-500/30 hover:bg-orange-500/10"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Status
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
