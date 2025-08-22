import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { isVipUser } from "../../types/auth";
import { Card, Button } from "@launchpad/shared-ui";
import { BarChart, Download, Filter } from "lucide-react";

// Mock data for reports
const mockReports = [
  {
    id: "rep-001",
    title: "Análise de Performance Q1 2024",
    description:
      "Relatório detalhado sobre o desempenho dos investimentos no primeiro trimestre.",
    date: "2024-04-15",
    category: "Performance",
  },
  {
    id: "rep-002",
    title: "Tendências de Mercado: Criptoativos",
    description:
      "Análise das principais tendências e oportunidades no mercado de criptoativos.",
    date: "2024-03-28",
    category: "Mercado",
  },
  {
    id: "rep-003",
    title: "Relatório de Risco: Projetos Launchpad",
    description:
      "Avaliação de risco dos projetos atualmente em fase de lançamento.",
    date: "2024-03-10",
    category: "Risco",
  },
  {
    id: "rep-004",
    title: "Performance Anual 2023",
    description: "Compilado anual com todos os resultados e análises de 2023.",
    date: "2024-01-20",
    category: "Performance",
  },
];

const VipReportsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isVipUser(user)) {
    return <Navigate to="/upgrade-vip" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center space-x-4 mb-4">
            <BarChart className="w-10 h-10 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Relatórios VIP
              </h1>
              <p className="text-lg text-gray-600">
                Acesse análises exclusivas e dados aprofundados.
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select className="p-2 border rounded-md">
              <option>Todas as Categorias</option>
              <option>Performance</option>
              <option>Mercado</option>
              <option>Risco</option>
            </select>
            <input type="date" className="p-2 border rounded-md" />
          </div>
          <Button variant="outline">Limpar Filtros</Button>
        </div>

        {/* Lista de Relatórios */}
        <div className="space-y-6">
          {mockReports.map((report) => (
            <Card
              key={report.id}
              className="p-6 flex items-center justify-between hover:shadow-md transition-shadow duration-300"
            >
              <div>
                <p className="text-sm text-gray-500">
                  {report.date} - {report.category}
                </p>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  {report.title}
                </h3>
                <p className="text-gray-600 mt-2 max-w-2xl">
                  {report.description}
                </p>
              </div>
              <Button>
                <Download className="w-5 h-5 mr-2" />
                Baixar PDF
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VipReportsPage;
