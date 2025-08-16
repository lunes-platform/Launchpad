import { useState } from 'react'
import { ChevronDown, Globe, Check } from 'lucide-react'
import { useLanguageSwitcher } from '@/hooks/useTranslation'

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'button' | 'minimal'
  className?: string
}

export default function LanguageSwitcher({ 
  variant = 'dropdown', 
  className = '' 
}: LanguageSwitcherProps) {
  const { 
    currentLanguage, 
    supportedLanguages, 
    switchLanguage, 
    getCurrentLanguageInfo 
  } = useLanguageSwitcher()
  
  const [isOpen, setIsOpen] = useState(false)
  const currentLang = getCurrentLanguageInfo()

  const handleLanguageChange = (languageCode: string) => {
    switchLanguage(languageCode)
    setIsOpen(false)
  }

  // Minimal variant - just flag
  if (variant === 'minimal') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors duration-200"
          title={currentLang?.name}
        >
          <span className="text-lg">{currentLang?.flag}</span>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-600Light rounded-card shadow-lg z-50">
              <div className="py-2">
                {supportedLanguages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-slate-800Hover transition-colors duration-200 ${
                      currentLanguage === language.code ? 'bg-primary/10 text-primary' : ''
                    }`}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span className="flex-1">{language.name}</span>
                    {currentLanguage === language.code && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Button variant - simple button
  if (variant === 'button') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn-outline flex items-center space-x-2"
        >
          <Globe className="w-4 h-4" />
          <span>{currentLang?.flag}</span>
          <span>{currentLang?.name}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-slate-600Light rounded-card shadow-lg z-50">
              <div className="py-2">
                {supportedLanguages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-800Hover transition-colors duration-200 ${
                      currentLanguage === language.code ? 'bg-primary/10 text-primary' : ''
                    }`}
                  >
                    <span className="text-xl">{language.flag}</span>
                    <div className="flex-1">
                      <p className="font-medium">{language.name}</p>
                      <p className="text-xs text-slate-200">{language.code}</p>
                    </div>
                    {currentLanguage === language.code && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-800Hover border border-slate-600Light rounded-button transition-colors duration-200"
      >
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="text-sm font-medium">{currentLang?.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-slate-600Light rounded-card shadow-lg z-50">
            <div className="p-3 border-b border-slate-600Light">
              <div className="flex items-center space-x-2 text-slate-200">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">Idioma / Language</span>
              </div>
            </div>
            <div className="py-2">
              {supportedLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-800Hover transition-colors duration-200 ${
                    currentLanguage === language.code ? 'bg-primary/10 text-primary' : ''
                  }`}
                >
                  <span className="text-xl">{language.flag}</span>
                  <div className="flex-1">
                    <p className="font-medium">{language.name}</p>
                    <p className="text-xs text-slate-200">{language.code}</p>
                  </div>
                  {currentLanguage === language.code && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Language switcher for settings page
export function LanguageSettings() {
  const { 
    currentLanguage, 
    supportedLanguages, 
    switchLanguage, 
    getCurrentLanguageInfo 
  } = useLanguageSwitcher()

  return (
    <div>
      <label className="block text-sm font-medium mb-3">Idioma / Language</label>
      <div className="space-y-2">
        {supportedLanguages.map((language) => (
          <button
            key={language.code}
            onClick={() => switchLanguage(language.code)}
            className={`w-full flex items-center space-x-3 p-4 rounded-card border transition-colors duration-200 ${
              currentLanguage === language.code
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-slate-600Light hover:border-primary/50 hover:bg-slate-800'
            }`}
          >
            <span className="text-2xl">{language.flag}</span>
            <div className="flex-1 text-left">
              <p className="font-medium">{language.name}</p>
              <p className="text-sm text-slate-200">{language.code}</p>
            </div>
            {currentLanguage === language.code && (
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// Compact language switcher for mobile
export function MobileLanguageSwitcher() {
  const { 
    currentLanguage, 
    supportedLanguages, 
    switchLanguage, 
    getCurrentLanguageInfo 
  } = useLanguageSwitcher()

  const currentLang = getCurrentLanguageInfo()

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-slate-200" />
      <select
        value={currentLanguage}
        onChange={(e) => switchLanguage(e.target.value)}
        className="bg-transparent border-none text-sm font-medium focus:outline-none cursor-pointer"
      >
        {supportedLanguages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.flag} {language.name}
          </option>
        ))}
      </select>
    </div>
  )
}
