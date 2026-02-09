import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Copy, Check, Info } from 'lucide-react';
import { principalToAccountId } from '@/lib/icpAccountId';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ReceivePage() {
  const { identity } = useInternetIdentity();
  const [copied, setCopied] = useState(false);

  if (!identity) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Alert variant="destructive" className="border-destructive/50 shadow-glow-sm">
          <Info className="h-4 w-4" />
          <AlertDescription>Please sign in to view your receive address.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const principal = identity.getPrincipal();
  const accountId = principalToAccountId(principal);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountId);
      setCopied(true);
      toast.success('Account ID copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Receive ICP
        </h1>
        <p className="text-muted-foreground">Your ICP deposit address</p>
      </div>

      <Alert className="border-primary/30 bg-card/60 backdrop-blur-sm shadow-glow-sm">
        <Info className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Important Information</AlertTitle>
        <AlertDescription className="text-sm">
          When depositing ICP from centralized exchanges (like Coinbase, Binance, etc.), you must use your{' '}
          <span className="font-semibold text-foreground">ICP Account ID</span> shown below. Exchanges typically do not
          accept Principal IDs for deposits.
        </AlertDescription>
      </Alert>

      <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ICP Account ID
            </span>
          </CardTitle>
          <CardDescription>Use this address to receive ICP from exchanges and other wallets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-primary/30 bg-background/50 p-4 shadow-glow-sm">
            <code className="block break-all text-sm font-mono text-foreground">{accountId}</code>
          </div>

          <Button
            onClick={handleCopy}
            className="w-full gap-2 shadow-glow hover:shadow-glow-lg transition-all"
            size="lg"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Account ID
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-glow-sm">
        <CardHeader>
          <CardTitle className="text-lg">How to Deposit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              1
            </div>
            <p>Copy your ICP Account ID using the button above.</p>
          </div>
          <div className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              2
            </div>
            <p>Go to your exchange or wallet and initiate an ICP withdrawal.</p>
          </div>
          <div className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              3
            </div>
            <p>Paste your Account ID as the destination address.</p>
          </div>
          <div className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              4
            </div>
            <p>Your ICP will appear in your wallet balance once the transaction is confirmed on the network.</p>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-accent/30 bg-card/60 backdrop-blur-sm">
        <Info className="h-4 w-4 text-accent" />
        <AlertDescription className="text-sm">
          <span className="font-semibold text-foreground">Note:</span> Your Principal ID is different from your Account
          ID. Always use the Account ID shown above when receiving ICP from exchanges.
        </AlertDescription>
      </Alert>
    </div>
  );
}
