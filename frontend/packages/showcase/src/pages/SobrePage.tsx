import { 
  Shield, 
  Target, 
  Users, 
  TrendingUp, 
  Award, 
  Globe,
  Heart,
  Zap,
  Github,
  Twitter,
  MessageCircle
} from 'lucide-react'

export default function SobrePage() {
  const stats = [
    { label: 'Projetos Lançados', value: '47+', icon: Target },
    { label: 'Investidores Ativos', value: '25K+', icon: Users },
    { label: 'Volume Total', value: '$12.5M+', icon: TrendingUp },
    { label: 'Taxa de Sucesso', value: '94%', icon: Award }
  ]

  const values = [
    {
      icon: Shield,
      title: 'Segurança Primeiro',
      description: 'Todos os projetos passam por rigorosa auditoria e due diligence antes do lançamento.'
    },
    {
      icon: Heart,
      title: 'Transparência Total',
      description: 'Operamos com total transparência, fornecendo informações claras sobre todos os projetos.'
    },
    {
      icon: Users,
      title: 'Comunidade em Foco',
      description: 'Priorizamos os interesses da nossa comunidade em todas as decisões da plataforma.'
    },
    {
      icon: Zap,
      title: 'Inovação Contínua',
      description: 'Sempre buscamos novas formas de melhorar a experiência de investimento em Web3.'
    }
  ]

  const team = [
    {
      name: 'Carlos Silva',
      role: 'CEO & Co-founder',
      description: 'Especialista em blockchain com 8+ anos de experiência em DeFi',
      image: '👨‍💼'
    },
    {
      name: 'Ana Santos',
      role: 'CTO & Co-founder',
      description: 'Desenvolvedora senior com expertise em Substrate e Polkadot',
      image: '👩‍💻'
    },
    {
      name: 'Pedro Costa',
      role: 'Head of Security',
      description: 'Auditor de smart contracts certificado com 50+ auditorias',
      image: '👨‍🔧'
    },
    {
      name: 'Maria Oliveira',
      role: 'Head of Marketing',
      description: 'Especialista em crescimento e comunidades Web3',
      image: '👩‍🎨'
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
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Sobre Nós</span>
          </div>

          <h1 className="heading-1 mb-6">
            Conectando <span className="text-gradient">Inovação</span> com Oportunidade
          </h1>
          <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
            O Launchpad Lunes é a ponte entre projetos revolucionários Web3 e investidores que 
            buscam as melhores oportunidades do ecossistema Polkadot.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-slate-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-slate-800/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-2 mb-6">
                Nossa <span className="text-gradient">Missão</span>
              </h2>
              <p className="text-slate-200 text-lg mb-6">
                Democratizar o acesso a investimentos em projetos Web3 de alta qualidade, 
                proporcionando uma plataforma segura, transparente e eficiente para 
                lançamentos de tokens no ecossistema Polkadot.
              </p>
              <p className="text-slate-200 mb-8">
                Acreditamos que a inovação blockchain deve ser acessível a todos, e nossa 
                missão é ser a ponte que conecta projetos promissores com investidores 
                visionários.
              </p>
              
              <h3 className="heading-4 mb-4 text-white">Nossos Valores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{value.title}</h4>
                      <p className="text-slate-200 text-sm">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-glow">
              <h3 className="heading-4 mb-4">Por que Escolher o Lunes?</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-success" />
                  <span className="text-slate-200">Auditoria rigorosa de todos os projetos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-success" />
                  <span className="text-slate-200">Comunidade ativa de 25K+ investidores</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span className="text-slate-200">94% de taxa de sucesso nos lançamentos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-success" />
                  <span className="text-slate-200">Reconhecida pela comunidade Polkadot</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              Nossa <span className="text-gradient">Equipe</span>
            </h2>
            <p className="text-slate-200 text-lg max-w-2xl mx-auto">
              Profissionais experientes dedicados a construir o futuro do Web3
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card-hover text-center">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="heading-5 mb-2">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-slate-200 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="section-padding bg-slate-800/30">
        <div className="container-custom text-center">
          <h2 className="heading-2 mb-4">
            Junte-se à Nossa <span className="text-gradient">Comunidade</span>
          </h2>
          <p className="text-slate-200 text-lg mb-8 max-w-2xl mx-auto">
            Faça parte da maior comunidade de investidores Web3 do ecossistema Polkadot
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://discord.gg/lunes" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Discord
            </a>
            <a 
              href="https://twitter.com/launchpadlunes" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-outline"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </a>
            <a 
              href="https://github.com/lunes-platform" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-outline"
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
