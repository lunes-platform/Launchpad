import React, { useState, useRef, useEffect } from "react";

export interface FloatingActionButtonProps {
  /** Ícone principal do botão */
  icon: React.ReactNode;
  /** Posição do botão na tela */
  position?:
    | "bottom-right"
    | "bottom-left"
    | "top-right"
    | "top-left"
    | "center";
  /** Tamanho do botão */
  size?: "small" | "medium" | "large";
  /** Cor de fundo do botão */
  backgroundColor?: string;
  /** Cor do ícone */
  iconColor?: string;
  /** Se deve mostrar sombra */
  shadow?: boolean;
  /** Se deve ter efeito de hover */
  hoverEffect?: boolean;
  /** Se deve ter animação de entrada */
  animated?: boolean;
  /** Ações secundárias (submenu) */
  actions?: Array<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    color?: string;
  }>;
  /** Se o submenu está aberto */
  isOpen?: boolean;
  /** Callback quando clica no botão principal */
  onClick?: () => void;
  /** Callback quando o estado de abertura muda */
  onToggle?: (isOpen: boolean) => void;
  /** Tooltip do botão principal */
  tooltip?: string;
  /** Classe CSS adicional */
  className?: string;
  /** Se deve ter efeito de pulsação */
  pulse?: boolean;
  /** Se deve rotacionar o ícone quando aberto */
  rotateOnOpen?: boolean;
  /** Direção de abertura do submenu */
  expandDirection?: "up" | "down" | "left" | "right";
}

/**
 * Componente de botão de ação flutuante com submenu opcional
 *
 * @example
 * <FloatingActionButton
 *   icon={<PlusIcon />}
 *   position="bottom-right"
 *   actions={[
 *     { icon: <EditIcon />, label: 'Editar', onClick: () => {} },
 *     { icon: <DeleteIcon />, label: 'Excluir', onClick: () => {} }
 *   ]}
 * />
 */
export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  position = "bottom-right",
  size = "medium",
  backgroundColor = "#3b82f6",
  iconColor = "#ffffff",
  shadow = true,
  hoverEffect = true,
  animated = true,
  actions = [],
  isOpen: controlledIsOpen,
  onClick,
  onToggle,
  tooltip,
  className = "",
  pulse = false,
  rotateOnOpen = true,
  expandDirection = "up",
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  useEffect(() => {
    if (animated) {
      setMounted(true);
    }
  }, [animated]);

  // Injetar keyframes CSS
  useEffect(() => {
    const keyframeId = "fab-animations";
    if (document.getElementById(keyframeId)) return;

    const keyframes = `
      @keyframes fab-entrance {
        0% {
          transform: scale(0) rotate(180deg);
          opacity: 0;
        }
        100% {
          transform: scale(1) rotate(0deg);
          opacity: 1;
        }
      }
      
      @keyframes fab-pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }
      
      @keyframes fab-bounce {
        0%, 20%, 53%, 80%, 100% {
          transform: translate3d(0, 0, 0);
        }
        40%, 43% {
          transform: translate3d(0, -8px, 0);
        }
        70% {
          transform: translate3d(0, -4px, 0);
        }
        90% {
          transform: translate3d(0, -2px, 0);
        }
      }
    `;

    const style = document.createElement("style");
    style.id = keyframeId;
    style.textContent = keyframes;
    document.head.appendChild(style);
  }, []);

  const handleMainClick = () => {
    if (actions.length > 0) {
      const newIsOpen = !isOpen;
      if (controlledIsOpen === undefined) {
        setInternalIsOpen(newIsOpen);
      }
      onToggle?.(newIsOpen);
    }
    onClick?.();
  };

  const handleActionClick = (action: (typeof actions)[0]) => {
    action.onClick();
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(false);
    }
    onToggle?.(false);
  };

  const getPositionStyles = (): React.CSSProperties => {
    const baseOffset = 20;

    switch (position) {
      case "bottom-right":
        return { position: "fixed", bottom: baseOffset, right: baseOffset };
      case "bottom-left":
        return { position: "fixed", bottom: baseOffset, left: baseOffset };
      case "top-right":
        return { position: "fixed", top: baseOffset, right: baseOffset };
      case "top-left":
        return { position: "fixed", top: baseOffset, left: baseOffset };
      case "center":
        return {
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        };
      default:
        return { position: "fixed", bottom: baseOffset, right: baseOffset };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return { width: 48, height: 48, fontSize: "1.25rem" };
      case "large":
        return { width: 72, height: 72, fontSize: "2rem" };
      default:
        return { width: 56, height: 56, fontSize: "1.5rem" };
    }
  };

  const getActionPosition = (index: number) => {
    const spacing = getSizeStyles().height + 16;
    const offset = (index + 1) * spacing;

    switch (expandDirection) {
      case "up":
        return { bottom: offset };
      case "down":
        return { top: offset };
      case "left":
        return { right: offset };
      case "right":
        return { left: offset };
      default:
        return { bottom: offset };
    }
  };

  const mainButtonStyle: React.CSSProperties = {
    ...getSizeStyles(),
    backgroundColor,
    color: iconColor,
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: shadow ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: isOpen && rotateOnOpen ? "rotate(45deg)" : "rotate(0deg)",
    zIndex: 1000,
    animation:
      animated && mounted
        ? "fab-entrance 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
        : "none",
  };

  if (hoverEffect) {
    mainButtonStyle.transform = `${mainButtonStyle.transform} scale(1)`;
  }

  if (pulse) {
    mainButtonStyle.animation = `${mainButtonStyle.animation}, fab-pulse 2s infinite`;
  }

  return (
    <div style={getPositionStyles()} className={className}>
      {/* Ações secundárias */}
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => handleActionClick(action)}
          className="absolute transition-all duration-300 ease-out"
          style={{
            ...getSizeStyles(),
            backgroundColor: action.color || backgroundColor,
            color: iconColor,
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: shadow ? "0 2px 8px rgba(0, 0, 0, 0.15)" : "none",
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "scale(1)" : "scale(0)",
            pointerEvents: isOpen ? "auto" : "none",
            zIndex: 999,
            ...getActionPosition(index),
          }}
          onMouseEnter={(e) => {
            if (hoverEffect) {
              e.currentTarget.style.transform = `${e.currentTarget.style.transform} scale(1.1)`;
            }
          }}
          onMouseLeave={(e) => {
            if (hoverEffect) {
              e.currentTarget.style.transform =
                e.currentTarget.style.transform.replace(" scale(1.1)", "");
            }
          }}
          title={action.label}
        >
          {action.icon}
        </button>
      ))}

      {/* Botão principal */}
      <button
        ref={buttonRef}
        onClick={handleMainClick}
        onMouseEnter={() => {
          if (tooltip) setShowTooltip(true);
          if (hoverEffect && buttonRef.current) {
            buttonRef.current.style.transform = `${buttonRef.current.style.transform} scale(1.1)`;
          }
        }}
        onMouseLeave={() => {
          if (tooltip) setShowTooltip(false);
          if (hoverEffect && buttonRef.current) {
            buttonRef.current.style.transform =
              buttonRef.current.style.transform.replace(" scale(1.1)", "");
          }
        }}
        style={mainButtonStyle}
        aria-label={tooltip || "Floating action button"}
      >
        {icon}
      </button>

      {/* Tooltip */}
      {tooltip && showTooltip && (
        <div
          className="absolute bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap pointer-events-none"
          style={{
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: 8,
            zIndex: 1001,
          }}
        >
          {tooltip}
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: "4px solid transparent",
              borderRight: "4px solid transparent",
              borderTop: "4px solid #1f2937",
            }}
          />
        </div>
      )}

      {/* Overlay para fechar quando clica fora */}
      {isOpen && actions.length > 0 && (
        <div
          className="fixed inset-0 bg-transparent"
          style={{ zIndex: 998 }}
          onClick={() => {
            if (controlledIsOpen === undefined) {
              setInternalIsOpen(false);
            }
            onToggle?.(false);
          }}
        />
      )}
    </div>
  );
};

export default FloatingActionButton;
