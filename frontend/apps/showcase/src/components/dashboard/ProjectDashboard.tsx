import React from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import { Card, Button } from "@launchpad/shared-ui";
import { Badge } from "../ui/Badge";

interface ProjectMetrics {
  totalRaised: number;
  targetAmount: number;
  investorCount: number;
  daysRemaining: number;
  tokensSold: number;
  totalTokens: number;
  averageInvestment: number;
  conversionRate: number;
}

interface ProjectDashboardProps {
  projectName: string;
  projectId: string;
  metrics: ProjectMetrics;
}

/**
 * Dashboard específico para projetos/emissores
 * Foca em métricas de captação, gestão de investidores e performance do projeto
 */
export function ProjectDashboard({
  projectName,
  projectId,
  metrics,
}: ProjectDashboardProps) {
  const progressPercentage = (metrics.totalRaised / metrics.targetAmount) * 100;
  const tokensSoldPercentage = (metrics.tokensSold / metrics.totalTokens) * 100;

  // Dados mockados para demonstração
  const recentInvestors = [
    { address: "0x1234...5678", amount: 5000, timestamp: "2 horas atrás" },
    { address: "0x9abc...def0", amount: 12000, timestamp: "4 horas atrás" },
    { address: "0x5678...9012", amount: 8500, timestamp: "6 horas atrás" },
    { address: "0x3456...7890", amount: 15000, timestamp: "8 horas atrás" },
  ];

  const milestones = [
    { title: "Soft Cap Atingido", target: 100000, status: "completed" },
    { title: "Hard Cap (50%)", target: 250000, status: "in-progress" },
    { title: "Hard Cap Total", target: 500000, status: "pending" },
  ];

  return (
    <div className="space-y-6">
      {/* Header do Projeto */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-grafite">{projectName}</h1>
            <p className="text-gray-600">ID: {projectId}</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Relatórios
            </Button>
            <Button variant="primary" size="sm">
              <Activity className="w-4 h-4 mr-2" />
              Gerenciar
            </Button>
          </div>
        </div>

        {/* Barra de Progresso Principal */}
        <div className="bg-gray-100 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-roxo to-roxo-claro h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Captado: ${metrics.totalRaised.toLocaleString()}</span>
          <span>Meta: ${metrics.targetAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Captado</p>
              <p className="text-2xl font-bold text-grafite">
                ${metrics.totalRaised.toLocaleString()}
              </p>
              <p className="text-sm text-verde">
                {progressPercentage.toFixed(1)}% da meta
              </p>
            </div>
            <div className="w-12 h-12 bg-verde-claro rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-verde" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Investidores</p>
              <p className="text-2xl font-bold text-grafite">
                {metrics.investorCount}
              </p>
              <p className="text-sm text-azul">
                Média: ${metrics.averageInvestment.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-azul-claro rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-azul" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Tokens Vendidos
              </p>
              <p className="text-2xl font-bold text-grafite">
                {(metrics.tokensSold / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-roxo">
                {tokensSoldPercentage.toFixed(1)}% do total
              </p>
            </div>
            <div className="w-12 h-12 bg-roxo-claro rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-roxo" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Tempo Restante
              </p>
              <p className="text-2xl font-bold text-grafite">
                {metrics.daysRemaining}
              </p>
              <p className="text-sm text-laranja">dias restantes</p>
            </div>
            <div className="w-12 h-12 bg-laranja-claro rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-laranja" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investidores Recentes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-grafite">
              Investidores Recentes
            </h3>
            <Button variant="outline" size="sm">
              Ver Todos
            </Button>
          </div>
          <div className="space-y-3">
            {recentInvestors.map((investor, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-grafite">{investor.address}</p>
                  <p className="text-sm text-gray-600">{investor.timestamp}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-verde">
                    ${investor.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Marcos e Metas */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-grafite mb-4">
            Marcos do Projeto
          </h3>
          <div className="space-y-4">
            {milestones.map((milestone, index) => {
              const isCompleted = milestone.status === "completed";
              const isInProgress = milestone.status === "in-progress";

              return (
                <div key={index} className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? "bg-verde text-white"
                        : isInProgress
                          ? "bg-laranja text-white"
                          : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : isInProgress ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        isCompleted
                          ? "text-verde"
                          : isInProgress
                            ? "text-laranja"
                            : "text-gray-600"
                      }`}
                    >
                      {milestone.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      Meta: ${milestone.target.toLocaleString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      isCompleted
                        ? "success"
                        : isInProgress
                          ? "warning"
                          : "secondary"
                    }
                    size="sm"
                  >
                    {isCompleted
                      ? "Concluído"
                      : isInProgress
                        ? "Em Andamento"
                        : "Pendente"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Análise de Performance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-grafite">
            Análise de Performance
          </h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <PieChart className="w-4 h-4 mr-2" />
              Gráficos
            </Button>
            <Button variant="outline" size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Tendências
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-grafite">
              {metrics.conversionRate.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Taxa de Conversão</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-grafite">
              ${(metrics.totalRaised / metrics.daysRemaining).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Captação Diária Média</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-grafite">
              {Math.ceil(
                metrics.daysRemaining *
                  (metrics.totalRaised / metrics.daysRemaining),
              )}
            </p>
            <p className="text-sm text-gray-600">Projeção Final</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
