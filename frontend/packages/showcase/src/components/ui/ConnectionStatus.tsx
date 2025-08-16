import { useState, useEffect } from 'react'
import { Wifi, WifiOff, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [hasShownOfflineToast, setHasShownOfflineToast] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setHasShownOfflineToast(false)
      toast.success('Conexão restaurada!', {
        icon: '🌐',
        duration: 3000
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      if (!hasShownOfflineToast) {
        toast.error('Conexão perdida. Algumas funcionalidades podem estar limitadas.', {
          icon: '📡',
          duration: 5000
        })
        setHasShownOfflineToast(true)
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [hasShownOfflineToast])

  if (isOnline) {
    return null
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-error/10 border border-error/20 text-error px-4 py-2 rounded-card shadow-lg backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">Sem conexão</span>
        </div>
      </div>
    </div>
  )
}

export default ConnectionStatus
