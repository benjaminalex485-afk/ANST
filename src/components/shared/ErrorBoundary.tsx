import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Critical boundary catching unhandled sub-tree exceptions.
 * Essential for maintaining dashboard stability when single panels collapse.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ANST System Exception:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center h-full w-full p-4 border border-destructive/30 bg-destructive/5 rounded text-destructive text-xs font-mono">
          PANEL EXECUTION FAILURE. CHECK CONSOLE.
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
