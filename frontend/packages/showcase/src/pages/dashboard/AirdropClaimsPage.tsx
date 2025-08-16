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
  ExternalLink,
  Star
} from 'lucide-react'
import { formatCurrency, formatTokenAmount, formatDate, formatTimeRemaining } from '@/lib/utils'
import toast from 'react-hot-toast'

// Mock data
const availableAirdrops = [
  {
    id: 'airdrop-defi-protocol',
    projectName: 'DeFi Protocol',
    projectLogo: '🔷',
    symbol: 'DFP',
    amount: 500,
    value: 50,
    reason: 'Early Adopter Bonus',
    eligibilityDate: new Date('2024-01-15'),
    claimDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    status: 'available',
    tier: 'S',
    requirements: ['Investimento mínimo de $500', 'Participação na Whitelist']
  },
  {
    id: 'airdrop-gaming-metaverse',
    projectName: 'Gaming Metaverse',
    projectLogo: '🎮',
    symbol: 'GMV',
    amount: 1000,
    value: 350,
    reason: 'Community Engagement',
    eligibilityDate: new Date('2024-01-10'),
    claimDeadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    status: 'available',
    tier: 'A',
    requirements: ['Participação ativa na comunidade', 'Holding por 30+ dias']
  },
  {
    id: 'airdrop-treasury-bonus',
    projectName: 'Smart Fund Treasury',
    projectLogo: '💎',
    symbol: 'LUNES',
    amount: 2500,
    value: 1250,
    reason: 'Treasury Participation',
    eligibilityDate: new Date('2024-01-20'),
    claimDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'available',
    tier: 'S',
    requirements: ['Participação no Smart Fund', 'Stake mínimo de 1000 LUNES']
  }
]

const upcomingAirdrops = [
  {
    id: 'airdrop-web3-social',
    projectName: 'Web3 Social',
    projectLogo: '🌐',
    symbol: 'W3S',
    estimatedAmount: 750,
    estimatedValue: 180,
    reason: 'Beta Tester Reward',
    releaseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    tier: 'B',
    requirements: ['Teste da versão beta', 'Feedback qualificado']
  },
  {
    id: 'airdrop-ai-blockchain',
    projectName: 'AI Blockchain',
    projectLogo: '🤖',
    symbol: 'AIB',
    estimatedAmount: 300,
    estimatedValue: 90,
    reason: 'Launchpool Bonus',
    releaseDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    tier: 'S',
    requirements: ['Participação no Launchpool', 'Stake por 14+ dias']
  }
]

const claimedAirdrops = [
  {
    id: 'airdrop-claimed-1',
    projectName: 'AI Blockchain',
    projectLogo: '🤖',
    symbol: 'AIB',
    amount: 200,
    value: 60,
    reason: 'Early Supporter',
    claimedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
    tier: 'S'
  },
  {
    id: 'airdrop-claimed-2',
    projectName: 'Gaming Metaverse',
    projectLogo: '🎮',
    symbol: 'GMV',
    amount: 500,
    value: 175,
    reason: 'Whitelist Participant',
    claimedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12',
    tier: 'A'
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

export function AirdropClaimsPage() {
  const [activeTab, setActiveTab] = useState('available')
  const [claimingAirdrops, setClaimingAirdrops] = useState<string[]>([])

  const totalAvailableValue = availableAirdrops.reduce((sum, airdrop) => sum + airdrop.value, 0)
  const totalClaimedValue = claimedAirdrops.reduce((sum, airdrop) => sum + airdrop.value, 0)

  const handleClaimAirdrop = async (airdropId: string) => {
    setClaimingAirdrops(prev => [...prev, airdropId])
    
    try {
      // Mock claim process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const airdrop = availableAirdrops.find(a => a.id === airdropId)
      if (airdrop) {
        toast.success(`${formatTokenAmount(airdrop.amount, airdrop.symbol)} airdrop reivindicado!`)
      }
    } catch (error) {
      toast.error('Erro ao reivindicar airdrop')
    } finally {
      setClaimingAirdrops(prev => prev.filter(id => id !== airdropId))
    }
  }

  const tabs = [
    { id: 'available', label: 'Disponíveis', count: availableAirdrops.length },
    { id: 'upcoming', label: 'Próximos', count: upcomingAirdrops.length },
    { id: 'claimed', label: 'Reivindicados', count: claimedAirdrops.length }
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
              <h1 className="heading-2 mb-2">Airdrops Disponíveis</h1>
              <p className="text-slate-200">
                Reivindique seus airdrops e recompensas especiais da plataforma
              </p>
            </div>
            
            <Link to="/treasury" className="btn-outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Ver Smart Fund Treasury
            </Link>
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
            <p className="text-sm text-slate-200">{availableAirdrops.length} airdrops</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <span className="text-xs text-warning">Próximos</span>
            </div>
            <p className="text-2xl font-bold mb-1">
              {formatCurrency(upcomingAirdrops.reduce((sum, a) => sum + a.estimatedValue, 0))}
            </p>
            <p className="text-sm text-slate-200">{upcomingAirdrops.length} estimados</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-primary">Reivindicado</span>
            </div>
            <p className="text-2xl font-bold mb-1">{formatCurrency(totalClaimedValue)}</p>
            <p className="text-sm text-slate-200">{claimedAirdrops.length} airdrops</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-info" />
              </div>
              <span className="text-xs text-info">Total</span>
            </div>
            <p className="text-2xl font-bold mb-1">
              {formatCurrency(totalAvailableValue + totalClaimedValue)}
            </p>
            <p className="text-sm text-slate-200">Valor Total</p>
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

          {/* Available Airdrops */}
          {activeTab === 'available' && (
            <div className="space-y-4">
              {availableAirdrops.map((airdrop) => (
                <div key={airdrop.id} className="p-6 bg-slate-800 border border-slate-600Light rounded-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{airdrop.projectLogo}</div>
                      
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-title font-semibold text-lg">{airdrop.projectName}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTierColor(airdrop.tier)}`}>
                            Tier {airdrop.tier}
                          </span>
                          <span className="bg-success/20 text-success text-xs px-2 py-1 rounded-full font-medium">
                            DISPONÍVEL
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-slate-200 mb-3">
                          <span>Motivo: {airdrop.reason}</span>
                          <span>•</span>
                          <span>Elegível desde {formatDate(airdrop.eligibilityDate)}</span>
                          <span>•</span>
                          <span>Expira em {formatTimeRemaining(airdrop.claimDeadline)}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {airdrop.requirements.map((req, index) => (
                            <span
                              key={index}
                              className="text-xs bg-info/10 text-info border border-info/20 rounded-full px-2 py-1"
                            >
                              ✓ {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-success">
                          {formatTokenAmount(airdrop.amount, airdrop.symbol)}
                        </p>
                        <p className="text-sm text-slate-200">
                          ≈ {formatCurrency(airdrop.value)}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleClaimAirdrop(airdrop.id)}
                        disabled={claimingAirdrops.includes(airdrop.id)}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {claimingAirdrops.includes(airdrop.id) ? (
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
                </div>
              ))}
              
              {availableAirdrops.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-textMuted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="heading-4 mb-2">Nenhum airdrop disponível</h3>
                  <p className="text-slate-200 mb-6">
                    Você não possui airdrops disponíveis para reivindicar no momento.
                  </p>
                  <Link to="/projetos" className="btn-primary">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Explorar Projetos
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Upcoming Airdrops */}
          {activeTab === 'upcoming' && (
            <div className="space-y-4">
              {upcomingAirdrops.map((airdrop) => (
                <div key={airdrop.id} className="p-6 bg-slate-800 border border-slate-600Light rounded-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{airdrop.projectLogo}</div>

                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-title font-semibold text-lg">{airdrop.projectName}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTierColor(airdrop.tier)}`}>
                            Tier {airdrop.tier}
                          </span>
                          <span className="bg-warning/20 text-warning text-xs px-2 py-1 rounded-full font-medium">
                            EM BREVE
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-slate-200 mb-3">
                          <span>Motivo: {airdrop.reason}</span>
                          <span>•</span>
                          <span>Libera em {formatDate(airdrop.releaseDate)}</span>
                          <span>•</span>
                          <span>Em {formatTimeRemaining(airdrop.releaseDate)}</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {airdrop.requirements.map((req, index) => (
                            <span
                              key={index}
                              className="text-xs bg-warning/10 text-warning border border-warning/20 rounded-full px-2 py-1"
                            >
                              ⏳ {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-warning">
                        ~{formatTokenAmount(airdrop.estimatedAmount, airdrop.symbol)}
                      </p>
                      <p className="text-sm text-slate-200">
                        ≈ {formatCurrency(airdrop.estimatedValue)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {upcomingAirdrops.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-textMuted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="heading-4 mb-2">Nenhum airdrop programado</h3>
                  <p className="text-slate-200">
                    Não há airdrops programados no momento.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Claimed Airdrops */}
          {activeTab === 'claimed' && (
            <div className="space-y-4">
              {claimedAirdrops.map((airdrop) => (
                <div key={airdrop.id} className="p-6 bg-slate-800 border border-slate-600Light rounded-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{airdrop.projectLogo}</div>

                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-title font-semibold text-lg">{airdrop.projectName}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTierColor(airdrop.tier)}`}>
                            Tier {airdrop.tier}
                          </span>
                          <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full font-medium">
                            REIVINDICADO
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-slate-200">
                          <span>Motivo: {airdrop.reason}</span>
                          <span>•</span>
                          <span>Reivindicado em {formatDate(airdrop.claimedDate)}</span>
                          <span>•</span>
                          <a
                            href={`https://explorer.lunes.io/tx/${airdrop.transactionHash}`}
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
                        {formatTokenAmount(airdrop.amount, airdrop.symbol)}
                      </p>
                      <p className="text-sm text-slate-200">
                        ≈ {formatCurrency(airdrop.value)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {claimedAirdrops.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-textMuted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="heading-4 mb-2">Nenhum airdrop reivindicado</h3>
                  <p className="text-slate-200">
                    Você ainda não reivindicou nenhum airdrop.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* How to Earn Airdrops */}
        <div className="card bg-info/10 border-info/20">
          <div className="flex items-start space-x-3">
            <Gift className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-info mb-2">Como Ganhar Airdrops</h4>
              <ul className="text-sm text-slate-200 space-y-1">
                <li>• <strong>Participe de projetos:</strong> Invista em whitelists e pré-vendas</li>
                <li>• <strong>Seja ativo na comunidade:</strong> Engaje nas redes sociais e Discord</li>
                <li>• <strong>Use o Smart Fund Treasury:</strong> Participe do fundo inteligente</li>
                <li>• <strong>Faça staking:</strong> Mantenha tokens em staking por períodos longos</li>
                <li>• <strong>Refira amigos:</strong> Use o sistema de afiliados</li>
                <li>• <strong>Teste produtos:</strong> Participe de betas e forneça feedback</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
