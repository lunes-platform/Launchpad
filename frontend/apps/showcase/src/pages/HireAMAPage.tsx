import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, DollarSign, User, Star, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

interface AMAExpert {
  id: string;
  name: string;
  avatar: string;
  expertise: string[];
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  availability: string;
  description: string;
  completedAMAs: number;
}

interface HireRequest {
  expertId: string;
  projectTitle: string;
  projectDescription: string;
  preferredDate: string;
  preferredTime: string;
  duration: number;
  topics: string[];
  specialRequests: string;
  budget: number;
}

const HireAMAPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedExpert, setSelectedExpert] = useState<AMAExpert | null>(null);
  const [showHireForm, setShowHireForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('');

  const [hireRequest, setHireRequest] = useState<HireRequest>({
    expertId: '',
    projectTitle: '',
    projectDescription: '',
    preferredDate: '',
    preferredTime: '',
    duration: 60,
    topics: [],
    specialRequests: '',
    budget: 0
  });

  // Verificar se o usuário tem permissão (apenas PROJECT ou ADMIN)
  const canHireExperts = user?.role === UserRole.PROJECT_ISSUER || user?.role === UserRole.ADMIN;
  if (!user || !canHireExperts) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Acesso Negado
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Apenas donos de projetos podem contratar especialistas para AMAs.
          </p>
        </div>
      </div>
    );
  }

  // Dados simulados de especialistas
  const mockExperts: AMAExpert[] = [
    {
      id: '1',
      name: 'Dr. Maria Silva',
      avatar: '/api/placeholder/64/64',
      expertise: ['DeFi', 'Blockchain', 'Smart Contracts'],
      rating: 4.9,
      reviewsCount: 127,
      hourlyRate: 150,
      availability: 'Disponível esta semana',
      description: 'Especialista em DeFi com 8 anos de experiência em blockchain e contratos inteligentes.',
      completedAMAs: 89
    },
    {
      id: '2',
      name: 'João Santos',
      avatar: '/api/placeholder/64/64',
      expertise: ['NFTs', 'GameFi', 'Metaverse'],
      rating: 4.8,
      reviewsCount: 94,
      hourlyRate: 120,
      availability: 'Disponível próxima semana',
      description: 'Pioneiro em NFTs e GameFi, com experiência em projetos de metaverso.',
      completedAMAs: 67
    },
    {
      id: '3',
      name: 'Ana Costa',
      avatar: '/api/placeholder/64/64',
      expertise: ['Tokenomics', 'DAO', 'Governance'],
      rating: 4.9,
      reviewsCount: 156,
      hourlyRate: 180,
      availability: 'Disponível hoje',
      description: 'Consultora em tokenomics e governança descentralizada para projetos Web3.',
      completedAMAs: 112
    }
  ];

  const filteredExperts = mockExperts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesExpertise = !expertiseFilter || expert.expertise.includes(expertiseFilter);
    return matchesSearch && matchesExpertise;
  });

  const allExpertise = Array.from(new Set(mockExperts.flatMap(expert => expert.expertise)));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setHireRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTopicAdd = (topic: string) => {
    if (topic && !hireRequest.topics.includes(topic)) {
      setHireRequest(prev => ({
        ...prev,
        topics: [...prev.topics, topic]
      }));
    }
  };

  const handleTopicRemove = (topic: string) => {
    setHireRequest(prev => ({
      ...prev,
      topics: prev.topics.filter(t => t !== topic)
    }));
  };

  const handleHireExpert = async (expert: AMAExpert) => {
    setSelectedExpert(expert);
    setHireRequest(prev => ({
      ...prev,
      expertId: expert.id,
      budget: expert.hourlyRate * (prev.duration / 60)
    }));
    setShowHireForm(true);
  };

  const handleSubmitHire = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Solicitação de contratação:', hireRequest);
      setIsSuccess(true);
      setShowHireForm(false);
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Solicitação Enviada!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Sua solicitação de contratação foi enviada para {selectedExpert?.name}.
            Você receberá uma resposta em até 24 horas.
          </p>
          <button
            onClick={() => {
              setIsSuccess(false);
              setSelectedExpert(null);
              setHireRequest({
                expertId: '',
                projectTitle: '',
                projectDescription: '',
                preferredDate: '',
                preferredTime: '',
                duration: 60,
                topics: [],
                specialRequests: '',
                budget: 0
              });
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contratar Outro Especialista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Contratar Especialista para AMA
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Encontre e contrate especialistas para conduzir AMAs sobre seu projeto
          </p>
        </div>

        {!showHireForm ? (
          <>
            {/* Filtros */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Buscar Especialistas
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nome ou área de especialidade..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Área de Especialidade
                  </label>
                  <select
                    value={expertiseFilter}
                    onChange={(e) => setExpertiseFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Todas as áreas</option>
                    {allExpertise.map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Lista de Especialistas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperts.map((expert) => (
                <div key={expert.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <img
                      src={expert.avatar}
                      alt={expert.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {expert.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        {expert.rating} ({expert.reviewsCount} avaliações)
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {expert.description}
                  </p>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {expert.expertise.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <DollarSign className="w-4 h-4 mr-2" />
                      ${expert.hourlyRate}/hora
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {expert.completedAMAs} AMAs realizadas
                    </div>
                    <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                      <Clock className="w-4 h-4 mr-2" />
                      {expert.availability}
                    </div>
                  </div>

                  <button
                    onClick={() => handleHireExpert(expert)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Contratar Especialista
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Formulário de Contratação */
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={() => setShowHireForm(false)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4"
              >
                ← Voltar
              </button>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Contratar {selectedExpert?.name}
              </h2>
            </div>

            <form onSubmit={handleSubmitHire} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título do Projeto *
                  </label>
                  <input
                    type="text"
                    name="projectTitle"
                    value={hireRequest.projectTitle}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duração (minutos) *
                  </label>
                  <select
                    name="duration"
                    value={hireRequest.duration}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value={30}>30 minutos</option>
                    <option value={60}>1 hora</option>
                    <option value={90}>1h 30min</option>
                    <option value={120}>2 horas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição do Projeto *
                </label>
                <textarea
                  name="projectDescription"
                  value={hireRequest.projectDescription}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Descreva seu projeto, objetivos e o que espera do AMA..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Preferida *
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={hireRequest.preferredDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Horário Preferido *
                  </label>
                  <input
                    type="time"
                    name="preferredTime"
                    value={hireRequest.preferredTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tópicos Específicos
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {hireRequest.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center"
                    >
                      {topic}
                      <button
                        type="button"
                        onClick={() => handleTopicRemove(topic)}
                        className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Digite um tópico e pressione Enter"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleTopicAdd(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Solicitações Especiais
                </label>
                <textarea
                  name="specialRequests"
                  value={hireRequest.specialRequests}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Alguma solicitação especial ou requisito específico..."
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Custo Total Estimado:
                  </span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${selectedExpert ? (selectedExpert.hourlyRate * (hireRequest.duration / 60)).toFixed(2) : '0.00'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Baseado em ${selectedExpert?.hourlyRate}/hora por {hireRequest.duration} minutos
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowHireForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Enviando...' : 'Enviar Solicitação'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default HireAMAPage;