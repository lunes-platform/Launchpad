import { useTranslation as useI18nTranslation } from 'react-i18next'
import { changeLanguage, getCurrentLanguage, getSupportedLanguages } from '@/i18n'

export function useTranslation() {
  const { t, i18n } = useI18nTranslation()

  const changeLanguageHandler = (lng: string) => {
    changeLanguage(lng)
  }

  const currentLanguage = getCurrentLanguage()
  const supportedLanguages = getSupportedLanguages()

  // Helper functions for common translations
  const formatCurrency = (amount: number, currency = 'USD') => {
    const locale = currentLanguage === 'pt-BR' ? 'pt-BR' : 'en-US'
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency === 'BRL' ? 'BRL' : 'USD'
    }).format(amount)
  }

  const formatNumber = (number: number) => {
    const locale = currentLanguage === 'pt-BR' ? 'pt-BR' : 'en-US'
    return new Intl.NumberFormat(locale).format(number)
  }

  const formatPercentage = (value: number) => {
    const locale = currentLanguage === 'pt-BR' ? 'pt-BR' : 'en-US'
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    }).format(value / 100)
  }

  const formatDate = (date: Date | string) => {
    const locale = currentLanguage === 'pt-BR' ? 'pt-BR' : 'en-US'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj)
  }

  const formatRelativeTime = (date: Date | string) => {
    const locale = currentLanguage === 'pt-BR' ? 'pt-BR' : 'en-US'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

    if (diffInSeconds < 60) {
      return rtf.format(-diffInSeconds, 'second')
    } else if (diffInSeconds < 3600) {
      return rtf.format(-Math.floor(diffInSeconds / 60), 'minute')
    } else if (diffInSeconds < 86400) {
      return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour')
    } else if (diffInSeconds < 2592000) {
      return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
    } else if (diffInSeconds < 31536000) {
      return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month')
    } else {
      return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year')
    }
  }

  const formatTimeRemaining = (endDate: Date | string) => {
    const locale = currentLanguage === 'pt-BR' ? 'pt-BR' : 'en-US'
    const endDateObj = typeof endDate === 'string' ? new Date(endDate) : endDate
    const now = new Date()
    const diffInSeconds = Math.floor((endDateObj.getTime() - now.getTime()) / 1000)

    if (diffInSeconds <= 0) {
      return t('time.expired', 'Expirado')
    }

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'always' })

    if (diffInSeconds < 60) {
      return rtf.format(diffInSeconds, 'second')
    } else if (diffInSeconds < 3600) {
      return rtf.format(Math.floor(diffInSeconds / 60), 'minute')
    } else if (diffInSeconds < 86400) {
      return rtf.format(Math.floor(diffInSeconds / 3600), 'hour')
    } else if (diffInSeconds < 2592000) {
      return rtf.format(Math.floor(diffInSeconds / 86400), 'day')
    } else if (diffInSeconds < 31536000) {
      return rtf.format(Math.floor(diffInSeconds / 2592000), 'month')
    } else {
      return rtf.format(Math.floor(diffInSeconds / 31536000), 'year')
    }
  }

  // Common translation shortcuts
  const common = {
    loading: () => t('common.loading'),
    error: () => t('common.error'),
    success: () => t('common.success'),
    cancel: () => t('common.cancel'),
    confirm: () => t('common.confirm'),
    save: () => t('common.save'),
    edit: () => t('common.edit'),
    delete: () => t('common.delete'),
    view: () => t('common.view'),
    back: () => t('common.back'),
    next: () => t('common.next'),
    previous: () => t('common.previous'),
    search: () => t('common.search'),
    refresh: () => t('common.refresh'),
    copy: () => t('common.copy'),
    share: () => t('common.share'),
    connect: () => t('common.connect'),
    disconnect: () => t('common.disconnect')
  }

  const navigation = {
    home: () => t('navigation.home'),
    projects: () => t('navigation.projects'),
    observatory: () => t('navigation.observatory'),
    launchpool: () => t('navigation.launchpool'),
    raffles: () => t('navigation.raffles'),
    governance: () => t('navigation.governance'),
    treasury: () => t('navigation.treasury'),
    payments: () => t('navigation.payments'),
    affiliates: () => t('navigation.affiliates'),
    docs: () => t('navigation.docs'),
    settings: () => t('navigation.settings'),
    dashboard: () => t('navigation.dashboard')
  }

  const wallet = {
    connect: () => t('wallet.connect'),
    disconnect: () => t('wallet.disconnect'),
    connecting: () => t('wallet.connecting'),
    connected: () => t('wallet.connected'),
    balance: () => t('wallet.balance'),
    address: () => t('wallet.address'),
    copyAddress: () => t('wallet.copy_address'),
    refreshBalance: () => t('wallet.refresh_balance')
  }

  return {
    t,
    i18n,
    currentLanguage,
    supportedLanguages,
    changeLanguage: changeLanguageHandler,
    formatCurrency,
    formatNumber,
    formatPercentage,
    formatDate,
    formatRelativeTime,
    formatTimeRemaining,
    common,
    navigation,
    wallet
  }
}

// Hook for language switching component
export function useLanguageSwitcher() {
  const { currentLanguage, supportedLanguages, changeLanguage } = useTranslation()

  const switchLanguage = (languageCode: string) => {
    changeLanguage(languageCode)
  }

  const getCurrentLanguageInfo = () => {
    return supportedLanguages.find(lang => lang.code === currentLanguage)
  }

  return {
    currentLanguage,
    supportedLanguages,
    switchLanguage,
    getCurrentLanguageInfo
  }
}
