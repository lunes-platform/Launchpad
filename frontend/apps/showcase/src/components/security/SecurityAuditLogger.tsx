import React, { useCallback, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../hooks/useNotifications";
import api from "../../services/api";
import type { SecurityAuditEvent } from "../../types";

export interface SecurityAuditLoggerProps {
  /** Se deve fazer log automático de eventos de autenticação */
  logAuthEvents?: boolean;
  /** Se deve fazer log automático de transações */
  logTransactions?: boolean;
  /** Se deve enviar alertas para eventos críticos */
  sendCriticalAlerts?: boolean;
  /** Callback personalizado para processar eventos */
  onAuditEvent?: (event: SecurityAuditEvent) => void;
}

/**
 * Hook para logging de auditoria de segurança
 */
export const useSecurityAuditLogger = () => {
  const { user } = useAuth();
  const { showError, showWarning } = useNotifications();

  const generateEventId = (): string => {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const getClientInfo = () => {
    return {
      ipAddress: "192.168.1.100", // Simulado - em produção viria do backend
      userAgent: navigator.userAgent,
    };
  };

  const logSecurityEvent = useCallback(
    (
      eventType: SecurityAuditEvent["eventType"],
      description: string,
      severity: SecurityAuditEvent["severity"] = "low",
      success: boolean = true,
      metadata?: Record<string, any>,
      errorMessage?: string,
    ): SecurityAuditEvent => {
      const clientInfo = getClientInfo();

      const event: SecurityAuditEvent = {
        id: generateEventId(),
        timestamp: new Date(),
        eventType,
        severity,
        userId: user?.id || "anonymous",
        userRole: user?.role || "unknown",
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent,
        description,
        metadata,
        success,
        errorMessage,
      };

      // Log no console para desenvolvimento
      console.log("[Security Audit]", event);

      // Enviar para backend (simulado)
      sendAuditEventToBackend(event);

      // Mostrar alertas para eventos críticos
      if (severity === "critical" && !success) {
        showError("Violação de Segurança Detectada", {
          message: description,
          duration: 0, // Manter até ser removido manualmente
        });
      } else if (severity === "high" && !success) {
        showWarning("Alerta de Segurança", {
          message: description,
          duration: 10000,
        });
      }

      return event;
    },
    [user, showError, showWarning],
  );

  const sendAuditEventToBackend = async (
    event: SecurityAuditEvent,
  ): Promise<void> => {
    try {
      await api.security.logEvent(event);
      console.log("[Security Audit] Event sent to backend:", event.id);
    } catch (error) {
      console.error("[Security Audit] Failed to send event to backend:", error);
    }
  };

  // Métodos específicos para diferentes tipos de eventos
  const logLoginAttempt = useCallback(
    (success: boolean, errorMessage?: string) => {
      return logSecurityEvent(
        "login",
        success ? "Login realizado com sucesso" : "Tentativa de login falhada",
        success ? "low" : "medium",
        success,
        { loginMethod: "wallet" },
        errorMessage,
      );
    },
    [logSecurityEvent],
  );

  const logLogout = useCallback(() => {
    return logSecurityEvent("logout", "Logout realizado", "low", true);
  }, [logSecurityEvent]);

  const logTransaction = useCallback(
    (
      transactionType: string,
      amount: number,
      token: string,
      success: boolean,
      txHash?: string,
      errorMessage?: string,
    ) => {
      return logSecurityEvent(
        "transaction",
        `Transação ${transactionType}: ${amount} ${token}`,
        amount > 10000 ? "high" : "medium",
        success,
        {
          transactionType,
          amount,
          token,
          txHash,
        },
        errorMessage,
      );
    },
    [logSecurityEvent],
  );

  const logPermissionChange = useCallback(
    (
      targetUserId: string,
      oldPermissions: string[],
      newPermissions: string[],
      success: boolean,
    ) => {
      return logSecurityEvent(
        "permission_change",
        `Permissões alteradas para usuário ${targetUserId}`,
        "high",
        success,
        {
          targetUserId,
          oldPermissions,
          newPermissions,
        },
      );
    },
    [logSecurityEvent],
  );

  const logSecurityViolation = useCallback(
    (
      violationType: string,
      details: string,
      metadata?: Record<string, any>,
    ) => {
      return logSecurityEvent(
        "security_violation",
        `Violação de segurança: ${violationType} - ${details}`,
        "critical",
        false,
        {
          violationType,
          ...metadata,
        },
      );
    },
    [logSecurityEvent],
  );

  const logKycUpdate = useCallback(
    (oldStatus: string, newStatus: string, success: boolean) => {
      return logSecurityEvent(
        "kyc_update",
        `Status KYC alterado de ${oldStatus} para ${newStatus}`,
        "medium",
        success,
        {
          oldStatus,
          newStatus,
        },
      );
    },
    [logSecurityEvent],
  );

  return {
    logSecurityEvent,
    logLoginAttempt,
    logLogout,
    logTransaction,
    logPermissionChange,
    logSecurityViolation,
    logKycUpdate,
  };
};

/**
 * Componente para logging automático de eventos de segurança
 */
export const SecurityAuditLogger: React.FC<SecurityAuditLoggerProps> = ({
  logAuthEvents = true,
  logTransactions: _logTransactions = true,
  sendCriticalAlerts: _sendCriticalAlerts = true,
  onAuditEvent,
}) => {
  const { user } = useAuth();
  const auditLogger = useSecurityAuditLogger();

  // Log de mudanças no estado de autenticação
  useEffect(() => {
    if (!logAuthEvents) return;

    if (user) {
      const event = auditLogger.logLoginAttempt(true);
      onAuditEvent?.(event);
    }
  }, [user, logAuthEvents, auditLogger, onAuditEvent]);

  // Interceptar eventos globais de segurança
  useEffect(() => {
    const handleSecurityEvent = (event: CustomEvent<SecurityAuditEvent>) => {
      console.log("[Security Audit] Global security event:", event.detail);
      onAuditEvent?.(event.detail);
    };

    // Escutar eventos customizados de segurança
    window.addEventListener(
      "security-audit-event",
      handleSecurityEvent as EventListener,
    );

    return () => {
      window.removeEventListener(
        "security-audit-event",
        handleSecurityEvent as EventListener,
      );
    };
  }, [onAuditEvent]);

  // Detectar tentativas de manipulação do DOM (básico)
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          // Detectar scripts injetados suspeitos
          const addedNodes = Array.from(mutation.addedNodes);
          const suspiciousScripts = addedNodes.filter(
            (node) =>
              (node.nodeName === "SCRIPT" &&
                node.textContent?.includes("eval")) ||
              node.textContent?.includes("document.cookie"),
          );

          if (suspiciousScripts.length > 0) {
            auditLogger.logSecurityViolation(
              "DOM_MANIPULATION",
              "Script suspeito detectado no DOM",
              {
                suspiciousScripts: suspiciousScripts.length,
                location: window.location.href,
              },
            );
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [auditLogger]);

  // Detectar tentativas de acesso a localStorage/sessionStorage
  useEffect(() => {
    const originalSetItem = localStorage.setItem;
    const originalGetItem = localStorage.getItem;

    localStorage.setItem = function (key: string, value: string) {
      if (
        key.includes("token") ||
        key.includes("auth") ||
        key.includes("session")
      ) {
        auditLogger.logSecurityEvent(
          "security_violation",
          `Tentativa de acesso a dados sensíveis no localStorage: ${key}`,
          "medium",
          true,
          { key, action: "setItem" },
        );
      }
      return originalSetItem.call(this, key, value);
    };

    localStorage.getItem = function (key: string) {
      if (
        key.includes("token") ||
        key.includes("auth") ||
        key.includes("session")
      ) {
        auditLogger.logSecurityEvent(
          "security_violation",
          `Tentativa de leitura de dados sensíveis no localStorage: ${key}`,
          "medium",
          true,
          { key, action: "getItem" },
        );
      }
      return originalGetItem.call(this, key);
    };

    return () => {
      localStorage.setItem = originalSetItem;
      localStorage.getItem = originalGetItem;
    };
  }, [auditLogger]);

  // Este componente não renderiza nada visualmente
  return null;
};

export default SecurityAuditLogger;
