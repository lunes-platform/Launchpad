import React from "react";
import {
  AlertTriangle,
  Clock,
  Mail,
  MessageCircle,
  FileText,
  Shield,
  Info,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Card, Button } from "@launchpad/shared-ui";
import { Badge } from "../ui/Badge";

interface BanInfo {
  reason: string;
  startDate: string;
  endDate?: string;
  isPermanent: boolean;
  appealable: boolean;
  appealDeadline?: string;
  caseId: string;
}

interface BannedUserDashboardProps {
  banInfo: BanInfo;
  userName: string;
}

/**
 * Dashboard para usuários banidos
 * Exibe informações sobre o banimento e opções disponíveis
 */
export function BannedUserDashboard({
  banInfo,
  userName,
}: BannedUserDashboardProps) {
  const isAppealPeriodActive =
    banInfo.appealDeadline && new Date(banInfo.appealDeadline) > new Date();

  const daysUntilAppealExpires = banInfo.appealDeadline
    ? Math.ceil(
        (new Date(banInfo.appealDeadline).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  const daysUntilBanExpires =
    banInfo.endDate && !banInfo.isPermanent
      ? Math.ceil(
          (new Date(banInfo.endDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

  const availableActions = [
    {
      title: "Visualizar Histórico",
      description: "Consulte seu histórico de transações anteriores",
      icon: FileText,
      action: "view-history",
      available: true,
    },
    {
      title: "Baixar Dados",
      description: "Faça download dos seus dados pessoais",
      icon: ExternalLink,
      action: "download-data",
      available: true,
    },
    {
      title: "Suporte Técnico",
      description: "Entre em contato para questões técnicas",
      icon: MessageCircle,
      action: "technical-support",
      available: true,
    },
  ];

  const supportChannels = [
    {
      name: "Email de Suporte",
      contact: "support@launchpad.com",
      description: "Para questões gerais e técnicas",
      icon: Mail,
    },
    {
      name: "Recursos Humanos",
      contact: "appeals@launchpad.com",
      description: "Para recursos e apelações",
      icon: Shield,
    },
    {
      name: "Compliance",
      contact: "compliance@launchpad.com",
      description: "Para questões de conformidade",
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Status do Banimento */}
      <Card className="p-6 border-l-4 border-l-red-500">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-bold text-grafite">Conta Suspensa</h1>
              <Badge variant="error" size="sm">
                {banInfo.isPermanent ? "Permanente" : "Temporário"}
              </Badge>
            </div>
            <p className="text-gray-600 mb-4">
              Olá {userName}, sua conta foi suspensa devido a:{" "}
              <strong>{banInfo.reason}</strong>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Data do Banimento</p>
                <p className="font-semibold text-grafite">
                  {new Date(banInfo.startDate).toLocaleDateString("pt-BR")}
                </p>
              </div>

              {!banInfo.isPermanent && banInfo.endDate && (
                <div>
                  <p className="text-gray-500">Término da Suspensão</p>
                  <p className="font-semibold text-grafite">
                    {new Date(banInfo.endDate).toLocaleDateString("pt-BR")}
                  </p>
                  {daysUntilBanExpires > 0 && (
                    <p className="text-xs text-laranja">
                      {daysUntilBanExpires} dias restantes
                    </p>
                  )}
                </div>
              )}

              <div>
                <p className="text-gray-500">ID do Caso</p>
                <p className="font-semibold text-grafite font-mono">
                  {banInfo.caseId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recurso/Apelação */}
      {banInfo.appealable && (
        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-azul-claro rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-azul" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-grafite mb-2">
                Recurso Disponível
              </h3>

              {isAppealPeriodActive ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    Você pode contestar esta decisão. O prazo para recurso
                    expira em{" "}
                    <strong className="text-laranja">
                      {daysUntilAppealExpires} dias
                    </strong>
                    .
                  </p>

                  <div className="flex items-center space-x-3">
                    <Button variant="primary">
                      <FileText className="w-4 h-4 mr-2" />
                      Abrir Recurso
                    </Button>
                    <Button variant="outline">
                      <Info className="w-4 h-4 mr-2" />
                      Diretrizes de Recurso
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    O prazo para recurso expirou em{" "}
                    {banInfo.appealDeadline &&
                      new Date(banInfo.appealDeadline).toLocaleDateString(
                        "pt-BR",
                      )}
                    .
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Ações Disponíveis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-grafite mb-6">
          Ações Disponíveis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <div
                key={index}
                className={`p-4 border rounded-lg transition-colors ${
                  action.available
                    ? "border-gray-200 hover:border-azul cursor-pointer"
                    : "border-gray-100 bg-gray-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      action.available ? "bg-azul-claro" : "bg-gray-200"
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${
                        action.available ? "text-azul" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-semibold mb-1 ${
                        action.available ? "text-grafite" : "text-gray-400"
                      }`}
                    >
                      {action.title}
                    </h4>
                    <p
                      className={`text-sm ${
                        action.available ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {action.description}
                    </p>
                  </div>
                </div>

                {action.available && (
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Acessar
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Canais de Suporte */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-grafite mb-6">
          Canais de Suporte
        </h3>
        <div className="space-y-4">
          {supportChannels.map((channel, index) => {
            const IconComponent = channel.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-grafite" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-grafite">
                      {channel.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {channel.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-azul">
                    {channel.contact}
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Mail className="w-4 h-4 mr-2" />
                    Contatar
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Informações Importantes */}
      <Card className="p-6 bg-amber-50 border-amber-200">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800 mb-2">
              Informações Importantes
            </h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>
                • Durante a suspensão, você não pode realizar investimentos ou
                transações
              </li>
              <li>
                • Seus investimentos existentes permanecem seguros e ativos
              </li>
              <li>
                • Você pode acessar informações históricas e baixar seus dados
              </li>
              <li>
                • Para questões urgentes, entre em contato através dos canais
                oficiais
              </li>
              {!banInfo.isPermanent && (
                <li>
                  • Sua conta será reativada automaticamente após o período de
                  suspensão
                </li>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
