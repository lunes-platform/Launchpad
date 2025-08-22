import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Importar recursos de tradução
import enTranslations from '../locales/en/common.json';
import esTranslations from '../locales/es/common.json';
import ptTranslations from '../locales/pt/common.json';

/**
 * Configuração do sistema de internacionalização (i18n)
 * Suporta inglês, espanhol e português com detecção automática de idioma
 */
i18n
  // Detecta idioma do navegador
  .use(LanguageDetector)
  // Carrega traduções via HTTP (para futuras expansões)
  .use(Backend)
  // Passa a instância i18n para react-i18next
  .use(initReactI18next)
  // Inicializa i18next
  .init({
    // Idioma padrão
    fallbackLng: 'en',
    
    // Idiomas suportados
    supportedLngs: ['en', 'es', 'pt'],
    
    // Configurações de debug (apenas em desenvolvimento)
    debug: process.env.NODE_ENV === 'development',
    
    // Recursos de tradução inline (para inicialização rápida)
    resources: {
      en: {
        common: enTranslations,
      },
      es: {
        common: esTranslations,
      },
      pt: {
        common: ptTranslations,
      },
    },
    
    // Namespace padrão
    defaultNS: 'common',
    
    // Configurações do detector de idioma
    detection: {
      // Ordem de detecção: localStorage -> navegador -> padrão
      order: ['localStorage', 'navigator', 'htmlTag'],
      
      // Cache no localStorage
      caches: ['localStorage'],
      
      // Chave para armazenar no localStorage
      lookupLocalStorage: 'launchpad-language',
    },
    
    // Configurações de interpolação
    interpolation: {
      // React já escapa por padrão
      escapeValue: false,
    },
    
    // Configurações do backend (para carregamento dinâmico futuro)
    backend: {
      // Caminho para arquivos de tradução
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // Configurações de reação a mudanças
    react: {
      // Usar Suspense para carregamento assíncrono
      useSuspense: false,
    },
  });

export default i18n;

/**
 * Tipos para melhor experiência de desenvolvimento
 */
export type SupportedLanguage = 'en' | 'es' | 'pt';

/**
 * Mapeamento de códigos de idioma para nomes legíveis
 */
export const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
};

/**
 * Mapeamento de códigos de idioma para flags (emojis)
 */
export const languageFlags: Record<SupportedLanguage, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  pt: '🇧🇷',
};

/**
 * Utilitário para obter informações do idioma atual
 */
export const getCurrentLanguageInfo = () => {
  const currentLang = i18n.language as SupportedLanguage;
  return {
    code: currentLang,
    name: languageNames[currentLang] || languageNames.en,
    flag: languageFlags[currentLang] || languageFlags.en,
  };
};

/**
 * Utilitário para trocar idioma
 */
export const changeLanguage = (language: SupportedLanguage) => {
  return i18n.changeLanguage(language);
};