import { signatureVerify, cryptoWaitReady } from '@polkadot/util-crypto';
import { u8aToHex, hexToU8a, stringToU8a } from '@polkadot/util';
import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { authenticator } from 'otplib';
import { prisma } from '../../shared/database';
import { redisService } from '../../shared/redis';
import { Logger } from '../../shared/logger';
import { envConfig } from '../../config/env.config';

export interface LoginResult {
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

export interface TokenPayload {
  userId: string;
  walletAddress: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
}

export class AuthService {
  private static instance: AuthService;
  private blacklistedTokens = new Set<string>();
  private cryptoReady = false;

  // Configurações JWT
  private readonly JWT_SECRET = envConfig.JWT_SECRET;
  private readonly JWT_EXPIRES_IN = envConfig.JWT_EXPIRES_IN;
  private readonly JWT_REFRESH_EXPIRES_IN = envConfig.JWT_REFRESH_EXPIRES_IN;

  private constructor() {
    this.initializeCrypto();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Inicializa as funções criptográficas do Polkadot
   */
  private async initializeCrypto(): Promise<void> {
    try {
      await cryptoWaitReady();
      this.cryptoReady = true;
      Logger.info('Polkadot crypto inicializado com sucesso');
    } catch (error) {
      Logger.error('Erro ao inicializar Polkadot crypto:', error);
    }
  }

  // Gerar nonce para assinatura
  async generateNonce(walletAddress: string): Promise<string> {
    const nonce = crypto.randomBytes(32).toString('hex');
    const key = `nonce:${walletAddress.toLowerCase()}`;
    
    // Armazenar nonce no Redis com TTL de 10 minutos
    await redisService.set(key, nonce, 600);
    
    Logger.auth('Nonce gerado', { walletAddress, nonce: nonce.substring(0, 8) + '...' });
    
    return nonce;
  }

  // Verificar assinatura Web3 (Polkadot/Substrate)
  private async verifySignature(
    walletAddress: string,
    signature: string,
    message: string
  ): Promise<boolean> {
    try {
      // Aguarda a inicialização das funções crypto se necessário
      if (!this.cryptoReady) {
        await this.initializeCrypto();
      }

      // Converte a mensagem para bytes
      const messageBytes = stringToU8a(message);
      
      // Converte a assinatura de hex para bytes
      const signatureBytes = hexToU8a(signature);
      
      // Verifica a assinatura
      const result = signatureVerify(messageBytes, signatureBytes, walletAddress);
      
      Logger.auth('Verificação de assinatura', {
        walletAddress,
        messageLength: message.length,
        signatureLength: signature.length,
        isValid: result.isValid,
      });
      
      return result.isValid;
    } catch (error) {
      Logger.error('Erro ao verificar assinatura Web3 (Polkadot):', error);
      return false;
    }
  }

  // Validar nonce
  private async validateNonce(walletAddress: string, message: string): Promise<boolean> {
    try {
      const key = `nonce:${walletAddress.toLowerCase()}`;
      const storedNonce = await redisService.get<string>(key);
      
      if (!storedNonce) {
        Logger.auth('Nonce não encontrado', { walletAddress });
        return false;
      }
      
      // Verificar se o nonce está na mensagem
      const nonceInMessage = message.includes(storedNonce);
      
      if (nonceInMessage) {
        // Remover nonce usado
        await redisService.del(key);
        Logger.auth('Nonce validado e removido', { walletAddress });
      }
      
      return nonceInMessage;
    } catch (error) {
      Logger.error('Erro ao validar nonce', error);
      return false;
    }
  }

  // Login com Web3
  async login(
    walletAddress: string,
    signature: string,
    message: string,
    clientIp: string,
    userAgent: string
  ): Promise<LoginResult> {
    // Validar nonce
    const isNonceValid = await this.validateNonce(walletAddress, message);
    if (!isNonceValid) {
      throw new Error('Nonce inválido ou expirado');
    }

    // Verificar assinatura
    const isSignatureValid = await this.verifySignature(walletAddress, signature, message);
    if (!isSignatureValid) {
      throw new Error('Assinatura inválida');
    }

    // Buscar ou criar usuário
    let user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: walletAddress.toLowerCase(),
          isActive: true,
        },
      });
      
      Logger.auth('Novo usuário criado', { userId: user.id, walletAddress });
    } else {
      // Atualizar último acesso
      await prisma.user.update({
        where: { id: user.id },
        data: { updatedAt: new Date() },
      });
    }

    // Gerar tokens
    const { accessToken, refreshToken } = await this.generateTokens(user.id, walletAddress);

    // Armazenar refresh token no Redis
    await this.storeRefreshToken(user.id, refreshToken);

    // Log de auditoria
    await this.createAuditLog(user.id, 'LOGIN', {
      ip: clientIp,
      userAgent,
      walletAddress,
    });

    return {
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username || undefined,
        displayName: user.displayName || undefined,
        avatar: user.avatar || undefined,
        isVerified: user.isVerified,
        kycStatus: user.kycStatus,
      },
      accessToken,
      refreshToken,
      expiresIn: parseInt(this.JWT_EXPIRES_IN),
    };
  }

  // Gerar tokens JWT
  private async generateTokens(userId: string, walletAddress: string) {
    const accessTokenPayload: Omit<TokenPayload, 'iat' | 'exp'> = {
      userId,
      walletAddress,
      type: 'access',
    };

    const refreshTokenPayload: Omit<TokenPayload, 'iat' | 'exp'> = {
      userId,
      walletAddress,
      type: 'refresh',
    };

    const accessToken = jwt.sign(accessTokenPayload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN } as jwt.SignOptions);

    const refreshToken = jwt.sign(refreshTokenPayload, this.JWT_SECRET, { expiresIn: this.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions);

    return { accessToken, refreshToken };
  }

  // Armazenar refresh token
  private async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const key = `refresh_token:${userId}`;
    const ttl = parseInt(this.JWT_REFRESH_EXPIRES_IN);
    await redisService.set(key, refreshToken, ttl);
  }

  // Renovar token
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    try {
      const decoded = jwt.verify(refreshToken, this.JWT_SECRET) as TokenPayload;
      
      if (decoded.type !== 'refresh') {
        throw new Error('Token inválido');
      }

      // Verificar se o refresh token está armazenado
      const key = `refresh_token:${decoded.userId}`;
      const storedToken = await redisService.get<string>(key);
      
      if (!storedToken || storedToken !== refreshToken) {
        throw new Error('Refresh token inválido');
      }

      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || !user.isActive) {
        throw new Error('Usuário não encontrado ou inativo');
      }

      // Gerar novo access token
      const accessTokenPayload: Omit<TokenPayload, 'iat' | 'exp'> = {
        userId: user.id,
        walletAddress: user.walletAddress,
        type: 'access',
      };

      const accessToken = jwt.sign(accessTokenPayload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN } as jwt.SignOptions);

      return {
        accessToken,
        expiresIn: parseInt(this.JWT_EXPIRES_IN),
      };
    } catch (error) {
      Logger.error('Erro ao renovar token', error);
      throw new Error('Refresh token inválido');
    }
  }

  // Verificar token
  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as TokenPayload;
      
      if (decoded.type !== 'access') {
        throw new Error('Tipo de token inválido');
      }

      // Verificar se o usuário ainda existe e está ativo
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || !user.isActive) {
        throw new Error('Usuário não encontrado ou inativo');
      }

      return decoded;
    } catch (error) {
      Logger.error('Erro ao verificar token', error);
      throw new Error('Token inválido');
    }
  }

  // Logout
  async logout(token: string): Promise<void> {
    try {
      // Decode with ignoreExpiration to allow logout even if token is expired
      const decoded = jwt.verify(token, this.JWT_SECRET, { ignoreExpiration: true }) as TokenPayload;
      
      // Remover refresh token
      const key = `refresh_token:${decoded.userId}`;
      await redisService.del(key);

      // Adicionar token à blacklist
      const blacklistKey = `blacklist:${token}`;
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await redisService.set(blacklistKey, 'true', ttl);
      }

      // Log de auditoria
      await this.createAuditLog(decoded.userId, 'LOGOUT', {});
      
      Logger.auth('Logout realizado', { userId: decoded.userId });
    } catch (error) {
      Logger.error('Erro no logout', error);
      throw new Error('Erro ao realizar logout');
    }
  }

  // Obter perfil do usuário
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        walletAddress: true,
        email: true,
        username: true,
        displayName: true,
        avatar: true,
        bio: true,
        isVerified: true,
        kycStatus: true,
        isTwoFactorEnabled: true,
        totalStaked: true,
        totalRewards: true,
        referralCode: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return user;
  }

  // Gerar segredo 2FA
  async generateTwoFactorSecret(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Usuário não encontrado');

    const secret = authenticator.generateSecret();
    const appName = 'Lunes Launchpad';
    const otpauth = authenticator.keyuri(user.email || user.walletAddress, appName, secret);

    // Salvar o segredo temporariamente no Redis ou retornar (aqui, retornamos para o front confirmar)
    // Na prática, é melhor salvar no banco mas com isTwoFactorEnabled = false.
    // Ou salvar no Redis até a confirmação.
    // Vamos salvar no banco, mas a validação final (enable) é que muda o status.

    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret }
    });

    return { secret, otpauth };
  }

  // Ativar 2FA
  async enableTwoFactor(userId: string, token: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      throw new Error('Setup de 2FA não iniciado');
    }

    const isValid = authenticator.verify({
      token,
      secret: user.twoFactorSecret
    });

    if (!isValid) {
      throw new Error('Código inválido');
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: true }
    });

    return true;
  }

  // Validar 2FA
  async validateTwoFactor(userId: string, token: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Usuário não encontrado');

    if (!user.isTwoFactorEnabled) {
      // Se 2FA não está habilitado, tecnicamente qualquer validação passa ou deve ser erro?
      // Depende da regra de negócio. Se é obrigatório, deve falhar se não tiver.
      // Assumindo que o front só pede se require2FA for true.
      throw new Error('2FA não habilitado para este usuário');
    }

    if (!user.twoFactorSecret) {
       throw new Error('Erro de configuração 2FA');
    }

    const isValid = authenticator.verify({
      token,
      secret: user.twoFactorSecret
    });

    return isValid;
  }

  // Desativar 2FA
  async disableTwoFactor(userId: string, token: string) {
     const isValid = await this.validateTwoFactor(userId, token);
     if (!isValid) throw new Error('Código inválido');

     await prisma.user.update({
       where: { id: userId },
       data: {
         isTwoFactorEnabled: false,
         twoFactorSecret: null
       }
     });

     return true;
  }

  // Verificar se token está na blacklist
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const key = `blacklist:${token}`;
    return await redisService.exists(key);
  }

  // Criar log de auditoria
  private async createAuditLog(
    userId: string,
    action: string,
    data: Record<string, any>
  ): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action,
          resource: 'AUTH',
          newValues: data,
          ipAddress: data.ip,
          userAgent: data.userAgent,
        },
      });
    } catch (error) {
      Logger.error('Erro ao criar log de auditoria', error);
    }
  }
}