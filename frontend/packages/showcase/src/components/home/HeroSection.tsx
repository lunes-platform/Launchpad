import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative section-padding overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-30" />
      
      <div className="container-custom relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-slate-800/80 backdrop-blur-sm border border-slate-600Light rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">
              Plataforma Multi-Chain para IDOs
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="heading-1 mb-6">
            O Futuro dos{' '}
            <span className="text-gradient">Lançamentos</span>{' '}
            de Tokens
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Participe de IDOs exclusivos, faça staking em launchpools e ganhe recompensas 
            em uma plataforma segura e descentralizada. Suporte nativo para{' '}
            <span className="text-primary font-medium">Lunes</span>,{' '}
            <span className="text-blue-400 font-medium">TON</span> e{' '}
            <span className="text-purple-400 font-medium">Solana</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/projetos" className="btn-primary text-lg px-8 py-4">
              Explorar Projetos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link to="/launchpool" className="btn-outline text-lg px-8 py-4">
              <TrendingUp className="w-5 h-5 mr-2" />
              Launchpool
            </Link>
          </div>

          {/* Network Badges */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2 bg-slate-800/60 backdrop-blur-sm border border-slate-600Light rounded-button px-4 py-2">
              <div className="w-6 h-6 bg-primary rounded-full" />
              <span className="text-sm font-medium">Lunes Network</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-800/60 backdrop-blur-sm border border-slate-600Light rounded-button px-4 py-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full" />
              <span className="text-sm font-medium">TON Network</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-800/60 backdrop-blur-sm border border-slate-600Light rounded-button px-4 py-2">
              <div className="w-6 h-6 bg-purple-500 rounded-full" />
              <span className="text-sm font-medium">Solana Network</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
