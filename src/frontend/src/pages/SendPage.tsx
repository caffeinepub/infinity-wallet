import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRecordTransaction } from '../hooks/useQueries';
import { useInfinityCoinBalance } from '../hooks/useInfinityCoinBalance';
import { useInfinityLedger } from '../hooks/useInfinityLedger';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
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
import { Principal } from '@dfinity/principal';
import { formatTransferError, type ICRC1Account } from '@/lib/infinityLedger';
import { toast } from 'sonner';

type SendStep = 'form' | 'confirm' | 'success';

export default function SendPage() {
  const [step, setStep] = useState<SendStep>('form');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{ recipient?: string; amount?: string }>({});
  const [blockIndex, setBlockIndex] = useState<bigint | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const recordTransaction = useRecordTransaction();
  const { balance } = useInfinityCoinBalance();
  const { ledgerClient } = useInfinityLedger();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

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
      setSendError(null);
    }
  };

  const handleSend = async () => {
    if (!ledgerClient || !identity) {
      setSendError('Not authenticated. Please sign in.');
      return;
    }

    const amountE8 = parseAmountToE8(amount);
    setIsSending(true);
    setSendError(null);

    try {
      // Parse recipient - support both Principal and Account ID formats
      let recipientAccount: ICRC1Account;
      
      try {
        // Try parsing as Principal first
        const recipientPrincipal = Principal.fromText(recipient);
        recipientAccount = {
          owner: recipientPrincipal,
          subaccount: [], // Default subaccount
        };
      } catch {
        // If not a valid Principal, assume it's an Account ID
        // For ICRC-1, we need a Principal, so this will fail
        setSendError('Recipient must be a valid Principal for Infinity Coin transfers');
        setIsSending(false);
        return;
      }

      // Execute the transfer on the ledger
      const transferResult = await ledgerClient.icrc1_transfer({
        to: recipientAccount,
        amount: amountE8,
        fee: undefined, // Use default fee
        memo: undefined,
        created_at_time: BigInt(Date.now()) * BigInt(1_000_000), // Current time in nanoseconds
      });

      if ('Ok' in transferResult) {
        // Transfer succeeded
        const txBlockIndex = transferResult.Ok;
        setBlockIndex(txBlockIndex);

        // Invalidate balance query to refresh
        queryClient.invalidateQueries({ queryKey: ['infinityCoinBalance'] });

        // Record transaction in local history (non-blocking)
        try {
          await recordTransaction.mutateAsync({
            recipient,
            amountE8,
            coinType: CoinType.infinityCoin,
          });
        } catch (historyError) {
          console.error('Failed to record transaction history:', historyError);
          toast.warning('Transaction succeeded but history recording failed');
        }

        setStep('success');
      } else {
        // Transfer failed
        const errorMessage = formatTransferError(transferResult.Err);
        setSendError(errorMessage);
      }
    } catch (error) {
      console.error('Transfer failed:', error);
      setSendError(error instanceof Error ? error.message : 'Transfer failed. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setStep('form');
    setRecipient('');
    setAmount('');
    setErrors({});
    setBlockIndex(null);
    setSendError(null);
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
              Transfer Successful
            </CardTitle>
            <CardDescription>Your Infinity Coin has been sent on the ledger</CardDescription>
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
                <span className="text-muted-foreground">Block Index:</span>
                <span className="font-mono text-xs text-accent">{blockIndex?.toString() ?? 'N/A'}</span>
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
                <span className="font-medium text-primary">{amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Recipient:</span>
                <span className="font-mono text-xs break-all">{recipient}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Your Balance:</span>
                <span className="font-medium">{formatBalance(balance)} {TOKEN_INFINITY}</span>
              </div>
            </div>

            {sendError && (
              <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{sendError}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep('form')}
                disabled={isSending}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleSend}
                disabled={isSending}
                className="flex-1 shadow-glow hover:shadow-glow-lg transition-all"
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Confirm & Send
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
          Send {TOKEN_INFINITY}
        </h1>
        <p className="text-muted-foreground">Transfer Infinity Coin to another wallet</p>
      </div>

      <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow">
        <CardHeader>
          <CardTitle>Transfer Details</CardTitle>
          <CardDescription>
            Your balance: {formatBalance(balance)} {TOKEN_INFINITY}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Principal</Label>
            <div className="flex gap-2">
              <Input
                id="recipient"
                placeholder="Enter recipient Principal"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className={errors.recipient ? 'border-destructive' : ''}
              />
              <RecipientPicker onSelect={setRecipient} />
            </div>
            {errors.recipient && (
              <p className="text-sm text-destructive">{errors.recipient}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.00000001"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={errors.amount ? 'border-destructive' : ''}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount}</p>
            )}
          </div>

          <Button
            onClick={handleContinue}
            className="w-full shadow-glow hover:shadow-glow-lg transition-all"
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
