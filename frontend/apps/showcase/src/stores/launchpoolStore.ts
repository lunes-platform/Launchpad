import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ApiPromise } from '@polkadot/api';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { LaunchpoolService } from '../services/LaunchpoolService';

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
  
  // Estados de loading
  isLoading: boolean;
  isStaking: boolean;
  isUnstaking: boolean;
  isClaiming: boolean;
  
  // Dados calculados
  totalStakedByUser: string;
  totalPendingRewards: string;
  
  // Ações
  fetchPools: () => Promise<void>;
  fetchUserStakes: () => Promise<void>;
  stakeTokens: (poolId: string, amount: string, api: ApiPromise, account: InjectedAccountWithMeta) => Promise<boolean>;
  unstakeTokens: (poolId: string, amount: string, api: ApiPromise, account: InjectedAccountWithMeta) => Promise<boolean>;
  claimRewards: (poolId: string) => Promise<boolean>;
  claimAllRewards: () => Promise<boolean>;
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
    
    isLoading: false,
    isStaking: false,
    isUnstaking: false,
    isClaiming: false,
    
    totalStakedByUser: '0',
    totalPendingRewards: '0',
    
    // Implementação das ações
    fetchPools: async () => {
      set({ isLoading: true });
      
      try {
        // TODO: Integrar com smart contract
        // Por enquanto, dados mock para desenvolvimento
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
    
    fetchUserStakes: async () => {
      set({ isLoading: true });
      
      try {
        // TODO: Integrar com smart contract para buscar stakes do usuário
        const mockUserStakes: UserStake[] = [
          {
            poolId: 'lunes-main',
            amount: '5000',
            stakedAt: new Date('2024-01-15'),
            lastClaimAt: new Date('2024-01-20'),
            pendingRewards: '52.08', // Calculado baseado no APY
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
        
        // Calcular totais
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
        
      } catch (error) {
        console.error('Erro ao buscar stakes do usuário:', error);
        set({ isLoading: false });
      }
    },
    
    stakeTokens: async (poolId: string, amount: string, api: ApiPromise, account: InjectedAccountWithMeta) => {
      set({ isStaking: true });
      const txId = `stake-${Date.now()}`;
      
      try {
        const service = new LaunchpoolService(api);

        const newTransaction: StakingTransaction = {
          id: txId,
          type: 'stake',
          poolId,
          amount,
          timestamp: new Date(),
          status: 'pending'
        };
        
        set(state => ({
          transactions: [newTransaction, ...state.transactions]
        }));
        
        const txHash = await service.stake(account, amount);
        
        // Atualizar transação como confirmada
        set(state => ({
          transactions: state.transactions.map(tx => 
            tx.id === txId
              ? { ...tx, status: 'confirmed' as const, txHash: txHash }
              : tx
          ),
          isStaking: false
        }));
        
        // Recarregar dados
        await get().fetchUserStakes();
        await get().fetchPools();
        
        return true;
        
      } catch (error) {
        console.error('Erro ao fazer stake:', error);
        set(state => ({
          transactions: state.transactions.map(tx =>
            tx.id === txId
              ? { ...tx, status: 'failed' as const }
              : tx
          ),
          isStaking: false
        }));

        return false;
      }
    },
    
    unstakeTokens: async (poolId: string, amount: string, api: ApiPromise, account: InjectedAccountWithMeta) => {
      set({ isUnstaking: true });
      const txId = `unstake-${Date.now()}`;
      
      try {
        const service = new LaunchpoolService(api);

        const newTransaction: StakingTransaction = {
          id: txId,
          type: 'unstake',
          poolId,
          amount,
          timestamp: new Date(),
          status: 'pending'
        };
        
        set(state => ({
          transactions: [newTransaction, ...state.transactions]
        }));
        
        const txHash = await service.unstake(account, amount);
        
        set(state => ({
          transactions: state.transactions.map(tx => 
            tx.id === txId
              ? { ...tx, status: 'confirmed' as const, txHash: txHash }
              : tx
          ),
          isUnstaking: false
        }));
        
        await get().fetchUserStakes();
        await get().fetchPools();
        
        return true;
        
      } catch (error) {
        console.error('Erro ao fazer unstake:', error);
        set(state => ({
          transactions: state.transactions.map(tx =>
            tx.id === txId
              ? { ...tx, status: 'failed' as const }
              : tx
          ),
          isUnstaking: false
        }));
        return false;
      }
    },
    
    claimRewards: async (poolId: string) => {
      set({ isClaiming: true });
      
      try {
        // TODO: Integrar com smart contract
        const userStake = get().getUserStakeByPool(poolId);
        if (!userStake) throw new Error('Stake não encontrado');
        
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
    
    claimAllRewards: async () => {
      const { userStakes } = get();
      const stakesWithRewards = userStakes.filter(stake => 
        parseFloat(stake.pendingRewards) > 0
      );
      
      for (const stake of stakesWithRewards) {
        const success = await get().claimRewards(stake.poolId);
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