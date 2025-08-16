// ========================================
// WEBSOCKET CLIENT - Launchpad Lunes Frontend
// ========================================

import { WebSocketMessage, PriceUpdate } from '@/types/api'
import toast from 'react-hot-toast'

export type WebSocketEventType = 'price_update' | 'investment_update' | 'notification' | 'phase_update' | 'user_update'

export interface WebSocketOptions {
  url?: string
  protocols?: string | string[]
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
  enableHeartbeat?: boolean
  debug?: boolean
}

export interface WebSocketSubscription {
  id: string
  type: WebSocketEventType
  callback: (data: any) => void
}

class WebSocketManager {
  private ws: WebSocket | null = null
  private url: string
  private protocols?: string | string[]
  private reconnectInterval: number
  private maxReconnectAttempts: number
  private heartbeatInterval: number
  private enableHeartbeat: boolean
  private debug: boolean

  private reconnectAttempts = 0
  private isConnecting = false
  private isManuallyDisconnected = false
  private heartbeatTimer: NodeJS.Timeout | null = null
  private reconnectTimer: NodeJS.Timeout | null = null

  private subscriptions = new Map<string, WebSocketSubscription>()
  private eventListeners = new Map<string, Set<(data: any) => void>>()

  constructor(options: WebSocketOptions = {}) {
    this.url = options.url || `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`
    this.protocols = options.protocols
    this.reconnectInterval = options.reconnectInterval || 3000
    this.maxReconnectAttempts = options.maxReconnectAttempts || 10
    this.heartbeatInterval = options.heartbeatInterval || 30000
    this.enableHeartbeat = options.enableHeartbeat || true
    this.debug = options.debug || false

    this.log('WebSocket Manager initialized')
  }

  // ===== CONNECTION MANAGEMENT =====
  connect(authToken?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.log('WebSocket already connected')
        resolve()
        return
      }

      if (this.isConnecting) {
        this.log('WebSocket connection already in progress')
        return
      }

      this.isConnecting = true
      this.isManuallyDisconnected = false

      try {
        const wsUrl = authToken ? `${this.url}?token=${authToken}` : this.url
        this.ws = new WebSocket(wsUrl, this.protocols)

        this.ws.onopen = () => {
          this.log('WebSocket connected')
          this.isConnecting = false
          this.reconnectAttempts = 0
          
          if (this.enableHeartbeat) {
            this.startHeartbeat()
          }

          this.emit('connected', null)
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            this.log('Error parsing WebSocket message:', error)
          }
        }

        this.ws.onclose = (event) => {
          this.log('WebSocket disconnected:', event.code, event.reason)
          this.isConnecting = false
          this.stopHeartbeat()
          
          this.emit('disconnected', { code: event.code, reason: event.reason })

          if (!this.isManuallyDisconnected && this.shouldReconnect(event.code)) {
            this.scheduleReconnect()
          }
        }

        this.ws.onerror = (error) => {
          this.log('WebSocket error:', error)
          this.isConnecting = false
          this.emit('error', error)
          reject(error)
        }

      } catch (error) {
        this.log('Error creating WebSocket:', error)
        this.isConnecting = false
        reject(error)
      }
    })
  }

  disconnect(): void {
    this.log('Manually disconnecting WebSocket')
    this.isManuallyDisconnected = true
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    
    this.stopHeartbeat()
    
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect')
      this.ws = null
    }
  }

  // ===== MESSAGE HANDLING =====
  private handleMessage(message: WebSocketMessage): void {
    this.log('Received message:', message)
    
    switch (message.type) {
      case 'price_update':
        this.handlePriceUpdate(message.data)
        break
      case 'investment_update':
        this.handleInvestmentUpdate(message.data)
        break
      case 'notification':
        this.handleNotification(message.data)
        break
      case 'phase_update':
        this.handlePhaseUpdate(message.data)
        break
      case 'user_update':
        this.handleUserUpdate(message.data)
        break
      default:
        this.log('Unknown message type:', message.type)
    }

    // Emit to general listeners
    this.emit(message.type, message.data)
  }

  private handlePriceUpdate(data: PriceUpdate): void {
    this.emit('price_update', data)
  }

  private handleInvestmentUpdate(data: any): void {
    this.emit('investment_update', data)
    
    if (data.type === 'new_investment') {
      toast.success(`Novo investimento de ${data.amount} ${data.currency}!`)
    } else if (data.type === 'tokens_claimed') {
      toast.success(`${data.amount} tokens reivindicados com sucesso!`)
    }
  }

  private handleNotification(data: any): void {
    this.emit('notification', data)
    
    // Show toast notification
    switch (data.priority) {
      case 'urgent':
        toast.error(data.message, { duration: 8000 })
        break
      case 'high':
        toast(data.message, { duration: 6000 })
        break
      case 'medium':
        toast.success(data.message, { duration: 4000 })
        break
      default:
        toast(data.message, { duration: 3000 })
    }
  }

  private handlePhaseUpdate(data: any): void {
    this.emit('phase_update', data)
    
    if (data.type === 'phase_started') {
      toast.success(`Nova fase iniciada: ${data.phaseName}!`)
    } else if (data.type === 'phase_ended') {
      toast(`Fase finalizada: ${data.phaseName}`)
    }
  }

  private handleUserUpdate(data: any): void {
    this.emit('user_update', data)
  }

  // ===== SUBSCRIPTION MANAGEMENT =====
  subscribe(type: WebSocketEventType, callback: (data: any) => void): string {
    const id = Math.random().toString(36).substr(2, 9)
    
    const subscription: WebSocketSubscription = {
      id,
      type,
      callback,
    }
    
    this.subscriptions.set(id, subscription)
    
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, new Set())
    }
    
    this.eventListeners.get(type)!.add(callback)
    
    this.log(`Subscribed to ${type} with ID: ${id}`)
    return id
  }

  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId)
    
    if (subscription) {
      const listeners = this.eventListeners.get(subscription.type)
      if (listeners) {
        listeners.delete(subscription.callback)
        if (listeners.size === 0) {
          this.eventListeners.delete(subscription.type)
        }
      }
      
      this.subscriptions.delete(subscriptionId)
      this.log(`Unsubscribed from ${subscription.type} with ID: ${subscriptionId}`)
    }
  }

  private emit(type: string, data: any): void {
    const listeners = this.eventListeners.get(type)
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          this.log(`Error in event listener for ${type}:`, error)
        }
      })
    }
  }

  // ===== RECONNECTION LOGIC =====
  private shouldReconnect(closeCode: number): boolean {
    // Don't reconnect on certain close codes
    if (closeCode === 1000 || closeCode === 1001 || closeCode === 1005) {
      return false
    }
    
    return this.reconnectAttempts < this.maxReconnectAttempts
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }

    const delay = Math.min(this.reconnectInterval * Math.pow(2, this.reconnectAttempts), 30000)
    
    this.log(`Scheduling reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`)
    
    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++
      this.connect().catch(() => {
        // Connection failed, will try again if within limits
      })
    }, delay)
  }

  // ===== HEARTBEAT =====
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping', timestamp: Date.now() })
      }
    }, this.heartbeatInterval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  // ===== SENDING MESSAGES =====
  send(message: any): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.log('Cannot send message: WebSocket not connected')
      return false
    }

    try {
      this.ws.send(JSON.stringify(message))
      this.log('Sent message:', message)
      return true
    } catch (error) {
      this.log('Error sending message:', error)
      return false
    }
  }

  // ===== STATUS =====
  get isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }

  get readyState(): number {
    return this.ws ? this.ws.readyState : WebSocket.CLOSED
  }

  get connectionState(): string {
    if (!this.ws) return 'DISCONNECTED'
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING'
      case WebSocket.OPEN:
        return 'CONNECTED'
      case WebSocket.CLOSING:
        return 'CLOSING'
      case WebSocket.CLOSED:
        return 'DISCONNECTED'
      default:
        return 'UNKNOWN'
    }
  }

  // ===== UTILITIES =====
  private log(message: string, ...args: any[]): void {
    if (this.debug) {
      console.log(`[WebSocket] ${message}`, ...args)
    }
  }

  // ===== CLEANUP =====
  destroy(): void {
    this.log('Destroying WebSocket Manager')
    this.disconnect()
    this.subscriptions.clear()
    this.eventListeners.clear()
  }
}

// ===== SINGLETON INSTANCE =====
export const wsManager = new WebSocketManager({
  debug: process.env.NODE_ENV === 'development',
})

// ===== REACT HOOK =====
import { useState, useEffect, useCallback, useRef } from 'react'

export function useWebSocket(options: {
  autoConnect?: boolean
  authToken?: string
} = {}) {
  const { autoConnect = true, authToken } = options
  const [isConnected, setIsConnected] = useState(wsManager.isConnected)
  const [connectionState, setConnectionState] = useState(wsManager.connectionState)
  const subscriptionsRef = useRef<string[]>([])

  const connect = useCallback(async () => {
    try {
      await wsManager.connect(authToken)
    } catch (error) {
      console.error('WebSocket connection failed:', error)
    }
  }, [authToken])

  const disconnect = useCallback(() => {
    wsManager.disconnect()
  }, [])

  const subscribe = useCallback((type: WebSocketEventType, callback: (data: any) => void) => {
    const subscriptionId = wsManager.subscribe(type, callback)
    subscriptionsRef.current.push(subscriptionId)
    return subscriptionId
  }, [])

  const unsubscribe = useCallback((subscriptionId: string) => {
    wsManager.unsubscribe(subscriptionId)
    subscriptionsRef.current = subscriptionsRef.current.filter(id => id !== subscriptionId)
  }, [])

  const send = useCallback((message: any) => {
    return wsManager.send(message)
  }, [])

  useEffect(() => {
    const handleConnected = () => {
      setIsConnected(true)
      setConnectionState('CONNECTED')
    }

    const handleDisconnected = () => {
      setIsConnected(false)
      setConnectionState('DISCONNECTED')
    }

    const connectedSub = wsManager.subscribe('connected', handleConnected)
    const disconnectedSub = wsManager.subscribe('disconnected', handleDisconnected)

    if (autoConnect && !wsManager.isConnected) {
      connect()
    }

    return () => {
      wsManager.unsubscribe(connectedSub)
      wsManager.unsubscribe(disconnectedSub)
      
      // Cleanup subscriptions
      subscriptionsRef.current.forEach(id => {
        wsManager.unsubscribe(id)
      })
    }
  }, [autoConnect, connect])

  return {
    isConnected,
    connectionState,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    send,
    manager: wsManager,
  }
}

export default wsManager
