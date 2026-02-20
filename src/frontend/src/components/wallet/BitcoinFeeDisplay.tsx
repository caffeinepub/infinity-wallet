import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Clock } from 'lucide-react';
import { formatSatoshisToBtc } from '@/lib/validation';

interface BitcoinFeeDisplayProps {
  feeSatoshis?: bigint;
  isLoading?: boolean;
}

export default function BitcoinFeeDisplay({ feeSatoshis, isLoading }: BitcoinFeeDisplayProps) {
  return (
    <Alert className="border-accent/30 bg-accent/5">
      <Info className="h-4 w-4 text-accent" />
      <AlertDescription>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-accent">Bitcoin Network Fee:</span>
            {isLoading ? (
              <span className="text-muted-foreground">Calculating...</span>
            ) : feeSatoshis ? (
              <span className="font-mono">
                {feeSatoshis.toString()} sats (~{formatSatoshisToBtc(feeSatoshis)} BTC)
              </span>
            ) : (
              <span className="text-muted-foreground">Variable</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Processing time: 40+ minutes (6 Bitcoin confirmations required)</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Your ckBTC will be burned and native Bitcoin will be sent to the specified address.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
}
