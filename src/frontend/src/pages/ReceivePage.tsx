import { useState } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Check, RefreshCw, AlertCircle } from 'lucide-react';
import PrincipalDisplay from '@/components/auth/PrincipalDisplay';
import { useCkBtcDepositAddress } from '@/hooks/useCkBtcDepositAddress';

export default function ReceivePage() {
  const { identity } = useInternetIdentity();
  const [copiedPrincipal, setCopiedPrincipal] = useState(false);
  const [copiedBtc, setCopiedBtc] = useState(false);

  const {
    data: btcAddress,
    isLoading: btcLoading,
    error: btcError,
    refetch: refetchBtcAddress,
  } = useCkBtcDepositAddress();

  const handleCopyPrincipal = async () => {
    if (!identity) return;
    await navigator.clipboard.writeText(identity.getPrincipal().toString());
    setCopiedPrincipal(true);
    setTimeout(() => setCopiedPrincipal(false), 2000);
  };

  const handleCopyBtc = async () => {
    if (!btcAddress) return;
    await navigator.clipboard.writeText(btcAddress);
    setCopiedBtc(true);
    setTimeout(() => setCopiedBtc(false), 2000);
  };

  const isMainnetError = btcError?.message?.includes('only available on mainnet');

  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Receive Tokens</h1>
        <p className="text-muted-foreground">
          Get your wallet addresses to receive tokens
        </p>
      </div>

      {/* Wrapped Tokens (ICRC-1) */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-primary">Wrapped Tokens</span>
          </CardTitle>
          <CardDescription>
            Use this Principal address to receive ICP, ckBTC, ckETH, ckSOL, and Infinity Coin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Principal Address</label>
            <div className="flex gap-2">
              <div className="flex-1 rounded-lg border border-border bg-muted/50 p-3 font-mono text-sm">
                {identity ? (
                  identity.getPrincipal().toString()
                ) : (
                  <span className="text-muted-foreground">Not logged in</span>
                )}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyPrincipal}
                disabled={!identity}
                className="shrink-0"
              >
                {copiedPrincipal ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Alert className="border-primary/30 bg-primary/5">
            <AlertDescription className="text-sm">
              This address works for all ICRC-1 tokens on the Internet Computer. Send ICP, ckBTC,
              ckETH, ckSOL, or Infinity Coin to this address.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Native Bitcoin Deposits */}
      <Card className="border-orange-500/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-orange-500">Native Bitcoin Deposits</span>
          </CardTitle>
          <CardDescription>
            Send native Bitcoin to this address to receive ckBTC tokens
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bitcoin */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/ckbtc-logo.dim_64x64.png"
                alt="Bitcoin"
                className="h-8 w-8"
              />
              <div>
                <h3 className="font-semibold">Bitcoin (BTC)</h3>
                <p className="text-sm text-muted-foreground">
                  Deposit native Bitcoin → Receive ckBTC
                </p>
              </div>
            </div>

            {isMainnetError ? (
              <Alert className="border-orange-500/30 bg-orange-500/5">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <AlertDescription className="text-sm">
                  <strong>Mainnet Only:</strong> Native Bitcoin deposits are only available on the
                  Internet Computer mainnet. This feature requires the ckBTC minter canister which
                  is not available in local development.
                </AlertDescription>
              </Alert>
            ) : btcError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Failed to generate Bitcoin address. Please try again.
                </AlertDescription>
              </Alert>
            ) : btcLoading ? (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Generating Bitcoin address...</span>
              </div>
            ) : btcAddress ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">Bitcoin Deposit Address</label>
                <div className="flex gap-2">
                  <div className="flex-1 rounded-lg border border-orange-500/30 bg-orange-500/5 p-3 font-mono text-sm">
                    {btcAddress}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyBtc}
                    className="shrink-0 border-orange-500/30 hover:bg-orange-500/10"
                  >
                    {copiedBtc ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Alert className="border-orange-500/30 bg-orange-500/5">
                  <AlertDescription className="text-sm">
                    Send Bitcoin to this address. After 6 confirmations (~1 hour), your ckBTC will
                    be minted automatically.
                  </AlertDescription>
                </Alert>
              </div>
            ) : null}

            {(btcError && !isMainnetError) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchBtcAddress()}
                className="w-full border-orange-500/30 hover:bg-orange-500/10"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            )}
          </div>

          {/* Ethereum - Coming Soon */}
          <div className="space-y-3 opacity-60">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/cketh-logo.dim_64x64.png"
                alt="Ethereum"
                className="h-8 w-8"
              />
              <div>
                <h3 className="font-semibold">Ethereum (ETH)</h3>
                <p className="text-sm text-muted-foreground">
                  Native Ethereum deposits coming soon
                </p>
              </div>
            </div>
            <Alert className="border-blue-500/30 bg-blue-500/5">
              <AlertDescription className="text-sm">
                Chain-key Ethereum integration coming soon
              </AlertDescription>
            </Alert>
          </div>

          {/* Solana - Coming Soon */}
          <div className="space-y-3 opacity-60">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/cksol-logo.dim_64x64.png"
                alt="Solana"
                className="h-8 w-8"
              />
              <div>
                <h3 className="font-semibold">Solana (SOL)</h3>
                <p className="text-sm text-muted-foreground">
                  Native Solana deposits coming soon
                </p>
              </div>
            </div>
            <Alert className="border-purple-500/30 bg-purple-500/5">
              <AlertDescription className="text-sm">
                Chain-key Solana integration coming soon
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
