import React from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Sidebar, useSidebar } from "../navigation/Sidebar";
import { useAuth } from "../../contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout principal da aplicação
 * Inclui header, sidebar (quando autenticado), conteúdo principal e footer
 */
export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  const { isCollapsed, toggle } = useSidebar();
  
  // Rotas que DEVEM mostrar a sidebar (apenas páginas internas/dashboard)
  const sidebarRoutes = [
    '/dashboard',
    '/listar-projeto',
    '/criar-projeto',
    '/editar-projeto',
    '/launchpool',
    '/raffles',
    '/raffle-history',
    '/rewards-schedule',
    '/investor-ranking',
    '/airdrop',
    '/staking',
    '/profile',
    '/settings',
    '/notifications',
    '/wallet',
    '/upgrade-vip',
    '/vip',
    '/kyc',
    '/admin',
    '/analytics',
    '/governanca'
  ];
  
  // Verificar se deve mostrar a sidebar - apenas para usuários autenticados em rotas específicas
  // Para /projetos, apenas mostrar sidebar se for exatamente /projetos ou /projetos/:id (detalhes)
  const shouldShowSidebar = user && (
    sidebarRoutes.some(route => location.pathname.startsWith(route)) ||
    (location.pathname === '/projetos' || location.pathname.match(/^\/projetos\/[^/]+$/))
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-grafite-900">
      <Header />
      
      <div className="flex flex-1">
        {/* Sidebar - apenas para usuários autenticados */}
        {shouldShowSidebar && (
          <Sidebar isCollapsed={isCollapsed} onToggle={toggle} />
        )}
        
        {/* Conteúdo Principal */}
        <main className={`flex-1 transition-all duration-300 ${
          shouldShowSidebar 
            ? isCollapsed 
              ? 'ml-20' 
              : 'ml-[280px]'
            : ''
        }`}>
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}
