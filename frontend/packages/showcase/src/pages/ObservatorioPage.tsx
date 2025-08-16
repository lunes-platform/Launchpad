import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  Users, 
  Target,
  Vote,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Award,
  BarChart3,
  ExternalLink,
  Eye,
  Calendar,
  Zap
} from 'lucide-react'
import { ProjectCard, type Project } from '@/components/projects/ProjectCard'
import { StatsCard, MetricCard } from '@/components/ui/StatsCard'
import { formatCurrency, formatPercentage, formatTimeRemaining, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

// Extended Project type for voting projects
interface VotingProject {
  id: string
  name: string
  logo: string
  description: string
  category: string
  tier: 'S' | 'A' | 'B' | 'C'
  submissionDate: Date
  votingEndDate: Date
  votesFor: number
  votesAgainst: number
  totalVotes: number
  quorum: number
  status: 'pending' | 'voting' | 'approved' | 'rejected'
  proposer: string
  highlights: string[]
  socialLinks: {
    website?: string
    twitter?: string
    discord?: string
  }
}

// Extended Project type for completed projects
interface CompletedProject extends Project {
  completionDate: Date
  initialPrice: number
  currentPrice: number
  roi: number
  exchangeListings: Array<{
    exchange: string
    url: string
    volume24h: number
  }>
  tokenDistributionStatus: 'completed' | 'in-progress' | 'pending'
  marketCap: number
  holders: number
}

// Mock data for active projects
const activeProjects: Project[] = [
  {
    id: 'defi-protocol',
    name: 'DeFi Protocol',
    logo: '🔷',
    description: 'Protocolo DeFi inovador com yield farming automatizado e estratégias de investimento inteligentes.',
    category: 'DeFi',
    tier: 'S',
    rating: 4.8,
    totalRaised: 2500000,
    targetAmount: 5000000,
    participants: 3420,
    currentPhase: 'presale',
    phaseEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    tokenSymbol: 'DFP',
    tokenPrice: 0.08,
    discount: 25,
    minInvestment: 100,
    maxInvestment: 10000,
    vestingPeriod: '6 meses',
    highlights: ['Auditado pela CertiK', 'Equipe doxxed', 'Parcerias estratégicas'],
    tags: ['DeFi', 'Yield Farming', 'DAO'],
    socialLinks: {
      website: 'https://defiprotocol.io',
      twitter: 'https://twitter.com/defiprotocol'
    },
    isVerified: true,
    isHot: true,
    launchDate: new Date('2024-02-15')
  },
  {
    id: 'gaming-metaverse',
    name: 'Gaming Metaverse',
    logo: '🎮',
    description: 'Plataforma de jogos Web3 com NFTs, metaverso imersivo e economia play-to-earn sustentável.',
    category: 'Gaming',
    tier: 'A',
    rating: 4.6,
    totalRaised: 1800000,
    targetAmount: 3000000,
    participants: 2150,
    currentPhase: 'whitelist',
    phaseEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    tokenSymbol: 'GMV',
    tokenPrice: 0.35,
    discount: 50,
    minInvestment: 250,
    maxInvestment: 5000,
    vestingPeriod: '4 meses',
    highlights: ['Alpha testnet live', 'Parcerias com grandes guilds', 'Roadmap detalhado'],
    tags: ['Gaming', 'NFT', 'Metaverse'],
    socialLinks: {
      website: 'https://gamingmv.com',
      twitter: 'https://twitter.com/gamingmv'
    },
    isVerified: true,
    isHot: false,
    launchDate: new Date('2024-02-20')
  },
  {
    id: 'ai-blockchain',
    name: 'AI Blockchain',
    logo: '🤖',
    description: 'Infraestrutura blockchain otimizada por IA para contratos inteligentes mais eficientes.',
    category: 'Infrastructure',
    tier: 'S',
    rating: 4.9,
    totalRaised: 4200000,
    targetAmount: 6000000,
    participants: 5680,
    currentPhase: 'public',
    phaseEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    tokenSymbol: 'AIB',
    tokenPrice: 0.12,
    minInvestment: 50,
    maxInvestment: 15000,
    vestingPeriod: '8 meses',
    highlights: ['Tecnologia patenteada', 'Equipe MIT/Stanford', 'Investidores tier 1'],
    tags: ['AI', 'Infrastructure', 'Innovation'],
    socialLinks: {
      website: 'https://aiblockchain.tech',
      twitter: 'https://twitter.com/aiblockchain'
    },
    isVerified: true,
    isHot: true,
    launchDate: new Date('2024-02-10')
  },
  {
    id: 'defi-insurance',
    name: 'DeFi Insurance',
    logo: '🛡️',
    description: 'Protocolo de seguros descentralizado para proteger investimentos DeFi contra riscos.',
    category: 'DeFi',
    tier: 'A',
    rating: 4.5,
    totalRaised: 1200000,
    targetAmount: 2500000,
    participants: 890,
    currentPhase: 'launchpool',
    phaseEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    tokenSymbol: 'DFI',
    tokenPrice: 0.15,
    minInvestment: 200,
    maxInvestment: 8000,
    vestingPeriod: '5 meses',
    highlights: ['Auditado pela Quantstamp', 'Parcerias com protocolos DeFi', 'MVP funcional'],
    tags: ['DeFi', 'Insurance', 'Security'],
    socialLinks: {
      website: 'https://defiinsurance.io',
      twitter: 'https://twitter.com/defiinsurance'
    },
    isVerified: true,
    isHot: false,
    launchDate: new Date('2024-02-25')
  }
]

// Mock data for voting projects
const votingProjects: VotingProject[] = [
  {
    id: 'web3-social-voting',
    name: 'Web3 Social Network',
    logo: '🌐',
    description: 'Rede social descentralizada com monetização de conteúdo e governança comunitária.',
    category: 'Social',
    tier: 'B',
    submissionDate: new Date('2024-01-20'),
    votingEndDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    votesFor: 1250000,
    votesAgainst: 350000,
    totalVotes: 1600000,
    quorum: 2000000,
    status: 'voting',
    proposer: 'Web3 Social Team',
    highlights: ['Beta funcional', 'Comunidade ativa de 50k+', 'Parcerias com influencers'],
    socialLinks: {
      website: 'https://web3social.app',
      twitter: 'https://twitter.com/web3social'
    }
  },
  {
    id: 'nft-marketplace-voting',
    name: 'NFT Marketplace Pro',
    logo: '🎨',
    description: 'Marketplace de NFTs com foco em arte digital e colecionáveis com baixas taxas.',
    category: 'NFT',
    tier: 'A',
    submissionDate: new Date('2024-01-25'),
    votingEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    votesFor: 2100000,
    votesAgainst: 450000,
    totalVotes: 2550000,
    quorum: 2000000,
    status: 'voting',
    proposer: 'NFT Pro Team',
    highlights: ['Marketplace ativo', 'Artistas verificados', 'Tecnologia inovadora'],
    socialLinks: {
      website: 'https://nftmarketplacepro.art',
      twitter: 'https://twitter.com/nftmarketplacepro'
    }
  },
  {
    id: 'defi-lending-pending',
    name: 'DeFi Lending Protocol',
    logo: '🏦',
    description: 'Protocolo de empréstimos descentralizado com garantias inteligentes.',
    category: 'DeFi',
    tier: 'S',
    submissionDate: new Date('2024-02-01'),
    votingEndDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    votesFor: 0,
    votesAgainst: 0,
    totalVotes: 0,
    quorum: 2500000,
    status: 'pending',
    proposer: 'DeFi Lending Labs',
    highlights: ['Auditoria em andamento', 'Equipe experiente', 'MVP em testnet'],
    socialLinks: {
      website: 'https://defilending.io',
      twitter: 'https://twitter.com/defilending'
    }
  }
]

// Mock data for completed projects
const completedProjects: CompletedProject[] = [
  {
    id: 'crypto-exchange',
    name: 'Crypto Exchange',
    logo: '💱',
    description: 'Exchange descentralizada com AMM e farming de liquidez.',
    category: 'DeFi',
    tier: 'S',
    rating: 4.7,
    totalRaised: 5000000,
    targetAmount: 5000000,
    participants: 8420,
    currentPhase: 'completed',
    phaseEndDate: new Date('2024-01-15'),
    tokenSymbol: 'CEX',
    tokenPrice: 0.25,
    minInvestment: 100,
    maxInvestment: 10000,
    vestingPeriod: '6 meses',
    highlights: ['Lançado com sucesso', 'Volume alto', 'Comunidade ativa'],
    tags: ['DeFi', 'Exchange', 'AMM'],
    socialLinks: {
      website: 'https://cryptoexchange.io',
      twitter: 'https://twitter.com/cryptoexchange'
    },
    isVerified: true,
    isHot: false,
    launchDate: new Date('2023-12-01'),
    completionDate: new Date('2024-01-15'),
    initialPrice: 0.25,
    currentPrice: 0.89,
    roi: 256,
    exchangeListings: [
      { exchange: 'Uniswap', url: 'https://uniswap.org', volume24h: 2500000 },
      { exchange: 'PancakeSwap', url: 'https://pancakeswap.finance', volume24h: 1800000 },
      { exchange: 'SushiSwap', url: 'https://sushi.com', volume24h: 950000 }
    ],
    tokenDistributionStatus: 'completed',
    marketCap: 89000000,
    holders: 15420
  },
  {
    id: 'play-to-earn-game',
    name: 'Play to Earn Game',
    logo: '🎯',
    description: 'Jogo play-to-earn com economia sustentável e NFTs únicos.',
    category: 'Gaming',
    tier: 'A',
    rating: 4.4,
    totalRaised: 3000000,
    targetAmount: 3000000,
    participants: 5680,
    currentPhase: 'completed',
    phaseEndDate: new Date('2024-01-10'),
    tokenSymbol: 'P2E',
    tokenPrice: 0.15,
    minInvestment: 50,
    maxInvestment: 5000,
    vestingPeriod: '4 meses',
    highlights: ['Jogo lançado', 'Economia ativa', 'Torneios regulares'],
    tags: ['Gaming', 'P2E', 'NFT'],
    socialLinks: {
      website: 'https://p2egame.io',
      twitter: 'https://twitter.com/p2egame'
    },
    isVerified: true,
    isHot: false,
    launchDate: new Date('2023-11-15'),
    completionDate: new Date('2024-01-10'),
    initialPrice: 0.15,
    currentPrice: 0.32,
    roi: 113,
    exchangeListings: [
      { exchange: 'Uniswap', url: 'https://uniswap.org', volume24h: 850000 },
      { exchange: 'Gate.io', url: 'https://gate.io', volume24h: 620000 }
    ],
    tokenDistributionStatus: 'completed',
    marketCap: 32000000,
    holders: 8950
  },
  {
    id: 'dao-governance',
    name: 'DAO Governance',
    logo: '🏛️',
    description: 'Plataforma de governança descentralizada para DAOs.',
    category: 'Infrastructure',
    tier: 'B',
    rating: 4.2,
    totalRaised: 1500000,
    targetAmount: 2000000,
    participants: 2340,
    currentPhase: 'completed',
    phaseEndDate: new Date('2023-12-20'),
    tokenSymbol: 'DAO',
    tokenPrice: 0.08,
    minInvestment: 100,
    maxInvestment: 3000,
    vestingPeriod: '3 meses',
    highlights: ['Plataforma ativa', 'Múltiplas DAOs', 'Governança eficiente'],
    tags: ['DAO', 'Governance', 'Infrastructure'],
    socialLinks: {
      website: 'https://daogovernance.io',
      twitter: 'https://twitter.com/daogovernance'
    },
    isVerified: true,
    isHot: false,
    launchDate: new Date('2023-10-01'),
    completionDate: new Date('2023-12-20'),
    initialPrice: 0.08,
    currentPrice: 0.06,
    roi: -25,
    exchangeListings: [
      { exchange: 'Uniswap', url: 'https://uniswap.org', volume24h: 120000 }
    ],
    tokenDistributionStatus: 'in-progress',
    marketCap: 6000000,
    holders: 3420
  }
]

export default function ObservatorioPage() {
  const [activeSection, setActiveSection] = useState('active')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPhase, setSelectedPhase] = useState('all')
  const [votingProject, setVotingProject] = useState<string | null>(null)

  // Calculate statistics
  const totalActiveProjects = activeProjects.length
  const totalVotingProjects = votingProjects.length
  const totalCompletedProjects = completedProjects.length
  const totalRaisedActive = activeProjects.reduce((sum, p) => sum + p.totalRaised, 0)
  const totalParticipants = activeProjects.reduce((sum, p) => sum + p.participants, 0)
  const averageROI = completedProjects.reduce((sum, p) => sum + p.roi, 0) / completedProjects.length

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'DeFi', label: 'DeFi' },
    { id: 'Gaming', label: 'Gaming' },
    { id: 'Infrastructure', label: 'Infraestrutura' },
    { id: 'NFT', label: 'NFT' },
    { id: 'Social', label: 'Social' }
  ]

  const phases = [
    { id: 'all', label: 'Todas as Fases' },
    { id: 'whitelist', label: 'Whitelist' },
    { id: 'presale', label: 'Pré-Venda' },
    { id: 'public', label: 'Venda Pública' },
    { id: 'launchpool', label: 'Launchpool' }
  ]

  const handleVote = async (projectId: string, vote: 'for' | 'against') => {
    setVotingProject(projectId)
    
    try {
      // Mock voting process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success(`Voto ${vote === 'for' ? 'a favor' : 'contra'} registrado com sucesso!`)
    } catch (error) {
      toast.error('Erro ao registrar voto')
    } finally {
      setVotingProject(null)
    }
  }

  // Filter functions
  const filterActiveProjects = () => {
    return activeProjects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
      const matchesPhase = selectedPhase === 'all' || project.currentPhase === selectedPhase
      
      return matchesSearch && matchesCategory && matchesPhase
    })
  }

  const filterVotingProjects = () => {
    return votingProjects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }

  const filterCompletedProjects = () => {
    return completedProjects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'S': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
      case 'A': return 'bg-gradient-to-r from-primary to-primaryLight text-white'
      case 'B': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
      case 'C': return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
      default: return 'bg-textMuted text-white'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'voting': return 'bg-primary/20 text-primary border-primary/30'
      case 'approved': return 'bg-success/20 text-success border-success/30'
      case 'rejected': return 'bg-error/20 text-error border-error/30'
      case 'pending': return 'bg-warning/20 text-warning border-warning/30'
      default: return 'bg-textMuted/20 text-slate-400 border-textMuted/30'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'voting': return 'Em Votação'
      case 'approved': return 'Aprovado'
      case 'rejected': return 'Rejeitado'
      case 'pending': return 'Pendente'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <section className="bg-slate-800/50 border-b border-slate-600Light">
        <div className="container-custom py-12">
          <div className="text-center mb-8">
            <h1 className="heading-2 mb-4">
              <Eye className="w-8 h-8 inline-block mr-3 text-primary" />
              Observatório de <span className="text-gradient">Projetos</span>
            </h1>
            <p className="text-slate-200 text-lg max-w-2xl mx-auto">
              Acompanhe todos os projetos da plataforma: desde os em andamento até os já finalizados,
              incluindo aqueles em processo de votação pela comunidade.
            </p>
          </div>

          {/* Platform Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              label="Projetos Ativos"
              value={totalActiveProjects}
              change={{ value: 12, period: 'este mês' }}
              icon={Target}
              color="primary"
            />
            <MetricCard
              label="Em Votação"
              value={totalVotingProjects}
              change={{ value: 8, period: 'esta semana' }}
              icon={Vote}
              color="info"
            />
            <MetricCard
              label="Finalizados"
              value={totalCompletedProjects}
              change={{ value: 15, period: 'últimos 3 meses' }}
              icon={CheckCircle}
              color="success"
            />
            <MetricCard
              label="ROI Médio"
              value={`${averageROI.toFixed(1)}%`}
              change={{ value: 23, period: 'projetos concluídos' }}
              icon={TrendingUp}
              color="warning"
            />
          </div>
        </div>
      </section>

      <div className="container-custom py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSection('active')}
              className={`px-6 py-3 rounded-button font-medium transition-colors duration-200 ${
                activeSection === 'active'
                  ? 'bg-primary text-white'
                  : 'bg-slate-800 hover:bg-slate-800Hover text-slate-200 border border-slate-600Light'
              }`}
            >
              <Target className="w-4 h-4 mr-2 inline-block" />
              Projetos em Andamento ({totalActiveProjects})
            </button>
            <button
              onClick={() => setActiveSection('voting')}
              className={`px-6 py-3 rounded-button font-medium transition-colors duration-200 ${
                activeSection === 'voting'
                  ? 'bg-primary text-white'
                  : 'bg-slate-800 hover:bg-slate-800Hover text-slate-200 border border-slate-600Light'
              }`}
            >
              <Vote className="w-4 h-4 mr-2 inline-block" />
              Em Votação/Listagem ({totalVotingProjects})
            </button>
            <button
              onClick={() => setActiveSection('completed')}
              className={`px-6 py-3 rounded-button font-medium transition-colors duration-200 ${
                activeSection === 'completed'
                  ? 'bg-primary text-white'
                  : 'bg-slate-800 hover:bg-slate-800Hover text-slate-200 border border-slate-600Light'
              }`}
            >
              <CheckCircle className="w-4 h-4 mr-2 inline-block" />
              Projetos Finalizados ({totalCompletedProjects})
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar projetos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-12 w-full"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Phase Filter (only for active projects) */}
            {activeSection === 'active' && (
              <select
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value)}
                className="input"
              >
                {phases.map((phase) => (
                  <option key={phase.id} value={phase.id}>
                    {phase.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Content Sections */}
        {activeSection === 'active' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3">Projetos em Andamento</h2>
              <p className="text-slate-200">
                {filterActiveProjects().length} projetos encontrados
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterActiveProjects().map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {filterActiveProjects().length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-textMuted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="heading-4 mb-2">Nenhum projeto encontrado</h3>
                <p className="text-slate-200">
                  Tente ajustar os filtros para encontrar projetos.
                </p>
              </div>
            )}
          </div>
        )}

        {activeSection === 'voting' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3">Projetos em Votação/Listagem</h2>
              <p className="text-slate-200">
                {filterVotingProjects().length} projetos encontrados
              </p>
            </div>

            <div className="space-y-6">
              {filterVotingProjects().map((project) => {
                const approvalRate = project.totalVotes > 0 ? (project.votesFor / project.totalVotes) * 100 : 0
                const quorumProgress = (project.totalVotes / project.quorum) * 100

                return (
                  <div key={project.id} className="card">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="text-4xl">{project.logo}</div>
                            <div>
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="heading-4">{project.name}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTierColor(project.tier)}`}>
                                  Tier {project.tier}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(project.status)}`}>
                                  {getStatusLabel(project.status)}
                                </span>
                              </div>

                              <div className="flex items-center space-x-4 text-sm text-slate-200 mb-3">
                                <span>Categoria: {project.category}</span>
                                <span>•</span>
                                <span>Proposto por: {project.proposer}</span>
                                <span>•</span>
                                <span>
                                  {project.status === 'voting'
                                    ? `Termina em ${formatTimeRemaining(project.votingEndDate)}`
                                    : `Submetido em ${formatDate(project.submissionDate)}`
                                  }
                                </span>
                              </div>

                              <p className="text-slate-200 mb-4">{project.description}</p>

                              <div className="flex flex-wrap gap-2">
                                {project.highlights.map((highlight, index) => (
                                  <span
                                    key={index}
                                    className="text-xs bg-info/10 text-info border border-info/20 rounded-full px-2 py-1"
                                  >
                                    ✓ {highlight}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Voting Progress */}
                        {project.status === 'voting' && (
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Aprovação: {formatPercentage(approvalRate)}</span>
                                <span>{project.totalVotes.toLocaleString()} / {project.quorum.toLocaleString()} votos</span>
                              </div>
                              <div className="w-full bg-borderLight rounded-full h-3">
                                <div
                                  className="bg-gradient-to-r from-success to-primary h-3 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(approvalRate, 100)}%` }}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Quórum: {formatPercentage(quorumProgress)}</span>
                                <span className={quorumProgress >= 100 ? 'text-success' : 'text-warning'}>
                                  {quorumProgress >= 100 ? 'Atingido' : 'Pendente'}
                                </span>
                              </div>
                              <div className="w-full bg-borderLight rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    quorumProgress >= 100 ? 'bg-success' : 'bg-warning'
                                  }`}
                                  style={{ width: `${Math.min(quorumProgress, 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Voting Section */}
                      <div className="lg:w-80">
                        <div className="bg-slate-800 border border-slate-600Light rounded-card p-6">
                          {project.status === 'voting' ? (
                            <>
                              <h4 className="font-medium mb-4">Votar nesta Proposta</h4>

                              <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="text-center p-3 bg-success/10 border border-success/20 rounded-button">
                                  <p className="text-xl font-bold text-success">
                                    {project.votesFor.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-slate-200">A Favor</p>
                                </div>

                                <div className="text-center p-3 bg-error/10 border border-error/20 rounded-button">
                                  <p className="text-xl font-bold text-error">
                                    {project.votesAgainst.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-slate-200">Contra</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <button
                                  onClick={() => handleVote(project.id, 'for')}
                                  disabled={votingProject === project.id}
                                  className="btn-success disabled:opacity-50"
                                >
                                  {votingProject === project.id ? 'Votando...' : 'A Favor'}
                                </button>

                                <button
                                  onClick={() => handleVote(project.id, 'against')}
                                  disabled={votingProject === project.id}
                                  className="btn-error disabled:opacity-50"
                                >
                                  {votingProject === project.id ? 'Votando...' : 'Contra'}
                                </button>
                              </div>
                            </>
                          ) : project.status === 'pending' ? (
                            <div className="text-center">
                              <Clock className="w-12 h-12 text-warning mx-auto mb-4" />
                              <h4 className="font-medium mb-2">Aguardando Votação</h4>
                              <p className="text-sm text-slate-200">
                                Este projeto está aguardando o início do período de votação.
                              </p>
                            </div>
                          ) : project.status === 'approved' ? (
                            <div className="text-center">
                              <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                              <h4 className="font-medium mb-2">Projeto Aprovado</h4>
                              <p className="text-sm text-slate-200">
                                Este projeto foi aprovado pela comunidade e será lançado em breve.
                              </p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <XCircle className="w-12 h-12 text-error mx-auto mb-4" />
                              <h4 className="font-medium mb-2">Projeto Rejeitado</h4>
                              <p className="text-sm text-slate-200">
                                Este projeto não atingiu os critérios necessários para aprovação.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {filterVotingProjects().length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-textMuted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Vote className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="heading-4 mb-2">Nenhum projeto em votação</h3>
                <p className="text-slate-200">
                  Não há projetos aguardando votação no momento.
                </p>
              </div>
            )}
          </div>
        )}

        {activeSection === 'completed' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-3">Projetos Finalizados</h2>
              <p className="text-slate-200">
                {filterCompletedProjects().length} projetos encontrados
              </p>
            </div>

            <div className="space-y-6">
              {filterCompletedProjects().map((project) => (
                <div key={project.id} className="card">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="text-4xl">{project.logo}</div>
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="heading-4">{project.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTierColor(project.tier)}`}>
                              Tier {project.tier}
                            </span>
                            <span className="bg-success/20 text-success text-xs px-2 py-1 rounded-full font-medium">
                              FINALIZADO
                            </span>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-slate-200 mb-3">
                            <span>Categoria: {project.category}</span>
                            <span>•</span>
                            <span>Finalizado em {formatDate(project.completionDate)}</span>
                            <span>•</span>
                            <span>{project.participants.toLocaleString()} participantes</span>
                          </div>

                          <p className="text-slate-200 mb-4">{project.description}</p>

                          <div className="flex flex-wrap gap-2">
                            {project.highlights.map((highlight, index) => (
                              <span
                                key={index}
                                className="text-xs bg-success/10 text-success border border-success/20 rounded-full px-2 py-1"
                              >
                                ✓ {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Section */}
                    <div className="lg:w-96">
                      <div className="bg-slate-800 border border-slate-600Light rounded-card p-6">
                        <h4 className="font-medium mb-4">Performance Pós-Lançamento</h4>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="text-center p-3 bg-info/10 border border-info/20 rounded-button">
                            <p className="text-sm text-slate-200 mb-1">Preço Inicial</p>
                            <p className="font-bold">{formatCurrency(project.initialPrice)}</p>
                          </div>

                          <div className="text-center p-3 bg-primary/10 border border-primary/20 rounded-button">
                            <p className="text-sm text-slate-200 mb-1">Preço Atual</p>
                            <p className="font-bold">{formatCurrency(project.currentPrice)}</p>
                          </div>

                          <div className="text-center p-3 bg-warning/10 border border-warning/20 rounded-button">
                            <p className="text-sm text-slate-200 mb-1">Market Cap</p>
                            <p className="font-bold">{formatCurrency(project.marketCap)}</p>
                          </div>

                          <div className={`text-center p-3 rounded-button border ${
                            project.roi >= 0
                              ? 'bg-success/10 border-success/20'
                              : 'bg-error/10 border-error/20'
                          }`}>
                            <p className="text-sm text-slate-200 mb-1">ROI</p>
                            <p className={`font-bold ${project.roi >= 0 ? 'text-success' : 'text-error'}`}>
                              {project.roi >= 0 ? '+' : ''}{project.roi}%
                            </p>
                          </div>
                        </div>

                        {/* Token Distribution Status */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Distribuição de Tokens</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              project.tokenDistributionStatus === 'completed'
                                ? 'bg-success/20 text-success'
                                : project.tokenDistributionStatus === 'in-progress'
                                ? 'bg-warning/20 text-warning'
                                : 'bg-info/20 text-info'
                            }`}>
                              {project.tokenDistributionStatus === 'completed' ? 'Completa' :
                               project.tokenDistributionStatus === 'in-progress' ? 'Em Andamento' : 'Pendente'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-200">
                            {project.holders.toLocaleString()} holders ativos
                          </p>
                        </div>

                        {/* Exchange Listings */}
                        <div>
                          <h5 className="font-medium mb-3">Listado em:</h5>
                          <div className="space-y-2">
                            {project.exchangeListings.map((listing, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-slate-900 rounded-button">
                                <a
                                  href={listing.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-2 text-primary hover:text-primaryLight transition-colors duration-200"
                                >
                                  <span className="font-medium">{listing.exchange}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                                <span className="text-xs text-slate-200">
                                  Vol: {formatCurrency(listing.volume24h)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filterCompletedProjects().length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-textMuted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="heading-4 mb-2">Nenhum projeto finalizado</h3>
                <p className="text-slate-200">
                  Não há projetos finalizados que correspondam aos filtros.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-16">
          <div className="card bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="heading-4 mb-2">Quer participar de novos projetos?</h3>
                <p className="text-slate-200">
                  Explore oportunidades ativas ou participe da governança votando em novos projetos.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/projects" className="btn-primary">
                  <Target className="w-4 h-4 mr-2" />
                  Ver Projetos Ativos
                </Link>
                <Link to="/governance" className="btn-outline">
                  <Vote className="w-4 h-4 mr-2" />
                  Participar da Governança
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
