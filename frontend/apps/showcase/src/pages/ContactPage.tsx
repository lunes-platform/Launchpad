import React, { useState } from "react";
import { Card } from "@launchpad/shared-ui";
import { motion } from "framer-motion";
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Users,
  Shield,
  Headphones,
  Code,
  TrendingUp,
  FileText,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";

interface ContactForm {
  name: string;
  email: string;
  department: string;
  subject: string;
  message: string;
  priority: string;
}

interface Department {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    department: "",
    subject: "",
    message: "",
    priority: "medium"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const departments: Department[] = [
    {
      id: "support",
      name: "Suporte Técnico",
      description: "Problemas com a plataforma, carteiras, transações",
      icon: Headphones,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      id: "projects",
      name: "Projetos & IDOs",
      description: "Dúvidas sobre projetos, participação em IDOs",
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      id: "kyc",
      name: "KYC & Verificação",
      description: "Problemas com verificação de identidade",
      icon: Shield,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10"
    },
    {
      id: "partnerships",
      name: "Parcerias",
      description: "Propostas de parceria e colaboração",
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      id: "technical",
      name: "Desenvolvimento",
      description: "Questões técnicas, APIs, integrações",
      icon: Code,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10"
    },
    {
      id: "general",
      name: "Geral",
      description: "Outras questões e informações gerais",
      icon: MessageSquare,
      color: "text-gray-400",
      bgColor: "bg-gray-500/10"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simular envio do formulário
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui você faria a chamada real para a API
      console.log("Formulário enviado:", formData);
      
      setSubmitStatus('success');
      setFormData({
        name: "",
        email: "",
        department: "",
        subject: "",
        message: "",
        priority: "medium"
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const isFormValid = formData.name && formData.email && formData.department && formData.subject && formData.message;



  return (
    <div className="min-h-screen bg-grafite-900 p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-laranja-500/20 to-rosa-500/20 rounded-xl">
                <MessageSquare className="w-8 h-8 text-laranja-500" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Entre em Contato
                </h1>
                <p className="text-gray-400 mt-1">
                  Estamos aqui para ajudar. Envie sua mensagem e responderemos em breve.
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                <Card className="p-6 md:p-8 bg-grafite-800 border-grafite-700">
                  <h2 className="text-2xl font-bold text-white mb-6">Enviar Mensagem</h2>
                  
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-green-400 font-medium">Mensagem enviada com sucesso!</p>
                        <p className="text-green-300 text-sm">Responderemos em até 24 horas.</p>
                      </div>
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <div>
                        <p className="text-red-400 font-medium">Erro ao enviar mensagem</p>
                        <p className="text-red-300 text-sm">Tente novamente ou use outro método de contato.</p>
                      </div>
                    </motion.div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nome e Email */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-grafite-700 border border-grafite-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-laranja-500 focus:border-transparent transition-all"
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-grafite-700 border border-grafite-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-laranja-500 focus:border-transparent transition-all"
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>

                    {/* Departamento */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Departamento *
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-grafite-700 border border-grafite-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-laranja-500 focus:border-transparent transition-all"
                      >
                        <option value="">Selecione um departamento</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Prioridade e Assunto */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Prioridade
                        </label>
                        <select
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-grafite-700 border border-grafite-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-laranja-500 focus:border-transparent transition-all"
                        >
                          <option value="low">Baixa</option>
                          <option value="medium">Média</option>
                          <option value="high">Alta</option>
                          <option value="urgent">Urgente</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Assunto *
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-grafite-700 border border-grafite-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-laranja-500 focus:border-transparent transition-all"
                          placeholder="Descreva brevemente sua questão"
                        />
                      </div>
                    </div>

                    {/* Mensagem */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Mensagem *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-grafite-700 border border-grafite-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-laranja-500 focus:border-transparent transition-all resize-none"
                        placeholder="Descreva sua questão ou problema em detalhes. Inclua informações relevantes como endereço da carteira, ID da transação, etc."
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      whileHover={{ scale: isFormValid && !isSubmitting ? 1.02 : 1 }}
                      whileTap={{ scale: isFormValid && !isSubmitting ? 0.98 : 1 }}
                      className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                        isFormValid && !isSubmitting
                          ? 'bg-gradient-to-r from-laranja-500 to-rosa-500 hover:from-laranja-600 hover:to-rosa-600 text-white'
                          : 'bg-grafite-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Enviar Mensagem
                        </>
                      )}
                    </motion.button>
                  </form>
                </Card>
              </motion.div>
            </div>

            {/* Contact Info & Departments */}
            <div className="space-y-6">
              {/* Contact Methods */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Card className="p-6 bg-grafite-800 border-grafite-700">
                  <h3 className="text-xl font-bold text-white mb-4">Outros Meios de Contato</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Email</p>
                        <p className="text-gray-400 text-sm">suporte@launchpad.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Telegram</p>
                        <p className="text-gray-400 text-sm">@LunesLaunchpadSupport</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Phone className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">WhatsApp</p>
                        <p className="text-gray-400 text-sm">+55 11 9999-9999</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Business Hours */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Card className="p-6 bg-grafite-800 border-grafite-700">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-laranja-500" />
                    Horário de Atendimento
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Segunda - Sexta</span>
                      <span className="text-white">9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Sábado</span>
                      <span className="text-white">9:00 - 14:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Domingo</span>
                      <span className="text-gray-400">Fechado</span>
                    </div>
                    <div className="pt-3 border-t border-grafite-600">
                      <p className="text-sm text-gray-400">
                        <strong className="text-laranja-400">Suporte 24/7</strong> disponível por email para questões urgentes.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Departments Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Card className="p-6 bg-grafite-800 border-grafite-700">
                  <h3 className="text-xl font-bold text-white mb-4">Departamentos</h3>
                  <div className="space-y-3">
                    {departments.slice(0, 4).map(dept => {
                      const IconComponent = dept.icon;
                      return (
                        <div key={dept.id} className="flex items-start gap-3">
                          <div className={`p-2 ${dept.bgColor} rounded-lg flex-shrink-0`}>
                            <IconComponent className={`w-4 h-4 ${dept.color}`} />
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{dept.name}</p>
                            <p className="text-gray-400 text-xs">{dept.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Card className="p-6 bg-gradient-to-r from-laranja-500/10 to-rosa-500/10 border-laranja-500/20">
                  <h3 className="text-xl font-bold text-white mb-4">Links Úteis</h3>
                  <div className="space-y-3">
                    <Link to="/faq" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                      <FileText className="w-4 h-4" />
                      <span>Perguntas Frequentes</span>
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </Link>
                    <Link to="/report" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                      <AlertCircle className="w-4 h-4" />
                      <span>Reportar Problema</span>
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </Link>
                    <a href="#" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                      <FileText className="w-4 h-4" />
                      <span>Documentação</span>
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;