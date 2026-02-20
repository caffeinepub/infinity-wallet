import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { truncatePrincipal } from '@/lib/utils';

interface PrincipalDisplayProps {
  truncate?: boolean;
  showCopy?: boolean;
}

export default function PrincipalDisplay({ truncate = true, showCopy = true }: PrincipalDisplayProps) {
  const { identity } = useInternetIdentity();
  const [copied, setCopied] = useState(false);

  if (!identity) return null;

  const principal = identity.getPrincipal().toString();
  const displayText = truncate ? truncatePrincipal(principal, 6, 4) : principal;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(principal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1.5 rounded-md border border-primary/30 bg-card/80 backdrop-blur-sm px-2 py-1 shadow-glow-sm">
      <span className="font-mono text-xs text-muted-foreground">
        {displayText}
      </span>
      {showCopy && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="h-5 w-5 hover:bg-primary/10 hover:text-primary transition-all"
        >
          {copied ? <Check className="h-2.5 w-2.5" /> : <Copy className="h-2.5 w-2.5" />}
        </Button>
      )}
    </div>
  );
}
