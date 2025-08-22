import { useState } from "react";
import {
  Wallet,
  TrendingUp,
  Coins,
  Gift,
  Crown,
  Shield,
  ArrowUpRight,
  Star,
  Trophy,
  History,
  Target,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth, useIsVip, useIsVerified } from "../../contexts/AuthContext";

/**
 * Dashboard principal para investidores
 * Adapta-se baseado no tipo de investidor (padrão, verificado, VIP)
 *
 * Funcionalidades:
 * - Portfolio completo com métricas detalhadas
 * - Staking e recompensas
 * - Rifas e sorteios (VIP)
 * - Histórico de transações
 * - Projetos favoritos
 * - Analytics pessoais
 * - Notificações e alertas
 */
export function InvestorDashboard() {
  const { user } = useAuth();
  const isVip = useIsVip();
  const isVerified = useIsVerified();
  const [activeTab, setActiveTab] = useState("overview");

  // Dados mockados - em produção viriam do smart contract
  const portfolioData = {
    totalInvested: user?.metrics?.totalInvested
      ? Number(user.metrics.totalInvested) / 1e12
      : 0,
    currentValue: 15750,
    totalReturns: 2250,
    returnsPercentage: 16.7,
    tokensInVesting: 45000,
    availableToClaim: 8500,
    stakingRewards: 1200,
    participationRewards: 350,
    totalStaked: 50000,
    stakingApr: 12.5,
    nextRewardDate: "2024-02-15",
    vipLevel: isVip ? "Diamond" : null,
    loyaltyPoints: 8750,
  };

  // Dados de staking
  const stakingPools = [
    {
      id: 1,
      name: "LUNES Staking",
      apr: 12.5,
      totalStaked: 50000,
      rewards: 520,
      lockPeriod: "30 dias",
      status: "active",
    },
    {
      id: 2,
      name: "VIP Pool",
      apr: 18.0,
      totalStaked: 25000,
      rewards: 375,
      lockPeriod: "90 dias",
      status: "locked",
      vipOnly: true,
    },
  ];

  // Rifas disponíveis (VIP)
  const availableRaffles = [
    {
      id: 1,
      title: "Tesla Model S Plaid",
      description: "Carro elétrico premium",
      ticketPrice: 100,
      totalTickets: 10000,
      soldTickets: 7500,
      endDate: "2024-03-01",
      image: "/api/placeholder/300/200",
      vipOnly: true,
    },
    {
      id: 2,
      title: "iPhone 15 Pro Max",
      description: "Smartphone Apple mais recente",
      ticketPrice: 25,
      totalTickets: 5000,
      soldTickets: 3200,
      endDate: "2024-02-20",
      image: "/api/placeholder/300/200",
      vipOnly: false,
    },
  ];

  // Histórico de transações
  const transactionHistory = [
    {
      id: 1,
      type: "investment",
      project: "DeFi Protocol Alpha",
      amount: 5000,
      date: "2024-01-15",
      status: "completed",
      hash: "0x1234...5678",
    },
    {
      id: 2,
      type: "reward",
      project: "Staking Rewards",
      amount: 125,
      date: "2024-01-14",
      status: "completed",
      hash: "0x2345...6789",
    },
    {
      id: 3,
      type: "raffle",
      project: "Rifa VIP #001",
      amount: -100,
      date: "2024-01-13",
      status: "completed",
      hash: "0x3456...7890",
    },
  ];

  const recentInvestments = [
    {
      project: "DeFi Revolution",
      amount: 5000,
      phase: "Whitelist",
      discount: 50,
      status: "vesting",
      date: "2024-01-15",
    },
    {
      project: "NFT Marketplace",
      amount: 3000,
      phase: "Pre-Sale",
      discount: 20,
      status: "completed",
      date: "2024-01-10",
    },
    {
      project: "Cross-Chain Bridge",
      amount: 7500,
      phase: "Public Sale",
      discount: 0,
      status: "active",
      date: "2024-01-20",
    },
  ];

  const upcomingProjects = [
    {
      name: "AI Trading Bot",
      phase: "Whitelist",
      startsIn: "2 dias",
      discount: 45,
      minInvestment: 100,
    },
    {
      name: "GameFi Platform",
      phase: "Pre-Sale",
      startsIn: "5 dias",
      discount: 25,
      minInvestment: 50,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header com status VIP/Verificado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-grafite dark:text-grafite-50">
            {isVip ? "💎 Dashboard VIP" : "🚀 Meu Dashboard"}
          </h1>
          <p className="text-gray-600 dark:text-grafite-300">
            {isVip
              ? "Acesso exclusivo a oportunidades premium"
              : "Acompanhe seus investimentos e oportunidades"}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {isVerified && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-verde-50 text-verde-700 rounded-full text-sm">
              <Shield className="w-4 h-4" />
              <span>Verificado</span>
            </div>
          )}

          {isVip && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-roxo-50 to-laranja-50 text-roxo rounded-full text-sm">
              <Crown className="w-4 h-4" />
              <span>VIP</span>
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-grafite-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-grafite-700 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-grafite-300">
                Total Investido
              </p>
              <p className="text-2xl font-bold text-grafite dark:text-grafite-50">
                {portfolioData.totalInvested.toLocaleString()} LUNES
              </p>
            </div>
            <div className="w-12 h-12 bg-roxo-100 dark:bg-roxo-900 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-roxo dark:text-roxo-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-grafite-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-grafite-700 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-grafite-300">
                Valor Atual
              </p>
              <p className="text-2xl font-bold text-grafite dark:text-grafite-50">
                {portfolioData.currentValue.toLocaleString()} LUNES
              </p>
            </div>
            <div className="w-12 h-12 bg-verde-100 dark:bg-verde-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-verde dark:text-verde-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-verde mr-1" />
            <span className="text-verde">
              +{portfolioData.returnsPercentage}%
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-grafite-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-grafite-700 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-grafite-300">
                Disponível para Claim
              </p>
              <p className="text-2xl font-bold text-laranja dark:text-laranja-400">
                {portfolioData.availableToClaim.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-laranja-100 dark:bg-laranja-900 rounded-lg flex items-center justify-center">
              <Gift className="w-6 h-6 text-laranja dark:text-laranja-400" />
            </div>
          </div>
          <button className="mt-2 text-sm text-laranja hover:text-laranja-700 dark:text-laranja-400 dark:hover:text-laranja-300 font-medium">
            Resgatar Agora →
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-grafite-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-grafite-700 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-grafite-300">
                Em Staking
              </p>
              <p className="text-2xl font-bold text-grafite dark:text-grafite-50">
                {user?.metrics?.totalStaked
                  ? Number(user.metrics.totalStaked) / 1e12
                  : 0}{" "}
                LUNES
              </p>
            </div>
            <div className="w-12 h-12 bg-grafite-100 dark:bg-grafite-700 rounded-lg flex items-center justify-center">
              <Coins className="w-6 h-6 text-grafite dark:text-grafite-300" />
            </div>
          </div>
          <div className="mt-2 text-sm text-verde">
            +{portfolioData.stakingRewards} LUNES em recompensas
          </div>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-grafite-800 rounded-xl shadow-sm border border-gray-200 dark:border-grafite-700 p-1 transition-colors duration-200">
        <div className="flex space-x-1">
          {[
            { id: "overview", label: "Visão Geral", icon: BarChart3 },
            { id: "staking", label: "Staking", icon: Coins },
            { id: "history", label: "Histórico", icon: History },
            ...(isVip
              ? [{ id: "raffles", label: "Rifas VIP", icon: Trophy }]
              : []),
            { id: "analytics", label: "Analytics", icon: PieChart },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-roxo text-white"
                    : "text-gray-600 dark:text-grafite-300 hover:text-grafite dark:hover:text-grafite-100 hover:bg-gray-50 dark:hover:bg-grafite-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Investments */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-grafite mb-4">
              Investimentos Recentes
            </h3>
            <div className="space-y-4">
              {recentInvestments.map((investment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-grafite">
                      {investment.project}
                    </p>
                    <p className="text-sm text-gray-600">
                      {investment.phase} • {investment.discount}% desconto
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-grafite">
                      {investment.amount} LUNES
                    </p>
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        investment.status === "completed"
                          ? "bg-verde-100 text-verde-700"
                          : investment.status === "vesting"
                            ? "bg-laranja-100 text-laranja-700"
                            : "bg-roxo-100 text-roxo-700"
                      }`}
                    >
                      {investment.status === "completed"
                        ? "Completo"
                        : investment.status === "vesting"
                          ? "Vesting"
                          : "Ativo"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Projects */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-grafite mb-4">
              {isVip ? "💎 Projetos VIP" : "🚀 Próximos Projetos"}
            </h3>
            <div className="space-y-4">
              {upcomingProjects.map((project, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:border-roxo-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-grafite">{project.name}</h4>
                    {isVip && <Crown className="w-4 h-4 text-laranja" />}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-600">{project.phase}</span>
                      <span className="mx-2">•</span>
                      <span className="text-verde">
                        {project.discount}% desconto
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-grafite font-medium">
                        Inicia em {project.startsIn}
                      </div>
                      <div className="text-gray-500">
                        Min: {project.minInvestment} LUNES
                      </div>
                    </div>
                  </div>
                  <button className="mt-3 w-full py-2 bg-roxo text-white rounded-lg hover:bg-roxo-700 transition-colors text-sm font-medium">
                    {isVip ? "Acesso VIP Garantido" : "Notificar-me"}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Staking Tab */}
      {activeTab === "staking" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stakingPools.map((pool) => (
              <motion.div
                key={pool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-grafite">
                    {pool.name}
                  </h3>
                  {pool.vipOnly && <Crown className="w-5 h-5 text-laranja" />}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">APR</span>
                    <span className="font-semibold text-verde">
                      {pool.apr}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Staked</span>
                    <span className="font-semibold">
                      {pool.totalStaked.toLocaleString()} LUNES
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recompensas</span>
                    <span className="font-semibold text-laranja">
                      {pool.rewards} LUNES
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lock Period</span>
                    <span className="font-semibold">{pool.lockPeriod}</span>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 py-2 bg-roxo text-white rounded-lg hover:bg-roxo-700 transition-colors text-sm font-medium">
                    {pool.status === "active" ? "Stake Mais" : "Unstake"}
                  </button>
                  <button className="px-4 py-2 border border-laranja text-laranja rounded-lg hover:bg-laranja-50 transition-colors text-sm font-medium">
                    Claim
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-grafite mb-4">
            Histórico de Transações
          </h3>
          <div className="space-y-4">
            {transactionHistory.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === "investment"
                        ? "bg-roxo-100"
                        : tx.type === "reward"
                          ? "bg-verde-100"
                          : "bg-laranja-100"
                    }`}
                  >
                    {tx.type === "investment" && (
                      <Target className="w-5 h-5 text-roxo" />
                    )}
                    {tx.type === "reward" && (
                      <Gift className="w-5 h-5 text-verde" />
                    )}
                    {tx.type === "raffle" && (
                      <Trophy className="w-5 h-5 text-laranja" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-grafite">{tx.project}</p>
                    <p className="text-sm text-gray-600">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      tx.amount > 0 ? "text-verde" : "text-red-600"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount} LUNES
                  </p>
                  <p className="text-xs text-gray-500">{tx.hash}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Raffles Tab (VIP Only) */}
      {activeTab === "raffles" && isVip && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableRaffles.map((raffle) => (
            <motion.div
              key={raffle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-roxo-100 to-laranja-100 flex items-center justify-center">
                <Trophy className="w-16 h-16 text-laranja" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-grafite">
                    {raffle.title}
                  </h3>
                  {raffle.vipOnly && <Crown className="w-5 h-5 text-laranja" />}
                </div>
                <p className="text-gray-600 mb-4">{raffle.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>
                      {raffle.soldTickets}/{raffle.totalTickets} tickets
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-roxo to-laranja h-2 rounded-full"
                      style={{
                        width: `${(raffle.soldTickets / raffle.totalTickets) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Preço do Ticket</p>
                    <p className="font-semibold text-grafite">
                      {raffle.ticketPrice} LUNES
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Termina em</p>
                    <p className="font-semibold text-grafite">
                      {raffle.endDate}
                    </p>
                  </div>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-roxo to-laranja text-white rounded-lg hover:opacity-90 transition-opacity font-medium">
                  Comprar Tickets
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-grafite mb-4">
              Performance do Portfolio
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">ROI Total</span>
                <span className="font-semibold text-verde">
                  +{portfolioData.returnsPercentage}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Melhor Investimento</span>
                <span className="font-semibold text-grafite">
                  DeFi Alpha (+45%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Diversificação</span>
                <span className="font-semibold text-grafite">8 projetos</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pontos de Fidelidade</span>
                <span className="font-semibold text-laranja">
                  {portfolioData.loyaltyPoints}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-grafite mb-4">
              Atividade Recente
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-verde" />
                <div>
                  <p className="text-sm font-medium text-grafite">
                    Staking rewards recebidas
                  </p>
                  <p className="text-xs text-gray-600">Há 2 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-roxo" />
                <div>
                  <p className="text-sm font-medium text-grafite">
                    Investimento confirmado
                  </p>
                  <p className="text-xs text-gray-600">Há 1 dia</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-laranja" />
                <div>
                  <p className="text-sm font-medium text-grafite">
                    Status VIP ativado
                  </p>
                  <p className="text-xs text-gray-600">Há 3 dias</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
