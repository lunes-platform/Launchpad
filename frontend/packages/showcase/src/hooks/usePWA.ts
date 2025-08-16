import { useState, useEffect } from 'react'

interface PWAInstallPrompt extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PWAState {
  isInstallable: boolean
  isInstalled: boolean
  isOnline: boolean
  isUpdateAvailable: boolean
  installPrompt: PWAInstallPrompt | null
}

interface PWAActions {
  install: () => Promise<void>
  update: () => Promise<void>
  dismissInstall: () => void
}

export function usePWA(): PWAState & PWAActions {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      const isInWebAppChrome = window.matchMedia('(display-mode: standalone)').matches
      
      setIsInstalled(isStandalone || isInWebAppiOS || isInWebAppChrome)
    }

    checkInstalled()

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as PWAInstallPrompt)
      setIsInstallable(true)
    }

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setInstallPrompt(null)
    }

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Register event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          setRegistration(reg)
          
          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setIsUpdateAvailable(true)
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const install = async (): Promise<void> => {
    if (!installPrompt) {
      throw new Error('Install prompt not available')
    }

    try {
      await installPrompt.prompt()
      const choiceResult = await installPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true)
        setIsInstallable(false)
        setInstallPrompt(null)
      }
    } catch (error) {
      console.error('Installation failed:', error)
      throw error
    }
  }

  const update = async (): Promise<void> => {
    if (!registration || !registration.waiting) {
      throw new Error('No update available')
    }

    try {
      // Tell the waiting service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      
      // Listen for the controlling service worker change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })
      
      setIsUpdateAvailable(false)
    } catch (error) {
      console.error('Update failed:', error)
      throw error
    }
  }

  const dismissInstall = (): void => {
    setIsInstallable(false)
    setInstallPrompt(null)
  }

  return {
    isInstallable,
    isInstalled,
    isOnline,
    isUpdateAvailable,
    installPrompt,
    install,
    update,
    dismissInstall
  }
}

// Hook for push notifications
export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)

  useEffect(() => {
    const checkSupport = () => {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window
      setIsSupported(supported)
    }

    const checkSubscription = async () => {
      if (!isSupported) return

      try {
        const registration = await navigator.serviceWorker.ready
        const sub = await registration.pushManager.getSubscription()
        
        setSubscription(sub)
        setIsSubscribed(!!sub)
      } catch (error) {
        console.error('Error checking push subscription:', error)
      }
    }

    checkSupport()
    checkSubscription()
  }, [isSupported])

  const subscribe = async (): Promise<PushSubscription> => {
    if (!isSupported) {
      throw new Error('Push notifications not supported')
    }

    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        throw new Error('Notification permission denied')
      }

      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
      })

      setSubscription(sub)
      setIsSubscribed(true)

      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sub)
      })

      return sub
    } catch (error) {
      console.error('Push subscription failed:', error)
      throw error
    }
  }

  const unsubscribe = async (): Promise<void> => {
    if (!subscription) {
      throw new Error('No active subscription')
    }

    try {
      await subscription.unsubscribe()
      
      // Remove subscription from server
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      })

      setSubscription(null)
      setIsSubscribed(false)
    } catch (error) {
      console.error('Push unsubscription failed:', error)
      throw error
    }
  }

  return {
    isSupported,
    isSubscribed,
    subscription,
    subscribe,
    unsubscribe
  }
}

// Hook for background sync
export function useBackgroundSync() {
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype
    setIsSupported(supported)
  }, [])

  const scheduleSync = async (tag: string, data?: any): Promise<void> => {
    if (!isSupported) {
      throw new Error('Background sync not supported')
    }

    try {
      const registration = await navigator.serviceWorker.ready
      
      // Store data in IndexedDB if provided
      if (data) {
        await storeOfflineAction(tag, data)
      }
      
      await registration.sync.register(tag)
    } catch (error) {
      console.error('Background sync registration failed:', error)
      throw error
    }
  }

  return {
    isSupported,
    scheduleSync
  }
}

// Utility function to store offline actions
async function storeOfflineAction(tag: string, data: any): Promise<void> {
  // Implementation would use IndexedDB to store the action
  console.log('Storing offline action:', tag, data)
}

// Hook for app updates
export function useAppUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          setUpdateAvailable(true)
        }
      })
    }
  }, [])

  const applyUpdate = async (): Promise<void> => {
    if (!updateAvailable) return

    setIsUpdating(true)
    
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload()
        })
      }
    } catch (error) {
      console.error('Update failed:', error)
      setIsUpdating(false)
      throw error
    }
  }

  return {
    updateAvailable,
    isUpdating,
    applyUpdate
  }
}
