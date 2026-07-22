import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--background)',
                    color: 'var(--text)',
                    textAlign: 'center',
                    padding: '20px'
                }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Something went wrong.</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                        The application encountered an unexpected error.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
                    >
                        Reload Page
                    </button>
                    {import.meta.env.DEV && (
                        <pre style={{
                            marginTop: '20px',
                            padding: '15px',
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: '8px',
                            textAlign: 'left',
                            maxWidth: '80%',
                            overflow: 'auto',
                            fontSize: '0.8rem'
                        }}>
                            {this.state.error && this.state.error.toString()}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
