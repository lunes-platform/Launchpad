import React, { useState } from "react";
import { Card, Button } from "@launchpad/shared-ui";
import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  Bug, 
  MessageSquare, 
  Send, 
  CheckCircle,
  FileText,
  User,
  Mail,
  Phone,
  ArrowLeft,
  Shield,
  Lightbulb,
  Clock,
  Star,
  HelpCircle
} from "lucide-react";
import { Link } from "react-router-dom";

interface ReportFormData {
  type: 'bug' | 'feature' | 'security' | 'other';
  title: string;
  description: string;
  email: string;
  name: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  steps?: string;
  expectedBehavior?: string;
  actualBehavior?: string;
}

const ReportPage: React.FC = () => {
  const [formData, setFormData] = useState<ReportFormData>({
    type: 'bug',
    title: '',
    description: '',
    email: '',
    name: '',
    priority: 'medium',
    steps: '',
    expectedBehavior: '',
    actualBehavior: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envio do relatório
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleInputChange = (field: keyof ReportFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const reportTypes = [
    { 
      value: 'bug', 
      label: 'Bug/Erro', 
      icon: Bug, 
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      hoverBg: 'hover:bg-red-500/20',
      description: 'Reporte problemas técnicos ou comportamentos inesperados'
    },
    { 
      value: 'feature', 
      label: 'Sugestão', 
      icon: Lightbulb, 
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      hoverBg: 'hover:bg-blue-500/20',
      description: 'Sugira melhorias ou novas funcionalidades'
    },
    { 
      value: 'security', 
      label: 'Segurança', 
      icon: Shield, 
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      hoverBg: 'hover:bg-orange-500/20',
      description: 'Reporte vulnerabilidades ou questões de segurança'
    },
    { 
      value: 'other', 
      label: 'Outro', 
      icon: FileText, 
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      hoverBg: 'hover:bg-purple-500/20',
      description: 'Outros tipos de feedback ou questões'
    }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Baixa', color: 'text-green-400', bgColor: 'bg-green-500/10' },
    { value: 'medium', label: 'Média', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
    { value: 'high', label: 'Alta', color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
    { value: 'critical', label: 'Crítica', color: 'text-red-400', bgColor: 'bg-red-500/10' }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-grafite-900 via-grafite-800 to-grafite-900 p-4 md:p-8">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center min-h-[80vh]"
          >
            <Card className="p-8 md:p-12 text-center bg-grafite-800/80 backdrop-blur-sm border-grafite-700/50 shadow-2xl max-w-2xl w-full">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Relatório Enviado com Sucesso!
                </h1>
                <p className="text-lg text-gray-300 mb-2">
                  Obrigado por nos ajudar a melhorar a plataforma.
                </p>
                <p className="text-gray-400 mb-8">
                  Nossa equipe irá analisar seu relatório e entrar em contato em até 24 horas.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      type: 'bug',
                      title: '',
                      description: '',
                      email: '',
                      name: '',
                      priority: 'medium',
                      steps: '',
                      expectedBehavior: '',
                      actualBehavior: ''
                    });
                    setCurrentStep(1);
                  }}
                  variant="outline"
                  className="border-laranja-500/50 text-laranja-400 hover:bg-laranja-500/10 hover:border-laranja-500 transition-all duration-300"
                >
                  Enviar Outro Relatório
                </Button>
                <Link to="/">
                  <Button className="bg-gradient-to-r from-laranja-500 to-rosa-500 hover:from-laranja-600 hover:to-rosa-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar ao Início
                  </Button>
                </Link>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-grafite-900 via-grafite-800 to-grafite-900 p-4 md:p-8">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Voltar
            </Link>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="p-4 bg-gradient-to-r from-laranja-500/20 to-rosa-500/20 rounded-2xl shadow-lg">
                <AlertTriangle className="w-8 h-8 text-laranja-500" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Reportar Problema
                </h1>
                <p className="text-gray-400 text-lg">
                  Encontrou um bug ou tem uma sugestão? Nos ajude a melhorar a plataforma.
                </p>
              </div>
            </motion.div>

            {/* Progress Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center mb-8"
            >
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      currentStep >= step 
                        ? 'bg-gradient-to-r from-laranja-500 to-rosa-500 text-white' 
                        : 'bg-grafite-700 text-gray-400'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-12 h-0.5 mx-2 transition-all ${
                        currentStep > step ? 'bg-gradient-to-r from-laranja-500 to-rosa-500' : 'bg-grafite-700'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 md:p-8 bg-grafite-800/80 backdrop-blur-sm border-grafite-700/50 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Tipo de Problema */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-white mb-2">Qual tipo de problema você encontrou?</h2>
                      <p className="text-gray-400">Selecione a categoria que melhor descreve sua situação</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reportTypes.map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <motion.div
                            key={type.value}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <label
                              className={`relative flex items-start p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                formData.type === type.value
                                  ? `${type.borderColor} ${type.bgColor} shadow-lg`
                                  : `border-grafite-600 bg-grafite-700/30 ${type.hoverBg} hover:border-grafite-500`
                              }`}
                            >
                              <input
                                type="radio"
                                name="type"
                                value={type.value}
                                checked={formData.type === type.value}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'bug' | 'feature' | 'security' | 'other' })}
                                className="sr-only"
                              />
                              <div className="flex items-start gap-4 w-full">
                                <div className={`p-3 rounded-lg ${type.bgColor} ${type.borderColor} border`}>
                                  <IconComponent className={`w-6 h-6 ${type.color}`} />
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-white text-lg mb-1">{type.label}</div>
                                  <div className="text-sm text-gray-400 leading-relaxed">{type.description}</div>
                                </div>
                              </div>
                            </label>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="flex justify-end pt-6">
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="px-8 py-3 bg-gradient-to-r from-laranja-500 to-rosa-500 hover:from-laranja-600 hover:to-rosa-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Continuar
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Informações Básicas */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-white mb-2">Informações Básicas</h2>
                      <p className="text-gray-400">Nos conte um pouco sobre você e o problema</p>
                    </div>

                    {/* Informações Pessoais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          <User className="w-4 h-4 inline mr-2" />
                          Seu Nome Completo *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-grafite-700/50 border border-grafite-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-laranja-500 focus:border-transparent transition-all duration-300"
                          placeholder="Digite seu nome completo"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Seu E-mail *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 bg-grafite-700/50 border border-grafite-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-laranja-500 focus:border-transparent transition-all duration-300"
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Título e Prioridade */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Título do Problema *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-4 py-3 bg-grafite-700/50 border border-grafite-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-laranja-500 focus:border-transparent transition-all duration-300"
                          placeholder="Descreva brevemente o problema"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          <Star className="w-4 h-4 inline mr-2" />
                          Prioridade
                        </label>
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' | 'critical' })}
                          className="w-full px-4 py-3 bg-grafite-700/50 border border-grafite-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-laranja-500 focus:border-transparent transition-all duration-300"
                        >
                          {priorityOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-between pt-6">
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        variant="outline"
                        className="px-6 py-3 border-grafite-600 text-gray-400 hover:bg-grafite-700 hover:text-white transition-all duration-300"
                      >
                        Voltar
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        disabled={!formData.name || !formData.email || !formData.title}
                        className="px-8 py-3 bg-gradient-to-r from-laranja-500 to-rosa-500 hover:from-laranja-600 hover:to-rosa-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continuar
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Detalhes */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-white mb-2">Detalhes do Problema</h2>
                      <p className="text-gray-400">Quanto mais detalhes, melhor poderemos ajudar</p>
                    </div>

                    {/* Descrição Principal */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        <FileText className="w-4 h-4 inline mr-2" />
                        Descrição Detalhada *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 bg-grafite-700/50 border border-grafite-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-laranja-500 focus:border-transparent transition-all duration-300 resize-none"
                        placeholder="Descreva o problema em detalhes..."
                        required
                      />
                    </div>

                    {/* Campos específicos para bugs */}
                    {formData.type === 'bug' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            Passos para Reproduzir
                          </label>
                          <textarea
                            value={formData.steps}
                            onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 bg-grafite-700/50 border border-grafite-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-laranja-500 focus:border-transparent transition-all duration-300 resize-none"
                            placeholder="1. Faça isso...&#10;2. Depois isso...&#10;3. O erro acontece..."
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300">
                            Comportamento Esperado vs Atual
                          </label>
                          <textarea
                            value={formData.expectedBehavior}
                            onChange={(e) => setFormData({ ...formData, expectedBehavior: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 bg-grafite-700/50 border border-grafite-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-laranja-500 focus:border-transparent transition-all duration-300 resize-none"
                            placeholder="Esperado: Deveria fazer X...&#10;Atual: Mas faz Y..."
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between pt-6">
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        variant="outline"
                        className="px-6 py-3 border-grafite-600 text-gray-400 hover:bg-grafite-700 hover:text-white transition-all duration-300"
                      >
                        Voltar
                      </Button>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          disabled={isSubmitting || !formData.description}
                          className="px-8 py-3 bg-gradient-to-r from-laranja-500 to-rosa-500 hover:from-laranja-600 hover:to-rosa-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Enviar Relatório
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </form>
            </Card>
          </motion.div>

          {/* Informações de Suporte */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8"
          >
            <Card className="p-6 bg-grafite-800/50 backdrop-blur-sm border-grafite-700/50">
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle className="w-5 h-5 text-laranja-500" />
                <h3 className="text-lg font-semibold text-white">
                  Outras Formas de Contato
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-grafite-700/50 rounded-lg">
                  <Mail className="w-5 h-5 text-laranja-500" />
                  <div>
                    <div className="text-sm font-medium text-white">E-mail</div>
                    <div className="text-sm text-gray-400">suporte@launchpad.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-grafite-700/50 rounded-lg">
                  <Phone className="w-5 h-5 text-laranja-500" />
                  <div>
                    <div className="text-sm font-medium text-white">Telefone</div>
                    <div className="text-sm text-gray-400">+55 (11) 9999-9999</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-grafite-700/50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-laranja-500" />
                  <div>
                    <div className="text-sm font-medium text-white">Chat</div>
                    <div className="text-sm text-gray-400">Segunda a Sexta, 9h-18h</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportPage;