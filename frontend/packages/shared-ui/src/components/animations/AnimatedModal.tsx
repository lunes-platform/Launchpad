import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

// Wrapper para resolver compatibilidade de tipos React 19
const CloseIcon = ({ className, ...props }: { className?: string }) => {
  const IconComponent = X as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} {...props} />;
};

interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

/**
 * Modal animado com CSS transitions
 * Implementa animações suaves de entrada e saída
 */
export const AnimatedModal: React.FC<AnimatedModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  closeOnOverlayClick = true,
  showCloseButton = true,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Pequeno delay para permitir a renderização antes da animação
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Aguarda a animação terminar antes de remover do DOM
      setTimeout(() => setShouldRender(false), 200);
    }
  }, [isOpen]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  if (!shouldRender) return null;

  const modalContent = (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200",
        isVisible ? "opacity-100" : "opacity-0",
      )}
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black transition-opacity duration-200",
          isVisible ? "bg-opacity-50" : "bg-opacity-0",
        )}
        style={{ backdropFilter: "blur(4px)" }}
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative bg-grafite-800 rounded-xl shadow-2xl w-full transform transition-all duration-200",
          sizeClasses[size],
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
          className,
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-grafite-700">
            {title && (
              <h2 className="text-xl font-semibold text-white">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-grafite-300 hover:text-white rounded-lg hover:bg-grafite-700 transition-all duration-150 hover:scale-110 active:scale-95"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );

  // Render modal using portal to ensure it's rendered outside the component tree
  return createPortal(modalContent, document.body);
};

export default AnimatedModal;
