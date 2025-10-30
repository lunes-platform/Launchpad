import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Plus,
  Settings,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Play,
  Pause,
  Youtube,
  MessageCircle,
  Heart,
  Star,
  Coins,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AMA, AMAStatus, CreateAMARequest, AMAStats } from '../../types/ama';
import { UserRole } from '../../types/user';

interface AMAManagerProps {
  isCollapsed?: boolean;
}

/**
 * Componente AMAManager - Gerencia AMAs para projetos em captação
 * Permite criar, configurar e monitorar AMAs com sistema de pagamento
 */
export function AMAManager({ isCollapsed = false }: AMAManagerProps) {
  const { user } = useAuth();
  const [amas, setAmas] = useState<AMA[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAMA, setSelectedAMA] = useState<AMA | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AMAStats | null>(null);

  // Verificar se o usuário pode criar AMAs
  const canCreateAMA = user && [UserRole.PROJECT, UserRole.ADMIN].includes(user.role);

  // Simular dados de AMAs (substituir por API real)
  useEffect(() => {
    const mockAMAs: AMA[] = [
      {
        id: '1',
        projectId: 'proj-1',
        title: 'AMA - Projeto DeFi Revolution',
        description: 'Discussão sobre o futuro das finanças descentralizadas',
        scheduledDate: new Date('2024-01-15T19:00:00'),
        duration: 60,
        status: AMAStatus.SCHEDULED,
        youtubeUrl: 'https://youtube.com/watch?v=example1',
        price: 0, // Primeira AMA gratuita
        moderatorId: 'mod-1',
        createdAt: new Date('2024-01-10T10:00:00'),
        updatedAt: new Date('2024-01-10T10:00:00'),
        isFirstFree: true,
        questions: [],
        votes: [],
      },
      {
        id: '2',
        projectId: 'proj-1',
        title: 'AMA - Roadmap 2024',
        description: 'Apresentação do roadmap e próximos desenvolvimentos',
        scheduledDate: new Date('2024-02-15T20:00:00'),
        duration: 90,
        status: AMAStatus.DRAFT,
        price: 200,
        moderatorId: 'mod-1',
        createdAt: new Date('2024-01-12T14:00:00'),
        updatedAt: new Date('2024-01-12T14:00:00'),
        isFirstFree: false,
        questions: [],
        votes: [],
      },
    ];

    setAmas(mockAMAs);

    // Mock stats
    setStats({
      totalAMAs: 2,
      scheduledAMAs: 1,
      completedAMAs: 0,
      totalRevenue: 200,
      totalQuestions: 0,
      totalVotes: 0,
      averageRating: 0,
    });
  }, []);

  const handleCreateAMA = async (amaData: CreateAMARequest) => {
    setLoading(true);
    try {
      // Simular criação de AMA (substituir por API real)
      const newAMA: AMA = {
        id: Date.now().toString(),
        projectId: amaData.projectId,
        title: amaData.title,
        description: amaData.description,
        scheduledDate: amaData.scheduledDate,
        duration: amaData.duration,
        status: AMAStatus.DRAFT,
        price: amaData.price,
        moderatorId: 'mod-1', // Moderador da equipe
        createdAt: new Date(),
        updatedAt: new Date(),
        isFirstFree: amaData.isFirstFree,
        questions: [],
        votes: [],
      };

      setAmas(prev => [...prev, newAMA]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Erro ao criar AMA:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: AMAStatus) => {
    switch (status) {
      case AMAStatus.DRAFT:
        return <Edit className="w-4 h-4 text-gray-500" />;
      case AMAStatus.SCHEDULED:
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case AMAStatus.LIVE:
        return <Play className="w-4 h-4 text-red-500" />;
      case AMAStatus.COMPLETED:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case AMAStatus.CANCELLED:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: AMAStatus) => {
    switch (status) {
      case AMAStatus.DRAFT:
        return 'bg-gray-100 text-gray-700';
      case AMAStatus.SCHEDULED:
        return 'bg-blue-100 text-blue-700';
      case AMAStatus.LIVE:
        return 'bg-red-100 text-red-700';
      case AMAStatus.COMPLETED:
        return 'bg-green-100 text-green-700';
      case AMAStatus.CANCELLED:
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (!canCreateAMA) {
    return (
      <div className="p-4">
        <div className="text-center text-gray-500">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Apenas emissores de projetos podem gerenciar AMAs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-grafite-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-roxo-500" />
            {!isCollapsed && (
              <div>
                <h2 className="font-semibold text-grafite-900 dark:text-white">
                  Gerenciar AMAs
                </h2>
                <p className="text-xs text-grafite-500 dark:text-grafite-400">
                  Configure sessões ao vivo
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-2 bg-roxo-500 text-white rounded-lg hover:bg-roxo-600 transition-colors"
              title="Criar nova AMA"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      {!isCollapsed && stats && (
        <div className="p-4 border-b border-gray-200 dark:border-grafite-700">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  Agendadas
                </span>
              </div>
              <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                {stats.scheduledAMAs}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">
                  Receita
                </span>
              </div>
              <p className="text-lg font-bold text-green-900 dark:text-green-100">
                ${stats.totalRevenue}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de AMAs */}
      <div className="flex-1 overflow-y-auto p-4">
        {amas.length === 0 ? (
          <div className="text-center py-8">
            <Video className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-gray-500 mb-4">
              Nenhuma AMA criada ainda
            </p>
            {!isCollapsed && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-roxo-500 text-white rounded-lg hover:bg-roxo-600 transition-colors text-sm"
              >
                Criar primeira AMA
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {amas.map((ama) => (
              <motion.div
                key={ama.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-grafite-800 border border-gray-200 dark:border-grafite-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-grafite-900 dark:text-white text-sm mb-1">
                      {ama.title}
                    </h3>
                    <p className="text-xs text-grafite-500 dark:text-grafite-400 mb-2">
                      {ama.description}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ama.status)}`}>
                        {getStatusIcon(ama.status)}
                        {ama.status}
                      </span>
                      {ama.isFirstFree && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <Star className="w-3 h-3" />
                          Gratuita
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-grafite-500 dark:text-grafite-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {ama.scheduledDate.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ama.duration}min
                    </span>
                    {!ama.isFirstFree && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        ${ama.price}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedAMA(ama)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-grafite-700 rounded"
                      title="Ver detalhes"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-100 dark:hover:bg-grafite-700 rounded"
                      title="Editar"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    {ama.youtubeUrl && (
                      <a
                        href={ama.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:bg-gray-100 dark:hover:bg-grafite-700 rounded"
                        title="Ver no YouTube"
                      >
                        <Youtube className="w-3 h-3 text-red-500" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Criação de AMA */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateAMAModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateAMA}
            loading={loading}
          />
        )}
      </AnimatePresence>

      {/* Modal de Detalhes da AMA */}
      <AnimatePresence>
        {selectedAMA && (
          <AMADetailsModal
            ama={selectedAMA}
            onClose={() => setSelectedAMA(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Modal para criar nova AMA
interface CreateAMAModalProps {
  onClose: () => void;
  onSubmit: (data: CreateAMARequest) => void;
  loading: boolean;
}

function CreateAMAModal({ onClose, onSubmit, loading }: CreateAMAModalProps) {
  const [formData, setFormData] = useState<CreateAMARequest>({
    projectId: '',
    title: '',
    description: '',
    scheduledDate: new Date(),
    duration: 60,
    price: 200,
    isFirstFree: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-grafite-800 rounded-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">Criar Nova AMA</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev: CreateAMARequest) => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev: CreateAMARequest) => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Data</label>
              <input
                type="datetime-local"
                value={formData.scheduledDate.toISOString().slice(0, 16)}
                onChange={(e) => setFormData((prev: CreateAMARequest) => ({ ...prev, scheduledDate: new Date(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duração (min)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData((prev: CreateAMARequest) => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                min="30"
                max="180"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFirstFree"
              checked={formData.isFirstFree}
              onChange={(e) => setFormData((prev: CreateAMARequest) => ({ 
                ...prev, 
                isFirstFree: e.target.checked,
                price: e.target.checked ? 0 : 200
              }))}
              className="rounded"
            />
            <label htmlFor="isFirstFree" className="text-sm">
              Esta é minha primeira AMA (gratuita)
            </label>
          </div>

          {!formData.isFirstFree && (
            <div>
              <label className="block text-sm font-medium mb-1">Preço ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData((prev: CreateAMARequest) => ({ ...prev, price: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                min="200"
                step="0.01"
                required
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-roxo-500 text-white rounded-lg hover:bg-roxo-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar AMA'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Modal de detalhes da AMA
interface AMADetailsModalProps {
  ama: AMA;
  onClose: () => void;
}

function AMADetailsModal({ ama, onClose }: AMADetailsModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-grafite-800 rounded-xl p-6 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Detalhes da AMA</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-grafite-700 rounded-lg"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-grafite-900 dark:text-white mb-2">
              {ama.title}
            </h4>
            <p className="text-sm text-grafite-600 dark:text-grafite-300">
              {ama.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-grafite-500 dark:text-grafite-400">
                Data e Hora
              </label>
              <p className="text-sm font-medium">
                {ama.scheduledDate.toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-grafite-500 dark:text-grafite-400">
                Duração
              </label>
              <p className="text-sm font-medium">{ama.duration} minutos</p>
            </div>
            <div>
              <label className="text-xs font-medium text-grafite-500 dark:text-grafite-400">
                Preço
              </label>
              <p className="text-sm font-medium">
                {ama.isFirstFree ? 'Gratuita' : `$${ama.price}`}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-grafite-500 dark:text-grafite-400">
                Status
              </label>
              <p className="text-sm font-medium">{ama.status}</p>
            </div>
          </div>

          {ama.youtubeUrl && (
            <div>
              <label className="text-xs font-medium text-grafite-500 dark:text-grafite-400">
                Link do YouTube
              </label>
              <a
                href={ama.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-roxo-500 hover:text-roxo-600 flex items-center gap-1"
              >
                <Youtube className="w-4 h-4" />
                Assistir no YouTube
              </a>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-grafite-700">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-grafite-500 dark:text-grafite-400 mb-1">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">Perguntas</span>
              </div>
              <p className="text-lg font-bold">{ama.questions.length}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-grafite-500 dark:text-grafite-400 mb-1">
                <Heart className="w-4 h-4" />
                <span className="text-xs">Votos</span>
              </div>
              <p className="text-lg font-bold">{ama.votes.length}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-grafite-500 dark:text-grafite-400 mb-1">
                <Coins className="w-4 h-4" />
                <span className="text-xs">LUNES</span>
              </div>
              <p className="text-lg font-bold">
                {(ama.questions.length * 0.5 + ama.votes.length * 0.5).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}