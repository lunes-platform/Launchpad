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
  AlertTriangle,
  Users,
  UserCheck,
  Crown,
  Ban,
  MoreVertical,
  Download,
  Mail,
} from "lucide-react";
import { UserRole } from "../../types/user";

/**
 * Tipos para gestão de usuários
 */
interface User {
  id: string;
  address: string;
  email?: string;
  phone?: string;
  name?: string;
  role: UserRole;
  status: "active" | "pending" | "suspended" | "banned";
  kyc: {
    status: "none" | "pending" | "approved" | "rejected";
    level: "basic" | "advanced" | "premium";
    documents: string[];
    verifiedAt?: string;
  };
  verification: {
    isVerified: boolean;
    isVip: boolean;
    verifiedAt?: string;
  };
  stats: {
    totalInvested: number;
    projectsCreated: number;
    stakingAmount: number;
    lastActivity: string;
  };
  registration: {
    date: string;
    referrer?: string;
    source: string;
  };
}

interface UserFilters {
  role: string;
  status: string;
  kyc: string;
  verification: string;
  search: string;
}

/**
 * Página de Gestão de Usuários para Administradores
 *
 * Funcionalidades:
 * - Listagem completa de usuários
 * - Filtros por papel, status, KYC e verificação
 * - Aprovação/rejeição de KYC
 * - Controle de papéis e permissões
 * - Banimento e suspensão de usuários
 * - Verificação manual de usuários
 * - Exportação de relatórios
 */
export function AdminUsers() {
  const [filters, setFilters] = useState<UserFilters>({
    role: "all",
    status: "all",
    kyc: "all",
    verification: "all",
    search: "",
  });

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - em produção viria da API
  const users: User[] = [
    {
      id: "1",
      address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      email: "joao.silva@email.com",
      phone: "+55 11 99999-9999",
      name: "João Silva",
      role: "standard_investor",
      status: "active",
      kyc: {
        status: "approved",
        level: "advanced",
        documents: ["identity", "address", "income"],
        verifiedAt: "2024-01-10T14:30:00Z",
      },
      verification: {
        isVerified: true,
        isVip: true,
        verifiedAt: "2024-01-10T14:30:00Z",
      },
      stats: {
        totalInvested: 50000,
        projectsCreated: 0,
        stakingAmount: 25000,
        lastActivity: "2024-01-20T10:00:00Z",
      },
      registration: {
        date: "2024-01-01T00:00:00Z",
        referrer: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
        source: "organic",
      },
    },
    {
      id: "2",
      address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
      email: "maria.santos@email.com",
      name: "Maria Santos",
      role: "project",
      status: "active",
      kyc: {
        status: "pending",
        level: "premium",
        documents: ["identity", "address", "business"],
      },
      verification: {
        isVerified: true,
        isVip: false,
        verifiedAt: "2024-01-05T09:15:00Z",
      },
      stats: {
        totalInvested: 0,
        projectsCreated: 3,
        stakingAmount: 0,
        lastActivity: "2024-01-19T16:45:00Z",
      },
      registration: {
        date: "2023-12-15T00:00:00Z",
        source: "referral",
      },
    },
    {
      id: "3",
      address: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy",
      email: "carlos.oliveira@email.com",
      name: "Carlos Oliveira",
      role: "standard_investor",
      status: "suspended",
      kyc: {
        status: "rejected",
        level: "basic",
        documents: ["identity"],
      },
      verification: {
        isVerified: false,
        isVip: false,
      },
      stats: {
        totalInvested: 1000,
        projectsCreated: 0,
        stakingAmount: 0,
        lastActivity: "2024-01-15T08:30:00Z",
      },
      registration: {
        date: "2024-01-10T00:00:00Z",
        source: "social_media",
      },
    },
  ];

  const roleColors: Record<UserRole, string> = {
    admin: "bg-red-100 text-red-800",
    project: "bg-roxo-claro text-roxo-800",
    standard_investor: "bg-green-100 text-green-800",
    vip_investor: "bg-yellow-100 text-yellow-800",
    verified_investor: "bg-indigo-100 text-indigo-800",
    banned_user: "bg-gray-100 text-gray-800",
    price_oracle: "bg-purple-100 text-purple-800",
  };

  const statusColors = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    suspended: "bg-orange-100 text-orange-800",
    banned: "bg-red-100 text-red-800",
  };

  const kycColors = {
    none: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const handleApproveKyc = (userId: string) => {
    console.log("Aprovando KYC:", userId);
    // Implementar lógica de aprovação de KYC
  };

  const handleRejectKyc = (userId: string) => {
    console.log("Rejeitando KYC:", userId);
    // Implementar lógica de rejeição de KYC
  };

  const handleSuspendUser = (userId: string) => {
    console.log("Suspendendo usuário:", userId);
    // Implementar lógica de suspensão
  };

  const handleBulkAction = (action: string) => {
    console.log("Ação em lote:", action, selectedUsers);
    // Implementar ações em lote
  };

  const filteredUsers = users.filter((user) => {
    if (filters.role !== "all" && user.role !== filters.role) return false;
    if (filters.status !== "all" && user.status !== filters.status)
      return false;
    if (filters.kyc !== "all" && user.kyc.status !== filters.kyc) return false;
    if (filters.verification !== "all") {
      if (filters.verification === "verified" && !user.verification.isVerified)
        return false;
      if (filters.verification === "vip" && !user.verification.isVip)
        return false;
      if (filters.verification === "unverified" && user.verification.isVerified)
        return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesName = user.name?.toLowerCase().includes(searchLower);
      const matchesEmail = user.email?.toLowerCase().includes(searchLower);
      const matchesAddress = user.address.toLowerCase().includes(searchLower);
      if (!matchesName && !matchesEmail && !matchesAddress) return false;
    }
    return true;
  });

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
      admin: "Administrador",
      project: "Criador de Projeto",
      standard_investor: "Investidor",
      vip_investor: "Investidor VIP",
      verified_investor: "Investidor Verificado",
      banned_user: "Usuário Banido",
      price_oracle: "Oráculo de Preços",
    };
    return labels[role] || role;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-grafite">
            Gestão de Usuários
          </h1>
          <p className="text-gray-600">Gerencie usuários, KYC e verificações</p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-2 bg-roxo text-white rounded-lg hover:bg-roxo-600 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Convidar Usuário</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total de Usuários
              </p>
              <p className="text-2xl font-bold text-grafite">{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-roxo-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-roxo" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">KYC Pendente</p>
              <p className="text-2xl font-bold text-grafite">
                {users.filter((u) => u.kyc.status === "pending").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verificados</p>
              <p className="text-2xl font-bold text-grafite">
                {users.filter((u) => u.verification.isVerified).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">VIP</p>
              <p className="text-2xl font-bold text-grafite">
                {users.filter((u) => u.verification.isVip).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Suspensos</p>
              <p className="text-2xl font-bold text-grafite">
                {
                  users.filter(
                    (u) => u.status === "suspended" || u.status === "banned",
                  ).length
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Ban className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar usuários..."
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

          {selectedUsers.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedUsers.length} selecionados
              </span>
              <button
                onClick={() => handleBulkAction("verify")}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
              >
                Verificar
              </button>
              <button
                onClick={() => handleBulkAction("suspend")}
                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors"
              >
                Suspender
              </button>
              <button
                onClick={() => handleBulkAction("ban")}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
              >
                Banir
              </button>
            </div>
          )}
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Papel
              </label>
              <select
                value={filters.role}
                onChange={(e) =>
                  setFilters({ ...filters, role: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent"
              >
                <option value="all">Todos os Papéis</option>
                <option value="admin">Administrador</option>
                <option value="project">Criador de Projeto</option>
                <option value="standard_investor">Investidor</option>
                <option value="vip_investor">Investidor VIP</option>
                <option value="verified_investor">Investidor Verificado</option>
                <option value="price_oracle">Oráculo de Preços</option>
              </select>
            </div>

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
                <option value="active">Ativo</option>
                <option value="pending">Pendente</option>
                <option value="suspended">Suspenso</option>
                <option value="banned">Banido</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                KYC
              </label>
              <select
                value={filters.kyc}
                onChange={(e) =>
                  setFilters({ ...filters, kyc: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent"
              >
                <option value="all">Todos os KYC</option>
                <option value="none">Sem KYC</option>
                <option value="pending">Pendente</option>
                <option value="approved">Aprovado</option>
                <option value="rejected">Rejeitado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verificação
              </label>
              <select
                value={filters.verification}
                onChange={(e) =>
                  setFilters({ ...filters, verification: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent"
              >
                <option value="all">Todas as Verificações</option>
                <option value="verified">Verificado</option>
                <option value="vip">VIP</option>
                <option value="unverified">Não Verificado</option>
              </select>
            </div>
          </motion.div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(filteredUsers.map((u) => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    className="rounded border-gray-300 text-roxo focus:ring-roxo"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Papel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  KYC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verificação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Atividade
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(
                            selectedUsers.filter((id) => id !== user.id),
                          );
                        }
                      }}
                      className="rounded border-gray-300 text-roxo focus:ring-roxo"
                    />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-grafite rounded-full flex items-center justify-center">
                        <span className="text-sm text-white font-medium">
                          {user.name
                            ? user.name.charAt(0)
                            : user.address.charAt(2)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-grafite">
                          {user.name || "Usuário Anônimo"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.address.slice(0, 8)}...{user.address.slice(-6)}
                        </div>
                        {user.email && (
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        roleColors[user.role]
                      }`}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        statusColors[user.status]
                      }`}
                    >
                      {user.status === "active" && "Ativo"}
                      {user.status === "pending" && "Pendente"}
                      {user.status === "suspended" && "Suspenso"}
                      {user.status === "banned" && "Banido"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          kycColors[user.kyc.status]
                        }`}
                      >
                        {user.kyc.status === "none" && "Sem KYC"}
                        {user.kyc.status === "pending" && "Pendente"}
                        {user.kyc.status === "approved" && "Aprovado"}
                        {user.kyc.status === "rejected" && "Rejeitado"}
                      </span>
                      {user.kyc.status === "pending" && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleApproveKyc(user.id)}
                            className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                            title="Aprovar KYC"
                          >
                            <CheckCircle className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleRejectKyc(user.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Rejeitar KYC"
                          >
                            <XCircle className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {user.verification.isVerified && (
                        <div title="Verificado">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                      )}
                      {user.verification.isVip && (
                        <div title="VIP">
                          <Crown className="w-4 h-4 text-yellow-600" />
                        </div>
                      )}
                      {!user.verification.isVerified && (
                        <div title="Não Verificado">
                          <XCircle className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm text-grafite">
                      {new Date(user.stats.lastActivity).toLocaleDateString(
                        "pt-BR",
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Investido: ${user.stats.totalInvested.toLocaleString()}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>

                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>

                      {user.status === "active" && (
                        <button
                          onClick={() => handleSuspendUser(user.id)}
                          className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                          title="Suspender"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}

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

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum usuário encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar os filtros ou convidar novos usuários.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
