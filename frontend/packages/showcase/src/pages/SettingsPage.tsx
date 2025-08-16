import { useState } from 'react'
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  DollarSign,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  Copy,
  QrCode
} from 'lucide-react'
import { useApp, useSettings } from '@/contexts/AppContext'
import { useWallet } from '@/contexts/WalletContext'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { selectedAccount } = useWallet()
  const { settings, updateSettings } = useSettings()
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  // Form states
  const [profileData, setProfileData] = useState({
    username: 'crypto_trader_01',
    email: 'user@example.com',
    bio: 'Investidor em projetos blockchain inovadores',
    avatar: '',
    website: '',
    twitter: '',
    telegram: ''
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    priceAlerts: true,
    marketingEmails: false,
    weeklyReport: true,
    investmentAlerts: true,
    stakingRewards: true,
    raffleResults: true
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailVerified: true,
    phoneVerified: false,
    apiKeyEnabled: false,
    sessionTimeout: 30,
    loginAlerts: true
  })

  const [privacySettings, setPrivacySettings] = useState({
    profilePublic: true,
    showInvestments: false,
    showReturns: false,
    allowAnalytics: true,
    shareData: false
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      // Mock save process
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Configurações de notificação salvas!')
    } catch (error) {
      toast.error('Erro ao salvar configurações')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSecurity = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Configurações de segurança salvas!')
    } catch (error) {
      toast.error('Erro ao salvar configurações')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePrivacy = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Configurações de privacidade salvas!')
    } catch (error) {
      toast.error('Erro ao salvar configurações')
    } finally {
      setIsLoading(false)
    }
  }

  const generateApiKey = () => {
    const apiKey = 'lunes_' + Math.random().toString(36).substr(2, 32)
    navigator.clipboard.writeText(apiKey)
    toast.success('Nova API key gerada e copiada!')
  }

  const exportData = () => {
    const data = {
      profile: profileData,
      settings: settings,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'launchpad-lunes-data.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Dados exportados com sucesso!')
  }

  const deleteAccount = () => {
    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      toast.error('Funcionalidade de exclusão será implementada em breve')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container-custom text-center">
          <div className="inline-flex items-center space-x-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
            <Settings className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Configurações da Conta</span>
          </div>

          <h1 className="heading-1 mb-6">
            <Settings className="w-12 h-12 inline-block mr-4 text-primary" />
            <span className="text-gradient">Configurações</span>
          </h1>
          <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
            Personalize sua experiência na plataforma. Configure notificações, segurança,
            privacidade e preferências gerais.
          </p>
        </div>
      </section>

      <div className="container-custom section-padding">
        {!selectedAccount ? (
          <div className="card text-center py-12">
            <Settings className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="heading-4 mb-2">Conecte sua Carteira</h3>
            <p className="text-slate-200 mb-6">
              Conecte sua carteira para acessar as configurações da conta
            </p>
            <button className="btn-primary">
              <Settings className="w-4 h-4 mr-2" />
              Conectar Carteira
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <div className="card">
                <h3 className="heading-4 mb-4">Configurações</h3>
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center space-x-3 p-3 rounded-button transition-colors duration-200 ${
                      activeTab === 'profile'
                        ? 'bg-primary text-white'
                        : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Perfil</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center space-x-3 p-3 rounded-button transition-colors duration-200 ${
                      activeTab === 'notifications'
                        ? 'bg-primary text-white'
                        : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                    <span>Notificações</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center space-x-3 p-3 rounded-button transition-colors duration-200 ${
                      activeTab === 'security'
                        ? 'bg-primary text-white'
                        : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Segurança</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('privacy')}
                    className={`w-full flex items-center space-x-3 p-3 rounded-button transition-colors duration-200 ${
                      activeTab === 'privacy'
                        ? 'bg-primary text-white'
                        : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span>Privacidade</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('preferences')}
                    className={`w-full flex items-center space-x-3 p-3 rounded-button transition-colors duration-200 ${
                      activeTab === 'preferences'
                        ? 'bg-primary text-white'
                        : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Palette className="w-4 h-4" />
                    <span>Preferências</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('data')}
                    className={`w-full flex items-center space-x-3 p-3 rounded-button transition-colors duration-200 ${
                      activeTab === 'data'
                        ? 'bg-primary text-white'
                        : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span>Dados</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="card">
                  <h3 className="heading-4 mb-6">Informações do Perfil</h3>

                  <div className="space-y-6">
                    {/* Avatar */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Avatar</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <button className="btn-outline text-sm mr-2">
                            <Upload className="w-4 h-4 mr-2" />
                            Enviar Foto
                          </button>
                          <button className="btn-outline text-sm text-error border-error">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Nome de Usuário</label>
                        <input
                          type="text"
                          value={profileData.username}
                          onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          className="input"
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Bio</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                        className="input resize-none"
                        placeholder="Conte um pouco sobre você..."
                      />
                    </div>

                    {/* Social Links */}
                    <div>
                      <label className="block text-sm font-medium mb-4">Links Sociais</label>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-slate-200 mb-1">Website</label>
                          <input
                            type="url"
                            value={profileData.website}
                            onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                            className="input"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-200 mb-1">Twitter</label>
                          <input
                            type="text"
                            value={profileData.twitter}
                            onChange={(e) => setProfileData(prev => ({ ...prev, twitter: e.target.value }))}
                            className="input"
                            placeholder="@username"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-200 mb-1">Telegram</label>
                          <input
                            type="text"
                            value={profileData.telegram}
                            onChange={(e) => setProfileData(prev => ({ ...prev, telegram: e.target.value }))}
                            className="input"
                            placeholder="@username"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className="btn-primary disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Salvar Perfil
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="card">
                  <h3 className="heading-4 mb-6">Configurações de Notificação</h3>

                  <div className="space-y-6">
                    {/* General Notifications */}
                    <div>
                      <h4 className="font-medium mb-4">Notificações Gerais</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Notificações por Email</p>
                            <p className="text-sm text-slate-200">Receba atualizações importantes por email</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.emailNotifications}
                              onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-borderLight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Notificações Push</p>
                            <p className="text-sm text-slate-200">Notificações no navegador</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.pushNotifications}
                              onChange={(e) => setNotificationSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-borderLight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Investment Notifications */}
                    <div>
                      <h4 className="font-medium mb-4">Investimentos</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Atualizações de Projetos</p>
                            <p className="text-sm text-slate-200">Novidades dos projetos que você investiu</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.projectUpdates}
                              onChange={(e) => setNotificationSettings(prev => ({ ...prev, projectUpdates: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-borderLight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Alertas de Investimento</p>
                            <p className="text-sm text-slate-200">Oportunidades de investimento</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.investmentAlerts}
                              onChange={(e) => setNotificationSettings(prev => ({ ...prev, investmentAlerts: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-borderLight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Platform Notifications */}
                    <div>
                      <h4 className="font-medium mb-4">Plataforma</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Recompensas de Staking</p>
                            <p className="text-sm text-slate-200">Notificações do launchpool</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.stakingRewards}
                              onChange={(e) => setNotificationSettings(prev => ({ ...prev, stakingRewards: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-borderLight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Resultados de Rifas</p>
                            <p className="text-sm text-slate-200">Resultados dos sorteios</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.raffleResults}
                              onChange={(e) => setNotificationSettings(prev => ({ ...prev, raffleResults: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-borderLight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Relatório Semanal</p>
                            <p className="text-sm text-slate-200">Resumo semanal de atividades</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notificationSettings.weeklyReport}
                              onChange={(e) => setNotificationSettings(prev => ({ ...prev, weeklyReport: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-borderLight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveNotifications}
                        disabled={isLoading}
                        className="btn-primary disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Salvar Configurações
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="card">
                  <h3 className="heading-4 mb-6">Configurações de Segurança</h3>

                  <div className="space-y-6">
                    {/* Account Security */}
                    <div>
                      <h4 className="font-medium mb-4">Segurança da Conta</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-800 rounded-card">
                          <div>
                            <p className="font-medium">Autenticação de Dois Fatores (2FA)</p>
                            <p className="text-sm text-slate-200">Adicione uma camada extra de segurança</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              securitySettings.twoFactorEnabled
                                ? 'bg-success/20 text-success'
                                : 'bg-error/20 text-error'
                            }`}>
                              {securitySettings.twoFactorEnabled ? 'Ativado' : 'Desativado'}
                            </span>
                            <button className="btn-outline text-sm">
                              {securitySettings.twoFactorEnabled ? 'Desativar' : 'Ativar'}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-800 rounded-card">
                          <div>
                            <p className="font-medium">Email Verificado</p>
                            <p className="text-sm text-slate-200">{profileData.email}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-success" />
                            <span className="text-xs text-success">Verificado</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* API Access */}
                    <div>
                      <h4 className="font-medium mb-4">Acesso à API</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">API Key Habilitada</p>
                            <p className="text-sm text-slate-200">Permite acesso programático à sua conta</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={securitySettings.apiKeyEnabled}
                              onChange={(e) => setSecuritySettings(prev => ({ ...prev, apiKeyEnabled: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-borderLight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        {securitySettings.apiKeyEnabled && (
                          <div className="p-4 bg-slate-800 rounded-card">
                            <div className="flex items-center justify-between mb-3">
                              <p className="font-medium">Sua API Key</p>
                              <button
                                onClick={() => setShowApiKey(!showApiKey)}
                                className="text-slate-400 hover:text-primary"
                              >
                                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                            <div className="flex items-center space-x-2 mb-3">
                              <code className="flex-1 bg-slate-900 p-2 rounded text-sm font-mono">
                                {showApiKey ? 'lunes_abc123def456ghi789jkl012mno345pqr678' : '••••••••••••••••••••••••••••••••••••••••'}
                              </code>
                              <button
                                onClick={() => navigator.clipboard.writeText('lunes_abc123def456ghi789jkl012mno345pqr678')}
                                className="btn-outline p-2"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                            <button
                              onClick={generateApiKey}
                              className="btn-outline text-sm"
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Gerar Nova Key
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Session Settings */}
                    <div>
                      <h4 className="font-medium mb-4">Configurações de Sessão</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Timeout da Sessão (minutos)</label>
                          <select
                            value={securitySettings.sessionTimeout}
                            onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                            className="input"
                          >
                            <option value={15}>15 minutos</option>
                            <option value={30}>30 minutos</option>
                            <option value={60}>1 hora</option>
                            <option value={120}>2 horas</option>
                            <option value={0}>Nunca</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Alertas de Login</p>
                            <p className="text-sm text-slate-200">Notificar sobre novos logins</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={securitySettings.loginAlerts}
                              onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAlerts: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-borderLight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveSecurity}
                        disabled={isLoading}
                        className="btn-primary disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Salvar Configurações
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="card">
                  <h3 className="heading-4 mb-6">Configurações de Privacidade</h3>

                  <div className="space-y-6">
                    {/* Profile Privacy */}
                    <div>
                      <h4 className="font-medium mb-4">Privacidade do Perfil</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Perfil Público</p>
                            <p className="text-sm text-slate-200">Permitir que outros vejam seu perfil</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacySettings.profilePublic}
                              onChange={(e) => setPrivacySettings(prev => ({ ...prev, profilePublic: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-borderLight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Mostrar Investimentos</p>
                            <p className="text-sm text-slate-200">Exibir seus investimentos no perfil</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacySettings.showInvestments}
                              onChange={(e) => setPrivacySettings(prev => ({ ...prev, showInvestments: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-borderLight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Mostrar Retornos</p>
                            <p className="text-sm text-slate-200">Exibir seus retornos e lucros</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacySettings.showReturns}
                              onChange={(e) => setPrivacySettings(prev => ({ ...prev, showReturns: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-borderLight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Data Privacy */}
                    <div>
                      <h4 className="font-medium mb-4">Privacidade de Dados</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Permitir Analytics</p>
                            <p className="text-sm text-slate-200">Ajudar a melhorar a plataforma com dados anônimos</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacySettings.allowAnalytics}
                              onChange={(e) => setPrivacySettings(prev => ({ ...prev, allowAnalytics: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-borderLight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Compartilhar Dados</p>
                            <p className="text-sm text-slate-200">Compartilhar dados com parceiros (sempre anônimo)</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacySettings.shareData}
                              onChange={(e) => setPrivacySettings(prev => ({ ...prev, shareData: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-borderLight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={handleSavePrivacy}
                        disabled={isLoading}
                        className="btn-primary disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Salvar Configurações
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences */}
              {activeTab === 'preferences' && (
                <div className="card">
                  <h3 className="heading-4 mb-6">Preferências Gerais</h3>

                  <div className="space-y-6">
                    {/* Appearance */}
                    <div>
                      <h4 className="font-medium mb-4">Aparência</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Tema</label>
                          <select
                            value={settings.theme}
                            onChange={(e) => updateSettings({ theme: e.target.value as 'dark' | 'light' })}
                            className="input"
                          >
                            <option value="dark">Escuro</option>
                            <option value="light">Claro</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Language & Region */}
                    <div>
                      <h4 className="font-medium mb-4">Idioma e Região</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Idioma</label>
                          <select
                            value={settings.language}
                            onChange={(e) => updateSettings({ language: e.target.value as 'pt' | 'en' })}
                            className="input"
                          >
                            <option value="pt">Português</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Moeda</label>
                          <select
                            value={settings.currency}
                            onChange={(e) => updateSettings({ currency: e.target.value as 'USD' | 'BRL' })}
                            className="input"
                          >
                            <option value="USD">USD ($)</option>
                            <option value="BRL">BRL (R$)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* General Preferences */}
                    <div>
                      <h4 className="font-medium mb-4">Geral</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Notificações Habilitadas</p>
                            <p className="text-sm text-slate-200">Controle geral de notificações</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications}
                              onChange={(e) => updateSettings({ notifications: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-borderLight peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Management */}
              {activeTab === 'data' && (
                <div className="card">
                  <h3 className="heading-4 mb-6">Gerenciamento de Dados</h3>

                  <div className="space-y-6">
                    {/* Export Data */}
                    <div>
                      <h4 className="font-medium mb-4">Exportar Dados</h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-800 rounded-card">
                          <div className="flex items-start space-x-3">
                            <Download className="w-5 h-5 text-info mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium">Baixar Seus Dados</p>
                              <p className="text-sm text-slate-200 mb-3">
                                Baixe uma cópia de todos os seus dados da plataforma em formato JSON.
                              </p>
                              <button
                                onClick={exportData}
                                className="btn-outline text-sm"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Exportar Dados
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Account Deletion */}
                    <div>
                      <h4 className="font-medium mb-4 text-error">Zona de Perigo</h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-error/10 border border-error/20 rounded-card">
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 text-error mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-error">Excluir Conta</p>
                              <p className="text-sm text-slate-200 mb-3">
                                Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.
                              </p>
                              <button
                                onClick={deleteAccount}
                                className="btn-outline text-sm text-error border-error hover:bg-error hover:text-white"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir Conta
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
