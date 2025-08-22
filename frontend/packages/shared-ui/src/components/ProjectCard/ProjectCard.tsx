import React from "react";
import { Card } from "../Card/Card";

// Badge component inline para evitar dependência circular
interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, className = "" }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${className}`}
    >
      {children}
    </span>
  );
};

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  logo?: string;
  status: "upcoming" | "active" | "completed" | "cancelled";
  phase: "seed" | "private" | "public" | "ido";
  totalRaised: number;
  targetAmount: number;
  progress: number;
  investors: number;
  maxInvestors?: number;
  startDate: string;
  endDate: string;
  tokenPrice: number;
  tokenSymbol: string;
  category: string;
  minInvestment: number;
  maxInvestment?: number;
  apy?: string;
  highlights?: string[];
}

export interface ProjectCardProps {
  project: ProjectData;
  variant?: "default" | "featured" | "compact";
  className?: string;
  onViewDetails?: (projectId: string) => void;
  onInvest?: (projectId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-verde-900/50 text-verde-300 border-verde-600";
    case "upcoming":
      return "bg-laranja-900/50 text-laranja-300 border-laranja-600";
    case "completed":
      return "bg-grafite-600/50 text-grafite-300 border-grafite-500";
    case "cancelled":
      return "bg-red-900/50 text-red-300 border-red-600";
    default:
      return "bg-grafite-600/50 text-grafite-300 border-grafite-500";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "active":
      return "Ativo";
    case "upcoming":
      return "Em Breve";
    case "completed":
      return "Finalizado";
    case "cancelled":
      return "Cancelado";
    default:
      return "Indefinido";
  }
};

const getPhaseColor = (phase: string) => {
  switch (phase) {
    case "seed":
      return "bg-roxo-900/50 text-roxo-300 border-roxo-600";
    case "private":
      return "bg-indigo-900/50 text-indigo-300 border-indigo-600";
    case "public":
      return "bg-laranja-900/50 text-laranja-300 border-laranja-600";
    case "ido":
      return "bg-purple-900/50 text-purple-300 border-purple-600";
    default:
        return "bg-grafite-600/50 text-grafite-300 border-grafite-500";
    }
  };

  const getPhaseText = (phase: string) => {
  switch (phase) {
    case "seed":
      return "Seed";
    case "private":
      return "Privada";
    case "public":
      return "Pública";
    case "ido":
      return "IDO";
    default:
      return phase.toUpperCase();
  }
};

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  variant = "default",
  className,
  onViewDetails,
  onInvest,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isActive = project.status === "active";
  const isUpcoming = project.status === "upcoming";
  const canInvest = isActive && project.progress < 100;

  const cardClasses = cn(
    "h-full bg-grafite-800/95 backdrop-blur-sm border-grafite-600/50 hover:border-roxo-500/50 hover:shadow-2xl hover:shadow-roxo-500/10 group transition-all duration-300",
    variant === "featured" && "ring-2 ring-roxo ring-opacity-50",
    className,
  );

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(project.id);
    }
  };

  const handleInvestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onInvest && canInvest) {
      onInvest(project.id);
    }
  };

  return (
    <Card
      className={cardClasses}
      variant="elevated"
      padding="md"
      hoverable
      clickable
      onClick={handleCardClick}
    >
      <div className="space-y-4">
        {/* Header com Logo e Status */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-grafite-600 to-grafite-700 flex items-center justify-center overflow-hidden border border-grafite-500 shadow-inner">
              {project.logo ? (
                <img
                  src={`https://i.pravatar.cc/48?u=${project.id}`}
                  alt={`${project.name} logo`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {project.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-lg group-hover:text-roxo-300 transition-colors duration-300 truncate">
                {project.name}
              </h3>
              <p className="text-sm text-grafite-400 font-medium">{project.category}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2 flex-shrink-0">
            <Badge className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${getStatusColor(project.status)}`}>
              {getStatusText(project.status)}
            </Badge>
            <Badge className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm ${getPhaseColor(project.phase)}`}>
              {getPhaseText(project.phase)}
            </Badge>
          </div>
        </div>

        {/* Descrição */}
        <p className="text-grafite-300 text-sm leading-relaxed line-clamp-2">
          {project.description}
        </p>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-grafite-400 text-sm font-medium">Progresso</span>
            <span className="text-white font-bold text-sm">{project.progress}%</span>
          </div>
          <div className="relative w-full bg-grafite-700/80 rounded-full h-2.5 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-roxo-500 via-roxo-400 to-laranja-500 rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${project.progress}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full" />
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-grafite-400 font-medium">Arrecadado</p>
            <p className="text-sm font-bold text-white">
              {formatCurrency(project.totalRaised)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-grafite-400 font-medium">Meta</p>
            <p className="text-sm font-bold text-white">
              {formatCurrency(project.targetAmount)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-grafite-400 font-medium">Investidores</p>
            <p className="text-sm font-bold text-white">
              {project.investors.toLocaleString()}
              {project.maxInvestors ? `/${project.maxInvestors}` : ""}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-grafite-400 font-medium">APY</p>
            <p className="text-sm font-bold text-verde-400">{project.apy}</p>
          </div>
        </div>

        {/* Informações do Token */}
        <div className="bg-gradient-to-br from-grafite-700/80 to-grafite-800/80 backdrop-blur-sm rounded-xl p-4 space-y-3 border border-grafite-600/30">
          <div className="flex justify-between items-center">
            <span className="text-xs text-grafite-400 font-medium">Preço do Token</span>
            <span className="text-sm font-bold text-white">
              ${project.tokenPrice}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-grafite-400 font-medium">Símbolo</span>
            <span className="text-sm font-bold text-laranja-400">
              {project.tokenSymbol}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-grafite-400 font-medium">Investimento Mín.</span>
            <span className="text-sm font-bold text-white">
              {formatCurrency(project.minInvestment)}
            </span>
          </div>
        </div>

        {/* Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.highlights.slice(0, 3).map((highlight, index) => (
              <span
                key={index}
                className="text-xs bg-roxo/10 text-roxo px-2 py-1 rounded-full"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}

        {/* Datas */}
        <div className="flex justify-between text-xs text-grafite-400 font-medium pt-2 border-t border-grafite-700/50">
          <span>Início: {formatDate(project.startDate)}</span>
          <span>Fim: {formatDate(project.endDate)}</span>
        </div>

        {/* Botão de Ação */}
        <button 
          onClick={canInvest ? handleInvestClick : handleCardClick}
          className="w-full py-3.5 bg-gradient-to-r from-roxo-600 to-laranja-600 text-white font-bold rounded-xl hover:from-roxo-700 hover:to-laranja-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={!canInvest && !isUpcoming}
        >
          {isActive && canInvest && "Investir Agora"}
          {isUpcoming && "Notificar-me"}
          {project.status === "completed" && "Ver Detalhes"}
          {project.status === "cancelled" && "Indisponível"}
        </button>
      </div>
    </Card>
  );
};

ProjectCard.displayName = "ProjectCard";
