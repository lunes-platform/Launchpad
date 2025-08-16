import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format numbers
export function formatNumber(num: number, decimals: number = 2): string {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(decimals) + 'B'
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(decimals) + 'M'
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(decimals) + 'K'
  }
  return num.toFixed(decimals)
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency === 'USD' ? 'USD' : 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(amount)
}

// Format token amount
export function formatTokenAmount(amount: number, symbol: string, decimals: number = 4): string {
  return `${amount.toFixed(decimals)} ${symbol}`
}

// Format percentage
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`
}

// Format address
export function formatAddress(address: string, start: number = 6, end: number = 4): string {
  if (!address) return ''
  if (address.length <= start + end) return address
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

// Format date
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Format date with time
export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Calculate time remaining
export function getTimeRemaining(endDate: Date | string): {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
} {
  const end = new Date(endDate).getTime()
  const now = new Date().getTime()
  const total = end - now

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
  }

  const days = Math.floor(total / (1000 * 60 * 60 * 24))
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((total % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds, total }
}

// Format time remaining
export function formatTimeRemaining(endDate: Date | string): string {
  const { days, hours, minutes, total } = getTimeRemaining(endDate)
  
  if (total <= 0) return 'Finalizado'
  
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate wallet address
export function isValidAddress(address: string): boolean {
  // Basic validation for Substrate addresses
  return address.length >= 47 && address.length <= 48
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Sleep function
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Get phase status color
export function getPhaseStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'live':
      return 'text-success'
    case 'upcoming':
    case 'pending':
      return 'text-warning'
    case 'completed':
    case 'ended':
      return 'text-slate-400'
    case 'cancelled':
      return 'text-error'
    default:
      return 'text-slate-200'
  }
}

// Get network color
export function getNetworkColor(network: string): string {
  switch (network.toLowerCase()) {
    case 'lunes':
      return 'text-primary'
    case 'ton':
      return 'text-blue-400'
    case 'solana':
      return 'text-purple-400'
    default:
      return 'text-slate-200'
  }
}
