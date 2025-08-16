import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { Button } from './Button'

const modalVariants = cva(
  'relative bg-slate-800 border border-slate-600 shadow-modal rounded-modal animate-scale-in',
  {
    variants: {
      size: {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-7xl'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
)

export interface ModalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalVariants> {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  closeOnEsc?: boolean
  children: React.ReactNode
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ 
    className,
    size,
    isOpen,
    onClose,
    title,
    description,
    showCloseButton = true,
    closeOnBackdropClick = true,
    closeOnEsc = true,
    children,
    ...props 
  }, ref) => {
    useEffect(() => {
      if (!closeOnEsc) return

      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose()
        }
      }

      if (isOpen) {
        document.addEventListener('keydown', handleEsc)
        document.body.style.overflow = 'hidden'
      }

      return () => {
        document.removeEventListener('keydown', handleEsc)
        document.body.style.overflow = 'auto'
      }
    }, [isOpen, onClose, closeOnEsc])

    if (!isOpen) return null

    const handleBackdropClick = (event: React.MouseEvent) => {
      if (closeOnBackdropClick && event.target === event.currentTarget) {
        onClose()
      }
    }

    const modalContent = (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={handleBackdropClick}
        />
        
        {/* Modal */}
        <div
          ref={ref}
          className={cn(modalVariants({ size }), 'w-full', className)}
          {...props}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 pb-4">
              <div>
                {title && (
                  <h2 className="heading-3 text-white">{title}</h2>
                )}
                {description && (
                  <p className="mt-1 text-slate-200">{description}</p>
                )}
              </div>
              
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Fechar</span>
                </Button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className={cn(
            'px-6',
            (title || showCloseButton) ? 'pb-6' : 'py-6'
          )}>
            {children}
          </div>
        </div>
      </div>
    )

    return createPortal(modalContent, document.body)
  }
)

Modal.displayName = 'Modal'

const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-2 text-center sm:text-left', className)}
    {...props}
  />
))
ModalHeader.displayName = 'ModalHeader'

const ModalTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('heading-3 text-white', className)}
    {...props}
  />
))
ModalTitle.displayName = 'ModalTitle'

const ModalDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-slate-200', className)}
    {...props}
  />
))
ModalDescription.displayName = 'ModalDescription'

const ModalContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('space-y-4', className)}
    {...props}
  />
))
ModalContent.displayName = 'ModalContent'

const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0',
      className
    )}
    {...props}
  />
))
ModalFooter.displayName = 'ModalFooter'

export { 
  Modal, 
  ModalHeader, 
  ModalTitle, 
  ModalDescription, 
  ModalContent, 
  ModalFooter,
  modalVariants 
}
