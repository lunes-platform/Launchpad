import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import {
  Vote,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
  AlertCircle,
  Calendar,
  Target,
  Shield,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from 'lucide-react'
import { formatTokenAmount, formatPercentage, formatDate, formatTimeRemaining } from '@/lib/utils'
import toast from 'react-hot-toast'

// Mock data
const activeProposals = [
  {
    id: 'prop-001',
    title: 'Redução da Taxa de Plataforma para 2%',
    description: 'Proposta para reduzir a taxa da plataforma de 2.5% para 2% para aumentar a competitividade',
    category: 'Economia',
    proposer: 'Comunidade LUNES',
    proposerReputation: 4.8,
    createdDate: new Date('2024-01-20'),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: 'active',
    votesFor: 1250000,
    votesAgainst: 350000,
    totalVotes: 1600000,
    quorum: 2000000,
    tier: 'S',
    impact: 'high',
    comments: 47
  },
  {
    id: 'prop-002',
    title: 'Implementação de Staking Rewards para Governança',
    description: 'Adicionar recompensas de staking para usuários que participam ativamente da governança',
    category: 'Governança',
    proposer: 'Core Team',
    proposerReputation: 5.0,
    createdDate: new Date('2024-01-22'),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'active',
    votesFor: 890000,
    votesAgainst: 120000,
    totalVotes: 1010000,
    quorum: 1500000,
    tier: 'A',
    impact: 'medium',
    comments: 23
  },
  {
    id: 'prop-003',
    title: 'Adição de Nova Blockchain: Ethereum',
    description: 'Expandir a plataforma para suportar projetos na rede Ethereum',
    category: 'Tecnologia',
    proposer: 'Dev Community',
    proposerReputation: 4.5,
    createdDate: new Date('2024-01-25'),
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: 'active',
    votesFor: 2100000,
    votesAgainst: 450000,
    totalVotes: 2550000,
    quorum: 3000000,
    tier: 'S',
    impact: 'high',
    comments: 89
  }
]

const completedProposals = [
  {
    id: 'prop-comp-001',
    title: 'Implementação do Sistema de Rifas',
    description: 'Adicionar sistema de rifas com sorteios diários garantidos',
    category: 'Produto',
    proposer: 'Comunidade LUNES',
    proposerReputation: 4.7,
    createdDate: new Date('2024-01-10'),
    endDate: new Date('2024-01-17'),
    status: 'approved',
    votesFor: 1800000,
    votesAgainst: 200000,
    totalVotes: 2000000,
    quorum: 1500000,
    tier: 'A',
    impact: 'medium',
    result: 'Implementado com sucesso'
  },
  {
    id: 'prop-comp-002',
    title: 'Aumento do Limite de Investimento para $50k',
    description: 'Aumentar limite máximo de investimento por usuário de $25k para $50k',
    category: 'Economia',
    proposer: 'Whale Investors',
    proposerReputation: 4.2,
    createdDate: new Date('2024-01-05'),
    endDate: new Date('2024-01-12'),
    status: 'rejected',
    votesFor: 600000,
    votesAgainst: 1400000,
    totalVotes: 2000000,
    quorum: 1500000,
    tier: 'B',
    impact: 'low',
    result: 'Rejeitado pela comunidade'
  }
]

const userVotingPower = {
  totalStaked: 50000,
  reputation: 4.2,
  multiplier: 2.1,
  effectivePower: 105000,
  rank: 'Gold Voter',
  participationRate: 85
}

const governanceStats = {
  totalProposals: 47,
  activeProposals: 3,
  approvedProposals: 32,
  rejectedProposals: 12,
  totalVoters: 8420,
  totalVotingPower: 25000000,
  averageParticipation: 68
}

function GovernanceOverview() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [votingProposal, setVotingProposal] = useState<string | null>(null)

  const categories = [
    { id: 'all', label: 'Todas', count: activeProposals.length },
    { id: 'Economia', label: 'Economia', count: activeProposals.filter(p => p.category === 'Economia').length },
    { id: 'Governança', label: 'Governança', count: activeProposals.filter(p => p.category === 'Governança').length },
    { id: 'Tecnologia', label: 'Tecnologia', count: activeProposals.filter(p => p.category === 'Tecnologia').length },
    { id: 'Produto', label: 'Produto', count: activeProposals.filter(p => p.category === 'Produto').length }
  ]

  const filteredProposals = selectedCategory === 'all'
    ? activeProposals
    : activeProposals.filter(p => p.category === selectedCategory)

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'S': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
      case 'A': return 'bg-gradient-to-r from-primary to-primaryLight text-white'
      case 'B': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
      case 'C': return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
      default: return 'bg-textMuted text-white'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-error'
      case 'medium': return 'text-warning'
      case 'low': return 'text-success'
      default: return 'text-slate-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-primary/20 text-primary border-primary/30'
      case 'approved': return 'bg-success/20 text-success border-success/30'
      case 'rejected': return 'bg-error/20 text-error border-error/30'
      default: return 'bg-textMuted/20 text-slate-400 border-textMuted/30'
    }
  }

  const handleVote = async (proposalId: string, vote: 'for' | 'against') => {
    setVotingProposal(proposalId)

    try {
      // Mock voting process
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast.success(`Voto ${vote === 'for' ? 'a favor' : 'contra'} registrado com sucesso!`)
    } catch (error) {
      toast.error('Erro ao registrar voto')
    } finally {
      setVotingProposal(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <section className="bg-slate-800/50 border-b border-slate-600">
        <div className="container-custom py-12">
          <div className="text-center mb-8">
            <h1 className="heading-2 mb-4">
              Sistema de <span className="text-gradient">Governança</span>
            </h1>
            <p className="text-slate-200 text-lg max-w-2xl mx-auto">
              Participe das decisões importantes da plataforma através do sistema de governança descentralizada.
              Seu voto importa e molda o futuro do Launchpad Lunes.
            </p>
          </div>

          {/* User Voting Power */}
          <div className="max-w-4xl mx-auto">
            <div className="card bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h3 className="heading-4 mb-2">Seu Poder de Voto</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-200">
                    <span>{formatTokenAmount(userVotingPower.totalStaked, 'LUNES')} em stake</span>
                    <span>•</span>
                    <span>Reputação: {userVotingPower.reputation}/5.0</span>
                    <span>•</span>
                    <span>Multiplicador: {userVotingPower.multiplier}x</span>
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <p className="text-3xl font-bold text-primary mb-1">
                    {formatTokenAmount(userVotingPower.effectivePower, '')}
                  </p>
                  <p className="text-sm text-slate-200">Poder Efetivo</p>
                  <span className="inline-block bg-primary/20 text-primary text-xs px-2 py-1 rounded-full mt-2">
                    {userVotingPower.rank}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Vote className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-slate-400">Ativas</span>
            </div>
            <p className="text-2xl font-bold mb-1">{governanceStats.activeProposals}</p>
            <p className="text-sm text-slate-200">Propostas Ativas</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <span className="text-xs text-success">Aprovadas</span>
            </div>
            <p className="text-2xl font-bold mb-1">{governanceStats.approvedProposals}</p>
            <p className="text-sm text-slate-200">Propostas Aprovadas</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-info" />
              </div>
              <span className="text-xs text-slate-400">Total</span>
            </div>
            <p className="text-2xl font-bold mb-1">{governanceStats.totalVoters.toLocaleString()}</p>
            <p className="text-sm text-slate-200">Votantes Ativos</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-warning" />
              </div>
              <span className="text-xs text-warning">{formatPercentage(governanceStats.averageParticipation)}</span>
            </div>
            <p className="text-2xl font-bold mb-1">
              {formatTokenAmount(governanceStats.totalVotingPower, '')}
            </p>
            <p className="text-sm text-slate-200">Poder Total</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="card mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-button font-medium transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Active Proposals */}
        <div className="space-y-6 mb-12">
          <h2 className="heading-3">Propostas Ativas</h2>

          {filteredProposals.map((proposal) => {
            const approvalRate = (proposal.votesFor / proposal.totalVotes) * 100
            const quorumProgress = (proposal.totalVotes / proposal.quorum) * 100

            return (
              <div key={proposal.id} className="card">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="heading-4">{proposal.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTierColor(proposal.tier)}`}>
                            Tier {proposal.tier}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(proposal.status)}`}>
                            ATIVA
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-slate-200 mb-3">
                          <span>Categoria: {proposal.category}</span>
                          <span>•</span>
                          <span>Proposto por: {proposal.proposer}</span>
                          <span>•</span>
                          <span className={getImpactColor(proposal.impact)}>
                            Impacto: {proposal.impact === 'high' ? 'Alto' : proposal.impact === 'medium' ? 'Médio' : 'Baixo'}
                          </span>
                          <span>•</span>
                          <span>Termina em {formatTimeRemaining(proposal.endDate)}</span>
                        </div>

                        <p className="text-slate-200 mb-4">{proposal.description}</p>

                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4 text-slate-400" />
                            <span>{proposal.comments} comentários</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="w-4 h-4 text-warning" />
                            <span>Rep: {proposal.proposerReputation}/5.0</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Voting Progress */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Aprovação: {formatPercentage(approvalRate)}</span>
                          <span>{formatTokenAmount(proposal.totalVotes, '')} / {formatTokenAmount(proposal.quorum, '')} votos</span>
                        </div>
                                                      <div className="w-full bg-slate-700 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-success to-primary h-3 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(approvalRate, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Quórum: {formatPercentage(quorumProgress)}</span>
                          <span className={quorumProgress >= 100 ? 'text-success' : 'text-warning'}>
                            {quorumProgress >= 100 ? 'Atingido' : 'Pendente'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              quorumProgress >= 100 ? 'bg-success' : 'bg-warning'
                            }`}
                            style={{ width: `${Math.min(quorumProgress, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Voting Section */}
                  <div className="lg:w-80">
                    <div className="bg-slate-800 border border-slate-600 rounded-card p-6">
                      <h4 className="font-medium mb-4">Votar nesta Proposta</h4>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="text-center p-3 bg-success/10 border border-success/20 rounded-button">
                          <p className="text-2xl font-bold text-success">
                            {formatTokenAmount(proposal.votesFor, '')}
                          </p>
                          <p className="text-xs text-slate-200">A Favor</p>
                        </div>

                        <div className="text-center p-3 bg-error/10 border border-error/20 rounded-button">
                          <p className="text-2xl font-bold text-error">
                            {formatTokenAmount(proposal.votesAgainst, '')}
                          </p>
                          <p className="text-xs text-slate-200">Contra</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleVote(proposal.id, 'for')}
                          disabled={votingProposal === proposal.id}
                          className="btn-success disabled:opacity-50"
                        >
                          {votingProposal === proposal.id ? (
                            'Votando...'
                          ) : (
                            <>
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              A Favor
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleVote(proposal.id, 'against')}
                          disabled={votingProposal === proposal.id}
                          className="btn-error disabled:opacity-50"
                        >
                          {votingProposal === proposal.id ? (
                            'Votando...'
                          ) : (
                            <>
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              Contra
                            </>
                          )}
                        </button>
                      </div>

                      <div className="mt-4 p-3 bg-info/10 border border-info/20 rounded-button">
                        <p className="text-xs text-info">
                          Seu voto: {formatTokenAmount(userVotingPower.effectivePower, '')} poder
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Completed Proposals */}
        <div className="space-y-6">
          <h2 className="heading-3">Propostas Concluídas</h2>

          {completedProposals.map((proposal) => {
            const approvalRate = (proposal.votesFor / proposal.totalVotes) * 100

            return (
              <div key={proposal.id} className="card opacity-75">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="heading-4">{proposal.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTierColor(proposal.tier)}`}>
                        Tier {proposal.tier}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getStatusColor(proposal.status)}`}>
                        {proposal.status === 'approved' ? 'APROVADA' : 'REJEITADA'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-slate-200 mb-3">
                      <span>Categoria: {proposal.category}</span>
                      <span>•</span>
                      <span>Finalizada em {formatDate(proposal.endDate)}</span>
                      <span>•</span>
                      <span className={proposal.status === 'approved' ? 'text-success' : 'text-error'}>
                        {proposal.result}
                      </span>
                    </div>

                    <p className="text-slate-200 mb-4">{proposal.description}</p>
                  </div>

                  <div className="lg:w-80">
                    <div className="bg-slate-800 border border-slate-600 rounded-card p-6">
                      <h4 className="font-medium mb-4">Resultado Final</h4>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="text-center p-3 bg-success/10 border border-success/20 rounded-button">
                          <p className="text-xl font-bold text-success">
                            {formatTokenAmount(proposal.votesFor, '')}
                          </p>
                          <p className="text-xs text-slate-200">A Favor</p>
                        </div>

                        <div className="text-center p-3 bg-error/10 border border-error/20 rounded-button">
                          <p className="text-xl font-bold text-error">
                            {formatTokenAmount(proposal.votesAgainst, '')}
                          </p>
                          <p className="text-xs text-slate-200">Contra</p>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-slate-200 mb-1">Taxa de Aprovação</p>
                        <p className={`text-2xl font-bold ${proposal.status === 'approved' ? 'text-success' : 'text-error'}`}>
                          {formatPercentage(approvalRate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* How Governance Works */}
        <div className="mt-16">
          <div className="card bg-info/10 border-info/20">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-info mb-2">Como Funciona a Governança</h4>
                <ul className="text-sm text-slate-200 space-y-1">
                  <li>• <strong>Poder de Voto:</strong> Baseado em tokens LUNES em stake + reputação</li>
                  <li>• <strong>Quórum:</strong> Mínimo de votos necessários para validar uma proposta</li>
                  <li>• <strong>Período de Votação:</strong> 7 dias para cada proposta</li>
                  <li>• <strong>Implementação:</strong> Propostas aprovadas são implementadas em 30 dias</li>
                  <li>• <strong>Reputação:</strong> Aumenta com participação ativa e votos alinhados</li>
                  <li>• <strong>Recompensas:</strong> Votantes ativos recebem recompensas em LUNES</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GovernancePage() {
  return (
    <Routes>
      <Route path="/" element={<GovernanceOverview />} />
      <Route path="/*" element={<GovernanceOverview />} />
    </Routes>
  )
}
