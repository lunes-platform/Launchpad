import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Gift, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  Download,
  ExternalLink
} from 'lucide-react'
import { formatCurrency, formatTokenAmount, formatDate, formatTimeRemaining } from '@/lib/utils'
import toast from 'react-hot-toast'

// Mock data
const claimableTokens = [
  {
    id: 'gaming-metaverse-claim-1',
    projectId: 'gaming-metaverse',
    projectName: 'Gaming Metaverse',
    projectLogo: '🎮',
    symbol: 'GMV',
    amount: 2000,
    value: 700,
    releaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    claimDeadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days from now
    vestingRound: 2,
    totalRounds: 6,
    status: 'available',
    tier: 'A'
  },
  {
    id: 'defi-protocol-claim-1',
    projectId: 'defi-protocol',
    projectName: 'DeFi Protocol',
    projectLogo: '🔷',
    symbol: 'DFP',
    amount: 3125,
    value: 312.50,
    releaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    claimDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    vestingRound: 1,
    totalRounds: 12,
    status: 'available',
    tier: 'S'
  },
  {
    id: 'ai-blockchain-claim-final',
    projectId: 'ai-blockchain',
    projectName: 'AI Blockchain',
    projectLogo: '🤖',
    symbol: 'AIB',
    amount: 500,
    value: 150,
    releaseDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    claimDeadline: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000), // 29 days from now
    vestingRound: 1,
    totalRounds: 1,
    status: 'available',
    tier: 'S'
  }
]

const upcomingReleases = [
  {
    id: 'defi-protocol-claim-2',
    projectId: 'defi-protocol',
    projectName: 'DeFi Protocol',
    projectLogo: '🔷',
    symbol: 'DFP',
    amount: 3125,
    value: 312.50,
    releaseDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    vestingRound: 2,
    totalRounds: 12,
    tier: 'S'
  },
  {
    id: 'gaming-metaverse-claim-2',
    projectId: 'gaming-metaverse',
    projectName: 'Gaming Metaverse',
    projectLogo: '🎮',
    symbol: 'GMV',
    amount: 2000,
    value: 700,
    releaseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    vestingRound: 3,
    totalRounds: 6,
    tier: 'A'
  },
  {
    id: 'web3-social-claim-1',
    projectId: 'web3-social',
    projectName: 'Web3 Social',
    projectLogo: '🌐',
    symbol: 'W3S',
    amount: 667,
    value: 160,
    releaseDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    vestingRound: 1,
    totalRounds: 3,
    tier: 'B'
  }
]

const claimedHistory = [
  {
    id: 'gaming-metaverse-claimed-1',
    projectId: 'gaming-metaverse',
    projectName: 'Gaming Metaverse',
    projectLogo: '🎮',
    symbol: 'GMV',
    amount: 2000,
    value: 650,
    claimedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    vestingRound: 1,
    totalRounds: 6,
    transactionHash: '0x1234...5678',
    tier: 'A'
  },
  {
    id: 'ai-blockchain-claimed-all',
    projectId: 'ai-blockchain',
    projectName: 'AI Blockchain',
    projectLogo: '🤖',
    symbol: 'AIB',
    amount: 1000,
    value: 280,
    claimedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    vestingRound: 1,
    totalRounds: 1,
    transactionHash: '0xabcd...efgh',
    tier: 'S'
  }
]

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'S': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
    case 'A': return 'bg-gradient-to-r from-primary to-primaryLight text-white'
    case 'B': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
    case 'C': return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
    default: return 'bg-textMuted text-white'
  }
}

export function ClaimTokensPage() {
  const [activeTab, setActiveTab] = useState('available')
  const [claimingTokens, setClaimingTokens] = useState<string[]>([])
  const [selectedClaims, setSelectedClaims] = useState<string[]>([])

  const totalAvailableValue = claimableTokens.reduce((sum, token) => sum + token.value, 0)
  const totalAvailableTokens = claimableTokens.length

  const handleClaim = async (claimId: string) => {
    setClaimingTokens(prev => [...prev, claimId])
    
    try {
      // Mock claim process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const claim = claimableTokens.find(c => c.id === claimId)
      if (claim) {
        toast.success(`${formatTokenAmount(claim.amount, claim.symbol)} reivindicados com sucesso!`)
      }
    } catch (error) {
      toast.error('Erro ao reivindicar tokens')
    } finally {
      setClaimingTokens(prev => prev.filter(id => id !== claimId))
    }
  }

  const handleBulkClaim = async () => {
    if (selectedClaims.length === 0) return

    setClaimingTokens(selectedClaims)
    
    try {
      // Mock bulk claim process
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast.success(`${selectedClaims.length} reivindicações processadas com sucesso!`)
      setSelectedClaims([])
    } catch (error) {
      toast.error('Erro ao processar reivindicações em lote')
    } finally {
      setClaimingTokens([])
    }
  }

  const toggleSelectClaim = (claimId: string) => {
    setSelectedClaims(prev => 
      prev.includes(claimId) 
        ? prev.filter(id => id !== claimId)
        : [...prev, claimId]
    )
  }

  const selectAllClaims = () => {
    setSelectedClaims(claimableTokens.map(c => c.id))
  }

  const deselectAllClaims = () => {
    setSelectedClaims([])
  }

  const tabs = [
    { id: 'available', label: 'Disponíveis', count: claimableTokens.length },
    { id: 'upcoming', label: 'Próximas', count: upcomingReleases.length },
    { id: 'history', label: 'Histórico', count: claimedHistory.length }
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-600Light">
        <div className="container-custom py-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 text-slate-200 hover:text-primary transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Dashboard</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="heading-2 mb-2">Tokens a Reivindicar</h1>
              <p className="text-slate-200">
                Gerencie e reivindique seus tokens liberados do cronograma de vesting
              </p>
            </div>
            
            {claimableTokens.length > 0 && (
              <div className="flex items-center space-x-4">
                {selectedClaims.length > 0 && (
                  <button
                    onClick={handleBulkClaim}
                    disabled={claimingTokens.length > 0}
                    className="btn-primary disabled:opacity-50"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Reivindicar Selecionados ({selectedClaims.length})
                  </button>
                )}
                
                <Link to="/dashboard/meus-investimentos" className="btn-outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Ver Investimentos
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-success" />
              </div>
              <span className="text-xs text-success">Disponível</span>
            </div>
            <p className="text-2xl font-bold mb-1">{formatCurrency(totalAvailableValue)}</p>
            <p className="text-sm text-slate-200">{totalAvailableTokens} reivindicações</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <span className="text-xs text-warning">Próximas</span>
            </div>
            <p className="text-2xl font-bold mb-1">
              {formatCurrency(upcomingReleases.reduce((sum, token) => sum + token.value, 0))}
            </p>
            <p className="text-sm text-slate-200">{upcomingReleases.length} liberações</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-primary">Reivindicado</span>
            </div>
            <p className="text-2xl font-bold mb-1">
              {formatCurrency(claimedHistory.reduce((sum, token) => sum + token.value, 0))}
            </p>
            <p className="text-sm text-slate-200">{claimedHistory.length} transações</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-info" />
              </div>
              <span className="text-xs text-info">Próxima</span>
            </div>
            <p className="text-2xl font-bold mb-1">
              {upcomingReleases.length > 0 ? formatTimeRemaining(upcomingReleases[0].releaseDate) : 'N/A'}
            </p>
            <p className="text-sm text-slate-200">Liberação</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="card mb-8">
          <div className="border-b border-slate-600Light mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate-200 hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="bg-slate-800 border border-slate-600Light rounded-full px-2 py-1 text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Bulk Actions for Available Tab */}
          {activeTab === 'available' && claimableTokens.length > 0 && (
            <div className="flex items-center justify-between mb-6 p-4 bg-primary/10 border border-primary/20 rounded-button">
              <div className="flex items-center space-x-4">
                <button
                  onClick={selectedClaims.length === claimableTokens.length ? deselectAllClaims : selectAllClaims}
                  className="text-sm text-primary hover:text-primaryLight transition-colors duration-200"
                >
                  {selectedClaims.length === claimableTokens.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                </button>
                {selectedClaims.length > 0 && (
                  <span className="text-sm text-slate-200">
                    {selectedClaims.length} de {claimableTokens.length} selecionados
                  </span>
                )}
              </div>
              
              {selectedClaims.length > 0 && (
                <button
                  onClick={handleBulkClaim}
                  disabled={claimingTokens.length > 0}
                  className="btn-primary text-sm disabled:opacity-50"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Reivindicar Selecionados
                </button>
              )}
            </div>
          )}

          {/* Tab Content */}
          {activeTab === 'available' && (
            <div className="space-y-4">
              {claimableTokens.map((claim) => (
                <div key={claim.id} className="p-6 bg-slate-800 border border-slate-600Light rounded-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedClaims.includes(claim.id)}
                        onChange={() => toggleSelectClaim(claim.id)}
                        className="w-4 h-4 text-primary bg-slate-900 border-slate-600Light rounded focus:ring-primary focus:ring-2"
                      />
                      
                      <div className="text-3xl">{claim.projectLogo}</div>
                      
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-title font-semibold text-lg">{claim.projectName}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTierColor(claim.tier)}`}>
                            Tier {claim.tier}
                          </span>
                          <span className="bg-success/20 text-success text-xs px-2 py-1 rounded-full font-medium">
                            DISPONÍVEL
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-slate-200">
                          <span>Liberação {claim.vestingRound}/{claim.totalRounds}</span>
                          <span>•</span>
                          <span>Liberado em {formatDate(claim.releaseDate)}</span>
                          <span>•</span>
                          <span>Expira em {formatTimeRemaining(claim.claimDeadline)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-success">
                          {formatTokenAmount(claim.amount, claim.symbol)}
                        </p>
                        <p className="text-sm text-slate-200">
                          ≈ {formatCurrency(claim.value)}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleClaim(claim.id)}
                        disabled={claimingTokens.includes(claim.id)}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {claimingTokens.includes(claim.id) ? (
                          'Reivindicando...'
                        ) : (
                          <>
                            <Gift className="w-4 h-4 mr-2" />
                            Reivindicar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progresso do Vesting</span>
                      <span>{claim.vestingRound}/{claim.totalRounds} liberações</span>
                    </div>
                    <div className="w-full bg-borderLight rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-success to-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(claim.vestingRound / claim.totalRounds) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {claimableTokens.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-textMuted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="heading-4 mb-2">Nenhum token disponível</h3>
                  <p className="text-slate-200 mb-6">
                    Você não possui tokens disponíveis para reivindicar no momento.
                  </p>
                  <Link to="/dashboard/meus-investimentos" className="btn-primary">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Ver Meus Investimentos
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'upcoming' && (
            <div className="space-y-4">
              {upcomingReleases.map((release) => (
                <div key={release.id} className="p-6 bg-slate-800 border border-slate-600Light rounded-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{release.projectLogo}</div>

                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-title font-semibold text-lg">{release.projectName}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTierColor(release.tier)}`}>
                            Tier {release.tier}
                          </span>
                          <span className="bg-warning/20 text-warning text-xs px-2 py-1 rounded-full font-medium">
                            AGUARDANDO
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-slate-200">
                          <span>Liberação {release.vestingRound}/{release.totalRounds}</span>
                          <span>•</span>
                          <span>Libera em {formatDate(release.releaseDate)}</span>
                          <span>•</span>
                          <span>Em {formatTimeRemaining(release.releaseDate)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-warning">
                        {formatTokenAmount(release.amount, release.symbol)}
                      </p>
                      <p className="text-sm text-slate-200">
                        ≈ {formatCurrency(release.value)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progresso do Vesting</span>
                      <span>{release.vestingRound - 1}/{release.totalRounds} liberações</span>
                    </div>
                    <div className="w-full bg-borderLight rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-warning to-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((release.vestingRound - 1) / release.totalRounds) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {upcomingReleases.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-textMuted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="heading-4 mb-2">Nenhuma liberação programada</h3>
                  <p className="text-slate-200">
                    Você não possui liberações de tokens programadas.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {claimedHistory.map((claimed) => (
                <div key={claimed.id} className="p-6 bg-slate-800 border border-slate-600Light rounded-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{claimed.projectLogo}</div>

                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-title font-semibold text-lg">{claimed.projectName}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTierColor(claimed.tier)}`}>
                            Tier {claimed.tier}
                          </span>
                          <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full font-medium">
                            REIVINDICADO
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-slate-200">
                          <span>Liberação {claimed.vestingRound}/{claimed.totalRounds}</span>
                          <span>•</span>
                          <span>Reivindicado em {formatDate(claimed.claimedDate)}</span>
                          <span>•</span>
                          <a
                            href={`https://explorer.lunes.io/tx/${claimed.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primaryLight transition-colors duration-200 flex items-center space-x-1"
                          >
                            <span>Ver transação</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {formatTokenAmount(claimed.amount, claimed.symbol)}
                      </p>
                      <p className="text-sm text-slate-200">
                        ≈ {formatCurrency(claimed.value)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {claimedHistory.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-textMuted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="heading-4 mb-2">Nenhuma reivindicação realizada</h3>
                  <p className="text-slate-200">
                    Você ainda não reivindicou nenhum token.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Important Notice */}
        <div className="card bg-warning/10 border-warning/20">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-warning mb-2">Informações Importantes</h4>
              <ul className="text-sm text-slate-200 space-y-1">
                <li>• Tokens liberados devem ser reivindicados dentro de 30 dias</li>
                <li>• Após o prazo, os tokens podem ser perdidos permanentemente</li>
                <li>• Verifique sempre o endereço da carteira antes de confirmar</li>
                <li>• Transações na blockchain são irreversíveis</li>
                <li>• Em caso de dúvidas, consulte nossa documentação ou suporte</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
