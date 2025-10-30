import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

/**
 * Configuração de CORS para desenvolvimento e produção
 * 
 * Funcionalidades:
 * - Permite requisições do frontend local em desenvolvimento
 * - Configuração restritiva para produção
 * - Headers necessários para autenticação JWT
 * - Suporte a preflight requests
 */
export const setupCors = async (server: FastifyInstance) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  await server.register(cors, {
    // Origens permitidas
    origin: isDevelopment 
      ? [
          'http://localhost:3000',
          'http://localhost:3001', 
          'http://localhost:5173',
          'http://127.0.0.1:3000',
          'http://127.0.0.1:3001',
          'http://127.0.0.1:5173'
        ]
      : process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : false,
    
    // Métodos HTTP permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    
    // Headers permitidos
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Cache-Control',
      'X-File-Name'
    ],
    
    // Headers expostos para o cliente
    exposedHeaders: [
      'X-Total-Count',
      'X-Page-Count',
      'X-Current-Page'
    ],
    
    // Permitir cookies e credenciais
    credentials: true,
    
    // Cache do preflight em segundos (24 horas)
    maxAge: isDevelopment ? 86400 : 3600,
    
    // Permitir preflight para todas as rotas
    preflightContinue: false,
    
    // Responder automaticamente ao preflight
    optionsSuccessStatus: 204
  });
};