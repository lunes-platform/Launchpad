import { 
  Github, 
  Twitter, 
  MessageCircle, 
  Globe,
  Mail,
  MapPin,
  Phone,
  Shield,
  TrendingUp,
  Rocket,
  Users,
  ExternalLink,
  FileText,
  Linkedin,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion } from 'framer-motion';
import { useState } from 'react';

/**
 * Footer da aplicação
 * Contém links úteis, informações da plataforma, estatísticas e informações legais
 * Implementa melhores práticas de acessibilidade e responsividade
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Toggle para seções colapsáveis em mobile
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/lunes-platform' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/lunes_platform' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/lunes-platform' },
    { name: 'Telegram', icon: MessageCircle, href: 'https://t.me/lunes_platform' },
    { name: 'Website', icon: Globe, href: 'https://lunes.io' },
    { name: 'Email', icon: Mail, href: 'mailto:contato@lunes.io' }
  ];

  return (
    <footer 
      className="bg-white dark:bg-grafite-900 border-t border-gray-200 dark:border-grafite-700 transition-colors duration-300"
      role="contentinfo"
      aria-label="Informações do site e links úteis"
    >
      {/* Seção Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo e Descrição */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-roxo to-laranja rounded-lg flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Lunes Launchpad
              </h3>
            </div>
              
            <p className="text-gray-600 dark:text-grafite-300 mb-6 leading-relaxed">
              A plataforma líder em lançamento de projetos blockchain no ecossistema Lunes. 
              Conectamos inovadores com investidores globais de forma segura e transparente.
            </p>

            {/* Informações de Contato */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-gray-600 dark:text-grafite-300">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">São Paulo, Brasil</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-grafite-300">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:contato@lunes.io" className="text-sm hover:text-roxo transition-colors">
                  contato@lunes.io
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-grafite-300">
                <Globe className="w-4 h-4 flex-shrink-0" />
                <a href="https://lunes.io" className="text-sm hover:text-roxo transition-colors">
                  lunes.io
                </a>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 dark:bg-grafite-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-grafite-300 hover:bg-roxo hover:text-white transition-all duration-300 transform hover:scale-110"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Plataforma */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <button
              onClick={() => toggleSection('plataforma')}
              className="md:cursor-default w-full flex items-center justify-between text-left mb-4 md:mb-4"
              aria-expanded={expandedSections.plataforma}
              aria-controls="plataforma-links"
            >
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Plataforma
              </h4>
              <div className="md:hidden">
                {expandedSections.plataforma ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 dark:text-grafite-300" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 dark:text-grafite-300" />
                )}
              </div>
            </button>
            <ul 
              id="plataforma-links"
              className={`space-y-3 transition-all duration-300 md:block ${
                expandedSections.plataforma ? 'block' : 'hidden'
              }`}
            >
              <li>
                <a
                  href="/projects"
                  className="text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors text-sm"
                >
                  Projetos
                </a>
              </li>
              <li>
                <a
                  href="/launchpool"
                  className="text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors text-sm"
                >
                  Launchpool
                </a>
              </li>
              <li>
                <a
                  href="/raffles"
                  className="text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors text-sm"
                >
                  Raffles
                </a>
              </li>
              <li>
                <a
                  href="/vip"
                  className="text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors text-sm"
                >
                  Área VIP
                </a>
              </li>
              <li>
                <a
                  href="/governanca"
                  className="text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors text-sm"
                >
                  Governança
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Para Emissores */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button
              onClick={() => toggleSection('emissores')}
              className="md:cursor-default w-full flex items-center justify-between text-left mb-4 md:mb-4"
              aria-expanded={expandedSections.emissores}
              aria-controls="emissores-links"
            >
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Para Emissores
              </h4>
              <div className="md:hidden">
                {expandedSections.emissores ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 dark:text-grafite-300" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 dark:text-grafite-300" />
                )}
              </div>
            </button>
            <ul 
              id="emissores-links"
              className={`space-y-3 transition-all duration-300 md:block ${
                expandedSections.emissores ? 'block' : 'hidden'
              }`}
            >
              <li>
                <a
                  href="http://localhost:5173/criar-projeto"
                  className="text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors text-sm"
                >
                  Listar Projeto
                </a>
              </li>
              <li>
                <a
                  href="/how-it-works"
                  className="text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors text-sm"
                >
                  Como Funciona
                </a>
              </li>
              <li>
                <a
                  href="/requirements"
                  className="text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors text-sm"
                >
                  Requisitos
                </a>
              </li>
              <li>
                <a
                  href="/parceiros"
                  className="text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors text-sm"
                >
                  Parceiros
                </a>
              </li>
              <li>
                <a
                  href="/projetos-3a"
                  className="text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors text-sm"
                >
                  Projetos 3A
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Desenvolvedores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              onClick={() => toggleSection('desenvolvedores')}
              className="md:cursor-default w-full flex items-center justify-between text-left mb-4 md:mb-4"
              aria-expanded={expandedSections.desenvolvedores}
              aria-controls="desenvolvedores-links"
            >
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Desenvolvedores
              </h4>
              <div className="md:hidden">
                {expandedSections.desenvolvedores ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 dark:text-grafite-300" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 dark:text-grafite-300" />
                )}
              </div>
            </button>
            <ul 
              id="desenvolvedores-links"
              className={`space-y-3 transition-all duration-300 md:block ${
                expandedSections.desenvolvedores ? 'block' : 'hidden'
              }`}
            >
              <li>
                <a
                  href="/docs/api"
                  target="_blank"
                  className="text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors text-sm flex items-center space-x-1"
                >
                  <span>API Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="/docs/sdk"
                  target="_blank"
                  className="text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors text-sm flex items-center space-x-1"
                >
                  <span>SDK</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="/docs/smart-contracts"
                  target="_blank"
                  className="text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors text-sm flex items-center space-x-1"
                >
                  <span>Smart Contracts</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/lunes-platform"
                  target="_blank"
                  className="text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors text-sm flex items-center space-x-1"
                >
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="/security/bug-bounty"
                  className="text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors text-sm"
                >
                  Bug Bounty
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Suporte */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={() => toggleSection('suporte')}
              className="md:cursor-default w-full flex items-center justify-between text-left mb-4 md:mb-4"
              aria-expanded={expandedSections.suporte}
              aria-controls="suporte-links"
            >
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Suporte
              </h4>
              <div className="md:hidden">
                {expandedSections.suporte ? (
                  <ChevronUp className="w-5 h-5 text-gray-600 dark:text-grafite-300" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600 dark:text-grafite-300" />
                )}
              </div>
            </button>
            <ul 
              id="suporte-links"
              className={`space-y-3 transition-all duration-300 md:block ${
                expandedSections.suporte ? 'block' : 'hidden'
              }`}
            >
              <li>
                <a
                  href="/help"
                  className="text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-roxo focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-grafite-900 rounded-sm"
                  aria-label="Acessar Central de Ajuda"
                >
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors text-sm"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-roxo focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-grafite-900 rounded-sm"
                  aria-label="Entrar em contato conosco"
                >
                  Contato
                </a>
              </li>
              <li>
                <a
                  href="/status"
                  target="_blank"
                  className="text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors text-sm flex items-center space-x-1"
                >
                  <span>Status da Plataforma</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="/report"
                  className="text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors text-sm"
                >
                  Reportar Problema
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Seção de Estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-gray-200 dark:border-grafite-700"
          role="region"
          aria-label="Estatísticas da plataforma"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center" role="img" aria-label="Capital levantado: mais de 50 milhões de dólares">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-roxo to-laranja rounded-lg mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1" aria-label="50 milhões de dólares ou mais">$50M+</div>
              <div className="text-sm text-gray-600 dark:text-grafite-300">Capital Levantado</div>
            </div>
            <div className="text-center" role="img" aria-label="Projetos lançados: mais de 150">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-roxo to-laranja rounded-lg mx-auto mb-3">
                <Rocket className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1" aria-label="150 projetos ou mais">150+</div>
              <div className="text-sm text-gray-600 dark:text-grafite-300">Projetos Lançados</div>
            </div>
            <div className="text-center" role="img" aria-label="Investidores ativos: mais de 25 mil">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-roxo to-laranja rounded-lg mx-auto mb-3">
                <Users className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1" aria-label="25 mil investidores ou mais">25K+</div>
              <div className="text-sm text-gray-600 dark:text-grafite-300">Investidores Ativos</div>
            </div>
            <div className="text-center" role="img" aria-label="Projetos auditados: 100 por cento">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-roxo to-laranja rounded-lg mx-auto mb-3">
                <Shield className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1" aria-label="100 por cento dos projetos">100%</div>
              <div className="text-sm text-gray-600 dark:text-grafite-300">Projetos Auditados</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Seção Legal */}
      <div className="border-t border-gray-200 dark:border-grafite-700 bg-gray-50 dark:bg-grafite-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-600 dark:text-grafite-300">
              © {currentYear} Lunes Platform. Todos os direitos reservados.
            </div>

            {/* Links Legais */}
            <nav aria-label="Links legais" className="flex flex-wrap justify-center md:justify-end space-x-6">
              <a
                href="/legal/terms"
                className="text-sm text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors focus:outline-none focus:ring-2 focus:ring-roxo focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-grafite-900 rounded-sm"
                aria-label="Acessar termos de uso da plataforma"
              >
                Termos de Uso
              </a>
              <a
                href="/legal/privacy"
                className="text-sm text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors focus:outline-none focus:ring-2 focus:ring-roxo focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-grafite-900 rounded-sm"
                aria-label="Acessar política de privacidade"
              >
                Política de Privacidade
              </a>
              <a
                href="/legal/cookies"
                className="text-sm text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors focus:outline-none focus:ring-2 focus:ring-roxo focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-grafite-900 rounded-sm"
                aria-label="Acessar política de cookies"
              >
                Política de Cookies
              </a>
              <a
                href="/legal/compliance"
                className="text-sm text-gray-600 dark:text-grafite-300 hover:text-roxo transition-colors focus:outline-none focus:ring-2 focus:ring-roxo focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-grafite-900 rounded-sm"
                aria-label="Acessar informações de compliance"
              >
                Compliance
              </a>
            </nav>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-grafite-600">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-gray-400 dark:text-grafite-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500 dark:text-grafite-400 leading-relaxed">
                <strong>Aviso Legal:</strong> Os investimentos em criptomoedas e tokens digitais envolvem riscos significativos. 
                O valor dos investimentos pode flutuar e você pode perder parte ou todo o seu investimento. 
                Sempre faça sua própria pesquisa (DYOR) e consulte um consultor financeiro qualificado antes de investir. 
                A Lunes Platform não oferece conselhos de investimento e não é responsável por perdas decorrentes de decisões de investimento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
