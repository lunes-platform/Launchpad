// ========================================
// API CLIENT - Launchpad Lunes Frontend
// ========================================

import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError 
} from 'axios'
import toast from 'react-hot-toast'
import { ApiResponse, ApiError, PaginatedResponse } from '@/types/api'

// ===== CONFIGURATION =====
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'
const API_TIMEOUT = 30000 // 30 seconds
const RETRY_ATTEMPTS = 3
const RETRY_DELAY = 1000 // 1 second

// ===== API CLIENT CLASS =====
class ApiClient {
  private instance: AxiosInstance
  private authToken: string | null = null
  private refreshToken: string | null = null
  private isRefreshing = false
  private refreshPromise: Promise<string> | null = null

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    this.setupInterceptors()
    this.loadTokensFromStorage()
  }

  // ===== SETUP INTERCEPTORS =====
  private setupInterceptors() {
    // Request Interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth token
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`
        }

        // Add request timestamp
        config.metadata = { startTime: Date.now() }

        // Log request in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params,
          })
        }

        return config
      },
      (error) => {
        console.error('❌ Request Error:', error)
        return Promise.reject(error)
      }
    )

    // Response Interceptor
    this.instance.interceptors.response.use(
      (response) => {
        // Calculate response time
        const duration = Date.now() - response.config.metadata?.startTime
        
        // Log response in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`, {
            status: response.status,
            data: response.data,
          })
        }

        return response
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

        // Handle token refresh for 401 errors
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.refreshToken && !this.isRefreshing) {
            originalRequest._retry = true
            
            try {
              const newToken = await this.refreshAuthToken()
              originalRequest.headers = originalRequest.headers || {}
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return this.instance(originalRequest)
            } catch (refreshError) {
              this.logout()
              return Promise.reject(refreshError)
            }
          } else if (this.isRefreshing && this.refreshPromise) {
            try {
              const newToken = await this.refreshPromise
              originalRequest.headers = originalRequest.headers || {}
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return this.instance(originalRequest)
            } catch (refreshError) {
              return Promise.reject(refreshError)
            }
          }
        }

        // Handle different error types
        const apiError = this.handleError(error)
        
        // Show toast for user-facing errors
        if (error.response?.status !== 401) {
          toast.error(apiError.message)
        }

        return Promise.reject(apiError)
      }
    )
  }

  // ===== ERROR HANDLING =====
  private handleError(error: AxiosError): ApiError {
    const response = error.response
    const request = error.request
    
    // Server responded with error status
    if (response) {
      const data = response.data as any
      
      return {
        code: data?.code || `HTTP_${response.status}`,
        message: data?.message || this.getDefaultErrorMessage(response.status),
        details: data?.details || {},
        statusCode: response.status,
      }
    }
    
    // Request was made but no response received
    if (request) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Erro de conexão. Verifique sua internet e tente novamente.',
        details: { request: request },
      }
    }
    
    // Something else happened
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'Erro inesperado. Tente novamente.',
      details: { originalError: error },
    }
  }

  private getDefaultErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Dados inválidos. Verifique as informações enviadas.'
      case 401:
        return 'Acesso não autorizado. Faça login novamente.'
      case 403:
        return 'Você não tem permissão para esta ação.'
      case 404:
        return 'Recurso não encontrado.'
      case 409:
        return 'Conflito de dados. Este recurso já existe.'
      case 422:
        return 'Dados de entrada inválidos.'
      case 429:
        return 'Muitas tentativas. Aguarde alguns minutos.'
      case 500:
        return 'Erro interno do servidor. Tente novamente mais tarde.'
      case 502:
        return 'Serviço temporariamente indisponível.'
      case 503:
        return 'Serviço em manutenção. Tente novamente mais tarde.'
      default:
        return 'Erro inesperado. Tente novamente.'
    }
  }

  // ===== AUTHENTICATION =====
  setAuthToken(token: string, refresh?: string) {
    this.authToken = token
    this.refreshToken = refresh || null
    
    // Store in localStorage
    localStorage.setItem('auth_token', token)
    if (refresh) {
      localStorage.setItem('refresh_token', refresh)
    }
  }

  private loadTokensFromStorage() {
    this.authToken = localStorage.getItem('auth_token')
    this.refreshToken = localStorage.getItem('refresh_token')
  }

  private async refreshAuthToken(): Promise<string> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise
    }

    this.isRefreshing = true
    this.refreshPromise = this.performTokenRefresh()

    try {
      const newToken = await this.refreshPromise
      this.isRefreshing = false
      this.refreshPromise = null
      return newToken
    } catch (error) {
      this.isRefreshing = false
      this.refreshPromise = null
      throw error
    }
  }

  private async performTokenRefresh(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken: this.refreshToken,
      })

      const { accessToken, refreshToken } = response.data.data
      this.setAuthToken(accessToken, refreshToken)
      return accessToken
    } catch (error) {
      this.logout()
      throw error
    }
  }

  logout() {
    this.authToken = null
    this.refreshToken = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    
    // Redirect to login if needed
    if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/admin')) {
      window.location.href = '/'
    }
  }

  // ===== RETRY MECHANISM =====
  private async retryRequest<T>(
    request: () => Promise<T>,
    attempts: number = RETRY_ATTEMPTS
  ): Promise<T> {
    try {
      return await request()
    } catch (error) {
      if (attempts > 1) {
        await this.delay(RETRY_DELAY)
        return this.retryRequest(request, attempts - 1)
      }
      throw error
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // ===== HTTP METHODS =====
  async get<T = any>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.retryRequest(() => 
      this.instance.get<ApiResponse<T>>(url, config)
    )
    return response.data
  }

  async post<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async put<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async patch<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config)
    return response.data
  }

  async delete<T = any>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config)
    return response.data
  }

  // ===== PAGINATED REQUESTS =====
  async getPaginated<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<PaginatedResponse<T>> {
    const response = await this.retryRequest(() =>
      this.instance.get<PaginatedResponse<T>>(url, {
        ...config,
        params: {
          page: 1,
          limit: 20,
          ...params,
        },
      })
    )
    return response.data
  }

  // ===== FILE UPLOAD =====
  async uploadFile<T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.instance.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })

    return response.data
  }

  // ===== HEALTH CHECK =====
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health')
      return true
    } catch (error) {
      return false
    }
  }

  // ===== DOWNLOAD =====
  async downloadFile(url: string, filename?: string): Promise<void> {
    try {
      const response = await this.instance.get(url, {
        responseType: 'blob',
      })

      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      
      link.href = downloadUrl
      link.download = filename || 'download'
      document.body.appendChild(link)
      link.click()
      
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Download failed:', error)
      throw error
    }
  }
}

// ===== SINGLETON INSTANCE =====
export const apiClient = new ApiClient()

// ===== CONVENIENCE EXPORTS =====
export const api = {
  get: apiClient.get.bind(apiClient),
  post: apiClient.post.bind(apiClient),
  put: apiClient.put.bind(apiClient),
  patch: apiClient.patch.bind(apiClient),
  delete: apiClient.delete.bind(apiClient),
  getPaginated: apiClient.getPaginated.bind(apiClient),
  uploadFile: apiClient.uploadFile.bind(apiClient),
  downloadFile: apiClient.downloadFile.bind(apiClient),
  healthCheck: apiClient.healthCheck.bind(apiClient),
  setAuthToken: apiClient.setAuthToken.bind(apiClient),
  logout: apiClient.logout.bind(apiClient),
}

export default apiClient
