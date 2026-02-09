import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AppErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="mx-auto max-w-md space-y-6">
            <Alert variant="destructive" className="border-destructive/50 shadow-glow-sm">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="text-lg font-semibold">Something went wrong</AlertTitle>
              <AlertDescription className="mt-2 space-y-3">
                <p>
                  The application encountered an unexpected error. Please try refreshing the page.
                </p>
                {this.state.error && (
                  <details className="text-xs font-mono bg-destructive/10 p-2 rounded border border-destructive/20">
                    <summary className="cursor-pointer font-semibold mb-1">Error details</summary>
                    <p className="mt-1">{this.state.error.message}</p>
                  </details>
                )}
                <Button onClick={this.handleReset} className="w-full gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Reload Application
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
