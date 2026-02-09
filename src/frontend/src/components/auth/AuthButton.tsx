import { useOisyWallet } from '../../hooks/useOisyWallet';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Loader2 } from 'lucide-react';

export default function AuthButton() {
  const { connect, disconnect, isConnecting, isConnected } = useOisyWallet();
  const queryClient = useQueryClient();

  const handleAuth = async () => {
    if (isConnected) {
      await disconnect();
      queryClient.clear();
    } else {
      await connect();
    }
  };

  return (
    <Button
      onClick={handleAuth}
      disabled={isConnecting}
      variant={isConnected ? 'outline' : 'default'}
      size="sm"
      className="gap-2"
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : isConnected ? (
        <>
          <LogOut className="h-4 w-4" />
          Disconnect Oisy
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4" />
          Connect Oisy Wallet
        </>
      )}
    </Button>
  );
}
