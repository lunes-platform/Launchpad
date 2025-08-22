import React from "react";
import { motion } from "framer-motion";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ExternalLink,
  Shield,
  FileText,
  HelpCircle,
  Users,
  Zap,
} from "lucide-react";

export interface FooterProps {
  className?: string;
}

/**
 * Footer Component - Componente de rodapé completo com informações da empresa
 * 
 * Features:
 * - Informações da empresa e contato
 * - Links de navegação organizados por categoria
 * - Links para redes sociais
 * - Links legais (Termos, Privacidade, etc.)
 * - Design responsivo com tema dark
 * - Animações suaves com Framer Motion
 */
export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const currentYear = new Date().getFullYear();

  const navigationLinks = {
    plataforma: [
      { name: "Projetos", href: "/projetos" },
      { name: "Sorteios", href: "/sorteios" },
      { name: "Dashboard", href: "/dashboard" },
      { name: "Carteira", href: "/carteira" },
    ],
    recursos: [
      { name: "Como Funciona", href: "/como-funciona" },
      { name: "Documentação", href: "/docs" },
      { name: "API", href: "/api" },
      { name: "Status", href: "/status" },
    ],
    suporte: [
      { name: "Central de Ajuda", href: "/ajuda" },
      { name: "Contato", href: "/contato" },
      { name: "FAQ", href: "/faq" },
      { name: "Comunidade", href: "/comunidade" },
    ],
    empresa: [
      { name: "Sobre Nós", href: "/sobre" },
      { name: "Carreiras", href: "/carreiras" },
      { name: "Blog", href: "/blog" },
      { name: "Imprensa", href: "/imprensa" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", href: "https://twitter.com/lunes", icon: Twitter },
    { name: "LinkedIn", href: "https://linkedin.com/company/lunes", icon: Linkedin },
    { name: "GitHub", href: "https://github.com/lunes-platform", icon: Github },
  ];

  const legalLinks = [
    { name: "Termos de Uso", href: "/termos" },
    { name: "Política de Privacidade", href: "/privacidade" },
    { name: "Política de Cookies", href: "/cookies" },
    { name: "Compliance", href: "/compliance" },
  ];

  return (
    <footer className={`bg-grafite-900 border-t border-grafite-700 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-roxo to-laranja rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-white">Lunes</span>
                </div>
                
                <p className="text-grafite-300 mb-6 leading-relaxed">
                  A plataforma líder em investimentos blockchain, conectando investidores 
                  a projetos inovadores no ecossistema descentralizado.
                </p>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-grafite-300">
                    <Mail className="w-4 h-4 text-roxo-400" />
                    <span className="text-sm">contato@lunes.io</span>
                  </div>
                  <div className="flex items-center space-x-3 text-grafite-300">
                    <Phone className="w-4 h-4 text-roxo-400" />
                    <span className="text-sm">+55 (11) 9999-9999</span>
                  </div>
                  <div className="flex items-center space-x-3 text-grafite-300">
                    <MapPin className="w-4 h-4 text-roxo-400" />
                    <span className="text-sm">São Paulo, Brasil</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {/* Plataforma */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-roxo-400" />
                    Plataforma
                  </h3>
                  <ul className="space-y-3">
                    {navigationLinks.plataforma.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-grafite-300 hover:text-white transition-colors duration-200 text-sm"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Recursos */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-laranja-400" />
                    Recursos
                  </h3>
                  <ul className="space-y-3">
                    {navigationLinks.recursos.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-grafite-300 hover:text-white transition-colors duration-200 text-sm flex items-center"
                        >
                          {link.name}
                          {link.name === "API" && (
                            <ExternalLink className="w-3 h-3 ml-1" />
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Suporte */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <HelpCircle className="w-4 h-4 mr-2 text-verde-400" />
                    Suporte
                  </h3>
                  <ul className="space-y-3">
                    {navigationLinks.suporte.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-grafite-300 hover:text-white transition-colors duration-200 text-sm"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Empresa */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-azul-400" />
                    Empresa
                  </h3>
                  <ul className="space-y-3">
                    {navigationLinks.empresa.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-grafite-300 hover:text-white transition-colors duration-200 text-sm"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-grafite-700 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-grafite-400 text-sm"
            >
              © {currentYear} Lunes Platform. Todos os direitos reservados.
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center space-x-6"
            >
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-grafite-400 hover:text-white transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </motion.div>

            {/* Legal Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex items-center space-x-6"
            >
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.name}>
                  <a
                    href={link.href}
                    className="text-grafite-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                  {index < legalLinks.length - 1 && (
                    <span className="text-grafite-600">•</span>
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="border-t border-grafite-700 py-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4 text-grafite-400 text-xs">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-verde-400" />
              <span>Plataforma Auditada e Segura</span>
            </div>
            <span className="hidden md:block">•</span>
            <span>Contratos Inteligentes Verificados</span>
            <span className="hidden md:block">•</span>
            <span>Compliance Regulatório</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";