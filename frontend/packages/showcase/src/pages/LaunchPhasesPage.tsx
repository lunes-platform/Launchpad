import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import {
  ArrowRight,
  Gift,
  TrendingUp,
  Users,
  Clock,
  Zap,
  Target,
  Info,
  CheckCircle,
  Star,
  DollarSign
} from 'lucide-react'
import { ProjectCard, type Project } from '@/components/projects/ProjectCard'
import { StatsCard } from '@/components/ui/StatsCard'
import { formatCurrency, formatPercentage, formatTimeRemaining } from '@/lib/utils'

function LaunchPhasesOverview() {
  const phases = [
    {
      id: 'whitelist',
      name: 'Whitelist',
      icon: Gift,
      color: 'primary',
      discount: '40-60%',
      duration: '6-12 meses',
      description: 'Exclusividade VIP com grandes descontos para usuários pré-aprovados',
      features: [
        'Desconto de 40-60% no preço final',
        'Garantia de alocação',
        'Acesso antecipado',
        'Vesting preferencial de 6-12 meses'
      ]
    },
    {
      id: 'presale',
      name: 'Pré-Venda',
      icon: TrendingUp,
      color: 'primaryLight',
      discount: '15-25%',
      duration: '3-6 meses',
      description: 'Early Birds da comunidade Lunes com desconto atrativo',
      features: [
        'Desconto de 15-25% no preço final',
        'Acesso antes da venda pública',
        'Vesting de 3-6 meses',
        'Comunidade exclusiva'
      ]
    },
    {
      id: 'public',
      name: 'Venda Pública',
      icon: Users,
      color: 'accent',
      discount: '0%',
      duration: 'Mínimo',
      description: 'Preço final sem desconto, aberto para todos os participantes',
      features: [
        'Preço final do token',
        'Aberto para todos',
        'Vesting mínimo',
        'Sem requisitos especiais'
      ]
    },
    {
      id: 'launchpool',
      name: 'Launchpool',
      icon: Clock,
      color: 'info',
      discount: 'Staking',
      duration: '14-30 dias',
      description: 'Faça staking de LUNES e ganhe tokens do projeto',
      features: [
        'Sem necessidade de compra',
        'Stake LUNES para ganhar tokens',
        'APR atrativo',
        'Flexibilidade total'
      ]
    },
    {
      id: 'raffle',
      name: 'Rifa',
      icon: Zap,
      color: 'success',
      discount: 'Sorteios',
      duration: '7 dias',
      description: 'Sorteios diários garantidos com prêmios em tokens',
      features: [
        'Bilhetes a partir de $0.50',
        '3 sorteios diários garantidos',
        'Prêmios de $1000 em tokens',
        'Estratégia de preços otimizada'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="section-padding bg-slate-800/30">
        <div className="container-custom text-center">
          <h1 className="heading-1 mb-6">
            Fases de <span className="text-gradient">Lançamento</span>
          </h1>
          <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
            Nosso sistema de 5 fases oferece oportunidades únicas para diferentes tipos de investidores,
            desde exclusividade VIP até participação através de staking.
          </p>
        </div>
      </section>

      {/* Phases Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {phases.map((phase, index) => (
              <div
                key={phase.id}
                className="card-hover group"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 bg-${phase.color}/20 rounded-full flex items-center justify-center`}>
                    <phase.icon className={`w-6 h-6 text-${phase.color}`} />
                  </div>
                  <div>
                    <h3 className="heading-4 group-hover:text-primary transition-colors duration-200">
                      {phase.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-success font-medium">{phase.discount}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-200">{phase.duration}</span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-200 mb-6">
                  {phase.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {phase.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-slate-200">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/projetos`}
                  className="btn-outline w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-200"
                >
                  Ver Projetos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-slate-800/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              Como <span className="text-gradient">Funciona</span>
            </h2>
            <p className="text-slate-200 text-lg max-w-2xl mx-auto">
              Cada projeto passa por fases sequenciais, oferecendo diferentes oportunidades e benefícios.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-16 bottom-16 w-0.5 bg-borderLight hidden md:block" />
              
              {phases.map((phase, index) => (
                <div key={phase.id} className="relative flex items-start space-x-8 mb-12 last:mb-0">
                  {/* Number */}
                  <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl relative z-10">
                    {index + 1}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <h3 className="heading-4 mb-2">{phase.name}</h3>
                    <p className="text-slate-200 mb-4">{phase.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {phase.features.slice(0, 2).map((feature, featureIndex) => (
                        <span
                          key={featureIndex}
                          className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
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
              Pronto para <span className="text-gradient">Participar?</span>
            </h2>
            <p className="text-slate-200 text-lg mb-8 max-w-2xl mx-auto">
              Explore os projetos disponíveis e encontre as melhores oportunidades de investimento.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/projetos" className="btn-primary">
                Ver Projetos Ativos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link to="/como-participar" className="btn-outline">
                Guia Completo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function LaunchPhasesPage() {
  return (
    <Routes>
      <Route path="/" element={<LaunchPhasesOverview />} />
      <Route path="/*" element={<LaunchPhasesOverview />} />
    </Routes>
  )
}
