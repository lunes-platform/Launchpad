import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  MoreVertical,
  Download,
  AlertTriangle,
} from "lucide-react";

/**
 * Tipos para gestão de projetos
 */
interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "active"
    | "completed"
    | "paused";
  phase:
    | "preparation"
    | "presale"
    | "public_sale"
    | "distribution"
    | "completed";
  creator: {
    name: string;
    address: string;
    verified: boolean;
  };
  metrics: {
    totalRaised: number;
    targetAmount: number;
    investors: number;
    progress: number;
  };
  dates: {
    created: string;
    startDate?: string;
    endDate?: string;
  };
  tokenomics: {
    totalSupply: number;
    price: number;
    symbol: string;
  };
}

interface ProjectFilters {
  status: string;
  phase: string;
  category: string;
  search: string;
}

/**
 * Página de Gestão de Projetos para Administradores
 *
 * Funcionalidades:
 * - Listagem completa de projetos
 * - Filtros avançados por status, fase e categoria
 * - Aprovação/rejeição de projetos
 * - Visualização de métricas detalhadas
 * - Configuração de fases de captação
 * - Exportação de relatórios
 */
export function AdminProjects() {
  const [filters, setFilters] = useState<ProjectFilters>({
    status: "all",
    phase: "all",
    category: "all",
    search: "",
  });

  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - em produção viria da API
  const projects: Project[] = [
    {
      id: "1",
      name: "DeFi Protocol X",
      description: "Protocolo DeFi inovador para yield farming automatizado",
      category: "DeFi",
      status: "pending",
      phase: "preparation",
      creator: {
        name: "João Silva",
        address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        verified: true,
      },
      metrics: {
        totalRaised: 0,
        targetAmount: 500000,
        investors: 0,
        progress: 0,
      },
      dates: {
        created: "2024-01-15T10:00:00Z",
      },
      tokenomics: {
        totalSupply: 1000000,
        price: 0.5,
        symbol: "DPX",
      },
    },
    {
      id: "2",
      name: "GameFi Arena",
      description: "Plataforma de jogos blockchain com NFTs e recompensas",
      category: "Gaming",
      status: "approved",
      phase: "presale",
      creator: {
        name: "Maria Santos",
        address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
        verified: true,
      },
      metrics: {
        totalRaised: 125000,
        targetAmount: 300000,
        investors: 245,
        progress: 41.7,
      },
      dates: {
        created: "2024-01-10T14:30:00Z",
        startDate: "2024-01-20T00:00:00Z",
        endDate: "2024-02-20T23:59:59Z",
      },
      tokenomics: {
        totalSupply: 500000,
        price: 0.6,
        symbol: "GFA",
      },
    },
    {
      id: "3",
      name: "Green Energy Token",
      description: "Tokenização de projetos de energia renovável",
      category: "Sustainability",
      status: "active",
      phase: "public_sale",
      creator: {
        name: "Carlos Oliveira",
        address: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy",
        verified: true,
      },
      metrics: {
        totalRaised: 750000,
        targetAmount: 1000000,
        investors: 892,
        progress: 75,
      },
      dates: {
        created: "2024-01-05T09:15:00Z",
        startDate: "2024-01-25T00:00:00Z",
        endDate: "2024-03-01T23:59:59Z",
      },
      tokenomics: {
        totalSupply: 2000000,
        price: 0.5,
        symbol: "GET",
      },
    },
  ];

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-roxo-claro text-roxo-800",
    rejected: "bg-red-100 text-red-800",
    active: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
    paused: "bg-orange-100 text-orange-800",
  };

  const phaseColors = {
    preparation: "bg-gray-100 text-gray-700",
    presale: "bg-roxo-claro text-roxo-700",
    public_sale: "bg-green-100 text-green-700",
    distribution: "bg-purple-100 text-purple-700",
    completed: "bg-gray-100 text-gray-700",
  };

  const handleApproveProject = (projectId: string) => {
    console.log("Aprovando projeto:", projectId);
    // Implementar lógica de aprovação
  };

  const handleRejectProject = (projectId: string) => {
    console.log("Rejeitando projeto:", projectId);
    // Implementar lógica de rejeição
  };

  const handleBulkAction = (action: string) => {
    console.log("Ação em lote:", action, selectedProjects);
    // Implementar ações em lote
  };

  const filteredProjects = projects.filter((project) => {
    if (filters.status !== "all" && project.status !== filters.status)
      return false;
    if (filters.phase !== "all" && project.phase !== filters.phase)
      return false;
    if (filters.category !== "all" && project.category !== filters.category)
      return false;
    if (
      filters.search &&
      !project.name.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-grafite dark:text-grafite-50">
            Gestão de Projetos
          </h1>
          <p className="text-gray-600 dark:text-grafite-300">
            Gerencie todos os projetos da plataforma
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-2 bg-roxo text-white rounded-lg hover:bg-roxo-600 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Novo Projeto</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-grafite-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-grafite-700 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-grafite-300">
                Total de Projetos
              </p>
              <p className="text-2xl font-bold text-grafite dark:text-grafite-50">
                {projects.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-roxo-100 dark:bg-roxo-900/30 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-roxo dark:text-roxo-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-grafite-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-grafite-700 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-grafite-300">
                Pendentes
              </p>
              <p className="text-2xl font-bold text-grafite dark:text-grafite-50">
                {projects.filter((p) => p.status === "pending").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-grafite-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-grafite-700 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-grafite-300">
                Ativos
              </p>
              <p className="text-2xl font-bold text-grafite dark:text-grafite-50">
                {projects.filter((p) => p.status === "active").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-grafite-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-grafite-700 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-grafite-300">
                Volume Total
              </p>
              <p className="text-2xl font-bold text-grafite dark:text-grafite-50">
                $
                {projects
                  .reduce((acc, p) => acc + p.metrics.totalRaised, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-verde-100 dark:bg-verde-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-verde dark:text-verde-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-grafite-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-grafite-700 transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar projetos..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>

          {selectedProjects.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedProjects.length} selecionados
              </span>
              <button
                onClick={() => handleBulkAction("approve")}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
              >
                Aprovar
              </button>
              <button
                onClick={() => handleBulkAction("reject")}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
              >
                Rejeitar
              </button>
            </div>
          )}
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent"
              >
                <option value="all">Todos os Status</option>
                <option value="pending">Pendente</option>
                <option value="approved">Aprovado</option>
                <option value="rejected">Rejeitado</option>
                <option value="active">Ativo</option>
                <option value="completed">Concluído</option>
                <option value="paused">Pausado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fase
              </label>
              <select
                value={filters.phase}
                onChange={(e) =>
                  setFilters({ ...filters, phase: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent"
              >
                <option value="all">Todas as Fases</option>
                <option value="preparation">Preparação</option>
                <option value="presale">Pré-venda</option>
                <option value="public_sale">Venda Pública</option>
                <option value="distribution">Distribuição</option>
                <option value="completed">Concluída</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent"
              >
                <option value="all">Todas as Categorias</option>
                <option value="DeFi">DeFi</option>
                <option value="Gaming">Gaming</option>
                <option value="NFT">NFT</option>
                <option value="Infrastructure">Infraestrutura</option>
                <option value="Sustainability">Sustentabilidade</option>
              </select>
            </div>
          </motion.div>
        )}
      </div>

      {/* Projects Table */}
      <div className="bg-white dark:bg-grafite-800 rounded-xl shadow-sm border border-gray-200 dark:border-grafite-700 overflow-hidden transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-grafite-700 border-b border-gray-200 dark:border-grafite-600">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProjects(filteredProjects.map((p) => p.id));
                      } else {
                        setSelectedProjects([]);
                      }
                    }}
                    className="rounded border-gray-300 text-roxo focus:ring-roxo"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projeto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progresso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-grafite-800 divide-y divide-gray-200 dark:divide-grafite-700">
              {filteredProjects.map((project, index) => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-grafite-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProjects([
                            ...selectedProjects,
                            project.id,
                          ]);
                        } else {
                          setSelectedProjects(
                            selectedProjects.filter((id) => id !== project.id),
                          );
                        }
                      }}
                      className="rounded border-gray-300 text-roxo focus:ring-roxo"
                    />
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-grafite dark:text-grafite-50">
                        {project.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-grafite-400">
                        {project.category}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        statusColors[project.status]
                      }`}
                    >
                      {project.status === "pending" && "Pendente"}
                      {project.status === "approved" && "Aprovado"}
                      {project.status === "rejected" && "Rejeitado"}
                      {project.status === "active" && "Ativo"}
                      {project.status === "completed" && "Concluído"}
                      {project.status === "paused" && "Pausado"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        phaseColors[project.phase]
                      }`}
                    >
                      {project.phase === "preparation" && "Preparação"}
                      {project.phase === "presale" && "Pré-venda"}
                      {project.phase === "public_sale" && "Venda Pública"}
                      {project.phase === "distribution" && "Distribuição"}
                      {project.phase === "completed" && "Concluída"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-verde h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.metrics.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {project.metrics.progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-grafite-400 mt-1">
                      ${project.metrics.totalRaised.toLocaleString()} / $
                      {project.metrics.targetAmount.toLocaleString()}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-grafite rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {project.creator.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm text-grafite dark:text-grafite-50">
                          {project.creator.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-grafite-400">
                          {project.creator.address.slice(0, 8)}...
                          {project.creator.address.slice(-6)}
                        </div>
                      </div>
                      {project.creator.verified && (
                        <CheckCircle className="w-4 h-4 text-verde" />
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm text-grafite dark:text-grafite-50">
                      {new Date(project.dates.created).toLocaleDateString(
                        "pt-BR",
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {project.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApproveProject(project.id)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Aprovar"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectProject(project.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Rejeitar"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>

                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>

                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum projeto encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar os filtros ou criar um novo projeto.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
