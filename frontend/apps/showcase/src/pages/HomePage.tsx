import {
  ArrowRight,
  TrendingUp,
  Shield,
  Users,
  Zap,
  Rocket,
  Target,
  Clock,
  Gift,
  Crown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useWallet } from "../contexts/WalletContext";
import { useRef, useState, useEffect, memo, useMemo, useCallback } from "react";
import { useDynamicGradient } from "../hooks/useDynamicGradient";
import {
  ProjectCard,
  type ProjectData,
} from "../../../../packages/shared-ui/src/components";

const mockProjects: ProjectData[] = [
  {
    id: "1",
    name: "DeFi Protocol Alpha",
    description: "Protocolo DeFi inovador com yield farming automatizado",
    logo: "/api/placeholder/80/80",
    status: "active" as const,
    phase: "public" as const,
    totalRaised: 750000,
    targetAmount: 1000000,
    progress: 75,
    investors: 234,
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    tokenPrice: 0.5,
    tokenSymbol: "ALPHA",
    category: "DeFi",
    minInvestment: 100,
    apy: "12%",
  },
  {
    id: "2",
    name: "GameFi Universe",
    description: "Plataforma de jogos blockchain com NFTs únicos",
    logo: "/api/placeholder/80/80",
    status: "active" as const,
    phase: "private" as const,
    totalRaised: 500000,
    targetAmount: 800000,
    progress: 62.5,
    investors: 156,
    startDate: "2024-01-20",
    endDate: "2024-02-20",
    tokenPrice: 0.25,
    tokenSymbol: "GAME",
    category: "Gaming",
    minInvestment: 250,
    apy: "15%",
  },
  {
    id: "3",
    name: "Green Energy Token",
    description: "Tokenização de projetos de energia renovável",
    logo: "/api/placeholder/80/80",
    status: "upcoming" as const,
    phase: "seed" as const,
    totalRaised: 0,
    targetAmount: 1500000,
    progress: 0,
    investors: 0,
    startDate: "2024-02-01",
    endDate: "2024-03-01",
    tokenPrice: 0.1,
    tokenSymbol: "GREEN",
    category: "Sustainability",
    minInvestment: 500,
    apy: "8%",
  },
];

// Componente para números animados - Otimizado com memo
const AnimatedNumber = memo(({ value, duration = 2000 }: { value: number; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      const startTime = Date.now();
      let animationId: number;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setDisplayValue(Math.floor(value * easeOutQuart));
        
        if (progress < 1) {
          animationId = requestAnimationFrame(animate);
        }
      };
      
      animationId = requestAnimationFrame(animate);
      
      // Cleanup function para cancelar animação se componente for desmontado
      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }
  }, [isInView, value, duration, hasAnimated]);

  return (
    <span 
      ref={ref} 
      style={{ 
        willChange: hasAnimated ? 'auto' : 'contents',
        transform: 'translateZ(0)' // Force hardware acceleration
      }}
    >
      {displayValue.toLocaleString()}
    </span>
  );
});

// Variantes de animação otimizadas - Memoizadas para evitar recriação
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Transição otimizada para performance
const optimizedTransition = {
  duration: 0.6
};

export default function HomePage() {
  const { isReady, connect } = useWallet();
  const { currentGradient, gradientName } = useDynamicGradient();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Refs para scroll reveal
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const howItWorksRef = useRef(null);
  const projectsRef = useRef(null);
  const stakingRef = useRef(null);
  const rafflesRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);

  // Hooks useInView para scroll reveal
  const heroInView = useInView(heroRef, { once: true });
  const statsInView = useInView(statsRef, { once: true });
  const howItWorksInView = useInView(howItWorksRef, { once: true });
  const projectsInView = useInView(projectsRef, { once: true });
  const stakingInView = useInView(stakingRef, { once: true });
  const rafflesInView = useInView(rafflesRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true });
  const ctaInView = useInView(ctaRef, { once: true });

  return (
    <>
      {/* Hero Section */}
      <section ref={heroRef} className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-1000 ${currentGradient}`}>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          
          {/* Indicador do Degradê Atual */}
          <div className="absolute top-6 right-6 z-20">
            <div className="bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
              <span className="text-white/70 text-sm font-medium">{gradientName}</span>
            </div>
          </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={optimizedTransition}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            O Futuro dos
            <span className="block bg-gradient-to-r from-roxo-400 to-laranja-400 bg-clip-text text-transparent">
              Investimentos
            </span>
            <span className="block">Blockchain</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ ...optimizedTransition, delay: 0.2 }}
            className="text-xl md:text-2xl text-grafite-300 mb-8 max-w-3xl mx-auto"
          >
            Descubra, invista e participe dos projetos mais promissores do
            ecossistema Lunes. Sua jornada para o futuro financeiro começa
            aqui.
          </motion.p>

          <motion.div
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ ...optimizedTransition, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/projetos">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-roxo to-roxo-700 text-white font-semibold rounded-lg hover:from-roxo-600 hover:to-roxo-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Explorar Projetos
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const howItWorksSection = document.getElementById('como-funciona');
                howItWorksSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 border-2 border-grafite-600 text-white font-semibold rounded-lg hover:border-roxo-500 hover:bg-roxo-500/10 transition-all duration-300"
            >
              Como Funciona
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="relative py-24 bg-gradient-to-b from-grafite-900 via-grafite-800 to-grafite-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          {/* Gradient Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-verde-500/20 to-azul-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-laranja-500/15 to-rosa-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Title */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white via-azul-200 to-verde-200 bg-clip-text text-transparent"
              animate={statsInView ? { 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              Números Impressionantes
            </motion.h2>
            <motion.p 
              className="text-grafite-300 text-xl max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Nossa plataforma já conectou milhares de investidores a projetos inovadores,
              gerando resultados excepcionais para toda a comunidade.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.5
                }
              }
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
          >
            <motion.div
              variants={fadeInUp}
              className="relative text-center group cursor-pointer p-6 rounded-xl border border-transparent hover:border-roxo-500/30 transition-all duration-500 overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                boxShadow: "0 20px 40px rgba(139, 92, 246, 0.15)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background Gradient Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-roxo-500/10 via-transparent to-roxo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
              />
              
              {/* Animated Border */}
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-roxo-500/20 opacity-0 group-hover:opacity-100"
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 1 }}
                transition={{ duration: 0.5 }}
              />
              
              <div className="relative z-10">
                <motion.div 
                  className="text-3xl md:text-4xl font-bold text-roxo-400 mb-2 group-hover:text-roxo-300 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.span
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1, textShadow: "0 0 20px rgba(139, 92, 246, 0.5)" }}
                    transition={{ duration: 0.3 }}
                  >
                    $<AnimatedNumber value={2850000} />
                  </motion.span>
                </motion.div>
                <motion.div 
                  className="text-grafite-300 group-hover:text-white transition-colors duration-300 font-medium"
                  whileHover={{ y: -2 }}
                >
                  Total Investido
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="relative text-center group cursor-pointer p-6 rounded-xl border border-transparent hover:border-verde-500/30 transition-all duration-500 overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                rotateY: -5,
                boxShadow: "0 20px 40px rgba(34, 197, 94, 0.15)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background Gradient Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-verde-500/10 via-transparent to-verde-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
              />
              
              {/* Animated Border */}
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-verde-500/20 opacity-0 group-hover:opacity-100"
                initial={{ rotate: 0 }}
                whileHover={{ rotate: -1 }}
                transition={{ duration: 0.5 }}
              />
              
              <div className="relative z-10">
                <motion.div 
                  className="text-3xl md:text-4xl font-bold text-verde-400 mb-2 group-hover:text-verde-300 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.span
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1, textShadow: "0 0 20px rgba(34, 197, 94, 0.5)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnimatedNumber value={127} />
                  </motion.span>
                </motion.div>
                <motion.div 
                  className="text-grafite-300 group-hover:text-white transition-colors duration-300 font-medium"
                  whileHover={{ y: -2 }}
                >
                  Projetos Ativos
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="relative text-center group cursor-pointer p-6 rounded-xl border border-transparent hover:border-laranja-500/30 transition-all duration-500 overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                boxShadow: "0 20px 40px rgba(251, 146, 60, 0.15)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background Gradient Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-laranja-500/10 via-transparent to-laranja-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
              />
              
              {/* Animated Border */}
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-laranja-500/20 opacity-0 group-hover:opacity-100"
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 1 }}
                transition={{ duration: 0.5 }}
              />
              
              <div className="relative z-10">
                <motion.div 
                  className="text-3xl md:text-4xl font-bold text-laranja-400 mb-2 group-hover:text-laranja-300 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.span
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1, textShadow: "0 0 20px rgba(251, 146, 60, 0.5)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnimatedNumber value={8450} />+
                  </motion.span>
                </motion.div>
                <motion.div 
                  className="text-grafite-300 group-hover:text-white transition-colors duration-300 font-medium"
                  whileHover={{ y: -2 }}
                >
                  Investidores
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="relative text-center group cursor-pointer p-6 rounded-xl border border-transparent hover:border-azul-500/30 transition-all duration-500 overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                rotateY: -5,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Background Gradient Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-azul-500/10 via-transparent to-azul-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
              />
              
              {/* Animated Border */}
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-azul-500/20 opacity-0 group-hover:opacity-100"
                initial={{ rotate: 0 }}
                whileHover={{ rotate: -1 }}
                transition={{ duration: 0.5 }}
              />
              
              <div className="relative z-10">
                <motion.div 
                  className="text-3xl md:text-4xl font-bold text-azul-400 mb-2 group-hover:text-azul-300 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.span
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1, textShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnimatedNumber value={24} />%
                  </motion.span>
                </motion.div>
                <motion.div 
                  className="text-grafite-300 group-hover:text-white transition-colors duration-300 font-medium"
                  whileHover={{ y: -2 }}
                >
                  ROI Médio
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" ref={howItWorksRef} className="py-20 bg-grafite-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Como Funciona
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-grafite-300 max-w-3xl mx-auto"
            >
              Três passos simples para começar a investir no futuro da tecnologia
              blockchain.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: "Conecte sua Carteira",
                description: "Conecte sua carteira Web3 de forma segura e comece a explorar oportunidades de investimento."
              },
              {
                icon: <Rocket className="w-8 h-8" />,
                title: "Explore Projetos",
                description: "Navegue por nossa curadoria de projetos blockchain verificados e escolha onde investir."
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Invista e Ganhe",
                description: "Faça seus investimentos e acompanhe o crescimento do seu portfólio em tempo real."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className="relative bg-grafite-800 rounded-xl p-8 border border-grafite-700 hover:border-roxo-500 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-roxo-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <motion.div
                    animate={{
                      rotate: hoveredCard === index ? 360 : 0
                    }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-roxo-900 rounded-lg mb-6"
                  >
                    <div className="text-roxo-400">
                      {step.icon}
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-roxo-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-grafite-300 group-hover:text-white transition-colors">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section ref={projectsRef} className="py-20 bg-grafite-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={projectsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Projetos em Destaque
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-grafite-300 max-w-3xl mx-auto"
            >
              Descubra os projetos mais promissores selecionados por nossa equipe
              de especialistas.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={projectsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {mockProjects.map((project, index) => (
              <motion.div key={project.id} variants={fadeInUp}>
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            animate={projectsInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <Link to="/projetos">
              <button className="inline-flex items-center px-8 py-4 bg-roxo-600 text-white font-semibold rounded-lg hover:bg-roxo-700 transition-colors shadow-lg hover:shadow-xl">
                Ver Todos os Projetos
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Staking Section */}
      <section ref={stakingRef} className="py-20 bg-gradient-to-br from-roxo-900 via-grafite-900 to-azul-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={stakingInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Staking & Recompensas
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-grafite-300 max-w-3xl mx-auto"
            >
              Faça stake dos seus tokens LUNES e ganhe recompensas exclusivas,
              acesso prioritário e benefícios VIP na plataforma.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Staking Benefits */}
            <motion.div
              initial="hidden"
              animate={stakingInView ? "visible" : "hidden"}
              variants={fadeInLeft}
              className="space-y-8"
            >
              <div className="bg-grafite-800/50 backdrop-blur-sm rounded-2xl border border-grafite-600 p-8">
                <div className="flex items-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-roxo-900 rounded-lg mr-4">
                    <Crown className="w-6 h-6 text-roxo-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Staking Tiers</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-grafite-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">TIER S</p>
                      <p className="text-grafite-300 text-sm">100,000+ LUNES</p>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-400 font-bold">0% Taxas</p>
                      <p className="text-grafite-300 text-sm">Acesso VIP</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-grafite-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">TIER A</p>
                      <p className="text-grafite-300 text-sm">50,000+ LUNES</p>
                    </div>
                    <div className="text-right">
                      <p className="text-roxo-400 font-bold">1% Taxas</p>
                      <p className="text-grafite-300 text-sm">Prioridade</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-grafite-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">TIER B</p>
                      <p className="text-grafite-300 text-sm">25,000+ LUNES</p>
                    </div>
                    <div className="text-right">
                      <p className="text-azul-400 font-bold">2% Taxas</p>
                      <p className="text-grafite-300 text-sm">Benefícios</p>
                    </div>
                  </div>
                </div>
                <Link to="/staking">
                  <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-roxo-600 to-azul-600 text-white font-semibold rounded-lg hover:from-roxo-700 hover:to-azul-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Começar Staking
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Rewards Overview */}
            <motion.div
              initial="hidden"
              animate={stakingInView ? "visible" : "hidden"}
              variants={fadeInRight}
              className="space-y-8"
            >
              <div className="bg-grafite-800/50 backdrop-blur-sm rounded-2xl border border-grafite-600 p-8">
                <div className="flex items-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-verde-900 rounded-lg mr-4">
                    <Gift className="w-6 h-6 text-verde-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Sistema de Recompensas</h3>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-grafite-700/50 rounded-lg">
                      <p className="text-3xl font-bold text-verde-400 mb-2">15%</p>
                      <p className="text-grafite-300 text-sm">APY Médio</p>
                    </div>
                    <div className="text-center p-4 bg-grafite-700/50 rounded-lg">
                      <p className="text-3xl font-bold text-azul-400 mb-2">24h</p>
                      <p className="text-grafite-300 text-sm">Distribuição</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-grafite-300">Recompensas de Staking</span>
                      <span className="text-verde-400 font-semibold">Diárias</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-grafite-300">Recompensas de Participação</span>
                      <span className="text-roxo-400 font-semibold">Por Projeto</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-grafite-300">Bônus de Fidelidade</span>
                      <span className="text-laranja-400 font-semibold">Mensal</span>
                    </div>
                  </div>
                </div>
                <Link to="/dashboard/staking">
                  <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-verde-600 to-azul-600 text-white font-semibold rounded-lg hover:from-verde-700 hover:to-azul-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Ver Recompensas
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Raffles and Promotions */}
      <section ref={rafflesRef} className="py-20 bg-grafite-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={rafflesInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Sorteios e Promoções
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-grafite-300 max-w-3xl mx-auto"
            >
              Participe dos nossos sorteios exclusivos e ganhe tokens, NFTs e
              outras recompensas incríveis.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={rafflesInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {/* Raffle Card 1 */}
            <motion.div
              variants={fadeInUp}
              className="bg-grafite-700 rounded-xl border border-grafite-600 hover:border-laranja-500 transition-all duration-300 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-laranja-900 rounded-lg">
                  <Gift className="w-6 h-6 text-laranja-400" />
                </div>
                <span className="px-3 py-1 bg-laranja-900 text-laranja-300 text-sm font-medium rounded-full">
                  Ativo
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Sorteio NFT Exclusivo
              </h3>
              <p className="text-grafite-300 mb-4">
                Ganhe NFTs raros da coleção Genesis. Apenas 100 participantes!
              </p>
              <div className="flex items-center justify-between text-sm text-grafite-400 mb-4">
                <span>Participantes: 67/100</span>
                <span>Termina em: 2d 14h</span>
              </div>
              <div className="w-full bg-grafite-600 rounded-full h-2 mb-4">
                <div className="bg-laranja-500 h-2 rounded-full w-2/3" />
              </div>
              <button className="w-full py-3 bg-laranja-600 text-white font-semibold rounded-lg hover:bg-laranja-700 transition-colors">
                Participar Agora
              </button>
            </motion.div>

            {/* Raffle Card 2 */}
            <motion.div
              variants={fadeInUp}
              className="bg-grafite-700 rounded-xl border border-grafite-600 hover:border-roxo-500 transition-all duration-300 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-roxo-900 rounded-lg">
                  <Crown className="w-6 h-6 text-roxo-400" />
                </div>
                <span className="px-3 py-1 bg-roxo-900 text-roxo-300 text-sm font-medium rounded-full">
                  VIP
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Mega Sorteio de Tokens
              </h3>
              <p className="text-grafite-300 mb-4">
                Concorra a 10.000 tokens ALPHA. Exclusivo para holders!
              </p>
              <div className="flex items-center justify-between text-sm text-grafite-400 mb-4">
                <span>Participantes: 234/500</span>
                <span>Termina em: 5d 8h</span>
              </div>
              <div className="w-full bg-grafite-600 rounded-full h-2 mb-4">
                <div className="bg-roxo-500 h-2 rounded-full w-1/2" />
              </div>
              <button className="w-full py-3 bg-roxo-600 text-white font-semibold rounded-lg hover:bg-roxo-700 transition-colors">
                Participar Agora
              </button>
            </motion.div>

            {/* Raffle Card 3 */}
            <motion.div
              variants={fadeInUp}
              className="bg-grafite-700 rounded-xl border border-grafite-600 hover:border-verde-500 transition-all duration-300 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-verde-900 rounded-lg">
                  <Zap className="w-6 h-6 text-verde-400" />
                </div>
                <span className="px-3 py-1 bg-verde-900 text-verde-300 text-sm font-medium rounded-full">
                  Flash
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Sorteio Relâmpago
              </h3>
              <p className="text-grafite-300 mb-4">
                Whitelist para o próximo IDO. Apenas 24 horas para participar!
              </p>
              <div className="flex items-center justify-between text-sm text-grafite-400 mb-4">
                <span>Participantes: 89/200</span>
                <span>Termina em: 18h 32m</span>
              </div>
              <div className="w-full bg-grafite-600 rounded-full h-2 mb-4">
                <div className="bg-verde-500 h-2 rounded-full w-1/3" />
              </div>
              <button className="w-full py-3 bg-verde-600 text-white font-semibold rounded-lg hover:bg-verde-700 transition-colors">
                Participar Agora
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={rafflesInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <Link to="/raffles">
              <button className="inline-flex items-center px-8 py-4 bg-laranja-600 text-white font-semibold rounded-lg hover:bg-laranja-700 transition-colors shadow-lg hover:shadow-xl">
                Ver Todos os Sorteios
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="py-16 bg-grafite-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Por que escolher nossa plataforma?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-grafite-300 max-w-3xl mx-auto"
            >
              Oferecemos as melhores ferramentas e recursos para seus
              investimentos em blockchain.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <motion.div
              variants={fadeInUp}
              whileHover={{ 
                scale: 1.02, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="bg-grafite-700 rounded-xl p-8 border border-grafite-600 hover:border-roxo-500 hover:shadow-xl hover:shadow-roxo-500/10 transition-all duration-300 group cursor-pointer"
            >
              <motion.div 
                className="inline-flex items-center justify-center w-12 h-12 bg-roxo-900 rounded-lg mb-6 group-hover:bg-roxo-800 transition-colors duration-300"
                whileHover={{ rotate: 5 }}
              >
                <Shield className="w-6 h-6 text-roxo-400 group-hover:text-roxo-300 transition-colors duration-300" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-roxo-300 transition-colors duration-300">
                Segurança Máxima
              </h3>
              <p className="text-grafite-300 group-hover:text-grafite-200 transition-colors duration-300">
                Todos os projetos passam por rigorosa auditoria de segurança
                antes de serem listados em nossa plataforma.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ 
                scale: 1.02, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="bg-grafite-700 rounded-xl p-8 border border-grafite-600 hover:border-verde-500 hover:shadow-xl hover:shadow-verde-500/10 transition-all duration-300 group cursor-pointer"
            >
              <motion.div 
                className="inline-flex items-center justify-center w-12 h-12 bg-verde-900 rounded-lg mb-6 group-hover:bg-verde-800 transition-colors duration-300"
                whileHover={{ rotate: 5 }}
              >
                <Users className="w-6 h-6 text-verde-400 group-hover:text-verde-300 transition-colors duration-300" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-verde-300 transition-colors duration-300">
                Comunidade Ativa
              </h3>
              <p className="text-grafite-300 group-hover:text-grafite-200 transition-colors duration-300">
                Faça parte de uma comunidade engajada de investidores e
                desenvolvedores blockchain.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ 
                scale: 1.02, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="bg-grafite-700 rounded-xl p-8 border border-grafite-600 hover:border-laranja-500 hover:shadow-xl hover:shadow-laranja-500/10 transition-all duration-300 group cursor-pointer"
            >
              <motion.div 
                className="inline-flex items-center justify-center w-12 h-12 bg-laranja-900 rounded-lg mb-6 group-hover:bg-laranja-800 transition-colors duration-300"
                whileHover={{ rotate: 5 }}
              >
                <Zap className="w-6 h-6 text-laranja-400 group-hover:text-laranja-300 transition-colors duration-300" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-laranja-300 transition-colors duration-300">
                Execução Rápida
              </h3>
              <p className="text-grafite-300 group-hover:text-grafite-200 transition-colors duration-300">
                Transações rápidas e eficientes com as melhores taxas do
                mercado.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Create Project CTA Section */}
      <section className="py-32 bg-gradient-to-r from-verde-900 to-azul-900">
        <motion.div 
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
              }
            }
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 50, scale: 0.8 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }
              }
            }}
            className="inline-flex items-center justify-center w-20 h-20 bg-verde-900/50 rounded-full mb-8 relative"
          >
            <motion.div
              className="absolute inset-0 bg-verde-400/20 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
                whileHover={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: 1.1,
                  transition: { duration: 0.5 }
                }}
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  rotate: {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <Rocket className="w-10 h-10 text-verde-400 relative z-10" />
              </motion.div>
          </motion.div>
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 30, rotateX: -15 },
              visible: { 
                opacity: 1, 
                y: 0, 
                rotateX: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 12
                }
              }
            }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white via-verde-100 to-white bg-clip-text text-transparent"
          >
            Tem um projeto inovador?
          </motion.h2>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
              visible: { 
                opacity: 1, 
                y: 0, 
                filter: "blur(0px)",
                transition: {
                  duration: 0.8,
                  ease: "easeOut"
                }
              }
            }}
            className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Lance seu projeto no Lunes Launchpad e alcance milhares de investidores.
            Nossa plataforma oferece todas as ferramentas necessárias para o sucesso do seu IDO.
          </motion.p>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 80,
                  damping: 12,
                  staggerChildren: 0.1
                }
              }
            }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link to="/criar-projeto">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
                whileFocus={{
                  scale: 1.02,
                  boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.3)"
                }}
                className="group inline-flex items-center px-8 py-4 bg-white text-verde-900 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-verde-400 focus:ring-offset-2 focus:ring-offset-verde-900"
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Rocket className="mr-2 w-5 h-5 group-hover:text-verde-700 transition-colors" />
                </motion.div>
                <span className="relative overflow-hidden">
                  <motion.span
                    className="block"
                    whileHover={{ y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    Criar Projeto
                  </motion.span>
                  <motion.span
                    className="absolute inset-0 block"
                    initial={{ y: 20 }}
                    whileHover={{ y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Vamos começar!
                  </motion.span>
                </span>
              </motion.button>
            </Link>
            <Link to="/listar-projeto">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "rgba(255,255,255,0.8)",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
                whileFocus={{
                  scale: 1.02,
                  boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.3)"
                }}
                className="group relative px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-verde-900"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 group-hover:text-white/90 transition-colors">
                  Ver Meus Projetos
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Investor CTA Section */}
      <section ref={ctaRef} className="relative py-20 overflow-hidden">
        {/* Background com gradientes e efeitos */}
        <div className="absolute inset-0 bg-gradient-to-r from-roxo-900 via-laranja-900 to-roxo-900" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-roxo-500/20 to-laranja-500/20" />
        
        {/* Orbes animados de fundo */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 left-10 w-32 h-32 bg-roxo-400/30 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-10 right-10 w-40 h-40 bg-laranja-400/20 rounded-full blur-xl"
        />
        
        {/* Padrão de grade sutil */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.1,
                  duration: 0.6
                }
              }
            }}
          >
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.9 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    duration: 0.8
                  }
                }
              }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              <motion.span 
                className="bg-gradient-to-r from-white via-roxo-100 to-white bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  backgroundSize: "200% 200%"
                }}
              >
                Pronto para começar sua jornada?
              </motion.span>
            </motion.h2>
            
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px)",
                  transition: {
                    type: "spring",
                    stiffness: 80,
                    damping: 20,
                    duration: 0.8
                  }
                }
              }}
              className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Conecte sua carteira e descubra as melhores oportunidades de
              investimento em blockchain.
            </motion.p>
            
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.8 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 120,
                    damping: 20,
                    duration: 0.9
                  }
                }
              }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <AnimatePresence mode="wait">
                {isReady ? (
                  <motion.div
                    key="connected"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 items-center"
                  >
                    <motion.div 
                      className="flex items-center space-x-3 text-verde-400 bg-verde-400/10 px-4 py-2 rounded-full border border-verde-400/30 backdrop-blur-sm"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)",
                        borderColor: "rgba(34, 197, 94, 0.6)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {/* Indicador de status com efeitos avançados */}
                      <motion.div className="relative">
                        {/* Círculo principal */}
                        <motion.div 
                          className="w-3 h-3 bg-verde-400 rounded-full relative z-10"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.8, 1]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        
                        {/* Ondas de pulso */}
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute inset-0 border-2 border-verde-400/40 rounded-full"
                            animate={{
                              scale: [1, 2.5, 1],
                              opacity: [0.6, 0, 0.6]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeOut",
                              delay: i * 0.4
                            }}
                          />
                        ))}
                        
                        {/* Brilho interno */}
                        <motion.div
                          className="absolute inset-0.5 bg-verde-300/60 rounded-full blur-sm"
                          animate={{
                            opacity: [0.3, 0.8, 0.3]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </motion.div>
                      
                      <span className="font-medium tracking-wide">Carteira Conectada</span>
                      
                      {/* Partículas de sucesso */}
                      <motion.div className="absolute inset-0 pointer-events-none">
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-verde-300 rounded-full"
                            style={{
                              left: `${25 + i * 15}%`,
                              top: `${40 + (i % 2) * 20}%`
                            }}
                            animate={{
                              y: [-3, 3, -3],
                              opacity: [0.4, 1, 0.4],
                              scale: [0.8, 1.2, 0.8]
                            }}
                            transition={{
                              duration: 1.8 + i * 0.2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: i * 0.3
                            }}
                          />
                        ))}
                      </motion.div>
                    </motion.div>
                    
                    <Link to="/projetos">
                      <motion.button 
                        className="relative px-8 py-4 bg-white text-roxo-900 font-semibold rounded-lg overflow-hidden group shadow-lg border-2 border-transparent"
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 25px 50px rgba(139, 69, 19, 0.4)",
                          borderColor: "rgba(139, 69, 19, 0.3)"
                        }}
                        whileTap={{ 
                          scale: 0.95,
                          boxShadow: "0 10px 20px rgba(139, 69, 19, 0.2)"
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        {/* Gradiente de fundo animado */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-roxo-100 via-laranja-100 to-roxo-100 opacity-0 group-hover:opacity-100"
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                        
                        {/* Efeito de brilho que se move */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
                          animate={{
                            x: ["-100%", "100%"]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        
                        {/* Partículas de fundo */}
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100"
                          transition={{ duration: 0.3 }}
                        >
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-roxo-400 rounded-full"
                              style={{
                                left: `${20 + i * 12}%`,
                                top: `${30 + (i % 2) * 40}%`
                              }}
                              animate={{
                                y: [-5, 5, -5],
                                opacity: [0.3, 1, 0.3],
                                scale: [0.8, 1.2, 0.8]
                              }}
                              transition={{
                                duration: 2 + i * 0.2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.1
                              }}
                            />
                          ))}
                        </motion.div>
                        
                        <span className="relative z-10 group-hover:text-roxo-800 transition-all duration-300 font-bold">
                          Explorar Projetos
                        </span>
                      </motion.button>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    key="disconnected"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 items-center"
                  >
                    <motion.div 
                      className="flex items-center space-x-3 text-grafite-300 bg-grafite-800/50 px-4 py-2 rounded-full border border-grafite-600/30 backdrop-blur-sm"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 8px 20px rgba(75, 85, 99, 0.4)",
                        borderColor: "rgba(156, 163, 175, 0.5)"
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {/* Indicador de desconectado com efeitos */}
                      <motion.div className="relative">
                        {/* Círculo principal */}
                        <motion.div 
                          className="w-3 h-3 bg-grafite-400 rounded-full relative z-10"
                          animate={{
                            opacity: [0.5, 1, 0.5],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        
                        {/* Efeito de "procurando conexão" */}
                        <motion.div
                          className="absolute inset-0 border-2 border-grafite-500/30 rounded-full"
                          animate={{
                            scale: [1, 1.8, 1],
                            opacity: [0.4, 0, 0.4]
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeOut"
                          }}
                        />
                        
                        {/* Brilho sutil */}
                        <motion.div
                          className="absolute inset-0.5 bg-grafite-300/30 rounded-full blur-sm"
                          animate={{
                            opacity: [0.2, 0.5, 0.2]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </motion.div>
                      
                      <span className="font-medium tracking-wide">Carteira Desconectada</span>
                      
                      {/* Partículas sutis de espera */}
                      <motion.div className="absolute inset-0 pointer-events-none">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-0.5 h-0.5 bg-grafite-400 rounded-full"
                            style={{
                              left: `${30 + i * 12}%`,
                              top: `${45 + (i % 2) * 10}%`
                            }}
                            animate={{
                              y: [-2, 2, -2],
                              opacity: [0.3, 0.7, 0.3]
                            }}
                            transition={{
                              duration: 2.2 + i * 0.3,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: i * 0.4
                            }}
                          />
                        ))}
                      </motion.div>
                    </motion.div>
                    
                    <motion.button
                      onClick={connect}
                      className="relative px-8 py-4 bg-gradient-to-r from-roxo-600 to-roxo-700 text-white font-semibold rounded-lg overflow-hidden group shadow-lg border-2 border-roxo-500/50"
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 25px 50px rgba(139, 69, 19, 0.5)",
                        borderColor: "rgba(255, 165, 0, 0.6)"
                      }}
                      whileTap={{ 
                        scale: 0.95,
                        boxShadow: "0 10px 20px rgba(139, 69, 19, 0.3)"
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {/* Gradiente de fundo principal */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-roxo-500 via-laranja-600 to-roxo-500 opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                      
                      {/* Efeito de ondas no clique */}
                      <motion.div
                        className="absolute inset-0 bg-white/10"
                        initial={{ scale: 0, opacity: 1 }}
                        whileTap={{
                          scale: [0, 1.5],
                          opacity: [0.8, 0]
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      
                      {/* Brilho animado contínuo */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                          x: ["-100%", "100%"]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Partículas douradas */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      >
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1.5 h-1.5 bg-laranja-300 rounded-full"
                            style={{
                              left: `${15 + i * 10}%`,
                              top: `${25 + (i % 3) * 25}%`
                            }}
                            animate={{
                              y: [-8, 8, -8],
                              opacity: [0.4, 1, 0.4],
                              scale: [0.6, 1.4, 0.6],
                              rotate: [0, 180, 360]
                            }}
                            transition={{
                              duration: 2.5 + i * 0.3,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: i * 0.15
                            }}
                          />
                        ))}
                      </motion.div>
                      
                      {/* Borda interna brilhante */}
                      <motion.div
                        className="absolute inset-1 border border-white/20 rounded-md opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      />
                      
                      <span className="relative z-10 font-bold tracking-wide">
                        Conectar Carteira
                      </span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
