import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Wallet,
  Clock,
  Info
} from 'lucide-react';
import { Modal, AnimatedButton, Input } from '@launchpad/shared-ui';
import { useLaunchpoolStore, type Pool } from '../../stores/launchpoolStore';

interface StakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pool: Pool | null;
}

export const StakingModal: React.FC<StakingModalProps> = ({
  isOpen,
  onClose,
  pool
}) => {
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { stakeTokens, isStaking } = useLaunchpoolStore();
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset state when modal opens/closes or pool changes
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setError(null);
      setIsSuccess(false);
    }
  }, [isOpen, pool]);

  if (!pool) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only positive numbers and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError(null);
    } else if (value === '.') {
      setAmount('0.');
      setError(null);
    }
  };

  const handleMaxClick = () => {
    // TODO: In a real app, this would get the user's wallet balance
    // For now, we'll set a mock max value or just not support it fully without wallet connection
    setAmount('1000'); // Mock balance
  };

  const handleStake = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Por favor, insira um valor válido para staking.');
      return;
    }

    if (parseFloat(amount) < parseFloat(pool.minStake)) {
      setError(`O valor mínimo para staking é ${pool.minStake} ${pool.token}.`);
      return;
    }

    if (pool.maxStake && parseFloat(amount) > parseFloat(pool.maxStake)) {
      setError(`O valor máximo para staking é ${pool.maxStake} ${pool.token}.`);
      return;
    }

    const success = await stakeTokens(pool.id, amount);

    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setError('Falha ao realizar staking. Tente novamente.');
    }
  };

  const calculateEstimatedRewards = () => {
    if (!amount || parseFloat(amount) <= 0) return '0';
    const amountNum = parseFloat(amount);
    // APY is annual, so we calculate for the lock period if exists, otherwise daily
    const durationInDays = pool.lockPeriod > 0 ? pool.lockPeriod : 30; // Default to 30 days for estimation if no lock
    const yearlyReturn = amountNum * (pool.apy / 100);
    const periodReturn = yearlyReturn * (durationInDays / 365);
    return periodReturn.toFixed(4);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={isSuccess ? "Staking Realizado!" : `Staking em ${pool.name}`}
    >
      {isSuccess ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Sucesso!</h3>
          <p className="text-gray-300">
            Você fez staking de {amount} {pool.token} com sucesso.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pool Info Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-400">APY</span>
              </div>
              <p className="text-lg font-bold text-green-400">{pool.apy}%</p>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-400">Lock Period</span>
              </div>
              <p className="text-lg font-bold text-white">
                {pool.lockPeriod > 0 ? `${pool.lockPeriod} dias` : 'Flexível'}
              </p>
            </div>
          </div>

          {/* Input Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-300">
                Quantidade para Stake
              </label>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <Wallet className="w-3 h-3" />
                <span>Saldo: 1000.00 {pool.token}</span> {/* Mock balance */}
              </div>
            </div>

            <div className="relative">
              <Input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder={`Mínimo: ${pool.minStake}`}
                className="pr-20"
                disabled={isStaking}
              />
              <button
                onClick={handleMaxClick}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-purple-400 hover:text-purple-300 px-2 py-1 rounded hover:bg-purple-500/10 transition-colors"
                disabled={isStaking}
              >
                MÁX
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm mt-1">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Estimation Section */}
          <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-white">Estimativa de Retorno</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Recompensa Estimada:</span>
              <span className="font-semibold text-green-400">
                {calculateEstimatedRewards()} {pool.rewardToken}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              * Baseado no APY atual e período de {pool.lockPeriod > 0 ? pool.lockPeriod : 30} dias.
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <AnimatedButton
              variant="outline"
              onClick={onClose}
              disabled={isStaking}
              className="flex-1"
            >
              Cancelar
            </AnimatedButton>
            <AnimatedButton
              variant="primary"
              onClick={handleStake}
              disabled={isStaking || !amount || parseFloat(amount) <= 0}
              loading={isStaking}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
            >
              {isStaking ? 'Processando...' : 'Confirmar Staking'}
            </AnimatedButton>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default StakingModal;
