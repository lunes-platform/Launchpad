import React, { useState } from "react";
import { Card } from "@launchpad/shared-ui";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  HelpCircle, 
  ArrowLeft,
  Rocket,
  Shield,
  Coins,
  Users,
  FileText,
  MessageSquare,
  Zap,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

interface FAQCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  borderColor: string;
}

const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const categories: FAQCategory[] = [
    {
      id: "all",
      name: "Todas as Categorias",
      icon: HelpCircle,
      color: "text-white",
      bgColor: "bg-gradient-to-r from-laranja-500 to-rosa-500",
      borderColor: "border-laranja-500"
    },
    {
      id: "getting-started",
      name: "Primeiros Passos",
      icon: Rocket,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      id: "projects",
      name: "Projetos IDO",
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20"
    },
    {
      id: "staking",
      name: "Staking & Launchpool",
      icon: Coins,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      id: "kyc",
      name: "KYC & Verificação",
      icon: Shield,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20"
    },
    {
      id: "raffle",
      name: "Raffles & Loterias",
      icon: Zap,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20"
    },
    {
      id: "governance",
      name: "Governança",
      icon: Users,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/20"
    },
    {
      id: "technical",
      name: "Técnico",
      icon: FileText,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20"
    }
  ];

  const faqItems: FAQItem[] = [
    // Primeiros Passos
    {
      id: "1",
      question: "Como começar a usar a Lunes Launchpad?",
      answer: "Para começar, você precisa: 1) Conectar sua carteira (Polkadot.js, SubWallet ou Talisman), 2) Ter tokens LUNES em sua carteira, 3) Completar o processo de KYC se quiser participar de projetos que exigem verificação. Após isso, você pode explorar projetos IDO, participar de staking e muito mais.",
      category: "getting-started",
      tags: ["início", "carteira", "conexão"]
    },
    {
      id: "2",
      question: "Quais carteiras são suportadas?",
      answer: "Suportamos as principais extensões de carteira para Polkadot: Polkadot.js Extension, SubWallet e Talisman. Todas são gratuitas e podem ser instaladas como extensões do navegador.",
      category: "getting-started",
      tags: ["carteira", "polkadot", "extensão"]
    },
    {
      id: "3",
      question: "Preciso de tokens LUNES para usar a plataforma?",
      answer: "Sim, LUNES é o token nativo da plataforma. Você precisa de LUNES para: participar de IDOs, fazer staking, pagar taxas de transação, participar de raffles e governança. Você pode obter LUNES através de exchanges ou participando de atividades da plataforma.",
      category: "getting-started",
      tags: ["lunes", "token", "necessário"]
    },

    // Projetos IDO
    {
      id: "4",
      question: "Como funciona um IDO (Initial DEX Offering)?",
      answer: "Um IDO é uma oferta inicial de tokens de um projeto. Na Lunes Launchpad, os IDOs passam por diferentes fases: Whitelist (inscrição), Private Sale (venda privada), Public Sale (venda pública) e Listing (listagem em exchanges). Cada fase tem requisitos específicos de participação.",
      category: "projects",
      tags: ["ido", "fases", "participação"]
    },
    {
      id: "5",
      question: "Quais são os requisitos para participar de um IDO?",
      answer: "Os requisitos variam por projeto e fase: 1) Ter LUNES suficientes, 2) Completar KYC (para algumas fases), 3) Estar na whitelist (para fases privadas), 4) Atender aos limites mínimos e máximos de investimento. Projetos Triple-A podem ter requisitos adicionais.",
      category: "projects",
      tags: ["requisitos", "kyc", "whitelist"]
    },
    {
      id: "6",
      question: "Como funciona o sistema de vesting?",
      answer: "Vesting é a liberação gradual dos tokens comprados. Após comprar tokens em um IDO, eles são liberados ao longo do tempo conforme o cronograma definido pelo projeto. Você pode acompanhar e resgatar seus tokens liberados na seção 'Meus Investimentos'.",
      category: "projects",
      tags: ["vesting", "liberação", "tokens"]
    },

    // Staking & Launchpool
    {
      id: "7",
      question: "O que é Launchpool e como participar?",
      answer: "Launchpool permite fazer staking de LUNES para ganhar tokens de novos projetos gratuitamente. Você deposita LUNES em um pool por um período determinado e recebe tokens do projeto como recompensa, proporcionalmente ao seu stake e tempo de participação.",
      category: "staking",
      tags: ["launchpool", "staking", "recompensas"]
    },
    {
      id: "8",
      question: "Posso retirar meus LUNES do staking a qualquer momento?",
      answer: "Depende do tipo de staking. No staking flexível, você pode retirar a qualquer momento. No Launchpool, há períodos de lock definidos. Sempre verifique os termos antes de fazer staking. Algumas retiradas podem ter períodos de unbonding.",
      category: "staking",
      tags: ["retirada", "flexível", "lock"]
    },
    {
      id: "9",
      question: "Como são calculadas as recompensas de staking?",
      answer: "As recompensas dependem de: 1) Quantidade de LUNES em staking, 2) Duração do staking, 3) Total de LUNES no pool, 4) APY (rendimento anual) do pool. As recompensas são distribuídas proporcionalmente e podem ser resgatadas periodicamente.",
      category: "staking",
      tags: ["recompensas", "cálculo", "apy"]
    },

    // KYC & Verificação
    {
      id: "10",
      question: "O que é KYC e por que é necessário?",
      answer: "KYC (Know Your Customer) é um processo de verificação de identidade exigido por regulamentações. É necessário para participar de certas fases de IDOs, projetos Triple-A e algumas funcionalidades premium. O processo inclui verificação de documento e selfie.",
      category: "kyc",
      tags: ["kyc", "verificação", "identidade"]
    },
    {
      id: "11",
      question: "Quanto tempo demora a aprovação do KYC?",
      answer: "O processo de KYC geralmente leva de 24 a 72 horas para ser aprovado. Em períodos de alta demanda, pode levar até 5 dias úteis. Você receberá notificações sobre o status da sua verificação por email e na plataforma.",
      category: "kyc",
      tags: ["tempo", "aprovação", "prazo"]
    },
    {
      id: "12",
      question: "Meu KYC foi rejeitado, o que fazer?",
      answer: "Se seu KYC foi rejeitado, verifique o motivo na sua dashboard. Causas comuns: documento ilegível, informações inconsistentes, documento expirado. Você pode reenviar com documentos corrigidos. Entre em contato com o suporte se precisar de ajuda.",
      category: "kyc",
      tags: ["rejeitado", "reenvio", "suporte"]
    },

    // Raffles & Loterias
    {
      id: "13",
      question: "Como funcionam os raffles na plataforma?",
      answer: "Raffles são loterias onde você compra tickets para concorrer a alocações em IDOs ou outros prêmios. Cada ticket aumenta suas chances de ganhar. Os sorteios são realizados de forma transparente usando algoritmos verificáveis na blockchain.",
      category: "raffle",
      tags: ["raffle", "tickets", "sorteio"]
    },
    {
      id: "14",
      question: "Como são escolhidos os vencedores dos raffles?",
      answer: "Os vencedores são escolhidos através de um algoritmo de sorteio transparente e verificável na blockchain. O processo usa seeds aleatórios e é auditável por qualquer pessoa. Todos os participantes têm chances proporcionais ao número de tickets.",
      category: "raffle",
      tags: ["vencedores", "algoritmo", "transparente"]
    },

    // Governança
    {
      id: "15",
      question: "Como participar da governança da plataforma?",
      answer: "Para participar da governança, você precisa: 1) Ter LUNES em staking, 2) Votar em propostas ativas, 3) Criar propostas (se tiver LUNES suficientes). Participantes ativos recebem recompensas adicionais. O poder de voto é proporcional ao seu stake.",
      category: "governance",
      tags: ["governança", "votação", "propostas"]
    },
    {
      id: "16",
      question: "Qual o mínimo de LUNES para criar uma proposta?",
      answer: "O mínimo para criar uma proposta varia conforme o tipo. Propostas gerais requerem 10.000 LUNES em staking, propostas técnicas podem requerer 50.000 LUNES, e propostas de mudanças críticas podem requerer 100.000 LUNES. Isso garante que apenas participantes comprometidos façam propostas.",
      category: "governance",
      tags: ["proposta", "mínimo", "requisitos"]
    },

    // Técnico
    {
      id: "17",
      question: "A plataforma é segura? Quais auditorias foram feitas?",
      answer: "Sim, a segurança é nossa prioridade. Nossos smart contracts passaram por auditorias de segurança independentes. Implementamos múltiplas camadas de segurança: controle de acesso, pausabilidade de emergência, validação de entradas e monitoramento contínuo.",
      category: "technical",
      tags: ["segurança", "auditoria", "smart contracts"]
    },
    {
      id: "18",
      question: "Como funciona a integração com outras blockchains?",
      answer: "Atualmente focamos na rede Lunes, mas temos planos para bridges com outras redes. A arquitetura foi projetada para suportar interoperabilidade futura. Acompanhe nossos anúncios para novidades sobre integrações cross-chain.",
      category: "technical",
      tags: ["blockchain", "integração", "cross-chain"]
    },
    {
      id: "19",
      question: "Onde posso ver o código-fonte dos contratos?",
      answer: "Nossos smart contracts são open-source e estão disponíveis no GitHub. Você pode auditar o código, reportar bugs ou contribuir com melhorias. Acreditamos na transparência e desenvolvimento colaborativo.",
      category: "technical",
      tags: ["código", "open-source", "github"]
    },

    // Suporte e Contato
    {
      id: "20",
      question: "Como entrar em contato com o suporte?",
      answer: "Você pode nos contatar através de: 1) Chat ao vivo no site (Segunda a Sexta, 9h-18h), 2) Email: suporte@launchpad.com, 3) Formulário de contato na plataforma, 4) Telegram oficial. Para questões críticas, temos suporte 24/7 por email.",
      category: "getting-started",
      tags: ["suporte", "contato", "ajuda"]
    }
  ];

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = searchTerm === "" || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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
                <HelpCircle className="w-8 h-8 text-laranja-500" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Perguntas Frequentes
                </h1>
                <p className="text-gray-400 mt-1">
                  Encontre respostas para as dúvidas mais comuns sobre a plataforma.
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-8"
          >
            <Card className="p-6 bg-grafite-800 border-grafite-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar perguntas, respostas ou palavras-chave..."
                  className="w-full pl-10 pr-4 py-3 bg-grafite-700 border border-grafite-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-laranja-500 focus:border-transparent transition-all"
                />
              </div>
            </Card>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Categorias</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {categories.map((category) => {
                const IconComponent = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      isSelected
                        ? category.id === "all" 
                          ? category.bgColor
                          : `${category.borderColor} ${category.bgColor}`
                        : 'border-grafite-600 bg-grafite-700/50 hover:border-grafite-500'
                    }`}
                  >
                    <IconComponent 
                      className={`w-5 h-5 mx-auto mb-2 ${
                        isSelected 
                          ? category.id === "all" ? "text-white" : category.color
                          : "text-gray-400"
                      }`} 
                    />
                    <div className={`text-xs font-medium ${
                      isSelected 
                        ? category.id === "all" ? "text-white" : "text-white"
                        : "text-gray-400"
                    }`}>
                      {category.name}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* FAQ Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {filteredFAQs.length === 0 ? (
              <Card className="p-8 text-center bg-grafite-800 border-grafite-700">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Nenhuma pergunta encontrada
                </h3>
                <p className="text-gray-400">
                  Tente ajustar sua pesquisa ou selecionar uma categoria diferente.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((item, index) => {
                  const isExpanded = expandedItems.has(item.id);
                  const category = categories.find(cat => cat.id === item.category);
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                    >
                      <Card className="bg-grafite-800 border-grafite-700 overflow-hidden">
                        <button
                          onClick={() => toggleExpanded(item.id)}
                          className="w-full p-6 text-left hover:bg-grafite-700/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {category && (
                                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${category.bgColor} ${category.color}`}>
                                    {category.name}
                                  </div>
                                )}
                              </div>
                              <h3 className="text-lg font-semibold text-white pr-4">
                                {item.question}
                              </h3>
                            </div>
                            <div className="flex-shrink-0">
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="px-6 pb-6 border-t border-grafite-700">
                                <div className="pt-4">
                                  <p className="text-gray-300 leading-relaxed">
                                    {item.answer}
                                  </p>
                                  {item.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                      {item.tags.map((tag, tagIndex) => (
                                        <span
                                          key={tagIndex}
                                          className="px-2 py-1 bg-grafite-700 text-gray-400 text-xs rounded-full"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12"
          >
            <Card className="p-8 bg-gradient-to-r from-laranja-500/10 to-rosa-500/10 border-laranja-500/20">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-laranja-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Não encontrou sua resposta?
                </h3>
                <p className="text-gray-300 mb-6">
                  Nossa equipe de suporte está pronta para ajudar você com qualquer dúvida.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-gradient-to-r from-laranja-500 to-rosa-500 hover:from-laranja-600 hover:to-rosa-600 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Entrar em Contato
                    </motion.button>
                  </Link>
                  <Link to="/report">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 border border-laranja-500 text-laranja-500 hover:bg-laranja-500 hover:text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Reportar Problema
                    </motion.button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;