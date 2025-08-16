import { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import ConnectionStatus from '@/components/ui/ConnectionStatus'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <ConnectionStatus />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
