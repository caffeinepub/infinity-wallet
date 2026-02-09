import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { truncatePrincipal } from '@/lib/utils';

export default function PrincipalDisplay() {
  const { identity } = useInternetIdentity();
  const [copied, setCopied] = useState(false);

  if (!identity) return null;

  const principal = identity.getPrincipal().toString();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(principal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-card/80 backdrop-blur-sm px-3 py-1.5 shadow-glow-sm">
      <span className="font-mono text-xs text-muted-foreground">
        {truncatePrincipal(principal, 6, 4)}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className="h-6 w-6 hover:bg-primary/10 hover:text-primary transition-all"
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </Button>
    </div>
  );
}
