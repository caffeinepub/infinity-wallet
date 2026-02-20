import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle2, Clock } from 'lucide-react';
import { useCkBtcDepositStatus } from '../../hooks/useCkBtcDepositStatus';

export default function BitcoinDepositStatus() {
  const { data: depositStatus, isLoading } = useCkBtcDepositStatus();

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Checking for Bitcoin deposits...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!depositStatus?.hasPendingDeposits) {
    return null;
  }

  return (
    <Card className="border-accent/30 bg-accent/5 shadow-glow animate-glow-pulse">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-accent" />
          <CardTitle className="text-lg">Bitcoin Deposit in Progress</CardTitle>
        </div>
        <CardDescription>Your Bitcoin deposit is being processed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confirmations:</span>
            <span className="font-medium text-accent">Waiting for Bitcoin network...</span>
          </div>
          <Progress value={50} className="h-2" />
          <p className="text-xs text-muted-foreground">
            ckBTC will be minted after 6 Bitcoin confirmations (~60 minutes)
          </p>
        </div>

        <div className="rounded-lg border border-accent/20 bg-muted/30 p-3">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Bitcoin transaction detected</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
