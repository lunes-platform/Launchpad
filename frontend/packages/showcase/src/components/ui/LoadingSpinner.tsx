import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
}

export function LoadingSpinner({ 
  size = 'md', 
  text, 
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const spinnerElement = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <Loader2 className={`${sizeClasses[size]} text-primary animate-spin`} />
      {text && (
        <p className="text-slate-200 text-sm font-medium">{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-slate-800 border border-slate-600 rounded-card p-8 shadow-lg">
          {spinnerElement}
        </div>
      </div>
    )
  }

  return spinnerElement
}

export default LoadingSpinner