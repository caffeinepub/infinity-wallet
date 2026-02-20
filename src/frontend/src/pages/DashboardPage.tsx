import { useInfinityCoinBalance } from '../hooks/useInfinityCoinBalance';
import { useIcpBalance } from '../hooks/useIcpBalance';
import { useCkBtcBalance } from '../hooks/useCkBtcBalance';
import { useCkEthBalance } from '../hooks/useCkEthBalance';
import { useCkSolBalance } from '../hooks/useCkSolBalance';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { Button } from '@/components/ui/button';
import { Download, History } from 'lucide-react';
import { TOKEN_INFINITY, TOKEN_ICP, TOKEN_CKBTC, TOKEN_CKETH, TOKEN_CKSOL } from '@/lib/branding';
import TotalAssetsDisplay from '../components/wallet/TotalAssetsDisplay';
import BalanceCard from '../components/wallet/BalanceCard';
import { BitcoinDepositStatus } from '../components/wallet/BitcoinDepositStatus';

type Page = 'dashboard' | 'send' | 'contacts' | 'history' | 'receive' | 'contracts';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const infinityCoin = useInfinityCoinBalance();
  const icp = useIcpBalance();
  const ckBtc = useCkBtcBalance();
  const ckEth = useCkEthBalance();
  const ckSol = useCkSolBalance();
  const { data: exchangeRates, isLoading: ratesLoading } = useExchangeRates();

  const isAnyLoading = infinityCoin.isLoading || icp.isLoading || ckBtc.isLoading || ckEth.isLoading || ckSol.isLoading;
  const hasAnyError = !!infinityCoin.error || !!icp.error || !!ckBtc.error || !!ckEth.error || !!ckSol.error;

  // Calculate USD values for each token
  const calculateUsdValue = (balanceE8s: bigint, rate?: number): number | undefined => {
    if (rate === undefined || ratesLoading) return undefined;
    return (Number(balanceE8s) / 100_000_000) * rate;
  };

  const infinityCoinUsd = calculateUsdValue(infinityCoin.balance, exchangeRates?.['Infinity Coin']);
  const icpUsd = calculateUsdValue(icp.balance, exchangeRates?.ICP);
  const ckBtcUsd = calculateUsdValue(ckBtc.balance, exchangeRates?.ckBTC);
  const ckEthUsd = calculateUsdValue(ckEth.balance, exchangeRates?.ckETH);
  const ckSolUsd = calculateUsdValue(ckSol.balance, exchangeRates?.ckSOL);

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-xs text-muted-foreground">View your wallet balances</p>
        </div>
      </div>

      {/* Total Assets Display */}
      <TotalAssetsDisplay
        infinityCoinBalance={infinityCoin.balance}
        icpBalance={icp.balance}
        ckBtcBalance={ckBtc.balance}
        ckEthBalance={ckEth.balance}
        ckSolBalance={ckSol.balance}
        isLoading={isAnyLoading}
        hasError={hasAnyError}
      />

      {/* Bitcoin Deposit Status */}
      <BitcoinDepositStatus />

      {/* Individual Token Balances */}
      <div>
        <h2 className="text-base font-semibold mb-3 text-foreground">Token Balances</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <BalanceCard
            tokenName={TOKEN_INFINITY}
            tokenIcon="/assets/generated/infinity-coin-icon.dim_512x512.png"
            balance={infinityCoin.balance}
            isLoading={infinityCoin.isLoading}
            error={infinityCoin.error as Error | null}
            onRefresh={() => infinityCoin.refetch()}
            isRefetching={infinityCoin.isRefetching}
            usdValue={infinityCoinUsd}
          />
          <BalanceCard
            tokenName={TOKEN_ICP}
            tokenIcon="/assets/generated/icp-logo.dim_64x64.png"
            balance={icp.balance}
            isLoading={icp.isLoading}
            error={icp.error as Error | null}
            onRefresh={() => icp.refetch()}
            isRefetching={icp.isRefetching}
            usdValue={icpUsd}
          />
          <BalanceCard
            tokenName={TOKEN_CKBTC}
            tokenIcon="/assets/generated/ckbtc-logo.dim_64x64.png"
            balance={ckBtc.balance}
            isLoading={ckBtc.isLoading}
            error={ckBtc.error as Error | null}
            onRefresh={() => ckBtc.refetch()}
            isRefetching={ckBtc.isRefetching}
            usdValue={ckBtcUsd}
          />
          <BalanceCard
            tokenName={TOKEN_CKETH}
            tokenIcon="/assets/generated/cketh-logo.dim_64x64.png"
            balance={ckEth.balance}
            isLoading={ckEth.isLoading}
            error={ckEth.error as Error | null}
            onRefresh={() => ckEth.refetch()}
            isRefetching={ckEth.isRefetching}
            usdValue={ckEthUsd}
          />
          <BalanceCard
            tokenName={TOKEN_CKSOL}
            tokenIcon="/assets/generated/cksol-logo.dim_64x64.png"
            balance={ckSol.balance}
            isLoading={ckSol.isLoading}
            error={ckSol.error as Error | null}
            onRefresh={() => ckSol.refetch()}
            isRefetching={ckSol.isRefetching}
            usdValue={ckSolUsd}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 justify-center pt-3">
        <Button
          onClick={() => onNavigate('receive')}
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs border-primary/30 hover:shadow-glow-sm transition-all"
        >
          <Download className="h-3.5 w-3.5" />
          Receive
        </Button>
        <Button
          onClick={() => onNavigate('history')}
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs border-primary/30 hover:shadow-glow-sm transition-all"
        >
          <History className="h-3.5 w-3.5" />
          View History
        </Button>
      </div>
    </div>
  );
}
