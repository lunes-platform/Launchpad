import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Search,
  ChevronRight,
  ExternalLink,
  Download,
  Play,
  FileText,
  Code,
  Lightbulb,
  Shield,
  Zap,
  Users,
  DollarSign,
  Target,
  Gift,
  Safe,
  CreditCard,
  Share2,
  Settings,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'

// Documentation interfaces
interface DocSection {
  id: string
  title: string
  description: string
  icon: any
  articles: DocArticle[]
}

interface DocArticle {
  id: string
  title: string
  description: string
  readTime: string
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado'
  tags: string[]
  content?: string
}

// Mock documentation data
const docSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Primeiros Passos',
    description: 'Aprenda o básico para começar a usar a plataforma',
    icon: Play,
    articles: [
      {
        id: 'what-is-launchpad',
        title: 'O que é o Launchpad Lunes?',
        description: 'Introdução completa à plataforma e seus recursos',
        readTime: '5 min',
        difficulty: 'Iniciante',
        tags: ['introdução', 'básico']
      },
      {
        id: 'connect-wallet',
        title: 'Como Conectar sua Carteira',
        description: 'Guia passo a passo para conectar carteiras Web3',
        readTime: '3 min',
        difficulty: 'Iniciante',
        tags: ['carteira', 'web3', 'setup']
      },
      {
        id: 'first-investment',
        title: 'Fazendo seu Primeiro Investimento',
        description: 'Tutorial completo para investir em projetos',
        readTime: '8 min',
        difficulty: 'Iniciante',
        tags: ['investimento', 'tutorial']
      }
    ]
  },
  {
    id: 'investments',
    title: 'Investimentos',
    description: 'Tudo sobre como investir em projetos na plataforma',
    icon: Target,
    articles: [
      {
        id: 'project-phases',
        title: 'Fases dos Projetos',
        description: 'Entenda as diferentes fases: Whitelist, Pré-venda, Venda Pública',
        readTime: '6 min',
        difficulty: 'Intermediário',
        tags: ['fases', 'projetos', 'cronograma']
      },
      {
        id: 'investment-strategies',
        title: 'Estratégias de Investimento',
        description: 'Dicas e estratégias para maximizar seus retornos',
        readTime: '12 min',
        difficulty: 'Avançado',
        tags: ['estratégia', 'dicas', 'retorno']
      },
      {
        id: 'risk-management',
        title: 'Gestão de Riscos',
        description: 'Como gerenciar riscos em investimentos cripto',
        readTime: '10 min',
        difficulty: 'Intermediário',
        tags: ['risco', 'gestão', 'segurança']
      }
    ]
  },
  {
    id: 'launchpool',
    title: 'Launchpool',
    description: 'Sistema de staking para ganhar tokens de projetos',
    icon: Zap,
    articles: [
      {
        id: 'how-launchpool-works',
        title: 'Como Funciona o Launchpool',
        description: 'Entenda o sistema de staking e recompensas',
        readTime: '7 min',
        difficulty: 'Iniciante',
        tags: ['launchpool', 'staking', 'recompensas']
      },
      {
        id: 'staking-strategies',
        title: 'Estratégias de Staking',
        description: 'Maximize seus ganhos no launchpool',
        readTime: '9 min',
        difficulty: 'Intermediário',
        tags: ['staking', 'estratégia', 'apy']
      }
    ]
  },
  {
    id: 'raffles',
    title: 'Sistema de Rifas',
    description: 'Participe de sorteios e ganhe tokens',
    icon: Gift,
    articles: [
      {
        id: 'raffle-basics',
        title: 'Como Participar das Rifas',
        description: 'Guia completo para comprar bilhetes e participar',
        readTime: '5 min',
        difficulty: 'Iniciante',
        tags: ['rifas', 'bilhetes', 'sorteios']
      },
      {
        id: 'raffle-odds',
        title: 'Entendendo as Probabilidades',
        description: 'Como calcular suas chances de ganhar',
        readTime: '6 min',
        difficulty: 'Intermediário',
        tags: ['probabilidade', 'chances', 'matemática']
      }
    ]
  },
  {
    id: 'treasury',
    title: 'Smart Fund Treasury',
    description: 'Transparência total dos ativos da plataforma',
    icon: Safe,
    articles: [
      {
        id: 'treasury-overview',
        title: 'Visão Geral do Treasury',
        description: 'Como funciona o fundo inteligente da plataforma',
        readTime: '8 min',
        difficulty: 'Intermediário',
        tags: ['treasury', 'fundo', 'gestão']
      },
      {
        id: 'airdrop-system',
        title: 'Sistema de Airdrops Automáticos',
        description: 'Como funcionam os airdrops de 40% dos tokens',
        readTime: '6 min',
        difficulty: 'Iniciante',
        tags: ['airdrop', 'distribuição', 'tokens']
      }
    ]
  },
  {
    id: 'payments',
    title: 'Pagamentos',
    description: 'Sistema multi-chain de depósitos e saques',
    icon: CreditCard,
    articles: [
      {
        id: 'supported-networks',
        title: 'Redes Suportadas',
        description: 'Lunes Network, Solana, TON e PIX brasileiro',
        readTime: '4 min',
        difficulty: 'Iniciante',
        tags: ['redes', 'blockchain', 'pagamentos']
      },
      {
        id: 'deposit-withdraw',
        title: 'Como Depositar e Sacar',
        description: 'Guia completo para movimentar fundos',
        readTime: '10 min',
        difficulty: 'Iniciante',
        tags: ['depósito', 'saque', 'tutorial']
      }
    ]
  },
  {
    id: 'affiliates',
    title: 'Programa de Afiliados',
    description: 'Ganhe comissões indicando novos usuários',
    icon: Share2,
    articles: [
      {
        id: 'affiliate-program',
        title: 'Como Funciona o Programa',
        description: 'Entenda os níveis e comissões do programa',
        readTime: '7 min',
        difficulty: 'Iniciante',
        tags: ['afiliados', 'comissões', 'indicação']
      },
      {
        id: 'marketing-tools',
        title: 'Ferramentas de Marketing',
        description: 'Materiais e estratégias para promover',
        readTime: '9 min',
        difficulty: 'Intermediário',
        tags: ['marketing', 'promoção', 'ferramentas']
      }
    ]
  },
  {
    id: 'security',
    title: 'Segurança',
    description: 'Práticas de segurança e proteção de ativos',
    icon: Shield,
    articles: [
      {
        id: 'wallet-security',
        title: 'Segurança da Carteira',
        description: 'Como proteger sua carteira e chaves privadas',
        readTime: '8 min',
        difficulty: 'Intermediário',
        tags: ['segurança', 'carteira', 'proteção']
      },
      {
        id: 'smart-contract-audits',
        title: 'Auditorias de Smart Contracts',
        description: 'Como verificamos a segurança dos contratos',
        readTime: '12 min',
        difficulty: 'Avançado',
        tags: ['auditoria', 'contratos', 'segurança']
      }
    ]
  },
  {
    id: 'api',
    title: 'API e Desenvolvimento',
    description: 'Documentação técnica para desenvolvedores',
    icon: Code,
    articles: [
      {
        id: 'api-overview',
        title: 'Visão Geral da API',
        description: 'Introdução à API REST da plataforma',
        readTime: '10 min',
        difficulty: 'Avançado',
        tags: ['api', 'desenvolvimento', 'rest']
      },
      {
        id: 'sdk-integration',
        title: 'Integração com SDK',
        description: 'Como integrar com o SDK JavaScript',
        readTime: '15 min',
        difficulty: 'Avançado',
        tags: ['sdk', 'javascript', 'integração']
      }
    ]
  }
]

const popularArticles = [
  'what-is-launchpad',
  'connect-wallet',
  'first-investment',
  'how-launchpool-works',
  'raffle-basics'
]

const recentUpdates = [
  {
    title: 'Nova documentação do sistema de pagamentos',
    date: '2024-02-15',
    type: 'new'
  },
  {
    title: 'Atualização do guia de segurança',
    date: '2024-02-10',
    type: 'update'
  },
  {
    title: 'Documentação da API v2.0',
    date: '2024-02-05',
    type: 'new'
  }
]

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<DocArticle | null>(null)

  // Filter sections and articles based on search
  const filteredSections = docSections.map(section => ({
    ...section,
    articles: section.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(section =>
    section.articles.length > 0 ||
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'bg-success/20 text-success'
      case 'Intermediário': return 'bg-warning/20 text-warning'
      case 'Avançado': return 'bg-error/20 text-error'
      default: return 'bg-textMuted/20 text-slate-400'
    }
  }

  const getUpdateTypeIcon = (type: string) => {
    switch (type) {
      case 'new': return <CheckCircle className="w-4 h-4 text-success" />
      case 'update': return <AlertTriangle className="w-4 h-4 text-warning" />
      default: return <Info className="w-4 h-4 text-info" />
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container-custom text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Centro de Conhecimento</span>
          </div>

          <h1 className="heading-1 mb-6">
            <BookOpen className="w-12 h-12 inline-block mr-4 text-primary" />
            <span className="text-gradient">Documentação</span>
          </h1>
          <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
            Aprenda tudo sobre o Launchpad Lunes. Guias, tutoriais e documentação técnica
            para aproveitar ao máximo a plataforma.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar na documentação..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-600Light rounded-card text-lg focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom section-padding">
        {!selectedArticle ? (
          <>
            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Popular Articles */}
              <div className="card">
                <h3 className="heading-4 mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-warning" />
                  Artigos Populares
                </h3>
                <div className="space-y-3">
                  {popularArticles.map(articleId => {
                    const article = docSections
                      .flatMap(section => section.articles)
                      .find(a => a.id === articleId)
                    if (!article) return null

                    return (
                      <button
                        key={article.id}
                        onClick={() => setSelectedArticle(article)}
                        className="w-full text-left p-3 bg-slate-800 hover:bg-slate-800Hover rounded-card transition-colors duration-200"
                      >
                        <p className="font-medium mb-1">{article.title}</p>
                        <p className="text-xs text-slate-200">{article.readTime} • {article.difficulty}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Recent Updates */}
              <div className="card">
                <h3 className="heading-4 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-success" />
                  Atualizações Recentes
                </h3>
                <div className="space-y-3">
                  {recentUpdates.map((update, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-slate-800 rounded-card">
                      {getUpdateTypeIcon(update.type)}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{update.title}</p>
                        <p className="text-xs text-slate-200">{update.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h3 className="heading-4 mb-4 flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-info" />
                  Precisa de Ajuda?
                </h3>
                <div className="space-y-3">
                  <Link to="/support" className="block p-3 bg-slate-800 hover:bg-slate-800Hover rounded-card transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Suporte Técnico</span>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-slate-200 mt-1">Fale com nossa equipe</p>
                  </Link>
                  <Link to="/community" className="block p-3 bg-slate-800 hover:bg-slate-800Hover rounded-card transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Comunidade</span>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-slate-200 mt-1">Discord e Telegram</p>
                  </Link>
                  <button className="w-full p-3 bg-slate-800 hover:bg-slate-800Hover rounded-card transition-colors duration-200 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Download PDF</span>
                      <Download className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-slate-200 mt-1">Guia completo offline</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Documentation Sections */}
            <div className="space-y-8">
              {filteredSections.map((section) => (
                <div key={section.id} className="card">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="heading-3">{section.title}</h2>
                      <p className="text-slate-200">{section.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.articles.map((article) => (
                      <button
                        key={article.id}
                        onClick={() => setSelectedArticle(article)}
                        className="text-left p-4 bg-slate-800 hover:bg-slate-800Hover border border-slate-600Light hover:border-primary/50 rounded-card transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-medium pr-2">{article.title}</h3>
                          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        </div>

                        <p className="text-sm text-slate-200 mb-3 line-clamp-2">
                          {article.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(article.difficulty)}`}>
                              {article.difficulty}
                            </span>
                            <span className="text-xs text-slate-400">{article.readTime}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-3">
                          {article.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs bg-slate-900 text-slate-400 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {searchQuery && filteredSections.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="heading-4 mb-2">Nenhum resultado encontrado</h3>
                <p className="text-slate-200 mb-6">
                  Tente buscar com termos diferentes ou navegue pelas categorias.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn-outline"
                >
                  Limpar Busca
                </button>
              </div>
            )}
          </>
        ) : (
          /* Article View */
          <div className="max-w-4xl mx-auto">
            {/* Article Header */}
            <div className="mb-8">
              <button
                onClick={() => setSelectedArticle(null)}
                className="flex items-center text-primary hover:text-primaryLight mb-4"
              >
                <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                Voltar à documentação
              </button>

              <div className="flex items-center space-x-3 mb-4">
                <span className={`text-xs px-3 py-1 rounded-full ${getDifficultyColor(selectedArticle.difficulty)}`}>
                  {selectedArticle.difficulty}
                </span>
                <span className="text-sm text-slate-200">{selectedArticle.readTime} de leitura</span>
              </div>

              <h1 className="heading-1 mb-4">{selectedArticle.title}</h1>
              <p className="text-xl text-slate-200 mb-6">{selectedArticle.description}</p>

              <div className="flex flex-wrap gap-2">
                {selectedArticle.tags.map((tag) => (
                  <span key={tag} className="text-sm bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Article Content */}
            <div className="card">
              <div className="prose prose-invert max-w-none">
                {selectedArticle.id === 'what-is-launchpad' && (
                  <div className="space-y-6">
                    <h2>O que é o Launchpad Lunes?</h2>
                    <p>
                      O Launchpad Lunes é uma plataforma completa de lançamento de projetos blockchain que oferece
                      múltiplas formas de participação e investimento em projetos inovadores.
                    </p>

                    <h3>Principais Recursos</h3>
                    <ul>
                      <li><strong>Investimentos em Projetos:</strong> Participe de pré-vendas e vendas públicas</li>
                      <li><strong>Launchpool:</strong> Faça staking de LUNES e ganhe tokens de projetos</li>
                      <li><strong>Sistema de Rifas:</strong> Participe de sorteios diários garantidos</li>
                      <li><strong>Smart Fund Treasury:</strong> Transparência total dos ativos da plataforma</li>
                      <li><strong>Programa de Afiliados:</strong> Ganhe comissões indicando novos usuários</li>
                    </ul>

                    <h3>Como Funciona</h3>
                    <p>
                      A plataforma opera em múltiplas fases para cada projeto, garantindo acesso justo e
                      oportunidades para diferentes tipos de investidores.
                    </p>

                    <div className="bg-info/10 border border-info/20 rounded-card p-4">
                      <h4 className="text-info mb-2">💡 Dica Importante</h4>
                      <p className="text-sm">
                        Sempre conecte sua carteira Web3 antes de participar de qualquer atividade na plataforma.
                        Recomendamos o uso do SubWallet ou Polkadot.js.
                      </p>
                    </div>
                  </div>
                )}

                {selectedArticle.id === 'connect-wallet' && (
                  <div className="space-y-6">
                    <h2>Como Conectar sua Carteira</h2>
                    <p>
                      Para usar o Launchpad Lunes, você precisa conectar uma carteira Web3 compatível.
                      Suportamos as principais carteiras do ecossistema Polkadot.
                    </p>

                    <h3>Carteiras Suportadas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-800 border border-slate-600Light rounded-card p-4">
                        <h4>🔷 SubWallet</h4>
                        <p className="text-sm text-slate-200">Carteira recomendada com suporte completo</p>
                      </div>
                      <div className="bg-slate-800 border border-slate-600Light rounded-card p-4">
                        <h4>🟠 Polkadot.js</h4>
                        <p className="text-sm text-slate-200">Carteira oficial do ecossistema Polkadot</p>
                      </div>
                    </div>

                    <h3>Passo a Passo</h3>
                    <ol>
                      <li>Instale uma das carteiras suportadas</li>
                      <li>Crie ou importe sua conta</li>
                      <li>Clique em "Conectar Carteira" no site</li>
                      <li>Selecione sua carteira preferida</li>
                      <li>Autorize a conexão</li>
                    </ol>

                    <div className="bg-warning/10 border border-warning/20 rounded-card p-4">
                      <h4 className="text-warning mb-2">⚠️ Segurança</h4>
                      <p className="text-sm">
                        Nunca compartilhe sua seed phrase ou chaves privadas. A equipe do Launchpad Lunes
                        nunca solicitará essas informações.
                      </p>
                    </div>
                  </div>
                )}

                {/* Default content for other articles */}
                {!['what-is-launchpad', 'connect-wallet'].includes(selectedArticle.id) && (
                  <div className="space-y-6">
                    <h2>{selectedArticle.title}</h2>
                    <p>{selectedArticle.description}</p>

                    <div className="bg-info/10 border border-info/20 rounded-card p-4">
                      <h4 className="text-info mb-2">📝 Em Desenvolvimento</h4>
                      <p className="text-sm">
                        Este artigo está sendo desenvolvido. Em breve teremos o conteúdo completo disponível.
                      </p>
                    </div>

                    <h3>Tópicos que serão abordados:</h3>
                    <ul>
                      {selectedArticle.tags.map(tag => (
                        <li key={tag}>{tag.charAt(0).toUpperCase() + tag.slice(1)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Article Navigation */}
            <div className="flex justify-between items-center mt-8 pt-8 border-t border-slate-600Light">
              <button className="btn-outline">
                <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                Artigo Anterior
              </button>
              <button className="btn-outline">
                Próximo Artigo
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
