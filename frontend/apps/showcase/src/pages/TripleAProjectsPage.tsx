import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  DollarSign,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Target,
  Award,
  Briefcase,
  AlertCircle,
  Send
} from 'lucide-react';

/**
 * Interface para os dados do formulário de projetos 3A
 */
interface TripleAFormData {
  // Informações da empresa
  companyName: string;
  companyWebsite: string;
  companySize: string;
  industry: string;
  
  // Informações do projeto
  projectName: string;
  projectDescription: string;
  projectBudget: string;
  expectedLaunchDate: string;
  
  // Informações de contato
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactPosition: string;
  
  // Necessidades específicas
  needsSmartContracts: boolean;
  needsMarketing: boolean;
  needsAudit: boolean;
  needsLegalSupport: boolean;
  additionalNeeds: string;
  
  // Experiência prévia
  previousWeb3Experience: string;
  hasRaisedBefore: boolean;
  previousRaisingAmount: string;
}

/**
 * Página para projetos Triple-A (3A) - Projetos institucionais de grande porte
 * Focada em empresas e projetos com orçamento mínimo de $150k USD
 */
export const TripleAProjectsPage: React.FC = () => {
  const [formData, setFormData] = useState<TripleAFormData>({
    companyName: '',
    companyWebsite: '',
    companySize: '',
    industry: '',
    projectName: '',
    projectDescription: '',
    projectBudget: '',
    expectedLaunchDate: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactPosition: '',
    needsSmartContracts: false,
    needsMarketing: false,
    needsAudit: false,
    needsLegalSupport: false,
    additionalNeeds: '',
    previousWeb3Experience: '',
    hasRaisedBefore: false,
    previousRaisingAmount: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<TripleAFormData>>({});

  /**
   * Atualiza os dados do formulário
   */
  const handleInputChange = (field: keyof TripleAFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Remove erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * Valida o formulário
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<TripleAFormData> = {};

    // Validações obrigatórias
    if (!formData.companyName.trim()) newErrors.companyName = 'Nome da empresa é obrigatório';
    if (!formData.companyWebsite.trim()) newErrors.companyWebsite = 'Website da empresa é obrigatório';
    if (!formData.projectName.trim()) newErrors.projectName = 'Nome do projeto é obrigatório';
    if (!formData.projectDescription.trim()) newErrors.projectDescription = 'Descrição do projeto é obrigatória';
    if (!formData.contactName.trim()) newErrors.contactName = 'Nome do contato é obrigatório';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Email é obrigatório';
    if (!formData.contactPosition.trim()) newErrors.contactPosition = 'Cargo é obrigatório';

    // Validação de orçamento mínimo
    const budget = parseFloat(formData.projectBudget.replace(/[^0-9.]/g, ''));
    if (!formData.projectBudget.trim()) {
      newErrors.projectBudget = 'Orçamento é obrigatório';
    } else if (isNaN(budget) || budget < 150000) {
      newErrors.projectBudget = 'Orçamento mínimo de $150,000 USD para projetos 3A';
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Submete o formulário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitSuccess(true);
      // Reset form after success
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          companyName: '',
          companyWebsite: '',
          companySize: '',
          industry: '',
          projectName: '',
          projectDescription: '',
          projectBudget: '',
          expectedLaunchDate: '',
          contactName: '',
          contactEmail: '',
          contactPhone: '',
          contactPosition: '',
          needsSmartContracts: false,
          needsMarketing: false,
          needsAudit: false,
          needsLegalSupport: false,
          additionalNeeds: '',
          previousWeb3Experience: '',
          hasRaisedBefore: false,
          previousRaisingAmount: ''
        });
      }, 3000);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Renderiza um campo de input
   */
  const renderInput = (
    field: keyof TripleAFormData,
    label: string,
    type: string = 'text',
    placeholder?: string,
    required: boolean = false
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={formData[field] as string}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-grafite-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
          errors[field]
            ? 'border-red-500 focus:ring-red-500'
            : 'border-grafite-600 focus:ring-roxo focus:border-roxo'
        }`}
      />
      {errors[field] && (
        <p className="text-red-400 text-sm flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors[field]}
        </p>
      )}
    </div>
  );

  /**
   * Renderiza um campo de textarea
   */
  const renderTextarea = (
    field: keyof TripleAFormData,
    label: string,
    placeholder?: string,
    required: boolean = false,
    rows: number = 4
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <textarea
        value={formData[field] as string}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 bg-grafite-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors resize-vertical ${
          errors[field]
            ? 'border-red-500 focus:ring-red-500'
            : 'border-grafite-600 focus:ring-roxo focus:border-roxo'
        }`}
      />
      {errors[field] && (
        <p className="text-red-400 text-sm flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors[field]}
        </p>
      )}
    </div>
  );

  /**
   * Renderiza um campo de select
   */
  const renderSelect = (
    field: keyof TripleAFormData,
    label: string,
    options: { value: string; label: string }[],
    required: boolean = false
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <select
        value={formData[field] as string}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className={`w-full px-4 py-3 bg-grafite-800 border rounded-lg text-white focus:outline-none focus:ring-2 transition-colors ${
          errors[field]
            ? 'border-red-500 focus:ring-red-500'
            : 'border-grafite-600 focus:ring-roxo focus:border-roxo'
        }`}
      >
        <option value="">Selecione uma opção</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[field] && (
        <p className="text-red-400 text-sm flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors[field]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-grafite-900 via-grafite-800 to-roxo-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-roxo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-azul-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-verde-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-roxo-500/20 to-azul-500/20 rounded-full border border-roxo-500/30 mb-6">
              <Award className="w-5 h-5 text-roxo-400 mr-2" />
              <span className="text-roxo-300 font-medium">Projetos Triple-A</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Projetos
              <span className="bg-gradient-to-r from-roxo-400 to-azul-400 bg-clip-text text-transparent"> Institucionais</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Para empresas e projetos de grande porte que querem aproveitar ao máximo o poder da captação Web3 na Rede Lunes, com orçamento mínimo de <span className="text-verde-400 font-semibold">$150,000 USD</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="#formulario"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-roxo to-azul text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Iniciar Projeto 3A
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.a>
              
              <motion.a
                href="#beneficios"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-roxo text-roxo font-semibold rounded-lg hover:bg-roxo hover:text-white transition-all duration-300"
              >
                Saiba Mais
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: DollarSign, value: '$50M+', label: 'Capital Levantado', color: 'text-verde-400' },
              { icon: Building2, value: '200+', label: 'Empresas Atendidas', color: 'text-azul-400' },
              { icon: Users, value: '50+', label: 'Especialistas', color: 'text-roxo-400' },
              { icon: TrendingUp, value: '95%', label: 'Taxa de Sucesso', color: 'text-amarelo-400' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-grafite-800/50 rounded-xl border border-grafite-700"
              >
                <stat.icon className={`w-12 h-12 ${stat.color} mx-auto mb-4`} />
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Por que escolher
              <span className="bg-gradient-to-r from-roxo-400 to-azul-400 bg-clip-text text-transparent"> Projetos 3A</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Oferecemos suporte completo e especializado para projetos institucionais de grande porte
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Auditoria Completa',
                description: 'Smart contracts auditados por empresas certificadas e reconhecidas no mercado'
              },
              {
                icon: Users,
                title: 'Equipe Especializada',
                description: 'Profissionais experientes em desenvolvimento, marketing e lançamento de projetos Web3'
              },
              {
                icon: Zap,
                title: 'Desenvolvimento Ágil',
                description: 'Metodologias ágeis para entrega rápida e eficiente do seu projeto'
              },
              {
                icon: Globe,
                title: 'Marketing Global',
                description: 'Estratégias de marketing para alcance global e máxima visibilidade'
              },
              {
                icon: Target,
                title: 'Captação Otimizada',
                description: 'Estratégias avançadas para maximizar a captação de recursos'
              },
              {
                icon: Award,
                title: 'Suporte Premium',
                description: 'Suporte dedicado 24/7 durante todo o processo de lançamento'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 bg-grafite-800/50 rounded-xl border border-grafite-700 hover:border-roxo-500/50 transition-all duration-300"
              >
                <benefit.icon className="w-12 h-12 text-roxo-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulário */}
      <section id="formulario" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Vamos conversar sobre seu
              <span className="bg-gradient-to-r from-roxo-400 to-azul-400 bg-clip-text text-transparent"> projeto</span>
            </h2>
            <p className="text-xl text-gray-300">
              Preencha o formulário e nossa equipe entrará em contato em até 24 horas
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-grafite-800/50 rounded-2xl border border-grafite-700 p-8"
          >
            <AnimatePresence mode="wait">
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="w-16 h-16 text-verde-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">Formulário Enviado!</h3>
                  <p className="text-gray-300 mb-6">
                    Recebemos suas informações. Nossa equipe entrará em contato em até 24 horas.
                  </p>
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      projetos3a@lunes.io
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      +55 (11) 9999-9999
                    </div>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Informações da Empresa */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <Building2 className="w-6 h-6 mr-2 text-roxo-400" />
                      Informações da Empresa
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {renderInput('companyName', 'Nome da Empresa', 'text', 'Ex: Lunes Asset Management', true)}
                      {renderInput('companyWebsite', 'Website da Empresa', 'url', 'https://exemplo.com', true)}
                      {renderSelect('companySize', 'Tamanho da Empresa', [
                        { value: '1-10', label: '1-10 funcionários' },
                        { value: '11-50', label: '11-50 funcionários' },
                        { value: '51-200', label: '51-200 funcionários' },
                        { value: '201-1000', label: '201-1000 funcionários' },
                        { value: '1000+', label: 'Mais de 1000 funcionários' }
                      ])}
                      {renderSelect('industry', 'Setor de Atuação', [
                        { value: 'fintech', label: 'Fintech' },
                        { value: 'blockchain', label: 'Blockchain/Crypto' },
                        { value: 'gaming', label: 'Gaming' },
                        { value: 'defi', label: 'DeFi' },
                        { value: 'nft', label: 'NFT/Metaverse' },
                        { value: 'enterprise', label: 'Enterprise' },
                        { value: 'other', label: 'Outro' }
                      ])}
                    </div>
                  </div>

                  {/* Informações do Projeto */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <Target className="w-6 h-6 mr-2 text-azul-400" />
                      Informações do Projeto
                    </h3>
                    <div className="space-y-6">
                      {renderInput('projectName', 'Nome do Projeto', 'text', 'Ex: Lunes DeFi Protocol', true)}
                      {renderTextarea('projectDescription', 'Descrição do Projeto', 'Descreva seu projeto, objetivos e como ele se diferencia no mercado...', true, 6)}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderInput('projectBudget', 'Orçamento do Projeto (USD)', 'text', 'Ex: $500,000', true)}
                        {renderInput('expectedLaunchDate', 'Data Prevista de Lançamento', 'date')}
                      </div>
                    </div>
                  </div>

                  {/* Informações de Contato */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <Mail className="w-6 h-6 mr-2 text-verde-400" />
                      Informações de Contato
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {renderInput('contactName', 'Nome Completo', 'text', 'Ex: João Silva', true)}
                      {renderInput('contactEmail', 'Email', 'email', 'joao@empresa.com', true)}
                      {renderInput('contactPhone', 'Telefone', 'tel', '+55 (11) 99999-9999')}
                      {renderInput('contactPosition', 'Cargo na Empresa', 'text', 'Ex: CEO, CTO, Founder', true)}
                    </div>
                  </div>

                  {/* Necessidades Específicas */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <Zap className="w-6 h-6 mr-2 text-amarelo-400" />
                      Necessidades Específicas
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: 'needsSmartContracts', label: 'Desenvolvimento de Smart Contracts' },
                          { key: 'needsMarketing', label: 'Marketing e Lançamento' },
                          { key: 'needsAudit', label: 'Auditoria de Segurança' },
                          { key: 'needsLegalSupport', label: 'Suporte Jurídico' }
                        ].map((need) => (
                          <label key={need.key} className="flex items-center space-x-3 p-4 bg-grafite-700/50 rounded-lg border border-grafite-600 hover:border-roxo-500/50 transition-colors cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData[need.key as keyof TripleAFormData] as boolean}
                              onChange={(e) => handleInputChange(need.key as keyof TripleAFormData, e.target.checked)}
                              className="w-5 h-5 text-roxo-500 bg-grafite-800 border-grafite-600 rounded focus:ring-roxo-500 focus:ring-2"
                            />
                            <span className="text-white">{need.label}</span>
                          </label>
                        ))}
                      </div>
                      {renderTextarea('additionalNeeds', 'Necessidades Adicionais', 'Descreva outras necessidades específicas do seu projeto...')}
                    </div>
                  </div>

                  {/* Experiência Prévia */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <Award className="w-6 h-6 mr-2 text-roxo-400" />
                      Experiência Prévia
                    </h3>
                    <div className="space-y-6">
                      {renderSelect('previousWeb3Experience', 'Experiência com Web3/Blockchain', [
                        { value: 'none', label: 'Nenhuma experiência' },
                        { value: 'basic', label: 'Conhecimento básico' },
                        { value: 'intermediate', label: 'Experiência intermediária' },
                        { value: 'advanced', label: 'Experiência avançada' },
                        { value: 'expert', label: 'Especialista' }
                      ])}
                      
                      <div className="space-y-4">
                        <label className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={formData.hasRaisedBefore}
                            onChange={(e) => handleInputChange('hasRaisedBefore', e.target.checked)}
                            className="w-5 h-5 text-roxo-500 bg-grafite-800 border-grafite-600 rounded focus:ring-roxo-500 focus:ring-2"
                          />
                          <span className="text-white">Já realizou captação de recursos anteriormente</span>
                        </label>
                        
                        {formData.hasRaisedBefore && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            {renderInput('previousRaisingAmount', 'Valor da Captação Anterior (USD)', 'text', 'Ex: $1,000,000')}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Botão de Envio */}
                  <div className="pt-6">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      className={`w-full py-4 px-8 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center ${
                        isSubmitting
                          ? 'bg-grafite-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-roxo to-azul hover:shadow-lg'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Enviar Proposta
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Contato Direto */}
      <section className="py-16 px-4 bg-grafite-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">Prefere falar diretamente conosco?</h3>
            <p className="text-gray-300 mb-8">Nossa equipe está disponível para esclarecer dúvidas e discutir seu projeto</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center space-x-3 p-4 bg-grafite-800/50 rounded-lg">
                <Mail className="w-6 h-6 text-roxo-400" />
                <div className="text-left">
                  <div className="text-white font-medium">Email</div>
                  <div className="text-gray-400 text-sm">projetos3a@lunes.io</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-3 p-4 bg-grafite-800/50 rounded-lg">
                <Phone className="w-6 h-6 text-azul-400" />
                <div className="text-left">
                  <div className="text-white font-medium">Telefone</div>
                  <div className="text-gray-400 text-sm">+55 (11) 9999-9999</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-3 p-4 bg-grafite-800/50 rounded-lg">
                <Calendar className="w-6 h-6 text-verde-400" />
                <div className="text-left">
                  <div className="text-white font-medium">Horário</div>
                  <div className="text-gray-400 text-sm">Seg-Sex, 9h-18h</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TripleAProjectsPage;