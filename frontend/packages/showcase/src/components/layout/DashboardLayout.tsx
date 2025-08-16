import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Sidebar } from './Sidebar'
import { useWallet } from '@/contexts/WalletContext'

export interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { isConnected } = useWallet()

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false) // Close mobile sidebar on desktop
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sidebar when navigating on mobile
  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }

  if (!isConnected) {
    // For non-authenticated pages, use regular layout
    return (
      <div className="min-h-screen bg-slate-900">
        {children || <Outlet />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
          position="relative"
          showUserInfo
          className="h-screen sticky top-0"
        />
      </div>

      {/* Mobile Sidebar */}
      <Sidebar
        position="fixed"
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        showUserInfo
        className="lg:hidden"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-slate-800/95 backdrop-blur-lg border-b border-slate-600 p-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primaryDark rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="font-bold text-lg">Lunes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}
