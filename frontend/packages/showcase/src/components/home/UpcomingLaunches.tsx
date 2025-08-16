import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { formatDate, formatTimeRemaining } from '@/lib/utils'

// Mock data
const upcomingLaunches = [
  {
    id: 'web3-social',
    name: 'Web3 Social',
    description: 'Rede social descentralizada com recompensas em tokens',
    logo: '🌐',
    launchDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    whitelistStart: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    targetRaise: 5000000,
    network: 'Lunes',
    tier: 'A',
  },
  {
    id: 'defi-insurance',
    name: 'DeFi Insurance',
    description: 'Protocolo de seguros descentralizado para DeFi',
    logo: '🛡️',
    launchDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000), // 22 days from now
    whitelistStart: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
    targetRaise: 3200000,
    network: 'Lunes',
    tier: 'S',
  },
  {
    id: 'nft-marketplace',
    name: 'NFT Marketplace',
    description: 'Marketplace de NFTs com royalties automáticos',
    logo: '🎨',
    launchDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days from now
    whitelistStart: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    targetRaise: 2800000,
    network: 'Lunes',
    tier: 'B',
  },
]

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

export function UpcomingLaunches() {
  return (
    <div className="space-y-4">
      {upcomingLaunches.map((project) => (
        <Link
          key={project.id}
          to={`/projetos/${project.id}`}
          className="card-hover group flex flex-col md:flex-row md:items-center md:justify-between p-6"
        >
          <div className="flex items-start space-x-4 mb-4 md:mb-0">
            {/* Logo */}
            <div className="text-3xl flex-shrink-0">{project.logo}</div>
            
            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-title font-semibold text-lg group-hover:text-primary transition-colors duration-200">
                  {project.name}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTierColor(project.tier)}`}>
                  Tier {project.tier}
                </span>
              </div>
              
              <p className="text-slate-200 text-sm mb-3 max-w-md">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Whitelist: {formatDate(project.whitelistStart)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Lançamento: {formatDate(project.launchDate)}</span>
                </div>
                <span>Meta: ${project.targetRaise.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col md:items-end space-y-2">
            <div className="flex items-center space-x-2 text-primary">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                {formatTimeRemaining(project.whitelistStart)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-slate-200 group-hover:text-primary transition-colors duration-200">
              <span className="text-sm">Ver detalhes</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
