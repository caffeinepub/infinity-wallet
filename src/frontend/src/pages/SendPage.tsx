import { useState } from 'react';
import { useRecordTransaction, useGetBalances } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { validateRecipient, validateAmount, parseAmountToE8, formatBalance } from '@/lib/validation';
import { TOKEN_INFINITY } from '@/lib/branding';
import { CoinType } from '../backend';
import RecipientPicker from '../components/wallet/RecipientPicker';

type SendStep = 'form' | 'confirm' | 'success';

export default function SendPage() {
  const [step, setStep] = useState<SendStep>('form');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{ recipient?: string; amount?: string }>({});
  const [txId, setTxId] = useState<string>('');

  const recordTransaction = useRecordTransaction();
  const { data: balances } = useGetBalances();

  const currentBalance = balances ? balances[1] : BigInt(0);

  const handleValidate = () => {
    const recipientValidation = validateRecipient(recipient);
    const amountValidation = validateAmount(amount);

    const newErrors: { recipient?: string; amount?: string } = {};
    if (!recipientValidation.valid) newErrors.recipient = recipientValidation.error;
    if (!amountValidation.valid) newErrors.amount = amountValidation.error;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (handleValidate()) {
      setStep('confirm');
    }
  };

  const handleSend = async () => {
    const amountE8 = parseAmountToE8(amount);

    try {
      await recordTransaction.mutateAsync({
        recipient,
        amountE8,
        coinType: CoinType.infinityCoin,
      });
      setTxId(`TX-${Date.now()}`);
      setStep('success');
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  const handleReset = () => {
    setStep('form');
    setRecipient('');
    setAmount('');
    setErrors({});
    setTxId('');
  };

  if (step === 'success') {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Card className="border-primary/30 bg-card/80 backdrop-blur-sm shadow-glow">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 shadow-glow animate-glow-pulse">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Transaction Recorded
            </CardTitle>
            <CardDescription>Your transaction has been successfully recorded</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-primary/20 bg-muted/30 backdrop-blur-sm p-4 space-y-2 shadow-glow-sm">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Asset:</span>
                <span className="font-medium text-primary">{TOKEN_INFINITY}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium text-primary">{amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Recipient:</span>
                <span className="font-mono text-xs">{recipient.slice(0, 20)}...</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-mono text-xs text-accent">{txId}</span>
              </div>
            </div>
            <Button onClick={handleReset} className="w-full shadow-glow hover:shadow-glow-lg transition-all">
              Send Another Transaction
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Confirm Transaction
          </h1>
          <p className="text-muted-foreground">Review the details before sending</p>
        </div>

        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow">
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Asset:</span>
                <span className="font-medium text-primary">{TOKEN_INFINITY}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Recipient:</span>
                <span className="font-mono text-xs break-all">{recipient}</span>
              </div>
            </div>

            <Alert className="border-accent/30 bg-accent/5 shadow-glow-sm">
              <AlertCircle className="h-4 w-4 text-accent" />
              <AlertDescription className="text-xs">
                Note: This is a demo wallet. Transactions are recorded locally and do not represent actual
                blockchain transfers.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setStep('form')} 
                className="flex-1 border-primary/30 hover:shadow-glow-sm transition-all"
              >
                Back
              </Button>
              <Button 
                onClick={handleSend} 
                disabled={recordTransaction.isPending} 
                className="flex-1 shadow-glow hover:shadow-glow-lg transition-all"
              >
                {recordTransaction.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Confirm Send
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Send
        </h1>
        <p className="text-muted-foreground">Transfer Infinity Coin</p>
      </div>

      <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow-sm hover:shadow-glow transition-all">
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>Enter the recipient and amount</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Asset</Label>
            <div className="rounded-lg border border-primary/20 bg-muted/30 px-3 py-2">
              <span className="font-medium text-primary">{TOKEN_INFINITY}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Available: <span className="text-primary font-medium">{formatBalance(currentBalance)}</span> {TOKEN_INFINITY}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <div className="flex gap-2">
              <Input
                id="recipient"
                placeholder="Enter principal address"
                value={recipient}
                onChange={(e) => {
                  setRecipient(e.target.value);
                  if (errors.recipient) setErrors({ ...errors, recipient: undefined });
                }}
                className={`border-primary/20 ${errors.recipient ? 'border-destructive' : ''}`}
              />
              <RecipientPicker onSelect={setRecipient} />
            </div>
            {errors.recipient && <p className="text-xs text-destructive">{errors.recipient}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.00000001"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors({ ...errors, amount: undefined });
              }}
              className={`border-primary/20 ${errors.amount ? 'border-destructive' : ''}`}
            />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
          </div>

          <Button onClick={handleContinue} className="w-full shadow-glow hover:shadow-glow-lg transition-all">
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
