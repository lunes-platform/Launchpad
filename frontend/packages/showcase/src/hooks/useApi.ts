// ========================================
// BASE API HOOK - Launchpad Lunes Frontend
// ========================================

import { useState, useCallback, useEffect } from 'react'
import { api } from '@/lib/api'
import { ApiResponse, ApiError } from '@/types/api'

// ===== BASE API HOOK =====
export interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  lastUpdated: number | null
}

export interface UseApiOptions {
  immediate?: boolean
  refreshInterval?: number
  onSuccess?: (data: any) => void
  onError?: (error: ApiError) => void
}

export function useApi<T = any>(
  endpoint: string,
  options: UseApiOptions = {}
) {
  const {
    immediate = true,
    refreshInterval,
    onSuccess,
    onError
  } = options

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  })

  const execute = useCallback(async (customEndpoint?: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const response = await api.get<T>(customEndpoint || endpoint)
      const newData = response.data

      setState({
        data: newData,
        loading: false,
        error: null,
        lastUpdated: Date.now(),
      })

      onSuccess?.(newData)
      return newData
    } catch (error) {
      const apiError = error as ApiError
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError,
      }))
      
      onError?.(apiError)
      throw apiError
    }
  }, [endpoint, onSuccess, onError])

  const refresh = useCallback(() => {
    return execute()
  }, [execute])

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      lastUpdated: null,
    })
  }, [])

  // Auto-execute on mount
  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  // Auto-refresh interval
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(execute, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [execute, refreshInterval])

  return {
    ...state,
    execute,
    refresh,
    reset,
  }
}

// ===== MUTATION HOOK =====
export interface UseMutationState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
}

export interface UseMutationOptions<T, P> {
  onSuccess?: (data: T, params: P) => void
  onError?: (error: ApiError, params: P) => void
  optimisticUpdate?: (params: P) => T
}

export function useMutation<T = any, P = any>(
  mutationFn: (params: P) => Promise<ApiResponse<T>>,
  options: UseMutationOptions<T, P> = {}
) {
  const { onSuccess, onError, optimisticUpdate } = options

  const [state, setState] = useState<UseMutationState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const mutate = useCallback(async (params: P) => {
    try {
      setState(prev => ({ 
        ...prev, 
        loading: true, 
        error: null,
        // Apply optimistic update if provided
        data: optimisticUpdate ? optimisticUpdate(params) : prev.data
      }))

      const response = await mutationFn(params)
      const newData = response.data

      setState({
        data: newData,
        loading: false,
        error: null,
      })

      onSuccess?.(newData, params)
      return newData
    } catch (error) {
      const apiError = error as ApiError
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError,
      }))

      onError?.(apiError, params)
      throw apiError
    }
  }, [mutationFn, onSuccess, onError, optimisticUpdate])

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    mutate,
    reset,
  }
}

// ===== PAGINATED HOOK =====
export interface UsePaginatedState<T> {
  data: T[]
  loading: boolean
  error: ApiError | null
  page: number
  totalPages: number
  total: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export function usePaginated<T = any>(
  endpoint: string,
  initialParams: Record<string, any> = {},
  options: UseApiOptions = {}
) {
  const [params, setParams] = useState({
    page: 1,
    limit: 20,
    ...initialParams,
  })

  const [state, setState] = useState<UsePaginatedState<T>>({
    data: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 0,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })

  const execute = useCallback(async (newParams?: Record<string, any>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const queryParams = newParams ? { ...params, ...newParams } : params
      const response = await api.getPaginated<T>(endpoint, queryParams)

      setState({
        data: response.data,
        loading: false,
        error: null,
        page: response.pagination.page,
        totalPages: response.pagination.pages,
        total: response.pagination.total,
        hasNextPage: response.pagination.page < response.pagination.pages,
        hasPrevPage: response.pagination.page > 1,
      })

      options.onSuccess?.(response.data)
      return response
    } catch (error) {
      const apiError = error as ApiError
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError,
      }))
      
      options.onError?.(apiError)
      throw apiError
    }
  }, [endpoint, params, options])

  const nextPage = useCallback(() => {
    if (state.hasNextPage) {
      const newParams = { ...params, page: state.page + 1 }
      setParams(newParams)
      return execute(newParams)
    }
  }, [state.hasNextPage, state.page, params, execute])

  const prevPage = useCallback(() => {
    if (state.hasPrevPage) {
      const newParams = { ...params, page: state.page - 1 }
      setParams(newParams)
      return execute(newParams)
    }
  }, [state.hasPrevPage, state.page, params, execute])

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= state.totalPages) {
      const newParams = { ...params, page }
      setParams(newParams)
      return execute(newParams)
    }
  }, [state.totalPages, params, execute])

  const updateParams = useCallback((newParams: Record<string, any>) => {
    const updatedParams = { ...params, ...newParams, page: 1 }
    setParams(updatedParams)
    return execute(updatedParams)
  }, [params, execute])

  const refresh = useCallback(() => {
    return execute()
  }, [execute])

  // Auto-execute on mount
  useEffect(() => {
    if (options.immediate !== false) {
      execute()
    }
  }, [execute])

  return {
    ...state,
    params,
    nextPage,
    prevPage,
    goToPage,
    updateParams,
    refresh,
    execute,
  }
}

// ===== INFINITE SCROLL HOOK =====
export interface UseInfiniteState<T> {
  data: T[]
  loading: boolean
  loadingMore: boolean
  error: ApiError | null
  hasMore: boolean
  page: number
}

export function useInfinite<T = any>(
  endpoint: string,
  initialParams: Record<string, any> = {},
  options: UseApiOptions = {}
) {
  const [params] = useState({
    limit: 20,
    ...initialParams,
  })

  const [state, setState] = useState<UseInfiniteState<T>>({
    data: [],
    loading: false,
    loadingMore: false,
    error: null,
    hasMore: true,
    page: 1,
  })

  const loadMore = useCallback(async () => {
    if (state.loadingMore || !state.hasMore) return

    try {
      setState(prev => ({ 
        ...prev, 
        loadingMore: true, 
        error: null 
      }))

      const response = await api.getPaginated<T>(endpoint, {
        ...params,
        page: state.page,
      })

      setState(prev => ({
        data: [...prev.data, ...response.data],
        loading: false,
        loadingMore: false,
        error: null,
        hasMore: response.pagination.page < response.pagination.pages,
        page: response.pagination.page + 1,
      }))

      return response.data
    } catch (error) {
      const apiError = error as ApiError
      setState(prev => ({
        ...prev,
        loading: false,
        loadingMore: false,
        error: apiError,
      }))
      throw apiError
    }
  }, [endpoint, params, state.page, state.loadingMore, state.hasMore])

  const refresh = useCallback(async () => {
    try {
      setState(prev => ({ 
        ...prev, 
        loading: true, 
        error: null,
        page: 1 
      }))

      const response = await api.getPaginated<T>(endpoint, {
        ...params,
        page: 1,
      })

      setState({
        data: response.data,
        loading: false,
        loadingMore: false,
        error: null,
        hasMore: response.pagination.page < response.pagination.pages,
        page: 2,
      })

      return response.data
    } catch (error) {
      const apiError = error as ApiError
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError,
      }))
      throw apiError
    }
  }, [endpoint, params])

  // Auto-execute on mount
  useEffect(() => {
    if (options.immediate !== false) {
      refresh()
    }
  }, [refresh])

  return {
    ...state,
    loadMore,
    refresh,
  }
}

// ===== LOCAL STORAGE CACHE HOOK =====
export function useApiWithCache<T = any>(
  endpoint: string,
  cacheKey: string,
  options: UseApiOptions & { cacheTime?: number } = {}
) {
  const { cacheTime = 5 * 60 * 1000, ...apiOptions } = options // 5 minutes default

  const getCachedData = useCallback(() => {
    try {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < cacheTime) {
          return data
        }
      }
    } catch (error) {
      console.warn('Cache read error:', error)
    }
    return null
  }, [cacheKey, cacheTime])

  const setCachedData = useCallback((data: T) => {
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now(),
      }))
    } catch (error) {
      console.warn('Cache write error:', error)
    }
  }, [cacheKey])

  const apiHook = useApi<T>(endpoint, {
    ...apiOptions,
    immediate: false,
    onSuccess: (data) => {
      setCachedData(data)
      apiOptions.onSuccess?.(data)
    }
  })

  // Load from cache first
  useEffect(() => {
    const cachedData = getCachedData()
    if (cachedData) {
      apiHook.setState?.({
        data: cachedData,
        loading: false,
        error: null,
        lastUpdated: Date.now(),
      })
    }
    
    // Then fetch fresh data if immediate is enabled
    if (apiOptions.immediate !== false) {
      apiHook.execute()
    }
  }, [])

  return apiHook
}

export default useApi
