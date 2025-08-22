import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Users,
  Zap,
  Rocket,
  Target,
  Clock,
  Gift,
  Crown,
  Star,
  Award,
  Coins,
  DollarSign,
  BarChart3,
  Lock,
  Unlock,
  Plus,
  Minus,
  Info,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Button, Input } from '@launchpad/shared-ui';
import { FadeIn } from '../components/animations/FadeIn';
import { ScaleIn } from '../components/animations/ScaleIn';
import { SlideIn } from '../components/animations/SlideIn';
import { useLaunchpoolStore } from '../stores/launchpoolStore';
import { useStakingPools, useUserStaking } from '../hooks/useApi';
import { useWallet } from '../contexts/WalletContext';
import { useAuth } from '../contexts/AuthContext';

/**
 * Página de Staking - Interface completa para staking de tokens
 * Inclui Staking Tiers, pools disponíveis, dashboard de recompensas e histórico
 */
export default function StakingPage() {
  const { selectedAccount, isReady } = useWallet();
  const { user } = useAuth();
  const {
    pools,
    userStakes,
    isLoading,
    fetchPools,
    fetchUserStakes,
    stakeTokens,
    unstakeTokens,
    claimRewards,
  } = useLaunchpoolStore();
  const { data: userStaking } = useUserStaking(selectedAccount?.address || '');

  // Estados locais
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake' | 'rewards'>('stake');
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper function para encontrar stake do usuário por pool
  const getUserStakeByPool = (poolId: string) => {
    return userStakes.find(stake => stake.poolId === poolId);
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    fetchPools();
    if (selectedAccount?.address) {
      fetchUserStakes();
    }
  }, [fetchPools, fetchUserStakes, selectedAccount?.address]);

  // Definição dos Staking Tiers
  const stakingTiers = [
    {
      id: 'tier-s',
      name: 'TIER S',
      icon: Crown,
      minStake: '100,000',
      color: 'from-yellow-400 to-orange-500',
      benefits: [
        'Marketing Premium + Destaque Principal',
        'Colocação Garantida em Todos os Projetos',
        'Taxas Reduzidas: 0% (Gratuito)',
        'Suporte Prioritário 24/7',
        'Acesso Exclusivo ao Smart Fund',
        'Programa de Afiliados Premium (15%)'
      ]
    },
    {
      id: 'tier-a',
      name: 'TIER A',
      icon: Star,
      minStake: '50,000',
      color: 'from-purple-400 to-pink-500',
      benefits: [
        'Marketing Avançado + Destaque',
        'Colocação Prioritária',
        'Taxas Reduzidas: 1%',
        'Suporte Prioritário',
        'Acesso ao Smart Fund',
        'Programa de Afiliados (10%)'
      ]
    },
    {
      id: 'tier-b',
      name: 'TIER B',
      icon: Award,
      minStake: '25,000',
      color: 'from-blue-400 to-cyan-500',
      benefits: [
        'Marketing Padrão',
        'Colocação Regular',
        'Taxas Reduzidas: 2%',
        'Suporte Padrão',
        'Acesso Limitado ao Smart Fund',
        'Programa de Afiliados (5%)'
      ]
    },
    {
      id: 'tier-c',
      name: 'TIER C',
      icon: Target,
      minStake: '10,000',
      color: 'from-green-400 to-teal-500',
      benefits: [
        'Marketing Básico',
        'Colocação Padrão',
        'Taxas Padrão: 3%',
        'Suporte Básico',
        'Sem Acesso ao Smart Fund',
        'Programa de Afiliados (2%)'
      ]
    }
  ];

  // Calcular tier atual do usuário
  const getCurrentTier = () => {
    if (!userStaking?.totalStaked) return null;
    const totalStaked = parseFloat(userStaking.totalStaked.replace(/,/g, ''));
    
    if (totalStaked >= 100000) return stakingTiers[0];
    if (totalStaked >= 50000) return stakingTiers[1];
    if (totalStaked >= 25000) return stakingTiers[2];
    if (totalStaked >= 10000) return stakingTiers[3];
    return null;
  };

  // Função para fazer stake
  const handleStake = async () => {
    if (!selectedPool || !stakeAmount || !selectedAccount?.address) return;
    
    setIsProcessing(true);
    try {
      await stakeTokens(selectedPool, stakeAmount);
      setStakeAmount('');
      setShowStakeModal(false);
      // Recarregar dados
      fetchUserStakes();
    } catch (error) {
      console.error('Erro ao fazer stake:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Função para fazer unstake
  const handleUnstake = async () => {
    if (!selectedPool || !unstakeAmount || !selectedAccount?.address) return;
    
    setIsProcessing(true);
    try {
      await unstakeTokens(selectedPool, unstakeAmount);
      setUnstakeAmount('');
      setShowUnstakeModal(false);
      // Recarregar dados
      fetchUserStakes();
    } catch (error) {
      console.error('Erro ao fazer unstake:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Função para reivindicar recompensas
  const handleClaimRewards = async (poolId: string) => {
    if (!selectedAccount?.address) return;
    
    setIsProcessing(true);
    try {
      await claimRewards(poolId);
      // Recarregar dados
      fetchUserStakes();
    } catch (error) {
      console.error('Erro ao reivindicar recompensas:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentTier = getCurrentTier();

  return (
    <div className="min-h-screen bg-gradient-to-br from-grafite-900 via-grafite-800 to-grafite-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-roxo-600/20 to-laranja-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-roxo-600/20 to-laranja-600/20 rounded-full border border-roxo-500/30 mb-6"
              >
                <Zap className="w-4 h-4 text-laranja-400 mr-2" />
                <span className="text-sm font-medium text-white">Sistema de Staking Lunes</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                <span className="text-roxo-400">Staking</span> Inteligente
              </h1>
              
              <p className="text-xl text-grafite-300 max-w-3xl mx-auto mb-8">
                Maximize seus retornos com nosso sistema de staking por tiers. 
                Quanto mais você investe, maiores são os benefícios e recompensas.
              </p>

              {/* Estatísticas Rápidas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                <ScaleIn delay={0.1}>
                  <Card className="p-6 bg-grafite-800/50 border-grafite-700">
                    <div className="text-center">
                      <DollarSign className="w-8 h-8 text-laranja-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">
                        {userStaking?.totalStaked || '0'}
                      </p>
                      <p className="text-sm text-grafite-400">Total em Staking</p>
                    </div>
                  </Card>
                </ScaleIn>
                
                <ScaleIn delay={0.2}>
                  <Card className="p-6 bg-grafite-800/50 border-grafite-700">
                    <div className="text-center">
                      <Gift className="w-8 h-8 text-roxo-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">
                        {userStaking?.totalRewards || '0'}
                      </p>
                      <p className="text-sm text-grafite-400">Recompensas</p>
                    </div>
                  </Card>
                </ScaleIn>
                
                <ScaleIn delay={0.3}>
                  <Card className="p-6 bg-grafite-800/50 border-grafite-700">
                    <div className="text-center">
                      <BarChart3 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">
                        {pools.length}
                      </p>
                      <p className="text-sm text-grafite-400">Pools Ativos</p>
                    </div>
                  </Card>
                </ScaleIn>
                
                <ScaleIn delay={0.4}>
                  <Card className="p-6 bg-grafite-800/50 border-grafite-700">
                    <div className="text-center">
                      {currentTier ? (
                        <currentTier.icon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      ) : (
                        <Target className="w-8 h-8 text-grafite-400 mx-auto mb-2" />
                      )}
                      <p className="text-2xl font-bold text-white">
                        {currentTier?.name || 'Nenhum'}
                      </p>
                      <p className="text-sm text-grafite-400">Tier Atual</p>
                    </div>
                  </Card>
                </ScaleIn>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Staking Tiers Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                <span className="text-laranja-400">Staking</span> Tiers
              </h2>
              <p className="text-xl text-grafite-300 max-w-3xl mx-auto">
                Escolha seu nível de investimento e desbloqueie benefícios exclusivos
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stakingTiers.map((tier, index) => {
              const Icon = tier.icon;
              const isCurrentTier = currentTier?.id === tier.id;
              
              return (
                <ScaleIn key={tier.id} delay={index * 0.1}>
                  <Card className={`relative p-6 h-full transition-all duration-300 hover:scale-105 ${
                    isCurrentTier 
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 shadow-lg shadow-yellow-500/25' 
                      : 'bg-grafite-800/50 border-grafite-700 hover:border-grafite-600'
                  }`}>
                    {isCurrentTier && (
                      <div className="absolute -top-3 -right-3">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          SEU TIER
                        </div>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${tier.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                      <p className="text-grafite-300">
                        Mínimo: <span className="font-semibold text-white">{tier.minStake} LUNES</span>
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {tier.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-start space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-grafite-300">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </ScaleIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pools de Staking Section */}
      <section className="py-20 bg-grafite-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Pools de <span className="text-roxo-400">Staking</span>
              </h2>
              <p className="text-xl text-grafite-300 max-w-3xl mx-auto">
                Escolha entre nossos pools de staking e comece a ganhar recompensas
              </p>
            </div>
          </FadeIn>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-grafite-800 rounded-lg p-1">
              {(['stake', 'unstake', 'rewards'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-roxo-600 to-laranja-600 text-white shadow-lg'
                      : 'text-grafite-300 hover:text-white'
                  }`}
                >
                  {tab === 'stake' && 'Fazer Staking'}
                  {tab === 'unstake' && 'Retirar Staking'}
                  {tab === 'rewards' && 'Recompensas'}
                </button>
              ))}
            </div>
          </div>

          {/* Conteúdo das Tabs */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pools.map((pool, index) => (
              <ScaleIn key={pool.id} delay={index * 0.1}>
                <Card className="p-6 bg-grafite-800/50 border-grafite-700 hover:border-grafite-600 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{pool.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Coins className="w-5 h-5 text-laranja-400" />
                      <span className="text-sm font-medium text-laranja-400">{pool.token}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-grafite-300">APY:</span>
                      <span className="font-semibold text-green-400">{pool.apy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-grafite-300">Total Staked:</span>
                      <span className="font-semibold text-white">{pool.totalStaked}</span>
                    </div>
                    {getUserStakeByPool(pool.id)?.amount && (
                      <div className="flex justify-between">
                        <span className="text-grafite-300">Seu Stake:</span>
                        <span className="font-semibold text-roxo-400">{getUserStakeByPool(pool.id)!.amount}</span>
                      </div>
                    )}
                    {getUserStakeByPool(pool.id)?.pendingRewards && (
                      <div className="flex justify-between">
                        <span className="text-grafite-300">Recompensas:</span>
                        <span className="font-semibold text-yellow-400">{getUserStakeByPool(pool.id)!.pendingRewards}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-grafite-300">Lock Period:</span>
                      <span className="font-semibold text-white">{pool.lockPeriod} dias</span>
                    </div>
                  </div>
                  
                  {activeTab === 'stake' && (
                    <Button
                      onClick={() => {
                        setSelectedPool(pool.id);
                        setShowStakeModal(true);
                      }}
                      className="w-full bg-gradient-to-r from-roxo-600 to-laranja-600 hover:from-roxo-700 hover:to-laranja-700"
                      disabled={!isReady || pool.status !== 'active'}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Fazer Staking
                    </Button>
                  )}
                  
                  {activeTab === 'unstake' && getUserStakeByPool(pool.id)?.amount && (
                    <Button
                      onClick={() => {
                        setSelectedPool(pool.id);
                        setShowUnstakeModal(true);
                      }}
                      variant="outline"
                      className="w-full border-grafite-600 text-grafite-300 hover:bg-grafite-700"
                      disabled={!isReady || !getUserStakeByPool(pool.id)?.amount || getUserStakeByPool(pool.id)?.amount === '0'}
                    >
                      <Minus className="w-4 h-4 mr-2" />
                      Retirar Staking
                    </Button>
                  )}
                  
                  {activeTab === 'rewards' && getUserStakeByPool(pool.id)?.pendingRewards && parseFloat(getUserStakeByPool(pool.id)!.pendingRewards) > 0 && (
                    <Button
                      onClick={() => handleClaimRewards(pool.id)}
                      className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                      disabled={!isReady || isProcessing || !getUserStakeByPool(pool.id)?.pendingRewards || getUserStakeByPool(pool.id)?.pendingRewards === '0'}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Gift className="w-4 h-4 mr-2" />
                      )}
                      Reivindicar Recompensas
                    </Button>
                  )}
                </Card>
              </ScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto para <span className="text-laranja-400">Começar</span>?
            </h2>
            <p className="text-xl text-grafite-300 mb-8">
              Conecte sua carteira e comece a ganhar recompensas hoje mesmo
            </p>
            
            {!isReady ? (
              <Button
                size="lg"
                className="bg-gradient-to-r from-roxo-600 to-laranja-600 hover:from-roxo-700 hover:to-laranja-700 px-8 py-4 text-lg"
              >
                <Shield className="w-5 h-5 mr-2" />
                Conectar Carteira
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-grafite-600 text-grafite-300 hover:bg-grafite-700 px-8 py-4"
                  >
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Ver Dashboard
                  </Button>
                </Link>
                <Link to="/launchpool">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-roxo-600 to-laranja-600 hover:from-roxo-700 hover:to-laranja-700 px-8 py-4"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Explorar Launchpool
                  </Button>
                </Link>
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* Modais de Stake/Unstake */}
      {showStakeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 bg-grafite-800 border-grafite-700">
            <h3 className="text-xl font-bold text-white mb-4">Fazer Staking</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-grafite-300 mb-2">
                  Quantidade (LUNES)
                </label>
                <Input
                  type="number"
                  value={stakeAmount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStakeAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-grafite-700 border-grafite-600 text-white"
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowStakeModal(false)}
                  variant="outline"
                  className="flex-1 border-grafite-600 text-grafite-300"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleStake}
                  disabled={!stakeAmount || isProcessing}
                  className="flex-1 bg-gradient-to-r from-roxo-600 to-laranja-600"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    'Confirmar'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showUnstakeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 bg-grafite-800 border-grafite-700">
            <h3 className="text-xl font-bold text-white mb-4">Retirar Staking</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-grafite-300 mb-2">
                  Quantidade (LUNES)
                </label>
                <Input
                  type="number"
                  value={unstakeAmount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUnstakeAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-grafite-700 border-grafite-600 text-white"
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowUnstakeModal(false)}
                  variant="outline"
                  className="flex-1 border-grafite-600 text-grafite-300"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUnstake}
                  disabled={!unstakeAmount || isProcessing}
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    'Confirmar'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}