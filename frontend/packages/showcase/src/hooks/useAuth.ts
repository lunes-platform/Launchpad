// ========================================
// AUTH HOOKS - Launchpad Lunes Frontend
// ========================================

import { useState, useCallback, useEffect, useContext, createContext } from 'react'
import { api } from '@/lib/api'
import { useMutation } from './useApi'
import { 
  User, 
  LoginRequest, 
  RegisterRequest,
  ApiResponse 
} from '@/types/api'
import toast from 'react-hot-toast'

// ===== AUTH CONTEXT =====
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ===== AUTH PROVIDER =====
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // Login mutation
  const loginMutation = useMutation<
    { user: User; token: string; refreshToken: string },
    LoginRequest
  >(
    (data) => api.post('/auth/login', data),
    {
      onSuccess: (result) => {
        const { user, token, refreshToken } = result
        setUser(user)
        api.setAuthToken(token, refreshToken)
        toast.success(`Bem-vindo, ${user.firstName || user.username || 'Usuário'}!`)
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao fazer login')
      }
    }
  )

  // Register mutation
  const registerMutation = useMutation<
    { user: User; token: string; refreshToken: string },
    RegisterRequest
  >(
    (data) => api.post('/auth/register', data),
    {
      onSuccess: (result) => {
        const { user, token, refreshToken } = result
        setUser(user)
        api.setAuthToken(token, refreshToken)
        toast.success('Conta criada com sucesso!')
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao criar conta')
      }
    }
  )

  // Update profile mutation
  const updateProfileMutation = useMutation<User, Partial<User>>(
    (data) => api.put('/auth/profile', data),
    {
      onSuccess: (updatedUser) => {
        setUser(updatedUser)
        toast.success('Perfil atualizado com sucesso!')
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao atualizar perfil')
      }
    }
  )

  // Check authentication
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await api.get<User>('/auth/me')
      setUser(response.data)
    } catch (error) {
      // Token invalid or expired
      setUser(null)
      api.logout()
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Login function
  const login = useCallback(async (data: LoginRequest) => {
    return loginMutation.mutate(data)
  }, [loginMutation])

  // Register function
  const register = useCallback(async (data: RegisterRequest) => {
    return registerMutation.mutate(data)
  }, [registerMutation])

  // Logout function
  const logout = useCallback(() => {
    setUser(null)
    api.logout()
    toast.success('Logout realizado com sucesso')
  }, [])

  // Update profile function
  const updateProfile = useCallback(async (data: Partial<User>) => {
    return updateProfileMutation.mutate(data)
  }, [updateProfileMutation])

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      checkAuth()
    } else {
      setIsLoading(false)
    }
  }, [checkAuth])

  const value = {
    user,
    isAuthenticated,
    isLoading: isLoading || loginMutation.loading || registerMutation.loading,
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ===== USE AUTH HOOK =====
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// ===== ADDITIONAL AUTH HOOKS =====

// KYC Status Hook
export function useKycStatus() {
  const { user } = useAuth()
  
  const kycMutation = useMutation<{ status: string; message: string }, FormData>(
    (formData) => api.post('/auth/kyc/submit', formData),
    {
      onSuccess: () => {
        toast.success('Documentos enviados para verificação!')
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao enviar documentos')
      }
    }
  )

  const submitKyc = useCallback(async (documents: {
    idDocument: File
    proofOfAddress: File
    selfie: File
  }) => {
    const formData = new FormData()
    formData.append('idDocument', documents.idDocument)
    formData.append('proofOfAddress', documents.proofOfAddress)
    formData.append('selfie', documents.selfie)
    
    return kycMutation.mutate(formData)
  }, [kycMutation])

  return {
    kycStatus: user?.kycStatus || 'not_started',
    isVerified: user?.isVerified || false,
    submitKyc,
    submitting: kycMutation.loading,
    error: kycMutation.error,
  }
}

// Password Management Hook
export function usePasswordManager() {
  const changePasswordMutation = useMutation<
    { message: string },
    { currentPassword: string; newPassword: string }
  >(
    (data) => api.post('/auth/change-password', data),
    {
      onSuccess: () => {
        toast.success('Senha alterada com sucesso!')
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao alterar senha')
      }
    }
  )

  const resetPasswordMutation = useMutation<
    { message: string },
    { email: string }
  >(
    (data) => api.post('/auth/reset-password', data),
    {
      onSuccess: () => {
        toast.success('E-mail de recuperação enviado!')
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao enviar e-mail de recuperação')
      }
    }
  )

  const changePassword = useCallback(async (data: {
    currentPassword: string
    newPassword: string
  }) => {
    return changePasswordMutation.mutate(data)
  }, [changePasswordMutation])

  const resetPassword = useCallback(async (email: string) => {
    return resetPasswordMutation.mutate({ email })
  }, [resetPasswordMutation])

  return {
    changePassword,
    resetPassword,
    changingPassword: changePasswordMutation.loading,
    resettingPassword: resetPasswordMutation.loading,
    changeError: changePasswordMutation.error,
    resetError: resetPasswordMutation.error,
  }
}

// Two-Factor Authentication Hook
export function use2FA() {
  const { user } = useAuth()
  
  const enable2FAMutation = useMutation<
    { qrCode: string; backupCodes: string[] },
    void
  >(
    () => api.post('/auth/2fa/enable'),
    {
      onSuccess: () => {
        toast.success('2FA habilitado com sucesso!')
      }
    }
  )

  const verify2FAMutation = useMutation<
    { message: string },
    { code: string }
  >(
    (data) => api.post('/auth/2fa/verify', data),
    {
      onSuccess: () => {
        toast.success('2FA verificado com sucesso!')
      },
      onError: (error) => {
        toast.error(error.message || 'Código inválido')
      }
    }
  )

  const disable2FAMutation = useMutation<
    { message: string },
    { code: string }
  >(
    (data) => api.post('/auth/2fa/disable', data),
    {
      onSuccess: () => {
        toast.success('2FA desabilitado')
      }
    }
  )

  const enable2FA = useCallback(() => {
    return enable2FAMutation.mutate()
  }, [enable2FAMutation])

  const verify2FA = useCallback((code: string) => {
    return verify2FAMutation.mutate({ code })
  }, [verify2FAMutation])

  const disable2FA = useCallback((code: string) => {
    return disable2FAMutation.mutate({ code })
  }, [disable2FAMutation])

  return {
    is2FAEnabled: user?.preferences?.twoFactor || false,
    enable2FA,
    verify2FA,
    disable2FA,
    setupData: enable2FAMutation.data,
    enabling: enable2FAMutation.loading,
    verifying: verify2FAMutation.loading,
    disabling: disable2FAMutation.loading,
    error: enable2FAMutation.error || verify2FAMutation.error || disable2FAMutation.error,
  }
}

// Session Management Hook
export function useSession() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const loadSessions = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get('/auth/sessions')
      setSessions(response.data)
    } catch (error) {
      console.error('Error loading sessions:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const revokeSession = useCallback(async (sessionId: string) => {
    try {
      await api.delete(`/auth/sessions/${sessionId}`)
      setSessions(prev => prev.filter(s => s.id !== sessionId))
      toast.success('Sessão revogada')
    } catch (error) {
      toast.error('Erro ao revogar sessão')
    }
  }, [])

  const revokeAllSessions = useCallback(async () => {
    try {
      await api.delete('/auth/sessions')
      setSessions([])
      toast.success('Todas as sessões foram revogadas')
    } catch (error) {
      toast.error('Erro ao revogar sessões')
    }
  }, [])

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  return {
    sessions,
    loading,
    revokeSession,
    revokeAllSessions,
    refresh: loadSessions,
  }
}

export default useAuth
