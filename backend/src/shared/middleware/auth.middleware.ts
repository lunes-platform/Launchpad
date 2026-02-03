import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../../modules/auth/auth.service';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // 1. Verify signature and expiration (standard jwtVerify)
    // This populates request.user
    await request.jwtVerify();

    // 2. Extract token to check blacklist
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new Error('No token provided');
    }

    // Remove 'Bearer ' prefix to get the raw token
    const token = authHeader.replace(/^Bearer\s+/i, '');

    // 3. Check blacklist
    const authService = AuthService.getInstance();
    const isBlacklisted = await authService.isTokenBlacklisted(token);

    if (isBlacklisted) {
      return reply.status(401).send({
        success: false,
        error: 'Token revogado. Faça login novamente.',
      });
    }

  } catch (err) {
    return reply.status(401).send({
      success: false,
      error: 'Token de autorização inválido',
    });
  }
};
