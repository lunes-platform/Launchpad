import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const progressVariants = cva(
  'relative h-2 w-full overflow-hidden rounded-full bg-slate-800',
  {
    variants: {
      size: {
        sm: 'h-1',
        md: 'h-2', 
        lg: 'h-3',
        xl: 'h-4'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
)

const progressBarVariants = cva(
  'h-full w-full flex-1 transition-all duration-500 ease-out',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-primary to-primaryLight',
        success: 'bg-gradient-to-r from-success to-green-400',
        warning: 'bg-gradient-to-r from-warning to-yellow-400',
        error: 'bg-gradient-to-r from-error to-red-400',
        info: 'bg-gradient-to-r from-info to-blue-400',
        gradient: 'bg-gradient-to-r from-primary via-accent to-primaryLight'
      }
    },
    defaultVariants: {
      variant: 'primary'
    }
  }
)

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof progressBarVariants> {
  value?: number
  max?: number
  showValue?: boolean
  showPercentage?: boolean
  label?: string
  animated?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    size,
    variant = 'primary',
    value = 0, 
    max = 100,
    showValue = false,
    showPercentage = false,
    label,
    animated = false,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    return (
      <div className="w-full space-y-2">
        {(label || showValue || showPercentage) && (
          <div className="flex items-center justify-between text-sm">
            {label && <span className="text-white font-medium">{label}</span>}
            <div className="text-slate-200">
              {showValue && <span>{value.toLocaleString()}</span>}
              {showValue && showPercentage && <span> / </span>}
              {showPercentage && <span>{percentage.toFixed(1)}%</span>}
            </div>
          </div>
        )}
        
        <div
          ref={ref}
          className={cn(progressVariants({ size }), className)}
          {...props}
        >
          <div
            className={cn(
              progressBarVariants({ variant }),
              animated && 'animate-pulse',
              percentage === 0 && 'w-0'
            )}
            style={{ 
              width: `${percentage}%`,
              transformOrigin: 'left'
            }}
          />
          
          {/* Animated shimmer effect */}
          {animated && percentage > 0 && (
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]"
              style={{
                transform: 'translateX(-100%)',
                animation: 'shimmer 2s infinite'
              }}
            />
          )}
        </div>
        
        {/* Value display inside bar for larger sizes */}
        {(size === 'lg' || size === 'xl') && showPercentage && percentage > 20 && (
          <div 
            className="absolute inset-y-0 left-2 flex items-center text-xs font-semibold text-white"
            style={{ width: `${percentage}%` }}
          >
            {percentage.toFixed(0)}%
          </div>
        )}
      </div>
    )
  }
)

Progress.displayName = 'Progress'

// Circular Progress Component
export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  size?: number
  strokeWidth?: number
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  showValue?: boolean
  children?: React.ReactNode
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  ({ 
    className,
    value = 0,
    max = 100,
    size = 120,
    strokeWidth = 8,
    variant = 'primary',
    showValue = true,
    children,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    const getStrokeColor = () => {
      switch (variant) {
        case 'success': return 'stroke-success'
        case 'warning': return 'stroke-warning'
        case 'error': return 'stroke-error'
        case 'info': return 'stroke-info'
        default: return 'stroke-primary'
      }
    }

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex items-center justify-center', className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="currentColor"
            className="text-surface"
            fill="transparent"
          />
          
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="currentColor"
            className={cn('transition-all duration-500 ease-out', getStrokeColor())}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {children || (showValue && (
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {percentage.toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
)

CircularProgress.displayName = 'CircularProgress'

export { Progress, CircularProgress, progressVariants, progressBarVariants }
