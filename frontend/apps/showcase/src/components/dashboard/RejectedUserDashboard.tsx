import React from "react";
import {
  XCircle,
  AlertTriangle,
  RefreshCw,
  FileText,
  Mail,
  MessageCircle,
  Clock,
  CheckCircle,
  Info,
  Shield,
  HelpCircle,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { Card, Button } from "@launchpad/shared-ui";
import { Badge } from "../ui/Badge";

interface RejectionReason {
  category: string;
  description: string;
  canReapply: boolean;
  requiredActions?: string[];
}

interface RejectedUserDashboardProps {
  userName: string;
  rejectionReasons: RejectionReason[];
  rejectionDate: string;
  canReapply: boolean;
  reapplyDate?: string;
  caseId: string;
}

/**
 * Dashboard para usuários rejeitados na verificação
 * Mostra motivos da rejeição e opções para nova tentativa
 */
export function RejectedUserDashboard({
  userName,
  rejectionReasons,
  rejectionDate,
  canReapply,
  reapplyDate,
  caseId,
}: RejectedUserDashboardProps) {
  const canReapplyNow =
    canReapply && (!reapplyDate || new Date(reapplyDate) <= new Date());
  const daysUntilReapply = reapplyDate
    ? Math.ceil(
        (new Date(reapplyDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  const improvementSteps = [
    {
      title: "Revise os Documentos",
      description:
        "Certifique-se de que todos os documentos estão legíveis e atualizados",
      icon: FileText,
      completed: false,
    },
    {
      title: "Verifique as Informações",
      description:
        "Confirme que todos os dados pessoais estão corretos e consistentes",
      icon: CheckCircle,
      completed: false,
    },
    {
      title: "Prepare Nova Documentação",
      description: "Obtenha documentos alternativos se necessário",
      icon: RefreshCw,
      completed: false,
    },
    {
      title: "Entre em Contato",
      description: "Fale conosco se tiver dúvidas sobre os requisitos",
      icon: MessageCircle,
      completed: false,
    },
  ];

  const supportOptions = [
    {
      title: "Central de Ajuda",
      description: "Acesse nossa base de conhecimento completa",
      icon: HelpCircle,
      action: "help-center",
      available: true,
    },
    {
      title: "Falar com Especialista",
      description: "Agende uma conversa com nossa equipe de verificação",
      icon: Calendar,
      action: "schedule-call",
      available: true,
    },
    {
      title: "Documentos Aceitos",
      description: "Lista completa de documentos válidos",
      icon: FileText,
      action: "document-list",
      available: true,
    },
  ];

  const alternativeOptions = [
    {
      title: "Conta Básica",
      description: "Acesso limitado para visualização de projetos",
      features: [
        "Visualizar projetos",
        "Acessar conteúdo educacional",
        "Receber newsletters",
      ],
      available: true,
    },
    {
      title: "Verificação Alternativa",
      description: "Processo de verificação por terceiros",
      features: [
        "Verificação via parceiros",
        "Processo mais longo",
        "Taxas adicionais podem aplicar",
      ],
      available: false,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Status da Rejeição */}
      <Card className="p-6 border-l-4 border-l-red-500">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-bold text-grafite">
                Verificação Não Aprovada
              </h1>
              <Badge variant="error" size="sm">
                Rejeitado
              </Badge>
            </div>
            <p className="text-gray-600 mb-4">
              Olá {userName}, infelizmente sua solicitação de verificação não
              foi aprovada. Veja abaixo os detalhes e como proceder.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Data da Rejeição</p>
                <p className="font-semibold text-grafite">
                  {new Date(rejectionDate).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <div>
                <p className="text-gray-500">ID do Caso</p>
                <p className="font-semibold text-grafite font-mono">{caseId}</p>
              </div>

              <div>
                <p className="text-gray-500">Nova Tentativa</p>
                <p className="font-semibold text-grafite">
                  {canReapplyNow ? (
                    <span className="text-verde">Disponível agora</span>
                  ) : reapplyDate ? (
                    <span className="text-laranja">
                      Em {daysUntilReapply} dias
                    </span>
                  ) : (
                    <span className="text-red-500">Não disponível</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Motivos da Rejeição */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-grafite mb-6 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-laranja" />
          Motivos da Rejeição
        </h3>
        <div className="space-y-4">
          {rejectionReasons.map((reason, index) => (
            <div
              key={index}
              className="border border-red-200 rounded-lg p-4 bg-red-50"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-red-800">
                  {reason.category}
                </h4>
                <Badge
                  variant={reason.canReapply ? "warning" : "error"}
                  size="sm"
                >
                  {reason.canReapply ? "Corrigível" : "Permanente"}
                </Badge>
              </div>
              <p className="text-red-700 mb-3">{reason.description}</p>

              {reason.requiredActions && reason.requiredActions.length > 0 && (
                <div>
                  <p className="font-medium text-red-800 mb-2">
                    Ações Necessárias:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {reason.requiredActions.map((action, actionIndex) => (
                      <li key={actionIndex} className="text-sm text-red-700">
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Passos para Melhoria */}
      {canReapply && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-grafite mb-6 flex items-center">
            <RefreshCw className="w-5 h-5 mr-2 text-azul" />
            Como Melhorar sua Aplicação
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {improvementSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="w-10 h-10 bg-azul-claro rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-azul" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-grafite mb-1">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {canReapplyNow ? (
            <div className="mt-6 p-4 bg-verde-claro rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-verde mb-1">
                    Pronto para Tentar Novamente?
                  </h4>
                  <p className="text-sm text-gray-700">
                    Você pode iniciar um novo processo de verificação agora.
                  </p>
                </div>
                <Button variant="primary">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Nova Verificação
                </Button>
              </div>
            </div>
          ) : (
            reapplyDate && (
              <div className="mt-6 p-4 bg-laranja-claro rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-laranja" />
                  <div>
                    <h4 className="font-semibold text-laranja mb-1">
                      Período de Espera
                    </h4>
                    <p className="text-sm text-gray-700">
                      Você poderá tentar novamente em {daysUntilReapply} dias (
                      {new Date(reapplyDate).toLocaleDateString("pt-BR")}).
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </Card>
      )}

      {/* Opções de Suporte */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-grafite mb-6">
          Precisa de Ajuda?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {supportOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-grafite-600 rounded-lg hover:border-azul dark:hover:border-azul transition-colors cursor-pointer bg-white dark:bg-grafite-800"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-azul-claro rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-azul" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-grafite dark:text-grafite-100 mb-1">
                      {option.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-grafite-300 mb-3">
                      {option.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Acessar
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Opções Alternativas */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-grafite mb-6">
          Opções Alternativas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alternativeOptions.map((option, index) => (
            <div
              key={index}
              className={`border rounded-lg p-6 transition-colors duration-200 ${
                option.available
                  ? "border-gray-200 dark:border-grafite-600 bg-white dark:bg-grafite-800"
                  : "border-gray-100 dark:border-grafite-700 bg-gray-50 dark:bg-grafite-900"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h4
                  className={`font-semibold ${
                    option.available
                      ? "text-grafite dark:text-grafite-100"
                      : "text-gray-400 dark:text-grafite-500"
                  }`}
                >
                  {option.title}
                </h4>
                <Badge
                  variant={option.available ? "success" : "secondary"}
                  size="sm"
                >
                  {option.available ? "Disponível" : "Em Breve"}
                </Badge>
              </div>

              <p
                className={`text-sm mb-4 ${
                  option.available
                    ? "text-gray-600 dark:text-grafite-300"
                    : "text-gray-400 dark:text-grafite-500"
                }`}
              >
                {option.description}
              </p>

              <ul className="space-y-2 mb-4">
                {option.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className={`text-sm flex items-center ${
                      option.available
                        ? "text-gray-600 dark:text-grafite-300"
                        : "text-gray-400 dark:text-grafite-500"
                    }`}
                  >
                    <CheckCircle
                      className={`w-4 h-4 mr-2 ${
                        option.available ? "text-verde" : "text-gray-300"
                      }`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={option.available ? "primary" : "secondary"}
                size="sm"
                className="w-full"
                disabled={!option.available}
              >
                {option.available ? "Ativar Agora" : "Notificar-me"}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Informações de Contato */}
      <Card className="p-6 bg-grafite-50 dark:bg-grafite-800 border-grafite-200 dark:border-grafite-700">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-roxo flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-grafite-800 dark:text-grafite-200 mb-2">
              Informações Importantes
            </h4>
            <div className="text-sm text-blue-700 space-y-2">
              <p>
                • <strong>Privacidade:</strong> Todos os seus dados são mantidos
                seguros e serão excluídos conforme nossa política de retenção.
              </p>
              <p>
                • <strong>Recursos:</strong> Você pode contestar a decisão
                entrando em contato com nossa equipe de compliance.
              </p>
              <p>
                • <strong>Suporte:</strong> Nossa equipe está disponível para
                esclarecer dúvidas sobre o processo de verificação.
              </p>
            </div>

            <div className="mt-4 flex space-x-3">
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Contatar Suporte
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Política de Privacidade
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
