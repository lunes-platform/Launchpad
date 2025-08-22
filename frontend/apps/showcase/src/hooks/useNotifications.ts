import { useCallback } from "react";
import { useNotifications as useNotificationContext } from "../contexts/NotificationContext";
import type {
  Notification,
  NotificationType,
} from "../contexts/NotificationContext";

/**
 * Opções para criar uma notificação
 */
export interface NotificationOptions {
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Interface do hook useNotifications
 */
export interface UseNotificationsReturn {
  // Estado das notificações
  notifications: Notification[];

  // Métodos básicos
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">,
  ) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;

  // Métodos de conveniência
  showSuccess: (title: string, options?: NotificationOptions) => string;
  showError: (title: string, options?: NotificationOptions) => string;
  showWarning: (title: string, options?: NotificationOptions) => string;
  showInfo: (title: string, options?: NotificationOptions) => string;

  // Métodos específicos para casos de uso comuns
  showApiError: (error: unknown, fallbackMessage?: string) => string;
  showLoadingNotification: (title: string, message?: string) => string;
  showTransactionSuccess: (txHash: string, explorerUrl?: string) => string;
  showTransactionError: (error: unknown) => string;
  showWalletConnectionSuccess: (walletName: string) => string;
  showWalletConnectionError: (error: unknown) => string;

  // Utilitários
  hasNotifications: boolean;
  hasErrorNotifications: boolean;
  getNotificationsByType: (type: NotificationType) => Notification[];
  removeNotificationsByType: (type: NotificationType) => void;
}

/**
 * Hook personalizado para gerenciar notificações
 * Fornece métodos de conveniência e casos de uso específicos para a aplicação
 */
export const useNotifications = (): UseNotificationsReturn => {
  const context = useNotificationContext();

  /**
   * Extrai mensagem de erro de diferentes tipos de erro
   */
  const extractErrorMessage = useCallback((error: unknown): string => {
    if (typeof error === "string") return error;

    if (error instanceof Error) return error.message;

    if (typeof error === "object" && error !== null) {
      // Tenta extrair mensagem de diferentes estruturas de erro
      const errorObj = error as any;

      if (errorObj.message) return errorObj.message;
      if (errorObj.error) return errorObj.error;
      if (errorObj.details) return errorObj.details;
      if (errorObj.reason) return errorObj.reason;
    }

    return "Erro desconhecido";
  }, []);

  /**
   * Métodos de conveniência com opções simplificadas
   */
  const showSuccess = useCallback(
    (title: string, options?: NotificationOptions): string => {
      return context.showSuccess(title, options?.message, {
        duration: options?.duration,
        action: options?.action,
      });
    },
    [context],
  );

  const showError = useCallback(
    (title: string, options?: NotificationOptions): string => {
      return context.showError(title, options?.message, {
        duration: options?.duration,
        action: options?.action,
      });
    },
    [context],
  );

  const showWarning = useCallback(
    (title: string, options?: NotificationOptions): string => {
      return context.showWarning(title, options?.message, {
        duration: options?.duration,
        action: options?.action,
      });
    },
    [context],
  );

  const showInfo = useCallback(
    (title: string, options?: NotificationOptions): string => {
      return context.showInfo(title, options?.message, {
        duration: options?.duration,
        action: options?.action,
      });
    },
    [context],
  );

  /**
   * Métodos específicos para casos de uso da aplicação
   */
  const showApiError = useCallback(
    (
      error: unknown,
      fallbackMessage = "Erro na comunicação com o servidor",
    ): string => {
      const errorMessage = extractErrorMessage(error);
      return showError("Erro na API", {
        message: errorMessage || fallbackMessage,
        duration: 0, // Erros ficam até serem removidos manualmente
      });
    },
    [showError, extractErrorMessage],
  );

  const showLoadingNotification = useCallback(
    (title: string, message = "Processando..."): string => {
      return showInfo(title, {
        message,
        duration: 0, // Loading notifications ficam até serem removidas manualmente
      });
    },
    [showInfo],
  );

  const showTransactionSuccess = useCallback(
    (txHash: string, explorerUrl?: string): string => {
      const action = explorerUrl
        ? {
            label: "Ver no Explorer",
            onClick: () => window.open(explorerUrl, "_blank"),
          }
        : undefined;

      return showSuccess("Transação Confirmada", {
        message: `Hash: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`,
        duration: 8000,
        action,
      });
    },
    [showSuccess],
  );

  const showTransactionError = useCallback(
    (error: unknown): string => {
      const errorMessage = extractErrorMessage(error);
      return showError("Erro na Transação", {
        message: errorMessage,
        duration: 0,
      });
    },
    [showError, extractErrorMessage],
  );

  const showWalletConnectionSuccess = useCallback(
    (walletName: string): string => {
      return showSuccess("Carteira Conectada", {
        message: `${walletName} conectada com sucesso`,
        duration: 3000,
      });
    },
    [showSuccess],
  );

  const showWalletConnectionError = useCallback(
    (error: unknown): string => {
      const errorMessage = extractErrorMessage(error);
      return showError("Erro ao Conectar Carteira", {
        message: errorMessage,
        duration: 0,
      });
    },
    [showError, extractErrorMessage],
  );

  /**
   * Utilitários para trabalhar com notificações
   */
  const hasNotifications = context.notifications.length > 0;

  const hasErrorNotifications = context.notifications.some(
    (notification) => notification.type === "error",
  );

  const getNotificationsByType = useCallback(
    (type: NotificationType): Notification[] => {
      return context.notifications.filter(
        (notification) => notification.type === type,
      );
    },
    [context.notifications],
  );

  const removeNotificationsByType = useCallback(
    (type: NotificationType): void => {
      const notificationsToRemove = getNotificationsByType(type);
      notificationsToRemove.forEach((notification) => {
        context.removeNotification(notification.id);
      });
    },
    [context, getNotificationsByType],
  );

  return {
    // Estado das notificações
    notifications: context.notifications,

    // Métodos básicos
    addNotification: context.addNotification,
    removeNotification: context.removeNotification,
    clearAllNotifications: context.clearAllNotifications,

    // Métodos de conveniência
    showSuccess,
    showError,
    showWarning,
    showInfo,

    // Métodos específicos para casos de uso comuns
    showApiError,
    showLoadingNotification,
    showTransactionSuccess,
    showTransactionError,
    showWalletConnectionSuccess,
    showWalletConnectionError,

    // Utilitários
    hasNotifications,
    hasErrorNotifications,
    getNotificationsByType,
    removeNotificationsByType,
  };
};
