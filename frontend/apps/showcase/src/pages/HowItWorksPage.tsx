import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Rocket,
  Target,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  DollarSign,
  Clock,
  BarChart3,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@launchpad/shared-ui';
import { useNavigate } from 'react-router-dom';

/**
 * Página detalhada sobre como lançar projetos na Lunes Launchpad
 * Explica o processo, benefícios e vantagens para atrair novos projetos
 */
export function HowItWorksPage() {
  const navigate = useNavigate();
  
  // Refs para animações
  const heroRef = useRef(null);
  const processRef = useRef(null);
  const benefitsRef = useRef(null);
  const whyChooseRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);
  
  // InView hooks para animações
  const heroInView = useInView(heroRef, { once: true });
  const processInView = useInView(processRef, { once: true });
  const benefitsInView = useInView(benefitsRef, { once: true });
  const whyChooseInView = useInView(whyChooseRef, { once: true });
  const statsInView = useInView(statsRef, { once: true });
  const ctaInView = useInView(ctaRef, { once: true });

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
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

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Dados do processo de lançamento
  const launchProcess = [
    {
      step: '01',
      title: 'Submissão do Projeto',
      description: 'Envie sua proposta detalhada com whitepaper, tokenomics e roadmap.',
      icon: Rocket,
      details: [
        'Documentação técnica completa',
        'Análise de tokenomics',
        'Roadmap detalhado',
        'Informações da equipe',
      ],
    },
    {
      step: '02',
      title: 'Análise e Due Diligence',
      description: 'Nossa equipe realiza uma análise completa do projeto e da equipe.',
      icon: Shield,
      details: [
        'Auditoria técnica',
        'Verificação da equipe',
        'Análise de mercado',
        'Avaliação de riscos',
      ],
    },
    {
      step: '03',
      title: 'Preparação do Lançamento',
      description: 'Configuração da campanha, marketing e preparação da comunidade.',
      icon: Target,
      details: [
        'Estratégia de marketing',
        'Configuração técnica',
        'Preparação da comunidade',
        'Definição de métricas',
      ],
    },
    {
      step: '04',
      title: 'Lançamento e Suporte',
      description: 'Lançamento oficial com suporte contínuo e acompanhamento.',
      icon: TrendingUp,
      details: [
        'Lançamento coordenado',
        'Suporte técnico 24/7',
        'Monitoramento em tempo real',
        'Suporte pós-lançamento',
      ],
    },
  ];

  // Benefícios de lançar na Lunes Launchpad
  const benefits = [
    {
      icon: Users,
      title: 'Comunidade Ativa',
      description: 'Acesso a uma comunidade engajada de mais de 50.000 investidores ativos.',
      highlight: '50K+ Investidores',
    },
    {
      icon: Globe,
      title: 'Alcance Global',
      description: 'Exposição internacional com suporte a múltiplas linguagens e regiões.',
      highlight: 'Alcance Mundial',
    },
    {
      icon: Zap,
      title: 'Tecnologia Avançada',
      description: 'Infraestrutura robusta e segura baseada na blockchain Lunes.',
      highlight: 'Tech de Ponta',
    },
    {
      icon: DollarSign,
      title: 'Taxas Competitivas',
      description: 'Estrutura de taxas transparente e competitiva no mercado.',
      highlight: 'Taxas Baixas',
    },
    {
      icon: BarChart3,
      title: 'Analytics Avançado',
      description: 'Ferramentas completas de análise e relatórios em tempo real.',
      highlight: 'Dados Precisos',
    },
    {
      icon: Award,
      title: 'Suporte Especializado',
      description: 'Equipe dedicada de especialistas para apoiar seu projeto.',
      highlight: 'Suporte 24/7',
    },
  ];

  // Por que escolher a Lunes Launchpad
  const whyChooseUs = [
    {
      title: 'Histórico Comprovado',
      description: 'Mais de 100 projetos lançados com sucesso e $50M+ arrecadados.',
      stat: '100+',
      label: 'Projetos Lançados',
    },
    {
      title: 'Taxa de Sucesso Alta',
      description: '95% dos projetos atingem seus objetivos de arrecadação.',
      stat: '95%',
      label: 'Taxa de Sucesso',
    },
    {
      title: 'Tempo de Lançamento',
      description: 'Processo otimizado que reduz o tempo de lançamento em 60%.',
      stat: '60%',
      label: 'Mais Rápido',
    },
    {
      title: 'ROI Médio',
      description: 'Projetos lançados apresentam ROI médio de 300% para investidores.',
      stat: '300%',
      label: 'ROI Médio',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-grafite-900 via-grafite-800 to-grafite-900">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-roxo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-verde-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div variants={staggerItem} className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-roxo-500/20 to-verde-400/20 text-sm font-medium text-white border border-roxo-500/30">
                <Lightbulb className="w-4 h-4 mr-2" />
                Plataforma Líder em IDOs
              </span>
            </motion.div>

            <motion.h1
              variants={staggerItem}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-roxo-400 via-roxo-300 to-verde-400 bg-clip-text text-transparent">
                Lance Seu Projeto
              </span>
              <br />
              <span className="text-white">na Lunes Launchpad</span>
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="text-xl md:text-2xl text-grafite-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              A plataforma mais confiável e inovadora para lançar seu projeto blockchain.
              Conecte-se com investidores globais e transforme sua ideia em realidade.
            </motion.p>

            <motion.div
              variants={staggerItem}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                onClick={() => navigate('/criar-projeto')}
                className="bg-gradient-to-r from-roxo-500 to-roxo-600 hover:from-roxo-600 hover:to-roxo-700 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-roxo-500/25"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Lançar Meu Projeto
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  const processSection = document.getElementById('processo');
                  processSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-2 border-verde-400 text-verde-400 hover:bg-verde-400 hover:text-grafite-900 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
              >
                Como Funciona
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Processo de Lançamento */}
      <section id="processo" ref={processRef} className="py-20 bg-grafite-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={processInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Como Funciona o
              <span className="bg-gradient-to-r from-roxo-400 to-verde-400 bg-clip-text text-transparent ml-3">
                Processo
              </span>
            </h2>
            <p className="text-xl text-grafite-300 max-w-3xl mx-auto">
              Um processo simples e transparente para levar seu projeto ao mercado
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={processInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {launchProcess.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="relative group"
                >
                  <div className="bg-gradient-to-br from-grafite-700 to-grafite-800 rounded-2xl p-6 border border-grafite-600 hover:border-roxo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-roxo-500/10 h-full">
                    {/* Step Number */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-roxo-500 to-verde-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {step.step}
                    </div>

                    {/* Icon */}
                    <div className="mb-4 mt-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-roxo-500/20 to-verde-400/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-roxo-400" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-grafite-300 mb-4 leading-relaxed">{step.description}</p>

                    {/* Details */}
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center text-sm text-grafite-400">
                          <CheckCircle className="w-4 h-4 text-verde-400 mr-2 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Connector Line */}
                  {index < launchProcess.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-roxo-500 to-verde-400 transform -translate-y-1/2" />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Benefícios */}
      <section ref={benefitsRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={benefitsInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Por Que Escolher a
              <span className="bg-gradient-to-r from-roxo-400 to-verde-400 bg-clip-text text-transparent ml-3">
                Lunes Launchpad
              </span>
            </h2>
            <p className="text-xl text-grafite-300 max-w-3xl mx-auto">
              Benefícios exclusivos que fazem a diferença no sucesso do seu projeto
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={benefitsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-grafite-700 to-grafite-800 rounded-2xl p-8 border border-grafite-600 hover:border-roxo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-roxo-500/10 h-full">
                    {/* Icon */}
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-roxo-500/20 to-verde-400/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-roxo-400" />
                      </div>
                    </div>

                    {/* Highlight Badge */}
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-verde-400/20 to-verde-500/20 text-verde-400 text-sm font-semibold rounded-full border border-verde-400/30">
                        {benefit.highlight}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                    <p className="text-grafite-300 leading-relaxed">{benefit.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Estatísticas */}
      <section ref={statsRef} className="py-20 bg-gradient-to-r from-roxo-900/20 to-verde-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="text-center group"
              >
                <div className="bg-gradient-to-br from-grafite-700/50 to-grafite-800/50 rounded-2xl p-8 border border-grafite-600 hover:border-roxo-500/50 transition-all duration-300 backdrop-blur-sm">
                  <div className="mb-4">
                    <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-roxo-400 to-verde-400 bg-clip-text text-transparent">
                      {item.stat}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.label}</h3>
                  <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                  <p className="text-grafite-300 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section ref={ctaRef} className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="bg-gradient-to-r from-roxo-600 to-verde-500 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-roxo-600/90 to-verde-500/90" />
              <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            </div>

            <div className="relative z-10">
              <Star className="w-12 h-12 text-white mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Pronto para Lançar Seu Projeto?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Junte-se aos projetos de sucesso que escolheram a Lunes Launchpad.
                Comece sua jornada hoje mesmo!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/criar-projeto')}
                  className="bg-white text-roxo-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Começar Agora
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/projetos')}
                  className="border-2 border-white text-white hover:bg-white hover:text-roxo-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
                >
                  Ver Projetos Ativos
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default HowItWorksPage;