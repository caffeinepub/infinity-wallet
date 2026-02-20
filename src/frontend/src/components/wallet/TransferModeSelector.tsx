import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Zap, Bitcoin } from 'lucide-react';

interface TransferModeSelectorProps {
  mode: 'wrapped' | 'native';
  onChange: (mode: 'wrapped' | 'native') => void;
  tokenName: string;
}

export default function TransferModeSelector({ mode, onChange, tokenName }: TransferModeSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>Transfer Mode</Label>
      <RadioGroup value={mode} onValueChange={(value) => onChange(value as 'wrapped' | 'native')}>
        <div className="flex items-center space-x-2 rounded-lg border border-primary/20 bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
          <RadioGroupItem value="wrapped" id="wrapped" />
          <Label htmlFor="wrapped" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium">Transfer {tokenName} (ICRC-1)</p>
                <p className="text-xs text-muted-foreground">Fast (~1 second), nearly free</p>
              </div>
            </div>
          </Label>
        </div>

        <div className="flex items-center space-x-2 rounded-lg border border-primary/20 bg-muted/30 p-3 hover:bg-muted/50 transition-colors">
          <RadioGroupItem value="native" id="native" />
          <Label htmlFor="native" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <Bitcoin className="h-4 w-4 text-accent" />
              <div>
                <p className="font-medium">Withdraw to Bitcoin</p>
                <p className="text-xs text-muted-foreground">Native BTC (~40+ minutes, network fees apply)</p>
              </div>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
