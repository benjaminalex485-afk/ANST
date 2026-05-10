import React from 'react';
import ReactDOM from 'react-dom/client';
import TerminalWorkstation from './app/page';
import ErrorBoundary from './components/shared/ErrorBoundary';

// Core Design System Inclusion
import './styles/global-terminal.css';

/**
 * Core System Genesis Entry point.
 * Fires up React 18 engine inside standard Strict isolation context.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <TerminalWorkstation />
    </ErrorBoundary>
  </React.StrictMode>
);
