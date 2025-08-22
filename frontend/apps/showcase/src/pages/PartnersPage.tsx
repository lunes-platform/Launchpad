import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Users, 
  Star, 
  Shield, 
  TrendingUp, 
  Award, 
  MessageCircle, 
  Mail, 
  Phone, 
  ExternalLink,
  Filter,
  Search,
  MapPin,
  Calendar,
  Coins,
  CheckCircle,
  AlertCircle,
  Send
} from 'lucide-react';

// Tipos para parceiros
interface Partner {
  id: string;
  name: string;
  company: string;
  specialty: 'marketing' | 'design' | 'both' | 'smart-contract-dev' | 'smart-contract-audit';
  rating: number;
  reviewsCount: number;
  stakedAmount: number;
  location: string;
  joinedDate: string;
  avatar: string;
  description: string;
  services: string[];
  portfolio: string[];
  contact: {
    email: string;
    phone?: string;
    website?: string;
    linkedin?: string;
  };
  verified: boolean;
  featured: boolean;
  certifications?: string[]; // Para auditores e desenvolvedores
  lunesExperience?: number; // Anos de experiência com Rede Lunes
}

// Mock data para parceiros
const mockPartners: Partner[] = [
  {
    id: '1',
    name: 'Ana Silva',
    company: 'Digital Growth Agency',
    specialty: 'marketing',
    rating: 4.9,
    reviewsCount: 47,
    stakedAmount: 50000,
    location: 'São Paulo, SP',
    joinedDate: '2024-01-15',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    description: 'Especialista em marketing digital para projetos Web3 e DeFi com mais de 8 anos de experiência.',
    services: ['Marketing Digital', 'Growth Hacking', 'Community Management', 'Influencer Marketing'],
    portfolio: ['TokenLaunch Pro', 'DeFi Bridge', 'NFT Marketplace'],
    contact: {
      email: 'ana@digitalgrowth.com',
      phone: '+55 11 99999-9999',
      website: 'https://digitalgrowth.com',
      linkedin: 'https://linkedin.com/in/anasilva'
    },
    verified: true,
    featured: true
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    company: 'Blockchain Design Studio',
    specialty: 'design',
    rating: 4.8,
    reviewsCount: 32,
    stakedAmount: 35000,
    location: 'Rio de Janeiro, RJ',
    joinedDate: '2024-02-20',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    description: 'Designer especializado em interfaces Web3, branding e experiência do usuário para projetos blockchain.',
    services: ['UI/UX Design', 'Branding', 'Landing Pages', 'Mobile Design'],
    portfolio: ['CryptoWallet UI', 'DeFi Dashboard', 'Token Website'],
    contact: {
      email: 'carlos@blockchaindesign.com',
      website: 'https://blockchaindesign.com',
      linkedin: 'https://linkedin.com/in/carlosmendes'
    },
    verified: true,
    featured: false
  },
  {
    id: '3',
    name: 'Marina Costa',
    company: 'Full Stack Creative',
    specialty: 'both',
    rating: 4.7,
    reviewsCount: 28,
    stakedAmount: 75000,
    location: 'Belo Horizonte, MG',
    joinedDate: '2024-03-10',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    description: 'Agência completa oferecendo serviços de marketing e design para projetos de criptomoedas e blockchain.',
    services: ['Marketing Completo', 'Design & Branding', 'Desenvolvimento Web', 'Consultoria Estratégica'],
    portfolio: ['LaunchPad Success', 'Token Economy', 'Blockchain Startup'],
    contact: {
      email: 'marina@fullstackcreative.com',
      phone: '+55 31 98888-8888',
      website: 'https://fullstackcreative.com'
    },
    verified: true,
    featured: true
  },
  {
    id: '4',
    name: 'Roberto Santos',
    company: 'Lunes Smart Contracts',
    specialty: 'smart-contract-dev',
    rating: 4.9,
    reviewsCount: 35,
    stakedAmount: 100000,
    location: 'Florianópolis, SC',
    joinedDate: '2023-11-05',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    description: 'Desenvolvedor especializado em smart contracts para a Rede Lunes, com foco em DeFi e tokenização.',
    services: ['Smart Contract Development', 'Ink! Programming', 'DeFi Protocols', 'Token Standards', 'Substrate Development'],
    portfolio: ['Lunes DEX', 'Lunes Staking Protocol', 'Multi-Chain Bridge'],
    contact: {
      email: 'roberto@lunescontracts.com',
      phone: '+55 48 99999-9999',
      website: 'https://lunescontracts.com',
      linkedin: 'https://linkedin.com/in/robertosantos'
    },
    verified: true,
    featured: true,
    certifications: ['Certified Ink! Developer', 'Substrate Runtime Engineer', 'Polkadot Academy Graduate'],
    lunesExperience: 3
  },
  {
    id: '5',
    name: 'SecureChain Auditors',
    company: 'SecureChain Security',
    specialty: 'smart-contract-audit',
    rating: 4.8,
    reviewsCount: 42,
    stakedAmount: 150000,
    location: 'São Paulo, SP',
    joinedDate: '2023-09-20',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    description: 'Empresa especializada em auditoria e certificação de smart contracts para blockchain Substrate e Rede Lunes.',
    services: ['Security Audits', 'Code Review', 'Vulnerability Assessment', 'Compliance Certification', 'Penetration Testing'],
    portfolio: ['Lunes Launchpad Audit', 'DeFi Protocol Security', 'Cross-Chain Bridge Audit'],
    contact: {
      email: 'audit@securechain.com',
      phone: '+55 11 98888-8888',
      website: 'https://securechain.com',
      linkedin: 'https://linkedin.com/company/securechain'
    },
    verified: true,
    featured: false,
    certifications: ['ISO 27001 Certified', 'OWASP Smart Contract Top 10', 'Substrate Security Specialist'],
    lunesExperience: 2
  },
  {
    id: '6',
    name: 'Patricia Lima',
    company: 'Blockchain Innovations Lab',
    specialty: 'smart-contract-dev',
    rating: 4.7,
    reviewsCount: 28,
    stakedAmount: 80000,
    location: 'Brasília, DF',
    joinedDate: '2024-01-10',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    description: 'Desenvolvedora sênior especializada em soluções DeFi e governança para a Rede Lunes.',
    services: ['DeFi Development', 'Governance Systems', 'Cross-Chain Integration', 'Smart Contract Optimization'],
    portfolio: ['Lunes Governance DAO', 'Yield Farming Protocol', 'NFT Marketplace'],
    contact: {
      email: 'patricia@blockchaininnovations.com',
      website: 'https://blockchaininnovations.com',
      linkedin: 'https://linkedin.com/in/patricialima'
    },
    verified: true,
    featured: false,
    certifications: ['Polkadot Developer', 'Rust Programming Expert'],
    lunesExperience: 2
  }
];

export function PartnersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  // Função para mapear especialidades
  const getSpecialtyLabel = (specialty: string) => {
    switch (specialty) {
      case 'marketing': return 'Marketing';
      case 'design': return 'Design';
      case 'both': return 'Marketing & Design';
      case 'smart-contract-dev': return 'Desenvolvedor Smart Contract';
      case 'smart-contract-audit': return 'Auditor Smart Contract';
      default: return specialty;
    }
  };
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    specialty: 'marketing',
    description: '',
    portfolio: '',
    stakeAmount: '',
    phone: '',
    website: '',
    linkedin: '',
    certifications: '',
    lunesExperience: ''
  });

  // Refs para animações
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const partnersRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const heroInView = useInView(heroRef, { once: true });
  const statsInView = useInView(statsRef, { once: true });
  const partnersInView = useInView(partnersRef, { once: true });
  const formInView = useInView(formRef, { once: true });

  // Filtrar parceiros
  const filteredPartners = mockPartners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialty = selectedSpecialty === 'all' || partner.specialty === selectedSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });

  // Estatísticas
  const stats = [
    { label: 'Parceiros Ativos', value: '150+', icon: Users },
    { label: 'Projetos Lançados', value: '500+', icon: TrendingUp },
    { label: 'LUNES em Stake', value: '2.5M+', icon: Coins },
    { label: 'Avaliação Média', value: '4.8★', icon: Star }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria implementada a lógica de envio do formulário
    console.log('Formulário enviado:', formData);
    alert('Solicitação de parceria enviada com sucesso! Entraremos em contato em breve.');
    setShowRegistrationForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-grafite-900 via-grafite-800 to-grafite-900">
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-roxo/20 to-azul/20" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Parceiros <span className="text-gradient">Especialistas</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Conecte-se com profissionais verificados em marketing e design especializados em projetos blockchain. 
              Todos os parceiros possuem stake em LUNES e são avaliados pela comunidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRegistrationForm(true)}
                className="bg-gradient-to-r from-roxo to-azul text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Tornar-se Parceiro
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => partnersRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-roxo text-roxo px-8 py-4 rounded-xl font-semibold hover:bg-roxo hover:text-white transition-all duration-300"
              >
                Ver Parceiros
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>



      {/* Estatísticas */}
      <section ref={statsRef} className="py-20 bg-grafite-800/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-gradient-to-br from-roxo/20 to-azul/20 p-4 rounded-2xl mb-4 inline-block">
                    <Icon className="w-8 h-8 text-roxo mx-auto" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-gray-400">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Como Funciona</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Nosso sistema garante qualidade e confiança através de stake em LUNES e avaliações da comunidade
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Verificação Rigorosa',
                description: 'Todos os parceiros passam por um processo de verificação e devem fazer stake mínimo de 10.000 LUNES'
              },
              {
                icon: Star,
                title: 'Sistema de Avaliação',
                description: 'Clientes avaliam os parceiros após cada projeto, mantendo um histórico transparente de qualidade'
              },
              {
                icon: Award,
                title: 'Parceiros Destacados',
                description: 'Os melhores parceiros recebem destaque especial e benefícios exclusivos na plataforma'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-grafite-800/50 p-8 rounded-2xl border border-grafite-700 hover:border-roxo/50 transition-all duration-300"
                >
                  <div className="bg-gradient-to-br from-roxo/20 to-azul/20 p-4 rounded-2xl mb-6 inline-block">
                    <Icon className="w-8 h-8 text-roxo" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lista de Parceiros */}
      <section ref={partnersRef} className="py-20 bg-grafite-800/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={partnersInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold text-white text-center mb-8">Nossos Parceiros</h2>
            
            {/* Filtros e Busca */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por nome, empresa ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-grafite-800 border border-grafite-600 rounded-xl text-white placeholder-gray-400 focus:border-roxo focus:outline-none"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-grafite-800 border border-grafite-600 rounded-xl text-white focus:border-roxo focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="all">Todas as Especialidades</option>
                  <option value="marketing">Marketing</option>
                  <option value="design">Design</option>
                  <option value="both">Marketing & Design</option>
                  <option value="smart-contract-dev">Desenvolvedor Smart Contract</option>
                  <option value="smart-contract-audit">Auditor Smart Contract</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Grid de Parceiros */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={partnersInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredPartners.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 30 }}
                animate={partnersInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-grafite-800/70 rounded-2xl p-6 border transition-all duration-300 hover:scale-105 ${
                  partner.featured 
                    ? 'border-roxo shadow-lg shadow-roxo/20' 
                    : 'border-grafite-600 hover:border-roxo/50'
                }`}
              >
                {partner.featured && (
                  <div className="bg-gradient-to-r from-roxo to-azul text-white text-xs px-3 py-1 rounded-full mb-4 inline-block">
                    ⭐ Parceiro Destacado
                  </div>
                )}
                
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={partner.avatar}
                    alt={partner.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white">{partner.name}</h3>
                      {partner.verified && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    <p className="text-roxo font-medium">{partner.company}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white font-medium">{partner.rating}</span>
                        <span className="text-gray-400 text-sm">({partner.reviewsCount})</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {partner.description}
                </p>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">{partner.location}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300 text-sm">
                      {partner.stakedAmount.toLocaleString()} LUNES em stake
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Serviços:</h4>
                  <div className="flex flex-wrap gap-2">
                    {partner.services.slice(0, 3).map((service, idx) => (
                      <span
                        key={idx}
                        className="bg-roxo/20 text-roxo text-xs px-2 py-1 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                    {partner.services.length > 3 && (
                      <span className="text-gray-400 text-xs">+{partner.services.length - 3} mais</span>
                    )}
                  </div>
                </div>

                {/* Certificações para desenvolvedores e auditores */}
                {partner.certifications && partner.certifications.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Certificações:</h4>
                    <div className="flex flex-wrap gap-2">
                      {partner.certifications.slice(0, 2).map((cert, idx) => (
                        <span
                          key={idx}
                          className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                        >
                          <Award className="w-3 h-3" />
                          {cert}
                        </span>
                      ))}
                      {partner.certifications.length > 2 && (
                        <span className="text-gray-400 text-xs">+{partner.certifications.length - 2} mais</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Experiência com Rede Lunes */}
                {partner.lunesExperience && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 text-sm">
                        {partner.lunesExperience} {partner.lunesExperience === 1 ? 'ano' : 'anos'} de experiência com Rede Lunes
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://t.me/LunesBlockchain"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-roxo to-azul text-white text-center py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                  >
                    <MessageCircle className="w-4 h-4 inline mr-2" />
                    Contatar
                  </motion.a>
                  {partner.contact.website && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={partner.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-grafite-700 text-white p-2 rounded-lg hover:bg-grafite-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredPartners.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Nenhum parceiro encontrado</h3>
              <p className="text-gray-400">Tente ajustar os filtros de busca</p>
            </div>
          )}
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-8 bg-grafite-800/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={partnersInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="text-amber-400 font-semibold text-lg">Aviso Importante</h3>
                <div className="text-gray-300 space-y-2 text-sm">
                  <p>
                    <strong>Isenção de Responsabilidade:</strong> A Lunes atua exclusivamente como intermediária, conectando profissionais e clientes. Não somos responsáveis pelos serviços prestados por terceiros através desta plataforma.
                  </p>
                  <p>
                    <strong>Política de Taxas:</strong> A Lunes não cobra taxas dos profissionais cadastrados nem dos clientes que procuram prestadores de serviços. Todas as negociações financeiras são realizadas diretamente entre as partes.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Formulário de Cadastro Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-grafite-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Tornar-se Parceiro</h2>
              <button
                onClick={() => setShowRegistrationForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Nome Completo *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-grafite-700 border border-grafite-600 rounded-xl text-white focus:border-roxo focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-grafite-700 border border-grafite-600 rounded-xl text-white focus:border-roxo focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Empresa *</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-grafite-700 border border-grafite-600 rounded-xl text-white focus:border-roxo focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Especialidade *</label>
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-grafite-700 border border-grafite-600 rounded-xl text-white focus:border-roxo focus:outline-none"
                  >
                    <option value="marketing">Marketing</option>
                    <option value="design">Design</option>
                    <option value="both">Marketing & Design</option>
                    <option value="smart-contract-dev">Desenvolvedor Smart Contract</option>
                    <option value="smart-contract-audit">Auditor Smart Contract</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Descrição dos Serviços *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-grafite-700 border border-grafite-600 rounded-xl text-white focus:border-roxo focus:outline-none resize-none"
                  placeholder="Descreva sua experiência e os serviços que oferece..."
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Portfólio (URLs separadas por vírgula)</label>
                <input
                  type="text"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-grafite-700 border border-grafite-600 rounded-xl text-white focus:border-roxo focus:outline-none"
                  placeholder="https://projeto1.com, https://projeto2.com"
                />
              </div>

              <div className="bg-roxo/10 border border-roxo/30 rounded-xl p-4">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  Stake de LUNES Obrigatório
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  Para se tornar parceiro, é necessário fazer stake mínimo de 10.000 LUNES como garantia de qualidade.
                </p>
                <div>
                  <label className="block text-white font-medium mb-2">Quantidade de LUNES para Stake *</label>
                  <input
                    type="number"
                    name="stakeAmount"
                    value={formData.stakeAmount}
                    onChange={handleInputChange}
                    required
                    min="10000"
                    className="w-full px-4 py-3 bg-grafite-700 border border-grafite-600 rounded-xl text-white focus:border-roxo focus:outline-none"
                    placeholder="Mínimo: 10.000 LUNES"
                  />
                </div>
              </div>

              {/* Campos específicos para desenvolvedores e auditores de smart contracts */}
              {(formData.specialty === 'smart-contract-dev' || formData.specialty === 'smart-contract-audit') && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 space-y-4">
                  <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Informações Específicas - {formData.specialty === 'smart-contract-dev' ? 'Desenvolvedor' : 'Auditor'}
                  </h3>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Certificações {formData.specialty === 'smart-contract-audit' ? '*' : ''}
                    </label>
                    <textarea
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleInputChange}
                      required={formData.specialty === 'smart-contract-audit'}
                      rows={3}
                      className="w-full px-4 py-3 bg-grafite-700 border border-grafite-600 rounded-xl text-white focus:border-roxo focus:outline-none resize-none"
                      placeholder="Ex: Certified Ink! Developer, Substrate Runtime Engineer, ISO 27001..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Anos de Experiência com Rede Lunes
                    </label>
                    <input
                      type="number"
                      name="lunesExperience"
                      value={formData.lunesExperience}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      className="w-full px-4 py-3 bg-grafite-700 border border-grafite-600 rounded-xl text-white focus:border-roxo focus:outline-none"
                      placeholder="Ex: 2"
                    />
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Telefone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-grafite-700 border border-grafite-600 rounded-xl text-white focus:border-roxo focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-grafite-700 border border-grafite-600 rounded-xl text-white focus:border-roxo focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-grafite-700 border border-grafite-600 rounded-xl text-white focus:border-roxo focus:outline-none"
                />
              </div>

              {/* Termos de Uso e Responsabilidade */}
              <div className="bg-grafite-800 border border-grafite-600 rounded-xl p-6 space-y-4">
                <h4 className="text-white font-semibold text-lg mb-3">Termos de Uso e Responsabilidade</h4>
                
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms-responsibility"
                      required
                      className="mt-1 w-4 h-4 text-roxo bg-grafite-700 border-grafite-600 rounded focus:ring-roxo focus:ring-2"
                    />
                    <label htmlFor="terms-responsibility" className="flex-1">
                      <strong className="text-white">Isenção de Responsabilidade:</strong> Declaro estar ciente de que a Lunes não é responsável pelos serviços prestados por terceiros através desta plataforma. A Lunes atua apenas como intermediária, conectando profissionais e clientes.
                    </label>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms-fees"
                      required
                      className="mt-1 w-4 h-4 text-roxo bg-grafite-700 border-grafite-600 rounded focus:ring-roxo focus:ring-2"
                    />
                    <label htmlFor="terms-fees" className="flex-1">
                      <strong className="text-white">Política de Taxas:</strong> Confirmo que a Lunes não cobra taxas dos profissionais cadastrados nem dos clientes que procuram prestadores de serviços. Todas as negociações financeiras são realizadas diretamente entre as partes.
                    </label>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms-ecosystem"
                      required
                      className="mt-1 w-4 h-4 text-roxo bg-grafite-700 border-grafite-600 rounded focus:ring-roxo focus:ring-2"
                    />
                    <label htmlFor="terms-ecosystem" className="flex-1">
                      <strong className="text-white">Compromisso com o Ecossistema Lunes:</strong> Me comprometo a desenvolver projetos prioritariamente no ecossistema da Rede Lunes para clientes que chegarem através deste canal, contribuindo para o crescimento e fortalecimento da comunidade.
                    </label>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms-conduct"
                      required
                      className="mt-1 w-4 h-4 text-roxo bg-grafite-700 border border-grafite-600 rounded focus:ring-roxo focus:ring-2"
                    />
                    <label htmlFor="terms-conduct" className="flex-1">
                      <strong className="text-white">Código de Conduta:</strong> Concordo em manter padrões profissionais elevados, comunicação transparente e entregar serviços de qualidade, respeitando prazos e especificações acordadas com os clientes.
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRegistrationForm(false)}
                  className="flex-1 bg-grafite-700 text-white py-3 px-6 rounded-xl font-medium hover:bg-grafite-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-roxo to-azul text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Enviar Solicitação
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}