// src/components/shared/ErrorBoundary.jsx
import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Button from '../ui/Button';
import './ErrorBoundary.css';

/**
 * ErrorBoundary (Package 6.2, new)
 *
 * Per Blueprint gap item #41 (Section 9J — "No React Error Boundary
 * anywhere ... an uncaught render error in any component would
 * currently white-screen the entire app under React 19, with no
 * fallback UI"): this is the top-level safety net. Must be a class
 * component — `getDerivedStateFromError`/`componentDidCatch` have no
 * hook equivalent in React 19.
 *
 * Logs via `console.error`, matching the existing app-wide error
 * pattern documented in Section 9J (every caught error already logs
 * to the console; this extends that same convention to render errors
 * that were previously uncatchable). A native `alert()` is not used
 * here, unlike other write-path error handling in the app, since this
 * fallback already replaces the entire crashed subtree with a visible
 * message — an additional blocking alert would be redundant.
 *
 * Usage — wraps the routed page content in `App.jsx` (not the whole
 * app shell), so `NavigationBar`/`Footer` stay visible and usable
 * even if a single page's render throws:
 *
 *   <ErrorBoundary>
 *     <Routes>...</Routes>
 *   </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught a render error:', error, errorInfo);
  }

  handleReset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary__content">
            <AlertTriangle size={48} className="error-boundary__icon" aria-hidden="true" />
            <h1>Something Went Wrong</h1>
            <p>
              We hit an unexpected error while loading this page. You can try
              again, or head back to the homepage.
            </p>
            <div className="error-boundary__actions">
              <Button onClick={this.handleReset} variant="primary">
                <RotateCcw size={16} aria-hidden="true" />
                Try Again
              </Button>
              <Button as="a" href="/" variant="outline">
                <Home size={16} aria-hidden="true" />
                Go to Homepage
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;