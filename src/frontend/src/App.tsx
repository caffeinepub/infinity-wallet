import { OisyWalletProvider, useOisyWallet } from './hooks/useOisyWallet';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import SendPage from './pages/SendPage';
import ContactsPage from './pages/ContactsPage';
import HistoryPage from './pages/HistoryPage';
import ReceivePage from './pages/ReceivePage';
import ContractsPage from './pages/ContractsPage';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import { AppErrorBoundary } from './components/errors/AppErrorBoundary';
import { Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

type Page = 'dashboard' | 'send' | 'contacts' | 'history' | 'receive' | 'contracts';

function AppContent() {
  const { identity, isConnecting, isConnected, isUnavailable, error, connect } = useOisyWallet();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const isAuthenticated = isConnected && !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isConnecting) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Connecting to Oisy Wallet...</p>
        </div>
      </div>
    );
  }

  if (isUnavailable) {
    return (
      <AppLayout currentPage={currentPage} onNavigate={setCurrentPage}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="mx-auto max-w-md space-y-6">
            <Alert variant="destructive" className="border-destructive/50 shadow-glow-sm">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="text-lg font-semibold">Oisy Wallet Required</AlertTitle>
              <AlertDescription className="mt-2 space-y-3">
                <p>
                  Infinity Wallet requires Oisy Wallet to function. Please ensure Oisy Wallet is installed and
                  enabled in your browser.
                </p>
                {error && (
                  <p className="text-xs font-mono bg-destructive/10 p-2 rounded border border-destructive/20">
                    Error: {error}
                  </p>
                )}
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    onClick={() => window.open('https://oisy.com', '_blank')}
                    variant="outline"
                    className="w-full"
                  >
                    Visit Oisy Wallet
                  </Button>
                  <Button onClick={connect} className="w-full">
                    Try Again
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <AppLayout currentPage={currentPage} onNavigate={setCurrentPage}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="mx-auto max-w-md space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome to Infinity Wallet
              </h1>
              <p className="text-muted-foreground">
                Connect your Oisy Wallet to access your Infinity Coin wallet.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Please connect using the button in the header to continue.
              </p>
              <Button onClick={connect} className="w-full shadow-glow hover:shadow-glow-lg transition-all">
                Connect Oisy Wallet
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppErrorBoundary>
      <AppLayout currentPage={currentPage} onNavigate={setCurrentPage}>
        {currentPage === 'dashboard' && <DashboardPage onNavigate={setCurrentPage} />}
        {currentPage === 'send' && <SendPage />}
        {currentPage === 'contacts' && <ContactsPage />}
        {currentPage === 'history' && <HistoryPage />}
        {currentPage === 'receive' && <ReceivePage />}
        {currentPage === 'contracts' && <ContractsPage />}
        {showProfileSetup && <ProfileSetupDialog />}
      </AppLayout>
    </AppErrorBoundary>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <OisyWalletProvider>
        <AppContent />
        <Toaster />
      </OisyWalletProvider>
    </ThemeProvider>
  );
}
