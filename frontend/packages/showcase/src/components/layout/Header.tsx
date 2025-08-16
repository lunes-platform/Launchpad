import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import WalletConnector from '@/components/wallet/WalletConnector'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Projetos', href: '/projetos' },
  { name: 'Launchpool', href: '/launchpool' },
  { name: 'Rifas', href: '/rifa' },
  { name: 'Governança', href: '/governanca' },
  { name: 'Treasury', href: '/treasury' },
  { name: 'Docs', href: '/docs' },
  { name: 'FAQ', href: '/faq' }
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-600">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-title font-bold text-xl text-gradient">
                Launchpad Lunes
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-primary'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Language & Wallet */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcher variant="minimal" />
              <WalletConnector variant="dropdown" showBalance={true} />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-slate-200 hover:text-white transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-600">
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-primary'
                        : 'text-slate-200 hover:text-white'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>


    </>
  )
}
