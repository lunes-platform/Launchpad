import { Link } from 'react-router-dom'
import { 
  Rocket, 
  Shield, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  FileText,
  Calendar,
  Coins
} from 'lucide-react'

export default function ParaProjetosPage() {
  const benefits = [
    {
      icon: Shield,
      title: 'Auditoria Completa',
      description: 'Processo rigoroso de due diligence e auditoria de segurança antes do lançamento.'
    },
    {
      icon: Users,
      title: 'Comunidade Ativa',
      description: 'Acesso a uma base de mais de 25.000 investidores ativos e engajados.'
    },
    {
      icon: TrendingUp,
      title: 'Marketing Especializado',
      description: 'Estratégias de marketing focadas em Web3 e crescimento orgânico.'
    },
    {
      icon: Coins,
      title: 'Múltiplas Fases',
      description: 'Sistema de 5 fases para maximizar arrecadação e engajamento.'
    }
  ]

  const phases = [
    {
      phase: '1. Whitelist',
      description: 'Exclusivo para usuários VIP',
      discount: '40-60%',
      duration: '6-12 meses vesting'
    },
    {
      phase: '2. Pré-Venda',
      description: 'Early adopters da comunidade',
      discount: '15-25%',
      duration: '3-6 meses vesting'
    },
    {
      phase: '3. Venda Pública',
      description: 'Aberto para todos',
      discount: 'Preço final',
      duration: 'Vesting mínimo'
    },
    {
      phase: '4. Launchpool',
      description: 'Staking de LUNES',
      discount: 'Rewards',
      duration: 'Contínuo'
    },
    {
      phase: '5. Rifa',
      description: 'Sorteios diários',
      discount: 'Prêmios',
      duration: 'Automático'
    }
  ]

  const requirements = [
    'Token PSP22 implantado na rede Lunes (obrigatório)',
    'Contrato verificado e auditado na rede Lunes',
    'Projeto com tecnologia inovadora ou caso de uso único',
    'Equipe doxxed com experiência comprovada',
    'Whitepaper técnico detalhado',
    'Tokenomics bem estruturadas',
    'Roadmap claro e realista',
    'Comunidade ativa nas redes sociais',
    'Parcerias estratégicas estabelecidas'
  ]

  const lunesRequirements = [
    {
      title: 'Rede Lunes Exclusiva',
      description: 'Apenas tokens implantados na rede Lunes são aceitos',
      icon: '🌐'
    },
    {
      title: 'Padrão PSP22',
      description: 'Token deve implementar o padrão PSP22 corretamente',
      icon: '🔗'
    },
    {
      title: 'Validação Automática',
      description: 'Sistema verifica automaticamente a conformidade do contrato',
      icon: '✅'
    },
    {
      title: 'Auditoria Recomendada',
      description: 'Projetos DeFi e Infrastructure requerem auditoria',
      icon: '🛡️'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-primary/20 border border-primary/30 rounded-badge px-4 py-2 mb-6">
            <Rocket className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Lance Seu Projeto</span>
          </div>

          <h1 className="heading-1 mb-6">
            Transforme Sua <span className="text-gradient">Ideia</span> em Realidade
          </h1>
          <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
            Junte-se ao Launchpad Lunes e tenha acesso à melhor plataforma para lançar seu token 
            com segurança, transparência e máximo alcance de mercado.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/admin/projetos/novo" className="btn-primary">
              <Rocket className="w-4 h-4 mr-2" />
              Começar Aplicação
            </Link>
            <Link to="/como-participar" className="btn-outline">
              <FileText className="w-4 h-4 mr-2" />
              Ver Requisitos
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              Por que Escolher o <span className="text-gradient">Launchpad Lunes</span>?
            </h2>
            <p className="text-slate-200 text-lg max-w-2xl mx-auto">
              Uma plataforma completa para maximizar o sucesso do seu lançamento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="card-hover text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="heading-5 mb-4">{benefit.title}</h3>
                <p className="text-slate-200">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lunes Network Requirements */}
      <section className="section-padding bg-gradient-to-r from-primary/10 to-purple-500/10">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              Exclusivo para <span className="text-gradient">Rede Lunes PSP22</span>
            </h2>
            <p className="text-slate-200 text-lg max-w-2xl mx-auto">
              Nossa plataforma aceita apenas projetos que atendem aos padrões da rede Lunes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {lunesRequirements.map((req, index) => (
              <div key={index} className="card text-center">
                <div className="text-4xl mb-4">{req.icon}</div>
                <h3 className="font-title font-semibold text-lg mb-3">{req.title}</h3>
                <p className="text-slate-200 text-sm">{req.description}</p>
              </div>
            ))}
          </div>

          <div className="card border-primary/30 bg-primary/5">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-primary text-lg mb-2">
                  Validação Automática de Contratos
                </h3>
                <p className="text-slate-200 mb-4">
                  Nosso sistema verifica automaticamente se seu token está de acordo com os padrões da rede Lunes:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span>Implementação PSP22 válida</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span>Contrato ativo na rede Lunes</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span>Metadados do token válidos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span>Conformidade com padrões</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phases System */}
      <section className="section-padding bg-slate-800/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              Sistema de <span className="text-gradient">5 Fases</span>
            </h2>
            <p className="text-slate-200 text-lg max-w-2xl mx-auto">
              Maximize sua arrecadação com nosso sistema de fases otimizado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {phases.map((phase, index) => (
              <div key={index} className="card text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-primaryLight rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <h3 className="font-title font-semibold text-lg mb-2">{phase.phase}</h3>
                <p className="text-slate-200 text-sm mb-3">{phase.description}</p>
                <div className="space-y-1">
                  <p className="text-primary font-semibold">{phase.discount}</p>
                  <p className="text-slate-400 text-xs">{phase.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-2 mb-6">
                Requisitos para <span className="text-gradient">Aprovação</span>
              </h2>
              <p className="text-slate-200 text-lg mb-8">
                Garantimos qualidade através de critérios rigorosos de seleção
              </p>

              <div className="space-y-4">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                    <span className="text-slate-200">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-glow">
              <h3 className="heading-4 mb-6">Pronto para Começar?</h3>
              <p className="text-slate-200 mb-6">
                Entre em contato conosco para iniciar o processo de aplicação
              </p>
              
              <div className="space-y-4">
                <Link to="/admin/projetos/novo" className="btn-primary w-full justify-center">
                  <Rocket className="w-4 h-4 mr-2" />
                  Iniciar Aplicação
                </Link>
                <Link to="/sobre" className="btn-outline w-full justify-center">
                  <Users className="w-4 h-4 mr-2" />
                  Falar com Nossa Equipe
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary/20 to-accent/20">
        <div className="container-custom text-center">
          <h2 className="heading-2 mb-4">
            Junte-se aos <span className="text-gradient">Projetos de Sucesso</span>
          </h2>
          <p className="text-slate-200 text-lg mb-8 max-w-2xl mx-auto">
            Mais de 47 projetos já confiaram em nossa plataforma com 94% de taxa de sucesso
          </p>
          <Link to="/projetos" className="btn-primary">
            Ver Projetos Realizados
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}
