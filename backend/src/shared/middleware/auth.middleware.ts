import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../../modules/auth/auth.service';
import { Logger } from '../logger';

/**
 * Middleware para autenticação JWT
 * Verifica assinatura, expiração e se o token foi revogado (blacklist)
 */
export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // 1. Verifica assinatura e expiração (JWT padrão)
    await request.jwtVerify();

    // 2. Extrai o token do header
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Remove 'Bearer ' se existir
    const token = authHeader.replace(/^Bearer\s+/i, '');

    // 3. Verifica se o token está na blacklist (revogado)
    const isBlacklisted = await AuthService.getInstance().isTokenBlacklisted(token);

    if (isBlacklisted) {
      Logger.auth('Tentativa de uso de token revogado', {
        ip: request.ip,
        path: request.url,
        method: request.method
      });

      return reply.status(401).send({
        success: false,
        error: 'Token revogado. Faça login novamente.',
        code: 'TOKEN_REVOKED'
      });
    }

    // Token é válido e não está na blacklist
  } catch (err: any) {
    Logger.auth('Falha na autenticação', {
      error: err.message,
      ip: request.ip
    });

    return reply.status(401).send({
      success: false,
      error: 'Token de autorização inválido ou expirado',
      code: 'UNAUTHORIZED'
    });
  }
};
