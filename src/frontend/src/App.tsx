import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import SendPage from './pages/SendPage';
import ContactsPage from './pages/ContactsPage';
import HistoryPage from './pages/HistoryPage';
import ReceivePage from './pages/ReceivePage';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

type Page = 'dashboard' | 'send' | 'contacts' | 'history' | 'receive';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Initializing Infinity Wallet...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AppLayout currentPage={currentPage} onNavigate={setCurrentPage}>
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="mx-auto max-w-md space-y-6 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Welcome to Infinity Wallet</h1>
                <p className="text-muted-foreground">
                  Sign in with Internet Identity to access your ICP and Infinity Coin wallet.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <p className="text-sm text-muted-foreground">
                  Please sign in using the button in the header to continue.
                </p>
              </div>
            </div>
          </div>
        </AppLayout>
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppLayout currentPage={currentPage} onNavigate={setCurrentPage}>
        {currentPage === 'dashboard' && <DashboardPage onNavigate={setCurrentPage} />}
        {currentPage === 'send' && <SendPage />}
        {currentPage === 'contacts' && <ContactsPage />}
        {currentPage === 'history' && <HistoryPage />}
        {currentPage === 'receive' && <ReceivePage />}
      </AppLayout>
      {showProfileSetup && <ProfileSetupDialog />}
      <Toaster />
    </ThemeProvider>
  );
}
