import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRecordTransaction, useSendNativeBtc, useSendNativeEth, useSendNativeSol } from '../hooks/useQueries';
import { useInfinityCoinBalance } from '../hooks/useInfinityCoinBalance';
import { useIcpBalance } from '../hooks/useIcpBalance';
import { useCkBtcBalance } from '../hooks/useCkBtcBalance';
import { useCkEthBalance } from '../hooks/useCkEthBalance';
import { useCkSolBalance } from '../hooks/useCkSolBalance';
import { useInfinityLedger } from '../hooks/useInfinityLedger';
import { useIcpLedger } from '../hooks/useIcpLedger';
import { useCkBtcLedger } from '../hooks/useCkBtcLedger';
import { useCkEthLedger } from '../hooks/useCkEthLedger';
import { useCkSolLedger } from '../hooks/useCkSolLedger';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { validateRecipient, validateBtcAddress, validateEthAddress, validateSolAddress, validateAmount, parseAmountToE8, formatBalance } from '@/lib/validation';
import { TOKEN_INFINITY, TOKEN_ICP, TOKEN_CKBTC, TOKEN_CKETH, TOKEN_CKSOL } from '@/lib/branding';
import { CoinType } from '../backend';
import RecipientPicker from '../components/wallet/RecipientPicker';
import { Principal } from '@dfinity/principal';
import { formatTransferError as formatInfinityError, type ICRC1Account } from '@/lib/infinityLedger';
import { formatTransferError as formatIcpError } from '@/lib/icpLedger';
import { formatTransferError as formatCkBtcError } from '@/lib/ckBtcLedger';
import { formatTransferError as formatCkEthError } from '@/lib/ckEthLedger';
import { formatTransferError as formatCkSolError } from '@/lib/ckSolLedger';
import { toast } from 'sonner';

type SendStep = 'form' | 'confirm' | 'success';
type TokenType = 'infinityCoin' | 'icp' | 'ckBtc' | 'ckEth' | 'ckSol';
type TransferMode = 'wrapped' | 'native';

export default function SendPage() {
  const [step, setStep] = useState<SendStep>('form');
  const [selectedToken, setSelectedToken] = useState<TokenType>('infinityCoin');
  const [transferMode, setTransferMode] = useState<TransferMode>('wrapped');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{ recipient?: string; amount?: string }>({});
  const [blockIndex, setBlockIndex] = useState<bigint | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const recordTransaction = useRecordTransaction();
  const sendNativeBtc = useSendNativeBtc();
  const sendNativeEth = useSendNativeEth();
  const sendNativeSol = useSendNativeSol();

  const infinityCoin = useInfinityCoinBalance();
  const icp = useIcpBalance();
  const ckBtc = useCkBtcBalance();
  const ckEth = useCkEthBalance();
  const ckSol = useCkSolBalance();
  
  const infinityLedger = useInfinityLedger();
  const icpLedger = useIcpLedger();
  const ckBtcLedger = useCkBtcLedger();
  const ckEthLedger = useCkEthLedger();
  const ckSolLedger = useCkSolLedger();
  
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const showTransferModeSelector = ['ckBtc', 'ckEth', 'ckSol'].includes(selectedToken);

  const getSelectedBalance = () => {
    switch (selectedToken) {
      case 'infinityCoin':
        return infinityCoin.balance;
      case 'icp':
        return icp.balance;
      case 'ckBtc':
        return ckBtc.balance;
      case 'ckEth':
        return ckEth.balance;
      case 'ckSol':
        return ckSol.balance;
      default:
        return BigInt(0);
    }
  };

  const getSelectedLedgerClient = () => {
    switch (selectedToken) {
      case 'infinityCoin':
        return infinityLedger.ledgerClient;
      case 'icp':
        return icpLedger.ledgerClient;
      case 'ckBtc':
        return ckBtcLedger.ledgerClient;
      case 'ckEth':
        return ckEthLedger.ledgerClient;
      case 'ckSol':
        return ckSolLedger.ledgerClient;
      default:
        return null;
    }
  };

  const getTokenLabel = (token: TokenType): string => {
    switch (token) {
      case 'infinityCoin':
        return TOKEN_INFINITY;
      case 'icp':
        return TOKEN_ICP;
      case 'ckBtc':
        return TOKEN_CKBTC;
      case 'ckEth':
        return TOKEN_CKETH;
      case 'ckSol':
        return TOKEN_CKSOL;
      default:
        return '';
    }
  };

  const getCoinType = (token: TokenType): CoinType => {
    switch (token) {
      case 'infinityCoin':
        return CoinType.infinityCoin;
      case 'icp':
        return CoinType.icp;
      case 'ckBtc':
        return CoinType.ckBtc;
      case 'ckEth':
        return CoinType.ckEth;
      case 'ckSol':
        return CoinType.ckSol;
      default:
        return CoinType.infinityCoin;
    }
  };

  const formatError = (error: any, token: TokenType): string => {
    switch (token) {
      case 'infinityCoin':
        return formatInfinityError(error);
      case 'icp':
        return formatIcpError(error);
      case 'ckBtc':
        return formatCkBtcError(error);
      case 'ckEth':
        return formatCkEthError(error);
      case 'ckSol':
        return formatCkSolError(error);
      default:
        return 'Unknown error occurred';
    }
  };

  const handleValidate = () => {
    let recipientValidation;
    
    if (transferMode === 'native') {
      if (selectedToken === 'ckBtc') {
        recipientValidation = validateBtcAddress(recipient);
      } else if (selectedToken === 'ckEth') {
        recipientValidation = validateEthAddress(recipient);
      } else if (selectedToken === 'ckSol') {
        recipientValidation = validateSolAddress(recipient);
      } else {
        recipientValidation = validateRecipient(recipient);
      }
    } else {
      recipientValidation = validateRecipient(recipient);
    }

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

  const handleSendNative = async () => {
    const amountE8 = parseAmountToE8(amount);
    setIsSending(true);
    setSendError(null);

    try {
      if (selectedToken === 'ckBtc') {
        await sendNativeBtc.mutateAsync({ address: recipient, amountE8 });
      } else if (selectedToken === 'ckEth') {
        await sendNativeEth.mutateAsync({ address: recipient, amountWei: amountE8 });
      } else if (selectedToken === 'ckSol') {
        await sendNativeSol.mutateAsync({ address: recipient, amountLamports: amountE8 });
      }

      try {
        await recordTransaction.mutateAsync({
          recipient,
          amountE8,
          coinType: getCoinType(selectedToken),
        });
      } catch (historyError) {
        console.error('Failed to record transaction history:', historyError);
        toast.warning('Transaction succeeded but history recording failed');
      }

      setBlockIndex(BigInt(0)); // Native transfers don't have block index yet
      setStep('success');
    } catch (error) {
      console.error('Native transfer failed:', error);
      setSendError(error instanceof Error ? error.message : 'Native transfer failed. Chain-key integration coming soon.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendWrapped = async () => {
    const ledgerClient = getSelectedLedgerClient();
    
    if (!ledgerClient || !identity) {
      setSendError('Not authenticated. Please sign in.');
      return;
    }

    const amountE8 = parseAmountToE8(amount);
    setIsSending(true);
    setSendError(null);

    try {
      let recipientAccount: ICRC1Account;
      
      try {
        const recipientPrincipal = Principal.fromText(recipient);
        recipientAccount = {
          owner: recipientPrincipal,
          subaccount: [],
        };
      } catch {
        setSendError(`Recipient must be a valid Principal for ${getTokenLabel(selectedToken)} transfers`);
        setIsSending(false);
        return;
      }

      const transferResult = await ledgerClient.icrc1_transfer({
        to: recipientAccount,
        amount: amountE8,
        fee: undefined,
        memo: undefined,
        created_at_time: BigInt(Date.now()) * BigInt(1_000_000),
      });

      if ('Ok' in transferResult) {
        const txBlockIndex = transferResult.Ok;
        setBlockIndex(txBlockIndex);

        const queryKey = selectedToken === 'infinityCoin' ? 'infinityCoinBalance' :
                        selectedToken === 'icp' ? 'icpBalance' :
                        selectedToken === 'ckBtc' ? 'ckBtcBalance' :
                        selectedToken === 'ckEth' ? 'ckEthBalance' : 'ckSolBalance';
        queryClient.invalidateQueries({ queryKey: [queryKey] });

        try {
          await recordTransaction.mutateAsync({
            recipient,
            amountE8,
            coinType: getCoinType(selectedToken),
          });
        } catch (historyError) {
          console.error('Failed to record transaction history:', historyError);
          toast.warning('Transaction succeeded but history recording failed');
        }

        setStep('success');
      } else {
        const errorMessage = formatError(transferResult.Err, selectedToken);
        setSendError(errorMessage);
      }
    } catch (error) {
      console.error('Transfer failed:', error);
      setSendError(error instanceof Error ? error.message : 'Transfer failed. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = async () => {
    if (transferMode === 'native') {
      await handleSendNative();
    } else {
      await handleSendWrapped();
    }
  };

  const handleReset = () => {
    setStep('form');
    setRecipient('');
    setAmount('');
    setErrors({});
    setBlockIndex(null);
    setSendError(null);
    setTransferMode('wrapped');
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
            <CardDescription>
              {transferMode === 'native' 
                ? `Your native blockchain transaction has been initiated`
                : `Your ${getTokenLabel(selectedToken)} has been sent on the ledger`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-primary/20 bg-muted/30 backdrop-blur-sm p-4 space-y-2 shadow-glow-sm">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Asset:</span>
                <span className="font-medium text-primary">{getTokenLabel(selectedToken)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transfer Type:</span>
                <span className="font-medium text-accent capitalize">{transferMode}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium text-primary">{amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Recipient:</span>
                <span className="font-mono text-xs">{recipient.slice(0, 20)}...</span>
              </div>
              {transferMode === 'wrapped' && blockIndex !== null && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Block Index:</span>
                  <span className="font-mono text-xs text-accent">{blockIndex.toString()}</span>
                </div>
              )}
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
                <span className="font-medium text-primary">{getTokenLabel(selectedToken)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Transfer Type:</span>
                <span className="font-medium text-accent capitalize">{transferMode}</span>
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
                <span className="font-medium">{formatBalance(getSelectedBalance())} {getTokenLabel(selectedToken)}</span>
              </div>
            </div>

            {sendError && (
              <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{sendError}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setStep('form')}
                disabled={isSending}
                className="flex-1 border-primary/30"
              >
                Back
              </Button>
              <Button
                onClick={handleSend}
                disabled={isSending}
                className="flex-1 gap-2 shadow-glow hover:shadow-glow-lg transition-all"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
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
          Send Tokens
        </h1>
        <p className="text-muted-foreground">Transfer tokens to another address</p>
      </div>

      <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow">
        <CardHeader>
          <CardTitle>Transfer Details</CardTitle>
          <CardDescription>Enter the recipient and amount</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="token">Select Token</Label>
            <Select value={selectedToken} onValueChange={(value) => {
              setSelectedToken(value as TokenType);
              setTransferMode('wrapped');
              setRecipient('');
              setErrors({});
            }}>
              <SelectTrigger id="token" className="border-primary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="infinityCoin">{TOKEN_INFINITY}</SelectItem>
                <SelectItem value="icp">{TOKEN_ICP}</SelectItem>
                <SelectItem value="ckBtc">{TOKEN_CKBTC}</SelectItem>
                <SelectItem value="ckEth">{TOKEN_CKETH}</SelectItem>
                <SelectItem value="ckSol">{TOKEN_CKSOL}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Balance: {formatBalance(getSelectedBalance())} {getTokenLabel(selectedToken)}
            </p>
          </div>

          {showTransferModeSelector && (
            <div className="space-y-3">
              <Label>Transfer Mode</Label>
              <RadioGroup value={transferMode} onValueChange={(value) => {
                setTransferMode(value as TransferMode);
                setRecipient('');
                setErrors({});
              }}>
                <div className="flex items-center space-x-2 rounded-lg border border-primary/20 bg-muted/20 p-3">
                  <RadioGroupItem value="wrapped" id="wrapped" />
                  <Label htmlFor="wrapped" className="flex-1 cursor-pointer">
                    <div className="font-medium">Wrapped (ICRC-1)</div>
                    <div className="text-xs text-muted-foreground">Fast & cheap transfers within Internet Computer</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border border-accent/20 bg-accent/5 p-3">
                  <RadioGroupItem value="native" id="native" />
                  <Label htmlFor="native" className="flex-1 cursor-pointer">
                    <div className="font-medium">Native On-Chain</div>
                    <div className="text-xs text-muted-foreground">
                      Send to external {selectedToken === 'ckBtc' ? 'Bitcoin' : selectedToken === 'ckEth' ? 'Ethereum' : 'Solana'} addresses
                    </div>
                  </Label>
                </div>
              </RadioGroup>
              <Alert className="border-accent/30 bg-accent/5">
                <Info className="h-4 w-4 text-accent" />
                <AlertDescription className="text-xs">
                  {transferMode === 'wrapped' 
                    ? 'Wrapped transfers use ICRC-1 standard and stay on the Internet Computer network.'
                    : `Native transfers convert your ${getTokenLabel(selectedToken)} to real ${selectedToken === 'ckBtc' ? 'BTC' : selectedToken === 'ckEth' ? 'ETH' : 'SOL'} and send on-chain.`}
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="recipient">
                {transferMode === 'native' 
                  ? `${selectedToken === 'ckBtc' ? 'Bitcoin' : selectedToken === 'ckEth' ? 'Ethereum' : 'Solana'} Address`
                  : 'Recipient Address'}
              </Label>
              {transferMode === 'wrapped' && <RecipientPicker onSelect={setRecipient} />}
            </div>
            <Input
              id="recipient"
              placeholder={
                transferMode === 'native'
                  ? selectedToken === 'ckBtc' 
                    ? 'bc1q... or 1... or 3...'
                    : selectedToken === 'ckEth'
                    ? '0x...'
                    : 'Base58 Solana address'
                  : 'Principal or Account ID'
              }
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className={`font-mono text-sm border-primary/30 ${errors.recipient ? 'border-destructive' : ''}`}
            />
            {errors.recipient && (
              <p className="text-xs text-destructive">{errors.recipient}</p>
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
              className={`border-primary/30 ${errors.amount ? 'border-destructive' : ''}`}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount}</p>
            )}
          </div>

          <Button
            onClick={handleContinue}
            className="w-full gap-2 shadow-glow hover:shadow-glow-lg transition-all"
          >
            Continue
            <Send className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
