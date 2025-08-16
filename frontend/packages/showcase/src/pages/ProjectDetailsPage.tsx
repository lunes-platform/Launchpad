import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  ExternalLink,
  Users,
  Calendar,
  TrendingUp,
  Shield,
  Star,
  CheckCircle,
  Clock,
  Target,
  DollarSign,
  Share2,
  Heart,
  Bookmark,
  MessageSquare
} from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import { type Project } from '@/components/projects/ProjectCard'
import { StatsCard, ProgressStatsCard } from '@/components/ui/StatsCard'
import { formatCurrency, formatTokenAmount, formatPercentage, formatTimeRemaining, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

// Mock project data - in real app this would come from API
const projectDetails: Project = {
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
  tags: ['DeFi', 'Yield Farming', 'DAO', 'AI'],
  socialLinks: {
    website: 'https://defiprotocol.io',
    twitter: 'https://twitter.com/defiprotocol',
    discord: 'https://discord.gg/defiprotocol',
    telegram: 'https://t.me/defiprotocol'
  },
  isVerified: true,
  isHot: true,
  launchDate: new Date('2024-02-15'),
  
  // Phases configuration
  phases: [
    {
      name: 'Whitelist',
      status: 'active',
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      discount: 45,
      allocation: 500000,
      minInvestment: 100,
      maxInvestment: 5000,
      vestingPeriod: 12,
      description: 'Exclusividade VIP com 45% de desconto para usuários pré-aprovados',
    },
    {
      name: 'Pré-Venda',
      status: 'upcoming',
      startDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      discount: 25,
      allocation: 800000,
      minInvestment: 50,
      maxInvestment: 2000,
      vestingPeriod: 6,
      description: 'Early Birds da comunidade com 25% de desconto',
    },
    {
      name: 'Venda Pública',
      status: 'upcoming',
      startDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      discount: 0,
      allocation: 700000,
      minInvestment: 25,
      maxInvestment: 1000,
      vestingPeriod: 3,
      description: 'Preço final sem desconto, aberto para todos',
    },
    {
      name: 'Launchpool',
      status: 'upcoming',
      startDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      discount: 0,
      allocation: 300000,
      minInvestment: 0,
      maxInvestment: 0,
      vestingPeriod: 0,
      description: 'Faça staking de LUNES e ganhe tokens do projeto',
    },
    {
      name: 'Rifa',
      status: 'upcoming',
      startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
      discount: 0,
      allocation: 100000,
      minInvestment: 1,
      maxInvestment: 100,
      vestingPeriod: 0,
      description: 'Sorteios diários garantidos com prêmios em tokens',
    },
  ],
  
  // Tokenomics
  tokenomics: {
    totalSupply: 100000000,
    distribution: [
      { label: 'Venda Pública', value: 35, color: '#9469FF' },
      { label: 'Equipe', value: 20, color: '#AD87FF' },
      { label: 'Desenvolvimento', value: 15, color: '#CAAFFF' },
      { label: 'Marketing', value: 10, color: '#10B981' },
      { label: 'Reserva', value: 10, color: '#F59E0B' },
      { label: 'Liquidez', value: 10, color: '#EF4444' },
    ],
  },
  
  // Team
  team: [
    {
      name: 'João Silva',
      role: 'CEO & Founder',
      avatar: '👨‍💼',
      linkedin: 'https://linkedin.com/in/joaosilva',
      twitter: 'https://twitter.com/joaosilva',
    },
    {
      name: 'Maria Santos',
      role: 'CTO',
      avatar: '👩‍💻',
      linkedin: 'https://linkedin.com/in/mariasantos',
      twitter: 'https://twitter.com/mariasantos',
    },
    {
      name: 'Pedro Costa',
      role: 'Head of Product',
      avatar: '👨‍🎨',
      linkedin: 'https://linkedin.com/in/pedrocosta',
      twitter: 'https://twitter.com/pedrocosta',
    },
  ],
  
  // AMA
  ama: {
    videoUrl: 'https://youtube.com/watch?v=example',
    transcript: 'Transcrição da sessão AMA...',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
}

export default function ProjectDetailsPage() {
  const { id } = useParams()
  const { isConnected } = useWallet()
  const [activeTab, setActiveTab] = useState('overview')
  const [project, setProject] = useState(projectDetails)

  useEffect(() => {
    // In real app, fetch project data based on id
    console.log('Loading project:', id)
  }, [id])

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
    { id: 'tokenomics', label: 'Tokenomics', icon: Users },
    { id: 'team', label: 'Equipe', icon: Users },
    { id: 'ama', label: 'AMA', icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Back Button */}
      <div className="container-custom pt-8">
        <Link
          to="/projetos"
          className="inline-flex items-center space-x-2 text-slate-200 hover:text-primary transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Projetos</span>
        </Link>
      </div>

      {/* Project Header */}
      <ProjectHeader project={project} />

      {/* Main Content */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Phase Timeline */}
            <PhaseTimeline phases={project.phases} currentPhase={project.currentPhase} />
            
            {/* Participation Section */}
            <ParticipationSection 
              project={project} 
              isConnected={isConnected}
            />
            
            {/* Tabs */}
            <div className="card">
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
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && <ProjectInfo project={project} />}
              {activeTab === 'tokenomics' && <TokenomicsChart tokenomics={project.tokenomics} />}
              {activeTab === 'team' && <TeamSection team={project.team} />}
              {activeTab === 'ama' && <AMASection ama={project.ama} />}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <ProjectStats project={project} />
          </div>
        </div>
      </div>
    </div>
  )
}
