import { Link } from 'react-router-dom'
import { 
  Calendar, 
  Users, 
  Target, 
  TrendingUp, 
  Clock,
  Star,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { formatCurrency, formatPercentage, formatTimeRemaining } from '@/lib/utils'

export interface Project {
  id: string
  name: string
  logo: string
  description: string
  category: string
  tier: 'S' | 'A' | 'B' | 'C'
  rating: number
  totalRaised: number
  targetAmount: number
  participants: number
  currentPhase: 'upcoming' | 'whitelist' | 'presale' | 'public' | 'launchpool' | 'completed'
  phaseEndDate: Date
  tokenSymbol: string
  tokenPrice: number
  discount?: number
  minInvestment: number
  maxInvestment: number
  vestingPeriod: string
  highlights: string[]
  tags: string[]
  socialLinks: {
    website?: string
    twitter?: string
    discord?: string
    telegram?: string
  }
  isVerified: boolean
  isHot: boolean
  launchDate: Date
}

interface ProjectCardProps {
  project: Project
  variant?: 'default' | 'featured' | 'compact'
  showActions?: boolean
}

export function ProjectCard({ project, variant = 'default', showActions = true }: ProjectCardProps) {
  const progressPercentage = (project.totalRaised / project.targetAmount) * 100
  
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'S': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
      case 'A': return 'bg-gradient-to-r from-primary to-primaryLight text-white'
      case 'B': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
      case 'C': return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
      default: return 'bg-textMuted text-white'
    }
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'upcoming': return 'bg-info/20 text-info border-info/30'
      case 'whitelist': return 'bg-primary/20 text-primary border-primary/30'
      case 'presale': return 'bg-warning/20 text-warning border-warning/30'
      case 'public': return 'bg-success/20 text-success border-success/30'
      case 'launchpool': return 'bg-accent/20 text-accent border-accent/30'
      case 'completed': return 'bg-textMuted/20 text-slate-400 border-textMuted/30'
      default: return 'bg-textMuted/20 text-slate-400 border-textMuted/30'
    }
  }

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case 'upcoming': return 'Em Breve'
      case 'whitelist': return 'Whitelist'
      case 'presale': return 'Pré-Venda'
      case 'public': return 'Venda Pública'
      case 'launchpool': return 'Launchpool'
      case 'completed': return 'Finalizado'
      default: return phase
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-slate-400'
        }`}
      />
    ))
  }

  if (variant === 'compact') {
    return (
      <Link to={`/projects/${project.id}`} className="block">
        <div className="card-hover p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{project.logo}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-medium truncate">{project.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTierColor(project.tier)}`}>
                  {project.tier}
                </span>
              </div>
              <p className="text-sm text-slate-200 truncate">{project.description}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{formatCurrency(project.totalRaised)}</p>
              <p className="text-xs text-slate-200">arrecadado</p>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className={`card-hover ${variant === 'featured' ? 'border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">{project.logo}</div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="heading-4">{project.name}</h3>
              {project.isVerified && (
                <CheckCircle className="w-4 h-4 text-success" title="Projeto Verificado" />
              )}
              {project.isHot && (
                <span className="bg-error text-white text-xs px-2 py-1 rounded-full animate-pulse">
                  🔥 HOT
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {renderStars(project.rating)}
                <span className="text-sm text-slate-200 ml-1">({project.rating})</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTierColor(project.tier)}`}>
                Tier {project.tier}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {project.socialLinks.website && (
            <a
              href={project.socialLinks.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-primary transition-colors duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-200 mb-4 line-clamp-2">{project.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs bg-slate-800 border border-slate-600Light rounded-full px-2 py-1">
          {project.category}
        </span>
        {project.tags.slice(0, 2).map((tag, index) => (
          <span key={index} className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-1">
            {tag}
          </span>
        ))}
      </div>

      {/* Current Phase */}
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getPhaseColor(project.currentPhase)}`}>
          {getPhaseLabel(project.currentPhase)}
        </span>
        {project.discount && (
          <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full font-medium">
            -{project.discount}% desconto
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Progresso</span>
          <span>{formatPercentage(progressPercentage)}</span>
        </div>
        <div className="w-full bg-borderLight rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-200 mt-1">
          <span>{formatCurrency(project.totalRaised)} arrecadado</span>
          <span>Meta: {formatCurrency(project.targetAmount)}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        <div>
          <p className="text-xs text-slate-400 mb-1">Participantes</p>
          <p className="font-medium">{project.participants.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Preço Token</p>
          <p className="font-medium">{formatCurrency(project.tokenPrice)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-1">Vesting</p>
          <p className="font-medium">{project.vestingPeriod}</p>
        </div>
      </div>

      {/* Time Remaining */}
      {project.currentPhase !== 'completed' && (
        <div className="flex items-center justify-center space-x-2 mb-4 p-3 bg-slate-800 border border-slate-600Light rounded-button">
          <Clock className="w-4 h-4 text-warning" />
          <span className="text-sm font-medium">
            {formatTimeRemaining(project.phaseEndDate)}
          </span>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex gap-3">
          <Link to={`/projects/${project.id}`} className="btn-primary flex-1">
            <Target className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Link>
          {project.currentPhase !== 'completed' && project.currentPhase !== 'upcoming' && (
            <Link to={`/projects/${project.id}#participate`} className="btn-outline">
              Participar
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
