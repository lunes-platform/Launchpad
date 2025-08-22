/**
 * Componentes de Segurança
 *
 * Este módulo contém todos os componentes relacionados à segurança da aplicação,
 * incluindo validação de transações, confirmação de operações críticas e auditoria.
 */

export { default as TransactionValidator } from "./TransactionValidator";
export type {
  TransactionValidatorProps,
  TransactionType,
  ValidationResult,
} from "./TransactionValidator";

export { default as SecurityConfirmation } from "./SecurityConfirmation";
export type {
  SecurityConfirmationProps,
  SecurityLevel,
  ConfirmationData,
} from "./SecurityConfirmation";

export {
  default as SecurityAuditLogger,
  useSecurityAuditLogger,
} from "./SecurityAuditLogger";
export type {
  SecurityAuditEvent,
  SecurityAuditLoggerProps,
} from "./SecurityAuditLogger";
