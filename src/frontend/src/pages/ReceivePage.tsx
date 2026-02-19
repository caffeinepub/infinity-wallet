import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { TOKEN_INFINITY } from '@/lib/branding';

export default function ReceivePage() {
  const [copied, setCopied] = useState(false);
  const { identity } = useInternetIdentity();

  const principal = identity?.getPrincipal().toString() || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(principal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Receive {TOKEN_INFINITY}
        </h1>
        <p className="text-muted-foreground">Share your account details to receive Infinity Coin</p>
      </div>

      <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow">
        <CardHeader>
          <CardTitle>Your ICRC-1 Account</CardTitle>
          <CardDescription>
            Share your Principal to receive {TOKEN_INFINITY}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Owner (Principal)</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border border-primary/20 bg-muted/30 backdrop-blur-sm p-3">
                <p className="font-mono text-xs break-all text-foreground">{principal}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0 border-primary/30 hover:bg-primary/10 shadow-glow-sm"
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Subaccount</label>
            <div className="rounded-lg border border-primary/20 bg-muted/30 backdrop-blur-sm p-3">
              <p className="font-mono text-sm text-muted-foreground">
                Default (empty array [])
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              This is your default subaccount. Funds sent to your Principal will arrive here.
            </p>
          </div>

          <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 space-y-2">
            <h3 className="font-medium text-sm text-accent">How to Receive</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Share your Principal with the sender</li>
              <li>They can send {TOKEN_INFINITY} to your Principal</li>
              <li>Funds will appear in your balance automatically</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
