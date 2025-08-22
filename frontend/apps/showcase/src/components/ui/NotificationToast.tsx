import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import type {
  Notification,
  NotificationType,
} from "../../contexts/NotificationContext";

/**
 * Props do componente NotificationToast
 */
interface NotificationToastProps {
  notification: Notification;
  onClose: (id: string) => void;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

/**
 * Configurações de estilo para cada tipo de notificação
 */
const notificationStyles: Record<
  NotificationType,
  {
    bgColor: string;
    borderColor: string;
    textColor: string;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
  }
> = {
  success: {
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    textColor: "text-green-800 dark:text-green-200",
    icon: CheckCircle,
    iconColor: "text-green-500 dark:text-green-400",
  },
  error: {
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    textColor: "text-red-800 dark:text-red-200",
    icon: AlertCircle,
    iconColor: "text-red-500 dark:text-red-400",
  },
  warning: {
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    textColor: "text-yellow-800 dark:text-yellow-200",
    icon: AlertTriangle,
    iconColor: "text-yellow-500 dark:text-yellow-400",
  },
  info: {
    bgColor: "bg-roxo-claro dark:bg-roxo-900/20",
    borderColor: "border-roxo dark:border-roxo-800",
    textColor: "text-roxo dark:text-roxo-200",
    icon: Info,
    iconColor: "text-roxo dark:text-roxo-400",
  },
};

/**
 * Animações para entrada e saída do toast
 */
const toastVariants = {
  initial: { opacity: 0, x: 300, scale: 0.8 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 300, scale: 0.8 },
};

/**
 * Componente individual de notificação toast
 */
export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  position = "top-right",
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  const style = notificationStyles[notification.type];
  const Icon = style.icon;

  // Controla a barra de progresso para notificações com duração
  useEffect(() => {
    if (!notification.duration || notification.duration <= 0) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (notification.duration! / 100);
        if (newProgress <= 0) {
          setIsVisible(false);
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [notification.duration]);

  // Remove a notificação quando não está mais visível
  useEffect(() => {
    if (!isVisible) {
      const timeout = setTimeout(() => {
        onClose(notification.id);
      }, 300); // Aguarda a animação de saída
      return () => clearTimeout(timeout);
    }
  }, [isVisible, notification.id, onClose]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleActionClick = () => {
    if (notification.action?.onClick) {
      notification.action.onClick();
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={toastVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className={`
            relative max-w-sm w-full shadow-lg rounded-lg border pointer-events-auto
            ${style.bgColor} ${style.borderColor}
          `}
          role="alert"
          aria-live="polite"
        >
          {/* Barra de progresso */}
          {notification.duration && notification.duration > 0 && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-roxo to-verde"
                initial={{ width: "100%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
          )}

          <div className="p-4">
            <div className="flex items-start">
              {/* Ícone */}
              <div className="flex-shrink-0">
                <Icon className={`h-5 w-5 ${style.iconColor}`} />
              </div>

              {/* Conteúdo */}
              <div className="ml-3 w-0 flex-1">
                <p className={`text-sm font-medium ${style.textColor}`}>
                  {notification.title}
                </p>
                {notification.message && (
                  <p className={`mt-1 text-sm ${style.textColor} opacity-80`}>
                    {notification.message}
                  </p>
                )}

                {/* Ação personalizada */}
                {notification.action && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={handleActionClick}
                      className={`
                        text-sm font-medium underline hover:no-underline
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-roxo-500
                        ${style.textColor}
                      `}
                    >
                      {notification.action.label}
                    </button>
                  </div>
                )}
              </div>

              {/* Botão de fechar */}
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  type="button"
                  onClick={handleClose}
                  className={`
                    inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2
                    hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
                    ${style.textColor} focus:ring-roxo-500
                  `}
                  aria-label="Fechar notificação"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Props do container de notificações
 */
interface NotificationContainerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  maxVisible?: number;
}

/**
 * Configurações de posicionamento para o container
 */
const positionStyles: Record<string, string> = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-center": "top-4 left-1/2 transform -translate-x-1/2",
  "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
};

/**
 * Container que gerencia múltiplas notificações
 */
export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onClose,
  position = "top-right",
  maxVisible = 5,
}) => {
  // Limita o número de notificações visíveis
  const visibleNotifications = notifications.slice(0, maxVisible);

  return (
    <div
      className={`
        fixed z-50 pointer-events-none
        ${positionStyles[position]}
      `}
      aria-live="polite"
      aria-label="Notificações"
    >
      <div className="flex flex-col space-y-3">
        <AnimatePresence mode="popLayout">
          {visibleNotifications.map((notification) => (
            <NotificationToast
              key={notification.id}
              notification={notification}
              onClose={onClose}
              position={position}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Indicador de notificações ocultas */}
      {notifications.length > maxVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-2 text-center"
        >
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
            +{notifications.length - maxVisible} mais
          </span>
        </motion.div>
      )}
    </div>
  );
};
