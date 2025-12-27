import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ApiPromise } from '@polkadot/api';
import { LaunchpoolService } from '../services/launchpoolService';
import { CONTRACTS } from '../config/contracts';

/**
 * Tipos para o sistema de Launchpool/Staking
 */
export interface Pool {
  id: string;
  name: string;
  token: string;
  tokenAddress: string;
  apy: number;
  totalStaked: string;
  totalRewards: string;
  status: 'active' | 'paused' | 'coming_soon' | 'ended';
  description: string;
  minStake: string;
  maxStake?: string;
  lockPeriod: number; // em dias
  rewardToken: string;
  startDate: Date;
  endDate?: Date;
  participants: number;
}

export interface UserStake {
  poolId: string;
  amount: string;
  stakedAt: Date;
  lastClaimAt?: Date;
  pendingRewards: string;
  lockEndDate: Date;
  canWithdraw: boolean;
}

export interface StakingTransaction {
  id: string;
  type: 'stake' | 'unstake' | 'claim';
  poolId: string;
  amount: string;
  timestamp: Date;
  txHash?: string;
  status: 'pending' | 'confirmed' | 'failed';
}

interface LaunchpoolState {
  // Estado dos pools
  pools: Pool[];
  activePools: Pool[];
  userStakes: UserStake[];
  transactions: StakingTransaction[];
  
  // Serviços
  api: ApiPromise | null;
  launchpoolService: LaunchpoolService | null;

  // Estados de loading
  isLoading: boolean;
  isStaking: boolean;
  isUnstaking: boolean;
  isClaiming: boolean;
  
  // Dados calculados
  totalStakedByUser: string;
  totalPendingRewards: string;
  
  // Ações
  init: (api: ApiPromise) => void;
  fetchPools: () => Promise<void>;
  fetchUserStakes: (address?: string) => Promise<void>;
  stakeTokens: (poolId: string, amount: string, account?: any) => Promise<boolean>;
  unstakeTokens: (poolId: string, amount: string, account?: any) => Promise<boolean>;
  claimRewards: (poolId: string, account?: any) => Promise<boolean>;
  claimAllRewards: (account?: any) => Promise<boolean>;
  calculateRewards: (poolId: string) => string;
  getPoolById: (poolId: string) => Pool | undefined;
  getUserStakeByPool: (poolId: string) => UserStake | undefined;
  
  // Utilitários
  resetState: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Store principal do Launchpool usando Zustand
 * Gerencia pools de staking, stakes do usuário e transações
 */
export const useLaunchpoolStore = create<LaunchpoolState>()(devtools(
  (set, get) => ({
    // Estado inicial
    pools: [],
    activePools: [],
    userStakes: [],
    transactions: [],
    
    api: null,
    launchpoolService: null,

    isLoading: false,
    isStaking: false,
    isUnstaking: false,
    isClaiming: false,
    
    totalStakedByUser: '0',
    totalPendingRewards: '0',
    
    // Implementação das ações
    init: (api: ApiPromise) => {
        const service = new LaunchpoolService(api, CONTRACTS.LAUNCHPAD);
        set({ api, launchpoolService: service });
    },

    fetchPools: async () => {
      set({ isLoading: true });
      
      try {
        // TODO: Integrar com smart contract
        // Por enquanto, dados mock para desenvolvimento
        // Na prática, isso viria de getLaunchpoolConfig ou eventos indexados
        const mockPools: Pool[] = [
          {
            id: 'lunes-main',
            name: 'LUNES Main Pool',
            token: 'LUNES',
            tokenAddress: '0x...', // Endereço do contrato LUNES
            apy: 12.5,
            totalStaked: '1250000',
            totalRewards: '156250',
            status: 'active',
            description: 'Pool principal do token LUNES com recompensas diárias',
            minStake: '100',
            maxStake: '100000',
            lockPeriod: 30,
            rewardToken: 'LUNES',
            startDate: new Date('2024-01-01'),
            participants: 1250
          },
          {
            id: 'lusdt-stable',
            name: 'LUSDT Stable Pool',
            token: 'LUSDT',
            tokenAddress: '0x...', // Endereço do contrato LUSDT
            apy: 8.2,
            totalStaked: '850000',
            totalRewards: '69700',
            status: 'active',
            description: 'Pool estável para LUSDT com menor risco',
            minStake: '50',
            lockPeriod: 7,
            rewardToken: 'LUSDT',
            startDate: new Date('2024-01-15'),
            participants: 890
          },
          {
            id: 'innovation-pool',
            name: 'Innovation Pool',
            token: 'INNOV',
            tokenAddress: '0x...',
            apy: 25.0,
            totalStaked: '500000',
            totalRewards: '125000',
            status: 'coming_soon',
            description: 'Pool para projetos inovadores com alto potencial',
            minStake: '200',
            lockPeriod: 90,
            rewardToken: 'INNOV',
            startDate: new Date('2024-03-01'),
            participants: 0
          }
        ];
        
        const activePools = mockPools.filter(pool => pool.status === 'active');
        
        set({ 
          pools: mockPools, 
          activePools,
          isLoading: false 
        });
        
      } catch (error) {
        console.error('Erro ao buscar pools:', error);
        set({ isLoading: false });
      }
    },
    
    fetchUserStakes: async (address?: string) => {
      set({ isLoading: true });
      const { launchpoolService } = get();
      
      try {
        if (!launchpoolService) {
             // Fallback para mock se serviço não inicializado ou endereço não fornecido
             console.warn("LaunchpoolService not initialized or address missing, using mock data");

             // ... existing mock logic ...
             const mockUserStakes: UserStake[] = [
                {
                  poolId: 'lunes-main',
                  amount: '5000',
                  stakedAt: new Date('2024-01-15'),
                  lastClaimAt: new Date('2024-01-20'),
                  pendingRewards: '52.08',
                  lockEndDate: new Date('2024-02-14'),
                  canWithdraw: true
                },
                {
                  poolId: 'lusdt-stable',
                  amount: '2000',
                  stakedAt: new Date('2024-01-20'),
                  pendingRewards: '11.23',
                  lockEndDate: new Date('2024-01-27'),
                  canWithdraw: false
                }
              ];

              const totalStaked = mockUserStakes.reduce((sum, stake) =>
                sum + parseFloat(stake.amount), 0
              ).toString();

              const totalRewards = mockUserStakes.reduce((sum, stake) =>
                sum + parseFloat(stake.pendingRewards), 0
              ).toString();

              set({
                userStakes: mockUserStakes,
                totalStakedByUser: totalStaked,
                totalPendingRewards: totalRewards,
                isLoading: false
              });
             return;
        }

        if (!address) {
            set({
                userStakes: [],
                totalStakedByUser: '0',
                totalPendingRewards: '0',
                isLoading: false
            });
            return;
        }

        const stakeInfo = await launchpoolService.getUserStakeInfo(address);

        let userStakes: UserStake[] = [];

        if (stakeInfo && stakeInfo.isParticipating) {
            // Se o usuário tem stake, vamos assumir que é no 'lunes-main' para este exemplo
            // Em produção, iterariamos pelos pools para pegar alocação de cada um
            // ou o contrato retornaria uma lista de participações
            const pendingRewards = await launchpoolService.getClaimableAmount(address, 'lunes-main');

            userStakes.push({
                poolId: 'lunes-main',
                amount: stakeInfo.amount,
                stakedAt: stakeInfo.lastStakeTime,
                lastClaimAt: undefined, // Poderia vir do contrato se adicionado ao struct
                pendingRewards: pendingRewards,
                lockEndDate: stakeInfo.unlockTime,
                canWithdraw: new Date() >= stakeInfo.unlockTime
            });
        }
        
        // Calcular totais
        const totalStaked = userStakes.reduce((sum, stake) =>
          sum + parseFloat(stake.amount), 0
        ).toString();
        
        const totalRewards = userStakes.reduce((sum, stake) =>
          sum + parseFloat(stake.pendingRewards), 0
        ).toString();
        
        set({ 
          userStakes: userStakes,
          totalStakedByUser: totalStaked,
          totalPendingRewards: totalRewards,
          isLoading: false 
        });
        
      } catch (error) {
        console.error('Erro ao buscar stakes do usuário:', error);
        set({ isLoading: false });
      }
    },
    
    stakeTokens: async (poolId: string, amount: string, account?: any) => {
      set({ isStaking: true });
      const { launchpoolService } = get();
      
      try {
        if (launchpoolService && account) {
             const txHash = await launchpoolService.stake(account, amount);

             const newTransaction: StakingTransaction = {
              id: `stake-${Date.now()}`,
              type: 'stake',
              poolId,
              amount,
              timestamp: new Date(),
              status: 'confirmed',
              txHash: txHash
            };

            set(state => ({
              transactions: [newTransaction, ...state.transactions],
              isStaking: false
            }));

            await get().fetchUserStakes(account.address);
            await get().fetchPools();
            return true;
        }

        // Mock fallback
        console.warn("Using mock stakeTokens");
        // Simular transação por enquanto
        const newTransaction: StakingTransaction = {
          id: `stake-${Date.now()}`,
          type: 'stake',
          poolId,
          amount,
          timestamp: new Date(),
          status: 'pending'
        };
        
        set(state => ({
          transactions: [newTransaction, ...state.transactions]
        }));
        
        // Simular delay da transação
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Atualizar transação como confirmada
        set(state => ({
          transactions: state.transactions.map(tx => 
            tx.id === newTransaction.id 
              ? { ...tx, status: 'confirmed' as const, txHash: '0x...' }
              : tx
          ),
          isStaking: false
        }));
        
        // Recarregar dados
        await get().fetchUserStakes(); // Vai usar o mock interno
        await get().fetchPools();
        
        return true;
        
      } catch (error) {
        console.error('Erro ao fazer stake:', error);
        set({ isStaking: false });
        return false;
      }
    },
    
    unstakeTokens: async (poolId: string, amount: string, account?: any) => {
      set({ isUnstaking: true });
       const { launchpoolService } = get();
      
      try {
         if (launchpoolService && account) {
             const txHash = await launchpoolService.unstake(account, amount);

              const newTransaction: StakingTransaction = {
                  id: `unstake-${Date.now()}`,
                  type: 'unstake',
                  poolId,
                  amount,
                  timestamp: new Date(),
                  status: 'confirmed',
                  txHash: txHash
                };

                set(state => ({
                  transactions: [newTransaction, ...state.transactions],
                  isUnstaking: false
                }));

                await get().fetchUserStakes(account.address);
                await get().fetchPools();
                return true;
         }

        // Mock fallback
        console.warn("Using mock unstakeTokens");
        const newTransaction: StakingTransaction = {
          id: `unstake-${Date.now()}`,
          type: 'unstake',
          poolId,
          amount,
          timestamp: new Date(),
          status: 'pending'
        };
        
        set(state => ({
          transactions: [newTransaction, ...state.transactions]
        }));
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        set(state => ({
          transactions: state.transactions.map(tx => 
            tx.id === newTransaction.id 
              ? { ...tx, status: 'confirmed' as const, txHash: '0x...' }
              : tx
          ),
          isUnstaking: false
        }));
        
        await get().fetchUserStakes();
        await get().fetchPools();
        
        return true;
        
      } catch (error) {
        console.error('Erro ao fazer unstake:', error);
        set({ isUnstaking: false });
        return false;
      }
    },
    
    claimRewards: async (poolId: string, account?: any) => {
      set({ isClaiming: true });
       const { launchpoolService } = get();
      
      try {
        const userStake = get().getUserStakeByPool(poolId);
        if (!userStake) throw new Error('Stake não encontrado');

        if (launchpoolService && account) {
             const txHash = await launchpoolService.claim(account, poolId);

             const newTransaction: StakingTransaction = {
              id: `claim-${Date.now()}`,
              type: 'claim',
              poolId,
              amount: userStake.pendingRewards,
              timestamp: new Date(),
              status: 'confirmed',
              txHash: txHash
            };

            set(state => ({
              transactions: [newTransaction, ...state.transactions],
              isClaiming: false
            }));

            await get().fetchUserStakes(account.address);
            return true;
        }

        // Mock fallback
        console.warn("Using mock claimRewards");
        
        const newTransaction: StakingTransaction = {
          id: `claim-${Date.now()}`,
          type: 'claim',
          poolId,
          amount: userStake.pendingRewards,
          timestamp: new Date(),
          status: 'pending'
        };
        
        set(state => ({
          transactions: [newTransaction, ...state.transactions]
        }));
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        set(state => ({
          transactions: state.transactions.map(tx => 
            tx.id === newTransaction.id 
              ? { ...tx, status: 'confirmed' as const, txHash: '0x...' }
              : tx
          ),
          isClaiming: false
        }));
        
        await get().fetchUserStakes();
        
        return true;
        
      } catch (error) {
        console.error('Erro ao resgatar recompensas:', error);
        set({ isClaiming: false });
        return false;
      }
    },
    
    claimAllRewards: async (account?: any) => {
      const { userStakes } = get();
      const stakesWithRewards = userStakes.filter(stake => 
        parseFloat(stake.pendingRewards) > 0
      );
      
      for (const stake of stakesWithRewards) {
        const success = await get().claimRewards(stake.poolId, account);
        if (!success) return false;
      }
      
      return true;
    },
    
    calculateRewards: (poolId: string) => {
      const userStake = get().getUserStakeByPool(poolId);
      const pool = get().getPoolById(poolId);
      
      if (!userStake || !pool) return '0';
      
      // Cálculo simples de recompensas baseado no APY
      const stakedAmount = parseFloat(userStake.amount);
      const daysSinceStake = Math.floor(
        (Date.now() - userStake.stakedAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      const dailyRate = pool.apy / 100 / 365;
      const rewards = stakedAmount * dailyRate * daysSinceStake;
      
      return rewards.toFixed(6);
    },
    
    getPoolById: (poolId: string) => {
      return get().pools.find(pool => pool.id === poolId);
    },
    
    getUserStakeByPool: (poolId: string) => {
      return get().userStakes.find(stake => stake.poolId === poolId);
    },
    
    resetState: () => {
      set({
        pools: [],
        activePools: [],
        userStakes: [],
        transactions: [],
        isLoading: false,
        isStaking: false,
        isUnstaking: false,
        isClaiming: false,
        totalStakedByUser: '0',
        totalPendingRewards: '0'
      });
    },
    
    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    }
  }),
  {
    name: 'launchpool-store',
    version: 1
  }
));

/**
 * Hook personalizado para acessar dados computados do Launchpool
 */
export const useLaunchpoolData = () => {
  const store = useLaunchpoolStore();
  
  return {
    ...store,
    // Dados computados adicionais
    hasActiveStakes: store.userStakes.length > 0,
    canClaimAny: store.userStakes.some(stake => parseFloat(stake.pendingRewards) > 0),
    totalPools: store.pools.length,
    activePoolsCount: store.activePools.length,
    
    // Estatísticas
    averageAPY: store.activePools.length > 0 
      ? store.activePools.reduce((sum, pool) => sum + pool.apy, 0) / store.activePools.length
      : 0,
    
    totalValueLocked: store.pools.reduce((sum, pool) => 
      sum + parseFloat(pool.totalStaked), 0
    ).toString()
  };
};
