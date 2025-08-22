import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Interface para as props do componente Pagination
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

/**
 * Componente de paginação com design moderno e animações
 *
 * @param props - Propriedades do componente
 * @returns Componente de paginação
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  showPageNumbers = true,
  maxVisiblePages = 7,
  className = "",
}: PaginationProps) {
  // Se há apenas uma página, não mostrar paginação
  if (totalPages <= 1) {
    return null;
  }

  /**
   * Gera a lista de páginas visíveis com ellipsis
   */
  const getVisiblePages = (): (number | "ellipsis")[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    // Sempre mostrar a primeira página
    pages.push(1);

    let startPage = Math.max(2, currentPage - halfVisible + 1);
    let endPage = Math.min(totalPages - 1, currentPage + halfVisible - 1);

    // Ajustar se estamos muito próximos do início
    if (currentPage <= halfVisible) {
      endPage = Math.min(totalPages - 1, maxVisiblePages - 1);
    }

    // Ajustar se estamos muito próximos do fim
    if (currentPage > totalPages - halfVisible) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 2);
    }

    // Adicionar ellipsis no início se necessário
    if (startPage > 2) {
      pages.push("ellipsis");
    }

    // Adicionar páginas do meio
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Adicionar ellipsis no fim se necessário
    if (endPage < totalPages - 1) {
      pages.push("ellipsis");
    }

    // Sempre mostrar a última página (se não for a primeira)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  /**
   * Componente para botão de página
   */
  const PageButton = ({
    page,
    isActive = false,
    onClick,
  }: {
    page: number;
    isActive?: boolean;
    onClick: () => void;
  }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={isLoading}
      className={`
        relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
        ${
          isActive
            ? "bg-roxo-600 text-white shadow-lg shadow-roxo-600/25"
            : "text-gray-700 hover:text-roxo-600 hover:bg-roxo-50"
        }
        ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        disabled:hover:scale-100
      `}
    >
      {isActive && (
        <motion.div
          layoutId="pagination-active"
          className="absolute inset-0 bg-roxo-600 rounded-lg"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <span className="relative z-10">{page}</span>
    </motion.button>
  );

  /**
   * Componente para botão de navegação (anterior/próximo)
   */
  const NavButton = ({
    direction,
    onClick,
    disabled,
  }: {
    direction: "prev" | "next";
    onClick: () => void;
    disabled: boolean;
  }) => (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-200
        ${
          disabled || isLoading
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:text-roxo-600 hover:bg-roxo-50 cursor-pointer"
        }
      `}
    >
      {direction === "prev" ? (
        <ChevronLeft className="w-5 h-5" />
      ) : (
        <ChevronRight className="w-5 h-5" />
      )}
    </motion.button>
  );

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {/* Botão Anterior */}
      <NavButton
        direction="prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      />

      {/* Números das páginas */}
      {showPageNumbers && (
        <div className="flex items-center space-x-1 mx-2">
          {visiblePages.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <div
                  key={`ellipsis-${index}`}
                  className="px-2 py-2 text-gray-400"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              );
            }

            return (
              <PageButton
                key={page}
                page={page}
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
              />
            );
          })}
        </div>
      )}

      {/* Botão Próximo */}
      <NavButton
        direction="next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      />
    </div>
  );
}

/**
 * Componente de informações da paginação
 */
interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}

export function PaginationInfo({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  className = "",
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`text-sm text-gray-600 ${className}`}>
      Mostrando <span className="font-medium text-gray-900">{startItem}</span> a{" "}
      <span className="font-medium text-gray-900">{endItem}</span> de{" "}
      <span className="font-medium text-gray-900">{totalItems}</span> projetos
    </div>
  );
}

/**
 * Componente composto com paginação e informações
 */
interface PaginationWithInfoProps extends PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  showInfo?: boolean;
  infoPosition?: "top" | "bottom" | "both";
}

export function PaginationWithInfo({
  totalItems,
  itemsPerPage,
  showInfo = true,
  infoPosition = "bottom",
  className = "",
  ...paginationProps
}: PaginationWithInfoProps) {
  const InfoComponent = (
    <PaginationInfo
      currentPage={paginationProps.currentPage}
      totalPages={paginationProps.totalPages}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
    />
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Info no topo */}
      {showInfo && (infoPosition === "top" || infoPosition === "both") && (
        <div className="flex justify-center">{InfoComponent}</div>
      )}

      {/* Paginação */}
      <Pagination {...paginationProps} />

      {/* Info na parte inferior */}
      {showInfo && (infoPosition === "bottom" || infoPosition === "both") && (
        <div className="flex justify-center">{InfoComponent}</div>
      )}
    </div>
  );
}

/**
 * Hook para gerenciar estado de paginação simples
 */
export function usePaginationState(initialPage: number = 1) {
  const [currentPage, setCurrentPage] = React.useState(initialPage);

  const goToPage = React.useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const resetPage = React.useCallback(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  return {
    currentPage,
    goToPage,
    resetPage,
  };
}
