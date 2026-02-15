import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, FileCode, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ContractsPage() {
  const { identity } = useInternetIdentity();
  const [canisterId, setCanisterId] = useState('');
  const [methodName, setMethodName] = useState('');
  const [args, setArgs] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const isAuthenticated = !!identity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identity || !isAuthenticated) {
      toast.error('Please sign in with Internet Identity first');
      return;
    }

    if (!canisterId || !methodName) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      // Simulate contract call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Parse arguments
      let parsedArgs = [];
      if (args.trim()) {
        try {
          parsedArgs = JSON.parse(args);
          if (!Array.isArray(parsedArgs)) {
            parsedArgs = [parsedArgs];
          }
        } catch {
          throw new Error('Arguments must be valid JSON');
        }
      }

      // Mock successful response
      setResult({
        success: true,
        message: `Method "${methodName}" would be called on canister ${canisterId} with arguments: ${JSON.stringify(parsedArgs, null, 2)}\n\nNote: This is a demo implementation. In production, this would execute a real canister call signed by your Internet Identity.`,
      });
      toast.success('Contract call simulated successfully');
    } catch (error: any) {
      console.error('Contract call failed:', error);
      setResult({
        success: false,
        message: error.message || 'Contract call failed',
      });
      toast.error('Contract call failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCanisterId('');
    setMethodName('');
    setArgs('');
    setResult(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Contracts
          </h1>
          <p className="text-muted-foreground">Interact with canisters</p>
        </div>
        <Alert className="border-accent/30 bg-accent/5 shadow-glow-sm">
          <AlertCircle className="h-4 w-4 text-accent" />
          <AlertDescription>
            Please sign in with Internet Identity to interact with canisters.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Contracts
        </h1>
        <p className="text-muted-foreground">Call canister methods using your Internet Identity</p>
      </div>

      {result && (
        <Alert
          variant={result.success ? 'default' : 'destructive'}
          className={`shadow-glow-sm ${
            result.success ? 'border-primary/30 bg-primary/5' : 'border-destructive/50'
          }`}
        >
          {result.success ? (
            <CheckCircle2 className="h-4 w-4 text-primary" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>{result.success ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription className="mt-2 font-mono text-xs whitespace-pre-wrap">
            {result.message}
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow-sm hover:shadow-glow transition-all">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-primary" />
            <CardTitle>Canister Call</CardTitle>
          </div>
          <CardDescription>Execute update calls on Internet Computer canisters</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="canisterId">Canister ID *</Label>
              <Input
                id="canisterId"
                placeholder="rrkah-fqaaa-aaaaa-aaaaq-cai"
                value={canisterId}
                onChange={(e) => setCanisterId(e.target.value)}
                className="border-primary/20 font-mono"
                required
              />
              <p className="text-xs text-muted-foreground">
                The principal ID of the canister you want to call
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="methodName">Method Name *</Label>
              <Input
                id="methodName"
                placeholder="greet"
                value={methodName}
                onChange={(e) => setMethodName(e.target.value)}
                className="border-primary/20"
                required
              />
              <p className="text-xs text-muted-foreground">
                The name of the update method to call
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="args">Arguments (JSON)</Label>
              <Textarea
                id="args"
                placeholder='["Alice"] or {"name": "Alice"}'
                value={args}
                onChange={(e) => setArgs(e.target.value)}
                className="border-primary/20 font-mono min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                Optional: Arguments as JSON array or object. Leave empty for no arguments.
              </p>
            </div>

            <Alert className="border-accent/30 bg-accent/5 shadow-glow-sm">
              <AlertCircle className="h-4 w-4 text-accent" />
              <AlertDescription className="text-xs">
                This will execute an update call signed by your Internet Identity. Make sure you trust the canister
                and understand what the method does.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex-1 border-primary/30 hover:shadow-glow-sm transition-all"
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 shadow-glow hover:shadow-glow-lg transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calling...
                  </>
                ) : (
                  <>
                    <FileCode className="mr-2 h-4 w-4" />
                    Call Method
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
