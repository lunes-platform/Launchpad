import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

const inputVariants = cva(
  'flex w-full rounded-input border bg-slate-800 px-4 py-3 text-white placeholder-textMuted transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:shadow-glow disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-slate-600 focus:border-primary',
        error: 'border-error focus:border-error focus:ring-error/20',
        success: 'border-success focus:border-success focus:ring-success/20',
        warning: 'border-warning focus:border-warning focus:ring-warning/20'
      },
      size: {
        sm: 'h-8 px-3 py-2 text-sm',
        md: 'h-10 px-4 py-3',
        lg: 'h-12 px-6 py-4 text-lg'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  success?: string
  warning?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    size, 
    type = 'text',
    label,
    error,
    success,
    warning,
    helperText,
    leftIcon,
    rightIcon,
    showPasswordToggle,
    disabled,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [internalType, setInternalType] = React.useState(type)

    // Determine variant based on state
    const currentVariant = error ? 'error' : success ? 'success' : warning ? 'warning' : variant

    React.useEffect(() => {
      if (type === 'password' && showPasswordToggle) {
        setInternalType(showPassword ? 'text' : 'password')
      }
    }, [showPassword, type, showPasswordToggle])

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    const getStatusIcon = () => {
      if (error) return <AlertCircle className="h-4 w-4 text-error" />
      if (success) return <CheckCircle className="h-4 w-4 text-success" />
      if (warning) return <AlertCircle className="h-4 w-4 text-warning" />
      return null
    }

    const getStatusMessage = () => {
      if (error) return error
      if (success) return success
      if (warning) return warning
      return helperText
    }

    const getStatusColor = () => {
      if (error) return 'text-error'
      if (success) return 'text-success'
      if (warning) return 'text-warning'
      return 'text-slate-400'
    }

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white mb-2">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              {leftIcon}
            </div>
          )}
          
          <input
            type={internalType}
            className={cn(
              inputVariants({ variant: currentVariant, size }),
              leftIcon && 'pl-10',
              (rightIcon || showPasswordToggle || getStatusIcon()) && 'pr-10',
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {getStatusIcon()}
            
            {showPasswordToggle && type === 'password' && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-slate-400 hover:text-white transition-colors"
                disabled={disabled}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
            
            {rightIcon && !getStatusIcon() && (
              <span className="text-slate-400">{rightIcon}</span>
            )}
          </div>
        </div>
        
        {getStatusMessage() && (
          <p className={cn('mt-2 text-sm', getStatusColor())}>
            {getStatusMessage()}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input, inputVariants }
