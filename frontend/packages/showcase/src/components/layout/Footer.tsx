import { Link } from 'react-router-dom'
import { Github, Twitter, Send, Globe } from 'lucide-react'

const footerLinks = {
  platform: [
    { name: 'Projetos', href: '/projetos' },
    { name: 'Launchpool', href: '/launchpool' },
    { name: 'Governança', href: '/governanca' },
    { name: 'Tesouraria', href: '/tesouraria' },
  ],
  resources: [
    { name: 'Documentação', href: '/docs' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Suporte', href: '/sobre' },
    { name: 'API', href: '/docs' },
  ],
  legal: [
    { name: 'Termos de Uso', href: '/termos-servico' },
    { name: 'Política de Privacidade', href: '/politica-privacidade' },
    { name: 'Disclaimer', href: '/sobre' },
  ],
}

const socialLinks = [
  { name: 'Website', icon: Globe, href: 'https://lunes.io' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/lunesplatform' },
  { name: 'Telegram', icon: Send, href: 'https://t.me/lunesplatform' },
  { name: 'GitHub', icon: Github, href: 'https://github.com/lunes-platform' },
]

export function Footer() {
  return (
    <footer className="bg-slate-800 border-t border-slate-600">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-title font-bold text-xl text-gradient">
                Launchpad Lunes
              </span>
            </Link>
            <p className="text-slate-200 mb-6 max-w-md">
              Plataforma de lançamento de tokens multi-chain com suporte a Lunes, TON e Solana. 
              Participe de IDOs, staking e governança descentralizada.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-900 hover:bg-primary border border-slate-600 hover:border-primary rounded-lg flex items-center justify-center transition-all duration-200 group"
                >
                  <social.icon className="w-5 h-5 text-slate-200 group-hover:text-white transition-colors duration-200" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-title font-semibold text-white mb-4">Plataforma</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-200 hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-title font-semibold text-white mb-4">Recursos</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-200 hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-title font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-200 hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-600 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2024 Launchpad Lunes. Todos os direitos reservados.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-slate-400 text-sm">Powered by</span>
            <div className="flex items-center space-x-2">
              <span className="text-primary font-medium text-sm">Lunes Network</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
