import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

/**
 * Mapeamento de rotas para breadcrumbs automáticos
 */
const ROUTE_LABELS: Record<string, string> = {
  '/': 'Início',
  '/dashboard': 'Dashboard',
  '/dashboard/investimentos': 'Investimentos',
  '/projetos': 'Projetos',
  '/analytics': 'Analytics',
  '/project': 'Projeto',
  '/project/details': 'Detalhes',
  '/project/phases': 'Fases',
  '/project/investors': 'Investidores',
  '/project/financial': 'Financeiro',
  '/project/documents': 'Documentos',
  '/vip': 'VIP Portal',
  '/vip/reports': 'Relatórios VIP',
  '/launchpool': 'Launchpool',
  '/raffles': 'Sorteios',
  '/raffle-history': 'Histórico de Raffles',
  '/governanca': 'Governança',
  '/profile': 'Perfil',
  '/wallet': 'Carteira',
  '/notifications': 'Notificações',
  '/settings': 'Configurações',
  '/admin': 'Administração',
};

/**
 * Componente de navegação breadcrumb moderno
 * Gera automaticamente os breadcrumbs baseado na rota atual ou aceita itens customizados
 */
export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const location = useLocation();
  
  // Gerar breadcrumbs automaticamente se não fornecidos
  const breadcrumbItems = items || generateBreadcrumbs(location.pathname);
  
  if (breadcrumbItems.length <= 1) {
    return null; // Não mostrar breadcrumb se houver apenas um item
  }

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const Icon = item.icon;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-grafite-400 dark:text-grafite-500 mx-2" />
              )}
              
              {isLast ? (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex items-center gap-2 font-medium text-grafite-900 dark:text-white"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                </motion.span>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Link
                    to={item.href!}
                    className="flex items-center gap-2 text-grafite-600 dark:text-grafite-400 hover:text-roxo-600 dark:hover:text-roxo-400 transition-colors duration-200 hover:underline"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {item.label}
                  </Link>
                </motion.div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Gera breadcrumbs automaticamente baseado no pathname
 */
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Sempre adicionar o início
  breadcrumbs.push({
    label: 'Início',
    href: '/',
    icon: Home
  });
  
  // Se estiver na página inicial, retornar apenas ela
  if (pathname === '/') {
    return [{ label: 'Início', icon: Home }];
  }
  
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Pular se for o último segmento (página atual)
    const isLast = index === segments.length - 1;
    
    const label = ROUTE_LABELS[currentPath] || formatSegment(segment);
    
    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath
    });
  });
  
  return breadcrumbs;
}

/**
 * Formata um segmento de URL para exibição
 */
function formatSegment(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Hook para criar breadcrumbs customizados
 */
export function useBreadcrumb() {
  const location = useLocation();
  
  const setBreadcrumb = (items: BreadcrumbItem[]) => {
    // Em uma implementação real, isso poderia usar um contexto global
    // Por agora, retornamos os itens diretamente
    return items;
  };
  
  const addBreadcrumb = (item: BreadcrumbItem) => {
    const current = generateBreadcrumbs(location.pathname);
    return [...current, item];
  };
  
  return {
    setBreadcrumb,
    addBreadcrumb,
    currentBreadcrumbs: generateBreadcrumbs(location.pathname)
  };
}

/**
 * Componente de breadcrumb compacto para uso em headers de página
 */
export function CompactBreadcrumb({ className = '' }: { className?: string }) {
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location.pathname);
  
  if (breadcrumbs.length <= 1) return null;
  
  const current = breadcrumbs[breadcrumbs.length - 1];
  const parent = breadcrumbs[breadcrumbs.length - 2];
  
  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      {parent && (
        <>
          <Link
            to={parent.href!}
            className="text-grafite-500 dark:text-grafite-400 hover:text-roxo-600 dark:hover:text-roxo-400 transition-colors"
          >
            {parent.label}
          </Link>
          <ChevronRight className="w-3 h-3 text-grafite-400" />
        </>
      )}
      <span className="font-medium text-grafite-900 dark:text-white">
        {current.label}
      </span>
    </div>
  );
}