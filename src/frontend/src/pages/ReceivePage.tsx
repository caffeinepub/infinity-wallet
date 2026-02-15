import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Check, Info } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ReceivePage() {
  const { identity } = useInternetIdentity();
  const [copiedPrincipal, setCopiedPrincipal] = useState(false);

  if (!identity) {
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
            Please sign in with Internet Identity to view your receive address.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const principal = identity.getPrincipal();
  const principalText = principal.toString();

  const handleCopyPrincipal = async () => {
    try {
      await navigator.clipboard.writeText(principalText);
      setCopiedPrincipal(true);
      toast.success('Principal copied to clipboard');
      setTimeout(() => setCopiedPrincipal(false), 2000);
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
          <CardTitle>Your ICRC-1 Account</CardTitle>
          <CardDescription>Share this Principal to receive Infinity Coin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Owner Principal</Label>
            <div className="rounded-lg border border-primary/30 bg-muted/30 backdrop-blur-sm p-4 shadow-glow-sm">
              <p className="font-mono text-sm break-all text-primary">{principalText}</p>
            </div>
            <Button
              onClick={handleCopyPrincipal}
              className="w-full gap-2 shadow-glow hover:shadow-glow-lg transition-all"
            >
              {copiedPrincipal ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Principal
                </>
              )}
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Subaccount</Label>
            <div className="rounded-lg border border-primary/30 bg-muted/30 backdrop-blur-sm p-4 shadow-glow-sm">
              <p className="text-sm text-muted-foreground">Default (all zeros)</p>
            </div>
          </div>

          <Alert className="border-accent/30 bg-accent/5 shadow-glow-sm">
            <Info className="h-4 w-4 text-accent" />
            <AlertDescription className="text-xs">
              This is your ICRC-1 account for receiving Infinity Coin. The account consists of your Principal (owner) and the default subaccount. Share your Principal with senders.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
