import type { ReactNode } from "react";

/**
 * Props para o componente LoadingSpinner
 */
interface LoadingSpinnerProps {
  /** Mensagem a ser exibida junto com o spinner */
  message?: string;
  /** Tamanho do spinner */
  size?: "sm" | "md" | "lg";
  /** Cor do spinner */
  variant?: "primary" | "secondary" | "white";
  /** Conteúdo customizado */
  children?: ReactNode;
}

/**
 * Componente de loading spinner reutilizável
 *
 * @example
 * ```tsx
 * <LoadingSpinner message="Carregando dados..." size="lg" />
 * ```
 */
export const LoadingSpinner = ({
  message = "Carregando...",
  size = "md",
  variant = "primary",
  children,
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const colorClasses = {
    primary: "text-blue-600",
    secondary: "text-gray-600",
    white: "text-white",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div
          className={`animate-spin rounded-full border-2 border-gray-200 border-t-current ${
            sizeClasses[size]
          } ${colorClasses[variant]}`}
        />
      </div>

      {message && (
        <p className="text-sm text-gray-600 text-center max-w-xs">{message}</p>
      )}

      {children && <div className="text-center">{children}</div>}
    </div>
  );
};

/**
 * Componente de loading para tela inteira
 */
export const FullScreenLoader = ({ message }: { message?: string }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <LoadingSpinner message={message} size="lg" />
    </div>
  );
};

/**
 * Componente de loading inline para botões
 */
export const ButtonSpinner = ({ size = "sm" }: { size?: "sm" | "md" }) => {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-white border-t-transparent ${
        size === "sm" ? "w-4 h-4" : "w-5 h-5"
      }`}
    />
  );
};
