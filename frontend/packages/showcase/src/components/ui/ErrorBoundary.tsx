import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-slate-800 border border-slate-600 rounded-card p-8 text-center">
              <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-error" />
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-2">
                Ops! Algo deu errado
              </h1>
              
              <p className="text-slate-200 mb-6">
                Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver o problema.
              </p>

              <div className="space-y-3">
                <button
                  onClick={this.handleReload}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-button transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Tentar Novamente</span>
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-3 px-4 rounded-button transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Voltar ao Início</span>
                </button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-slate-400 text-sm cursor-pointer hover:text-slate-300">
                    Detalhes do erro (desenvolvimento)
                  </summary>
                  <div className="mt-2 p-3 bg-slate-900 rounded border text-xs font-mono text-red-400 overflow-auto max-h-32">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
