/**
 * Endereços dos contratos inteligentes da Rede Lunes
 */
export const CONTRACTS = {
  /**
   * Contrato do Launchpad Completo
   * Contém a lógica de Staking (Launchpool), Vendas e Raffle
   */
  LAUNCHPAD: import.meta.env.VITE_CONTRACT_LAUNCHPAD || "5F7...PLACEHOLDER...ADDRESS",

  /**
   * Token LUSDT (se necessário para interações diretas)
   */
  LUSDT: import.meta.env.VITE_CONTRACT_LUSDT || "5F7...PLACEHOLDER...LUSDT",
};
