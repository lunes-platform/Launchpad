import React, { useState, useRef, useCallback } from "react";

export interface RippleEffect {
  x: number;
  y: number;
  size: number;
  id: number;
}

export interface ButtonRippleProps {
  /** Filhos do botão */
  children: React.ReactNode;
  /** Cor do efeito ripple */
  rippleColor?: string;
  /** Duração da animação em milissegundos */
  duration?: number;
  /** Se o efeito deve ser habilitado */
  disabled?: boolean;
  /** Classe CSS adicional */
  className?: string;
  /** Props adicionais do botão */
  [key: string]: any;
}

/**
 * Componente de botão com efeito ripple/ondulação
 *
 * @example
 * <ButtonRipple rippleColor="rgba(255, 255, 255, 0.3)" duration={600}>
 *   Clique aqui
 * </ButtonRipple>
 */
export const ButtonRipple: React.FC<ButtonRippleProps> = ({
  children,
  rippleColor = "rgba(255, 255, 255, 0.3)",
  duration = 600,
  disabled = false,
  className = "",
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const nextRippleId = useRef(0);

  const createRipple = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || !buttonRef.current) return;

      const button = buttonRef.current;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const newRipple: RippleEffect = {
        x,
        y,
        size,
        id: nextRippleId.current++,
      };

      setRipples((prev) => [...prev, newRipple]);

      // Injetar keyframes CSS se ainda não existirem
      const keyframeId = `ripple-keyframes-${duration}`;
      if (!document.getElementById(keyframeId)) {
        const style = document.createElement("style");
        style.id = keyframeId;
        style.textContent = `
        @keyframes ripple-animation-${duration} {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
        document.head.appendChild(style);
      }

      // Remove o ripple após a animação
      setTimeout(() => {
        setRipples((prev) =>
          prev.filter((ripple) => ripple.id !== newRipple.id),
        );
      }, duration);
    },
    [disabled, duration],
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(event);
      if (onClick) {
        onClick(event);
      }
    },
    [createRipple, onClick],
  );

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
      style={{
        ...props.style,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {children}

      {/* Container dos ripples */}
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
        }}
      >
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: rippleColor,
              transform: "scale(0)",
              animation: `ripple-animation-${duration} ${duration}ms ease-out`,
              pointerEvents: "none",
            }}
          />
        ))}
      </span>
    </button>
  );
};

export default ButtonRipple;
