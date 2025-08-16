import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const tooltipVariants = cva(
  'z-50 overflow-hidden rounded-button border bg-slate-800 px-3 py-1.5 text-xs text-white shadow-modal animate-fade-in',
  {
    variants: {
      variant: {
        default: 'border-slate-600 bg-slate-800 text-white',
        dark: 'border-gray-800 bg-gray-900 text-gray-100',
        light: 'border-gray-200 bg-white text-gray-900',
        primary: 'border-primary/20 bg-primary text-white',
        success: 'border-success/20 bg-success text-white',
        warning: 'border-warning/20 bg-warning text-white',
        error: 'border-error/20 bg-error text-white'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps
  extends VariantProps<typeof tooltipVariants> {
  content: React.ReactNode
  position?: TooltipPosition
  delay?: number
  disabled?: boolean
  children: React.ReactElement
  className?: string
  maxWidth?: number
  arrow?: boolean
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ 
    content,
    position = 'top',
    delay = 400,
    disabled = false,
    variant,
    className,
    maxWidth = 250,
    arrow = true,
    children,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = useState(false)
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
    const triggerRef = useRef<HTMLElement>(null)
    const tooltipRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout>()

    const showTooltip = () => {
      if (disabled || !content) return
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setIsVisible(true)
      }, delay)
    }

    const hideTooltip = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsVisible(false)
    }

    const calculatePosition = () => {
      if (!triggerRef.current || !tooltipRef.current) return

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      }

      let x = 0
      let y = 0

      switch (position) {
        case 'top':
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          y = triggerRect.top - tooltipRect.height - 8
          break
        case 'bottom':
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          y = triggerRect.bottom + 8
          break
        case 'left':
          x = triggerRect.left - tooltipRect.width - 8
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          break
        case 'right':
          x = triggerRect.right + 8
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          break
      }

      // Keep tooltip within viewport
      x = Math.max(8, Math.min(x, viewport.width - tooltipRect.width - 8))
      y = Math.max(8, Math.min(y, viewport.height - tooltipRect.height - 8))

      setTooltipPosition({ x, y })
    }

    useEffect(() => {
      if (isVisible) {
        calculatePosition()
        
        const handleScroll = () => calculatePosition()
        const handleResize = () => calculatePosition()
        
        window.addEventListener('scroll', handleScroll, true)
        window.addEventListener('resize', handleResize)
        
        return () => {
          window.removeEventListener('scroll', handleScroll, true)
          window.removeEventListener('resize', handleResize)
        }
      }
    }, [isVisible, position])

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    const getArrowClasses = () => {
      if (!arrow) return ''
      
      const base = 'absolute w-2 h-2 border border-inherit'
      
      switch (position) {
        case 'top':
          return `${base} top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 border-t-transparent border-l-transparent`
        case 'bottom':
          return `${base} bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 border-b-transparent border-r-transparent`
        case 'left':
          return `${base} left-full top-1/2 transform -translate-y-1/2 -translate-x-1/2 rotate-45 border-t-transparent border-l-transparent`
        case 'right':
          return `${base} right-full top-1/2 transform -translate-y-1/2 translate-x-1/2 rotate-45 border-b-transparent border-r-transparent`
        default:
          return ''
      }
    }

    const clonedChild = React.cloneElement(children, {
      ref: triggerRef,
      onMouseEnter: (e: React.MouseEvent) => {
        showTooltip()
        children.props.onMouseEnter?.(e)
      },
      onMouseLeave: (e: React.MouseEvent) => {
        hideTooltip()
        children.props.onMouseLeave?.(e)
      },
      onFocus: (e: React.FocusEvent) => {
        showTooltip()
        children.props.onFocus?.(e)
      },
      onBlur: (e: React.FocusEvent) => {
        hideTooltip()
        children.props.onBlur?.(e)
      }
    })

    const tooltipContent = isVisible && content && (
      <div
        ref={tooltipRef}
        className={cn(tooltipVariants({ variant }), className)}
        style={{
          position: 'fixed',
          left: tooltipPosition.x,
          top: tooltipPosition.y,
          maxWidth: maxWidth,
          zIndex: 9999
        }}
        role="tooltip"
        {...props}
      >
        {content}
        {arrow && (
          <div 
            className={getArrowClasses()}
            style={{ backgroundColor: 'inherit' }}
          />
        )}
      </div>
    )

    return (
      <>
        {clonedChild}
        {tooltipContent && createPortal(tooltipContent, document.body)}
      </>
    )
  }
)

Tooltip.displayName = 'Tooltip'

export { Tooltip, tooltipVariants }
