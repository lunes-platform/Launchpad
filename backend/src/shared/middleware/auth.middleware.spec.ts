import { authenticate } from './auth.middleware';
import { AuthService } from '../../modules/auth/auth.service';

// Mock AuthService
jest.mock('../../modules/auth/auth.service');

describe('Auth Middleware', () => {
  let mockRequest: any;
  let mockReply: any;
  let mockAuthServiceInstance: any;

  beforeEach(() => {
    mockRequest = {
      jwtVerify: jest.fn(),
      headers: {
        authorization: 'Bearer valid-token'
      }
    };
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    mockAuthServiceInstance = {
      isTokenBlacklisted: jest.fn()
    };

    (AuthService.getInstance as jest.Mock).mockReturnValue(mockAuthServiceInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call jwtVerify', async () => {
    mockAuthServiceInstance.isTokenBlacklisted.mockResolvedValue(false);
    await authenticate(mockRequest, mockReply);
    expect(mockRequest.jwtVerify).toHaveBeenCalled();
  });

  it('should return 401 if jwtVerify fails', async () => {
    mockRequest.jwtVerify.mockRejectedValue(new Error('Invalid token'));
    await authenticate(mockRequest, mockReply);
    expect(mockReply.status).toHaveBeenCalledWith(401);
    expect(mockReply.send).toHaveBeenCalledWith(expect.objectContaining({ error: 'Token de autorização inválido' }));
  });

  it('should return 401 if token is blacklisted', async () => {
    mockRequest.jwtVerify.mockResolvedValue({ userId: '123' });
    mockAuthServiceInstance.isTokenBlacklisted.mockResolvedValue(true);

    await authenticate(mockRequest, mockReply);

    expect(mockAuthServiceInstance.isTokenBlacklisted).toHaveBeenCalledWith('valid-token');
    expect(mockReply.status).toHaveBeenCalledWith(401);
    expect(mockReply.send).toHaveBeenCalledWith(expect.objectContaining({ error: 'Token revogado. Faça login novamente.' }));
  });

  it('should pass if token is valid and not blacklisted', async () => {
    mockRequest.jwtVerify.mockResolvedValue({ userId: '123' });
    mockAuthServiceInstance.isTokenBlacklisted.mockResolvedValue(false);

    await authenticate(mockRequest, mockReply);

    expect(mockReply.status).not.toHaveBeenCalled();
    expect(mockReply.send).not.toHaveBeenCalled();
  });
});
