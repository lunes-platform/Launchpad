import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Coins, 
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Download,
  Target,
  Shield
} from 'lucide-react'

// Mock data - em produção viria de uma API
const mockInvestment = {
  id: 'defi-protocol-investment',
  projectId: 'defi-protocol',
  projectName: 'DeFi Protocol',
  projectLogo: '🔷',
  totalInvested: 2500, // USDT
  phase: 'whitelist',
  investmentDate: '2024-01-15',
  tokenSymbol: 'DFP',
  tokenPrice: 0.08,
  tokensAllocated: 31250,
  tokensReceived: 6250, // 20% já liberados
  vestingSchedule: [
    { date: '2024-02-15', percentage: 20, amount: 6250, status: 'released' },
    { date: '2024-03-15', percentage: 20, amount: 6250, status: 'pending' },
    { date: '2024-04-15', percentage: 20, amount: 6250, status: 'pending' },
    { date: '2024-05-15', percentage: 20, amount: 6250, status: 'pending' },
    { date: '2024-06-15', percentage: 20, amount: 6250, status: 'pending' }
  ],
  currentPrice: 0.15, // Preço atual no mercado
  roi: 87.5, // ROI atual
  status: 'active',
  transactionHash: '0x1234567890abcdef...',
  documents: [
    { name: 'Comprovante de Investimento', type: 'pdf', url: '#' },
    { name: 'Contrato de Vesting', type: 'pdf', url: '#' }
  ]
}

export function InvestmentDetailsPage() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('overview')

  // Em produção, carregaria os dados baseado no ID
  const investment = mockInvestment

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'released': return 'text-success'
      case 'pending': return 'text-warning'
      case 'active': return 'text-info'
      default: return 'text-slate-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'released': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link 
            to="/dashboard/meus-investimentos" 
            className="btn-ghost p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{investment.projectLogo}</span>
            <div>
              <h1 className="heading-3">{investment.projectName}</h1>
              <p className="text-slate-200">Investimento realizado em {formatDate(investment.investmentDate)}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center space-x-3 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-slate-200">Total Investido</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(investment.totalInvested)}</p>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-2">
              <Coins className="w-5 h-5 text-warning" />
              <span className="text-slate-200">Tokens Alocados</span>
            </div>
            <p className="text-2xl font-bold">{investment.tokensAllocated.toLocaleString()} {investment.tokenSymbol}</p>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-slate-200">Tokens Recebidos</span>
            </div>
            <p className="text-2xl font-bold">{investment.tokensReceived.toLocaleString()} {investment.tokenSymbol}</p>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-5 h-5 text-info" />
              <span className="text-slate-200">ROI Atual</span>
            </div>
            <p className={`text-2xl font-bold ${investment.roi > 0 ? 'text-success' : 'text-error'}`}>
              {investment.roi > 0 ? '+' : ''}{investment.roi}%
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="card mb-8">
          <div className="flex border-b border-slate-600 mb-6">
            {[
              { id: 'overview', label: 'Visão Geral' },
              { id: 'vesting', label: 'Cronograma de Vesting' },
              { id: 'documents', label: 'Documentos' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="heading-5 mb-4">Detalhes do Investimento</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-200">Fase de Participação:</span>
                      <span className="badge-primary capitalize">{investment.phase}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-200">Preço de Compra:</span>
                      <span className="font-medium">{formatCurrency(investment.tokenPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-200">Preço Atual:</span>
                      <span className="font-medium">{formatCurrency(investment.currentPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-200">Status:</span>
                      <span className={`flex items-center space-x-1 ${getStatusColor(investment.status)}`}>
                        {getStatusIcon(investment.status)}
                        <span className="capitalize">{investment.status}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="heading-5 mb-4">Progresso do Vesting</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>20% / 100%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                    <div className="text-sm text-slate-200">
                      Próxima liberação: {formatDate('2024-03-15')}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="heading-5 mb-4">Valor do Investimento</h3>
                <div className="bg-slate-800/50 rounded-card p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-slate-200 text-sm">Valor Investido</p>
                      <p className="text-lg font-semibold">{formatCurrency(investment.totalInvested)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-200 text-sm">Valor Atual</p>
                      <p className="text-lg font-semibold text-success">
                        {formatCurrency(investment.tokensAllocated * investment.currentPrice)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-200 text-sm">Lucro/Prejuízo</p>
                      <p className={`text-lg font-semibold ${investment.roi > 0 ? 'text-success' : 'text-error'}`}>
                        {formatCurrency((investment.tokensAllocated * investment.currentPrice) - investment.totalInvested)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vesting' && (
            <div>
              <h3 className="heading-5 mb-4">Cronograma de Liberação</h3>
              <div className="space-y-4">
                {investment.vestingSchedule.map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-card">
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center space-x-2 ${getStatusColor(schedule.status)}`}>
                        {getStatusIcon(schedule.status)}
                        <span className="font-medium">{formatDate(schedule.date)}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">{schedule.amount.toLocaleString()} {investment.tokenSymbol}</p>
                      <p className="text-sm text-slate-200">{schedule.percentage}% do total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <h3 className="heading-5 mb-4">Documentos Relacionados</h3>
              <div className="space-y-3">
                {investment.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-card">
                    <div className="flex items-center space-x-3">
                      <Download className="w-5 h-5 text-primary" />
                      <span className="font-medium">{doc.name}</span>
                    </div>
                    <a href={doc.url} className="btn-outline btn-sm">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar
                    </a>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-slate-800/50 rounded-card">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-success mt-1" />
                  <div>
                    <h4 className="font-semibold text-success mb-1">Transação Verificada</h4>
                    <p className="text-slate-200 text-sm mb-2">
                      Seu investimento foi confirmado na blockchain
                    </p>
                    <a 
                      href={`https://polkadot.js.org/apps/#/explorer/query/${investment.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary text-sm hover:underline"
                    >
                      Ver na Blockchain
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/dashboard/tokens-a-reivindicar" className="btn-primary">
            <Coins className="w-4 h-4 mr-2" />
            Reivindicar Tokens Disponíveis
          </Link>
          <Link to={`/projetos/${investment.projectId}`} className="btn-outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver Página do Projeto
          </Link>
        </div>
      </div>
    </div>
  )
}
