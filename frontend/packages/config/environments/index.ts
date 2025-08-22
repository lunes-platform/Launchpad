import { devConfig } from "./dev";
import { stagingConfig } from "./staging";
import { prodConfig } from "./prod";
import type { Environment, EnvironmentConfig } from "./types";

/**
 * Mapa de configurações por ambiente
 */
const configs: Record<Environment, EnvironmentConfig> = {
  dev: devConfig,
  staging: stagingConfig,
  prod: prodConfig,
};

/**
 * Obtém a configuração do ambiente atual
 * Prioridade: VITE_ENVIRONMENT > NODE_ENV > 'dev'
 */
export function getCurrentEnvironment(): Environment {
  // Verifica variável de ambiente do Vite
  const viteEnv = (import.meta as any).env?.VITE_ENVIRONMENT as Environment;

  // Verifica NODE_ENV (disponível em build time) - usando globalThis para evitar erros de tipo
  const nodeEnv = (globalThis as any).process?.env?.NODE_ENV;

  if (viteEnv && ["dev", "staging", "prod"].includes(viteEnv)) {
    return viteEnv;
  }

  if (nodeEnv === "production") {
    return "prod";
  }

  if (nodeEnv === "test") {
    return "staging";
  }

  return "dev";
}

/**
 * Obtém a configuração para o ambiente especificado
 */
export function getEnvironmentConfig(env?: Environment): EnvironmentConfig {
  const environment = env || getCurrentEnvironment();
  return configs[environment];
}

/**
 * Configuração atual baseada no ambiente
 */
export const currentConfig = getEnvironmentConfig();

/**
 * Re-exporta tipos e configurações
 */
export * from "./types";
export { devConfig, stagingConfig, prodConfig };

/**
 * Utilitários para verificação de ambiente
 */
export const isDevelopment = () => getCurrentEnvironment() === "dev";
export const isStaging = () => getCurrentEnvironment() === "staging";
export const isProduction = () => getCurrentEnvironment() === "prod";

/**
 * Verifica se estamos em um ambiente de teste
 */
export const isTestEnvironment = () => {
  return (
    (globalThis as any).process?.env?.NODE_ENV === "test" ||
    getCurrentEnvironment() === "staging"
  );
};

/**
 * Verifica se as ferramentas de desenvolvimento devem estar habilitadas
 */
export const shouldEnableDevTools = () => {
  const config = getCurrentEnvironment();
  return (
    config === "dev" ||
    (config === "staging" &&
      (import.meta as any).env?.VITE_ENABLE_DEV_TOOLS === "true")
  );
};
