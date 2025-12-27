/**
 * Serviço de API para autenticação Web3
 * 
 * Este serviço gerencia todas as operações de autenticação com o backend,
 * incluindo geração de nonce, login Web3, refresh de tokens e logout.
 */

import { LUNES_API_CONFIG } from "../config/lunes";

/**
 * Interfaces para tipagem das requisições e respostas
 */
export interface NonceResponse {
  nonce: string;
  message: string;
  timestamp: number;
}

export interface LoginRequest {
  walletAddress: string;
  signature: string;
  message: string;
  timestamp: number;
}

export interface LoginResponse {
  user: {
    id: string;
    walletAddress: string;
    username?: string;
    displayName?: string;
    avatar?: string;
    isVerified: boolean;
    kycStatus: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

export interface VerifyTokenRequest {
  token: string;
}

export interface UserProfile {
  id: string;
  walletAddress: string;
  username?: string;
  displayName?: string;
  avatar?: string;
  isVerified: boolean;
  kycStatus: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Classe para tratamento de erros da API de autenticação
 */
export class AuthApiError extends Error {
  public status: number;
  public code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.code = code;
  }
}

/**
 * Configuração base da API
 */
const API_BASE_URL = LUNES_API_CONFIG.backendUrl;
const AUTH_ENDPOINTS = {
  nonce: "/auth/nonce",
  login: "/auth/login",
  refresh: "/auth/refresh",
  verify: "/auth/verify",
  logout: "/auth/logout",
  profile: "/auth/me",
  generate2FA: "/auth/2fa/generate",
  enable2FA: "/auth/2fa/enable",
  validate2FA: "/auth/2fa/validate",
  disable2FA: "/auth/2fa/disable",
} as const;

/**
 * Função utilitária para fazer requisições HTTP autenticadas
 */
async function fetchAuthApi<T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = false,
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  // Adicionar token de autorização se necessário
  if (requiresAuth) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AuthApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code,
      );
    }

    const jsonData = await response.json();
    
    // Se a resposta tem o formato { success, data, message }, extrair o data
    if (jsonData && typeof jsonData === 'object' && 'data' in jsonData) {
      return jsonData.data as T;
    }
    
    return jsonData as T;
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error;
    }

    // Erro de rede ou parsing
    throw new AuthApiError("Erro de conexão com o servidor", 0, "NETWORK_ERROR");
  }
}

/**
 * Serviço de autenticação Web3
 */
export const authApiService = {
  /**
   * Gera um nonce para autenticação Web3
   */
  async generateNonce(walletAddress: string): Promise<NonceResponse> {
    return fetchAuthApi<NonceResponse>(
      `${AUTH_ENDPOINTS.nonce}/${walletAddress}`,
      {
        method: "GET",
      },
    );
  },

  /**
   * Realiza login Web3 com assinatura
   */
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    return fetchAuthApi<LoginResponse>(AUTH_ENDPOINTS.login, {
      method: "POST",
      body: JSON.stringify(loginData),
    });
  },

  /**
   * Renova o token de acesso usando refresh token
   */
  async refreshToken(refreshData: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return fetchAuthApi<RefreshTokenResponse>(AUTH_ENDPOINTS.refresh, {
      method: "POST",
      body: JSON.stringify(refreshData),
    });
  },

  /**
   * Verifica se um token é válido
   */
  async verifyToken(tokenData: VerifyTokenRequest): Promise<{ valid: boolean }> {
    return fetchAuthApi<{ valid: boolean }>(AUTH_ENDPOINTS.verify, {
      method: "POST",
      body: JSON.stringify(tokenData),
    });
  },

  /**
   * Realiza logout e invalida o token
   */
  async logout(): Promise<void> {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    await fetchAuthApi<void>(
      AUTH_ENDPOINTS.logout,
      {
        method: "POST",
      },
      true, // Requer autenticação
    );
  },

  /**
   * Busca o perfil do usuário autenticado
   */
  async getProfile(): Promise<UserProfile> {
    return fetchAuthApi<UserProfile>(
      AUTH_ENDPOINTS.profile,
      {
        method: "GET",
      },
      true, // Requer autenticação
    );
  },

  /**
   * Gera segredo 2FA
   */
  async generate2FA(): Promise<{ secret: string; otpauth: string }> {
    return fetchAuthApi<{ secret: string; otpauth: string }>(
      AUTH_ENDPOINTS.generate2FA,
      {
        method: "POST",
      },
      true
    );
  },

  /**
   * Ativa 2FA
   */
  async enable2FA(token: string): Promise<void> {
    return fetchAuthApi<void>(
      AUTH_ENDPOINTS.enable2FA,
      {
        method: "POST",
        body: JSON.stringify({ token }),
      },
      true
    );
  },

  /**
   * Valida 2FA
   */
  async validate2FA(token: string): Promise<void> {
    return fetchAuthApi<void>(
      AUTH_ENDPOINTS.validate2FA,
      {
        method: "POST",
        body: JSON.stringify({ token }),
      },
      true
    );
  },

  /**
   * Desativa 2FA
   */
  async disable2FA(token: string): Promise<void> {
    return fetchAuthApi<void>(
      AUTH_ENDPOINTS.disable2FA,
      {
        method: "POST",
        body: JSON.stringify({ token }),
      },
      true
    );
  },

  /**
   * Gerencia tokens no localStorage
   */
  tokenManager: {
    /**
     * Salva tokens no localStorage
     */
    saveTokens(accessToken: string, refreshToken: string): void {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },

    /**
     * Recupera o access token
     */
    getAccessToken(): string | null {
      return localStorage.getItem("accessToken");
    },

    /**
     * Recupera o refresh token
     */
    getRefreshToken(): string | null {
      return localStorage.getItem("refreshToken");
    },

    /**
     * Remove todos os tokens
     */
    clearTokens(): void {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },

    /**
     * Verifica se existe um token válido
     */
    hasValidToken(): boolean {
      const token = this.getAccessToken();
      if (!token) return false;

      try {
        // Decodifica o JWT para verificar expiração
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        return payload.exp > now;
      } catch {
        return false;
      }
    },
  },
};

/**
 * Função para tratamento de erros da API de autenticação
 */
export const handleAuthApiError = (error: unknown): string => {
  if (error instanceof AuthApiError) {
    switch (error.code) {
      case "INVALID_SIGNATURE":
        return "Assinatura inválida. Verifique sua carteira.";
      case "NONCE_EXPIRED":
        return "Nonce expirado. Tente novamente.";
      case "TOKEN_EXPIRED":
        return "Token expirado. Faça login novamente.";
      case "INVALID_TOKEN":
        return "Token inválido. Faça login novamente.";
      case "WALLET_NOT_FOUND":
        return "Carteira não encontrada.";
      case "NETWORK_ERROR":
        return "Erro de conexão. Verifique sua internet.";
      default:
        return error.message || "Erro de autenticação";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Erro desconhecido na autenticação";
};

export default authApiService;