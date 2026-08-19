import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

/**
 * Last-resort fallback for an uncaught render error. Without this, a single throwing
 * component anywhere in the tree (e.g. `PromptDemo`, `ArchitectureDiagram`) unmounts the
 * entire app and leaves visitors looking at a blank page with no way to recover short of a
 * manual reload they have no reason to try.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Ondrift landing page crashed:', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div role="alert" style={{ margin: '4rem auto', maxWidth: '32rem', padding: '0 1.5rem', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Something went wrong.</h1>
        <p style={{ marginBottom: '1.5rem' }}>Please reload the page. If the problem continues, let us know on GitHub.</p>
        <button type="button" onClick={() => window.location.reload()}>Reload page</button>
      </div>
    )
  }
}
