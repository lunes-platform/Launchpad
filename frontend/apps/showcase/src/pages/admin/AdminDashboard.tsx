import {
  Users,
  Rocket,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";

/**
 * Dashboard principal para administradores
 * Mostra métricas gerais, alertas e ações rápidas
 */
export function AdminDashboard() {
  // Dados mockados - em produção viriam do smart contract
  const platformStats = {
    totalUsers: 25847,
    totalProjects: 156,
    totalVolumeLunes: 2500000,
    totalVolumeLusdt: 1800000,
    activeStakers: 8934,
    totalStaked: 15600000,
    rewardsPools: {
      stakingPool: 450000,
      projectBuyPool: 320000,
      participationPool: 180000,
    },
    lastDistribution: new Date().toISOString(),
    autoDistributionEnabled: true,
  };

  const recentAlerts = [
    {
      id: 1,
      type: "warning",
      message: "Pool de recompensas de staking atingiu 90% da capacidade",
      timestamp: "2 horas atrás",
    },
    {
      id: 2,
      type: "info",
      message: 'Novo projeto "DeFi Revolution" aguardando aprovação',
      timestamp: "4 horas atrás",
    },
    {
      id: 3,
      type: "success",
      message: "Distribuição automática de recompensas executada com sucesso",
      timestamp: "6 horas atrás",
    },
  ];

  const quickActions = [
    {
      title: "Aprovar Projetos",
      description: "3 projetos aguardando",
      icon: Rocket,
      color: "bg-roxo",
      href: "/admin/projects?status=pending",
    },
    {
      title: "Verificar KYC",
      description: "12 usuários pendentes",
      icon: Users,
      color: "bg-verde",
      href: "/admin/users?kyc=pending",
    },
    {
      title: "Distribuir Recompensas",
      description: "Pool: 450k LUNES",
      icon: DollarSign,
      color: "bg-laranja",
      href: "/admin/rewards",
    },
    {
      title: "Ver Analytics",
      description: "Relatórios detalhados",
      icon: BarChart3,
      color: "bg-grafite",
      href: "/admin/analytics",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-grafite">
          Dashboard Administrativo
        </h1>
        <p className="text-gray-600">
          Visão geral da plataforma Lunes Launchpad
        </p>
      </div>

      {/* Stats Grid */}
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
                Total de Usuários
              </p>
              <p className="text-2xl font-bold text-grafite dark:text-grafite-50">
                {platformStats.totalUsers.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-roxo-100 dark:bg-roxo-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-roxo dark:text-roxo-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-verde mr-1" />
            <span className="text-verde">+12%</span>
            <span className="text-gray-500 dark:text-grafite-400 ml-1">
              vs mês anterior
            </span>
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
                Projetos Ativos
              </p>
              <p className="text-2xl font-bold text-grafite dark:text-grafite-50">
                {platformStats.totalProjects}
              </p>
            </div>
            <div className="w-12 h-12 bg-verde-100 dark:bg-verde-900/30 rounded-lg flex items-center justify-center">
              <Rocket className="w-6 h-6 text-verde dark:text-verde-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-verde mr-1" />
            <span className="text-verde">+8%</span>
            <span className="text-gray-500 dark:text-grafite-400 ml-1">
              vs mês anterior
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
                Volume Total
              </p>
              <p className="text-2xl font-bold text-grafite dark:text-grafite-50">
                {(
                  platformStats.totalVolumeLunes +
                  platformStats.totalVolumeLusdt
                ).toLocaleString()}{" "}
                LUNES
              </p>
            </div>
            <div className="w-12 h-12 bg-laranja-100 dark:bg-laranja-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-laranja dark:text-laranja-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-verde mr-1" />
            <span className="text-verde">+25%</span>
            <span className="text-gray-500 dark:text-grafite-400 ml-1">
              vs mês anterior
            </span>
          </div>
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
                Stakers Ativos
              </p>
              <p className="text-2xl font-bold text-grafite dark:text-grafite-50">
                {platformStats.activeStakers.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-grafite-100 dark:bg-grafite-700 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-grafite dark:text-grafite-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-verde mr-1" />
            <span className="text-verde">+18%</span>
            <span className="text-gray-500 dark:text-grafite-400 ml-1">
              vs mês anterior
            </span>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-grafite dark:text-grafite-50 mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.a
                key={action.title}
                href={action.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="block p-4 bg-white dark:bg-grafite-800 rounded-lg shadow-sm border border-gray-200 dark:border-grafite-700 hover:shadow-md dark:hover:bg-grafite-750 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-grafite dark:text-grafite-50">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-grafite-300">
                      {action.description}
                    </p>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>

      {/* Alerts and Rewards Pools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-grafite-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-grafite-700 transition-colors duration-200"
        >
          <h3 className="text-lg font-semibold text-grafite dark:text-grafite-50 mb-4">
            Alertas Recentes
          </h3>
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === "warning"
                      ? "bg-laranja"
                      : alert.type === "success"
                        ? "bg-verde"
                        : "bg-roxo"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm text-grafite dark:text-grafite-100">
                    {alert.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-grafite-400 mt-1">
                    {alert.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Rewards Pools */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-grafite-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-grafite-700 transition-colors duration-200"
        >
          <h3 className="text-lg font-semibold text-grafite dark:text-grafite-50 mb-4">
            Pools de Recompensas
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-grafite-300">
                Staking Pool
              </span>
              <span className="font-medium text-grafite dark:text-grafite-100">
                {platformStats.rewardsPools.stakingPool.toLocaleString()} LUNES
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-grafite-300">
                Project Buy Pool
              </span>
              <span className="font-medium text-grafite dark:text-grafite-100">
                {platformStats.rewardsPools.projectBuyPool.toLocaleString()}{" "}
                LUNES
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-grafite-300">
                Participation Pool
              </span>
              <span className="font-medium text-grafite dark:text-grafite-100">
                {platformStats.rewardsPools.participationPool.toLocaleString()}{" "}
                LUNES
              </span>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-grafite-600">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-grafite dark:text-grafite-100">
                  Distribuição Automática
                </span>
                <div className="flex items-center space-x-2">
                  {platformStats.autoDistributionEnabled ? (
                    <CheckCircle className="w-4 h-4 text-verde" />
                  ) : (
                    <Clock className="w-4 h-4 text-laranja" />
                  )}
                  <span
                    className={`text-sm ${
                      platformStats.autoDistributionEnabled
                        ? "text-verde"
                        : "text-laranja"
                    }`}
                  >
                    {platformStats.autoDistributionEnabled
                      ? "Ativa"
                      : "Inativa"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
