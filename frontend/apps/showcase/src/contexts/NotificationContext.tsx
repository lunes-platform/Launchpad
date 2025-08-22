import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import type { ReactNode } from "react";

/**
 * Tipos de notificação disponíveis
 */
export type NotificationType = "success" | "error" | "warning" | "info";

/**
 * Interface para uma notificação
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number; // em milissegundos, 0 = permanente
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: number;
}

/**
 * Interface para o estado das notificações
 */
interface NotificationState {
  notifications: Notification[];
}

/**
 * Ações disponíveis para o reducer
 */
type NotificationAction =
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "CLEAR_ALL_NOTIFICATIONS" };

/**
 * Interface para o contexto de notificações
 */
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">,
  ) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  showSuccess: (
    title: string,
    message?: string,
    options?: Partial<Notification>,
  ) => string;
  showError: (
    title: string,
    message?: string,
    options?: Partial<Notification>,
  ) => string;
  showWarning: (
    title: string,
    message?: string,
    options?: Partial<Notification>,
  ) => string;
  showInfo: (
    title: string,
    message?: string,
    options?: Partial<Notification>,
  ) => string;
}

/**
 * Estado inicial das notificações
 */
const initialState: NotificationState = {
  notifications: [],
};

/**
 * Reducer para gerenciar o estado das notificações
 */
const notificationReducer = (
  state: NotificationState,
  action: NotificationAction,
): NotificationState => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload,
        ),
      };
    case "CLEAR_ALL_NOTIFICATIONS":
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
};

/**
 * Contexto de notificações
 */
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

/**
 * Props do provider de notificações
 */
interface NotificationProviderProps {
  children: ReactNode;
  defaultDuration?: number; // duração padrão em milissegundos
  maxNotifications?: number; // número máximo de notificações simultâneas
}

/**
 * Provider de notificações que gerencia o estado global das notificações
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  defaultDuration = 5000, // 5 segundos por padrão
  maxNotifications = 5,
}) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  /**
   * Gera um ID único para a notificação
   */
  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  /**
   * Adiciona uma nova notificação
   */
  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "createdAt">): string => {
      const id = generateId();
      const newNotification: Notification = {
        ...notification,
        id,
        createdAt: Date.now(),
        duration: notification.duration ?? defaultDuration,
      };

      dispatch({ type: "ADD_NOTIFICATION", payload: newNotification });

      // Remove notificações antigas se exceder o limite
      if (state.notifications.length >= maxNotifications) {
        const oldestNotification = state.notifications[0];
        if (oldestNotification) {
          setTimeout(() => {
            dispatch({
              type: "REMOVE_NOTIFICATION",
              payload: oldestNotification.id,
            });
          }, 100);
        }
      }

      // Auto-remove a notificação após a duração especificada
      if (newNotification.duration && newNotification.duration > 0) {
        setTimeout(() => {
          dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
        }, newNotification.duration);
      }

      return id;
    },
    [generateId, defaultDuration, state.notifications.length, maxNotifications],
  );

  /**
   * Remove uma notificação específica
   */
  const removeNotification = useCallback((id: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
  }, []);

  /**
   * Remove todas as notificações
   */
  const clearAllNotifications = useCallback(() => {
    dispatch({ type: "CLEAR_ALL_NOTIFICATIONS" });
  }, []);

  /**
   * Métodos de conveniência para diferentes tipos de notificação
   */
  const showSuccess = useCallback(
    (
      title: string,
      message?: string,
      options?: Partial<Notification>,
    ): string => {
      return addNotification({
        type: "success",
        title,
        message,
        ...options,
      });
    },
    [addNotification],
  );

  const showError = useCallback(
    (
      title: string,
      message?: string,
      options?: Partial<Notification>,
    ): string => {
      return addNotification({
        type: "error",
        title,
        message,
        duration: 0, // Erros ficam até serem removidos manualmente
        ...options,
      });
    },
    [addNotification],
  );

  const showWarning = useCallback(
    (
      title: string,
      message?: string,
      options?: Partial<Notification>,
    ): string => {
      return addNotification({
        type: "warning",
        title,
        message,
        duration: 8000, // Warnings ficam um pouco mais tempo
        ...options,
      });
    },
    [addNotification],
  );

  const showInfo = useCallback(
    (
      title: string,
      message?: string,
      options?: Partial<Notification>,
    ): string => {
      return addNotification({
        type: "info",
        title,
        message,
        ...options,
      });
    },
    [addNotification],
  );

  const contextValue: NotificationContextType = {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Hook para usar o contexto de notificações
 * @throws {Error} Se usado fora do NotificationProvider
 */
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error(
      "useNotifications deve ser usado dentro de um NotificationProvider",
    );
  }

  return context;
};
