import { ReactNode } from 'react';
import WalletLogo from './WalletLogo';
import AuthButton from '../auth/AuthButton';
import PrincipalDisplay from '../auth/PrincipalDisplay';
import { Button } from '@/components/ui/button';
import { Wallet, Send, Users, History, Download, FileCode } from 'lucide-react';
import { useOisyWallet } from '../../hooks/useOisyWallet';

type Page = 'dashboard' | 'send' | 'contacts' | 'history' | 'receive' | 'contracts';

interface AppLayoutProps {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function AppLayout({ children, currentPage, onNavigate }: AppLayoutProps) {
  const { isConnected } = useOisyWallet();

  return (
    <div className="min-h-screen bg-background">
      {/* Header with futuristic glass effect */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 shadow-glow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <WalletLogo />
          </div>
          <div className="flex items-center gap-3">
            {isConnected && <PrincipalDisplay />}
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Navigation with neon accents */}
      {isConnected && (
        <nav className="border-b border-border/50 bg-card/60 backdrop-blur-lg shadow-glow-sm">
          <div className="container px-4">
            <div className="flex gap-1 overflow-x-auto py-2">
              <Button
                variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('dashboard')}
                className={`gap-2 transition-all ${
                  currentPage === 'dashboard' 
                    ? 'shadow-glow' 
                    : 'hover:shadow-glow-sm hover:border-primary/30'
                }`}
              >
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
              <Button
                variant={currentPage === 'receive' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('receive')}
                className={`gap-2 transition-all ${
                  currentPage === 'receive' 
                    ? 'shadow-glow' 
                    : 'hover:shadow-glow-sm hover:border-primary/30'
                }`}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Receive</span>
              </Button>
              <Button
                variant={currentPage === 'send' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('send')}
                className={`gap-2 transition-all ${
                  currentPage === 'send' 
                    ? 'shadow-glow' 
                    : 'hover:shadow-glow-sm hover:border-primary/30'
                }`}
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Send</span>
              </Button>
              <Button
                variant={currentPage === 'contacts' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('contacts')}
                className={`gap-2 transition-all ${
                  currentPage === 'contacts' 
                    ? 'shadow-glow' 
                    : 'hover:shadow-glow-sm hover:border-primary/30'
                }`}
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Contacts</span>
              </Button>
              <Button
                variant={currentPage === 'history' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('history')}
                className={`gap-2 transition-all ${
                  currentPage === 'history' 
                    ? 'shadow-glow' 
                    : 'hover:shadow-glow-sm hover:border-primary/30'
                }`}
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
              </Button>
              <Button
                variant={currentPage === 'contracts' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('contracts')}
                className={`gap-2 transition-all ${
                  currentPage === 'contracts' 
                    ? 'shadow-glow' 
                    : 'hover:shadow-glow-sm hover:border-primary/30'
                }`}
              >
                <FileCode className="h-4 w-4" />
                <span className="hidden sm:inline">Contracts</span>
              </Button>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="container px-4 py-8">{children}</main>

      {/* Footer with subtle glow */}
      <footer className="mt-auto border-t border-border/50 bg-card/40 backdrop-blur-lg py-6 shadow-glow-sm">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          © 2026. Built with <span className="text-accent">♥</span> using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
