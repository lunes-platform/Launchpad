import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRafflePurchase } from '../useRafflePurchase';
import { useAuth } from '../../contexts/AuthContext';
import { useWallet } from '../../contexts/WalletContext';
import { usePolkadotApi } from '../usePolkadotApi';
import { useRaffleStore } from '../../stores/raffleStore';
import { lunesUtils } from '../../config/lunes';

// Mock dependencies
vi.mock('../../contexts/AuthContext');
vi.mock('../../contexts/WalletContext');
vi.mock('../usePolkadotApi');
vi.mock('../../stores/raffleStore');
vi.mock('../../config/lunes', () => ({
  lunesUtils: {
    toLunesUnits: vi.fn(),
  },
}));
vi.mock('@tanstack/react-query', () => ({
  useMutation: () => ({
    mutateAsync: vi.fn(),
  }),
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
  }),
}));

describe('useRafflePurchase', () => {
  const mockUser = { id: 'user1', name: 'Test User' };
  const mockSelectedAccount = { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' };

  const mockRaffle = {
    id: '1',
    ticketPrice: 10,
    maxTicketsPerUser: 100,
    maxTickets: 1000,
    soldTickets: 0,
    status: 'active',
    startDate: new Date(Date.now() - 10000),
    endDate: new Date(Date.now() + 10000),
  };

  beforeEach(() => {
    vi.resetAllMocks();

    (useAuth as any).mockReturnValue({
      user: mockUser,
      isVip: false,
      isVerified: true,
    });

    (useWallet as any).mockReturnValue({
      selectedAccount: mockSelectedAccount,
      isReady: true,
    });

    (usePolkadotApi as any).mockReturnValue({
      transfer: vi.fn(),
      getBalance: vi.fn(),
      getRawBalance: vi.fn(), // Will be added
      isConnected: true,
    });

    (useRaffleStore as any).mockReturnValue({
      canPurchaseTickets: vi.fn().mockReturnValue(true),
    });

    // Default implementation for lunesUtils.toLunesUnits
    (lunesUtils.toLunesUnits as any).mockImplementation((amount: number) => {
      // Mocking 12 decimals
      return (amount * Math.pow(10, 12)).toString();
    });
  });

  it('checkUserBalance should return true when balance is sufficient', async () => {
    const { result } = renderHook(() => useRafflePurchase());

    // Mock balance > required
    // Ticket price 10, quantity 2 = 20
    // Balance 30

    const requiredAmount = 20 * Math.pow(10, 12);
    const balanceAmount = 30 * Math.pow(10, 12);

    const getBalanceMock = vi.fn().mockResolvedValue('30 LUNES');
    const getRawBalanceMock = vi.fn().mockResolvedValue(balanceAmount.toString());

    (usePolkadotApi as any).mockReturnValue({
      getBalance: getBalanceMock,
      getRawBalance: getRawBalanceMock, // We are testing the future implementation
      isConnected: true,
    });

    // We assume toLunesUnits works correctly (mocked above)

    const checkResult = await result.current.checkUserBalance(mockRaffle as any, 2);

    expect(checkResult.hasBalance).toBe(true);
    // expect(checkResult.currentBalance).toBe('30 LUNES');
    // We expect currentBalance to be the formatted one
  });

  it('checkUserBalance should return false when balance is insufficient', async () => {
    const { result } = renderHook(() => useRafflePurchase());

    // Ticket price 10, quantity 2 = 20
    // Balance 10

    const balanceAmount = 10 * Math.pow(10, 12);

    const getBalanceMock = vi.fn().mockResolvedValue('10 LUNES');
    const getRawBalanceMock = vi.fn().mockResolvedValue(balanceAmount.toString());

    (usePolkadotApi as any).mockReturnValue({
      getBalance: getBalanceMock,
      getRawBalance: getRawBalanceMock,
      isConnected: true,
    });

    const checkResult = await result.current.checkUserBalance(mockRaffle as any, 2);

    expect(checkResult.hasBalance).toBe(false);
  });
});
