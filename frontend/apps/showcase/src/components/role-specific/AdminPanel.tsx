import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Settings,
  BarChart3,
  Shield,
  AlertTriangle,
  Database,
  Activity,
  FileText,
  DollarSign,
  Zap,
} from "lucide-react";
import { Card, Button } from "@launchpad/shared-ui";
import { Badge } from "../ui/Badge";

interface AdminPanelProps {
  className?: string;
}

interface AdminMetrics {
  totalUsers: number;
  activeProjects: number;
  totalVolume: number;
  pendingApprovals: number;
  systemHealth: "healthy" | "warning" | "critical";
  lastUpdate: string;
}

interface SystemAlert {
  id: string;
  type: "info" | "warning" | "error";
  message: string;
  timestamp: string;
  resolved: boolean;
}

/**
 * Painel administrativo com controles e métricas do sistema
 * Componente específico para usuários com papel de administrador
 */
export function AdminPanel({ className = "" }: AdminPanelProps) {
  // Dados mockados para demonstração
  const metrics: AdminMetrics = {
    totalUsers: 15420,
    activeProjects: 47,
    totalVolume: 2850000,
    pendingApprovals: 12,
    systemHealth: "healthy",
    lastUpdate: "2 minutos atrás",
  };

  const systemAlerts: SystemAlert[] = [
    {
      id: "1",
      type: "warning",
      message: "Pool de staking atingiu 85% da capacidade",
      timestamp: "5 min atrás",
      resolved: false,
    },
    {
      id: "2",
      type: "info",
      message: "Novo projeto aguardando aprovação",
      timestamp: "15 min atrás",
      resolved: false,
    },
    {
      id: "3",
      type: "error",
      message: "Falha na sincronização do oráculo de preços",
      timestamp: "1 hora atrás",
      resolved: true,
    },
  ];

  const quickActions = [
    {
      title: "Aprovar Projetos",
      description: `${metrics.pendingApprovals} pendentes`,
      icon: FileText,
      action: () => console.log("Navegar para aprovações"),
      variant: "primary" as const,
    },
    {
      title: "Gestão de Usuários",
      description: "KYC e verificações",
      icon: Users,
      action: () => console.log("Navegar para usuários"),
      variant: "secondary" as const,
    },
    {
      title: "Configurações",
      description: "Parâmetros do sistema",
      icon: Settings,
      action: () => console.log("Navegar para configurações"),
      variant: "secondary" as const,
    },
    {
      title: "Analytics",
      description: "Relatórios detalhados",
      icon: BarChart3,
      action: () => console.log("Navegar para analytics"),
      variant: "secondary" as const,
    },
  ];

  const getHealthColor = (health: AdminMetrics["systemHealth"]) => {
    switch (health) {
      case "healthy":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30";
      case "critical":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:text-grafite-400 dark:bg-grafite-800";
    }
  };

  const getAlertColor = (type: SystemAlert["type"]) => {
    switch (type) {
      case "info":
        return "border-grafite-200 bg-grafite-50 dark:border-grafite-700 dark:bg-grafite-800";
      case "warning":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20";
      case "error":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20";
      default:
        return "border-gray-200 bg-gray-50 dark:border-grafite-700 dark:bg-grafite-800/50";
    }
  };

  const getAlertIcon = (type: SystemAlert["type"]) => {
    switch (type) {
      case "info":
        return Activity;
      case "warning":
        return AlertTriangle;
      case "error":
        return Shield;
      default:
        return Activity;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-grafite dark:text-grafite-50">
            Painel Administrativo
          </h2>
          <p className="text-gray-600 dark:text-grafite-400 mt-1">
            Controle total da plataforma • Atualizado {metrics.lastUpdate}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge
            variant={
              metrics.systemHealth === "healthy"
                ? "success"
                : metrics.systemHealth === "warning"
                  ? "warning"
                  : "error"
            }
            className="flex items-center space-x-1"
          >
            <div
              className={`w-2 h-2 rounded-full ${getHealthColor(metrics.systemHealth)}`}
            />
            <span className="capitalize">{metrics.systemHealth}</span>
          </Badge>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-grafite-300">
                  Usuários Totais
                </p>
                <p className="text-2xl font-bold text-grafite dark:text-grafite-50">
                  {metrics.totalUsers.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-grafite-300">
                  Projetos Ativos
                </p>
                <p className="text-2xl font-bold text-grafite dark:text-grafite-50">
                  {metrics.activeProjects}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-grafite-300">
                  Volume Total
                </p>
                <p className="text-2xl font-bold text-grafite dark:text-grafite-50">
                  ${metrics.totalVolume.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-roxo-100 dark:bg-roxo-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-roxo dark:text-roxo-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-grafite-300">
                  Pendências
                </p>
                <p className="text-2xl font-bold text-grafite dark:text-grafite-50">
                  {metrics.pendingApprovals}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Ações Rápidas */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-grafite dark:text-grafite-50 mb-4">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Button
                  variant={action.variant}
                  className="w-full h-auto p-4 flex flex-col items-center space-y-2 text-center"
                  onClick={action.action}
                >
                  <Icon className="w-6 h-6" />
                  <div>
                    <p className="font-medium">{action.title}</p>
                    <p className="text-xs opacity-75">{action.description}</p>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Alertas do Sistema */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-grafite dark:text-grafite-50">
            Alertas do Sistema
          </h3>
          <Badge variant="secondary">
            {systemAlerts.filter((alert) => !alert.resolved).length} ativos
          </Badge>
        </div>

        <div className="space-y-3">
          {systemAlerts.slice(0, 5).map((alert) => {
            const Icon = getAlertIcon(alert.type);
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg border ${getAlertColor(alert.type)} ${
                  alert.resolved ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Icon
                    className={`w-5 h-5 mt-0.5 ${
                      alert.type === "info"
                        ? "text-blue-600 dark:text-blue-400"
                        : alert.type === "warning"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-red-600 dark:text-red-400"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-grafite dark:text-grafite-50">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-grafite-400 mt-1">
                      {alert.timestamp}
                    </p>
                  </div>
                  {alert.resolved && (
                    <Badge variant="success" size="sm">
                      Resolvido
                    </Badge>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export default AdminPanel;
