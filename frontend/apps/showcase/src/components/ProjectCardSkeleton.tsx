import React from "react";
import { motion } from "framer-motion";

/**
 * Componente de skeleton para ProjectCard durante o carregamento
 * Mantém o layout consistente enquanto os dados são carregados
 */
export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Banner Skeleton */}
      <div className="relative h-48 bg-gray-200 animate-pulse">
        <div className="absolute top-4 left-4">
          <div className="w-16 h-6 bg-gray-300 rounded-full animate-pulse" />
        </div>
        <div className="absolute top-4 right-4">
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2 mb-6">
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full animate-pulse" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-20 h-5 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-16 h-5 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
        </div>

        {/* Buttons */}
        <div className="flex space-x-3">
          <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid de skeletons para múltiplos cards
 */
interface ProjectCardSkeletonGridProps {
  count?: number;
  className?: string;
}

export function ProjectCardSkeletonGrid({
  count = 9,
  className = "",
}: ProjectCardSkeletonGridProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {Array.from({ length: count }, (_, index) => (
        <motion.div
          key={`skeleton-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ProjectCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Skeleton para lista de projetos (versão compacta)
 */
export function ProjectListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={`list-skeleton-${index}`}
          className="bg-white rounded-lg border border-gray-200 p-4"
        >
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />

            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
              <div className="flex items-center space-x-4">
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 flex-shrink-0">
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton animado com efeito shimmer
 */
export function ShimmerSkeleton({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

/**
 * Skeleton para métricas/estatísticas
 */
export function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={`metric-skeleton-${index}`}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton para filtros
 */
export function FiltersSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-4">
        {/* Search */}
        <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse" />

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={`filter-skeleton-${index}`}
              className="w-20 h-8 bg-gray-200 rounded-full animate-pulse"
            />
          ))}
        </div>

        {/* Advanced filters toggle */}
        <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}
