import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { mockUser, mockTokenPrices } from '@/data/mockData'
import toast from 'react-hot-toast'

// Extended wallet types
export interface WalletInfo {
  name: string
  logo: string
  installed: boolean
  extension?: any
}

export interface TokenBalance {
  lunes: number
  usdt: number
  usdc: number
}

interface WalletContextType {
  // State
  isConnected: boolean
  isConnecting: boolean
  accounts: InjectedAccountWithMeta[]
  selectedAccount: InjectedAccountWithMeta | null

  // Wallet info
  selectedWallet: string | null
  availableWallets: WalletInfo[]

  // Balance info
  balance: TokenBalance

  // Actions
  connectWallet: (walletName?: string) => Promise<void>
  disconnectWallet: () => void
  selectAccount: (account: InjectedAccountWithMeta) => void
  refreshBalance: () => Promise<void>

  // Utils
  getBalance: (address: string) => Promise<string>
  signTransaction: (transaction: any) => Promise<any>
  sendTransaction: (to: string, amount: number, token: string) => Promise<string>

  // Utility functions
  formatAddress: (address: string, length?: number) => string
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Mock wallet data
const AVAILABLE_WALLETS: WalletInfo[] = [
  {
    name: 'SubWallet',
    logo: '🔷',
    installed: true,
    extension: null
  },
  {
    name: 'Polkadot.js',
    logo: '🟠',
    installed: true,
    extension: null
  },
  {
    name: 'Talisman',
    logo: '🔮',
    installed: false,
    extension: null
  }
]

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([])
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null)
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [balance, setBalance] = useState<TokenBalance>({
    lunes: 25847.50,
    usdt: 1250.00,
    usdc: 875.25
  })

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const extensions = await web3Enable('Launchpad Lunes')
      if (extensions.length === 0) return

      const allAccounts = await web3Accounts()
      if (allAccounts.length > 0) {
        setAccounts(allAccounts)
        
        // Try to restore selected account from localStorage
        const savedAddress = localStorage.getItem('selectedAccount')
        const savedAccount = allAccounts.find(acc => acc.address === savedAddress)
        
        if (savedAccount) {
          setSelectedAccount(savedAccount)
          setIsConnected(true)
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error)
    }
  }

  const connectWallet = async (walletName?: string) => {
    setIsConnecting(true)

    try {
      // Enable the extension
      const extensions = await web3Enable('Launchpad Lunes')

      if (extensions.length === 0) {
        toast.error('Nenhuma extensão de carteira encontrada. Instale SubWallet ou Polkadot.js')
        return
      }

      // Get all accounts
      const allAccounts = await web3Accounts()

      if (allAccounts.length === 0) {
        toast.error('Nenhuma conta encontrada. Crie uma conta na sua carteira.')
        return
      }

      setAccounts(allAccounts)

      // Set selected wallet
      if (walletName) {
        setSelectedWallet(walletName)
        localStorage.setItem('selectedWallet', walletName)
      }

      // Auto-select first account if none selected or create mock account
      if (!selectedAccount && allAccounts.length > 0) {
        setSelectedAccount(allAccounts[0])
        localStorage.setItem('selectedAccount', allAccounts[0].address)
      } else if (!selectedAccount) {
        // Create mock account for demo
        const mockAccount: InjectedAccountWithMeta = {
          address: mockUser.walletAddress,
          meta: {
            name: mockUser.firstName + ' ' + mockUser.lastName,
            source: walletName || 'SubWallet',
          },
          type: 'sr25519',
        }
        setSelectedAccount(mockAccount)
        setAccounts([mockAccount])
        localStorage.setItem('selectedAccount', mockAccount.address)
      }

      setIsConnected(true)
      toast.success(`Carteira conectada com sucesso!${walletName ? ` (${walletName})` : ''}`)

    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Erro ao conectar carteira')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAccounts([])
    setSelectedAccount(null)
    setSelectedWallet(null)
    localStorage.removeItem('selectedAccount')
    localStorage.removeItem('selectedWallet')
    toast.success('Carteira desconectada')
  }

  const selectAccount = (account: InjectedAccountWithMeta) => {
    setSelectedAccount(account)
    localStorage.setItem('selectedAccount', account.address)
    toast.success(`Conta selecionada: ${account.meta.name}`)
  }

  const getBalance = async (address: string): Promise<string> => {
    try {
      // This would integrate with Polkadot API to get balance
      // For now, return mock data
      return '1000.00'
    } catch (error) {
      console.error('Error getting balance:', error)
      return '0.00'
    }
  }

  // Refresh balance
  const refreshBalance = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock balance update with some randomness
      setBalance(prev => ({
        lunes: Math.max(0, prev.lunes + Math.floor(Math.random() * 100) - 50),
        usdt: Math.max(0, prev.usdt + Math.floor(Math.random() * 10) - 5),
        usdc: Math.max(0, prev.usdc + Math.floor(Math.random() * 10) - 5)
      }))

      toast.success('Saldo atualizado')
    } catch (error) {
      toast.error('Erro ao atualizar saldo')
    }
  }

  const signTransaction = async (transaction: any) => {
    if (!selectedAccount) {
      throw new Error('No account selected')
    }

    try {
      const injector = await web3FromAddress(selectedAccount.address)
      // Sign transaction logic here
      toast.success('Transação assinada')
      return transaction
    } catch (error) {
      console.error('Error signing transaction:', error)
      toast.error('Erro ao assinar transação')
      throw error
    }
  }

  // Send transaction
  const sendTransaction = async (to: string, amount: number, token: string): Promise<string> => {
    if (!selectedAccount) {
      throw new Error('No account selected')
    }

    try {
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Update balance
      setBalance(prev => ({
        ...prev,
        [token.toLowerCase()]: Math.max(0, prev[token.toLowerCase() as keyof TokenBalance] - amount)
      }))

      // Mock transaction hash
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`

      toast.success(`Transação enviada: ${amount} ${token}`)
      return txHash
    } catch (error) {
      toast.error('Erro ao enviar transação')
      throw error
    }
  }

  // Format address utility
  const formatAddress = (address: string, length = 8): string => {
    if (address.length <= length * 2) return address
    return `${address.slice(0, length)}...${address.slice(-length)}`
  }

  const value: WalletContextType = {
    isConnected,
    isConnecting,
    accounts,
    selectedAccount,
    selectedWallet,
    availableWallets: AVAILABLE_WALLETS,
    balance,
    connectWallet,
    disconnectWallet,
    selectAccount,
    refreshBalance,
    getBalance,
    signTransaction,
    sendTransaction,
    formatAddress,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
