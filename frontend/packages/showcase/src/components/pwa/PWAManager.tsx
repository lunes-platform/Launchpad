import { useState, useEffect } from 'react'
import { 
  Download, 
  RefreshCw, 
  X, 
  Smartphone, 
  Wifi, 
  WifiOff,
  Bell,
  BellOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { usePWA, usePushNotifications, useAppUpdate } from '@/hooks/usePWA'
import toast from 'react-hot-toast'

export default function PWAManager() {
  const { 
    isInstallable, 
    isInstalled, 
    isOnline, 
    install, 
    dismissInstall 
  } = usePWA()
  
  const {
    isSupported: pushSupported,
    isSubscribed: pushSubscribed,
    subscribe: subscribePush,
    unsubscribe: unsubscribePush
  } = usePushNotifications()
  
  const {
    updateAvailable,
    isUpdating,
    applyUpdate
  } = useAppUpdate()

  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  // Show install prompt after delay
  useEffect(() => {
    if (isInstallable && !isInstalled) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true)
      }, 10000) // Show after 10 seconds

      return () => clearTimeout(timer)
    }
  }, [isInstallable, isInstalled])

  // Show update prompt
  useEffect(() => {
    if (updateAvailable) {
      setShowUpdatePrompt(true)
    }
  }, [updateAvailable])

  const handleInstall = async () => {
    setIsInstalling(true)
    try {
      await install()
      setShowInstallPrompt(false)
      toast.success('App instalado com sucesso!')
    } catch (error) {
      toast.error('Erro ao instalar o app')
    } finally {
      setIsInstalling(false)
    }
  }

  const handleUpdate = async () => {
    try {
      await applyUpdate()
      setShowUpdatePrompt(false)
    } catch (error) {
      toast.error('Erro ao atualizar o app')
    }
  }

  const handlePushToggle = async () => {
    try {
      if (pushSubscribed) {
        await unsubscribePush()
        toast.success('Notificações desabilitadas')
      } else {
        await subscribePush()
        toast.success('Notificações habilitadas')
      }
    } catch (error) {
      toast.error('Erro ao configurar notificações')
    }
  }

  return (
    <>
      {/* Connection Status */}
      <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isOnline ? 'translate-y-[-100px] opacity-0' : 'translate-y-0 opacity-100'
      }`}>
        <div className="bg-error text-white px-4 py-2 rounded-card shadow-lg flex items-center space-x-2">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">Sem conexão</span>
        </div>
      </div>

      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 z-50">
          <div className="bg-slate-800 border border-slate-600Light rounded-card shadow-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Instalar Launchpad Lunes</h4>
                <p className="text-sm text-slate-200 mb-3">
                  Instale o app para acesso rápido e notificações
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleInstall}
                    disabled={isInstalling}
                    className="btn-primary text-sm disabled:opacity-50"
                  >
                    {isInstalling ? (
                      <>
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        Instalando...
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3 mr-1" />
                        Instalar
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowInstallPrompt(false)
                      dismissInstall()
                    }}
                    className="btn-outline text-sm"
                  >
                    Agora não
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Prompt */}
      {showUpdatePrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 z-50">
          <div className="bg-slate-800 border border-slate-600Light rounded-card shadow-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Atualização Disponível</h4>
                <p className="text-sm text-slate-200 mb-3">
                  Uma nova versão do app está disponível
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="btn-primary text-sm disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <>
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        Atualizando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Atualizar
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowUpdatePrompt(false)}
                    className="btn-outline text-sm"
                  >
                    Depois
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowUpdatePrompt(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PWA Status Indicator (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-40">
          <div className="bg-slate-900 border border-slate-600Light rounded-card p-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success' : 'bg-error'}`} />
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isInstalled ? 'bg-success' : 'bg-textMuted'}`} />
                <span>{isInstalled ? 'Instalado' : 'Não instalado'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isInstallable ? 'bg-warning' : 'bg-textMuted'}`} />
                <span>{isInstallable ? 'Instalável' : 'Não instalável'}</span>
              </div>
              {pushSupported && (
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${pushSubscribed ? 'bg-success' : 'bg-textMuted'}`} />
                  <span>{pushSubscribed ? 'Push ativo' : 'Push inativo'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// PWA Settings Component for Settings Page
export function PWASettings() {
  const { isInstalled, isOnline } = usePWA()
  const {
    isSupported: pushSupported,
    isSubscribed: pushSubscribed,
    subscribe: subscribePush,
    unsubscribe: unsubscribePush
  } = usePushNotifications()

  const [isLoading, setIsLoading] = useState(false)

  const handlePushToggle = async () => {
    setIsLoading(true)
    try {
      if (pushSubscribed) {
        await unsubscribePush()
        toast.success('Notificações push desabilitadas')
      } else {
        await subscribePush()
        toast.success('Notificações push habilitadas')
      }
    } catch (error) {
      toast.error('Erro ao configurar notificações push')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-4">Progressive Web App</h4>
        <div className="space-y-4">
          {/* Installation Status */}
          <div className="flex items-center justify-between p-4 bg-slate-800 rounded-card">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isInstalled ? 'bg-success/20' : 'bg-textMuted/20'
              }`}>
                {isInstalled ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <Smartphone className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div>
                <p className="font-medium">Status da Instalação</p>
                <p className="text-sm text-slate-200">
                  {isInstalled ? 'App instalado como PWA' : 'App não instalado'}
                </p>
              </div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isInstalled 
                ? 'bg-success/20 text-success'
                : 'bg-textMuted/20 text-slate-400'
            }`}>
              {isInstalled ? 'Instalado' : 'Não instalado'}
            </span>
          </div>

          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 bg-slate-800 rounded-card">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isOnline ? 'bg-success/20' : 'bg-error/20'
              }`}>
                {isOnline ? (
                  <Wifi className="w-5 h-5 text-success" />
                ) : (
                  <WifiOff className="w-5 h-5 text-error" />
                )}
              </div>
              <div>
                <p className="font-medium">Status da Conexão</p>
                <p className="text-sm text-slate-200">
                  {isOnline ? 'Conectado à internet' : 'Modo offline'}
                </p>
              </div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isOnline 
                ? 'bg-success/20 text-success'
                : 'bg-error/20 text-error'
            }`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Push Notifications */}
          {pushSupported && (
            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-card">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  pushSubscribed ? 'bg-primary/20' : 'bg-textMuted/20'
                }`}>
                  {pushSubscribed ? (
                    <Bell className="w-5 h-5 text-primary" />
                  ) : (
                    <BellOff className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium">Notificações Push</p>
                  <p className="text-sm text-slate-200">
                    {pushSubscribed ? 'Recebendo notificações' : 'Notificações desabilitadas'}
                  </p>
                </div>
              </div>
              <button
                onClick={handlePushToggle}
                disabled={isLoading}
                className={`btn-outline text-sm disabled:opacity-50 ${
                  pushSubscribed ? 'text-error border-error' : 'text-primary border-primary'
                }`}
              >
                {isLoading ? (
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                ) : pushSubscribed ? (
                  <BellOff className="w-3 h-3 mr-1" />
                ) : (
                  <Bell className="w-3 h-3 mr-1" />
                )}
                {pushSubscribed ? 'Desabilitar' : 'Habilitar'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
