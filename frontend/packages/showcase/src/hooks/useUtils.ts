// ========================================
// UTILITY HOOKS - Launchpad Lunes Frontend
// ========================================

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { debounce, formatCurrency, formatTokenAmount, copyToClipboard } from '@/lib/utils'
import toast from 'react-hot-toast'

// ===== LOCAL STORAGE HOOK =====
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setStoredValue = useCallback((newValue: T | ((val: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue
      setValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, value])

  const removeStoredValue = useCallback(() => {
    try {
      setValue(initialValue)
      window.localStorage.removeItem(key)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [value, setStoredValue, removeStoredValue] as const
}

// ===== SESSION STORAGE HOOK =====
export function useSessionStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setStoredValue = useCallback((newValue: T | ((val: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue
      setValue(valueToStore)
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error)
    }
  }, [key, value])

  return [value, setStoredValue] as const
}

// ===== DEBOUNCED VALUE HOOK =====
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// ===== DEBOUNCED CALLBACK HOOK =====
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const callbackRef = useRef(callback)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    }) as T,
    [delay]
  )
}

// ===== COUNTDOWN HOOK =====
export function useCountdown(targetDate: Date | string) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  })

  useEffect(() => {
    const target = new Date(targetDate).getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = target - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds, total: difference })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  const isExpired = timeLeft.total <= 0

  const formatted = useMemo(() => {
    if (isExpired) return 'Finalizado'
    
    if (timeLeft.days > 0) {
      return `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`
    } else if (timeLeft.hours > 0) {
      return `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
    } else {
      return `${timeLeft.minutes}m ${timeLeft.seconds}s`
    }
  }, [timeLeft, isExpired])

  return {
    ...timeLeft,
    isExpired,
    formatted,
  }
}

// ===== INTERSECTION OBSERVER HOOK =====
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        setEntry(entry)
      },
      {
        threshold: 0.1,
        ...options,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [options])

  return {
    ref: elementRef,
    isIntersecting,
    entry,
  }
}

// ===== CLIPBOARD HOOK =====
export function useClipboard() {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const copy = useCallback(async (text: string) => {
    try {
      const success = await copyToClipboard(text)
      if (success) {
        setCopied(true)
        toast.success('Copiado para a área de transferência!')
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        
        timeoutRef.current = setTimeout(() => {
          setCopied(false)
        }, 2000)
      }
      return success
    } catch (error) {
      console.error('Copy failed:', error)
      toast.error('Erro ao copiar')
      return false
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { copy, copied }
}

// ===== WINDOW SIZE HOOK =====
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = debounce(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }, 100)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowSize.width < 768
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024
  const isDesktop = windowSize.width >= 1024

  return {
    ...windowSize,
    isMobile,
    isTablet,
    isDesktop,
  }
}

// ===== MEDIA QUERY HOOK =====
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

// ===== ONLINE STATUS HOOK =====
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof navigator === 'undefined') return true
    return navigator.onLine
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

// ===== DOCUMENT TITLE HOOK =====
export function useDocumentTitle(title: string, prevailOnUnmount = false) {
  const defaultTitle = useRef(document.title)

  useEffect(() => {
    document.title = title
  }, [title])

  useEffect(() => {
    return () => {
      if (!prevailOnUnmount) {
        document.title = defaultTitle.current
      }
    }
  }, [prevailOnUnmount])
}

// ===== SCROLL LOCK HOOK =====
export function useScrollLock() {
  const [isLocked, setIsLocked] = useState(false)

  const lock = useCallback(() => {
    if (typeof document === 'undefined') return
    
    const body = document.body
    const scrollY = window.scrollY
    
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    
    setIsLocked(true)
  }, [])

  const unlock = useCallback(() => {
    if (typeof document === 'undefined') return
    
    const body = document.body
    const scrollY = body.style.top
    
    body.style.position = ''
    body.style.top = ''
    body.style.width = ''
    
    window.scrollTo(0, parseInt(scrollY || '0') * -1)
    
    setIsLocked(false)
  }, [])

  useEffect(() => {
    return () => {
      if (isLocked) {
        unlock()
      }
    }
  }, [isLocked, unlock])

  return { isLocked, lock, unlock }
}

// ===== FAVORITES HOOK =====
export function useFavorites<T extends { id: string }>(key: string = 'favorites') {
  const [favorites, setFavorites] = useLocalStorage<string[]>(key, [])

  const isFavorite = useCallback((item: T | string) => {
    const id = typeof item === 'string' ? item : item.id
    return favorites.includes(id)
  }, [favorites])

  const addFavorite = useCallback((item: T | string) => {
    const id = typeof item === 'string' ? item : item.id
    if (!favorites.includes(id)) {
      setFavorites(prev => [...prev, id])
      toast.success('Adicionado aos favoritos!')
    }
  }, [favorites, setFavorites])

  const removeFavorite = useCallback((item: T | string) => {
    const id = typeof item === 'string' ? item : item.id
    setFavorites(prev => prev.filter(fav => fav !== id))
    toast.success('Removido dos favoritos')
  }, [setFavorites])

  const toggleFavorite = useCallback((item: T | string) => {
    const id = typeof item === 'string' ? item : item.id
    if (isFavorite(id)) {
      removeFavorite(id)
    } else {
      addFavorite(id)
    }
  }, [isFavorite, addFavorite, removeFavorite])

  const clearFavorites = useCallback(() => {
    setFavorites([])
    toast.success('Favoritos limpos')
  }, [setFavorites])

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    count: favorites.length,
  }
}

// ===== QUERY PARAMS HOOK =====
export function useQueryParams() {
  const location = useLocation()
  const navigate = useNavigate()

  const queryParams = useMemo(() => {
    return new URLSearchParams(location.search)
  }, [location.search])

  const getParam = useCallback((key: string, defaultValue?: string) => {
    return queryParams.get(key) || defaultValue || null
  }, [queryParams])

  const setParam = useCallback((key: string, value: string) => {
    const newParams = new URLSearchParams(location.search)
    newParams.set(key, value)
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true })
  }, [location, navigate])

  const removeParam = useCallback((key: string) => {
    const newParams = new URLSearchParams(location.search)
    newParams.delete(key)
    const newSearch = newParams.toString()
    navigate(`${location.pathname}${newSearch ? `?${newSearch}` : ''}`, { replace: true })
  }, [location, navigate])

  const setParams = useCallback((params: Record<string, string>) => {
    const newParams = new URLSearchParams(location.search)
    Object.entries(params).forEach(([key, value]) => {
      newParams.set(key, value)
    })
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true })
  }, [location, navigate])

  const clearParams = useCallback(() => {
    navigate(location.pathname, { replace: true })
  }, [location, navigate])

  return {
    queryParams,
    getParam,
    setParam,
    removeParam,
    setParams,
    clearParams,
  }
}

// ===== TOGGLE HOOK =====
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => setValue(prev => !prev), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue,
  }
}

export default {
  useLocalStorage,
  useSessionStorage,
  useDebounce,
  useDebouncedCallback,
  useCountdown,
  useIntersectionObserver,
  useClipboard,
  useWindowSize,
  useMediaQuery,
  useOnlineStatus,
  useDocumentTitle,
  useScrollLock,
  useFavorites,
  useQueryParams,
  useToggle,
}
