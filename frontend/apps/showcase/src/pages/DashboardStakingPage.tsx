import React, { useEffect } from "react";
import { Card } from "@launchpad/shared-ui";
import { Badge } from "../components/ui/Badge";
import { FadeIn } from "../components/animations/FadeIn";
import { ScaleIn } from "../components/animations/ScaleIn";
import { useLaunchpoolStore } from "../stores/launchpoolStore";
import { useWallet } from "../contexts/WalletContext";
import { 
  useUserStaking,
  useStakingPools,
  useStake,
  useUnstake,
  useClaimStakingRewards
} from "../hooks/useApi";
import { 
  TrendingUp, 
  Clock, 
  Users, 
  Coins, 
  Crown,
  Shield,
  Zap,
  Award,
  BarChart3,
  DollarSign,
  Target,
  Gift
} from "lucide-react";

/**
 * Página de Staking do Dashboard - Interface personalizada para staking dentro do dashboard
 * Exibe pools de staking, métricas do usuário e funcionalidades VIP
 */
export default function DashboardStakingPage() {
  const { 
    pools, 
    userStakes,
    isLoading: poolsLoading, 
    fetchPools,
    fetchUserStakes,
    claimRewards
  } = useLaunchpoolStore();
  
  const { selectedAccount } = useWallet();
  const { data: userStaking, isLoading: userStakingLoading } = useUserStaking("");
  const { data: stakingPools } = useStakingPools();
  const stakeMutation = useStake();
  const unstakeMutation = useUnstake();
  const claimMutation = useClaimStakingRewards();

  useEffect(() => {
    fetchPools();
    if (selectedAccount?.address) {
        fetchUserStakes(selectedAccount.address);
    }
  }, [fetchPools, fetchUserStakes, selectedAccount?.address]);

  // Função auxiliar para encontrar stake do usuário por pool
  const getUserStakeByPool = (poolId: string) => {
    return userStakes?.find((stake: any) => stake.poolId === poolId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "coming_soon":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "ended":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "coming_soon":
        return "Em Breve";
      case "ended":
        return "Finalizado";
      default:
        return "Inativo";
    }
  };

  // Métricas do usuário (mockadas para demonstração)
  const userMetrics = {
    totalStaked: 25000,
    totalRewards: 1250,
    activeStakes: 3,
    averageAPY: 42.5,
    vipMultiplier: 2.0,
    nextRewardClaim: "2024-01-15"
  };

  // Staking Tiers VIP
  const stakingTiers = [
    {
      name: "Bronze",
      minStake: 1000,
      multiplier: 1.0,
      benefits: ["Acesso básico", "Recompensas padrão"],
      color: "from-amber-600 to-amber-800",
      icon: Shield
    },
    {
      name: "Silver", 
      minStake: 5000,
      multiplier: 1.25,
      benefits: ["Recompensas 25% maiores", "Acesso prioritário"],
      color: "from-gray-400 to-gray-600",
      icon: Award
    },
    {
      name: "Gold",
      minStake: 15000,
      multiplier: 1.5,
      benefits: ["Recompensas 50% maiores", "Pools exclusivos"],
      color: "from-yellow-400 to-yellow-600",
      icon: Crown
    },
    {
      name: "Diamond",
      minStake: 50000,
      multiplier: 2.0,
      benefits: ["Recompensas 100% maiores", "Acesso VIP completo"],
      color: "from-blue-400 to-purple-600",
      icon: Zap
    }
  ];

  if (poolsLoading || userStakingLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-roxo mx-auto"></div>
          <p className="mt-4 text-grafite-600 dark:text-grafite-300">Carregando dados de staking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Coins className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">
              Dashboard de Staking
            </h1>
          </div>
          <p className="text-lg text-gray-300 max-w-3xl">
            Gerencie seus stakes, monitore recompensas e acesse pools exclusivos VIP.
            Maximize seus retornos com estratégias de staking inteligentes.
          </p>
        </div>
      </FadeIn>

      {/* Métricas do Usuário */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Total Staked</p>
                <p className="text-2xl font-bold text-white">${userMetrics.totalStaked.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-400" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium">Total Rewards</p>
                <p className="text-2xl font-bold text-white">${userMetrics.totalRewards.toLocaleString()}</p>
              </div>
              <Gift className="w-8 h-8 text-green-400" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Active Stakes</p>
                <p className="text-2xl font-bold text-white">{userMetrics.activeStakes}</p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm font-medium">Average APY</p>
                <p className="text-2xl font-bold text-white">{userMetrics.averageAPY}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400" />
            </div>
          </Card>
        </div>
      </FadeIn>

      {/* Staking Tiers VIP */}
      <FadeIn delay={0.2}>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            Tiers de Staking VIP
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stakingTiers.map((tier, index) => {
              const Icon = tier.icon;
              const isActive = userMetrics.totalStaked >= tier.minStake;
              
              return (
                <ScaleIn key={tier.name} delay={index * 0.1}>
                  <Card className={`relative overflow-hidden transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-br ' + tier.color + ' border-white/30 shadow-lg' 
                      : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50'
                  }`}>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-lg font-bold ${
                          isActive ? 'text-white' : 'text-gray-300'
                        }`}>
                          {tier.name}
                        </h3>
                        <Icon className={`w-6 h-6 ${
                          isActive ? 'text-white' : 'text-gray-400'
                        }`} />
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <p className={`text-sm ${
                          isActive ? 'text-white/80' : 'text-gray-400'
                        }`}>
                          Min: ${tier.minStake.toLocaleString()}
                        </p>
                        <p className={`text-sm font-medium ${
                          isActive ? 'text-white' : 'text-gray-300'
                        }`}>
                          Multiplicador: {tier.multiplier}x
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        {tier.benefits.map((benefit, i) => (
                          <p key={i} className={`text-xs ${
                            isActive ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            • {benefit}
                          </p>
                        ))}
                      </div>
                      
                      {isActive && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-white/20 text-white text-xs px-2 py-1">
                            Ativo
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Card>
                </ScaleIn>
              );
            })}
          </div>
        </div>
      </FadeIn>

      {/* Pools de Staking Disponíveis */}
      <FadeIn delay={0.3}>
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Pools de Staking Disponíveis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pools.map((pool, index) => {
              const userStake = getUserStakeByPool(pool.id);
              
              return (
                <ScaleIn key={pool.id} delay={index * 0.1}>
                  <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                            {pool.name}
                          </h3>
                          <Badge className={`${getStatusColor(pool.status)} text-xs px-2 py-1 rounded-full font-medium`}>
                            {getStatusText(pool.status)}
                          </Badge>
                        </div>
                        <div className="ml-4">
                          <Coins className="w-8 h-8 text-purple-400" />
                        </div>
                      </div>

                      {/* Métricas do Pool */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">APY</p>
                          <p className="text-green-400 text-lg font-bold">{pool.apy}%</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">TVL</p>
                          <p className="text-white text-lg font-bold">
                            ${pool.totalStaked ? parseFloat(pool.totalStaked).toLocaleString() : '0'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Participantes</p>
                          <p className="text-blue-400 text-lg font-bold flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {pool.participants || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Tempo Restante</p>
                          <p className="text-orange-400 text-lg font-bold flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {pool.endDate ? Math.ceil((pool.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) + ' dias' : 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Stake do Usuário */}
                      {userStake && (
                        <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3 mb-4">
                          <p className="text-purple-200 text-sm font-medium mb-1">Seu Stake</p>
                          <p className="text-white text-lg font-bold">
                            ${userStake.amount.toLocaleString()}
                          </p>
                          <p className="text-green-400 text-sm">
                            Recompensas: ${userStake.pendingRewards?.toLocaleString() || '0'}
                          </p>
                        </div>
                      )}

                      {/* Ações */}
                      <div className="flex gap-2">
                        {pool.status === 'active' && (
                          <>
                            <button 
                              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                              onClick={() => console.log('Stake in pool:', pool.id)}
                            >
                              {userStake ? 'Aumentar Stake' : 'Fazer Stake'}
                            </button>
                            {userStake && (
                              <button 
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                onClick={() => console.log('Unstake from pool:', pool.id)}
                              >
                                Unstake
                              </button>
                            )}
                          </>
                        )}
                        {userStake?.pendingRewards && parseFloat(userStake.pendingRewards) > 0 && (
                          <button 
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            onClick={() => {
                                if (selectedAccount) {
                                    claimRewards(pool.id, selectedAccount).then(() => {
                                        fetchUserStakes(selectedAccount.address);
                                    });
                                }
                            }}
                          >
                            Claim
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                </ScaleIn>
              );
            })}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}