import { AuthService } from '../auth.service';
import { prisma } from '../../../shared/database';
import speakeasy from 'speakeasy';

jest.mock('../../../shared/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../../../shared/redis', () => ({
  redisService: {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  },
}));

jest.mock('../../../config/env.config', () => ({
  envConfig: {
    JWT_SECRET: 'test-secret',
    JWT_EXPIRES_IN: '1h',
    JWT_REFRESH_EXPIRES_IN: '7d',
  },
}));

describe('AuthService - 2FA', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = AuthService.getInstance();
  });

  describe('generateTwoFactorSecret', () => {
    it('should generate a secret and qr code url', async () => {
      const mockUser = { id: 'user-1', email: 'test@example.com' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.generateTwoFactorSecret('user-1');

      expect(result).toHaveProperty('secret');
      expect(result).toHaveProperty('qrCodeUrl');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { twoFactorSecret: expect.any(String) },
      });
    });

    it('should throw error if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.generateTwoFactorSecret('user-1'))
        .rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('verifyAndEnableTwoFactor', () => {
    it('should verify token and enable 2FA', async () => {
      const secret = speakeasy.generateSecret().base32;
      const token = speakeasy.totp({ secret, encoding: 'base32' });

      const mockUser = { id: 'user-1', twoFactorSecret: secret };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.user.update as jest.Mock).mockResolvedValue({ ...mockUser, twoFactorEnabled: true });

      const result = await authService.verifyAndEnableTwoFactor('user-1', token);

      expect(result).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { twoFactorEnabled: true },
      });
    });

    it('should return false for invalid token', async () => {
      const secret = speakeasy.generateSecret().base32;
      const mockUser = { id: 'user-1', twoFactorSecret: secret };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.verifyAndEnableTwoFactor('user-1', '000000');

      expect(result).toBe(false);
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('validateTwoFactor', () => {
    it('should return true for valid token', async () => {
      const secret = speakeasy.generateSecret().base32;
      const token = speakeasy.totp({ secret, encoding: 'base32' });

      const mockUser = {
        id: 'user-1',
        twoFactorSecret: secret,
        twoFactorEnabled: true
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.validateTwoFactor('user-1', token);

      expect(result).toBe(true);
    });

    it('should throw error if 2FA not enabled', async () => {
      const mockUser = {
        id: 'user-1',
        twoFactorEnabled: false
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(authService.validateTwoFactor('user-1', '123456'))
        .rejects.toThrow('2FA não habilitado para este usuário');
    });
  });
});
