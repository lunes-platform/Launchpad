import { useState } from 'react'
import { TrendingUp, Clock, DollarSign, AlertCircle, Calculator } from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import { formatCurrency, formatTokenAmount, formatPercentage } from '@/lib/utils'
import toast from 'react-hot-toast'

interface LaunchpoolInterfaceProps {
  project: {
    id: string
    name: string
    phases: Array<{
      name: string
      allocation: number
    }>
  }
}

export function LaunchpoolInterface({ project }: LaunchpoolInterfaceProps) {
  const { selectedAccount } = useWallet()
  const [stakeAmount, setStakeAmount] = useState('')
  const [isStaking, setIsStaking] = useState(false)
  const [currentStake, setCurrentStake] = useState(0) // Mock current stake
  
  const launchpoolPhase = project.phases.find(phase => phase.name === 'Launchpool')
  
  if (!launchpoolPhase) return null

  // Mock data
  const totalStaked = 5000000 // Total LUNES staked in pool
  const poolAllocation = launchpoolPhase.allocation // Tokens allocated to launchpool
  const stakingAPR = 45.5 // Annual percentage rate
  const poolDuration = 14 // Days
  const userBalance = 10000 // User's LUNES balance
  
  // Calculations
  const userStakeAmount = stakeAmount ? parseFloat(stakeAmount) : 0
  const estimatedRewards = userStakeAmount > 0 ? 
    (userStakeAmount / (totalStaked + userStakeAmount)) * poolAllocation : 0
  const dailyRewards = estimatedRewards / poolDuration

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast.error('Digite um valor válido para stake')
      return
    }

    if (parseFloat(stakeAmount) > userBalance) {
      toast.error('Saldo insuficiente')
      return
    }

    setIsStaking(true)
    
    try {
      // Mock staking process
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setCurrentStake(currentStake + parseFloat(stakeAmount))
      toast.success('Stake realizado com sucesso!')
      setStakeAmount('')
    } catch (error) {
      toast.error('Erro ao realizar stake')
    } finally {
      setIsStaking(false)
    }
  }

  const handleUnstake = async () => {
    if (currentStake <= 0) return

    setIsStaking(true)
    
    try {
      // Mock unstaking process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setCurrentStake(0)
      toast.success('Unstake realizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao realizar unstake')
    } finally {
      setIsStaking(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="heading-4">Launchpool - Staking</h3>
          <p className="text-slate-200 text-sm">
            Faça staking de LUNES e ganhe tokens {project.name}
          </p>
        </div>
      </div>

      {/* Pool Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-primary/10 border border-primary/20 rounded-button p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">APR</span>
          </div>
          <p className="text-xl font-bold text-primary">{formatPercentage(stakingAPR)}</p>
        </div>
        
        <div className="bg-success/10 border border-success/20 rounded-button p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">Total Staked</span>
          </div>
          <p className="text-lg font-bold">{formatTokenAmount(totalStaked, 'LUNES')}</p>
        </div>
        
        <div className="bg-warning/10 border border-warning/20 rounded-button p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calculator className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-warning">Pool Allocation</span>
          </div>
          <p className="text-lg font-bold">{formatTokenAmount(poolAllocation, project.name.split(' ')[0])}</p>
        </div>
        
        <div className="bg-info/10 border border-info/20 rounded-button p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-info" />
            <span className="text-sm font-medium text-info">Duração</span>
          </div>
          <p className="text-lg font-bold">{poolDuration} dias</p>
        </div>
      </div>

      {/* Current Stake */}
      {currentStake > 0 && (
        <div className="bg-slate-800 border border-slate-600Light rounded-button p-4 mb-6">
          <h4 className="font-medium mb-3">Seu Stake Atual</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400 block">LUNES em Stake</span>
              <span className="font-medium text-lg">{formatTokenAmount(currentStake, 'LUNES')}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Recompensas Estimadas</span>
              <span className="font-medium text-lg text-primary">
                {formatTokenAmount((currentStake / totalStaked) * poolAllocation, project.name.split(' ')[0])}
              </span>
            </div>
          </div>
          
          <button
            onClick={handleUnstake}
            disabled={isStaking}
            className="btn-secondary mt-4"
          >
            Fazer Unstake
          </button>
        </div>
      )}

      {/* Stake Form */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Quantidade de LUNES para Stake</label>
          <span className="text-xs text-slate-200">
            Saldo: {formatTokenAmount(userBalance, 'LUNES')}
          </span>
        </div>
        <div className="relative">
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            max={userBalance}
            step="0.01"
            className="input w-full pr-20"
          />
          <button
            onClick={() => setStakeAmount(userBalance.toString())}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-primary hover:text-primaryLight transition-colors duration-200"
          >
            MAX
          </button>
        </div>
      </div>

      {/* Rewards Estimation */}
      {stakeAmount && parseFloat(stakeAmount) > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-button p-4 mb-6">
          <h4 className="font-medium text-primary mb-3">Estimativa de Recompensas</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-200">Seu Stake:</span>
              <span className="font-medium">{formatTokenAmount(userStakeAmount, 'LUNES')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-200">% do Pool:</span>
              <span className="font-medium">
                {formatPercentage((userStakeAmount / (totalStaked + userStakeAmount)) * 100)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-200">Recompensas Totais:</span>
              <span className="font-medium text-primary">
                {formatTokenAmount(estimatedRewards, project.name.split(' ')[0])}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-200">Recompensas Diárias:</span>
              <span className="font-medium text-success">
                {formatTokenAmount(dailyRewards, project.name.split(' ')[0])}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Important Info */}
      <div className="bg-warning/10 border border-warning/20 rounded-button p-4 mb-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-warning font-medium mb-1">
              Informações Importantes
            </p>
            <ul className="text-sm text-slate-200 space-y-1">
              <li>• Seus LUNES ficam bloqueados durante o período de staking</li>
              <li>• Recompensas são distribuídas proporcionalmente</li>
              <li>• Você pode fazer unstake a qualquer momento</li>
              <li>• Recompensas são calculadas em tempo real</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stake Button */}
      <button
        onClick={handleStake}
        disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > userBalance || isStaking}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isStaking ? (
          'Processando...'
        ) : (
          <>
            <TrendingUp className="w-4 h-4 mr-2" />
            Fazer Stake {stakeAmount ? `de ${formatTokenAmount(parseFloat(stakeAmount), 'LUNES')}` : ''}
          </>
        )}
      </button>

      <p className="text-xs text-slate-400 text-center mt-4">
        O staking é um processo seguro e você mantém controle total dos seus tokens.
        Recompensas são calculadas automaticamente.
      </p>
    </div>
  )
}
