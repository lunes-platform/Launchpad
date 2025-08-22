import React, { useEffect } from "react";
import { Card } from "@launchpad/shared-ui";
import { Badge } from "../components/ui/Badge";
import { FadeIn } from "../components/animations/FadeIn";
import { ScaleIn } from "../components/animations/ScaleIn";
import { useLaunchpoolStore } from "../stores/launchpoolStore";
import { TrendingUp, Clock, Users, Coins } from "lucide-react";

/**
 * Página do Launchpool - Exibe pools de liquidez e oportunidades de staking
 * Permite aos usuários participar de pools de tokens e ganhar recompensas
 */
export default function LaunchpoolPage() {
  const { 
    pools, 
    isLoading, 
    fetchPools, 
    stakeTokens 
  } = useLaunchpoolStore();

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

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

  const handleStake = async (poolId: string) => {
    // TODO: Implementar modal de staking
    console.log('Staking in pool:', poolId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-roxo mx-auto"></div>
          <p className="mt-4 text-grafite-600 dark:text-grafite-300">Carregando pools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Launchpool
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Explore pools de staking criados por projetos durante suas fases de captação.
            Faça staking de tokens e ganhe recompensas com APYs competitivos em
            diferentes estratégias de investimento.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pools.map((pool, index) => (
          <ScaleIn key={pool.id} delay={index * 0.1}>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group">
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

              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                {pool.description}
              </p>

              {/* Stats Grid */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-roxo" />
                    <span className="text-sm font-medium text-gray-300">Token</span>
                  </div>
                  <span className="font-semibold text-white">{pool.token}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-gray-300">APY</span>
                  </div>
                  <span className="font-bold text-green-400 text-lg">{pool.apy}%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-gray-300">Total Staked</span>
                  </div>
                  <span className="font-semibold text-white">{pool.totalStaked} {pool.token}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  pool.status === "active"
                    ? "bg-gradient-to-r from-roxo to-roxo-700 hover:from-roxo-700 hover:to-roxo-800 text-white shadow-lg hover:shadow-roxo/25 transform hover:scale-[1.02]"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
                disabled={pool.status !== "active"}
                onClick={() => handleStake(pool.id.toString())}
              >
                {pool.status === "active" ? "Participar do Pool" : getStatusText(pool.status)}
              </button>
            </div>
          </ScaleIn>
        ))}
      </div>

      <FadeIn delay={0.3}>
        <div className="mt-12 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Como Funciona o Launchpool?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-roxo to-roxo-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-white mb-3">
                Escolha um Pool
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Selecione o pool que melhor se adequa ao seu perfil de risco e
                retorno esperado entre os projetos disponíveis.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-white mb-3">
                Faça Staking
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Deposite seus tokens no pool escolhido e comece a ganhar
                recompensas imediatamente com APYs competitivos.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-white mb-3">
                Receba Recompensas
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Acompanhe seus ganhos em tempo real e retire suas recompensas
                quando desejar através do painel de controle.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
