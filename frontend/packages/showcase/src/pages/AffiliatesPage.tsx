import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  TrendingUp,
  DollarSign,
  Share2,
  Gift,
  Target,
  Award,
  Copy,
  ExternalLink,
  Calendar,
  BarChart3,
  PieChart,
  RefreshCw,
  Download,
  Info,
  CheckCircle,
  Clock,
  Star,
  Zap
} from 'lucide-react'
import { StatsCard, MetricCard } from '@/components/ui/StatsCard'
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils'
import { useWallet } from '@/contexts/WalletContext'
import { useApp } from '@/contexts/AppContext'
import toast from 'react-hot-toast'

// Affiliate interfaces
interface AffiliateStats {
  totalEarnings: number
  monthlyEarnings: number
  totalReferrals: number
  activeReferrals: number
  conversionRate: number
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
  commissionRate: number
  nextTierRequirement: number
}

interface Referral {
  id: string
  username: string
  joinDate: Date
  status: 'active' | 'inactive'
  totalInvested: number
  commissionEarned: number
  lastActivity: Date
  tier: string
}

interface Commission {
  id: string
  type: 'investment' | 'trading' | 'staking' | 'raffle'
  amount: number
  rate: number
  referralId: string
  referralUsername: string
  timestamp: Date
  status: 'pending' | 'paid' | 'cancelled'
  description: string
}

interface AffiliateTier {
  name: string
  icon: string
  color: string
  commissionRate: number
  requirements: {
    referrals: number
    volume: number
  }
  benefits: string[]
}

// Mock affiliate data
const affiliateStats: AffiliateStats = {
  totalEarnings: 12500,
  monthlyEarnings: 2800,
  totalReferrals: 45,
  activeReferrals: 32,
  conversionRate: 68.5,
  tier: 'Gold',
  commissionRate: 12,
  nextTierRequirement: 15000
}

const referrals: Referral[] = [
  {
    id: '1',
    username: 'crypto_trader_01',
    joinDate: new Date('2024-01-15'),
    status: 'active',
    totalInvested: 5000,
    commissionEarned: 600,
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    tier: 'Gold'
  },
  {
    id: '2',
    username: 'defi_enthusiast',
    joinDate: new Date('2024-01-20'),
    status: 'active',
    totalInvested: 3200,
    commissionEarned: 384,
    lastActivity: new Date(Date.now() - 6 * 60 * 60 * 1000),
    tier: 'Silver'
  },
  {
    id: '3',
    username: 'blockchain_investor',
    joinDate: new Date('2024-02-01'),
    status: 'active',
    totalInvested: 8500,
    commissionEarned: 1020,
    lastActivity: new Date(Date.now() - 12 * 60 * 60 * 1000),
    tier: 'Platinum'
  },
  {
    id: '4',
    username: 'nft_collector',
    joinDate: new Date('2024-02-10'),
    status: 'inactive',
    totalInvested: 1500,
    commissionEarned: 180,
    lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    tier: 'Bronze'
  }
]

const recentCommissions: Commission[] = [
  {
    id: '1',
    type: 'investment',
    amount: 150,
    rate: 12,
    referralId: '1',
    referralUsername: 'crypto_trader_01',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'paid',
    description: 'Investimento no DeFi Protocol'
  },
  {
    id: '2',
    type: 'staking',
    amount: 45,
    rate: 10,
    referralId: '2',
    referralUsername: 'defi_enthusiast',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: 'paid',
    description: 'Staking no Launchpool'
  },
  {
    id: '3',
    type: 'raffle',
    amount: 25,
    rate: 15,
    referralId: '3',
    referralUsername: 'blockchain_investor',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    status: 'pending',
    description: 'Compra de bilhetes de rifa'
  },
  {
    id: '4',
    type: 'investment',
    amount: 200,
    rate: 12,
    referralId: '1',
    referralUsername: 'crypto_trader_01',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'paid',
    description: 'Investimento no Gaming Metaverse'
  }
]

const affiliateTiers: AffiliateTier[] = [
  {
    name: 'Bronze',
    icon: '🥉',
    color: 'text-amber-600',
    commissionRate: 5,
    requirements: { referrals: 0, volume: 0 },
    benefits: ['5% de comissão', 'Dashboard básico', 'Suporte por email']
  },
  {
    name: 'Silver',
    icon: '🥈',
    color: 'text-gray-400',
    commissionRate: 8,
    requirements: { referrals: 10, volume: 5000 },
    benefits: ['8% de comissão', 'Materiais de marketing', 'Suporte prioritário']
  },
  {
    name: 'Gold',
    icon: '🥇',
    color: 'text-yellow-500',
    commissionRate: 12,
    requirements: { referrals: 25, volume: 15000 },
    benefits: ['12% de comissão', 'Bônus mensais', 'Gerente dedicado']
  },
  {
    name: 'Platinum',
    icon: '💎',
    color: 'text-blue-400',
    commissionRate: 15,
    requirements: { referrals: 50, volume: 50000 },
    benefits: ['15% de comissão', 'Eventos exclusivos', 'API personalizada']
  },
  {
    name: 'Diamond',
    icon: '💠',
    color: 'text-purple-400',
    commissionRate: 20,
    requirements: { referrals: 100, volume: 100000 },
    benefits: ['20% de comissão', 'Participação nos lucros', 'Consultoria 1:1']
  }
]

export default function AffiliatesPage() {
  const { selectedAccount } = useWallet()
  const { addNotification } = useApp()
  const [activeTab, setActiveTab] = useState('overview')
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)

  // Mock affiliate link
  const affiliateLink = selectedAccount
    ? `https://launchpadlunes.com/ref/${selectedAccount.address.slice(0, 8)}`
    : ''

  const handleGenerateLink = async () => {
    if (!selectedAccount) {
      toast.error('Conecte sua carteira primeiro')
      return
    }

    setIsGeneratingLink(true)
    try {
      // Mock link generation
      await new Promise(resolve => setTimeout(resolve, 1000))

      addNotification({
        type: 'success',
        title: 'Link de Afiliado Gerado',
        message: 'Seu link de afiliado foi gerado com sucesso!'
      })

      toast.success('Link de afiliado gerado!')
    } catch (error) {
      toast.error('Erro ao gerar link')
    } finally {
      setIsGeneratingLink(false)
    }
  }

  const copyAffiliateLink = () => {
    if (affiliateLink) {
      navigator.clipboard.writeText(affiliateLink)
      toast.success('Link copiado para a área de transferência!')
    }
  }

  const shareOnSocial = (platform: string) => {
    const text = 'Junte-se ao Launchpad Lunes e invista em projetos inovadores!'
    const url = affiliateLink

    let shareUrl = ''
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-success/20 text-success border-success/30'
      case 'pending': return 'bg-warning/20 text-warning border-warning/30'
      case 'cancelled': return 'bg-error/20 text-error border-error/30'
      default: return 'bg-textMuted/20 text-slate-400 border-textMuted/30'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago'
      case 'pending': return 'Pendente'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
  }

  const getCommissionIcon = (type: string) => {
    switch (type) {
      case 'investment': return <Target className="w-4 h-4" />
      case 'trading': return <TrendingUp className="w-4 h-4" />
      case 'staking': return <Zap className="w-4 h-4" />
      case 'raffle': return <Gift className="w-4 h-4" />
      default: return <DollarSign className="w-4 h-4" />
    }
  }

  const getCommissionLabel = (type: string) => {
    switch (type) {
      case 'investment': return 'Investimento'
      case 'trading': return 'Trading'
      case 'staking': return 'Staking'
      case 'raffle': return 'Rifa'
      default: return type
    }
  }

  const getCurrentTier = () => {
    return affiliateTiers.find(tier => tier.name === affiliateStats.tier) || affiliateTiers[0]
  }

  const getNextTier = () => {
    const currentIndex = affiliateTiers.findIndex(tier => tier.name === affiliateStats.tier)
    return currentIndex < affiliateTiers.length - 1 ? affiliateTiers[currentIndex + 1] : null
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container-custom text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Programa de Afiliados</span>
          </div>

          <h1 className="heading-1 mb-6">
            <Users className="w-12 h-12 inline-block mr-4 text-primary" />
            Sistema de <span className="text-gradient">Afiliados</span>
          </h1>
          <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
            Ganhe comissões de 5% a 20% indicando novos usuários para a plataforma.
            Quanto mais você indica, maior sua comissão e benefícios exclusivos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleGenerateLink} className="btn-primary">
              <Share2 className="w-4 h-4 mr-2" />
              Gerar Link de Afiliado
            </button>
            <Link to="#tiers" className="btn-outline">
              <Award className="w-4 h-4 mr-2" />
              Ver Níveis
            </Link>
          </div>
        </div>
      </section>

      {/* Affiliate Statistics */}
      <section className="section-padding">
        <div className="container-custom">
          {selectedAccount ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                  label="Ganhos Totais"
                  value={formatCurrency(affiliateStats.totalEarnings)}
                  change={{ value: 25, period: 'este mês' }}
                  icon={DollarSign}
                  color="success"
                />
                <MetricCard
                  label="Referidos Ativos"
                  value={affiliateStats.activeReferrals}
                  change={{ value: 3, period: 'novos este mês' }}
                  icon={Users}
                  color="primary"
                />
                <MetricCard
                  label="Taxa de Conversão"
                  value={`${affiliateStats.conversionRate}%`}
                  change={{ value: 5.2, period: 'melhoria' }}
                  icon={TrendingUp}
                  color="info"
                />
                <MetricCard
                  label="Nível Atual"
                  value={affiliateStats.tier}
                  change={{ value: affiliateStats.commissionRate, period: '% comissão' }}
                  icon={Award}
                  color="warning"
                />
              </div>

              {/* Current Tier Progress */}
              <div className="card bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{getCurrentTier().icon}</span>
                      <h3 className="heading-4">{getCurrentTier().name}</h3>
                      <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded-full">
                        {getCurrentTier().commissionRate}% comissão
                      </span>
                    </div>
                    <p className="text-slate-200">
                      Você está no nível {affiliateStats.tier} com {affiliateStats.commissionRate}% de comissão
                    </p>
                  </div>

                  {getNextTier() && (
                    <div className="text-center md:text-right">
                      <p className="text-sm text-slate-200 mb-1">Próximo nível:</p>
                      <p className="font-medium">{getNextTier()?.name}</p>
                      <p className="text-xs text-slate-200">
                        Faltam {formatCurrency(getNextTier()!.requirements.volume - affiliateStats.totalEarnings)} em volume
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-3 rounded-button font-medium transition-colors duration-200 ${
                    activeTab === 'overview'
                      ? 'bg-primary text-white'
                      : 'bg-slate-800 hover:bg-slate-800Hover text-slate-200 border border-slate-600Light'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 mr-2 inline-block" />
                  Visão Geral
                </button>
                <button
                  onClick={() => setActiveTab('referrals')}
                  className={`px-6 py-3 rounded-button font-medium transition-colors duration-200 ${
                    activeTab === 'referrals'
                      ? 'bg-primary text-white'
                      : 'bg-slate-800 hover:bg-slate-800Hover text-slate-200 border border-slate-600Light'
                  }`}
                >
                  <Users className="w-4 h-4 mr-2 inline-block" />
                  Meus Referidos ({affiliateStats.totalReferrals})
                </button>
                <button
                  onClick={() => setActiveTab('commissions')}
                  className={`px-6 py-3 rounded-button font-medium transition-colors duration-200 ${
                    activeTab === 'commissions'
                      ? 'bg-primary text-white'
                      : 'bg-slate-800 hover:bg-slate-800Hover text-slate-200 border border-slate-600Light'
                  }`}
                >
                  <DollarSign className="w-4 h-4 mr-2 inline-block" />
                  Comissões
                </button>
                <button
                  onClick={() => setActiveTab('tools')}
                  className={`px-6 py-3 rounded-button font-medium transition-colors duration-200 ${
                    activeTab === 'tools'
                      ? 'bg-primary text-white'
                      : 'bg-slate-800 hover:bg-slate-800Hover text-slate-200 border border-slate-600Light'
                  }`}
                >
                  <Share2 className="w-4 h-4 mr-2 inline-block" />
                  Ferramentas
                </button>
              </div>
            </>
          ) : (
            <div className="card text-center py-12">
              <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="heading-4 mb-2">Conecte sua Carteira</h3>
              <p className="text-slate-200 mb-6">
                Conecte sua carteira para acessar o programa de afiliados
              </p>
              <button className="btn-primary">
                <Users className="w-4 h-4 mr-2" />
                Conectar Carteira
              </button>
            </div>
          )}
        </div>
      </section>

      {selectedAccount && (
        <div className="container-custom pb-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Affiliate Link */}
                <div className="card">
                  <h3 className="heading-4 mb-4">Seu Link de Afiliado</h3>
                  <div className="bg-slate-800 border border-slate-600Light rounded-card p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <code className="flex-1 text-sm font-mono break-all">
                        {affiliateLink}
                      </code>
                      <button
                        onClick={copyAffiliateLink}
                        className="btn-outline p-2"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => shareOnSocial('twitter')}
                      className="btn-outline text-sm"
                    >
                      🐦 Twitter
                    </button>
                    <button
                      onClick={() => shareOnSocial('telegram')}
                      className="btn-outline text-sm"
                    >
                      📱 Telegram
                    </button>
                    <button
                      onClick={() => shareOnSocial('whatsapp')}
                      className="btn-outline text-sm"
                    >
                      💬 WhatsApp
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="card">
                  <h3 className="heading-4 mb-4">Atividade Recente</h3>
                  <div className="space-y-3">
                    {recentCommissions.slice(0, 4).map((commission) => (
                      <div key={commission.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-card">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            {getCommissionIcon(commission.type)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{getCommissionLabel(commission.type)}</p>
                            <p className="text-xs text-slate-200">{commission.referralUsername}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-success">+{formatCurrency(commission.amount)}</p>
                          <p className="text-xs text-slate-200">{formatDate(commission.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance Chart Placeholder */}
              <div className="card mt-8">
                <h3 className="heading-4 mb-4">Performance dos Últimos 30 Dias</h3>
                <div className="h-64 bg-slate-800 rounded-card flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-200">Gráfico de performance em desenvolvimento</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Referrals Tab */}
          {activeTab === 'referrals' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-3">Meus Referidos</h2>
                <p className="text-slate-200">
                  {affiliateStats.totalReferrals} referidos totais
                </p>
              </div>

              <div className="card">
                <div className="space-y-4">
                  {referrals.map((referral) => (
                    <div key={referral.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-card">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          referral.status === 'active' ? 'bg-success/20' : 'bg-textMuted/20'
                        }`}>
                          <Users className={`w-4 h-4 ${
                            referral.status === 'active' ? 'text-success' : 'text-slate-400'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{referral.username}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              referral.status === 'active'
                                ? 'bg-success/20 text-success'
                                : 'bg-textMuted/20 text-slate-400'
                            }`}>
                              {referral.status === 'active' ? 'Ativo' : 'Inativo'}
                            </span>
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                              {referral.tier}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-slate-200">
                            <span>Entrou em {formatDate(referral.joinDate)}</span>
                            <span>•</span>
                            <span>Última atividade: {formatDate(referral.lastActivity)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(referral.totalInvested)} investido</p>
                        <p className="text-sm text-success">+{formatCurrency(referral.commissionEarned)} comissão</p>
                      </div>
                    </div>
                  ))}
                </div>

                {referrals.length === 0 && (
                  <div className="text-center py-16">
                    <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="heading-4 mb-2">Nenhum referido ainda</h3>
                    <p className="text-slate-200">
                      Compartilhe seu link de afiliado para começar a ganhar comissões.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Commissions Tab */}
          {activeTab === 'commissions' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-3">Histórico de Comissões</h2>
                <div className="flex items-center space-x-2">
                  <button className="btn-outline text-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </button>
                  <button className="btn-outline text-sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Atualizar
                  </button>
                </div>
              </div>

              <div className="card">
                <div className="space-y-4">
                  {recentCommissions.map((commission) => (
                    <div key={commission.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-card">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          {getCommissionIcon(commission.type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{getCommissionLabel(commission.type)}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(commission.status)}`}>
                              {getStatusLabel(commission.status)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-200">{commission.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-slate-400 mt-1">
                            <span>Por: {commission.referralUsername}</span>
                            <span>•</span>
                            <span>{formatDate(commission.timestamp)}</span>
                            <span>•</span>
                            <span>{commission.rate}% comissão</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`font-medium ${
                          commission.status === 'paid' ? 'text-success' :
                          commission.status === 'pending' ? 'text-warning' : 'text-error'
                        }`}>
                          {commission.status === 'cancelled' ? '-' : '+'}
                          {formatCurrency(commission.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tools Tab */}
          {activeTab === 'tools' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-3">Ferramentas de Marketing</h2>
                <p className="text-slate-200">
                  Materiais para promover a plataforma
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Banners */}
                <div className="card">
                  <h3 className="heading-4 mb-4">Banners</h3>
                  <div className="space-y-3">
                    <div className="bg-slate-800 border border-slate-600Light rounded-card p-3">
                      <div className="bg-gradient-to-r from-primary to-accent h-20 rounded mb-2"></div>
                      <p className="text-sm font-medium">Banner 728x90</p>
                      <button className="btn-outline text-xs mt-2 w-full">
                        <Download className="w-3 h-3 mr-1" />
                        Baixar
                      </button>
                    </div>
                    <div className="bg-slate-800 border border-slate-600Light rounded-card p-3">
                      <div className="bg-gradient-to-r from-accent to-primary h-16 rounded mb-2"></div>
                      <p className="text-sm font-medium">Banner 300x250</p>
                      <button className="btn-outline text-xs mt-2 w-full">
                        <Download className="w-3 h-3 mr-1" />
                        Baixar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="card">
                  <h3 className="heading-4 mb-4">Redes Sociais</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => shareOnSocial('twitter')}
                      className="w-full p-3 bg-slate-800 border border-slate-600Light rounded-card hover:border-primary/50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">🐦</span>
                        <div className="text-left">
                          <p className="font-medium">Twitter</p>
                          <p className="text-xs text-slate-200">Compartilhar no Twitter</p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => shareOnSocial('telegram')}
                      className="w-full p-3 bg-slate-800 border border-slate-600Light rounded-card hover:border-primary/50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">📱</span>
                        <div className="text-left">
                          <p className="font-medium">Telegram</p>
                          <p className="text-xs text-slate-200">Compartilhar no Telegram</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Email Templates */}
                <div className="card">
                  <h3 className="heading-4 mb-4">Templates de Email</h3>
                  <div className="space-y-3">
                    <div className="bg-slate-800 border border-slate-600Light rounded-card p-3">
                      <p className="font-medium mb-2">Template Introdutório</p>
                      <p className="text-xs text-slate-200 mb-3">
                        Email para apresentar a plataforma
                      </p>
                      <button className="btn-outline text-xs w-full">
                        <Copy className="w-3 h-3 mr-1" />
                        Copiar Template
                      </button>
                    </div>
                    <div className="bg-slate-800 border border-slate-600Light rounded-card p-3">
                      <p className="font-medium mb-2">Template de Convite</p>
                      <p className="text-xs text-slate-200 mb-3">
                        Convite personalizado para amigos
                      </p>
                      <button className="btn-outline text-xs w-full">
                        <Copy className="w-3 h-3 mr-1" />
                        Copiar Template
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Affiliate Tiers */}
      <div className="container-custom pb-8" id="tiers">
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-3">Níveis de Afiliado</h2>
          <p className="text-slate-200">
            Quanto mais você indica, maiores são os benefícios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {affiliateTiers.map((tier, index) => (
            <div key={tier.name} className={`card ${
              selectedAccount && affiliateStats.tier === tier.name
                ? 'border-primary bg-primary/5'
                : ''
            }`}>
              <div className="text-center">
                <div className="text-4xl mb-3">{tier.icon}</div>
                <h3 className={`heading-4 mb-2 ${tier.color}`}>{tier.name}</h3>
                <p className="text-2xl font-bold text-primary mb-4">
                  {tier.commissionRate}%
                </p>

                <div className="space-y-2 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-200">Referidos:</span>
                    <span>{tier.requirements.referrals}+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-200">Volume:</span>
                    <span>{formatCurrency(tier.requirements.volume)}+</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-left">
                  {tier.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-success flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                {selectedAccount && affiliateStats.tier === tier.name && (
                  <div className="mt-4 p-2 bg-primary/20 text-primary rounded-card text-xs font-medium">
                    Nível Atual
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Affiliate Info */}
      <div className="container-custom pb-8">
        <div className="card bg-info/10 border-info/20">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-info mb-2">Como Funciona o Programa de Afiliados</h4>
              <ul className="text-sm text-slate-200 space-y-1">
                <li>• <strong>Ganhe Comissões:</strong> Receba de 5% a 20% sobre investimentos dos seus referidos</li>
                <li>• <strong>Múltiplas Fontes:</strong> Comissões em investimentos, staking, rifas e trading</li>
                <li>• <strong>Pagamentos Automáticos:</strong> Comissões pagas automaticamente em LUNES</li>
                <li>• <strong>Sem Limite:</strong> Não há limite para o número de referidos ou ganhos</li>
                <li>• <strong>Ferramentas Gratuitas:</strong> Materiais de marketing e suporte dedicado</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
