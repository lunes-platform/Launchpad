import { authenticate } from './auth.middleware';
import { AuthService } from '../../modules/auth/auth.service';
import { Logger } from '../logger';

// Mocks
jest.mock('../../modules/auth/auth.service');
jest.mock('../logger');

describe('Auth Middleware', () => {
  let mockRequest: any;
  let mockReply: any;
  let mockAuthService: any;

  beforeEach(() => {
    mockRequest = {
      jwtVerify: jest.fn(),
      headers: {
        authorization: 'Bearer valid-token',
      },
      ip: '127.0.0.1',
      url: '/test',
      method: 'GET',
    };

    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    mockAuthService = {
      isTokenBlacklisted: jest.fn(),
    };

    // Mock static getInstance
    (AuthService.getInstance as jest.Mock).mockReturnValue(mockAuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should proceed if token is valid and not blacklisted', async () => {
    mockAuthService.isTokenBlacklisted.mockResolvedValue(false);

    await authenticate(mockRequest, mockReply);

    expect(mockRequest.jwtVerify).toHaveBeenCalled();
    expect(mockAuthService.isTokenBlacklisted).toHaveBeenCalledWith('valid-token');
    // If successful, it just returns undefined (void), so we expect no error response
    expect(mockReply.status).not.toHaveBeenCalled();
  });

  it('should return 401 if token is blacklisted', async () => {
    mockAuthService.isTokenBlacklisted.mockResolvedValue(true);

    await authenticate(mockRequest, mockReply);

    expect(mockReply.status).toHaveBeenCalledWith(401);
    expect(mockReply.send).toHaveBeenCalledWith(expect.objectContaining({
      code: 'TOKEN_REVOKED'
    }));
  });

  it('should return 401 if jwtVerify throws', async () => {
    mockRequest.jwtVerify.mockRejectedValue(new Error('Invalid token'));

    await authenticate(mockRequest, mockReply);

    expect(mockReply.status).toHaveBeenCalledWith(401);
    expect(mockReply.send).toHaveBeenCalledWith(expect.objectContaining({
        code: 'UNAUTHORIZED'
    }));
  });

  it('should throw/return 401 if authorization header is missing', async () => {
    mockRequest.headers.authorization = undefined;
    mockRequest.jwtVerify.mockResolvedValue(undefined); // Verify passes (maybe cookie?) but we check header

    await authenticate(mockRequest, mockReply);

    expect(mockReply.status).toHaveBeenCalledWith(401);
  });
});
