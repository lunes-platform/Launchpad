import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Vote,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  Award,
  BarChart3,
  Filter,
  Search,
  Plus,
  X,
  FileText,
  Coins,
  Gift,
} from 'lucide-react';
import { Card, Button } from '../../../../packages/shared-ui/src/components';
import { Modal } from '../../../../packages/shared-ui/src/components/Modal';
import { Input } from '../../../../packages/shared-ui/src/components/Input';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  endDate: string;
  category: 'project' | 'platform' | 'treasury' | 'governance';
  requiredStake: number;
}

const mockProposals: Proposal[] = [
  {
    id: '1',
    title: 'Aprovação do Projeto DeFi Protocol',
    description: 'Proposta para aprovação de um novo protocolo DeFi com foco em yield farming e staking.',
    status: 'active',
    votesFor: 1250,
    votesAgainst: 340,
    totalVotes: 1590,
    endDate: '2024-02-15',
    category: 'project',
    requiredStake: 10000,
  },
  {
    id: '2',
    title: 'Atualização dos Parâmetros de Staking',
    description: 'Proposta para ajustar as taxas de recompensa e períodos de lock do sistema de staking.',
    status: 'passed',
    votesFor: 2100,
    votesAgainst: 450,
    totalVotes: 2550,
    endDate: '2024-01-30',
    category: 'platform',
    requiredStake: 5000,
  },
  {
    id: '3',
    title: 'Alocação de Fundos para Marketing',
    description: 'Proposta para alocar 500k LUNES do treasury para campanhas de marketing e parcerias.',
    status: 'active',
    votesFor: 890,
    votesAgainst: 1200,
    totalVotes: 2090,
    endDate: '2024-02-20',
    category: 'treasury',
    requiredStake: 15000,
  },
];

const GovernancePage: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: 'project' as Proposal['category'],
    requiredStake: 10000,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4" />;
      case 'passed':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'project':
        return 'bg-purple-100 text-purple-800';
      case 'platform':
        return 'bg-blue-100 text-blue-800';
      case 'treasury':
        return 'bg-green-100 text-green-800';
      case 'governance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProposals = mockProposals.filter(proposal => {
    const matchesCategory = selectedCategory === 'all' || proposal.category === selectedCategory;
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateProposal = () => {
    // Aqui seria feita a chamada para a API para criar a proposta
    console.log('Criando proposta:', newProposal);
    
    // Reset do formulário e fechamento do modal
    setNewProposal({
      title: '',
      description: '',
      category: 'project',
      requiredStake: 10000,
    });
    setShowCreateModal(false);
    
    // Aqui você adicionaria a lógica para atualizar a lista de propostas
    // Por exemplo, refetch das propostas ou adicionar à lista local
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewProposal({
      title: '',
      description: '',
      category: 'project',
      requiredStake: 10000,
    });
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'project':
        return 'Projetos';
      case 'platform':
        return 'Plataforma';
      case 'treasury':
        return 'Treasury';
      case 'governance':
        return 'Governança';
      default:
        return category;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-grafite-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-roxo to-roxo-claro text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Vote className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">
              Governança{' '}
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Descentralizada
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed font-medium">
              Participe das decisões que moldam o futuro da plataforma Lunes. Sua voz importa na construção de um ecossistema mais justo e transparente.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Votação Segura</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Comunidade Ativa</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>Recompensas por Participação</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-grafite-800/80 backdrop-blur-sm">
              <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Vote className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-3xl font-black text-grafite-900 dark:text-white mb-2 tracking-tight">24</h3>
              <p className="text-grafite-600 dark:text-grafite-300 font-semibold">Propostas Ativas</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-grafite-800/80 backdrop-blur-sm">
              <div className="bg-green-50 dark:bg-green-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-3xl font-black text-grafite-900 dark:text-white mb-2 tracking-tight">1,247</h3>
              <p className="text-grafite-600 dark:text-grafite-300 font-semibold">Votantes Ativos</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-grafite-800/80 backdrop-blur-sm">
              <div className="bg-purple-50 dark:bg-purple-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-3xl font-black text-grafite-900 dark:text-white mb-2 tracking-tight">89%</h3>
              <p className="text-grafite-600 dark:text-grafite-300 font-semibold">Taxa de Aprovação</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-grafite-800/80 backdrop-blur-sm">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-3xl font-black text-grafite-900 dark:text-white mb-2 tracking-tight">2.5M</h3>
              <p className="text-grafite-600 dark:text-grafite-300 font-semibold">LUNES em Stake</p>
            </Card>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-grafite-900 dark:text-white mb-8 text-center"
          >
            Propostas em Votação
          </motion.h2>
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {['Todos', 'Projetos', 'Plataforma', 'Treasury', 'Governança'].map((category, index) => {
                const categoryValue = category === 'Todos' ? 'all' : 
                                    category === 'Projetos' ? 'project' :
                                    category === 'Plataforma' ? 'platform' :
                                    category === 'Treasury' ? 'treasury' : 'governance';
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === categoryValue ? 'primary' : 'outline'}
                    size="lg"
                    onClick={() => setSelectedCategory(categoryValue)}
                    className={`transition-all duration-300 font-semibold px-6 py-3 ${
                      selectedCategory === categoryValue
                        ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg'
                        : 'border-2 border-grafite-200 dark:border-grafite-600 hover:border-primary-500 dark:hover:border-primary-400 text-grafite-700 dark:text-grafite-300 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                  >
                    {category}
                  </Button>
                );
              })}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full lg:w-auto">
              <div className="relative flex-1 lg:w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-grafite-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar propostas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-grafite-200 dark:border-grafite-600 rounded-xl bg-white/80 dark:bg-grafite-800/80 backdrop-blur-sm text-grafite-900 dark:text-white placeholder-grafite-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 font-medium"
                />
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0"
              >
                <Plus className="w-5 h-5" />
                Criar Proposta
              </Button>
            </div>
          </div>
        </div>

        {/* Proposals List */}
        <div className="space-y-8">
          {filteredProposals.map((proposal, index) => (
            <motion.div
              key={proposal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="p-8 hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 dark:bg-grafite-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-grafite-800">
                <div className="flex flex-col gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className={`${getCategoryColor(proposal.category)} px-3 py-1 text-sm font-semibold`}>
                        {proposal.category}
                      </Badge>
                      <Badge className={`${getStatusColor(proposal.status)} px-3 py-1 text-sm font-semibold flex items-center gap-1`}>
                        {getStatusIcon(proposal.status)}
                        {proposal.status}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold text-grafite-900 dark:text-white mb-3 leading-tight">
                      {proposal.title}
                    </h3>
                    <p className="text-lg text-grafite-600 dark:text-grafite-300 mb-6 leading-relaxed">{proposal.description}</p>
                    <div className="flex flex-wrap gap-6 text-sm font-medium text-grafite-500 dark:text-grafite-400 mb-6">
                      <span>Stake mínimo: {proposal.requiredStake.toLocaleString()} LUNES</span>
                      <span>Termina em: {proposal.endDate}</span>
                      <span>Total de votos: {proposal.totalVotes.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <p className="text-sm font-semibold text-grafite-600 dark:text-grafite-400 mb-1">A Favor</p>
                      <p className="text-2xl font-black text-green-600 dark:text-green-400">{proposal.votesFor.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                      <p className="text-sm font-semibold text-grafite-600 dark:text-grafite-400 mb-1">Contra</p>
                      <p className="text-2xl font-black text-red-600 dark:text-red-400">{proposal.votesAgainst.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="w-full bg-grafite-200 dark:bg-grafite-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${(proposal.votesFor / proposal.totalVotes) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-grafite-600 dark:text-grafite-400 mt-2">
                      <span>{((proposal.votesFor / proposal.totalVotes) * 100).toFixed(1)}% A favor</span>
                      <span>{((proposal.votesAgainst / proposal.totalVotes) * 100).toFixed(1)}% Contra</span>
                    </div>
                  </div>
                  
                  {proposal.status === 'active' && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="primary" size="lg" className="flex-1 font-semibold py-3 bg-green-500 hover:bg-green-600 text-white">
                        Votar A Favor
                      </Button>
                      <Button variant="outline" size="lg" className="flex-1 font-semibold py-3 border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white">
                        Votar Contra
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* How to Participate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-grafite-900 dark:text-white mb-6 tracking-tight">
              Como Participar da{' '}
              <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                Governança
              </span>
            </h2>
            <p className="text-xl text-grafite-600 dark:text-grafite-300 max-w-3xl mx-auto leading-relaxed">
              Torne-se parte ativa das decisões que moldam o futuro da plataforma Lunes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-center"
            >
              <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-grafite-900 dark:text-white mb-4">
                  1. Faça Stake de LUNES
                </h3>
                <p className="text-lg text-grafite-600 dark:text-grafite-300 leading-relaxed">
                  Mantenha seus tokens LUNES em stake para ganhar poder de voto proporcional ao seu investimento na plataforma.
                </p>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="text-center"
            >
              <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Vote className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-grafite-900 dark:text-white mb-4">
                  2. Vote nas Propostas
                </h3>
                <p className="text-lg text-grafite-600 dark:text-grafite-300 leading-relaxed">
                  Analise cuidadosamente as propostas e vote de acordo com sua visão para o futuro da plataforma.
                </p>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="text-center"
            >
              <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-grafite-900 dark:text-white mb-4">
                  3. Receba Recompensas
                </h3>
                <p className="text-lg text-grafite-600 dark:text-grafite-300 leading-relaxed">
                  Participantes ativos da governança recebem recompensas adicionais em tokens LUNES como incentivo.
                </p>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Modal de Criação de Proposta */}
      <Modal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        title="Nova Proposta"
        size="md"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleCreateProposal(); }} className="space-y-6">
          <Input
            label="Título da Proposta"
            type="text"
            value={newProposal.title}
            onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
            placeholder="Digite o título da sua proposta..."
            required
          />

          <div>
            <label className="block text-sm font-semibold text-grafite-700 dark:text-grafite-300 mb-2">
              Categoria
            </label>
            <select
              value={newProposal.category}
              onChange={(e) => setNewProposal({ ...newProposal, category: e.target.value as any })}
              className="w-full px-4 py-3 border-2 border-grafite-200 dark:border-grafite-600 rounded-xl bg-white dark:bg-grafite-700 text-grafite-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
            >
              <option value="project">Projetos</option>
              <option value="platform">Plataforma</option>
              <option value="treasury">Treasury</option>
              <option value="governance">Governança</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-grafite-700 dark:text-grafite-300 mb-2">
              Descrição
            </label>
            <textarea
              value={newProposal.description}
              onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
              placeholder="Descreva detalhadamente sua proposta..."
              rows={6}
              className="w-full px-4 py-3 border-2 border-grafite-200 dark:border-grafite-600 rounded-xl bg-white dark:bg-grafite-700 text-grafite-900 dark:text-white placeholder-grafite-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 resize-none"
              required
            />
          </div>

          <Input
            label="Stake Necessário (LUNES)"
            type="number"
            value={newProposal.requiredStake.toString()}
            onChange={(e) => setNewProposal({ ...newProposal, requiredStake: parseInt(e.target.value) || 0 })}
            placeholder="10000"
            min="1000"
            step="1000"
            leftIcon={<Coins className="w-4 h-4 text-primary-500" />}
            helperText="Quantidade mínima de LUNES que os votantes precisam ter em stake para votar nesta proposta."
            required
          />

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                  Importante
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Sua proposta será revisada pela comunidade antes de ser colocada em votação. 
                  Certifique-se de fornecer informações claras e detalhadas.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={handleCloseModal}
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Criar Proposta
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GovernancePage;