import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetBtcAddress, useGetEthAddress, useGetSolAddress } from '../hooks/useQueries';
import { TOKEN_INFINITY, TOKEN_ICP, TOKEN_CKBTC, TOKEN_CKETH, TOKEN_CKSOL } from '@/lib/branding';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

export default function ReceivePage() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const { identity } = useInternetIdentity();

  const { data: btcAddress, isLoading: btcLoading, error: btcError } = useGetBtcAddress();
  const { data: ethAddress, isLoading: ethLoading, error: ethError } = useGetEthAddress();
  const { data: solAddress, isLoading: solLoading, error: solError } = useGetSolAddress();

  const principal = identity?.getPrincipal().toString() || '';

  const handleCopy = (text: string, tokenName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(tokenName);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const wrappedTokens = [
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
            This address works for all supported ICRC-1 tokens
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
        <h2 className="text-xl font-semibold mb-4 text-foreground">Wrapped Tokens (ICRC-1)</h2>
        <div className="grid gap-3">
          {wrappedTokens.map((token) => (
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
                    onClick={() => handleCopy(principal, token.name)}
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

      <Separator className="my-8" />

      <div>
        <h2 className="text-xl font-semibold mb-2 text-foreground">Native Blockchain Addresses</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Receive native BTC, ETH, and SOL directly from external wallets
        </p>

        <div className="grid gap-3">
          {/* Bitcoin Address */}
          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img src="/assets/generated/ckbtc-logo.dim_64x64.png" alt="Bitcoin" className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <p className="font-medium">Bitcoin (BTC)</p>
                    <p className="text-xs text-muted-foreground">Native Bitcoin address</p>
                  </div>
                </div>
                {btcLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading address...</span>
                  </div>
                ) : btcError ? (
                  <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Chain-key Bitcoin integration coming soon
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-lg border border-primary/20 bg-muted/30 backdrop-blur-sm p-3">
                      <p className="font-mono text-xs break-all text-foreground">{btcAddress}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(btcAddress || '', 'BTC')}
                      className="gap-2 border-primary/30 hover:bg-primary/10 shadow-glow-sm"
                    >
                      {copiedToken === 'BTC' ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ethereum Address */}
          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img src="/assets/generated/cketh-logo.dim_64x64.png" alt="Ethereum" className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <p className="font-medium">Ethereum (ETH)</p>
                    <p className="text-xs text-muted-foreground">Native Ethereum address</p>
                  </div>
                </div>
                {ethLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading address...</span>
                  </div>
                ) : ethError ? (
                  <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Chain-key Ethereum integration coming soon
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-lg border border-primary/20 bg-muted/30 backdrop-blur-sm p-3">
                      <p className="font-mono text-xs break-all text-foreground">{ethAddress}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(ethAddress || '', 'ETH')}
                      className="gap-2 border-primary/30 hover:bg-primary/10 shadow-glow-sm"
                    >
                      {copiedToken === 'ETH' ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Solana Address */}
          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img src="/assets/generated/cksol-logo.dim_64x64.png" alt="Solana" className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <p className="font-medium">Solana (SOL)</p>
                    <p className="text-xs text-muted-foreground">Native Solana address</p>
                  </div>
                </div>
                {solLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading address...</span>
                  </div>
                ) : solError ? (
                  <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Chain-key Solana integration coming soon
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-lg border border-primary/20 bg-muted/30 backdrop-blur-sm p-3">
                      <p className="font-mono text-xs break-all text-foreground">{solAddress}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(solAddress || '', 'SOL')}
                      className="gap-2 border-primary/30 hover:bg-primary/10 shadow-glow-sm"
                    >
                      {copiedToken === 'SOL' ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 space-y-2">
        <h3 className="font-medium text-sm text-accent">How to Receive</h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li><strong>Wrapped tokens:</strong> Share your Principal with the sender for ICRC-1 transfers</li>
          <li><strong>Native coins:</strong> Share the specific blockchain address (BTC, ETH, or SOL)</li>
          <li>Funds will appear in your balance automatically</li>
          <li>Native coins are automatically converted to wrapped tokens (ckBTC, ckETH, ckSOL)</li>
        </ul>
      </div>
    </div>
  );
}
