import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, TrendingUp, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard, type ProjectData } from "@launchpad/shared-ui";
import { useProjects } from "../hooks/useApi";
import { useSimplePagination } from "../hooks/useProjectsPagination";
import { PaginationWithInfo } from "../components/Pagination";
import { ProjectCardSkeletonGrid } from "../components/ProjectCardSkeleton";
import type { Project, ProjectPhase } from "../types";

/**
 * Página de listagem de projetos IDO
 * Exibe todos os projetos com filtros e busca
 */
export default function ProjectsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPhase, setSelectedPhase] = useState<ProjectPhase | "all">(
    "all",
  );
  const [sortBy, setSortBy] = useState<"name" | "progress" | "raised">("name");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [filters, setFilters] = useState({
    category: "",
    minInvestment: "",
    maxInvestment: "",
    minProgress: 0,
    maxProgress: 100,
    hasKyc: false,
    isWhitelistOnly: false,
  });

  // Buscar projetos da API (comentado temporariamente para usar// Usando dados mock temporariamente
  // const { data: apiProjects, isLoading, error } = useProjects()

  // Categorias de projetos disponíveis
  const projectCategories = [
    "DeFi",
    "NFT",
    "Gaming",
    "Infrastructure",
    "Social",
    "Metaverse",
    "AI/ML",
    "Privacy",
  ];

  // Mock data - será substituído por dados reais da API
  const mockProjects: Project[] = [
    {
      id: "1",
      name: "LunesSwap Protocol",
      symbol: "LSP",
      description:
        "Protocolo de troca descentralizada na rede Lunes com pools de liquidez automatizados.",
      logo: "/api/placeholder/64/64",
      banner: "/api/placeholder/800/400",
      website: "https://lunesswap.io",
      twitter: "https://twitter.com/lunesswap",
      telegram: "https://t.me/lunesswap",
      totalSupply: "1000000000",
      tokenPrice: "0.05",
      hardCap: "500000",
      softCap: "100000",
      minInvestment: "10",
      maxInvestment: "5000",
      phase: "sale",
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-02-15"),
      distributionDate: new Date("2024-02-20"),
      raised: "350000",
      participants: 1250,
      progress: 70,
      isKycRequired: true,
      isWhitelistOnly: false,
      acceptedTokens: ["LUNES", "USDT"],
    },
    {
      id: "2",
      name: "DeFi Yield Farm",
      symbol: "DYF",
      description:
        "Plataforma de yield farming com estratégias automatizadas e otimização de rendimentos.",
      logo: "/api/placeholder/64/64",
      totalSupply: "500000000",
      tokenPrice: "0.12",
      hardCap: "800000",
      softCap: "200000",
      minInvestment: "25",
      maxInvestment: "10000",
      phase: "whitelist",
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-03-01"),
      distributionDate: new Date("2024-03-05"),
      raised: "150000",
      participants: 850,
      progress: 18.75,
      isKycRequired: true,
      isWhitelistOnly: true,
      acceptedTokens: ["LUNES"],
    },
    {
      id: "3",
      name: "NFT Marketplace",
      symbol: "NFTM",
      description:
        "Marketplace descentralizado para NFTs com funcionalidades avançadas de trading.",
      logo: "/api/placeholder/64/64",
      totalSupply: "750000000",
      tokenPrice: "0.08",
      hardCap: "600000",
      softCap: "150000",
      minInvestment: "15",
      maxInvestment: "7500",
      phase: "upcoming",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-04-01"),
      distributionDate: new Date("2024-04-05"),
      raised: "0",
      participants: 0,
      progress: 0,
      isKycRequired: false,
      isWhitelistOnly: false,
      acceptedTokens: ["LUNES", "USDT", "DOT"],
    },
  ];

  const phases: {
    value: ProjectPhase | "all";
    label: string;
    color: string;
  }[] = [
    { value: "all", label: "Todos", color: "bg-gray-100 text-gray-800" },
    {
      value: "upcoming",
      label: "Em Breve",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "whitelist",
      label: "Whitelist",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "sale",
      label: "Venda Ativa",
      color: "bg-verde-100 text-verde-800",
    },
    {
      value: "distribution",
      label: "Distribuição",
      color: "bg-roxo-100 text-roxo-800",
    },
    {
      value: "completed",
      label: "Finalizado",
      color: "bg-gray-100 text-gray-600",
    },
  ];

  const categories = [
    { value: "all", label: "Todas as Categorias" },
    { value: "defi", label: "DeFi" },
    { value: "nft", label: "NFT" },
    { value: "gaming", label: "Gaming" },
    { value: "infrastructure", label: "Infraestrutura" },
    { value: "dao", label: "DAO" },
  ];

  // Converter projetos mock para formato do ProjectCard
  const convertToProjectData = (project: Project): ProjectData => ({
    id: project.id,
    name: project.name,
    description: project.description,
    logo: project.logo,
    status:
      project.phase === "sale"
        ? "active"
        : project.phase === "upcoming"
          ? "upcoming"
          : project.phase === "completed"
            ? "completed"
            : "upcoming",
    phase: "ido",
    totalRaised: parseFloat(project.raised),
    targetAmount: parseFloat(project.hardCap),
    progress: project.progress,
    investors: project.participants,
    startDate: project.startDate.toISOString(),
    endDate: project.endDate.toISOString(),
    tokenPrice: parseFloat(project.tokenPrice),
    tokenSymbol: project.symbol,
    category: "defi", // Categoria padrão, pode ser expandida
    minInvestment: parseFloat(project.minInvestment),
    maxInvestment: parseFloat(project.maxInvestment),
    highlights: project.isKycRequired ? ["KYC Obrigatório"] : [],
  });

  // Gerar sugestões de busca baseadas nos projetos disponíveis
  const generateSearchSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];

    const suggestions = new Set<string>();
    const searchLower = searchTerm.toLowerCase();

    mockProjects.forEach((project) => {
      // Sugestões baseadas no nome do projeto
      if (project.name.toLowerCase().includes(searchLower)) {
        suggestions.add(project.name);
      }

      // Sugestões baseadas no símbolo
      if (project.symbol.toLowerCase().includes(searchLower)) {
        suggestions.add(project.symbol);
      }

      // Sugestões baseadas na descrição (palavras-chave)
      const descriptionWords = project.description.toLowerCase().split(" ");
      descriptionWords.forEach((word) => {
        if (word.length > 3 && word.includes(searchLower)) {
          suggestions.add(word);
        }
      });
    });

    return Array.from(suggestions).slice(0, 5);
  }, [searchTerm, mockProjects]);

  // Atualizar sugestões quando o termo de busca muda
  useEffect(() => {
    setSearchSuggestions(generateSearchSuggestions);
  }, [searchTerm]);

  // Fechar sugestões quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Contar filtros ativos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedPhase !== "all") count++;
    if (filters.category) count++;
    if (filters.minInvestment) count++;
    if (filters.maxInvestment) count++;
    if (filters.minProgress > 0) count++;
    if (filters.maxProgress < 100) count++;
    if (filters.hasKyc) count++;
    if (filters.isWhitelistOnly) count++;
    return count;
  }, [searchTerm, selectedPhase, filters]);

  // Filtros avançados com useMemo para otimização
  const filteredProjects = useMemo(() => {
    return mockProjects
      .filter((project) => {
        const matchesSearch =
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPhase =
          selectedPhase === "all" || project.phase === selectedPhase;

        // Filtros avançados
        const matchesMinInvestment =
          !filters.minInvestment ||
          parseFloat(project.minInvestment) >=
            parseFloat(filters.minInvestment);
        const matchesMaxInvestment =
          !filters.maxInvestment ||
          parseFloat(project.maxInvestment) <=
            parseFloat(filters.maxInvestment);
        const matchesProgress =
          project.progress >= filters.minProgress &&
          project.progress <= filters.maxProgress;
        const matchesKyc = !filters.hasKyc || project.isKycRequired;
        const matchesWhitelist =
          !filters.isWhitelistOnly || project.isWhitelistOnly;

        return (
          matchesSearch &&
          matchesPhase &&
          matchesMinInvestment &&
          matchesMaxInvestment &&
          matchesProgress &&
          matchesKyc &&
          matchesWhitelist
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "name":
            return a.name.localeCompare(b.name);
          case "raised":
            return parseFloat(b.raised) - parseFloat(a.raised);
          case "progress":
            return b.progress - a.progress;
          default:
            return 0;
        }
      });
  }, [mockProjects, searchTerm, selectedPhase, sortBy, filters]);

  // Hook de paginação simples e estável
  const {
    currentPage,
    totalPages,
    items: paginatedProjects,
    goToPage,
    nextPage,
    previousPage: prevPage,
    resetPagination,
  } = useSimplePagination(filteredProjects, 12);

  // Reset paginação quando filtros mudarem
  useEffect(() => {
    resetPagination();
  }, [searchTerm, selectedPhase, sortBy, filters]);

  // Estado de loading baseado na mudança de filtros
  const isLoading = false;

  return (
    <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Projetos IDO</h1>
          <p className="text-grafite-300 max-w-2xl">
            Descubra e invista nos melhores projetos DeFi da rede Lunes. Todos
            os projetos são cuidadosamente selecionados e auditados.
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-8">
          {/* Basic Filters */}
          <div className="bg-grafite-800 rounded-lg shadow-sm p-6 border border-grafite-600">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative" ref={searchInputRef}>
                  <Search
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                      searchTerm ? "text-roxo-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Buscar projetos por nome, símbolo ou palavra-chave..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSearchSuggestions(e.target.value.length >= 2);
                    }}
                    onFocus={() =>
                      searchTerm.length >= 2 && setShowSearchSuggestions(true)
                    }
                    className="w-full pl-10 pr-10 py-2 border border-grafite-600 bg-grafite-700 text-white placeholder-grafite-400 rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                  />

                  {/* Botão para limpar busca */}
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setShowSearchSuggestions(false);
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {/* Sugestões de busca */}
                  <AnimatePresence>
                    {showSearchSuggestions && searchSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-grafite-800 border border-grafite-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                      >
                        {searchSuggestions.map((suggestion, index) => {
                          const highlightText = (
                            text: string,
                            highlight: string,
                          ) => {
                            const parts = text.split(
                              new RegExp(`(${highlight})`, "gi"),
                            );
                            return parts.map((part, i) =>
                              part.toLowerCase() === highlight.toLowerCase() ? (
                                <span
                                  key={i}
                                  className="bg-roxo-100 text-roxo-700 font-medium"
                                >
                                  {part}
                                </span>
                              ) : (
                                <span key={i}>{part}</span>
                              ),
                            );
                          };

                          return (
                            <button
                              key={index}
                              onClick={() => {
                                setSearchTerm(suggestion);
                                setShowSearchSuggestions(false);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-grafite-700 focus:bg-grafite-700 focus:outline-none first:rounded-t-lg last:rounded-b-lg transition-colors"
                            >
                              <span className="text-white">
                                {highlightText(suggestion, searchTerm)}
                              </span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Phase Filter */}
              <div className="flex flex-wrap gap-2">
                {phases.map((phase) => (
                  <button
                    key={phase.value}
                    onClick={() => setSelectedPhase(phase.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedPhase === phase.value
                        ? phase.color
                        : "bg-grafite-700 text-grafite-300 hover:bg-grafite-600 border border-grafite-600"
                    }`}
                  >
                    {phase.label}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="border border-grafite-600 bg-grafite-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                >
                  <option value="endDate">Data de Término</option>
                  <option value="name">Nome</option>
                  <option value="raised">Valor Arrecadado</option>
                </select>
              </div>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors relative ${
                  showAdvancedFilters
                    ? "bg-roxo-600 text-white border-roxo-600"
                    : "bg-grafite-700 text-grafite-300 border-grafite-600 hover:border-roxo-600"
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filtros Avançados
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-laranja-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Resultados dos Filtros */}
          {(searchTerm ||
            selectedPhase !== "all" ||
            activeFiltersCount > 2) && (
            <div className="bg-grafite-800 px-4 py-3 rounded-lg border border-grafite-600">
              <p className="text-sm text-grafite-300">
                {filteredProjects.length === 0
                  ? "Nenhum projeto encontrado com os filtros aplicados"
                  : `${filteredProjects.length} projeto${filteredProjects.length !== 1 ? "s" : ""} encontrado${filteredProjects.length !== 1 ? "s" : ""}`}
                {activeFiltersCount > 0 && (
                  <span className="ml-2 text-roxo-600 font-medium">
                    ({activeFiltersCount} filtro
                    {activeFiltersCount !== 1 ? "s" : ""} ativo
                    {activeFiltersCount !== 1 ? "s" : ""})
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-grafite-800 rounded-lg shadow-sm p-6 border border-grafite-600"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Filtros Avançados
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setFilters({
                          category: "",
                          minInvestment: "",
                          maxInvestment: "",
                          minProgress: 0,
                          maxProgress: 100,
                          hasKyc: false,
                          isWhitelistOnly: false,
                        })
                      }
                      className="text-sm text-roxo-600 hover:text-roxo-700 font-medium"
                    >
                      Limpar Filtros
                    </button>
                    <button
                      onClick={() => setShowAdvancedFilters(false)}
                      className="text-grafite-400 hover:text-grafite-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-grafite-300 mb-2">
                      Categoria
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-grafite-600 bg-grafite-700 text-white rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                    >
                      <option value="">Todas as categorias</option>
                      {projectCategories.map((category: string) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Investment Range */}
                  <div>
                    <label className="block text-sm font-medium text-grafite-300 mb-2">
                      Investimento Mínimo (USD)
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 100"
                      value={filters.minInvestment}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          minInvestment: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-grafite-600 bg-grafite-700 text-white rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent placeholder-grafite-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-grafite-300 mb-2">
                      Investimento Máximo (USD)
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 10000"
                      value={filters.maxInvestment}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          maxInvestment: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-grafite-600 bg-grafite-700 text-white rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent placeholder-grafite-400"
                    />
                  </div>

                  {/* Progress Range */}
                  <div>
                    <label className="block text-sm font-medium text-grafite-300 mb-2">
                      Progresso Mínimo (%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.minProgress}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          minProgress: parseInt(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                    <span className="text-sm text-grafite-300">
                      {filters.minProgress}%
                    </span>
                  </div>

                  {/* Checkboxes */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasKyc"
                      checked={filters.hasKyc}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          hasKyc: e.target.checked,
                        }))
                      }
                      className="mr-2"
                    />
                    <label htmlFor="hasKyc" className="text-sm text-grafite-300">
                      Apenas com KYC
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isWhitelistOnly"
                      checked={filters.isWhitelistOnly}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          isWhitelistOnly: e.target.checked,
                        }))
                      }
                      className="mr-2"
                    />
                    <label
                      htmlFor="isWhitelistOnly"
                      className="text-sm text-grafite-300"
                    >
                      Apenas Whitelist
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <ProjectCardSkeletonGrid count={12} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {paginatedProjects.map((project: Project, index: number) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  layout
                >
                  <ProjectCard
                    project={convertToProjectData(project)}
                    onViewDetails={(projectId: string) => {
                      navigate(`/projetos/${projectId}`);
                    }}
                    onInvest={(projectId: string) => {
                      navigate(`/projetos/${projectId}`);
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Paginação */}
        {!isLoading && paginatedProjects.length > 0 && totalPages > 1 && (
          <div className="mt-8">
            <PaginationWithInfo
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProjects.length}
              itemsPerPage={12}
              onPageChange={goToPage}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-grafite-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Nenhum projeto encontrado
            </h3>
            <p className="text-grafite-400">
              Tente ajustar os filtros ou buscar por outros termos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
