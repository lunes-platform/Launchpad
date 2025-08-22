import React, { useState, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { UserRole, Permission } from "../../types/auth";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export type TransactionType =
  | "investment"
  | "staking"
  | "unstaking"
  | "claim"
  | "withdrawal";

export interface TransactionValidatorProps {
  /** Tipo de transação a ser validada */
  transactionType:
    | "investment"
    | "staking"
    | "unstaking"
    | "claim"
    | "withdrawal";
  /** Valor da transação */
  amount: number;
  /** Token da transação (LUNES, LUSDT, etc.) */
  token: string;
  /** ID do projeto (para investimentos) */
  projectId?: string;
  /** Fase do projeto (para investimentos) */
  projectPhase?: string;
  /** Callback executado quando a validação é bem-sucedida */
  onValidationSuccess: (result: ValidationResult) => void;
  /** Callback executado quando a validação falha */
  onValidationError: (result: ValidationResult) => void;
  /** Filhos a serem renderizados (geralmente um botão de ação) */
  children: (
    validate: () => Promise<void>,
    isValidating: boolean,
  ) => React.ReactNode;
}

/**
 * Componente para validar transações críticas antes da execução
 *
 * @example
 * <TransactionValidator
 *   transactionType="investment"
 *   amount={1000}
 *   token="LUNES"
 *   projectId="project-123"
 *   projectPhase="presale"
 *   onValidationSuccess={(result) => executeInvestment()}
 *   onValidationError={(result) => showErrors(result.errors)}
 * >
 *   {(validate, isValidating) => (
 *     <button onClick={validate} disabled={isValidating}>
 *       {isValidating ? 'Validando...' : 'Investir'}
 *     </button>
 *   )}
 * </TransactionValidator>
 */
export const TransactionValidator: React.FC<TransactionValidatorProps> = ({
  transactionType,
  amount,
  token,
  projectId,
  projectPhase,
  onValidationSuccess,
  onValidationError,
  children,
}) => {
  const { user, hasPermission } = useAuth();
  const [isValidating, setIsValidating] = useState(false);

  const validateTransaction = useCallback(async (): Promise<void> => {
    if (!user) {
      onValidationError({
        isValid: false,
        errors: ["Usuário não autenticado"],
        warnings: [],
      });
      return;
    }

    setIsValidating(true);

    try {
      const result = await performValidation();

      if (result.isValid) {
        onValidationSuccess(result);
      } else {
        onValidationError(result);
      }
    } catch (error) {
      onValidationError({
        isValid: false,
        errors: [
          `Erro na validação: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        ],
        warnings: [],
      });
    } finally {
      setIsValidating(false);
    }
  }, [
    user,
    transactionType,
    amount,
    token,
    projectId,
    projectPhase,
    onValidationSuccess,
    onValidationError,
  ]);

  const performValidation = async (): Promise<ValidationResult> => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validação de usuário banido
    if (user!.status === "BANNED") {
      errors.push("Usuário banido não pode realizar transações");
      return { isValid: false, errors, warnings };
    }

    // Validações específicas por tipo de transação
    switch (transactionType) {
      case "investment":
        await validateInvestment(errors, warnings);
        break;
      case "staking":
        await validateStaking(errors, warnings);
        break;
      case "unstaking":
        await validateUnstaking(errors, warnings);
        break;
      case "claim":
        await validateClaim(errors, warnings);
        break;
      case "withdrawal":
        await validateWithdrawal(errors, warnings);
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  };

  const validateInvestment = async (
    errors: string[],
    warnings: string[],
  ): Promise<void> => {
    // Verificar permissão para investir
    if (!hasPermission(Permission.INVEST_IN_PROJECTS)) {
      errors.push("Usuário não tem permissão para investir em projetos");
      return;
    }

    // Verificar valor mínimo
    if (amount <= 0) {
      errors.push("Valor de investimento deve ser maior que zero");
    }

    // Verificar limites do usuário
    const userLimits = user!.limits;
    if (amount > userLimits.maxInvestmentPerProject) {
      errors.push(
        `Valor excede o limite máximo por projeto (${userLimits.maxInvestmentPerProject} ${token})`,
      );
    }

    if (amount > userLimits.maxDailyInvestment) {
      errors.push(
        `Valor excede o limite diário (${userLimits.maxDailyInvestment} ${token})`,
      );
    }

    // Verificar se a fase requer KYC
    if (projectPhase === "presale" || projectPhase === "whitelist") {
      if (user!.kycStatus !== "APPROVED") {
        errors.push("Esta fase requer verificação KYC aprovada");
      }
    }

    // Verificar se é investidor VIP para fases exclusivas
    if (
      projectPhase === "vip_presale" &&
      user!.role !== UserRole.INVESTOR_VIP
    ) {
      errors.push("Esta fase é exclusiva para investidores VIP");
    }

    // Avisos para investidores padrão
    if (user!.role === UserRole.INVESTOR_STANDARD && amount > 1000) {
      warnings.push(
        "Investimento alto para usuário padrão. Considere verificar seu KYC para maiores limites.",
      );
    }
  };

  const validateStaking = async (
    errors: string[],
    warnings: string[],
  ): Promise<void> => {
    // Verificar permissão para staking
    if (!hasPermission(Permission.STAKE_TOKENS)) {
      errors.push("Usuário não tem permissão para fazer staking");
      return;
    }

    // Verificar valor mínimo
    if (amount <= 0) {
      errors.push("Valor de staking deve ser maior que zero");
    }

    // Verificar limite máximo de staking
    const userLimits = user!.limits;
    if (amount > userLimits.maxStakingAmount) {
      errors.push(
        `Valor excede o limite máximo de staking (${userLimits.maxStakingAmount} ${token})`,
      );
    }

    // Verificar se o token é válido para staking (apenas LUNES)
    if (token !== "LUNES") {
      errors.push("Apenas tokens LUNES podem ser utilizados para staking");
    }

    // Aviso sobre período de lock
    warnings.push("Tokens em staking ficam bloqueados por um período mínimo");
  };

  const validateUnstaking = async (
    errors: string[],
    warnings: string[],
  ): Promise<void> => {
    // Verificar valor mínimo
    if (amount <= 0) {
      errors.push("Valor de unstaking deve ser maior que zero");
    }

    // TODO: Verificar se o usuário tem tokens suficientes em staking
    // TODO: Verificar período de lock

    warnings.push("Unstaking pode levar alguns blocos para ser processado");
  };

  const validateClaim = async (
    errors: string[],
    warnings: string[],
  ): Promise<void> => {
    // Verificar permissão para claim
    if (
      !hasPermission(Permission.CLAIM_TOKENS) &&
      !hasPermission(Permission.CLAIM_REWARDS)
    ) {
      errors.push("Usuário não tem permissão para fazer claims");
      return;
    }

    // TODO: Verificar se há tokens/recompensas disponíveis para claim
    // TODO: Verificar cronograma de vesting
  };

  const validateWithdrawal = async (
    errors: string[],
    warnings: string[],
  ): Promise<void> => {
    // Verificar valor mínimo
    if (amount <= 0) {
      errors.push("Valor de saque deve ser maior que zero");
    }

    // TODO: Verificar saldo disponível
    // TODO: Verificar limites de saque

    warnings.push(
      "Saques podem levar tempo para serem processados na blockchain",
    );
  };

  return <>{children(validateTransaction, isValidating)}</>;
};

export default TransactionValidator;
