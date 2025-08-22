import React, { useState } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useAuth } from "../../contexts/AuthContext";
import { isVipUser } from "../../types/auth";
import { Card, Button } from '@launchpad/shared-ui';
import {
  Crown,
  Star,
  TrendingUp,
  Shield,
  Zap,
  Gift,
  BarChart3,
  Users,
  Settings,
  ArrowUpRight,
  ExternalLink,
  DollarSign,
  RefreshCw,
  Award,
  Clock,
  ChevronDown,
} from "lucide-react";

/**
 * Dashboard exclusivo para usuários VIP
 * Segue o design system do dashboard unificado
 */
export const VipPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Redireciona para login se não autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se não for VIP, redireciona para a página de upgrade
  if (!isVipUser(user)) {
    return <Navigate to="/upgrade-vip" replace />;
  }

  // Variantes de animação
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
  };

  const cardVariants: Variants = {
    hidden: { scale: 0.96, opacity: 0, y: 10 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.01,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  // Função para refresh dos dados
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const vipFeatures = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Acesso Antecipado a Projetos",
      description: "Veja e invista em projetos promissores antes de todos.",
      link: "/projects?filter=early-access",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Relatórios de Performance",
      description: "Acesse análises detalhadas sobre seus investimentos.",
      link: "/vip/reports",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Seguro de Investimento",
      description:
        "Proteção adicional para seus aportes em projetos selecionados.",
      link: "/vip/insurance",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Comunidade Exclusiva",
      description: "Participe de um grupo privado com outros investidores VIP.",
      link: "/vip/community",
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Programa de Recompensas",
      description: "Ganhe tokens e benefícios exclusivos por sua lealdade.",
      link: "/rewards",
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Configurações VIP",
      description: "Personalize suas preferências e limites de investimento.",
      link: "/settings/vip",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-grafite-950 via-grafite-900 to-grafite-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
      
      <div className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Header Principal */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-laranja-500 to-roxo-600 rounded-xl flex items-center justify-center">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center space-x-2 bg-laranja-50/10 border border-laranja-500/30 rounded-full px-3 py-1">
                      <Crown className="w-3 h-3 text-laranja-400" />
                      <span className="text-xs font-medium text-laranja-400">Status Premium Ativo</span>
                    </div>
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Dashboard VIP
                  </h1>
                  <p className="text-grafite-300 text-lg">
                    Bem-vindo, {user?.profile?.displayName || user?.walletAddress}! Aproveite seus benefícios exclusivos.
                  </p>
                </div>
                
                {/* Controles */}
                <div className="flex items-center space-x-3">
                  {/* Seletor de Período */}
                  <div className="relative">
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value as '7d' | '30d' | '90d')}
                      className="bg-grafite-700/50 border border-grafite-600/50 rounded-lg px-3 py-2 text-sm text-grafite-200 focus:outline-none focus:ring-2 focus:ring-roxo-500/50 focus:border-roxo-500/50 appearance-none pr-8"
                    >
                      <option value="7d">7 dias</option>
                      <option value="30d">30 dias</option>
                      <option value="90d">90 dias</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-grafite-400 pointer-events-none" />
                  </div>
                  
                  {/* Botão de Refresh */}
                  <motion.button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-grafite-700/50 border border-grafite-600/50 rounded-lg hover:bg-grafite-600/50 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 text-grafite-300 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Grid de Features */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {vipFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover="hover"
                  className="group"
                >
                  <Card className="h-full bg-grafite-800/50 backdrop-blur-md border-grafite-700/50 hover:border-roxo-500/50 transition-all duration-300 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-r from-roxo-500/20 to-laranja-500/20 rounded-xl border border-roxo-500/30 group-hover:border-roxo-400/50 transition-colors">
                        <div className="text-roxo-400 group-hover:text-roxo-300 transition-colors">
                          {feature.icon}
                        </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-grafite-400 group-hover:text-roxo-400 transition-colors" />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-roxo-100 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-grafite-300 mb-4 group-hover:text-grafite-200 transition-colors">
                        {feature.description}
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => navigate(feature.link)}
                      className="mt-auto w-full bg-gradient-to-r from-roxo-600 to-roxo-700 hover:from-roxo-500 hover:to-roxo-600 text-white border-0 shadow-lg hover:shadow-roxo-500/25 transition-all duration-200"
                    >
                      Acessar
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Seção de resumo rápido */}
            <motion.div variants={itemVariants} className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6">
                Resumo Rápido
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div variants={cardVariants} whileHover="hover">
                  <Card className="bg-grafite-800/50 backdrop-blur-md border-grafite-700/50 hover:border-verde-500/50 transition-all duration-300 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-grafite-200">
                        Investimentos Ativos
                      </h4>
                      <DollarSign className="w-5 h-5 text-verde-400" />
                    </div>
                    <p className="text-3xl font-bold text-verde-400">
                      $ {user?.metrics?.totalInvested?.toLocaleString() || "0.00"}
                    </p>
                    <div className="flex items-center mt-2 text-sm text-grafite-400">
                      <TrendingUp className="w-4 h-4 mr-1 text-verde-500" />
                      <span>+12.5% este mês</span>
                    </div>
                  </Card>
                </motion.div>
                
                <motion.div variants={cardVariants} whileHover="hover">
                  <Card className="bg-grafite-800/50 backdrop-blur-md border-grafite-700/50 hover:border-laranja-500/50 transition-all duration-300 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-grafite-200">
                        Recompensas Pendentes
                      </h4>
                      <Gift className="w-5 h-5 text-laranja-400" />
                    </div>
                    <p className="text-3xl font-bold text-laranja-400">
                      {user?.metrics?.totalRewardsClaimed?.toLocaleString() || "0"}{" "}
                      <span className="text-lg">LUNES</span>
                    </p>
                    <div className="flex items-center mt-2 text-sm text-grafite-400">
                      <Clock className="w-4 h-4 mr-1 text-laranja-500" />
                      <span>Próximo resgate em 3 dias</span>
                    </div>
                  </Card>
                </motion.div>
                
                <motion.div variants={cardVariants} whileHover="hover">
                  <Card className="bg-grafite-800/50 backdrop-blur-md border-grafite-700/50 hover:border-roxo-500/50 transition-all duration-300 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-grafite-200">
                        Nível VIP
                      </h4>
                      <Crown className="w-5 h-5 text-roxo-400" />
                    </div>
                    <div className="flex items-center">
                      <Star className="w-6 h-6 text-laranja-500 mr-2" />
                      <p className="text-3xl font-bold text-roxo-400">
                        Nível {user?.metrics?.vipLevel || 1}
                      </p>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-grafite-400">
                      <Award className="w-4 h-4 mr-1 text-roxo-500" />
                      <span>85% para próximo nível</span>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VipPage;
