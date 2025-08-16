// Service Worker for Launchpad Lunes PWA
const CACHE_NAME = 'launchpad-lunes-v1.0.0'
const STATIC_CACHE = 'static-v1.0.0'
const DYNAMIC_CACHE = 'dynamic-v1.0.0'

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/offline.html',
  // Add other critical static files here
]

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^https:\/\/api\.launchpadlunes\.com\/v1\//,
  /^https:\/\/api\.coingecko\.com\/api\/v3\//
]

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log('Static files cached successfully')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Error caching static files:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip all extension schemes and invalid URLs
  const extensionProtocols = [
    'chrome-extension:',
    'moz-extension:',
    'ms-browser-extension:',
    'safari-extension:',
    'extension:'
  ]
  
  if (extensionProtocols.some(protocol => url.protocol === protocol) || 
      url.protocol.includes('extension') ||
      url.hostname === 'invalid' ||
      url.href.includes('extension://')) {
    return
  }

  // Handle different types of requests
  if (request.destination === 'document') {
    // HTML pages - Network first, then cache
    event.respondWith(handlePageRequest(request))
  } else if (isApiRequest(request.url)) {
    // API requests - Cache first for GET, network for others
    event.respondWith(handleApiRequest(request))
  } else {
    // Static assets - Cache first
    event.respondWith(handleStaticRequest(request))
  }
})

// Handle page requests (HTML)
async function handlePageRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache:', error)
    
    // Try cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page
    return caches.match('/offline.html')
  }
}

// Handle API requests
async function handleApiRequest(request) {
  try {
    // Try cache first for better performance
    const cachedResponse = await caches.match(request)
    
    // If cached and not too old (5 minutes), return it
    if (cachedResponse) {
      const cacheDate = new Date(cachedResponse.headers.get('date'))
      const now = new Date()
      const cacheAge = now - cacheDate
      
      if (cacheAge < 5 * 60 * 1000) { // 5 minutes
        return cachedResponse
      }
    }
    
    // Try network
    const networkResponse = await fetch(request)
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('API request failed, trying cache:', error)
    
    // Return cached version if available
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return error response
    return new Response(
      JSON.stringify({ error: 'Network unavailable' }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Handle static asset requests
async function handleStaticRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Try network
    const networkResponse = await fetch(request)
    
    // Cache successful responses only for http/https schemes
    if (networkResponse.ok && (request.url.startsWith('http://') || request.url.startsWith('https://'))) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Static request failed:', error)
    
    // Return cached version if available
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return 404 for missing assets
    return new Response('Not found', { status: 404 })
  }
}

// Check if request is for API
function isApiRequest(url) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(url))
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

// Handle background sync
async function doBackgroundSync() {
  try {
    // Get pending actions from IndexedDB
    const pendingActions = await getPendingActions()
    
    for (const action of pendingActions) {
      try {
        await processAction(action)
        await removePendingAction(action.id)
      } catch (error) {
        console.error('Failed to process action:', error)
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)
  
  const options = {
    body: 'Você tem novas atualizações no Launchpad Lunes',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver Detalhes',
        icon: '/icons/action-explore.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/action-close.png'
      }
    ]
  }
  
  if (event.data) {
    const data = event.data.json()
    options.body = data.body || options.body
    options.data = { ...options.data, ...data }
  }
  
  event.waitUntil(
    self.registration.showNotification('Launchpad Lunes', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Utility functions for IndexedDB operations
async function getPendingActions() {
  // Implementation would use IndexedDB to get pending actions
  return []
}

async function processAction(action) {
  // Implementation would process the pending action
  console.log('Processing action:', action)
}

async function removePendingAction(actionId) {
  // Implementation would remove the action from IndexedDB
  console.log('Removing action:', actionId)
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
})
