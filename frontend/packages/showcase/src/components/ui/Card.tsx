import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  'rounded-card shadow-card backdrop-blur-sm transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-slate-800 border border-slate-600',
        elevated: 'bg-slate-800Elevated border border-slate-600Light shadow-cardHover',
        glass: 'bg-slate-800/40 backdrop-blur-lg border border-slate-600Light/50',
        glow: 'bg-slate-800 border border-slate-600 shadow-glow hover:shadow-glowHover hover:shadow-primary/20 hover:-translate-y-1',
        outline: 'border-2 border-slate-600 hover:border-primary/30 bg-transparent',
        gradient: 'bg-gradient-to-br from-primary/10 via-surface to-accent/10 border border-primary/20'
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10'
      },
      hover: {
        none: '',
        lift: 'hover:-translate-y-1',
        scale: 'hover:scale-105',
        glow: 'hover:shadow-glow'
      }
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      hover: 'none'
    }
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hover, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, hover, className }))}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('heading-4 leading-none tracking-tight', className)}
    {...props}
  >
    {children}
  </h3>
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-slate-200', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-6', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  cardVariants 
}
