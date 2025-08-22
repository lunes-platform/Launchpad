import React, { useState, useCallback, useEffect } from "react";
import { Shield, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { Modal, Button, Input, Alert } from "@launchpad/shared-ui";
import { useAuth } from "../../contexts/AuthContext";

export type SecurityLevel = "low" | "medium" | "high" | "critical";

export interface ConfirmationData {
  password?: string;
  twoFactorCode?: string;
  timestamp: Date;
}

export interface SecurityConfirmationProps {
  /** Se o modal está aberto */
  isOpen: boolean;
  /** Callback para fechar o modal */
  onClose: () => void;
  /** Callback executado quando a confirmação é bem-sucedida */
  onConfirm: () => void;
  /** Título da operação */
  title: string;
  /** Descrição da operação */
  description: string;
  /** Valor da transação (opcional) */
  amount?: number;
  /** Token da transação (opcional) */
  token?: string;
  /** Nível de segurança requerido */
  securityLevel: SecurityLevel;
  /** Se requer confirmação por senha */
  requirePassword?: boolean;
  /** Se requer confirmação por email/2FA (simulado) */
  require2FA?: boolean;
  /** Tempo de cooldown em segundos antes de permitir a ação */
  cooldownSeconds?: number;
}

/**
 * Componente para confirmação de segurança em operações críticas
 *
 * @example
 * <SecurityConfirmation
 *   isOpen={showConfirmation}
 *   onClose={() => setShowConfirmation(false)}
 *   onConfirm={executeTransaction}
 *   title="Confirmar Investimento"
 *   description="Você está prestes a investir 1000 LUNES no projeto XYZ"
 *   amount={1000}
 *   token="LUNES"
 *   securityLevel="high"
 *   requirePassword
 *   require2FA
 *   cooldownSeconds={5}
 * />
 */
export const SecurityConfirmation: React.FC<SecurityConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  amount,
  token,
  securityLevel,
  requirePassword = false,
  require2FA = false,
  cooldownSeconds = 0,
}) => {
  const { user } = useAuth();
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(cooldownSeconds);
  const [errors, setErrors] = useState<string[]>([]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setTwoFactorCode("");
      setErrors([]);
      setCooldownRemaining(cooldownSeconds);
    }
  }, [isOpen, cooldownSeconds]);

  // Cooldown timer
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setTimeout(() => {
        setCooldownRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownRemaining]);

  const getSecurityLevelConfig = () => {
    switch (securityLevel) {
      case "low":
        return {
          icon: CheckCircle,
          color: "text-green-500",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "medium":
        return {
          icon: Clock,
          color: "text-yellow-500",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        };
      case "high":
        return {
          icon: AlertTriangle,
          color: "text-orange-500",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
        };
      case "critical":
        return {
          icon: Shield,
          color: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
    }
  };

  const validateInputs = (): boolean => {
    const newErrors: string[] = [];

    if (requirePassword && !password) {
      newErrors.push("Senha é obrigatória");
    }

    if (require2FA && !twoFactorCode) {
      newErrors.push("Código de autenticação é obrigatório");
    }

    if (require2FA && twoFactorCode && twoFactorCode.length !== 6) {
      newErrors.push("Código de autenticação deve ter 6 dígitos");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleConfirm = useCallback(async () => {
    if (!validateInputs()) {
      return;
    }

    if (cooldownRemaining > 0) {
      return;
    }

    setIsConfirming(true);

    try {
      // Simular validação de senha
      if (requirePassword) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // TODO: Implementar validação real de senha
        if (password !== "demo123") {
          setErrors(["Senha incorreta"]);
          return;
        }
      }

      // Simular validação de 2FA
      if (require2FA) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // TODO: Implementar validação real de 2FA
        if (twoFactorCode !== "123456") {
          setErrors(["Código de autenticação inválido"]);
          return;
        }
      }

      // Executar a ação confirmada
      onConfirm();
      onClose();
    } catch (error) {
      setErrors([
        `Erro na confirmação: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      ]);
    } finally {
      setIsConfirming(false);
    }
  }, [
    password,
    twoFactorCode,
    requirePassword,
    require2FA,
    cooldownRemaining,
    onConfirm,
    onClose,
  ]);

  const config = getSecurityLevelConfig();
  const IconComponent = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        {/* Header */}
        <div
          className={`flex items-center gap-3 p-4 rounded-lg ${config.bgColor} ${config.borderColor} border mb-6`}
        >
          <IconComponent className={`w-6 h-6 ${config.color}`} />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 capitalize">
              Nível de segurança: {securityLevel}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-700 mb-4">{description}</p>

          {amount && token && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Valor:</span>
                <span className="font-semibold text-gray-900">
                  {amount.toLocaleString()} {token}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Security Inputs */}
        <div className="space-y-4 mb-6">
          {requirePassword && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirme sua senha
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                disabled={isConfirming}
              />
            </div>
          )}

          {require2FA && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de autenticação (2FA)
              </label>
              <Input
                type="text"
                value={twoFactorCode}
                onChange={(e) =>
                  setTwoFactorCode(
                    e.target.value.replace(/\D/g, "").slice(0, 6),
                  )
                }
                placeholder="000000"
                maxLength={6}
                disabled={isConfirming}
              />
              <p className="text-xs text-gray-500 mt-1">
                Digite o código de 6 dígitos do seu aplicativo de autenticação
              </p>
            </div>
          )}
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-6">
            {errors.map((error, index) => (
              <Alert key={index} variant="error" className="mb-2">
                {error}
              </Alert>
            ))}
          </div>
        )}

        {/* Cooldown Warning */}
        {cooldownRemaining > 0 && (
          <Alert variant="warning" className="mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                Aguarde {cooldownRemaining} segundos antes de confirmar a
                operação
              </span>
            </div>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isConfirming}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isConfirming || cooldownRemaining > 0}
            loading={isConfirming}
          >
            {cooldownRemaining > 0
              ? `Aguarde ${cooldownRemaining}s`
              : isConfirming
                ? "Confirmando..."
                : "Confirmar"}
          </Button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-3 bg-grafite-50 dark:bg-grafite-800 border border-grafite-200 dark:border-grafite-700 rounded-lg">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-roxo mt-0.5 flex-shrink-0" />
            <div className="text-xs text-grafite-700 dark:text-grafite-300">
              <p className="font-medium mb-1">Aviso de Segurança</p>
              <p>
                Esta operação é irreversível. Verifique todos os dados antes de
                confirmar. Nunca compartilhe suas credenciais com terceiros.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SecurityConfirmation;
