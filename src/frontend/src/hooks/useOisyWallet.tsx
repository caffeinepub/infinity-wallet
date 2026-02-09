import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Identity } from '@dfinity/agent';
import { AnonymousIdentity } from '@dfinity/agent';

interface OisyWalletContextType {
  identity: Identity | null;
  isConnecting: boolean;
  isConnected: boolean;
  isUnavailable: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const OisyWalletContext = createContext<OisyWalletContextType | undefined>(undefined);

interface OisyWalletProviderProps {
  children: ReactNode;
}

// Simple mock implementation for Oisy Wallet
// In production, this would integrate with the actual Oisy Wallet browser extension
class MockOisyIdentity implements Identity {
  private principal: any;

  constructor() {
    // Import Principal dynamically to avoid issues
    import('@dfinity/principal').then(({ Principal }) => {
      // Generate a random principal for demo purposes
      const randomBytes = new Uint8Array(29);
      crypto.getRandomValues(randomBytes);
      this.principal = Principal.fromUint8Array(randomBytes);
    });
  }

  getPrincipal() {
    if (!this.principal) {
      // Fallback to anonymous if not yet initialized
      return new AnonymousIdentity().getPrincipal();
    }
    return this.principal;
  }

  async transformRequest(request: any) {
    // In a real implementation, this would sign the request with Oisy
    return request;
  }
}

export function OisyWalletProvider({ children }: OisyWalletProviderProps) {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if running in a browser environment that could support Oisy
      if (typeof window === 'undefined') {
        throw new Error('Oisy Wallet requires a browser environment');
      }

      // For now, create a mock identity
      // In production, this would open the Oisy Wallet popup and get the real identity
      const oisyIdentity = new MockOisyIdentity();
      
      setIdentity(oisyIdentity);
      setIsConnected(true);
      
      // Store connection state
      localStorage.setItem('oisy_connected', 'true');
      
      console.log('Connected to Oisy Wallet (mock implementation)');
    } catch (err: any) {
      console.error('Failed to connect to Oisy Wallet:', err);
      setError(err.message || 'Failed to connect to Oisy Wallet');
      setIsUnavailable(true);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      setIdentity(null);
      setIsConnected(false);
      localStorage.removeItem('oisy_connected');
      console.log('Disconnected from Oisy Wallet');
    } catch (err: any) {
      console.error('Failed to disconnect from Oisy Wallet:', err);
      setError(err.message || 'Failed to disconnect');
    }
  };

  // Try to restore connection on mount
  useEffect(() => {
    const wasConnected = localStorage.getItem('oisy_connected') === 'true';
    if (wasConnected && !isConnected && !isConnecting) {
      // Auto-reconnect
      connect();
    }
  }, []);

  return (
    <OisyWalletContext.Provider
      value={{
        identity,
        isConnecting,
        isConnected,
        isUnavailable,
        error,
        connect,
        disconnect,
      }}
    >
      {children}
    </OisyWalletContext.Provider>
  );
}

export function useOisyWallet() {
  const context = useContext(OisyWalletContext);
  if (context === undefined) {
    throw new Error('useOisyWallet must be used within an OisyWalletProvider');
  }
  return context;
}
