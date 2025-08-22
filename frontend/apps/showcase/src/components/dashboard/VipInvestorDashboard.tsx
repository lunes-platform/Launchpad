import React from "react";
import {
  Crown,
  TrendingUp,
  DollarSign,
  Target,
  Gift,
  Star,
  Zap,
  Shield,
  Calendar,
  Award,
  Coins,
  BarChart3,
  Users,
} from "lucide-react";
import { Button } from "@launchpad/shared-ui";
import { Badge } from "../ui/Badge";

interface VipMetrics {
  totalInvested: number;
  portfolioValue: number;
  totalReturns: number;
  returnsPercentage: number;
  vipLevel: number;
  exclusiveDeals: number;
  stakingRewards: number;
  referralEarnings: number;
}

interface VipInvestorDashboardProps {
  metrics: VipMetrics;
  userName: string;
}

/**
 * Dashboard exclusivo para investidores VIP
 * Inclui métricas avançadas, acesso a deals exclusivos e benefícios VIP
 */
export function VipInvestorDashboard({
  metrics,
  userName,
}: VipInvestorDashboardProps) {
  // Dados mockados para demonstração
  const exclusiveDeals = [
    {
      id: 1,
      name: "DeFi Protocol Alpha",
      allocation: 50000,
      minInvestment: 10000,
      maxInvestment: 100000,
      timeLeft: "2 dias",
      apy: 45,
      status: "active",
    },
    {
      id: 2,
      name: "GameFi Metaverse",
      allocation: 25000,
      minInvestment: 5000,
      maxInvestment: 50000,
      timeLeft: "5 dias",
      apy: 38,
      status: "coming-soon",
    },
  ];

  const vipBenefits = [
    {
      title: "Acesso Antecipado",
      description: "Investimento 24h antes do público",
      active: true,
    },
    {
      title: "Taxas Reduzidas",
      description: "50% de desconto em todas as taxas",
      active: true,
    },
    {
      title: "Suporte Prioritário",
      description: "Atendimento VIP 24/7",
      active: true,
    },
    {
      title: "Análises Exclusivas",
      description: "Relatórios detalhados de projetos",
      active: true,
    },
    {
      title: "Pool de Staking VIP",
      description: "Recompensas 2x maiores",
      active: true,
    },
  ];

  const recentActivity = [
    {
      type: "investment",
      project: "Blockchain Gaming",
      amount: 15000,
      timestamp: "2 horas atrás",
    },
    {
      type: "reward",
      project: "Staking VIP Pool",
      amount: 850,
      timestamp: "1 dia atrás",
    },
    {
      type: "referral",
      project: "Programa de Indicação",
      amount: 500,
      timestamp: "2 dias atrás",
    },
    {
      type: "exclusive",
      project: "Deal Exclusivo Alpha",
      amount: 25000,
      timestamp: "3 dias atrás",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "investment":
        return <DollarSign className="w-4 h-4" />;
      case "reward":
        return <Gift className="w-4 h-4" />;
      case "referral":
        return <Users className="w-4 h-4" />;
      case "exclusive":
        return <Star className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "investment":
        return "text-azul-400";
      case "reward":
        return "text-verde-400";
      case "referral":
        return "text-roxo-400";
      case "exclusive":
        return "text-laranja-400";
      default:
        return "text-grafite-400";
    }
  };

  return (
    <div className="min-h-screen bg-grafite-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header VIP */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-roxo-500 to-laranja-500 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard VIP</h1>
              <p className="text-grafite-300">
                Bem-vindo, {userName} • Nível {metrics.vipLevel}
              </p>
            </div>
          </div>
          
          {/* Portfólio Total - Destaque */}
          <div className="bg-gradient-to-r from-roxo-500/20 to-laranja-500/20 border border-roxo-400/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-grafite-300 text-sm mb-1">Portfólio Total</p>
                <p className="text-4xl font-bold text-white">
                  ${metrics.portfolioValue.toLocaleString()}
                </p>
                <p className="text-verde-400 text-sm mt-1">
                  +{metrics.returnsPercentage.toFixed(1)}% este mês
                </p>
              </div>
              <div className="text-right">
                <div className="w-16 h-16 bg-gradient-to-r from-roxo-500 to-laranja-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas VIP */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-grafite-800 border border-grafite-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-grafite-300">
                  Total Investido
                </p>
                <p className="text-2xl font-bold text-white">
                  ${metrics.totalInvested.toLocaleString()}
                </p>
                <p className="text-sm text-verde-400">
                  Retorno: +{metrics.returnsPercentage.toFixed(1)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-roxo-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-roxo-400" />
              </div>
            </div>
          </div>

          <div className="bg-grafite-800 border border-grafite-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-grafite-300">
                  Deals Exclusivos
                </p>
                <p className="text-2xl font-bold text-white">
                  {metrics.exclusiveDeals}
                </p>
                <p className="text-sm text-laranja-400">Disponíveis agora</p>
              </div>
              <div className="w-12 h-12 bg-laranja-500/20 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-laranja-400" />
              </div>
            </div>
          </div>

          <div className="bg-grafite-800 border border-grafite-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-grafite-300">Staking VIP</p>
                <p className="text-2xl font-bold text-white">
                  ${metrics.stakingRewards.toLocaleString()}
                </p>
                <p className="text-sm text-verde-400">Recompensas acumuladas</p>
              </div>
              <div className="w-12 h-12 bg-verde-500/20 rounded-lg flex items-center justify-center">
                <Coins className="w-6 h-6 text-verde-400" />
              </div>
            </div>
          </div>

          <div className="bg-grafite-800 border border-grafite-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-grafite-300">
                  Indicações
                </p>
                <p className="text-2xl font-bold text-white">
                  ${metrics.referralEarnings.toLocaleString()}
                </p>
                <p className="text-sm text-azul-400">Ganhos totais</p>
              </div>
              <div className="w-12 h-12 bg-azul-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-azul-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Deals Exclusivos */}
          <div className="bg-grafite-800 border border-grafite-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-laranja-400" />
                Deals Exclusivos VIP
              </h3>
              <Badge className="bg-laranja-500/20 text-laranja-400 border-laranja-500/30">
                {exclusiveDeals.length} Disponíveis
              </Badge>
            </div>
            
            <div className="space-y-4">
              {exclusiveDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="bg-grafite-700/50 border border-grafite-600 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">{deal.name}</h4>
                    <Badge
                      className={`${
                        deal.status === "active"
                          ? "bg-verde-500/20 text-verde-400 border-verde-500/30"
                          : "bg-amarelo-500/20 text-amarelo-400 border-amarelo-500/30"
                      }`}
                    >
                      {deal.status === "active" ? "Ativo" : "Em Breve"}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-grafite-400">APY Esperado</p>
                      <p className="text-verde-400 font-semibold">{deal.apy}%</p>
                    </div>
                    <div>
                      <p className="text-grafite-400">Tempo Restante</p>
                      <p className="text-white font-semibold">{deal.timeLeft}</p>
                    </div>
                    <div>
                      <p className="text-grafite-400">Min. Investimento</p>
                      <p className="text-white font-semibold">
                        ${deal.minInvestment.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-grafite-400">Alocação</p>
                      <p className="text-white font-semibold">
                        ${deal.allocation.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {deal.status === "active" && (
                    <Button className="w-full mt-4 bg-gradient-to-r from-roxo-600 to-laranja-600 hover:from-roxo-700 hover:to-laranja-700 text-white">
                      Investir Agora
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Benefícios VIP */}
          <div className="bg-grafite-800 border border-grafite-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-azul-400" />
                Benefícios VIP
              </h3>
              <Badge className="bg-azul-500/20 text-azul-400 border-azul-500/30">
                Nível {metrics.vipLevel}
              </Badge>
            </div>
            
            <div className="space-y-4">
              {vipBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-grafite-700/50 border border-grafite-600 rounded-lg"
                >
                  <div className="w-10 h-10 bg-verde-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-verde-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-sm text-grafite-300">
                      {benefit.description}
                    </p>
                  </div>
                  <div className="w-3 h-3 bg-verde-400 rounded-full flex-shrink-0 mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Atividade Recente */}
        <div className="mt-8 bg-grafite-800 border border-grafite-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-roxo-400" />
              Atividade Recente
            </h3>
            <Button variant="outline" className="border-grafite-600 text-grafite-300 hover:bg-grafite-700">
              Ver Todas
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-grafite-700/50 border border-grafite-600 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}/20`}>
                    <div className={getActivityColor(activity.type)}>
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {activity.project}
                    </p>
                    <p className="text-sm text-grafite-300">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getActivityColor(activity.type)}`}>
                    ${activity.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
