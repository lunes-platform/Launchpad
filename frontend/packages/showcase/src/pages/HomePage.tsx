import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Target,
  TrendingUp,
  Users,
  Shield,
  Star,
  Clock,
  Gift,
  Zap,
  Award,
  ChevronRight,
  Play,
  DollarSign,
  Rocket,
  Globe,
  Coins,
  Wallet
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { Avatar } from '@/components/ui/Avatar'
import { mockProjects, mockPlatformStats, mockProjectCategories, mockTokenPrices } from '@/data/mockData'
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils'
import { useWallet } from '@/contexts/WalletContext'

export default function HomePage() {
  const { isConnected, connectWallet } = useWallet()
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)

  // Auto-rotate featured projects
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentProjectIndex(prev => (prev + 1) % mockProjects.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  const featuredProject = mockProjects[currentProjectIndex]
  const activeProjects = mockProjects.filter(p => p.status === 'active')

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10" />
        <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-30" />
        
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge variant="gradient" size="lg" className="inline-flex items-center space-x-2">
                  <Rocket className="w-4 h-4" />
                  <span>Plataforma #1 para Investimentos Crypto</span>
                </Badge>
                
                <h1 className="heading-1 text-gradient">
                  O Futuro dos <br />
                  <span className="text-primary">Investimentos</span> <br />
                  Está Aqui
          </h1>
                
                <p className="text-xl text-slate-200 leading-relaxed">
                  Descubra os projetos mais promissores do universo cripto. 
                  Invista em IDOs verificados, faça staking e maximize seus retornos
                  com segurança e transparência total.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {!isConnected ? (
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-4"
                    onClick={() => connectWallet()}
                  >
                    <Wallet className="w-5 h-5 mr-2" />
                    Conectar Carteira
                  </Button>
                ) : (
                  <Link to="/projetos">
                    <Button size="lg" className="text-lg px-8 py-4">
              Explorar Projetos
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
            </Link>
                )}
                
                <Link to="/como-participar">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                    <Play className="w-5 h-5 mr-2" />
                    Como Funciona
                  </Button>
            </Link>
          </div>

              {/* Stats Pills */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-sm text-slate-200">
                    <span className="font-semibold text-success">{mockPlatformStats.totalProjects}</span> Projetos
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-sm text-slate-200">
                    <span className="font-semibold text-primary">{formatCurrency(mockPlatformStats.totalRaised)}</span> Levantados
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
                  <span className="text-sm text-slate-200">
                    <span className="font-semibold text-warning">{mockPlatformStats.totalParticipants.toLocaleString()}</span> Investidores
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Featured Project */}
            <div className="relative">
              <Card variant="glow" className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
                
                <CardHeader className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="primary">
                      🔥 Projeto em Destaque
                    </Badge>
                    <div className="flex items-center space-x-1">
                      {mockProjects.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentProjectIndex ? 'bg-primary w-6' : 'bg-border'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-4xl">{featuredProject.logo}</div>
                    <div>
                      <CardTitle className="text-xl">{featuredProject.name}</CardTitle>
                      <p className="text-slate-200">{featuredProject.category}</p>
                    </div>
                  </div>
                  
                  <p className="text-slate-200">
                    {featuredProject.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progresso</span>
                      <span className="font-semibold">
                        {featuredProject.metrics.totalRaised > 0 
                          ? Math.round((featuredProject.metrics.totalRaised / 5000000) * 100)
                          : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={featuredProject.metrics.totalRaised} 
                      max={5000000}
                      variant="gradient"
                      size="lg"
                    />
                    <div className="flex justify-between text-sm mt-2 text-slate-200">
                      <span>{formatCurrency(featuredProject.metrics.totalRaised)}</span>
                      <span>Meta: {formatCurrency(5000000)}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
                      <div className="text-lg font-bold text-primary">
                        {featuredProject.metrics.participantsCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-200">Participantes</div>
            </div>
            <div className="text-center">
                      <div className="text-lg font-bold text-success">
                        {featuredProject.phases.length > 1 ? featuredProject.phases[1].tokenPrice : featuredProject.phases[0].tokenPrice}
                      </div>
                      <div className="text-xs text-slate-200">Preço Token</div>
                    </div>
            </div>

                  {/* CTA */}
                  <Link to={`/projetos/${featuredProject.id}`}>
                    <Button fullWidth variant="primary" size="lg">
                      Ver Projeto
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-16 bg-slate-800/30">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold">{formatCurrency(mockPlatformStats.totalRaised)}</div>
                <div className="text-sm text-slate-200">Total Levantado</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <div className="text-2xl font-bold">{mockPlatformStats.totalParticipants.toLocaleString()}</div>
                <div className="text-sm text-slate-200">Investidores</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-warning" />
                </div>
                <div className="text-2xl font-bold">{mockPlatformStats.activeProjects}</div>
                <div className="text-sm text-slate-200">Projetos Ativos</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-info/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-info" />
                </div>
                <div className="text-2xl font-bold">{formatPercentage(mockPlatformStats.averageRoi)}</div>
                <div className="text-sm text-slate-200">ROI Médio</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Active Projects */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="heading-2 mb-4">Projetos em Destaque</h2>
              <p className="text-slate-200">
                Oportunidades exclusivas de investimento verificadas pela nossa equipe
              </p>
            </div>
            <Link to="/projetos">
              <Button variant="outline">
              Ver Todos
              <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeProjects.slice(0, 3).map((project) => (
              <Card key={project.id} variant="glow" hover="lift" className="group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{project.logo}</div>
                      <div>
                        <h3 className="font-semibold">{project.name}</h3>
                        <Badge variant="secondary" size="sm">{project.category}</Badge>
                      </div>
                    </div>
                    <Badge variant="success">Ativo</Badge>
                  </div>
                  
                  <p className="text-sm text-slate-200 line-clamp-2">
                    {project.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Levantado</span>
                      <span className="font-semibold">{formatCurrency(project.metrics.totalRaised)}</span>
                    </div>
                    <Progress 
                      value={project.metrics.totalRaised} 
                      max={5000000}
                      variant="primary"
                    />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="font-semibold text-primary">
                        {project.metrics.participantsCount}
                      </div>
                      <div className="text-xs text-slate-200">Participantes</div>
                    </div>
                    <div>
                      <div className="font-semibold text-success">
                        ${project.phases[0]?.tokenPrice || 0}
                      </div>
                      <div className="text-xs text-slate-200">Preço Token</div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link to={`/projetos/${project.id}`}>
                    <Button fullWidth variant="outline" className="group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      Ver Detalhes
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-slate-800/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Explore por Categoria</h2>
            <p className="text-slate-200">
              Encontre os melhores projetos em cada setor
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {mockProjectCategories.map((category) => (
              <Link key={category.name} to={`/projetos?category=${category.name}`}>
                <Card className="text-center hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Coins className="w-6 h-6 text-primary" />
              </div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-slate-200 mb-2">{category.description}</p>
                    <Badge variant="outline" size="sm">{category.count} projetos</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Por que Escolher a Lunes?</h2>
            <p className="text-slate-200 max-w-2xl mx-auto">
              Oferecemos a melhor experiência de investimento em projetos cripto
              com segurança, transparência e oportunidades exclusivas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-success" />
              </div>
                <h3 className="font-semibold mb-2">100% Seguro</h3>
                <p className="text-sm text-slate-200">
                  Todos os projetos passam por rigorosa verificação e auditoria
                  antes de serem listados na plataforma.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
              </div>
                <h3 className="font-semibold mb-2">Acesso Antecipado</h3>
                <p className="text-sm text-slate-200">
                  Invista nos melhores projetos antes do público geral
                  com preços exclusivos e condições especiais.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-warning" />
              </div>
                <h3 className="font-semibold mb-2">Suporte Premium</h3>
                <p className="text-sm text-slate-200">
                  Nossa equipe especializada está sempre disponível
                  para ajudar você a tomar as melhores decisões.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primaryDark">
        <div className="container-custom text-center">
          <h2 className="heading-2 text-white mb-4">
            Pronto para Começar?
            </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de investidores que já descobriram
            as melhores oportunidades de investimento cripto
          </p>
          
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isConnected ? (
              <Button 
                size="xl" 
                variant="secondary"
                onClick={() => connectWallet()}
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Começar a Investir
              </Button>
            ) : (
              <Link to="/projetos">
                <Button size="xl" variant="secondary">
                Explorar Projetos
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
            
            <Link to="/como-participar">
              <Button size="xl" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Saiba Mais
              </Button>
              </Link>
          </div>
        </div>
      </section>
    </div>
  )
}