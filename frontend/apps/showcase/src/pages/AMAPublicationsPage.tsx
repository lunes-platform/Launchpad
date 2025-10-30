import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  Play,
  Search,
  Filter,
  Grid,
  List,
  ChevronDown,
  Star,
  MessageSquare,
  ExternalLink,
  User,
  MapPin,
  Tag,
  Eye,
  Heart,
  Share2,
} from 'lucide-react';
import { Card, Button } from '@launchpad/shared-ui';
import { Badge } from '../components/ui/Badge';

interface AMAPublication {
  id: string;
  title: string;
  description: string;
  host: {
    name: string;
    avatar: string;
    role: string;
    company?: string;
  };
  project: {
    name: string;
    logo: string;
    category: string;
  };
  scheduledDate: string;
  duration: number;
  status: 'upcoming' | 'live' | 'completed';
  participants: number;
  maxParticipants?: number;
  youtubeUrl?: string;
  tags: string[];
  price: number;
  currency: string;
  rating?: number;
  views: number;
  likes: number;
  isBookmarked: boolean;
  isPaid: boolean;
  language: string;
  timezone: string;
}

// Dados simulados de AMAs
const mockAMAs: AMAPublication[] = [
  {
    id: '1',
    title: 'O Futuro das Finanças Descentralizadas',
    description: 'Uma discussão profunda sobre DeFi, protocolos emergentes e oportunidades de investimento no ecossistema descentralizado.',
    host: {
      name: 'Dr. Carlos Silva',
      avatar: '/src/assets/avatar-placeholder.svg',
      role: 'DeFi Specialist',
      company: 'Blockchain Ventures'
    },
    project: {
      name: 'DeFi Protocol',
      logo: '/src/assets/project-logo-placeholder.svg',
      category: 'DeFi'
    },
    scheduledDate: '2024-02-15T19:00:00Z',
    duration: 90,
    status: 'upcoming',
    participants: 245,
    maxParticipants: 500,
    youtubeUrl: 'https://youtube.com/watch?v=example1',
    tags: ['DeFi', 'Blockchain', 'Investimentos'],
    price: 0,
    currency: 'LUNES',
    views: 1250,
    likes: 89,
    isBookmarked: false,
    isPaid: false,
    language: 'Português',
    timezone: 'America/Sao_Paulo'
  },
  {
    id: '2',
    title: 'NFTs e Arte Digital: Revolução Criativa',
    description: 'Explorando o impacto dos NFTs no mercado de arte, casos de sucesso e tendências futuras.',
    host: {
      name: 'Ana Martins',
      avatar: '/src/assets/avatar-female.svg',
      role: 'NFT Artist',
      company: 'Digital Art Studio'
    },
    project: {
      name: 'NFT Marketplace',
      logo: '/src/assets/nft-logo.svg',
      category: 'NFT'
    },
    scheduledDate: '2024-02-12T20:30:00Z',
    duration: 60,
    status: 'live',
    participants: 156,
    maxParticipants: 300,
    youtubeUrl: 'https://youtube.com/watch?v=example2',
    tags: ['NFT', 'Arte Digital', 'Criatividade'],
    price: 25,
    currency: 'LUNES',
    rating: 4.8,
    views: 890,
    likes: 67,
    isBookmarked: true,
    isPaid: true,
    language: 'Português',
    timezone: 'America/Sao_Paulo'
  },
  {
    id: '3',
    title: 'Estratégias de Staking e Yield Farming',
    description: 'Aprenda as melhores práticas para maximizar seus rendimentos através de staking e yield farming.',
    host: {
      name: 'Roberto Costa',
      avatar: '/src/assets/avatar-male.svg',
      role: 'Yield Farmer',
      company: 'Crypto Yields'
    },
    project: {
      name: 'Staking Protocol',
      logo: '/src/assets/staking-logo.svg',
      category: 'Staking'
    },
    scheduledDate: '2024-02-10T18:00:00Z',
    duration: 75,
    status: 'completed',
    participants: 312,
    youtubeUrl: 'https://youtube.com/watch?v=example3',
    tags: ['Staking', 'Yield Farming', 'Estratégia'],
    price: 15,
    currency: 'LUNES',
    rating: 4.6,
    views: 2100,
    likes: 145,
    isBookmarked: false,
    isPaid: true,
    language: 'Português',
    timezone: 'America/Sao_Paulo'
  }
];

export function AMAPublicationsPage() {
  const navigate = useNavigate();
  const [amas, setAmas] = useState<AMAPublication[]>(mockAMAs);
  const [filteredAmas, setFilteredAmas] = useState<AMAPublication[]>(mockAMAs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('date');
  const [showFilters, setShowFilters] = useState(false);

  // Filtrar AMAs baseado nos critérios selecionados
  useEffect(() => {
    let filtered = amas;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(ama =>
        ama.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ama.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ama.host.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ama.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtro por status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(ama => ama.status === selectedStatus);
    }

    // Filtro por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ama => ama.project.category === selectedCategory);
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime();
        case 'popularity':
          return b.participants - a.participants;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'views':
          return b.views - a.views;
        default:
          return 0;
      }
    });

    setFilteredAmas(filtered);
  }, [amas, searchTerm, selectedStatus, selectedCategory, sortBy]);

  const handleBookmark = (amaId: string) => {
    setAmas(prev => prev.map(ama =>
      ama.id === amaId ? { ...ama, isBookmarked: !ama.isBookmarked } : ama
    ));
  };

  const handleLike = (amaId: string) => {
    setAmas(prev => prev.map(ama =>
      ama.id === amaId ? { ...ama, likes: ama.likes + 1 } : ama
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-500 text-white';
      case 'upcoming':
        return 'bg-blue-500 text-white';
      case 'completed':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live':
        return 'AO VIVO';
      case 'upcoming':
        return 'EM BREVE';
      case 'completed':
        return 'FINALIZADO';
      default:
        return status.toUpperCase();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderAMACard = (ama: AMAPublication) => (
    <motion.div
      key={ama.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <div className="p-6">
          {/* Header com status e bookmark */}
          <div className="flex justify-between items-start mb-4">
            <Badge className={`${getStatusColor(ama.status)} px-2 py-1 text-xs font-semibold`}>
              {getStatusText(ama.status)}
            </Badge>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleBookmark(ama.id)}
                className={`p-1 ${ama.isBookmarked ? 'text-yellow-500' : 'text-gray-400'}`}
              >
                <Star className="w-4 h-4" fill={ama.isBookmarked ? 'currentColor' : 'none'} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(ama.id)}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <Heart className="w-4 h-4" />
                <span className="ml-1 text-xs">{ama.likes}</span>
              </Button>
            </div>
          </div>

          {/* Título e descrição */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {ama.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {ama.description}
          </p>

          {/* Host info */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={ama.host.avatar}
              alt={ama.host.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">
                {ama.host.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {ama.host.role} {ama.host.company && `• ${ama.host.company}`}
              </p>
            </div>
          </div>

          {/* Project info */}
          <div className="flex items-center gap-2 mb-4">
            <img
              src={ama.project.logo}
              alt={ama.project.name}
              className="w-6 h-6 rounded object-cover"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {ama.project.name}
            </span>
            <Badge variant="secondary" className="text-xs">
              {ama.project.category}
            </Badge>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {ama.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {ama.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{ama.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Data e duração */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(ama.scheduledDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{ama.duration}min</span>
            </div>
          </div>

          {/* Participantes e preço */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
              <Users className="w-4 h-4" />
              <span>
                {ama.participants}
                {ama.maxParticipants && `/${ama.maxParticipants}`}
              </span>
            </div>
            <div className="text-right">
              {ama.isPaid ? (
                <span className="text-lg font-bold text-green-600">
                  {ama.price} {ama.currency}
                </span>
              ) : (
                <Badge className="bg-green-100 text-green-800">GRATUITO</Badge>
              )}
            </div>
          </div>

          {/* Rating e views */}
          {ama.status === 'completed' && (
            <div className="flex justify-between items-center mb-4 text-sm text-gray-600 dark:text-gray-300">
              {ama.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                  <span>{ama.rating}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{ama.views.toLocaleString()} views</span>
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex gap-2">
            {ama.status === 'live' && (
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={() => navigate(`/ama/${ama.id}`)}
              >
                <Play className="w-4 h-4 mr-2" />
                Assistir Ao Vivo
              </Button>
            )}
            {ama.status === 'upcoming' && (
              <Button 
                className="flex-1"
                onClick={() => navigate(`/ama/${ama.id}`)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Participar
              </Button>
            )}
            {ama.status === 'completed' && (
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate(`/ama/${ama.id}`)}
              >
                <Play className="w-4 h-4 mr-2" />
                Assistir Gravação
              </Button>
            )}
            <Button variant="ghost" size="sm" className="p-2">
              <Share2 className="w-4 h-4" />
            </Button>
            {ama.youtubeUrl && (
              <Button variant="ghost" size="sm" className="p-2">
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-grafite-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AMAs Publicadas
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Descubra e participe de sessões Ask Me Anything com especialistas do mercado
          </p>
        </div>

        {/* Filtros e busca */}
        <div className="bg-white dark:bg-grafite-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar AMAs, hosts ou tópicos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-grafite-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-grafite-600 rounded-lg bg-white dark:bg-grafite-700 text-gray-900 dark:text-white"
              >
                <option value="all">Todos os Status</option>
                <option value="live">Ao Vivo</option>
                <option value="upcoming">Em Breve</option>
                <option value="completed">Finalizados</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-grafite-600 rounded-lg bg-white dark:bg-grafite-700 text-gray-900 dark:text-white"
              >
                <option value="all">Todas as Categorias</option>
                <option value="DeFi">DeFi</option>
                <option value="NFT">NFT</option>
                <option value="Staking">Staking</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-grafite-600 rounded-lg bg-white dark:bg-grafite-700 text-gray-900 dark:text-white"
              >
                <option value="date">Data</option>
                <option value="popularity">Popularidade</option>
                <option value="rating">Avaliação</option>
                <option value="views">Visualizações</option>
              </select>

              {/* Toggle de visualização */}
              <div className="flex border border-gray-300 dark:border-grafite-600 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {filteredAmas.length} AMA{filteredAmas.length !== 1 ? 's' : ''} encontrada{filteredAmas.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid de AMAs */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredAmas.map(renderAMACard)}
        </div>

        {/* Estado vazio */}
        {filteredAmas.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma AMA encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Tente ajustar os filtros ou termos de busca
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AMAPublicationsPage;