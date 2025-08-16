import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { User } from 'lucide-react'

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden border-2 transition-all duration-300',
  {
    variants: {
      size: {
        xs: 'h-6 w-6',
        sm: 'h-8 w-8', 
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
        '2xl': 'h-20 w-20',
        '3xl': 'h-24 w-24'
      },
      variant: {
        circle: 'rounded-full',
        square: 'rounded-card',
        rounded: 'rounded-lg'
      },
      border: {
        none: 'border-transparent',
        default: 'border-slate-600',
        primary: 'border-primary',
        success: 'border-success',
        warning: 'border-warning',
        error: 'border-error'
      },
      status: {
        none: '',
        online: 'ring-2 ring-success ring-offset-2 ring-offset-background',
        offline: 'ring-2 ring-textMuted ring-offset-2 ring-offset-background',
        away: 'ring-2 ring-warning ring-offset-2 ring-offset-background',
        busy: 'ring-2 ring-error ring-offset-2 ring-offset-background'
      }
    },
    defaultVariants: {
      size: 'md',
      variant: 'circle',
      border: 'default',
      status: 'none'
    }
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: string
  name?: string
  showStatus?: boolean
  statusPosition?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    className, 
    size, 
    variant, 
    border, 
    status,
    src, 
    alt, 
    fallback, 
    name,
    showStatus = false,
    statusPosition = 'bottom-right',
    ...props 
  }, ref) => {
    const [imageError, setImageError] = React.useState(false)
    
    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase()
    }

    const getStatusPositionClasses = () => {
      const statusSize = size === 'xs' || size === 'sm' ? 'h-2 w-2' : 'h-3 w-3'
      
      switch (statusPosition) {
        case 'top-right':
          return `absolute -top-0.5 -right-0.5 ${statusSize}`
        case 'top-left':
          return `absolute -top-0.5 -left-0.5 ${statusSize}`
        case 'bottom-left':
          return `absolute -bottom-0.5 -left-0.5 ${statusSize}`
        default: // bottom-right
          return `absolute -bottom-0.5 -right-0.5 ${statusSize}`
      }
    }

    const getStatusColor = () => {
      switch (status) {
        case 'online': return 'bg-success'
        case 'away': return 'bg-warning'
        case 'busy': return 'bg-error'
        case 'offline': return 'bg-textMuted'
        default: return 'bg-textMuted'
      }
    }

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, variant, border, status }), className)}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="aspect-square h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : fallback ? (
          <div className="flex h-full w-full items-center justify-center bg-slate-800 text-white font-medium">
            {fallback}
          </div>
        ) : name ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold">
            {getInitials(name)}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-400">
            <User className="h-1/2 w-1/2" />
          </div>
        )}
        
        {/* Status indicator */}
        {showStatus && status && status !== 'none' && (
          <div 
            className={cn(
              'rounded-full border-2 border-background',
              getStatusPositionClasses(),
              getStatusColor()
            )}
          />
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

// Avatar Group Component
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number
  size?: AvatarProps['size']
  variant?: AvatarProps['variant']
  border?: AvatarProps['border']
  spacing?: 'tight' | 'normal' | 'loose'
  children: React.ReactElement<AvatarProps>[]
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ 
    className,
    max = 5,
    size = 'md',
    variant = 'circle',
    border = 'default',
    spacing = 'normal',
    children,
    ...props 
  }, ref) => {
    const validChildren = React.Children.toArray(children).filter(
      (child): child is React.ReactElement<AvatarProps> => 
        React.isValidElement(child)
    )

    const visibleChildren = validChildren.slice(0, max)
    const remainingCount = Math.max(0, validChildren.length - max)

    const getSpacingClass = () => {
      switch (spacing) {
        case 'tight': return '-space-x-1'
        case 'loose': return '-space-x-0.5'
        default: return '-space-x-2'
      }
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-center', getSpacingClass(), className)}
        {...props}
      >
        {visibleChildren.map((child, index) =>
          React.cloneElement(child, {
            key: index,
            size,
            variant,
            border,
            className: cn(
              'border-2 border-background relative z-10',
              child.props.className
            ),
            style: {
              zIndex: visibleChildren.length - index,
              ...child.props.style
            }
          })
        )}
        
        {remainingCount > 0 && (
          <div
            className={cn(
              avatarVariants({ size, variant, border }),
              'bg-slate-800 border-2 border-background flex items-center justify-center text-slate-200 font-medium relative',
              'z-0'
            )}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    )
  }
)

AvatarGroup.displayName = 'AvatarGroup'

export { Avatar, AvatarGroup, avatarVariants }
