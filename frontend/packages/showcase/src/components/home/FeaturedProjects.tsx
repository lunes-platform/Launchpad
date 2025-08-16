import { Link } from 'react-router-dom'
import { Clock, Users, TrendingUp, ExternalLink } from 'lucide-react'
import { formatTimeRemaining, formatNumber, formatPercentage } from '@/lib/utils'

// Mock data - in real app, this would come from API
const featuredProjects = [
  {
    id: 'defi-protocol-2024',
    name: 'DeFi Protocol',
    description: 'Protocolo DeFi inovador para yield farming cross-chain',
    logo: '🔷',
    currentPhase: 'Whitelist',
    phaseEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    totalRaised: 850000,
    targetRaise: 2000000,
    participants: 1247,
    discount: 45,
    network: 'Lunes',
    tags: ['DeFi', 'Yield Farming', 'Cross-Chain'],
    tier: 'S',
  },
  {
    id: 'gaming-metaverse',
    name: 'Gaming Metaverse',
    description: 'Plataforma de jogos NFT com economia sustentável',
    logo: '🎮',
    currentPhase: 'Pré-Venda',
    phaseEndDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    totalRaised: 1200000,
    targetRaise: 3500000,
    participants: 2156,
    discount: 25,
    network: 'Lunes',
    tags: ['Gaming', 'NFT', 'Metaverse'],
    tier: 'A',
  },
  {
    id: 'ai-blockchain',
    name: 'AI Blockchain',
    description: 'Infraestrutura de IA descentralizada para Web3',
    logo: '🤖',
    currentPhase: 'Launchpool',
    phaseEndDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
    totalRaised: 2100000,
    targetRaise: 2100000,
    participants: 3421,
    discount: 0,
    network: 'Lunes',
    tags: ['AI', 'Infrastructure', 'Web3'],
    tier: 'S',
  },
]

const getPhaseColor = (phase: string) => {
  switch (phase) {
    case 'Whitelist':
      return 'bg-primary/20 text-primary border-primary/30'
    case 'Pré-Venda':
      return 'bg-warning/20 text-warning border-warning/30'
    case 'Venda Pública':
      return 'bg-success/20 text-success border-success/30'
    case 'Launchpool':
      return 'bg-info/20 text-info border-info/30'
    case 'Rifa':
      return 'bg-accent/20 text-accent border-accent/30'
    default:
      return 'bg-textMuted/20 text-slate-400 border-textMuted/30'
  }
}

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'S':
      return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
    case 'A':
      return 'bg-gradient-to-r from-primary to-primaryLight text-white'
    case 'B':
      return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
    case 'C':
      return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
    default:
      return 'bg-textMuted text-white'
  }
}

export function FeaturedProjects() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredProjects.map((project) => {
        const progressPercentage = (project.totalRaised / project.targetRaise) * 100
        
        return (
          <Link
            key={project.id}
            to={`/projetos/${project.id}`}
            className="card-hover group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{project.logo}</div>
                <div>
                  <h3 className="font-title font-semibold text-lg group-hover:text-primary transition-colors duration-200">
                    {project.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTierColor(project.tier)}`}>
                      Tier {project.tier}
                    </span>
                    <span className="text-xs text-slate-400">
                      {project.network}
                    </span>
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors duration-200" />
            </div>

            {/* Description */}
            <p className="text-slate-200 text-sm mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Phase & Time */}
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getPhaseColor(project.currentPhase)}`}>
                {project.currentPhase}
              </span>
              <div className="flex items-center space-x-1 text-slate-200">
                <Clock className="w-3 h-3" />
                <span className="text-xs">
                  {formatTimeRemaining(project.phaseEndDate)}
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-200">Progresso</span>
                <span className="font-medium">
                  {formatPercentage(progressPercentage)}
                </span>
              </div>
              <div className="w-full bg-borderLight rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-primaryLight h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>${formatNumber(project.totalRaised)}</span>
                <span>${formatNumber(project.targetRaise)}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-1 text-slate-200">
                <Users className="w-3 h-3" />
                <span className="text-xs">
                  {formatNumber(project.participants)} participantes
                </span>
              </div>
              {project.discount > 0 && (
                <div className="flex items-center space-x-1 text-success">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-medium">
                    {project.discount}% desconto
                  </span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-slate-800 border border-slate-600Light rounded px-2 py-1 text-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
