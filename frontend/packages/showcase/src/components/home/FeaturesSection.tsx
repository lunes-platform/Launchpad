import { Shield, Globe, Zap, Users, TrendingUp, Award } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Segurança Empresarial',
    description: 'Smart contracts auditados e sistema de governança descentralizada para máxima segurança.',
  },
  {
    icon: Globe,
    title: 'Multi-Chain',
    description: 'Suporte nativo para Lunes, TON e Solana. Pagamentos em LUNES, USDT-TON e USDT-Solana.',
  },
  {
    icon: Zap,
    title: 'Fases Otimizadas',
    description: 'Sistema de 5 fases: Whitelist, Pré-Venda, Venda Pública, Launchpool e Rifas.',
  },
  {
    icon: Users,
    title: 'Governança Comunitária',
    description: 'Sistema de votação stake-weighted para avaliação e seleção de projetos.',
  },
  {
    icon: TrendingUp,
    title: 'Smart Fund Treasury',
    description: 'Fundo inteligente com 40% de airdrops automáticos e gestão profissional.',
  },
  {
    icon: Award,
    title: 'Sistema de Afiliados',
    description: 'Programa de afiliados com comissões de 5-15% e proteção anti-fraude.',
  },
]

export function FeaturesSection() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-2 mb-4">
            Por que escolher o <span className="text-gradient">Launchpad Lunes?</span>
          </h2>
          <p className="text-slate-200 text-lg max-w-2xl mx-auto">
            Uma plataforma completa e segura para lançamentos de tokens, 
            construída com as melhores práticas do mercado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card group hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              
              <h3 className="font-title font-semibold text-lg mb-3 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-slate-200 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
