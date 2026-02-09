import { APP_NAME } from '@/lib/branding';

export default function WalletLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <img
          src="/assets/generated/infinity-wallet-logo.dim_1024x1024.png"
          alt={APP_NAME}
          className="h-10 w-10 rounded-lg shadow-glow"
        />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 mix-blend-overlay pointer-events-none" />
      </div>
      <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
        {APP_NAME}
      </span>
    </div>
  );
}
