import { authenticate } from './auth.middleware';
import { AuthService } from '../../modules/auth/auth.service';
import { FastifyRequest, FastifyReply } from 'fastify';

// Mock AuthService
jest.mock('../../modules/auth/auth.service');

describe('Auth Middleware', () => {
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;
  let mockAuthService: any;

  beforeEach(() => {
    mockRequest = {
      jwtVerify: jest.fn().mockResolvedValue(true),
      headers: {
        authorization: 'Bearer valid-token'
      }
    };
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Setup AuthService mock
    mockAuthService = {
      isTokenBlacklisted: jest.fn()
    };
    (AuthService.getInstance as jest.Mock).mockReturnValue(mockAuthService);
  });

  it('should pass if token is valid and not blacklisted', async () => {
    mockAuthService.isTokenBlacklisted.mockResolvedValue(false);

    await authenticate(mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(mockRequest.jwtVerify).toHaveBeenCalled();
    expect(mockAuthService.isTokenBlacklisted).toHaveBeenCalledWith('valid-token');
    expect(mockReply.status).not.toHaveBeenCalled();
    expect(mockReply.send).not.toHaveBeenCalled();
  });

  it('should return 401 if token is blacklisted', async () => {
    mockAuthService.isTokenBlacklisted.mockResolvedValue(true);

    await authenticate(mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(mockRequest.jwtVerify).toHaveBeenCalled();
    expect(mockAuthService.isTokenBlacklisted).toHaveBeenCalledWith('valid-token');
    expect(mockReply.status).toHaveBeenCalledWith(401);
    expect(mockReply.send).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      error: 'Token revogado ou inválido'
    }));
  });

  it('should return 401 if jwtVerify fails', async () => {
    (mockRequest.jwtVerify as jest.Mock).mockRejectedValue(new Error('Invalid token'));

    await authenticate(mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(mockRequest.jwtVerify).toHaveBeenCalled();
    expect(mockReply.status).toHaveBeenCalledWith(401);
  });
});
