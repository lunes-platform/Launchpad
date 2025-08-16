import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Project } from '@/components/projects/ProjectCard'

// Platform statistics interface
export interface PlatformStats {
  totalProjects: number
  totalRaised: number
  totalParticipants: number
  averageROI: number
  activeProjects: number
  completedProjects: number
  totalValueLocked: number
  monthlyGrowth: number
}

// User statistics interface
export interface UserStats {
  totalInvested: number
  activeInvestments: number
  tokensEarned: number
  portfolioValue: number
  totalReturns: number
  participatedProjects: number
  stakingRewards: number
  raffleWinnings: number
}

// Notification interface
export interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

// App context interface
interface AppContextType {
  // Platform data
  platformStats: PlatformStats
  userStats: UserStats | null
  notifications: Notification[]
  
  // Loading states
  isLoading: boolean
  isInitialized: boolean
  
  // Data refresh
  refreshPlatformStats: () => Promise<void>
  refreshUserStats: () => Promise<void>
  
  // Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markNotificationAsRead: (id: string) => void
  clearNotifications: () => void
  
  // Settings
  settings: {
    theme: 'dark' | 'light'
    language: 'pt' | 'en'
    currency: 'USD' | 'BRL'
    notifications: boolean
  }
  updateSettings: (settings: Partial<AppContextType['settings']>) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Mock platform statistics
const MOCK_PLATFORM_STATS: PlatformStats = {
  totalProjects: 47,
  totalRaised: 12500000,
  totalParticipants: 8420,
  averageROI: 156,
  activeProjects: 12,
  completedProjects: 35,
  totalValueLocked: 8750000,
  monthlyGrowth: 23
}

// Mock user statistics
const MOCK_USER_STATS: UserStats = {
  totalInvested: 15000,
  activeInvestments: 8,
  tokensEarned: 45000,
  portfolioValue: 23500,
  totalReturns: 8500,
  participatedProjects: 12,
  stakingRewards: 2800,
  raffleWinnings: 450
}

// Mock notifications
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Investimento Confirmado',
    message: 'Seu investimento de $500 no DeFi Protocol foi confirmado com sucesso.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    actionUrl: '/dashboard/meus-investimentos'
  },
  {
    id: '2',
    type: 'info',
    title: 'Novo Projeto Disponível',
    message: 'AI Blockchain está agora disponível para investimento na fase de whitelist.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: false,
    actionUrl: '/projects/ai-blockchain'
  },
  {
    id: '3',
    type: 'warning',
    title: 'Fase Terminando',
    message: 'A pré-venda do Gaming Metaverse termina em 2 horas.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    read: true,
    actionUrl: '/projects/gaming-metaverse'
  }
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [platformStats, setPlatformStats] = useState<PlatformStats>(MOCK_PLATFORM_STATS)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [settings, setSettings] = useState({
    theme: 'dark' as const,
    language: 'pt' as const,
    currency: 'USD' as const,
    notifications: true
  })

  // Initialize app data
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true)
      try {
        // Load saved settings
        const savedSettings = localStorage.getItem('appSettings')
        if (savedSettings) {
          setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }))
        }

        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Set user stats if wallet is connected
        const savedAccount = localStorage.getItem('selectedAccount')
        if (savedAccount) {
          setUserStats(MOCK_USER_STATS)
        }

        setIsInitialized(true)
      } catch (error) {
        console.error('Error initializing app:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  // Refresh platform statistics
  const refreshPlatformStats = async () => {
    try {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data update with some randomness
      setPlatformStats(prev => ({
        ...prev,
        totalRaised: prev.totalRaised + Math.floor(Math.random() * 100000),
        totalParticipants: prev.totalParticipants + Math.floor(Math.random() * 50),
        totalValueLocked: prev.totalValueLocked + Math.floor(Math.random() * 50000)
      }))
    } catch (error) {
      console.error('Error refreshing platform stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh user statistics
  const refreshUserStats = async () => {
    try {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data update
      if (userStats) {
        setUserStats(prev => prev ? {
          ...prev,
          portfolioValue: prev.portfolioValue + Math.floor(Math.random() * 1000) - 500,
          stakingRewards: prev.stakingRewards + Math.floor(Math.random() * 100),
          tokensEarned: prev.tokensEarned + Math.floor(Math.random() * 500)
        } : null)
      }
    } catch (error) {
      console.error('Error refreshing user stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Add notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    }
    
    setNotifications(prev => [newNotification, ...prev])
  }

  // Mark notification as read
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([])
  }

  // Update settings
  const updateSettings = (newSettings: Partial<AppContextType['settings']>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings }
      localStorage.setItem('appSettings', JSON.stringify(updated))
      return updated
    })
  }

  // Listen for wallet connection changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedAccount = localStorage.getItem('selectedAccount')
      if (savedAccount && !userStats) {
        setUserStats(MOCK_USER_STATS)
      } else if (!savedAccount && userStats) {
        setUserStats(null)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [userStats])

  const value: AppContextType = {
    platformStats,
    userStats,
    notifications,
    isLoading,
    isInitialized,
    refreshPlatformStats,
    refreshUserStats,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    settings,
    updateSettings
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

// Utility hooks
export function usePlatformStats() {
  const { platformStats, refreshPlatformStats, isLoading } = useApp()
  return { platformStats, refreshPlatformStats, isLoading }
}

export function useUserStats() {
  const { userStats, refreshUserStats, isLoading } = useApp()
  return { userStats, refreshUserStats, isLoading }
}

export function useNotifications() {
  const { 
    notifications, 
    addNotification, 
    markNotificationAsRead, 
    clearNotifications 
  } = useApp()
  
  const unreadCount = notifications.filter(n => !n.read).length
  
  return {
    notifications,
    unreadCount,
    addNotification,
    markNotificationAsRead,
    clearNotifications
  }
}

export function useSettings() {
  const { settings, updateSettings } = useApp()
  return { settings, updateSettings }
}
