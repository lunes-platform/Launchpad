import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-badge border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'border-primary/30 bg-primary/20 text-primary hover:bg-primary/30',
        secondary: 'border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-800Hover',
        success: 'border-success/30 bg-success/20 text-success hover:bg-success/30',
        warning: 'border-warning/30 bg-warning/20 text-warning hover:bg-warning/30',
        error: 'border-error/30 bg-error/20 text-error hover:bg-error/30',
        info: 'border-info/30 bg-info/20 text-info hover:bg-info/30',
        outline: 'border-slate-600 text-white hover:bg-slate-800',
        gradient: 'border-primary/50 bg-gradient-to-r from-primary/20 to-accent/20 text-primary'
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode
  icon?: React.ReactNode
  closable?: boolean
  onClose?: () => void
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, children, icon, closable, onClose, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
        {closable && onClose && (
          <button
            onClick={onClose}
            className="ml-1 hover:bg-black/20 rounded-full p-0.5 transition-colors"
          >
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge, badgeVariants }
