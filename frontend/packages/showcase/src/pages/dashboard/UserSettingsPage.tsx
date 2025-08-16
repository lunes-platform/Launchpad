import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  CheckCircle,
  Settings,
  Key,
  Download,
  Trash2
} from 'lucide-react'
import { useWallet } from '@/contexts/WalletContext'
import toast from 'react-hot-toast'

// Mock user data
const mockUserData = {
  profile: {
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '+55 11 99999-9999',
    avatar: '👤',
    joinDate: new Date('2024-01-01'),
    kycStatus: 'verified',
    twoFactorEnabled: true
  },
  preferences: {
    language: 'pt-BR',
    currency: 'USD',
    timezone: 'America/Sao_Paulo',
    theme: 'dark',
    emailNotifications: {
      projectUpdates: true,
      vestingReleases: true,
      priceAlerts: false,
      newsletter: true,
      security: true
    },
    pushNotifications: {
      enabled: true,
      projectUpdates: true,
      vestingReleases: true,
      priceAlerts: false
    },
    privacy: {
      showPortfolio: false,
      showActivity: false,
      allowAnalytics: true
    }
  },
  security: {
    lastPasswordChange: new Date('2024-01-15'),
    activeSessions: 3,
    loginHistory: [
      { date: new Date(), location: 'São Paulo, BR', device: 'Chrome on Windows' },
      { date: new Date(Date.now() - 24 * 60 * 60 * 1000), location: 'São Paulo, BR', device: 'Mobile App' },
      { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), location: 'Rio de Janeiro, BR', device: 'Firefox on Mac' }
    ]
  }
}

export function UserSettingsPage() {
  const { selectedAccount } = useWallet()
  const [activeTab, setActiveTab] = useState('profile')
  const [userData, setUserData] = useState(mockUserData)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSensitiveData, setShowSensitiveData] = useState(false)

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'preferences', label: 'Preferências', icon: Settings },
    { id: 'privacy', label: 'Privacidade', icon: Eye }
  ]

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Mock save
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Configurações salvas com sucesso!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Erro ao salvar configurações')
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = () => {
    // Mock data export
    const dataToExport = {
      profile: userData.profile,
      preferences: userData.preferences,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'meus-dados-launchpad.json'
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success('Dados exportados com sucesso!')
  }

  const updateNotificationSetting = (category: string, setting: string, value: boolean) => {
    setUserData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: {
          ...prev.preferences[category as keyof typeof prev.preferences],
          [setting]: value
        }
      }
    }))
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-600">
        <div className="container-custom py-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 text-slate-200 hover:text-primary transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Dashboard</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="heading-2 mb-2">Configurações da Conta</h1>
              <p className="text-slate-200">
                Gerencie suas preferências, segurança e configurações da plataforma
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {isEditing && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              )}
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-outline"
              >
                <Settings className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancelar' : 'Editar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-button transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="card">
                  <h3 className="heading-4 mb-6">Informações Pessoais</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nome Completo</label>
                      <input
                        type="text"
                        value={userData.profile.name}
                        onChange={(e) => setUserData(prev => ({
                          ...prev,
                          profile: { ...prev.profile, name: e.target.value }
                        }))}
                        disabled={!isEditing}
                        className="input w-full disabled:opacity-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={userData.profile.email}
                        onChange={(e) => setUserData(prev => ({
                          ...prev,
                          profile: { ...prev.profile, email: e.target.value }
                        }))}
                        disabled={!isEditing}
                        className="input w-full disabled:opacity-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Telefone</label>
                      <input
                        type="tel"
                        value={userData.profile.phone}
                        onChange={(e) => setUserData(prev => ({
                          ...prev,
                          profile: { ...prev.profile, phone: e.target.value }
                        }))}
                        disabled={!isEditing}
                        className="input w-full disabled:opacity-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Status KYC</label>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-success font-medium">Verificado</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="heading-4 mb-6">Carteira Conectada</h3>
                  
                  {selectedAccount ? (
                    <div className="flex items-center justify-between p-4 bg-slate-800 border border-slate-600 rounded-button">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{selectedAccount.meta.name}</p>
                          <p className="text-sm text-slate-200">
                            {selectedAccount.address.slice(0, 8)}...{selectedAccount.address.slice(-6)}
                          </p>
                        </div>
                      </div>
                      
                      <span className="bg-success/20 text-success text-xs px-2 py-1 rounded-full">
                        Conectada
                      </span>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-200 mb-4">Nenhuma carteira conectada</p>
                      <Link to="/dashboard/carteiras" className="btn-primary">
                        Conectar Carteira
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="card">
                  <h3 className="heading-4 mb-6">Autenticação de Dois Fatores</h3>

                  <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-button">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <div>
                        <p className="font-medium text-success">2FA Habilitado</p>
                        <p className="text-sm text-slate-200">
                          Sua conta está protegida com autenticação de dois fatores
                        </p>
                      </div>
                    </div>

                    <button className="btn-outline text-sm">
                      Gerenciar 2FA
                    </button>
                  </div>
                </div>

                <div className="card">
                  <h3 className="heading-4 mb-6">Senha</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Última alteração</p>
                        <p className="text-sm text-slate-200">
                          {userData.security.lastPasswordChange.toLocaleDateString('pt-BR')}
                        </p>
                      </div>

                      <button className="btn-outline">
                        <Key className="w-4 h-4 mr-2" />
                        Alterar Senha
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="heading-4">Sessões Ativas</h3>
                    <span className="text-sm text-slate-200">
                      {userData.security.activeSessions} sessões ativas
                    </span>
                  </div>

                  <div className="space-y-3">
                    {userData.security.loginHistory.map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-800 border border-slate-600 rounded-button">
                        <div>
                          <p className="font-medium">{session.device}</p>
                          <p className="text-sm text-slate-200">
                            {session.location} • {session.date.toLocaleDateString('pt-BR')}
                          </p>
                        </div>

                        {index === 0 ? (
                          <span className="bg-success/20 text-success text-xs px-2 py-1 rounded-full">
                            Atual
                          </span>
                        ) : (
                          <button className="text-error hover:text-error/80 transition-colors duration-200">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="card">
                  <h3 className="heading-4 mb-6">Preferências Gerais</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Idioma</label>
                      <select
                        value={userData.preferences.language}
                        onChange={(e) => setUserData(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, language: e.target.value }
                        }))}
                        disabled={!isEditing}
                        className="input w-full disabled:opacity-50"
                      >
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Moeda</label>
                      <select
                        value={userData.preferences.currency}
                        onChange={(e) => setUserData(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, currency: e.target.value }
                        }))}
                        disabled={!isEditing}
                        className="input w-full disabled:opacity-50"
                      >
                        <option value="USD">USD - Dólar Americano</option>
                        <option value="BRL">BRL - Real Brasileiro</option>
                        <option value="EUR">EUR - Euro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Fuso Horário</label>
                      <select
                        value={userData.preferences.timezone}
                        onChange={(e) => setUserData(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, timezone: e.target.value }
                        }))}
                        disabled={!isEditing}
                        className="input w-full disabled:opacity-50"
                      >
                        <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                        <option value="America/New_York">New York (GMT-5)</option>
                        <option value="Europe/London">London (GMT+0)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Tema</label>
                      <select
                        value={userData.preferences.theme}
                        onChange={(e) => setUserData(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, theme: e.target.value }
                        }))}
                        disabled={!isEditing}
                        className="input w-full disabled:opacity-50"
                      >
                        <option value="dark">Escuro</option>
                        <option value="light">Claro</option>
                        <option value="auto">Automático</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="card">
                  <h3 className="heading-4 mb-6">Configurações de Privacidade</h3>

                  <div className="space-y-4">
                    {Object.entries(userData.preferences.privacy).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {key === 'showPortfolio' && 'Mostrar Portfólio Publicamente'}
                            {key === 'showActivity' && 'Mostrar Atividade Pública'}
                            {key === 'allowAnalytics' && 'Permitir Analytics'}
                          </p>
                          <p className="text-sm text-slate-200">
                            {key === 'showPortfolio' && 'Outros usuários podem ver seu portfólio'}
                            {key === 'showActivity' && 'Suas atividades aparecem em feeds públicos'}
                            {key === 'allowAnalytics' && 'Ajude-nos a melhorar a plataforma'}
                          </p>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => updateNotificationSetting('privacy', key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h3 className="heading-4 mb-6">Dados da Conta</h3>

                  <div className="space-y-4">
                    <button
                      onClick={handleExportData}
                      className="btn-outline w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Meus Dados
                    </button>

                    <div className="p-4 bg-error/10 border border-error/20 rounded-button">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-error mb-2">Zona de Perigo</h4>
                          <p className="text-sm text-slate-200 mb-4">
                            Ações irreversíveis que afetam permanentemente sua conta.
                          </p>
                          <button className="btn-ghost text-error border-error hover:bg-error hover:text-white">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir Conta
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="card">
                  <h3 className="heading-4 mb-6">Notificações por Email</h3>
                  
                  <div className="space-y-4">
                    {Object.entries(userData.preferences.emailNotifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {key === 'projectUpdates' && 'Atualizações de Projetos'}
                            {key === 'vestingReleases' && 'Liberações de Vesting'}
                            {key === 'priceAlerts' && 'Alertas de Preço'}
                            {key === 'newsletter' && 'Newsletter'}
                            {key === 'security' && 'Alertas de Segurança'}
                          </p>
                          <p className="text-sm text-slate-200">
                            {key === 'projectUpdates' && 'Receba atualizações sobre projetos que você investiu'}
                            {key === 'vestingReleases' && 'Notificações quando tokens estiverem disponíveis'}
                            {key === 'priceAlerts' && 'Alertas sobre mudanças significativas de preço'}
                            {key === 'newsletter' && 'Newsletter semanal com novidades da plataforma'}
                            {key === 'security' && 'Alertas importantes sobre segurança da conta'}
                          </p>
                        </div>
                        
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value as boolean}
                            onChange={(e) => updateNotificationSetting('emailNotifications', key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h3 className="heading-4 mb-6">Notificações Push</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Habilitar Notificações Push</p>
                        <p className="text-sm text-slate-200">
                          Receba notificações diretamente no navegador
                        </p>
                      </div>
                      
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userData.preferences.pushNotifications.enabled}
                          onChange={(e) => updateNotificationSetting('pushNotifications', 'enabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    {userData.preferences.pushNotifications.enabled && (
                      <>
                        {Object.entries(userData.preferences.pushNotifications).filter(([key]) => key !== 'enabled').map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between pl-6">
                            <div>
                              <p className="font-medium">
                                {key === 'projectUpdates' && 'Atualizações de Projetos'}
                                {key === 'vestingReleases' && 'Liberações de Vesting'}
                                {key === 'priceAlerts' && 'Alertas de Preço'}
                              </p>
                            </div>
                            
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value as boolean}
                                onChange={(e) => updateNotificationSetting('pushNotifications', key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
