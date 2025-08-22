import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ShieldAlert } from "lucide-react";

/**
 * Props para botão de ação
 */
interface ActionButton {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

/**
 * Props para o componente UnauthorizedAccess
 */
interface UnauthorizedAccessProps {
  /** Título da mensagem de erro */
  title?: string;
  /** Mensagem detalhada */
  message?: string;
  /** Ícone customizado */
  icon?: ReactNode;
  /** Botão de ação principal */
  actionButton?: ActionButton;
  /** Botão secundário */
  secondaryButton?: ActionButton;
  /** Mostrar link para contato com suporte */
  showContactSupport?: boolean;
  /** Conteúdo customizado adicional */
  children?: ReactNode;
}

/**
 * Componente para exibir mensagens de acesso não autorizado
 *
 * Funcionalidades:
 * - Mensagens customizáveis
 * - Ícones contextuais
 * - Botões de ação
 * - Link para suporte
 * - Design responsivo
 *
 * @example
 * ```tsx
 * <UnauthorizedAccess
 *   title="Acesso Negado"
 *   message="Você não possui permissão para acessar esta página."
 *   actionButton={{
 *     text: "Voltar ao Dashboard",
 *     href: "/dashboard"
 *   }}
 *   showContactSupport={true}
 * />
 * ```
 */
export const UnauthorizedAccess = ({
  title = "Acesso Negado",
  message = "Você não possui permissão para acessar esta funcionalidade.",
  icon,
  actionButton,
  secondaryButton,
  showContactSupport = false,
  children,
}: UnauthorizedAccessProps) => {
  const defaultIcon = (
    <ShieldAlert className="w-16 h-16 text-red-500 mx-auto" />
  );

  const renderButton = (button: ActionButton, isPrimary = true) => {
    const baseClasses =
      "px-6 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const primaryClasses =
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";
    const secondaryClasses =
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500";

    const buttonClasses = `${baseClasses} ${
      button.variant === "secondary" || !isPrimary
        ? secondaryClasses
        : primaryClasses
    }`;

    if (button.href) {
      return (
        <Link to={button.href} className={buttonClasses}>
          {button.text}
        </Link>
      );
    }

    return (
      <button onClick={button.onClick} className={buttonClasses}>
        {button.text}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Ícone */}
          <div className="mb-6">{icon || defaultIcon}</div>

          {/* Título */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>

          {/* Mensagem */}
          <p className="text-lg text-gray-600 mb-8">{message}</p>

          {/* Conteúdo customizado */}
          {children && <div className="mb-8">{children}</div>}

          {/* Botões de ação */}
          <div className="space-y-4">
            {actionButton && <div>{renderButton(actionButton, true)}</div>}

            {secondaryButton && (
              <div>{renderButton(secondaryButton, false)}</div>
            )}

            {/* Link padrão se nenhum botão for fornecido */}
            {!actionButton && !secondaryButton && (
              <Link
                to="/dashboard"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Voltar ao Dashboard
              </Link>
            )}
          </div>

          {/* Link para suporte */}
          {showContactSupport && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Precisa de ajuda?</p>
              <Link
                to="/support"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Entrar em contato com o suporte
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Componente compacto para uso em modais ou seções menores
 */
export const CompactUnauthorizedAccess = ({
  title = "Acesso Restrito",
  message = "Você não possui permissão para esta ação.",
  actionButton,
}: Pick<UnauthorizedAccessProps, "title" | "message" | "actionButton">) => {
  return (
    <div className="text-center py-8 px-6">
      <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

      <p className="text-gray-600 mb-6">{message}</p>

      {actionButton && (
        <div>
          {actionButton.href ? (
            <Link
              to={actionButton.href}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              {actionButton.text}
            </Link>
          ) : (
            <button
              onClick={actionButton.onClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              {actionButton.text}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
