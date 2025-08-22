import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellOff,
  Settings,
  Clock,
  Gift,
  AlertTriangle,
  Check,
  X,
  Save,
  RotateCcw,
  Info,
} from 'lucide-react';
import { useAirdropNotifications, type AirdropNotificationConfig } from '../../hooks/useAirdropNotifications';

// Wrappers para compatibilidade com React 19
const SettingsIcon = ({ className, ...props }: { className?: string }) => {
  return React.createElement(Settings as any, { className, ...props });
};

const XIcon = ({ className, ...props }: { className?: string }) => {
  return React.createElement(X as any, { className, ...props });
};

const GiftIcon = ({ className, ...props }: { className?: string }) => {
  return React.createElement(Gift as any, { className, ...props });
};

const AlertTriangleIcon = ({ className, ...props }: { className?: string }) => {
  return React.createElement(AlertTriangle as any, { className, ...props });
};

const ClockIcon = ({ className, ...props }: { className?: string }) => {
  return React.createElement(Clock as any, { className, ...props });
};

const BellIcon = ({ className, ...props }: { className?: string }) => {
  return React.createElement(Bell as any, { className, ...props });
};

const BellOffIcon = ({ className, ...props }: { className?: string }) => {
  return React.createElement(BellOff as any, { className, ...props });
};

const CheckIcon = ({ className, ...props }: { className?: string }) => {
  return React.createElement(Check as any, { className, ...props });
};

/**
 * Props do componente de configurações de notificação
 */
interface AirdropNotificationSettingsProps {
  /** Se o modal está aberto */
  isOpen: boolean;
  /** Função para fechar o modal */
  onClose: () => void;
  /** Configuração inicial (opcional) */
  initialConfig?: Partial<AirdropNotificationConfig>;
}

/**
 * Componente para configurar notificações de airdrop
 * Permite ao usuário personalizar quando e como receber notificações
 */
export function AirdropNotificationSettings({
  isOpen,
  onClose,
  initialConfig = {},
}: AirdropNotificationSettingsProps) {
  // Estado local para as configurações
  const [config, setConfig] = useState<AirdropNotificationConfig>({
    enableNewAirdropNotifications: true,
    enableExpirationNotifications: true,
    daysBeforeExpiration: 7,
    checkIntervalMinutes: 30,
    ...initialConfig,
  });

  // Hook de notificações com configuração personalizada
  const { 
    config: currentConfig, 
    forceCheck, 
    clearAllNotifications, 
    stats 
  } = useAirdropNotifications(config);

  /**
   * Atualiza uma configuração específica
   */
  const updateConfig = <K extends keyof AirdropNotificationConfig>(
    key: K,
    value: AirdropNotificationConfig[K]
  ) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Salva as configurações (em uma implementação real, salvaria no backend)
   */
  const handleSave = () => {
    // Aqui salvaria as configurações no localStorage ou backend
    localStorage.setItem('airdropNotificationConfig', JSON.stringify(config));
    onClose();
  };

  /**
   * Restaura configurações padrão
   */
  const handleReset = () => {
    setConfig({
      enableNewAirdropNotifications: true,
      enableExpirationNotifications: true,
      daysBeforeExpiration: 7,
      checkIntervalMinutes: 30,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(4px)"
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-grafite-800 rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-grafite-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-roxo-900/30 rounded-lg">
              <SettingsIcon className="w-5 h-5 text-roxo-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Configurações de Notificação
              </h2>
              <p className="text-sm text-grafite-300">
                Personalize suas notificações de airdrop
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-grafite-700 rounded-lg transition-colors"
          >
            <XIcon className="w-5 h-5 text-grafite-300 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Estatísticas */}
          <div className="bg-grafite-700/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-grafite-200 mb-3">
              Estatísticas de Notificação
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-grafite-400">Airdrops notificados:</span>
                <span className="ml-2 font-medium text-white">{stats.notifiedAirdrops}</span>
              </div>
              <div>
                <span className="text-grafite-400">Avisos de expiração:</span>
                <span className="ml-2 font-medium text-white">{stats.expirationNotifications}</span>
              </div>
            </div>
            {stats.lastCheckTime && (
              <div className="mt-2 text-xs text-grafite-400">
                Última verificação: {stats.lastCheckTime.toLocaleString()}
              </div>
            )}
          </div>

          {/* Configurações */}
          <div className="space-y-4">
            {/* Notificações de novos airdrops */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <GiftIcon className="w-5 h-5 text-verde-400" />
                <div>
                  <div className="font-medium text-white">
                    Novos Airdrops
                  </div>
                  <div className="text-sm text-grafite-300">
                    Notificar quando novos airdrops estiverem disponíveis
                  </div>
                </div>
              </div>
              <button
                onClick={() => updateConfig('enableNewAirdropNotifications', !config.enableNewAirdropNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.enableNewAirdropNotifications ? 'bg-roxo-600' : 'bg-grafite-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.enableNewAirdropNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Notificações de expiração */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangleIcon className="w-5 h-5 text-laranja-400" />
                <div>
                  <div className="font-medium text-white">
                    Avisos de Expiração
                  </div>
                  <div className="text-sm text-grafite-300">
                    Notificar quando airdrops estão próximos do vencimento
                  </div>
                </div>
              </div>
              <button
                onClick={() => updateConfig('enableExpirationNotifications', !config.enableExpirationNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.enableExpirationNotifications ? 'bg-roxo-600' : 'bg-grafite-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.enableExpirationNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Dias antes da expiração */}
            {config.enableExpirationNotifications && (
              <div className="ml-8 space-y-2">
                <label className="block text-sm font-medium text-grafite-200">
                  Notificar quantos dias antes do vencimento?
                </label>
                <select
                  value={config.daysBeforeExpiration}
                  onChange={(e) => updateConfig('daysBeforeExpiration', Number(e.target.value))}
                  className="block w-full px-3 py-2 bg-grafite-700 border border-grafite-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-roxo-500 focus:border-roxo-500 sm:text-sm"
                >
                  <option value={1}>1 dia</option>
                  <option value={3}>3 dias</option>
                  <option value={7}>7 dias</option>
                  <option value={14}>14 dias</option>
                  <option value={30}>30 dias</option>
                </select>
              </div>
            )}

            {/* Intervalo de verificação */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-grafite-200">
                <ClockIcon className="w-4 h-4 inline mr-2" />
                Frequência de verificação
              </label>
              <select
                value={config.checkIntervalMinutes}
                onChange={(e) => updateConfig('checkIntervalMinutes', Number(e.target.value))}
                className="block w-full px-3 py-2 bg-grafite-700 border border-grafite-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-roxo-500 focus:border-roxo-500 sm:text-sm"
              >
                <option value={5}>A cada 5 minutos</option>
                <option value={15}>A cada 15 minutos</option>
                <option value={30}>A cada 30 minutos</option>
                <option value={60}>A cada hora</option>
                <option value={180}>A cada 3 horas</option>
              </select>
            </div>
          </div>

          {/* Ações */}
          <div className="space-y-3">
            <button
              onClick={forceCheck}
              className="w-full px-4 py-2 bg-roxo-600/20 text-roxo-300 rounded-lg hover:bg-roxo-600/30 transition-colors flex items-center justify-center space-x-2"
            >
              <BellIcon className="w-4 h-4" />
              <span>Verificar Agora</span>
            </button>

            <button
              onClick={clearAllNotifications}
              className="w-full px-4 py-2 bg-grafite-700 text-grafite-300 rounded-lg hover:bg-grafite-600 transition-colors flex items-center justify-center space-x-2"
            >
              <BellOffIcon className="w-4 h-4" />
              <span>Limpar Notificações</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-grafite-700">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-grafite-400 hover:text-grafite-200 transition-colors"
          >
            Restaurar Padrão
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-grafite-600 text-grafite-300 rounded-lg hover:bg-grafite-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-roxo-600 text-white rounded-lg hover:bg-roxo-700 transition-colors flex items-center space-x-2"
            >
              <CheckIcon className="w-4 h-4" />
              <span>Salvar</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}