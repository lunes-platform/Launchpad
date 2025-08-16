import { useState, useCallback, useEffect } from 'react'
import { Notification } from '@/contexts/AppContext'
import useLocalStorage from './useLocalStorage'

export function useNotifications() {
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('launchpad-notifications', [])
  const [isPermissionGranted, setIsPermissionGranted] = useState(false)

  // Verificar permissões de notificação ao inicializar
  useEffect(() => {
    if ('Notification' in window) {
      setIsPermissionGranted(Notification.permission === 'granted')
    }
  }, [])

  // Solicitar permissão para notificações
  const requestPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      setIsPermissionGranted(permission === 'granted')
      return permission === 'granted'
    }
    return false
  }, [])

  // Adicionar nova notificação
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    }
    
    setNotifications(prev => [newNotification, ...prev])

    // Mostrar notificação no navegador se permitido
    if (isPermissionGranted && document.hidden) {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      })
    }

    return newNotification.id
  }, [setNotifications, isPermissionGranted])

  // Marcar notificação como lida
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }, [setNotifications])

  // Marcar todas como lidas
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }, [setNotifications])

  // Remover notificação
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }, [setNotifications])

  // Limpar todas as notificações
  const clearAll = useCallback(() => {
    setNotifications([])
  }, [setNotifications])

  // Contar não lidas
  const unreadCount = notifications.filter(notif => !notif.read).length

  return {
    notifications,
    unreadCount,
    isPermissionGranted,
    requestPermission,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  }
}

export default useNotifications