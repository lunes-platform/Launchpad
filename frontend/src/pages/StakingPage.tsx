import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Coins,
  TrendingUp,
  Clock,
  Shield,
  Gift,
  Star,
  Zap,
  Trophy,
  Crown,
  AlertCircle,
  CheckCircle,
  Lock,
  Users,
} from 'lucide-react';
import { useAuth, useIsVip, useUserLimits, usePermission } from '../../apps/showcase/src/contexts/AuthContext';
import { Permission } from '../../apps/showcase/src/types/auth';

// Componentes inline simples
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-grafite-900 rounded-lg border border-grafite-200 dark:border-grafite-700 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const Button: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}> = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '' }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    primary: 'bg-roxo-600 text-white hover:bg-roxo-700 focus:ring-roxo-500',
    secondary: 'bg-grafite-200 text-grafite-900 hover:bg-grafite-300 focus:ring-grafite-500',
    outline: 'border border-grafite-300 bg-transparent hover:bg-grafite-50 focus:ring-grafite-500'
  };
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const Badge: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}> = ({ children, variant = 'default', className = '' }) => {
  const variantClasses = {
    default: 'bg-grafite-100 text-grafite-800',
    success: 'bg-verde-100 text-verde-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

const ProgressBar: React.FC<{ value: number; className?: string }> = ({ value, className = '' }) => (
  <div className={`w-full bg-grafite-200 rounded-full h-2 ${className}`}>
    <div 
      className="bg-roxo-600 h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(value, 100)}%` }}
    />
  </div>
);

// Tipos para dados de staking
interface StakingPool {
  id: string;
  name: string;
  apy: number;
  totalStaked: number;
  minStake: number;
  lockPeriod: number; // em dias
  status: 'active' | 'inactive' | 'full';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  rewards: string[];
  progress: number;
}

interface UserStake {
  poolId: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  rewards: number;
  status: 'active' | 'completed' | 'pending';
}

interface StakingTier {
  name: string;
  minAmount: number;
  benefits: string[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

// Dados mockados
const mockPools: StakingPool[] = [
  {
    id: '1',
    name: 'Pool Bronze',
    apy: 12,
    totalStaked: 1500000,
    minStake: 100,
    lockPeriod: 30,
    status: 'active',
    tier: 'bronze',
    rewards: ['Acesso antecipado a projetos', 'Desconto em taxas'],
    progress: 65
  },
  {
    id: '2',
    name: 'Pool Silver',
    apy: 18,
    totalStaked: 2800000,
    minStake: 1000,
    lockPeriod: 90,
    status: 'active',
    tier: 'silver',
    rewards: ['Whitelist garantida', 'Bônus de staking', 'Suporte prioritário'],
    progress: 78
  },
  {
    id: '3',
    name: 'Pool Gold',
    apy: 25,
    totalStaked: 5200000,
    minStake: 5000,
    lockPeriod: 180,
    status: 'active',
    tier: 'gold',
    rewards: ['Alocação garantida', 'Governança', 'Eventos exclusivos'],
    progress: 92
  },
  {
    id: '4',
    name: 'Pool Platinum',
    apy: 35,
    totalStaked: 10000000,
    minStake: 25000,
    lockPeriod: 365,
    status: 'full',
    tier: 'platinum',
    rewards: ['Acesso VIP', 'Consultoria', 'Participação em lucros'],
    progress: 100
  }
];

const mockUserStakes: UserStake[] = [
  {
    poolId: '1',
    amount: 500,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-14'),
    rewards: 5.2,
    status: 'active'
  },
  {
    poolId: '2',
    amount: 2000,
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-04-10'),
    rewards: 89.5,
    status: 'active'
  }
];

const stakingTiers: StakingTier[] = [
  {
    name: 'Bronze',
    minAmount: 100,
    benefits: ['Acesso básico', 'Desconto 5% em taxas'],
    icon: Shield,
    color: 'text-orange-600'
  },
  {
    name: 'Silver',
    minAmount: 1000,
    benefits: ['Whitelist garantida', 'Desconto 10% em taxas', 'Suporte prioritário'],
    icon: Star,
    color: 'text-gray-500'
  },
  {
    name: 'Gold',
    minAmount: 5000,
    benefits: ['Alocação garantida', 'Governança', 'Desconto 15% em taxas'],
    icon: Trophy,
    color: 'text-yellow-500'
  },
  {
    name: 'Platinum',
    minAmount: 25000,
    benefits: ['Acesso VIP', 'Consultoria exclusiva', 'Participação em lucros'],
    icon: Crown,
    color: 'text-purple-600'
  }
];

/**
 * Página principal de Staking
 * Permite aos usuários fazer stake de tokens LUNES para ganhar recompensas
 * e acessar benefícios exclusivos na plataforma
 */
export default function StakingPage() {
  const [selectedPool, setSelectedPool] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'pools' | 'my-stakes' | 'tiers' | 'rewards' | 'history'>('pools');
  const [isLoading, setIsLoading] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [rewardsFilter, setRewardsFilter] = useState('all');

  // Hooks de autenticação e permissões
  const { user, isAuthenticated } = useAuth();
  const isVip = useIsVip();
  const userLimits = useUserLimits();
  const canStake = usePermission(Permission.STAKE_TOKENS);
  const canUnstake = usePermission(Permission.UNSTAKE_TOKENS);
  const canClaimRewards = usePermission(Permission.CLAIM_STAKING_REWARDS);
  const hasVipFeatures = usePermission(Permission.VIP_FEATURES);
  const hasPriorityAccess = usePermission(Permission.PRIORITY_ACCESS);

  // Simulação de dados do usuário
  const userBalance = 10000; // LUNES
  const totalStaked = mockUserStakes.reduce((sum, stake) => sum + stake.amount, 0);
  const totalRewards = mockUserStakes.reduce((sum, stake) => sum + stake.rewards, 0);

  // Mock data para recompensas e histórico
  const rewardsData = {
    totalEarned: 2847.50,
    pendingRewards: 156.25,
    claimableRewards: 2691.25,
    nextRewardDate: '2024-01-25'
  };

  const stakingHistory = [
    {
      id: '1',
      type: 'stake' as const,
      pool: 'Pool Bronze',
      amount: 5000,
      date: '2024-01-15',
      txHash: '0x1234...5678',
      status: 'completed' as const
    },
    {
      id: '2',
      type: 'reward' as const,
      pool: 'Pool Bronze',
      amount: 125.50,
      date: '2024-01-14',
      txHash: '0x2345...6789',
      status: 'completed' as const
    },
    {
      id: '3',
      type: 'unstake' as const,
      pool: 'Pool Silver',
      amount: 2000,
      date: '2024-01-10',
      txHash: '0x3456...7890',
      status: 'completed' as const
    },
    {
      id: '4',
      type: 'stake' as const,
      pool: 'Pool Silver',
      amount: 15000,
      date: '2024-01-08',
      txHash: '0x4567...8901',
      status: 'completed' as const
    }
  ];

  const performanceStats = {
    totalStaked: 18000,
    averageAPY: 22.5,
    stakingDuration: 45, // dias
    totalPools: 2
  };

  // Verificações de limites baseadas no usuário
  const getMaxStakeAmount = () => {
    if (!userLimits) return 1000; // Limite padrão
    return userLimits.maxStakingAmount;
  };

  const getStakingFee = () => {
    if (!userLimits) return 0.05; // Taxa padrão de 5%
    return userLimits.stakingFeePercentage / 100;
  };

  const getBonusMultiplier = () => {
    if (!userLimits) return 1;
    return userLimits.stakingBonusMultiplier;
  };

  const handleStake = async (poolId: string, amount: number) => {
    if (!canStake) {
      alert('Você não tem permissão para fazer staking. Verifique seu KYC ou status da conta.');
      return;
    }

    const maxAmount = getMaxStakeAmount();
    
    if (amount > maxAmount) {
      alert(`Valor máximo para staking é ${maxAmount} LUNES para seu nível de usuário.`);
      return;
    }

    if (amount > userBalance) {
      alert('Saldo insuficiente.');
      return;
    }

    setIsLoading(true);
    // Simulação de chamada de API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const fee = amount * getStakingFee();
    const bonus = isVip ? ` (Bônus VIP: ${getBonusMultiplier()}x)` : '';
    console.log(`Staking ${amount} LUNES no pool ${poolId}. Taxa: ${fee} LUNES${bonus}`);
    setIsLoading(false);
  };

  const handleUnstake = async (poolId: string, amount: number) => {
    if (!canUnstake) {
      alert('Você não tem permissão para fazer unstaking.');
      return;
    }

    setIsLoading(true);
    // Simulação de chamada de API
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Unstaking ${amount} LUNES do pool ${poolId}`);
    setIsLoading(false);
  };

  const handleClaimRewards = async (poolId: string) => {
    if (!canClaimRewards) {
      alert('Você não tem permissão para reivindicar recompensas.');
      return;
    }

    console.log(`Recompensas reivindicadas do pool ${poolId}!`);
  };

  const getTierIcon = (tier: string) => {
    const tierData = stakingTiers.find(t => t.name.toLowerCase() === tier);
    return tierData?.icon || Shield;
  };

  const getTierColor = (tier: string) => {
    const tierData = stakingTiers.find(t => t.name.toLowerCase() === tier);
    return tierData?.color || 'text-gray-500';
  };

  // Componente de Status do Usuário
  const UserStatusBanner = () => {
    if (!isAuthenticated) {
      return (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Lock className="text-red-400" size={20} />
            <div>
              <h3 className="text-red-400 font-semibold">Conecte sua carteira</h3>
              <p className="text-red-300 text-sm">Você precisa conectar sua carteira para acessar o staking.</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`border rounded-lg p-4 mb-6 ${
        isVip 
          ? 'bg-gradient-to-r from-yellow-500/20 to-purple-500/20 border-yellow-500/30'
          : hasVipFeatures
          ? 'bg-blue-500/20 border-blue-500/30'
          : 'bg-slate-500/20 border-slate-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isVip ? (
              <Crown className="text-yellow-400" size={20} />
            ) : hasVipFeatures ? (
              <Shield className="text-blue-400" size={20} />
            ) : (
              <Users className="text-slate-400" size={20} />
            )}
            <div>
              <h3 className={`font-semibold ${
                isVip ? 'text-yellow-400' : hasVipFeatures ? 'text-blue-400' : 'text-slate-400'
              }`}>
                {isVip ? 'Usuário VIP' : hasVipFeatures ? 'Usuário Verificado' : 'Usuário Padrão'}
              </h3>
              <p className="text-slate-300 text-sm">
                Limite máximo: {getMaxStakeAmount().toLocaleString()} LUNES
                {isVip && ` • Bônus: ${getBonusMultiplier()}x • Taxa reduzida: ${(getStakingFee() * 100).toFixed(1)}%`}
              </p>
            </div>
          </div>
          {hasPriorityAccess && (
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              Acesso Prioritário
            </Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl font-bold text-grafite-900 dark:text-white mb-2">
              Staking LUNES
            </h1>
            <p className="text-lg text-grafite-600 dark:text-grafite-300">
              Faça stake dos seus tokens LUNES e ganhe recompensas exclusivas
            </p>
          </motion.div>

          {/* Status do Usuário */}
          <UserStatusBanner />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-grafite-600 dark:text-grafite-400">Saldo Disponível</p>
                      <p className="text-2xl font-bold text-grafite-900 dark:text-white">
                        {userBalance.toLocaleString()} LUNES
                      </p>
                    </div>
                    <Coins className="w-8 h-8 text-roxo-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-grafite-600 dark:text-grafite-400">Total em Stake</p>
                      <p className="text-2xl font-bold text-grafite-900 dark:text-white">
                        {totalStaked.toLocaleString()} LUNES
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-verde-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-grafite-600 dark:text-grafite-400">Recompensas</p>
                      <p className="text-2xl font-bold text-grafite-900 dark:text-white">
                        {totalRewards.toFixed(2)} LUNES
                      </p>
                    </div>
                    <Gift className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-grafite-600 dark:text-grafite-400">APY Médio</p>
                      <p className="text-2xl font-bold text-grafite-900 dark:text-white">
                        22.5%
                      </p>
                    </div>
                    <Zap className="w-8 h-8 text-roxo-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-grafite-100 dark:bg-grafite-800 p-1 rounded-lg">
            {[
              { id: 'pools', label: 'Pools de Staking', icon: Coins },
              { id: 'my-stakes', label: 'Meus Stakes', icon: TrendingUp },
              { id: 'rewards', label: 'Recompensas', icon: Gift },
              { id: 'history', label: 'Histórico', icon: Clock },
              { id: 'tiers', label: 'Tiers & Benefícios', icon: Crown }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-md transition-colors
                    ${isActive 
                      ? 'bg-white dark:bg-grafite-900 text-grafite-900 dark:text-white shadow-sm' 
                      : 'text-grafite-600 dark:text-grafite-400 hover:text-grafite-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'pools' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {mockPools.map((pool, index) => {
              const TierIcon = getTierIcon(pool.tier);
              
              return (
                <motion.div
                  key={pool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={pool.status === 'full' ? 'opacity-75' : ''}>
                    <CardContent>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <TierIcon className={`w-8 h-8 ${getTierColor(pool.tier)}`} />
                          <div>
                            <h3 className="text-xl font-bold text-grafite-900 dark:text-white">
                              {pool.name}
                            </h3>
                            <Badge 
                              variant={pool.status === 'active' ? 'success' : pool.status === 'full' ? 'warning' : 'default'}
                            >
                              {pool.status === 'active' ? 'Ativo' : pool.status === 'full' ? 'Lotado' : 'Inativo'}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-verde-600">{pool.apy}%</p>
                          <p className="text-sm text-grafite-600 dark:text-grafite-400">APY</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-grafite-600 dark:text-grafite-400">Stake Mínimo</p>
                            <p className="font-semibold text-grafite-900 dark:text-white">
                              {pool.minStake.toLocaleString()} LUNES
                            </p>
                          </div>
                          <div>
                            <p className="text-grafite-600 dark:text-grafite-400">Período de Lock</p>
                            <p className="font-semibold text-grafite-900 dark:text-white">
                              {pool.lockPeriod} dias
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-grafite-600 dark:text-grafite-400">Progresso do Pool</span>
                            <span className="font-semibold text-grafite-900 dark:text-white">
                              {pool.progress}%
                            </span>
                          </div>
                          <ProgressBar value={pool.progress} />
                        </div>

                        <div>
                          <p className="text-sm text-grafite-600 dark:text-grafite-400 mb-2">Benefícios:</p>
                          <div className="flex flex-wrap gap-1">
                            {pool.rewards.map((reward, idx) => (
                              <Badge key={idx} variant="default" className="text-xs">
                                {reward}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button 
                            variant="primary" 
                            className="flex-1"
                            disabled={pool.status !== 'active' || isLoading || !canStake || pool.minStake > getMaxStakeAmount()}
                            onClick={() => handleStake(pool.id, pool.minStake)}
                          >
                            {!canStake ? 'Sem Permissão' : 
                             pool.minStake > getMaxStakeAmount() ? 'Limite Excedido' :
                             isLoading ? 'Processando...' : 'Fazer Stake'}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedPool(pool.id)}
                          >
                            Detalhes
                          </Button>
                        </div>
                        
                        {/* Alertas de Limitação */}
                        {!canStake && (
                          <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="text-red-400" size={16} />
                              <p className="text-red-400 text-sm">
                                Você não tem permissão para fazer staking. Verifique seu KYC.
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {canStake && pool.minStake > getMaxStakeAmount() && (
                          <div className="mt-3 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="text-yellow-400" size={16} />
                              <p className="text-yellow-400 text-sm">
                                Stake mínimo ({pool.minStake.toLocaleString()} LUNES) excede seu limite ({getMaxStakeAmount().toLocaleString()} LUNES).
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {isVip && canStake && pool.minStake <= getMaxStakeAmount() && (
                          <div className="mt-3 p-3 bg-gradient-to-r from-yellow-500/20 to-purple-500/20 border border-yellow-500/30 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Crown className="text-yellow-400" size={16} />
                              <p className="text-yellow-400 text-sm">
                                Benefício VIP: Bônus de {getBonusMultiplier()}x nas recompensas!
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'my-stakes' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {mockUserStakes.length > 0 ? (
              mockUserStakes.map((stake, index) => {
                const pool = mockPools.find(p => p.id === stake.poolId);
                const daysRemaining = Math.ceil((stake.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                const progress = Math.max(0, Math.min(100, ((new Date().getTime() - stake.startDate.getTime()) / (stake.endDate.getTime() - stake.startDate.getTime())) * 100));
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-grafite-900 dark:text-white">
                              {pool?.name || 'Pool Desconhecido'}
                            </h3>
                            <p className="text-grafite-600 dark:text-grafite-400">
                              {stake.amount.toLocaleString()} LUNES em stake
                            </p>
                          </div>
                          <Badge 
                            variant={stake.status === 'active' ? 'success' : 'default'}
                          >
                            {stake.status === 'active' ? 'Ativo' : 'Concluído'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-grafite-600 dark:text-grafite-400">Recompensas Acumuladas</p>
                            <p className="text-lg font-bold text-verde-600">
                              {stake.rewards.toFixed(2)} LUNES
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-grafite-600 dark:text-grafite-400">Dias Restantes</p>
                            <p className="text-lg font-bold text-grafite-900 dark:text-white">
                              {daysRemaining > 0 ? `${daysRemaining} dias` : 'Disponível'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-grafite-600 dark:text-grafite-400">APY</p>
                            <p className="text-lg font-bold text-roxo-600">
                              {pool?.apy || 0}%
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-grafite-600 dark:text-grafite-400">Progresso do Período</span>
                            <span className="font-semibold text-grafite-900 dark:text-white">
                              {Math.min(progress, 100).toFixed(1)}%
                            </span>
                          </div>
                          <ProgressBar value={Math.min(progress, 100)} />
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            variant="primary" 
                            disabled={daysRemaining > 0 || isLoading || !canUnstake}
                            onClick={() => handleUnstake(stake.poolId, stake.amount)}
                          >
                            {!canUnstake ? 'Sem Permissão' :
                             daysRemaining > 0 ? 'Bloqueado' : 
                             isLoading ? 'Processando...' : 'Retirar Stake'}
                          </Button>
                          <Button 
                            variant="outline"
                            disabled={stake.rewards === 0 || isLoading || !canClaimRewards}
                            onClick={() => handleClaimRewards(stake.poolId)}
                          >
                            {!canClaimRewards ? 'Sem Permissão' : 'Resgatar Recompensas'}
                          </Button>
                        </div>
                        
                        {/* Alertas de Permissão */}
                        {(!canUnstake || !canClaimRewards) && (
                          <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Lock className="text-red-400" size={16} />
                              <p className="text-red-400 text-sm">
                                {!canUnstake && !canClaimRewards ? 'Você não tem permissão para unstake ou resgatar recompensas.' :
                                 !canUnstake ? 'Você não tem permissão para unstake.' :
                                 'Você não tem permissão para resgatar recompensas.'}
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Clock className="w-16 h-16 text-grafite-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-grafite-900 dark:text-white mb-2">
                    Nenhum Stake Ativo
                  </h3>
                  <p className="text-grafite-600 dark:text-grafite-400 mb-6">
                    Você ainda não possui stakes ativos. Comece fazendo stake em um dos pools disponíveis.
                  </p>
                  <Button 
                    variant="primary"
                    onClick={() => setActiveTab('pools')}
                  >
                    Ver Pools Disponíveis
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {activeTab === 'rewards' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Recompensas Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-grafite-600 dark:text-grafite-400">Total Ganho</p>
                      <p className="text-2xl font-bold text-verde-600">
                        {rewardsData.totalEarned.toFixed(2)} LUNES
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-verde-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-grafite-600 dark:text-grafite-400">Pendente</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {rewardsData.pendingRewards.toFixed(2)} LUNES
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-grafite-600 dark:text-grafite-400">Disponível</p>
                      <p className="text-2xl font-bold text-roxo-600">
                        {rewardsData.claimableRewards.toFixed(2)} LUNES
                      </p>
                    </div>
                    <Gift className="w-8 h-8 text-roxo-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-grafite-600 dark:text-grafite-400">Próxima Recompensa</p>
                      <p className="text-lg font-bold text-grafite-900 dark:text-white">
                        {rewardsData.nextRewardDate}
                      </p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-grafite-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ações de Recompensas */}
            <Card>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-grafite-900 dark:text-white">
                    Gerenciar Recompensas
                  </h3>
                  <Badge variant="success">
                    {rewardsData.claimableRewards.toFixed(2)} LUNES disponível
                  </Badge>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    variant="primary"
                    disabled={rewardsData.claimableRewards === 0 || isLoading || !canClaimRewards}
                    onClick={() => console.log('Claiming all rewards...')}
                    className="flex-1"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    {!canClaimRewards ? 'Sem Permissão' : 'Resgatar Todas as Recompensas'}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => console.log('Auto-compound enabled...')}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Auto-Compound
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas de Performance */}
            <Card>
              <CardContent>
                <h3 className="text-xl font-bold text-grafite-900 dark:text-white mb-6">
                  Estatísticas de Performance
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-roxo-600 mb-2">
                      {performanceStats.totalStaked.toLocaleString()}
                    </p>
                    <p className="text-sm text-grafite-600 dark:text-grafite-400">
                      Total em Stake (LUNES)
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-3xl font-bold text-verde-600 mb-2">
                      {performanceStats.averageAPY}%
                    </p>
                    <p className="text-sm text-grafite-600 dark:text-grafite-400">
                      APY Médio
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-600 mb-2">
                      {performanceStats.stakingDuration}
                    </p>
                    <p className="text-sm text-grafite-600 dark:text-grafite-400">
                      Dias de Staking
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-3xl font-bold text-grafite-900 dark:text-white mb-2">
                      {performanceStats.totalPools}
                    </p>
                    <p className="text-sm text-grafite-600 dark:text-grafite-400">
                      Pools Ativos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Filtros */}
            <Card>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-grafite-900 dark:text-white">
                    Histórico de Transações
                  </h3>
                  
                  <div className="flex gap-2">
                    {['all', 'stake', 'unstake', 'reward'].map((filter) => (
                      <Button
                        key={filter}
                        variant={rewardsFilter === filter ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setRewardsFilter(filter)}
                      >
                        {filter === 'all' ? 'Todos' : 
                         filter === 'stake' ? 'Stakes' :
                         filter === 'unstake' ? 'Unstakes' : 'Recompensas'}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Transações */}
            <div className="space-y-4">
              {stakingHistory
                .filter(tx => rewardsFilter === 'all' || tx.type === rewardsFilter)
                .map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'stake' ? 'bg-verde-100 text-verde-600' :
                            transaction.type === 'unstake' ? 'bg-red-100 text-red-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            {transaction.type === 'stake' ? <TrendingUp className="w-5 h-5" /> :
                             transaction.type === 'unstake' ? <AlertCircle className="w-5 h-5" /> :
                             <Gift className="w-5 h-5" />}
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-grafite-900 dark:text-white">
                              {transaction.type === 'stake' ? 'Stake' :
                               transaction.type === 'unstake' ? 'Unstake' : 'Recompensa'}
                            </h4>
                            <p className="text-sm text-grafite-600 dark:text-grafite-400">
                              {transaction.pool} • {transaction.date}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            transaction.type === 'unstake' ? 'text-red-600' : 'text-verde-600'
                          }`}>
                            {transaction.type === 'unstake' ? '-' : '+'}{transaction.amount.toLocaleString()} LUNES
                          </p>
                          <p className="text-xs text-grafite-500">
                            {transaction.txHash}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'tiers' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stakingTiers.map((tier, index) => {
              const Icon = tier.icon;
              const userQualifies = totalStaked >= tier.minAmount;
              
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={userQualifies ? 'ring-2 ring-roxo-500' : ''}>
                    <CardContent>
                      <div className="text-center mb-4">
                        <Icon className={`w-12 h-12 mx-auto mb-2 ${tier.color}`} />
                        <h3 className="text-xl font-bold text-grafite-900 dark:text-white">
                          {tier.name}
                        </h3>
                        <p className="text-sm text-grafite-600 dark:text-grafite-400">
                          Mínimo: {tier.minAmount.toLocaleString()} LUNES
                        </p>
                        {userQualifies && (
                          <Badge variant="success" className="mt-2">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Qualificado
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-grafite-900 dark:text-white mb-2">
                          Benefícios:
                        </p>
                        {tier.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-verde-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-grafite-600 dark:text-grafite-400">
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>

                      {!userQualifies && (
                        <div className="mt-4 p-3 bg-grafite-50 dark:bg-grafite-800 rounded-lg">
                          <p className="text-xs text-grafite-600 dark:text-grafite-400">
                            Você precisa de mais {(tier.minAmount - totalStaked).toLocaleString()} LUNES em stake
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}