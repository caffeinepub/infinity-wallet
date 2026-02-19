import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { TOKEN_INFINITY, TOKEN_ICP, TOKEN_CKBTC, TOKEN_CKETH, TOKEN_CKSOL } from '@/lib/branding';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ReceivePage() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const { identity } = useInternetIdentity();

  const principal = identity?.getPrincipal().toString() || '';

  const handleCopy = (tokenName: string) => {
    navigator.clipboard.writeText(principal);
    setCopiedToken(tokenName);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const tokens = [
    { name: TOKEN_INFINITY, icon: '/assets/generated/infinity-coin-icon.dim_512x512.png' },
    { name: TOKEN_ICP, icon: '/assets/generated/icp-logo.dim_64x64.png' },
    { name: TOKEN_CKBTC, icon: '/assets/generated/ckbtc-logo.dim_64x64.png' },
    { name: TOKEN_CKETH, icon: '/assets/generated/cketh-logo.dim_64x64.png' },
    { name: TOKEN_CKSOL, icon: '/assets/generated/cksol-logo.dim_64x64.png' },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Receive Tokens
        </h1>
        <p className="text-muted-foreground">Share your account details to receive tokens</p>
      </div>

      <Alert className="border-accent/30 bg-accent/5 shadow-glow-sm">
        <AlertDescription>
          <h3 className="font-medium text-sm text-accent mb-2">✨ Unified ICRC-1 Addressing</h3>
          <p className="text-sm text-muted-foreground">
            Your Principal address works for all ICRC-1 tokens! You can receive {TOKEN_INFINITY}, {TOKEN_ICP}, {TOKEN_CKBTC}, {TOKEN_CKETH}, and {TOKEN_CKSOL} using the same address.
          </p>
        </AlertDescription>
      </Alert>

      <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow">
        <CardHeader>
          <CardTitle>Your Principal Address</CardTitle>
          <CardDescription>
            This address works for all supported tokens
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Principal</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border border-primary/20 bg-muted/30 backdrop-blur-sm p-3">
                <p className="font-mono text-xs break-all text-foreground">{principal}</p>
              </div>
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
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Supported Tokens</h2>
        <div className="grid gap-3">
          {tokens.map((token) => (
            <Card key={token.name} className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow-sm hover:shadow-glow transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={token.icon} alt={token.name} className="h-10 w-10 rounded-full" />
                    <div>
                      <p className="font-medium">{token.name}</p>
                      <p className="text-xs text-muted-foreground">Same address for all tokens</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(token.name)}
                    className="gap-2 border-primary/30 hover:bg-primary/10 shadow-glow-sm"
                  >
                    {copiedToken === token.name ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Address
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 space-y-2">
        <h3 className="font-medium text-sm text-accent">How to Receive</h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Share your Principal with the sender</li>
          <li>They can send any supported ICRC-1 token to your Principal</li>
          <li>Funds will appear in your balance automatically</li>
          <li>No need for different addresses per token!</li>
        </ul>
      </div>
    </div>
  );
}
