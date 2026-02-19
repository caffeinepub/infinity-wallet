import { useInfinityCoinBalance } from '../hooks/useInfinityCoinBalance';
import { useIcpBalance } from '../hooks/useIcpBalance';
import { useCkBtcBalance } from '../hooks/useCkBtcBalance';
import { useCkEthBalance } from '../hooks/useCkEthBalance';
import { useCkSolBalance } from '../hooks/useCkSolBalance';
import { Button } from '@/components/ui/button';
import { Download, History } from 'lucide-react';
import { TOKEN_INFINITY, TOKEN_ICP, TOKEN_CKBTC, TOKEN_CKETH, TOKEN_CKSOL } from '@/lib/branding';
import TotalAssetsDisplay from '../components/wallet/TotalAssetsDisplay';
import BalanceCard from '../components/wallet/BalanceCard';

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

  const isAnyLoading = infinityCoin.isLoading || icp.isLoading || ckBtc.isLoading || ckEth.isLoading || ckSol.isLoading;
  const hasAnyError = !!infinityCoin.error || !!icp.error || !!ckBtc.error || !!ckEth.error || !!ckSol.error;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">View your wallet balances</p>
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

      {/* Individual Token Balances */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Token Balances</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <BalanceCard
            tokenName={TOKEN_INFINITY}
            tokenIcon="/assets/generated/infinity-coin-icon.dim_512x512.png"
            balance={infinityCoin.balance}
            isLoading={infinityCoin.isLoading}
            error={infinityCoin.error as Error | null}
            onRefresh={() => infinityCoin.refetch()}
            isRefetching={infinityCoin.isRefetching}
          />
          <BalanceCard
            tokenName={TOKEN_ICP}
            tokenIcon="/assets/generated/icp-logo.dim_64x64.png"
            balance={icp.balance}
            isLoading={icp.isLoading}
            error={icp.error as Error | null}
            onRefresh={() => icp.refetch()}
            isRefetching={icp.isRefetching}
          />
          <BalanceCard
            tokenName={TOKEN_CKBTC}
            tokenIcon="/assets/generated/ckbtc-logo.dim_64x64.png"
            balance={ckBtc.balance}
            isLoading={ckBtc.isLoading}
            error={ckBtc.error as Error | null}
            onRefresh={() => ckBtc.refetch()}
            isRefetching={ckBtc.isRefetching}
          />
          <BalanceCard
            tokenName={TOKEN_CKETH}
            tokenIcon="/assets/generated/cketh-logo.dim_64x64.png"
            balance={ckEth.balance}
            isLoading={ckEth.isLoading}
            error={ckEth.error as Error | null}
            onRefresh={() => ckEth.refetch()}
            isRefetching={ckEth.isRefetching}
          />
          <BalanceCard
            tokenName={TOKEN_CKSOL}
            tokenIcon="/assets/generated/cksol-logo.dim_64x64.png"
            balance={ckSol.balance}
            isLoading={ckSol.isLoading}
            error={ckSol.error as Error | null}
            onRefresh={() => ckSol.refetch()}
            isRefetching={ckSol.isRefetching}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 justify-center pt-4">
        <Button
          onClick={() => onNavigate('receive')}
          variant="outline"
          className="gap-2 border-primary/30 hover:shadow-glow-sm transition-all"
        >
          <Download className="h-4 w-4" />
          Receive
        </Button>
        <Button
          onClick={() => onNavigate('history')}
          variant="outline"
          className="gap-2 border-primary/30 hover:shadow-glow-sm transition-all"
        >
          <History className="h-4 w-4" />
          View History
        </Button>
      </div>
    </div>
  );
}
