import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Gift,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Coins,
  TrendingUp,
  Settings,
  Bell,
} from 'lucide-react';

// Wrappers para resolver compatibilidade de tipos React 19
const GiftIcon = ({ className, ...props }: { className?: string }) => {
  const IconComponent = Gift as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} {...props} />;
};

const ClockIcon = ({ className, ...props }: { className?: string }) => {
  const IconComponent = Clock as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} {...props} />;
};

const CheckCircleIcon = ({ className, ...props }: { className?: string }) => {
  const IconComponent = CheckCircle as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} {...props} />;
};

const AlertCircleIcon = ({ className, ...props }: { className?: string }) => {
  const IconComponent = AlertCircle as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} {...props} />;
};

const DownloadIcon = ({ className, ...props }: { className?: string }) => {
  const IconComponent = Download as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} {...props} />;
};

const CoinsIcon = ({ className, ...props }: { className?: string }) => {
  const IconComponent = Coins as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} {...props} />;
};

const TrendingUpIcon = ({ className, ...props }: { className?: string }) => {
  const IconComponent = TrendingUp as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} {...props} />;
};

const SettingsIcon = ({ className, ...props }: { className?: string }) => {
  const IconComponent = Settings as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} {...props} />;
};

const BellIcon = ({ className, ...props }: { className?: string }) => {
  const IconComponent = Bell as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} {...props} />;
};
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';
import { formatUtils } from '../lib/utils';
import { AirdropFilters, useAirdropFilters } from '../components/airdrop/AirdropFilters';
import { useAirdrops, useAirdropStats, useFilteredAirdrops, type AirdropRecord } from '../hooks/useAirdrops';
import { useAirdropClaim } from '../hooks/useAirdropClaim';
import { useDefaultAirdropNotifications } from '../hooks/useAirdropNotifications';
import { AirdropNotificationSettings } from '../components/airdrop/AirdropNotificationSettings';

/**
 * Hook para gerenciar o estado do modal de configurações de notificação
 */
function useAirdropNotificationSettingsModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {
    isOpen,
    openModal,
    closeModal,
  };
}



/**
 * Página de Airdrop - Lista airdrops disponíveis para claim
 * Implementa regra de elegibilidade de 3 meses após término da captação
 */
export default function AirdropPage() {
  const { airdrops, isLoading, error } = useAirdrops();
  const stats = useAirdropStats();
  // Hook de claim será usado quando implementarmos a funcionalidade de claim
  // const { claimAirdrop, canClaim, getClaimStatusMessage } = useAirdropClaim();
  const { user } = useAuth();
  const { filters, setFilters, applyFilters } = useAirdropFilters();
  
  // Ativar sistema de notificações de airdrop
  useDefaultAirdropNotifications();
  
  // Modal de configurações de notificação
  const { isOpen: isSettingsOpen, openModal: openSettings, closeModal: closeSettings } = useAirdropNotificationSettingsModal();
  
  console.log('🎁 AirdropPage: Rendering with user:', user);
  console.log('👤 AirdropPage: User data:', user);
  
  const [selectedAirdrop, setSelectedAirdrop] = useState<AirdropRecord | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Aplicar filtros aos airdrops
  const filteredAirdrops = useMemo(() => {
    return airdrops ? applyFilters(airdrops) : [];
  }, [airdrops, applyFilters]);

  // Usar estatísticas do hook
  const totalAirdrops = stats.totalAirdrops;
  const availableAirdrops = stats.availableAirdrops;
  const claimedAirdrops = stats.claimedAirdrops;
  const totalValue = stats.totalValueClaimed;
  const claimableValue = stats.totalValueAvailable;

  // Função para verificar se airdrop está elegível
  const isEligible = (airdrop: AirdropRecord): boolean => {
    const now = new Date();
    return !!(airdrop.eligibilityDate && now >= airdrop.eligibilityDate);
  };

  // Função para calcular tempo restante até elegibilidade
  const getTimeUntilEligible = (airdrop: AirdropRecord): string => {
    if (!airdrop.eligibilityDate) return 'Data não definida';
    
    const now = new Date();
    const diff = airdrop.eligibilityDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Elegível agora';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} dias restantes`;
    } else {
      return `${hours} horas restantes`;
    }
  };

  // Função para fazer claim do airdrop
  const handleClaimAirdrop = async (airdropId: string) => {
    console.log('🎁 Claiming airdrop:', airdropId);
    // TODO: Implementar lógica de claim real
    // Aqui seria feita a chamada para o smart contract
  };

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-400 bg-green-400/10';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'claimed':
        return 'text-roxo bg-roxo/10';
      default:
        return 'text-grafite-400 bg-grafite-400/10';
    }
  };

  // Função para obter ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'pending':
        return <ClockIcon className="w-4 h-4" />;
      case 'claimed':
        return <DownloadIcon className="w-4 h-4" />;
      default:
        return <AlertCircleIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-grafite-900 text-white">
      {/* Header */}
      <div className="bg-grafite-800 border-b border-grafite-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GiftIcon className="w-8 h-8 text-lunes-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Airdrops</h1>
                <p className="text-grafite-300">
                  Receba tokens de projetos após 3 meses do término da captação
                </p>
              </div>
            </div>
            <button
              onClick={openSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-grafite-700 hover:bg-grafite-600 rounded-lg transition-colors"
            >
              <BellIcon className="w-4 h-4" />
              <SettingsIcon className="w-4 h-4" />
              <span className="text-sm">Notificações</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-grafite-800 rounded-xl p-6 border border-grafite-700"
          >
            <div className="flex items-center justify-between">
                <div>
                  <p className="text-grafite-400 text-sm">Total de Airdrops</p>
                  <p className="text-2xl font-bold text-white">{totalAirdrops}</p>
                </div>
                <GiftIcon className="w-8 h-8 text-lunes-400" />
              </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-grafite-800 rounded-xl p-6 border border-grafite-700"
          >
            <div className="flex items-center justify-between">
                <div>
                  <p className="text-grafite-400 text-sm">Disponíveis</p>
                  <p className="text-2xl font-bold text-green-400">{availableAirdrops}</p>
                </div>
                <CheckCircleIcon className="w-8 h-8 text-green-400" />
              </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-grafite-800 rounded-xl p-6 border border-grafite-700"
          >
            <div className="flex items-center justify-between">
                <div>
                  <p className="text-grafite-400 text-sm">Reclamados</p>
                  <p className="text-2xl font-bold text-roxo">{claimedAirdrops}</p>
                </div>
                <DownloadIcon className="w-8 h-8 text-roxo" />
              </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-grafite-800 rounded-xl p-6 border border-grafite-700"
          >
            <div className="flex items-center justify-between">
                <div>
                  <p className="text-grafite-400 text-sm">Valor Total</p>
                  <p className="text-2xl font-bold text-white">
                    {formatUtils.currency(totalValue)}
                  </p>
                </div>
                <TrendingUpIcon className="w-8 h-8 text-lunes-400" />
              </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-grafite-800 rounded-xl p-6 border border-grafite-700"
          >
            <div className="flex items-center justify-between">
                <div>
                  <p className="text-grafite-400 text-sm">Valor Disponível</p>
                  <p className="text-2xl font-bold text-green-400">
                    {formatUtils.currency(claimableValue)}
                  </p>
                </div>
                <CoinsIcon className="w-8 h-8 text-green-400" />
              </div>
          </motion.div>
        </div>

        {/* Filtros */}
        <AirdropFilters
          filters={filters}
          onFiltersChange={setFilters}
          airdrops={airdrops || []}
          className="mb-8"
        />

        {/* Lista de Airdrops */}
        <div className="space-y-4">
          {filteredAirdrops.length === 0 ? (
            <div className="bg-grafite-800 rounded-xl p-12 border border-grafite-700 text-center">
              <AlertCircleIcon className="w-16 h-16 mx-auto mb-4 text-grafite-400" />
              <h3 className="text-xl font-semibold mb-2 text-white">
                Nenhum airdrop encontrado
              </h3>
              <p className="text-grafite-400">
                Tente ajustar os filtros para encontrar airdrops disponíveis.
              </p>
            </div>
          ) : (
            filteredAirdrops.map((airdrop, index) => (
              <motion.div
                key={airdrop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-grafite-800 rounded-xl border border-grafite-700 overflow-hidden hover:border-lunes-400/50 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    {/* Informações do Projeto */}
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-grafite-700 rounded-full flex items-center justify-center">
                        <CoinsIcon className="w-6 h-6 text-lunes-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {airdrop.projectName}
                        </h3>
                        <p className="text-grafite-400">
                          {formatUtils.compactNumber(airdrop.tokenAmount || 0)} {airdrop.tokenSymbol}
                        </p>
                      </div>
                    </div>

                    {/* Status e Ações */}
                    <div className="flex items-center space-x-4">
                      {/* Status */}
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(airdrop.status)}`}>
                        {getStatusIcon(airdrop.status)}
                        <span className="text-sm font-medium capitalize">
                          {airdrop.status === 'available' ? 'Disponível' :
                           airdrop.status === 'pending' ? 'Pendente' : 'Reclamado'}
                        </span>
                      </div>

                      {/* Valor */}
                      <div className="text-right">
                        <p className="text-lg font-semibold text-white">
                          {formatUtils.currency(airdrop.estimatedValue || 0)}
                        </p>
                        <p className="text-sm text-grafite-400">
                          Valor estimado
                        </p>
                      </div>

                      {/* Botão de Ação */}
                      {airdrop.status === 'available' && isEligible(airdrop) ? (
                        <button
                          onClick={() => handleClaimAirdrop(airdrop.id)}
                          className="px-6 py-2 bg-lunes-400 text-grafite-900 rounded-lg font-medium hover:bg-lunes-300 transition-colors duration-200"
                        >
                          Reclamar
                        </button>
                      ) : airdrop.status === 'pending' ? (
                        <div className="text-center">
                          <p className="text-sm text-yellow-400 font-medium">
                            {getTimeUntilEligible(airdrop)}
                          </p>
                          <p className="text-xs text-grafite-400">
                            até elegibilidade
                          </p>
                        </div>
                      ) : (
                        <button
                          disabled
                          className="px-6 py-2 bg-grafite-700 text-grafite-400 rounded-lg font-medium cursor-not-allowed"
                        >
                          Reclamado
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Informações Adicionais */}
                  <div className="mt-4 pt-4 border-t border-grafite-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-grafite-400">Prazo para Claim</p>
                        <p className="text-white font-medium">
                          {formatUtils.date(airdrop.claimDeadline)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-grafite-400">Elegível desde</p>
                        <p className="text-white font-medium">
                          {airdrop.eligibilityDate ? formatUtils.date(airdrop.eligibilityDate) : 'Pendente'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-grafite-400">Requisitos</p>
                        <p className="text-white font-medium">
                          {airdrop.requirements?.join(', ') || 'Nenhum requisito específico'}
                        </p>
                      </div>
                    </div>

                    {/* Descrição do Projeto */}
                    {airdrop.description && (
                      <div className="mt-4">
                        <p className="text-sm text-grafite-400 mb-2">Descrição</p>
                        <p className="text-white text-sm">{airdrop.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Configurações de Notificação */}
      <AirdropNotificationSettings
        isOpen={isSettingsOpen}
        onClose={closeSettings}
      />
    </div>
  );
}