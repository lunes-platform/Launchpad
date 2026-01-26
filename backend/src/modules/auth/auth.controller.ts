import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { AuthService } from './auth.service';
import { Logger } from '../../shared/logger';

// Schemas de validação
const loginSchema = z.object({
  walletAddress: z.string().min(1, 'Endereço da carteira é obrigatório'),
  signature: z.string().min(1, 'Assinatura é obrigatória'),
  message: z.string().min(1, 'Mensagem é obrigatória'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
});

const verifyTokenSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
});

const twoFactorSchema = z.object({
  token: z.string().length(6, 'O código deve ter 6 dígitos'),
});

const nonceParamsSchema = z.object({
  walletAddress: z.string().min(1, 'Endereço da carteira é obrigatório'),
});

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = AuthService.getInstance();
  }

  // POST /auth/login
  async login(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = loginSchema.parse(request.body);
      const clientIp = request.ip;
      const userAgent = request.headers['user-agent'] || '';

      Logger.auth('Tentativa de login', {
        walletAddress: body.walletAddress,
        ip: clientIp,
        userAgent,
      });

      const result = await this.authService.login(
        body.walletAddress,
        body.signature,
        body.message,
        clientIp,
        userAgent
      );

      Logger.auth('Login realizado com sucesso', {
        userId: result.user.id,
        walletAddress: body.walletAddress,
      });

      reply.code(200).send({
        success: true,
        data: result,
        message: 'Login realizado com sucesso',
      });
    } catch (error) {
      Logger.error('Erro no login', error);
      
      if (error instanceof z.ZodError) {
        reply.code(400).send({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors,
        });
        return;
      }

      reply.code(401).send({
        success: false,
        message: error instanceof Error ? error.message : 'Erro na autenticação',
      });
    }
  }

  // POST /auth/refresh
  async refreshToken(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = refreshTokenSchema.parse(request.body);

      const result = await this.authService.refreshToken(body.refreshToken);

      reply.code(200).send({
        success: true,
        data: result,
        message: 'Token renovado com sucesso',
      });
    } catch (error) {
      Logger.error('Erro ao renovar token', error);
      
      if (error instanceof z.ZodError) {
        reply.code(400).send({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors,
        });
        return;
      }

      reply.code(401).send({
        success: false,
        message: error instanceof Error ? error.message : 'Token inválido',
      });
    }
  }

  // POST /auth/verify
  async verifyToken(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = verifyTokenSchema.parse(request.body);

      const result = await this.authService.verifyToken(body.token);

      reply.code(200).send({
        success: true,
        data: result,
        message: 'Token válido',
      });
    } catch (error) {
      Logger.error('Erro ao verificar token', error);
      
      if (error instanceof z.ZodError) {
        reply.code(400).send({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors,
        });
        return;
      }

      reply.code(401).send({
        success: false,
        message: error instanceof Error ? error.message : 'Token inválido',
      });
    }
  }

  // POST /auth/logout
  async logout(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const authorization = request.headers.authorization;
      if (!authorization) {
        reply.code(401).send({
          success: false,
          message: 'Token não fornecido',
        });
        return;
      }

      const token = authorization.replace('Bearer ', '');
      await this.authService.logout(token);

      Logger.auth('Logout realizado', {
        token: token.substring(0, 10) + '...',
      });

      reply.code(200).send({
        success: true,
        message: 'Logout realizado com sucesso',
      });
    } catch (error) {
      Logger.error('Erro no logout', error);
      
      reply.code(500).send({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  // GET /auth/me
  async getProfile(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      // O middleware de autenticação já validou o token e anexou o usuário
      const user = (request as any).user;

      if (!user) {
        reply.code(401).send({
          success: false,
          message: 'Usuário não autenticado',
        });
        return;
      }

      const profile = await this.authService.getProfile(user.id);

      reply.code(200).send({
        success: true,
        data: profile,
        message: 'Perfil obtido com sucesso',
      });
    } catch (error) {
      Logger.error('Erro ao obter perfil', error);
      
      reply.code(500).send({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  // GET /auth/nonce/:walletAddress
  async getNonce(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { walletAddress } = nonceParamsSchema.parse(request.params);

      const nonce = await this.authService.generateNonce(walletAddress);
      const timestamp = Date.now();
      const message = `Lunes Launchpad Login\nNonce: ${nonce}\nTimestamp: ${timestamp}`;

      const response = {
        nonce,
        timestamp,
        message,
      };
      
      console.log('📦 Enviando resposta do nonce:', JSON.stringify(response, null, 2));

      reply.code(200).send(response);
    } catch (error) {
      Logger.error('Erro ao gerar nonce', error);
      
      if (error instanceof z.ZodError) {
        reply.code(400).send({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors,
        });
        return;
      }

      reply.code(500).send({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  // POST /auth/2fa/generate
  async generate2FA(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const user = (request as any).user;
      if (!user) {
        reply.code(401).send({ success: false, message: 'Usuário não autenticado' });
        return;
      }

      const { secret, otpauth } = await this.authService.generateTwoFactorSecret(user.id);

      reply.code(200).send({
        success: true,
        data: { secret, otpauth },
        message: 'Segredo 2FA gerado com sucesso',
      });
    } catch (error) {
      Logger.error('Erro ao gerar 2FA', error);
      reply.code(500).send({
        success: false,
        message: error instanceof Error ? error.message : 'Erro interno do servidor',
      });
    }
  }

  // POST /auth/2fa/enable
  async enable2FA(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const user = (request as any).user;
      if (!user) {
        reply.code(401).send({ success: false, message: 'Usuário não autenticado' });
        return;
      }

      const body = twoFactorSchema.parse(request.body);
      await this.authService.enableTwoFactor(user.id, body.token);

      reply.code(200).send({
        success: true,
        message: '2FA ativado com sucesso',
      });
    } catch (error) {
      Logger.error('Erro ao ativar 2FA', error);
      if (error instanceof z.ZodError) {
        reply.code(400).send({ success: false, message: 'Código inválido', errors: error.errors });
        return;
      }
      reply.code(400).send({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao ativar 2FA',
      });
    }
  }

  // POST /auth/2fa/validate
  async validate2FA(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const user = (request as any).user;
      if (!user) {
        reply.code(401).send({ success: false, message: 'Usuário não autenticado' });
        return;
      }

      const body = twoFactorSchema.parse(request.body);
      const isValid = await this.authService.validateTwoFactor(user.id, body.token);

      if (!isValid) {
        reply.code(400).send({ success: false, message: 'Código inválido' });
        return;
      }

      reply.code(200).send({
        success: true,
        message: 'Código válido',
      });
    } catch (error) {
      Logger.error('Erro ao validar 2FA', error);
      if (error instanceof z.ZodError) {
        reply.code(400).send({ success: false, message: 'Código inválido', errors: error.errors });
        return;
      }
      reply.code(400).send({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao validar 2FA',
      });
    }
  }

  // POST /auth/2fa/disable
  async disable2FA(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const user = (request as any).user;
      if (!user) {
        reply.code(401).send({ success: false, message: 'Usuário não autenticado' });
        return;
      }

      const body = twoFactorSchema.parse(request.body);
      await this.authService.disableTwoFactor(user.id, body.token);

      reply.code(200).send({
        success: true,
        message: '2FA desativado com sucesso',
      });
    } catch (error) {
      Logger.error('Erro ao desativar 2FA', error);
      if (error instanceof z.ZodError) {
        reply.code(400).send({ success: false, message: 'Código inválido', errors: error.errors });
        return;
      }
      reply.code(400).send({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao desativar 2FA',
      });
    }
  }
}