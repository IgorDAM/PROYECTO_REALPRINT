import React from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { ErrorFallback } from './ErrorFallback';
import { logger } from '../services/logger';

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  name?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

/**
 * ErrorBoundary class component para capturar errores en componentes hijos.
 *
 * Características:
 * - Captura errores en renderizado
 * - Captura errores en lifecycle methods
 * - Proporciona UI de fallback
 * - Logs de errores en logger
 * - Reset manual
 *
 * Uso:
 * <ErrorBoundary fallback={<ErrorFallback />}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(_error: Error): Pick<ErrorBoundaryState, 'hasError'> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = Math.random().toString(36).substring(7);

    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // Log del error
    logger.error('ErrorBoundary caught error', {
      errorId,
      component: this.props.name || 'Unknown',
      message: error.message,
      stack: error.stack?.substring(0, 500),
      componentStack: errorInfo.componentStack?.substring(0, 500),
    });
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });

    // Callback opcional
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      const fallback = this.props.fallback || (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );

      return fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


