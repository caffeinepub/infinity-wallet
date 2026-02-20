import { ReactNode } from 'react';
import WalletLogo from './WalletLogo';
import AuthButton from '../auth/AuthButton';
import PrincipalDisplay from '../auth/PrincipalDisplay';
import { Button } from '@/components/ui/button';
import { Wallet, Send, Users, History, Download, FileCode } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

type Page = 'dashboard' | 'send' | 'contacts' | 'history' | 'receive' | 'contracts';

interface AppLayoutProps {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function AppLayout({ children, currentPage, onNavigate }: AppLayoutProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen bg-background">
      {/* Header with futuristic glass effect */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 shadow-glow-sm">
        <div className="container flex h-12 items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <WalletLogo />
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && <PrincipalDisplay />}
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Navigation with neon accents */}
      {isAuthenticated && (
        <nav className="border-b border-border/50 bg-card/60 backdrop-blur-lg shadow-glow-sm">
          <div className="container px-3">
            <div className="flex gap-1 overflow-x-auto py-1.5">
              <Button
                variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('dashboard')}
                className={`gap-1.5 text-xs transition-all ${
                  currentPage === 'dashboard' 
                    ? 'shadow-glow' 
                    : 'hover:shadow-glow-sm hover:border-primary/30'
                }`}
              >
                <Wallet className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
              <Button
                variant={currentPage === 'receive' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('receive')}
                className={`gap-1.5 text-xs transition-all ${
                  currentPage === 'receive' 
                    ? 'shadow-glow' 
                    : 'hover:shadow-glow-sm hover:border-primary/30'
                }`}
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Receive</span>
              </Button>
              <Button
                variant={currentPage === 'send' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('send')}
                className={`gap-1.5 text-xs transition-all ${
                  currentPage === 'send' 
                    ? 'shadow-glow' 
                    : 'hover:shadow-glow-sm hover:border-primary/30'
                }`}
              >
                <Send className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Send</span>
              </Button>
              <Button
                variant={currentPage === 'contacts' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('contacts')}
                className={`gap-1.5 text-xs transition-all ${
                  currentPage === 'contacts' 
                    ? 'shadow-glow' 
                    : 'hover:shadow-glow-sm hover:border-primary/30'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Contacts</span>
              </Button>
              <Button
                variant={currentPage === 'history' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('history')}
                className={`gap-1.5 text-xs transition-all ${
                  currentPage === 'history' 
                    ? 'shadow-glow' 
                    : 'hover:shadow-glow-sm hover:border-primary/30'
                }`}
              >
                <History className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">History</span>
              </Button>
              <Button
                variant={currentPage === 'contracts' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('contracts')}
                className={`gap-1.5 text-xs transition-all ${
                  currentPage === 'contracts' 
                    ? 'shadow-glow' 
                    : 'hover:shadow-glow-sm hover:border-primary/30'
                }`}
              >
                <FileCode className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Contracts</span>
              </Button>
            </div>
          </div>
        </nav>
      )}

      {/* Main content */}
      <main className="container px-3 py-5">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-auto">
        <div className="container px-3 py-4">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
