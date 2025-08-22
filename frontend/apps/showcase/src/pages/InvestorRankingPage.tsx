import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  TrendingUp,
  Users,
  DollarSign,
  Star,
  Medal,
  Crown,
  Shield,
  Eye,
  EyeOff,
  Filter,
  Search,
  Calendar,
  Target,
  Award,
  Zap,
  Flame,
  Diamond,
  ArrowUpRight,
  ArrowDownRight,
  PieChart
} from 'lucide-react';
import { formatUtils } from '../lib/utils';

// Tipos de investidor
const INVESTOR_TYPES = {
  vip: { label: 'VIP', color: 'text-dourado-400 bg-dourado-500/10' },
  verified: { label: 'Verificado', color: 'text-roxo-400 bg-roxo-500/10' },
  premium: { label: 'Premium', color: 'text-roxo-400 bg-roxo-500/10' },
  standard: { label: 'Padrão', color: 'text-grafite-400 bg-grafite-500/10' }
} as const;

// Tiers de ranking
const RANKING_TIERS = {
  diamond: { label: 'Diamond', icon: Diamond, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', minScore: 10000 },
  platinum: { label: 'Platinum', icon: Crown, color: 'text-gray-300', bgColor: 'bg-gray-500/10', minScore: 5000 },
  gold: { label: 'Gold', icon: Trophy, color: 'text-dourado-400', bgColor: 'bg-dourado-500/10', minScore: 2500 },
  silver: { label: 'Silver', icon: Medal, color: 'text-gray-400', bgColor: 'bg-gray-500/10', minScore: 1000 },
  bronze: { label: 'Bronze', icon: Award, color: 'text-orange-400', bgColor: 'bg-orange-500/10', minScore: 0 }
} as const;

// Badges de conquistas
const ACHIEVEMENT_BADGES = {
  early_adopter: { label: 'Early Adopter', icon: Zap, color: 'text-yellow-400' },
  whale: { label: 'Whale', icon: Crown, color: 'text-roxo-400' },
  diamond_hands: { label: 'Diamond Hands', icon: Diamond, color: 'text-cyan-400' },
  active_trader: { label: 'Active Trader', icon: TrendingUp, color: 'text-green-400' },
  community_leader: { label: 'Community Leader', icon: Users, color: 'text-purple-400' },
  fire_investor: { label: 'Fire Investor', icon: Flame, color: 'text-red-400' }
} as const;

// Interface do investidor
interface Investor {
  id: string;
  rank: number;
  address: string;
  type: keyof typeof INVESTOR_TYPES;
  totalInvested: number;
  projectsParticipated: number;
  participationScore: number;
  roi: number;
  lastActivity: string;
  joinDate: string;
  achievements: (keyof typeof ACHIEVEMENT_BADGES)[];
  isVerified: boolean;
  isPrivate: boolean;
}

// Dados mockados
const MOCK_INVESTORS: Investor[] = [
  {
    id: '1',
    rank: 1,
    address: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
    type: 'vip',
    totalInvested: 2500000,
    projectsParticipated: 45,
    participationScore: 12500,
    roi: 285.5,
    lastActivity: '2024-01-15T14:30:00Z',
    joinDate: '2023-01-15T00:00:00Z',
    achievements: ['whale', 'diamond_hands', 'early_adopter'],
    isVerified: true,
    isPrivate: false
  },
  {
    id: '2',
    rank: 2,
    address: '0x8ba1f109551bD432803012645Hac189451b957',
    type: 'premium',
    totalInvested: 1800000,
    projectsParticipated: 32,
    participationScore: 8900,
    roi: 198.2,
    lastActivity: '2024-01-14T09:15:00Z',
    joinDate: '2023-02-20T00:00:00Z',
    achievements: ['active_trader', 'community_leader'],
    isVerified: true,
    isPrivate: false
  },
  {
    id: '3',
    rank: 3,
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    type: 'verified',
    totalInvested: 950000,
    projectsParticipated: 28,
    participationScore: 5200,
    roi: 156.8,
    lastActivity: '2024-01-13T16:45:00Z',
    joinDate: '2023-03-10T00:00:00Z',
    achievements: ['fire_investor'],
    isVerified: true,
    isPrivate: true
  },
  {
    id: '4',
    rank: 4,
    address: '0xA0b86a33E6441e8e475c7c1f4b1d1025c8e2f1c1',
    type: 'standard',
    totalInvested: 420000,
    projectsParticipated: 15,
    participationScore: 2100,
    roi: 89.3,
    lastActivity: '2024-01-12T11:20:00Z',
    joinDate: '2023-06-05T00:00:00Z',
    achievements: ['early_adopter'],
    isVerified: false,
    isPrivate: false
  },
  {
    id: '5',
    rank: 5,
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    type: 'verified',
    totalInvested: 380000,
    projectsParticipated: 18,
    participationScore: 1850,
    roi: 67.4,
    lastActivity: '2024-01-11T11:30:00Z',
    joinDate: '2023-05-15T00:00:00Z',
    achievements: ['active_trader'],
    isVerified: false,
    isPrivate: true
  }
];

export default function InvestorRankingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'rank' | 'invested' | 'roi'>('rank');
  const [showPrivateAddresses, setShowPrivateAddresses] = useState(false);

  // Função para mascarar endereços
  const maskAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Função para obter o tier do investidor
  const getInvestorTier = (score: number) => {
    const tiers = Object.entries(RANKING_TIERS).sort((a, b) => b[1].minScore - a[1].minScore);
    return tiers.find(([, tier]) => score >= tier.minScore)?.[1] || RANKING_TIERS.bronze;
  };

  // Filtrar e ordenar investidores
  const filteredInvestors = useMemo(() => {
    let filtered = MOCK_INVESTORS.filter(investor => {
      const matchesSearch = investor.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           investor.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTier = tierFilter === 'all' || 
                         getInvestorTier(investor.participationScore).label.toLowerCase() === tierFilter;
      
      return matchesSearch && matchesTier;
    });

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'invested':
          return b.totalInvested - a.totalInvested;
        case 'roi':
          return b.roi - a.roi;
        default:
          return a.rank - b.rank;
      }
    });

    return filtered;
  }, [searchTerm, tierFilter, sortBy]);

  // Estatísticas gerais
  const totalInvestors = MOCK_INVESTORS.length;
  const totalInvested = MOCK_INVESTORS.reduce((sum, inv) => sum + inv.totalInvested, 0);
  const averageROI = MOCK_INVESTORS.reduce((sum, inv) => sum + inv.roi, 0) / totalInvestors;
  const activeInvestors = MOCK_INVESTORS.filter(inv => {
    const lastActivity = new Date(inv.lastActivity);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastActivity > thirtyDaysAgo;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-preto-900 via-preto-800 to-grafite-900">
      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-dourado-500 to-dourado-600 rounded-xl">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Ranking de Investidores</h1>
              <p className="text-grafite-300">Classificação baseada em métricas de engajamento e performance</p>
            </div>
          </div>
        </motion.div>

        {/* Estatísticas Gerais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-grafite-800/50 to-grafite-900/50 backdrop-blur-sm border border-grafite-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-azul-500/20 rounded-lg">
                <Users className="h-5 w-5 text-azul-400" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">{totalInvestors.toLocaleString()}</p>
              <p className="text-sm text-grafite-300">Total de Investidores</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-grafite-800/50 to-grafite-900/50 backdrop-blur-sm border border-grafite-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-verde-500/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-verde-400" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">{formatUtils.currency(totalInvested)}</p>
              <p className="text-sm text-grafite-300">Total Investido</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-grafite-800/50 to-grafite-900/50 backdrop-blur-sm border border-grafite-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-dourado-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-dourado-400" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">{formatUtils.percentage(averageROI)}</p>
              <p className="text-sm text-grafite-300">ROI Médio</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-grafite-800/50 to-grafite-900/50 backdrop-blur-sm border border-grafite-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-roxo-500/20 rounded-lg">
                <Target className="h-5 w-5 text-roxo-400" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">{activeInvestors}</p>
              <p className="text-sm text-grafite-300">Ativos (30 dias)</p>
            </div>
          </div>
        </motion.div>

        {/* Filtros e Busca */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-grafite-800/50 to-grafite-900/50 backdrop-blur-sm border border-grafite-700/50 rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-grafite-400" />
                <input
                  type="text"
                  placeholder="Buscar por endereço ou tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-grafite-900/50 border border-grafite-600 rounded-lg text-white placeholder-grafite-400 focus:outline-none focus:ring-2 focus:ring-azul-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtro por Tier */}
            <div className="lg:w-48">
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="w-full px-4 py-3 bg-grafite-900/50 border border-grafite-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-azul-500 focus:border-transparent"
              >
                <option value="all">Todos os Tiers</option>
                <option value="diamond">Diamond</option>
                <option value="platinum">Platinum</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
              </select>
            </div>

            {/* Ordenação */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rank' | 'invested' | 'roi')}
                className="w-full px-4 py-3 bg-grafite-900/50 border border-grafite-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-azul-500 focus:border-transparent"
              >
                <option value="rank">Ranking</option>
                <option value="invested">Total Investido</option>
                <option value="roi">ROI</option>
              </select>
            </div>

            {/* Toggle Endereços Privados */}
            <button
              onClick={() => setShowPrivateAddresses(!showPrivateAddresses)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                showPrivateAddresses
                  ? 'bg-azul-500/20 border-azul-500/50 text-azul-400'
                  : 'bg-grafite-900/50 border-grafite-600 text-grafite-400 hover:text-white'
              }`}
            >
              {showPrivateAddresses ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              <span className="hidden lg:inline">Privados</span>
            </button>
          </div>
        </motion.div>

        {/* Lista de Investidores */}
        <div className="space-y-4">
          {filteredInvestors.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Users className="h-16 w-16 text-grafite-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-grafite-300 mb-2">Nenhum investidor encontrado</h3>
              <p className="text-grafite-400">Tente ajustar os filtros de busca</p>
            </motion.div>
          ) : (
            filteredInvestors.map((investor, index) => {
              const tier = getInvestorTier(investor.participationScore);
              const TierIcon = tier.icon;
              const investorType = INVESTOR_TYPES[investor.type];
              
              return (
                <motion.div
                  key={investor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-grafite-800/50 to-grafite-900/50 backdrop-blur-sm border border-grafite-700/50 rounded-xl p-6 hover:border-azul-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Ranking */}
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${tier.bgColor}`}>
                          <span className={`text-xl font-bold ${tier.color}`}>#{investor.rank}</span>
                        </div>
                        <div className={`p-2 rounded-lg ${tier.bgColor}`}>
                          <TierIcon className={`h-5 w-5 ${tier.color}`} />
                        </div>
                      </div>

                      {/* Informações do Investidor */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white">
                            {investor.isPrivate && !showPrivateAddresses
                              ? maskAddress(investor.address)
                              : investor.address}
                          </h3>
                          {investor.isVerified && (
                            <Shield className="h-4 w-4 text-azul-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${investorType.color}`}>
                            {investorType.label}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${tier.color} ${tier.bgColor}`}>
                            {tier.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Métricas */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-right">
                      <div>
                        <p className="text-sm text-grafite-400">Total Investido</p>
                        <p className="text-lg font-semibold text-white">{formatUtils.currency(investor.totalInvested)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-grafite-400">Projetos</p>
                        <p className="text-lg font-semibold text-white">{investor.projectsParticipated}</p>
                      </div>
                      <div>
                        <p className="text-sm text-grafite-400">Score</p>
                        <p className="text-lg font-semibold text-white">{investor.participationScore.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-grafite-400">ROI</p>
                        <div className="flex items-center justify-end gap-1">
                          {investor.roi > 0 ? (
                            <ArrowUpRight className="h-4 w-4 text-verde-400" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-vermelho-400" />
                          )}
                          <p className={`text-lg font-semibold ${
                            investor.roi > 0 ? 'text-verde-400' : 'text-vermelho-400'
                          }`}>
                            {formatUtils.percentage(investor.roi)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Badges de Conquistas */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-grafite-700/50">
                    <span className="text-sm text-grafite-400">Conquistas:</span>
                    {investor.achievements.slice(0, 3).map((achievement) => {
                      const badge = ACHIEVEMENT_BADGES[achievement];
                      const BadgeIcon = badge.icon;
                      return (
                        <div
                          key={achievement}
                          className="flex items-center gap-1 px-2 py-1 bg-grafite-900/50 rounded-full"
                        >
                          <BadgeIcon className={`h-3 w-3 ${badge.color}`} />
                          <span className="text-xs text-grafite-300">{badge.label}</span>
                        </div>
                      );
                    })}
                    {investor.achievements.length > 3 && (
                      <div className="px-2 py-1 bg-grafite-900/50 rounded-full text-xs text-grafite-400">
                        +{investor.achievements.length - 3}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}