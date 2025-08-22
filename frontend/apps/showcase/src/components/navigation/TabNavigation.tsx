import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
  content?: React.ReactNode;
}

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'cards';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showContent?: boolean;
}

/**
 * Componente de navegação por abas moderno e flexível
 * Suporta diferentes variantes visuais e tamanhos
 */
export function TabNavigation({
  tabs,
  activeTab: controlledActiveTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  className = '',
  showContent = false
}: TabNavigationProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id || '');
  
  const activeTab = controlledActiveTab || internalActiveTab;
  
  const handleTabChange = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };
  
  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;
  
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  };
  
  const variantClasses = {
    default: {
      container: 'border-b border-grafite-200 dark:border-grafite-700',
      tab: 'border-b-2 border-transparent hover:border-grafite-300 dark:hover:border-grafite-600 hover:text-grafite-700 dark:hover:text-grafite-300',
      activeTab: 'border-roxo-500 text-roxo-600 dark:text-roxo-400',
      inactiveTab: 'text-grafite-500 dark:text-grafite-400'
    },
    pills: {
      container: 'bg-grafite-100 dark:bg-grafite-800 rounded-lg p-1',
      tab: 'rounded-md hover:bg-grafite-200 dark:hover:bg-grafite-700',
      activeTab: 'bg-white dark:bg-grafite-900 text-grafite-900 dark:text-white shadow-sm',
      inactiveTab: 'text-grafite-600 dark:text-grafite-400'
    },
    underline: {
      container: '',
      tab: 'relative hover:text-grafite-700 dark:hover:text-grafite-300',
      activeTab: 'text-roxo-600 dark:text-roxo-400',
      inactiveTab: 'text-grafite-500 dark:text-grafite-400'
    },
    cards: {
      container: 'gap-2',
      tab: 'border border-grafite-200 dark:border-grafite-700 rounded-lg hover:border-grafite-300 dark:hover:border-grafite-600 hover:bg-grafite-50 dark:hover:bg-grafite-800',
      activeTab: 'border-roxo-500 bg-roxo-50 dark:bg-roxo-900/20 text-roxo-600 dark:text-roxo-400',
      inactiveTab: 'text-grafite-600 dark:text-grafite-400 bg-white dark:bg-grafite-900'
    }
  };
  
  const currentVariant = variantClasses[variant];
  
  return (
    <div className={className}>
      {/* Navegação das Abas */}
      <div className={`flex ${currentVariant.container}`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={`
                relative flex items-center gap-2 font-medium transition-all duration-200
                ${sizeClasses[size]}
                ${currentVariant.tab}
                ${isActive ? currentVariant.activeTab : currentVariant.inactiveTab}
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Ícone */}
              {Icon && (
                <Icon className={`w-4 h-4 ${size === 'lg' ? 'w-5 h-5' : ''}`} />
              )}
              
              {/* Label */}
              <span>{tab.label}</span>
              
              {/* Badge */}
              {tab.badge && (
                <span className="ml-1 px-1.5 py-0.5 text-xs font-medium bg-roxo-100 dark:bg-roxo-900 text-roxo-700 dark:text-roxo-300 rounded-full">
                  {tab.badge}
                </span>
              )}
              
              {/* Indicador de aba ativa para variant underline */}
              {variant === 'underline' && isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-roxo-500"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Conteúdo das Abas */}
      {showContent && (
        <div className="mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTabContent}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/**
 * Hook para gerenciar estado de abas
 */
export function useTabs(initialTab?: string) {
  const [activeTab, setActiveTab] = useState(initialTab || '');
  
  const switchTab = (tabId: string) => {
    setActiveTab(tabId);
  };
  
  return {
    activeTab,
    switchTab,
    setActiveTab
  };
}

/**
 * Componente de abas verticais
 */
export function VerticalTabNavigation({
  tabs,
  activeTab: controlledActiveTab,
  onTabChange,
  className = '',
  showContent = true
}: Omit<TabNavigationProps, 'variant' | 'size'>) {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id || '');
  
  const activeTab = controlledActiveTab || internalActiveTab;
  
  const handleTabChange = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };
  
  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;
  
  return (
    <div className={`flex gap-6 ${className}`}>
      {/* Navegação Vertical */}
      <div className="flex flex-col space-y-1 min-w-[200px]">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={`
                flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-roxo-50 dark:bg-roxo-900/20 text-roxo-600 dark:text-roxo-400 border-l-2 border-roxo-500' 
                  : 'text-grafite-600 dark:text-grafite-400 hover:bg-grafite-50 dark:hover:bg-grafite-800'
                }
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
              <div className="flex-1">
                <div className="font-medium">{tab.label}</div>
                {tab.badge && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-roxo-100 dark:bg-roxo-900 text-roxo-700 dark:text-roxo-300 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Conteúdo */}
      {showContent && (
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTabContent}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/**
 * Componente de abas com scroll horizontal para muitas abas
 */
export function ScrollableTabNavigation(props: TabNavigationProps) {
  return (
    <div className="relative">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex min-w-max">
          <TabNavigation {...props} className="flex-shrink-0" />
        </div>
      </div>
      
      {/* Gradientes de fade nas bordas */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-grafite-900 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-grafite-900 to-transparent pointer-events-none" />
    </div>
  );
}