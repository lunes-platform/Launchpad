import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-button text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-primary to-primaryDark hover:from-primaryLight hover:to-primary text-white shadow-button hover:shadow-buttonHover hover:scale-105 active:scale-95',
        secondary: 'bg-slate-800 hover:bg-slate-800Hover text-white border border-slate-600 hover:border-primary/40 hover:shadow-card',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-glow active:scale-95',
        ghost: 'text-slate-200 hover:text-white hover:bg-slate-800/80 hover:backdrop-blur-sm',
        danger: 'bg-gradient-to-r from-error to-red-600 hover:from-red-500 hover:to-error text-white shadow-button hover:shadow-buttonHover',
        success: 'bg-gradient-to-r from-success to-green-600 hover:from-green-500 hover:to-success text-white shadow-button hover:shadow-buttonHover',
        warning: 'bg-gradient-to-r from-warning to-yellow-600 hover:from-yellow-500 hover:to-warning text-white shadow-button hover:shadow-buttonHover',
        link: 'text-primary underline-offset-4 hover:underline p-0 h-auto'
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 py-3 text-base',
        xl: 'h-14 px-8 py-4 text-lg',
        icon: 'h-10 w-10'
      },
      fullWidth: {
        true: 'w-full',
        false: ''
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth, 
    loading, 
    leftIcon, 
    rightIcon, 
    children, 
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
