import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../../modules/auth/auth.service';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // 1. Verificar assinatura e expiração do JWT (padrão Fastify)
    await request.jwtVerify();

    // 2. Extrair o token cru para verificação na blacklist
    const token = request.headers.authorization?.split(' ')[1];

    if (token) {
      // 3. Verificar se o token foi revogado
      const isBlacklisted = await AuthService.getInstance().isTokenBlacklisted(token);

      if (isBlacklisted) {
        return reply.status(401).send({
          success: false,
          error: 'Token revogado ou inválido'
        });
      }
    }
  } catch (err) {
    return reply.status(401).send({
      success: false,
      error: 'Token de autorização inválido'
    });
  }
};
