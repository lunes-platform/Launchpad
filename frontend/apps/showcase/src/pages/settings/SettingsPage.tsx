import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Card, Button } from "@launchpad/shared-ui";
import { Shield, Lock, Bell, Globe, Check, Loader2 } from "lucide-react";

const SettingsPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();
  const { currentLanguage, setLanguage, isLoading: isLanguageLoading, supportedLanguages } = useLanguage();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        {t('common.loading')}
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  /**
   * Função para alterar o idioma
   */
  const handleLanguageChange = async (languageCode: string) => {
    try {
      await setLanguage(languageCode as any);
      setShowLanguageDropdown(false);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-grafite-900 via-grafite-800 to-grafite-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
      
      <div className="relative z-10 py-8 overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
          {/* Header Principal */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-azul-500 to-roxo-600 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {t('settings.title')}
            </h1>
            <p className="text-grafite-300 text-lg">
              {t('settings.subtitle')}
            </p>
          </div>

          <div className="space-y-8 overflow-visible">
        {/* Seção de Idioma */}
        <Card className="bg-grafite-800/50 backdrop-blur-md border-grafite-700/50 hover:border-roxo-500/50 transition-all duration-300 overflow-visible">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-white">
            <Globe className="mr-3 h-6 w-6 text-azul-400" /> {t('settings.language.title')}
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-grafite-600/50 rounded-lg bg-grafite-700/30">
              <div>
                <h3 className="font-semibold text-white">{t('settings.language.current')}</h3>
                <p className="text-sm text-grafite-300">
                  {t('settings.language.description')}
                </p>
              </div>
              <div className="relative">
                <Button 
                  variant="outline" 
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  disabled={isLanguageLoading}
                  className="min-w-[140px] justify-between"
                >
                  {isLanguageLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Globe className="mr-2 h-4 w-4" />
                  )}
                  {supportedLanguages.find(lang => lang.code === currentLanguage)?.nativeName}
                </Button>
                
                {showLanguageDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-grafite-800 border border-grafite-600/50 rounded-lg shadow-lg z-[9999] backdrop-blur-md">
                    {supportedLanguages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`w-full px-4 py-3 text-left hover:bg-grafite-700/50 flex items-center justify-between ${
                          currentLanguage === language.code ? 'bg-roxo-500/20 text-roxo-400' : 'text-white'
                        } first:rounded-t-lg last:rounded-b-lg transition-colors duration-200`}
                        disabled={isLanguageLoading}
                      >
                        <div>
                          <div className="font-medium">{language.nativeName}</div>
                          <div className="text-sm text-grafite-300">{language.name}</div>
                        </div>
                        {currentLanguage === language.code && (
                          <Check className="h-4 w-4 text-roxo-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Seção de Segurança */}
        <Card className="bg-grafite-800/50 backdrop-blur-md border-grafite-700/50 hover:border-roxo-500/50 transition-all duration-300">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-white">
            <Shield className="mr-3 h-6 w-6 text-azul-400" /> {t('settings.security.title')}
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-grafite-600/50 rounded-lg bg-grafite-700/30">
              <div>
                <h3 className="font-semibold text-white">{t('settings.security.changePassword')}</h3>
                <p className="text-sm text-grafite-300">
                  {t('settings.security.changePasswordDescription')}
                </p>
              </div>
              <Button variant="outline" size="sm" className="border-grafite-600 text-white hover:bg-grafite-700">
                {t('settings.security.change')}
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border border-grafite-600/50 rounded-lg bg-grafite-700/30">
              <div>
                <h3 className="font-semibold text-white">
                  {t('settings.security.twoFactor')}
                </h3>
                <p className="text-sm text-grafite-300">
                  {t('settings.security.twoFactorDescription')}
                </p>
              </div>
              <Button variant="outline" size="sm" className="border-grafite-600 text-white hover:bg-grafite-700">
                {t('settings.security.activate')}
              </Button>
            </div>
          </div>
        </Card>

        {/* Seção de Notificações */}
        <Card className="bg-grafite-800/50 backdrop-blur-md border-grafite-700/50 hover:border-roxo-500/50 transition-all duration-300">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-white">
            <Bell className="mr-3 h-6 w-6 text-azul-400" /> {t('settings.notifications.title')}
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-grafite-600/50 rounded-lg bg-grafite-700/30">
              <div>
                <h3 className="font-semibold text-white">{t('settings.notifications.email')}</h3>
                <p className="text-sm text-grafite-300">
                  {t('settings.notifications.emailDescription')}
                </p>
              </div>
              <Button variant="outline" size="sm" disabled className="border-grafite-600 text-grafite-400">
                {t('settings.notifications.enabled')}
              </Button>
            </div>
          </div>
        </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
