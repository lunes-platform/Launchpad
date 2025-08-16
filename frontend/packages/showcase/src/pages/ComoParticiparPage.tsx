import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, 
  Wallet, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Gift, 
  CheckCircle,
  AlertCircle,
  Play,
  Download,
  ExternalLink,
  Clock,
  Target,
  Shield
} from 'lucide-react'

const steps = [
  {
    id: 1,
    title: 'Conecte sua Carteira',
    description: 'Conecte uma carteira compatível com Polkadot para começar',
    icon: Wallet,
    color: 'primary',
    details: [
      'Baixe SubWallet ou Polkadot.js Extension',
      'Crie ou importe sua carteira',
      'Conecte à Lunes Network',
      'Verifique se possui LUNES para taxas'
    ],
    tips: [
      'SubWallet é recomendado para iniciantes',
      'Sempre verifique o endereço antes de conectar',
      'Mantenha sua seed phrase segura'
    ]
  },
  {
    id: 2,
    title: 'Escolha um Projeto',
    description: 'Explore projetos disponíveis e encontre oportunidades',
    icon: Target,
    color: 'success',
    details: [
      'Navegue pela lista de projetos',
      'Analise o tier e avaliação',
      'Leia a documentação do projeto',
      'Verifique as fases disponíveis'
    ],
    tips: [
      'Projetos Tier S têm maior potencial',
      'Diversifique seus investimentos',
      'Participe de AMAs para conhecer a equipe'
    ]
  },
  {
    id: 3,
    title: 'Participe das Fases',
    description: 'Cada projeto oferece diferentes formas de participação',
    icon: Users,
    color: 'info',
    details: [
      'Whitelist: Aplicação para acesso VIP',
      'Pré-Venda: Desconto para early adopters',
      'Venda Pública: Acesso aberto',
      'Launchpool: Staking para ganhar tokens',
      'Rifas: Sorteios com prêmios garantidos'
    ],
    tips: [
      'Whitelist oferece maiores descontos',
      'Launchpool não requer investimento',
      'Rifas têm sorteios diários garantidos'
    ]
  },
  {
    id: 4,
    title: 'Gerencie seus Investimentos',
    description: 'Acompanhe e reivindique seus tokens',
    icon: TrendingUp,
    color: 'warning',
    details: [
      'Monitore performance no dashboard',
      'Acompanhe cronograma de vesting',
      'Reivindique tokens liberados',
      'Receba airdrops automáticos'
    ],
    tips: [
      'Configure notificações de vesting',
      'Reivindique tokens dentro do prazo',
      'Participe da governança dos projetos'
    ]
  }
]

const phases = [
  {
    name: 'Whitelist',
    description: 'Acesso VIP com grandes descontos',
    discount: '40-60%',
    requirements: ['Aplicação aprovada', 'Critérios específicos'],
    duration: '6-12 meses vesting',
    icon: '🎯',
    color: 'primary'
  },
  {
    name: 'Pré-Venda',
    description: 'Early birds da comunidade',
    discount: '15-25%',
    requirements: ['Membro da comunidade', 'Sem KYC'],
    duration: '3-6 meses vesting',
    icon: '🚀',
    color: 'success'
  },
  {
    name: 'Venda Pública',
    description: 'Aberto para todos',
    discount: '0%',
    requirements: ['Nenhum requisito especial'],
    duration: 'Vesting mínimo',
    icon: '🌍',
    color: 'info'
  },
  {
    name: 'Launchpool',
    description: 'Staking para ganhar tokens',
    discount: 'Sem compra',
    requirements: ['Tokens LUNES para stake'],
    duration: '14-30 dias',
    icon: '⚡',
    color: 'warning'
  },
  {
    name: 'Rifas',
    description: 'Sorteios diários garantidos',
    discount: 'Prêmios fixos',
    requirements: ['Bilhetes a partir de $0.50'],
    duration: '7 dias por ciclo',
    icon: '🎲',
    color: 'accent'
  }
]

const faqs = [
  {
    question: 'Preciso fazer KYC para participar?',
    answer: 'KYC é necessário apenas para investimentos acima de $10,000. Para valores menores, apenas conectar a carteira é suficiente.'
  },
  {
    question: 'Quais carteiras são suportadas?',
    answer: 'Suportamos SubWallet e Polkadot.js Extension. SubWallet é recomendado para iniciantes por sua interface amigável.'
  },
  {
    question: 'Como funciona o vesting?',
    answer: 'Tokens são liberados gradualmente conforme cronograma. Você pode acompanhar e reivindicar no dashboard quando disponíveis.'
  },
  {
    question: 'Posso participar de múltiplas fases?',
    answer: 'Sim! Você pode participar de diferentes fases do mesmo projeto ou de projetos diferentes simultaneamente.'
  },
  {
    question: 'O que acontece se eu perder um sorteio?',
    answer: 'Rifas têm sorteios diários garantidos. Se não ganhar hoje, pode tentar novamente amanhã com novos bilhetes.'
  },
  {
    question: 'Como recebo airdrops?',
    answer: 'Airdrops são distribuídos automaticamente para participantes elegíveis. Você será notificado quando houver tokens para reivindicar.'
  }
]

export default function ComoParticiparPage() {
  const [activeStep, setActiveStep] = useState(1)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="section-padding bg-slate-800/30">
        <div className="container-custom text-center">
          <h1 className="heading-1 mb-6">
            Como <span className="text-gradient">Participar</span>
          </h1>
          <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
            Guia completo para participar de lançamentos de tokens na plataforma Launchpad Lunes.
            Desde conectar sua carteira até gerenciar seus investimentos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/projetos" className="btn-primary">
              <Target className="w-4 h-4 mr-2" />
              Ver Projetos Disponíveis
            </Link>
            <a href="#guia-passo-a-passo" className="btn-outline">
              <Play className="w-4 h-4 mr-2" />
              Começar Guia
            </a>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">100%</h3>
              <p className="text-slate-200">Seguro e Auditado</p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-2xl font-bold mb-2">5</h3>
              <p className="text-slate-200">Formas de Participar</p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-2xl font-bold mb-2">24/7</h3>
              <p className="text-slate-200">Suporte Disponível</p>
            </div>
            
            <div className="card text-center">
              <div className="w-12 h-12 bg-info/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-6 h-6 text-info" />
              </div>
              <h3 className="text-2xl font-bold mb-2">∞</h3>
              <p className="text-slate-200">Airdrops Automáticos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step Guide */}
      <section id="guia-passo-a-passo" className="section-padding bg-slate-800/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              Guia <span className="text-gradient">Passo a Passo</span>
            </h2>
            <p className="text-slate-200 text-lg max-w-2xl mx-auto">
              Siga estes 4 passos simples para começar a participar de lançamentos de tokens
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Step Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-button transition-all duration-200 ${
                    activeStep === step.id
                      ? 'bg-primary text-white'
                      : 'bg-slate-800 hover:bg-slate-800Hover border border-slate-600Light'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    activeStep === step.id ? 'bg-white text-primary' : 'bg-primary/20 text-primary'
                  }`}>
                    {step.id}
                  </span>
                  <span className="font-medium">{step.title}</span>
                </button>
              ))}
            </div>

            {/* Step Content */}
            {steps.map((step) => (
              <div
                key={step.id}
                className={`${activeStep === step.id ? 'block' : 'hidden'}`}
              >
                <div className="card">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center space-x-4 mb-6">
                        <div className={`w-16 h-16 bg-${step.color}/20 rounded-full flex items-center justify-center`}>
                          <step.icon className={`w-8 h-8 text-${step.color}`} />
                        </div>
                        <div>
                          <h3 className="heading-3">{step.title}</h3>
                          <p className="text-slate-200">{step.description}</p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-medium mb-3">O que fazer:</h4>
                        <ul className="space-y-2">
                          {step.details.map((detail, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                              <span className="text-slate-200">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Dicas importantes:</h4>
                        <ul className="space-y-2">
                          {step.tips.map((tip, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                              <span className="text-slate-200">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-slate-800 border border-slate-600Light rounded-card p-6">
                      <h4 className="font-medium mb-4">Recursos Úteis</h4>
                      
                      <div className="space-y-3">
                        {step.id === 1 && (
                          <>
                            <a
                              href="https://subwallet.app/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 hover:bg-slate-800Hover rounded-button transition-colors duration-200"
                            >
                              <span>Baixar SubWallet</span>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <a
                              href="https://polkadot.js.org/extension/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 hover:bg-slate-800Hover rounded-button transition-colors duration-200"
                            >
                              <span>Baixar Polkadot.js</span>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <Link
                              to="/dashboard/carteiras"
                              className="flex items-center justify-between p-3 hover:bg-slate-800Hover rounded-button transition-colors duration-200"
                            >
                              <span>Gerenciar Carteiras</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </>
                        )}
                        
                        {step.id === 2 && (
                          <>
                            <Link
                              to="/projetos"
                              className="flex items-center justify-between p-3 hover:bg-slate-800Hover rounded-button transition-colors duration-200"
                            >
                              <span>Ver Projetos</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                              to="/launch"
                              className="flex items-center justify-between p-3 hover:bg-slate-800Hover rounded-button transition-colors duration-200"
                            >
                              <span>Entender as Fases</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </>
                        )}
                        
                        {step.id === 3 && (
                          <>
                            <Link
                              to="/launchpool"
                              className="flex items-center justify-between p-3 hover:bg-slate-800Hover rounded-button transition-colors duration-200"
                            >
                              <span>Ver Launchpools</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                              to="/rifa"
                              className="flex items-center justify-between p-3 hover:bg-slate-800Hover rounded-button transition-colors duration-200"
                            >
                              <span>Participar de Rifas</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </>
                        )}
                        
                        {step.id === 4 && (
                          <>
                            <Link
                              to="/dashboard"
                              className="flex items-center justify-between p-3 hover:bg-slate-800Hover rounded-button transition-colors duration-200"
                            >
                              <span>Acessar Dashboard</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                              to="/dashboard/tokens-a-reivindicar"
                              className="flex items-center justify-between p-3 hover:bg-slate-800Hover rounded-button transition-colors duration-200"
                            >
                              <span>Reivindicar Tokens</span>
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phases Overview */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              Fases de <span className="text-gradient">Participação</span>
            </h2>
            <p className="text-slate-200 text-lg max-w-2xl mx-auto">
              Cada projeto oferece 5 formas diferentes de participar, cada uma com suas vantagens
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {phases.map((phase, index) => (
              <div key={index} className="card-hover">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{phase.icon}</div>
                  <h3 className="heading-4 mb-2">{phase.name}</h3>
                  <p className="text-slate-200">{phase.description}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-200">Desconto:</span>
                    <span className="font-medium text-success">{phase.discount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-200">Duração:</span>
                    <span className="font-medium">{phase.duration}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-2">Requisitos:</h4>
                  <ul className="space-y-1">
                    {phase.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-success" />
                        <span className="text-slate-200">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/projetos"
                  className="btn-outline w-full"
                >
                  Ver Projetos
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-slate-800/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              Perguntas <span className="text-gradient">Frequentes</span>
            </h2>
            <p className="text-slate-200 text-lg max-w-2xl mx-auto">
              Tire suas dúvidas sobre como participar da plataforma
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="card">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h3 className="font-medium pr-4">{faq.question}</h3>
                    <div className={`transform transition-transform duration-200 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}>
                      <ArrowRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </button>

                  {openFaq === index && (
                    <div className="mt-4 pt-4 border-t border-slate-600Light">
                      <p className="text-slate-200">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-card p-12 text-center">
            <h2 className="heading-2 mb-4">
              Pronto para <span className="text-gradient">Começar?</span>
            </h2>
            <p className="text-slate-200 text-lg mb-8 max-w-2xl mx-auto">
              Conecte sua carteira e comece a participar dos melhores lançamentos de tokens do mercado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/projetos" className="btn-primary">
                <Target className="w-4 h-4 mr-2" />
                Ver Projetos Disponíveis
              </Link>
              <Link to="/dashboard" className="btn-outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Acessar Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
