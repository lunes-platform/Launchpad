import React from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Star,
  Zap,
  Shield,
  TrendingUp,
  Gift,
  Users,
  Clock,
  Award,
  Sparkles,
  Target,
  Gem,
} from "lucide-react";
import { Card, Button } from "@launchpad/shared-ui";
import { Badge } from "../ui/Badge";

interface VipFeaturesProps {
  vipLevel: number;
  className?: string;
}

interface VipBenefit {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  active: boolean;
  requiredLevel: number;
  category: "access" | "financial" | "support" | "exclusive";
}

interface ExclusiveDeal {
  id: string;
  name: string;
  description: string;
  allocation: number;
  minInvestment: number;
  maxInvestment: number;
  apy: number;
  timeLeft: string;
  participants: number;
  maxParticipants: number;
  status: "active" | "coming-soon" | "ended";
}

/**
 * Componente de funcionalidades VIP exclusivas
 * Exibe benefícios, deals exclusivos e privilégios baseados no nível VIP
 */
export function VipFeatures({ vipLevel, className = "" }: VipFeaturesProps) {
  // Benefícios VIP organizados por categoria
  const vipBenefits: VipBenefit[] = [
    {
      id: "early-access",
      title: "Acesso Antecipado",
      description: "Investimento 24h antes do público geral",
      icon: Clock,
      active: vipLevel >= 1,
      requiredLevel: 1,
      category: "access",
    },
    {
      id: "reduced-fees",
      title: "Taxas Reduzidas",
      description: `${vipLevel >= 3 ? "75%" : vipLevel >= 2 ? "60%" : "50%"} de desconto em todas as taxas`,
      icon: TrendingUp,
      active: vipLevel >= 1,
      requiredLevel: 1,
      category: "financial",
    },
    {
      id: "priority-support",
      title: "Suporte Prioritário",
      description: "Atendimento VIP 24/7 com resposta em até 1h",
      icon: Shield,
      active: vipLevel >= 1,
      requiredLevel: 1,
      category: "support",
    },
    {
      id: "exclusive-analysis",
      title: "Análises Exclusivas",
      description: "Relatórios detalhados e insights de projetos",
      icon: Target,
      active: vipLevel >= 2,
      requiredLevel: 2,
      category: "exclusive",
    },
    {
      id: "vip-staking",
      title: "Pool de Staking VIP",
      description: `Recompensas ${vipLevel >= 3 ? "3x" : "2x"} maiores que pools padrão`,
      icon: Gem,
      active: vipLevel >= 2,
      requiredLevel: 2,
      category: "financial",
    },
    {
      id: "private-deals",
      title: "Deals Privados",
      description: "Acesso a rodadas de investimento exclusivas",
      icon: Sparkles,
      active: vipLevel >= 3,
      requiredLevel: 3,
      category: "exclusive",
    },
    {
      id: "governance-power",
      title: "Poder de Governança",
      description: "Voto com peso 2x em propostas da plataforma",
      icon: Award,
      active: vipLevel >= 3,
      requiredLevel: 3,
      category: "exclusive",
    },
    {
      id: "concierge-service",
      title: "Serviço de Concierge",
      description: "Assistente pessoal para investimentos",
      icon: Users,
      active: vipLevel >= 4,
      requiredLevel: 4,
      category: "support",
    },
  ];

  // Deals exclusivos para VIPs
  const exclusiveDeals: ExclusiveDeal[] = [
    {
      id: "alpha-protocol",
      name: "DeFi Protocol Alpha",
      description:
        "Protocolo DeFi de próxima geração com yield farming otimizado",
      allocation: 100000,
      minInvestment: 10000,
      maxInvestment: 50000,
      apy: 45,
      timeLeft: "2 dias, 14h",
      participants: 23,
      maxParticipants: 50,
      status: "active",
    },
    {
      id: "gamefi-metaverse",
      name: "GameFi Metaverse",
      description: "Plataforma de jogos blockchain com economia P2E",
      allocation: 75000,
      minInvestment: 5000,
      maxInvestment: 25000,
      apy: 38,
      timeLeft: "5 dias, 8h",
      participants: 12,
      maxParticipants: 30,
      status: "active",
    },
    {
      id: "ai-trading",
      name: "AI Trading Bot",
      description: "Bot de trading com IA para maximizar retornos",
      allocation: 50000,
      minInvestment: 15000,
      maxInvestment: 100000,
      apy: 52,
      timeLeft: "Em breve",
      participants: 0,
      maxParticipants: 20,
      status: "coming-soon",
    },
  ];

  const getCategoryColor = (category: VipBenefit["category"]) => {
    switch (category) {
      case "access":
        return "bg-blue-100 text-blue-700";
      case "financial":
        return "bg-green-100 text-green-700";
      case "support":
        return "bg-purple-100 text-purple-700";
      case "exclusive":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: ExclusiveDeal["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "coming-soon":
        return "bg-blue-100 text-blue-700";
      case "ended":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const activeBenefits = vipBenefits.filter((benefit) => benefit.active);
  const upcomingBenefits = vipBenefits.filter(
    (benefit) => !benefit.active && benefit.requiredLevel <= vipLevel + 1,
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header VIP */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-roxo to-laranja rounded-lg flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-grafite">Área VIP</h2>
            <p className="text-gray-600">
              Nível {vipLevel} • Benefícios Exclusivos
            </p>
          </div>
        </div>

        <Badge variant="primary" className="flex items-center space-x-1">
          <Star className="w-4 h-4" />
          <span>VIP Nível {vipLevel}</span>
        </Badge>
      </div>

      {/* Benefícios Ativos */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-grafite mb-4 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-roxo" />
          <span>Seus Benefícios Ativos</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 bg-gradient-to-br from-white to-gray-50 dark:from-grafite-800 dark:to-grafite-700 rounded-lg border border-gray-200 dark:border-grafite-600 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-roxo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-roxo" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-grafite">
                        {benefit.title}
                      </h4>
                      <Badge
                        size="sm"
                        className={getCategoryColor(benefit.category)}
                      >
                        {benefit.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-grafite-300">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Deals Exclusivos */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-grafite mb-4 flex items-center space-x-2">
          <Gift className="w-5 h-5 text-laranja" />
          <span>Deals Exclusivos VIP</span>
        </h3>

        <div className="space-y-4">
          {exclusiveDeals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-grafite">
                      {deal.name}
                    </h4>
                    <Badge className={getStatusColor(deal.status)}>
                      {deal.status === "active" && "Ativo"}
                      {deal.status === "coming-soon" && "Em Breve"}
                      {deal.status === "ended" && "Encerrado"}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{deal.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">APY</p>
                      <p className="font-semibold text-green-600">
                        {deal.apy}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Min. Investimento</p>
                      <p className="font-semibold">
                        ${deal.minInvestment.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Participantes</p>
                      <p className="font-semibold">
                        {deal.participants}/{deal.maxParticipants}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tempo Restante</p>
                      <p className="font-semibold text-roxo">{deal.timeLeft}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={deal.status !== "active"}
                    className="whitespace-nowrap"
                  >
                    {deal.status === "active"
                      ? "Investir Agora"
                      : deal.status === "coming-soon"
                        ? "Notificar-me"
                        : "Encerrado"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap"
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-roxo to-laranja h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(deal.participants / deal.maxParticipants) * 100}%`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Próximos Benefícios */}
      {upcomingBenefits.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-grafite mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span>Próximos Benefícios</span>
          </h3>

          <div className="space-y-3">
            {upcomingBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-4 bg-grafite-50 dark:bg-grafite-800 rounded-lg border border-grafite-200 dark:border-grafite-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-roxo/10 dark:bg-roxo/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-roxo" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-grafite">
                          {benefit.title}
                        </h4>
                        <Badge variant="secondary" size="sm">
                          Nível {benefit.requiredLevel}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <p className="text-sm text-gray-700 text-center">
              💎 Continue investindo para desbloquear mais benefícios VIP
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

export default VipFeatures;
