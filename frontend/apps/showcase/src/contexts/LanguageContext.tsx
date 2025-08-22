import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguageInfo, type SupportedLanguage } from '../lib/i18n';

/**
 * Interface para o contexto de idioma
 */
interface LanguageContextType {
  /** Idioma atual */
  currentLanguage: SupportedLanguage;
  /** Função para alterar o idioma */
  setLanguage: (language: SupportedLanguage) => Promise<void>;
  /** Indica se está carregando as traduções */
  isLoading: boolean;
  /** Lista de idiomas suportados */
  supportedLanguages: Array<{
    code: SupportedLanguage;
    name: string;
    nativeName: string;
  }>;
}

/**
 * Lista de idiomas suportados com seus nomes
 */
const SUPPORTED_LANGUAGES = [
  {
    code: 'en' as SupportedLanguage,
    name: 'English',
    nativeName: 'English'
  },
  {
    code: 'es' as SupportedLanguage,
    name: 'Spanish',
    nativeName: 'Español'
  },
  {
    code: 'pt' as SupportedLanguage,
    name: 'Portuguese',
    nativeName: 'Português'
  }
];

/**
 * Contexto de idioma
 */
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Props do provider de idioma
 */
interface LanguageProviderProps {
  children: React.ReactNode;
}

/**
 * Provider do contexto de idioma
 * Gerencia o estado global do idioma da aplicação
 */
export function LanguageProvider({ children }: LanguageProviderProps) {
  const { i18n } = useTranslation();
  
  // Inicializa com o idioma salvo ou o padrão
  const getInitialLanguage = (): SupportedLanguage => {
    const savedLanguage = localStorage.getItem('launchpad-language') as SupportedLanguage;
    if (savedLanguage && ['en', 'es', 'pt'].includes(savedLanguage)) {
      return savedLanguage;
    }
    return getCurrentLanguageInfo().code;
  };
  
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(
    getInitialLanguage()
  );
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Função para alterar o idioma
   * @param language - Novo idioma a ser definido
   */
  const setLanguage = async (language: SupportedLanguage): Promise<void> => {
    if (language === currentLanguage) {
      return;
    }

    setIsLoading(true);
    
    try {
      await changeLanguage(language);
      setCurrentLanguage(language);
      
      // Persiste a preferência no localStorage (usando a mesma chave do i18next)
      localStorage.setItem('launchpad-language', language);
      
      // Atualiza o atributo lang do documento
      document.documentElement.lang = language;
      
      console.log(`Language changed to: ${language}`);
    } catch (error) {
      console.error('Error changing language:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Efeito para sincronizar o estado com mudanças do i18next
   */
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      const newLanguage = lng as SupportedLanguage;
      if (newLanguage !== currentLanguage) {
        setCurrentLanguage(newLanguage);
        document.documentElement.lang = newLanguage;
      }
    };

    // Escuta mudanças de idioma do i18next
    i18n.on('languageChanged', handleLanguageChange);

    // Define o idioma inicial no documento
    document.documentElement.lang = currentLanguage;

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n, currentLanguage]);

  /**
   * Efeito para sincronizar o idioma inicial com o i18next
   */
  useEffect(() => {
    // Sincroniza o i18next com o idioma inicial se necessário
    if (i18n.language !== currentLanguage) {
      changeLanguage(currentLanguage).catch((error) => {
        console.error('Error syncing initial language:', error);
      });
    }
    
    // Define o idioma inicial no documento
    document.documentElement.lang = currentLanguage;
  }, []);

  const contextValue: LanguageContextType = {
    currentLanguage,
    setLanguage,
    isLoading,
    supportedLanguages: SUPPORTED_LANGUAGES
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook para usar o contexto de idioma
 * @returns Contexto de idioma
 * @throws Error se usado fora do LanguageProvider
 */
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
}

/**
 * Hook personalizado para obter informações sobre um idioma específico
 * @param languageCode - Código do idioma
 * @returns Informações do idioma ou undefined se não encontrado
 */
export function useLanguageInfo(languageCode: SupportedLanguage) {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
}

/**
 * Hook para verificar se um idioma é suportado
 * @param languageCode - Código do idioma a verificar
 * @returns true se o idioma é suportado
 */
export function useIsSupportedLanguage(languageCode: string): languageCode is SupportedLanguage {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode);
}

export default LanguageContext;