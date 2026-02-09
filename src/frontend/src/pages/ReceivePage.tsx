import { useOisyWallet } from '../hooks/useOisyWallet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Check, Info } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ReceivePage() {
  const { identity, isConnected } = useOisyWallet();
  const [copied, setCopied] = useState(false);

  if (!isConnected || !identity) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Receive
          </h1>
          <p className="text-muted-foreground">Get your wallet address</p>
        </div>
        <Alert className="border-accent/30 bg-accent/5 shadow-glow-sm">
          <Info className="h-4 w-4 text-accent" />
          <AlertDescription>
            Please connect your Oisy Wallet to view your receive address.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const principal = identity.getPrincipal().toString();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(principal);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy address');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Receive
        </h1>
        <p className="text-muted-foreground">Share your address to receive Infinity Coin</p>
      </div>

      <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow-sm hover:shadow-glow transition-all">
        <CardHeader>
          <CardTitle>Your Infinity Coin Address</CardTitle>
          <CardDescription>Share this address to receive Infinity Coin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="rounded-lg border border-primary/30 bg-muted/30 backdrop-blur-sm p-4 shadow-glow-sm">
              <p className="font-mono text-sm break-all text-primary">{principal}</p>
            </div>
            <Button
              onClick={handleCopy}
              className="w-full gap-2 shadow-glow hover:shadow-glow-lg transition-all"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Address
                </>
              )}
            </Button>
          </div>

          <Alert className="border-accent/30 bg-accent/5 shadow-glow-sm">
            <Info className="h-4 w-4 text-accent" />
            <AlertDescription className="text-xs">
              This is your Oisy Wallet principal address. Use it to receive Infinity Coin transfers.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
