/**
 * Extension Compatibility Utils
 * Handles browser extension conflicts and compatibility issues
 */

export interface ExtensionInfo {
  name: string
  id: string
  detected: boolean
  type: 'wallet' | 'ad-blocker' | 'dev-tools' | 'other'
}

/**
 * Detects common browser extensions that might interfere with the app
 */
export function detectBrowserExtensions(): ExtensionInfo[] {
  const extensions: ExtensionInfo[] = []

  // Check for Z3US wallet extension
  if (typeof window !== 'undefined' && (window as any).z3us) {
    extensions.push({
      name: 'Z3US Wallet',
      id: 'z3us',
      detected: true,
      type: 'wallet'
    })
  }

  // Check for Polkadot.js extension
  if (typeof window !== 'undefined' && (window as any).injectedWeb3) {
    extensions.push({
      name: 'Polkadot.js Extension',
      id: 'polkadot-js',
      detected: true,
      type: 'wallet'
    })
  }

  // Check for MetaMask
  if (typeof window !== 'undefined' && (window as any).ethereum?.isMetaMask) {
    extensions.push({
      name: 'MetaMask',
      id: 'metamask',
      detected: true,
      type: 'wallet'
    })
  }

  return extensions
}

/**
 * Checks if there are extension conflicts that might affect the app
 */
export function checkExtensionConflicts(): {
  hasConflicts: boolean
  conflicts: string[]
  recommendations: string[]
} {
  const conflicts: string[] = []
  const recommendations: string[] = []

  // Check for multiple wallet extensions
  const walletExtensions = detectBrowserExtensions().filter(ext => ext.type === 'wallet')
  
  if (walletExtensions.length > 2) {
    conflicts.push('Múltiplas extensões de carteira detectadas')
    recommendations.push('Considere desabilitar extensões de carteira não utilizadas para melhor performance')
  }

  // Check for known problematic combinations
  const hasZ3us = walletExtensions.some(ext => ext.id === 'z3us')
  const hasPolkadot = walletExtensions.some(ext => ext.id === 'polkadot-js')
  
  if (hasZ3us && hasPolkadot) {
    recommendations.push('Z3US e Polkadot.js detectados - certifique-se de usar apenas uma extensão por vez')
  }

  return {
    hasConflicts: conflicts.length > 0,
    conflicts,
    recommendations
  }
}

/**
 * Provides safe access to extension APIs with error handling
 */
export async function safeExtensionCall<T>(
  extensionCall: () => Promise<T>,
  fallbackValue: T,
  extensionName = 'Extension'
): Promise<T> {
  try {
    return await extensionCall()
  } catch (error) {
    console.warn(`${extensionName} call failed:`, error)
    return fallbackValue
  }
}

/**
 * Filters out extension URLs from arrays of URLs
 */
export function filterExtensionUrls(urls: string[]): string[] {
  return urls.filter(url => {
    try {
      const parsedUrl = new URL(url)
      return !parsedUrl.protocol.includes('extension')
    } catch {
      return true // Keep malformed URLs for other handlers to deal with
    }
  })
}

/**
 * Checks if a URL is from a browser extension
 */
export function isExtensionUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.protocol.includes('extension') || 
           parsedUrl.protocol === 'chrome-extension:' ||
           parsedUrl.protocol === 'moz-extension:' ||
           parsedUrl.protocol === 'ms-browser-extension:'
  } catch {
    return false
  }
}

/**
 * Creates a warning notification for extension conflicts
 */
export function createExtensionWarning(): {
  show: boolean
  message: string
  type: 'info' | 'warning' | 'error'
} {
  const { hasConflicts, recommendations } = checkExtensionConflicts()
  
  if (hasConflicts || recommendations.length > 0) {
    return {
      show: true,
      message: recommendations.join('. '),
      type: hasConflicts ? 'warning' : 'info'
    }
  }

  return {
    show: false,
    message: '',
    type: 'info'
  }
}
