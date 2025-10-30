import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, Users, MessageCircle, Heart, Radio } from 'lucide-react';
import type { PublicAMA, AMAStatus } from '../../types/ama';
import { AMAStatus as AMAStatusEnum } from '../../types/ama';

interface PublicAMAAreaProps {
  className?: string;
}

// Dados simulados para demonstração
const mockPublicAMAs: PublicAMA[] = [
  {
    id: '1',
    projectId: 'proj-1',
    projectName: 'EcoToken',
    projectLogo: '/images/projects/ecotoken-logo.png',
    title: 'Sustentabilidade e Blockchain: O Futuro Verde',
    description: 'Discussão sobre como a tecnologia blockchain pode revolucionar a sustentabilidade ambiental.',
    scheduledDate: new Date('2024-01-15T15:00:00Z'),
    duration: 60,
    status: AMAStatusEnum.SCHEDULED,
    youtubeUrl: 'https://youtube.com/watch?v=example1',
    moderatorName: 'Ana Silva',
    viewerCount: 0,
    questionsCount: 0,
    votesCount: 0,
    rating: 0,
    isLive: false
  },
  {
    id: '2',
    projectId: 'proj-2',
    projectName: 'DeFi Protocol',
    projectLogo: '/images/projects/defi-logo.png',
    title: 'Revolução DeFi: Finanças Descentralizadas',
    description: 'Como o DeFi está mudando o sistema financeiro tradicional.',
    scheduledDate: new Date('2024-01-14T18:00:00Z'),
    duration: 45,
    status: AMAStatusEnum.LIVE,
    youtubeUrl: 'https://youtube.com/watch?v=example2',
    moderatorName: 'Carlos Santos',
    viewerCount: 234,
    questionsCount: 15,
    votesCount: 89,
    rating: 4.8,
    isLive: true
  },
  {
    id: '3',
    projectId: 'proj-3',
    projectName: 'NFT Marketplace',
    projectLogo: '/images/projects/nft-logo.png',
    title: 'NFTs e Arte Digital: Novas Oportunidades',
    description: 'Explorando o mercado de NFTs e suas aplicações na arte digital.',
    scheduledDate: new Date('2024-01-12T20:00:00Z'),
    duration: 90,
    status: AMAStatusEnum.COMPLETED,
    youtubeUrl: 'https://youtube.com/watch?v=example3',
    moderatorName: 'Maria Oliveira',
    viewerCount: 456,
    questionsCount: 32,
    votesCount: 178,
    rating: 4.6,
    isLive: false
  }
];

export const PublicAMAArea: React.FC<PublicAMAAreaProps> = ({ className = '' }) => {
  const [amas, setAmas] = useState<PublicAMA[]>([]);
  const [filteredAmas, setFilteredAmas] = useState<PublicAMA[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AMAStatus | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    const loadAMAs = async () => {
      setIsLoading(true);
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAmas(mockPublicAMAs);
      setFilteredAmas(mockPublicAMAs);
      setIsLoading(false);
    };

    loadAMAs();
  }, []);

  useEffect(() => {
    let filtered = amas;

    // Filtrar por status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(ama => ama.status === statusFilter);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(ama =>
        ama.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ama.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ama.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAmas(filtered);
  }, [amas, searchTerm, statusFilter]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: AMAStatus) => {
    switch (status) {
      case AMAStatusEnum.LIVE:
        return 'text-red-500 bg-red-50';
      case AMAStatusEnum.SCHEDULED:
        return 'text-blue-500 bg-blue-50';
      case AMAStatusEnum.COMPLETED:
        return 'text-green-500 bg-green-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusText = (status: AMAStatus) => {
    switch (status) {
      case AMAStatusEnum.LIVE:
        return 'AO VIVO';
      case AMAStatusEnum.SCHEDULED:
        return 'AGENDADA';
      case AMAStatusEnum.COMPLETED:
        return 'FINALIZADA';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">AMAs Públicas</h2>
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar AMAs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AMAStatus | 'ALL')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="ALL">Todos os Status</option>
            <option value={AMAStatusEnum.LIVE}>Ao Vivo</option>
            <option value={AMAStatusEnum.SCHEDULED}>Agendadas</option>
            <option value={AMAStatusEnum.COMPLETED}>Finalizadas</option>
          </select>
        </div>
      </div>

      {/* Lista de AMAs */}
      <div className="p-6">
        {filteredAmas.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="mx-auto w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Nenhuma AMA encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAmas.map((ama) => (
              <div
                key={ama.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {ama.projectLogo && (
                      <img
                        src={ama.projectLogo}
                        alt={ama.projectName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{ama.title}</h3>
                      <p className="text-sm text-gray-600">{ama.projectName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {ama.isLive && (
                      <Radio className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ama.status)}`}>
                      {getStatusText(ama.status)}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{ama.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(ama.scheduledDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{ama.duration}min</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{ama.viewerCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{ama.questionsCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{ama.votesCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};