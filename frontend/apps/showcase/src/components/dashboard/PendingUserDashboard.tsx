import React from "react";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Upload,
  Mail,
  Phone,
  CreditCard,
  Shield,
  User,
  Building,
  Camera,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import { Card, Button } from "@launchpad/shared-ui";
import { Badge } from "../ui/Badge";

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed" | "rejected" | "in-review";
  required: boolean;
  estimatedTime?: string;
  rejectionReason?: string;
}

interface PendingUserDashboardProps {
  userName: string;
  verificationSteps: VerificationStep[];
  overallStatus: "pending" | "in-review" | "partially-approved";
  estimatedCompletionTime: string;
}

/**
 * Dashboard para usuários com verificação pendente
 * Mostra o progresso da verificação KYC/AML e próximos passos
 */
export function PendingUserDashboard({
  userName,
  verificationSteps,
  overallStatus,
  estimatedCompletionTime,
}: PendingUserDashboardProps) {
  const completedSteps = verificationSteps.filter(
    (step) => step.status === "completed",
  ).length;
  const totalSteps = verificationSteps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-verde" />;
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "in-review":
        return <Clock className="w-5 h-5 text-laranja" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-verde";
      case "rejected":
        return "text-red-500";
      case "in-review":
        return "text-laranja";
      default:
        return "text-gray-500";
    }
  };

  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case "personal-info":
        return User;
      case "document-upload":
        return FileText;
      case "selfie-verification":
        return Camera;
      case "address-proof":
        return Building;
      case "phone-verification":
        return Phone;
      case "email-verification":
        return Mail;
      case "financial-info":
        return CreditCard;
      case "compliance-check":
        return Shield;
      default:
        return FileText;
    }
  };

  const nextSteps = verificationSteps
    .filter((step) => step.status === "pending" || step.status === "rejected")
    .slice(0, 3);

  const supportResources = [
    {
      title: "Guia de Verificação",
      description: "Passo a passo completo do processo KYC",
      icon: FileText,
      action: "view-guide",
    },
    {
      title: "Documentos Aceitos",
      description: "Lista de documentos válidos para verificação",
      icon: Upload,
      action: "view-documents",
    },
    {
      title: "Suporte ao Cliente",
      description: "Fale conosco se tiver dúvidas",
      icon: HelpCircle,
      action: "contact-support",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Status Geral */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-grafite mb-2">
              Bem-vindo, {userName}!
            </h1>
            <p className="text-gray-600">
              Sua conta está em processo de verificação. Complete os passos
              abaixo para ter acesso completo.
            </p>
          </div>
          <Badge
            variant={
              overallStatus === "partially-approved" ? "warning" : "info"
            }
            size="lg"
          >
            {overallStatus === "pending" && "Verificação Pendente"}
            {overallStatus === "in-review" && "Em Análise"}
            {overallStatus === "partially-approved" && "Parcialmente Aprovado"}
          </Badge>
        </div>

        {/* Barra de Progresso */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-grafite">
              Progresso da Verificação
            </span>
            <span className="text-sm text-gray-600">
              {completedSteps} de {totalSteps} concluídos
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-azul to-roxo h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Tempo estimado para conclusão: {estimatedCompletionTime}
          </p>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-verde-claro rounded-lg">
            <CheckCircle className="w-8 h-8 text-verde mx-auto mb-2" />
            <p className="text-2xl font-bold text-verde">{completedSteps}</p>
            <p className="text-sm text-gray-600">Concluídos</p>
          </div>
          <div className="text-center p-4 bg-laranja-claro rounded-lg">
            <Clock className="w-8 h-8 text-laranja mx-auto mb-2" />
            <p className="text-2xl font-bold text-laranja">
              {verificationSteps.filter((s) => s.status === "in-review").length}
            </p>
            <p className="text-sm text-gray-600">Em Análise</p>
          </div>
          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <RefreshCw className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-500">
              {verificationSteps.filter((s) => s.status === "pending").length}
            </p>
            <p className="text-sm text-gray-600">Pendentes</p>
          </div>
        </div>
      </Card>

      {/* Próximos Passos */}
      {nextSteps.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-grafite mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-laranja" />
            Próximos Passos
          </h3>
          <div className="space-y-4">
            {nextSteps.map((step, index) => {
              const StepIcon = getStepIcon(step.id);
              return (
                <div
                  key={step.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-azul-claro rounded-lg flex items-center justify-center flex-shrink-0">
                        <StepIcon className="w-6 h-6 text-azul" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-grafite">
                            {step.title}
                          </h4>
                          {step.required && (
                            <Badge variant="error" size="sm">
                              Obrigatório
                            </Badge>
                          )}
                          {step.status === "rejected" && (
                            <Badge variant="error" size="sm">
                              Rejeitado
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{step.description}</p>
                        {step.estimatedTime && (
                          <p className="text-sm text-gray-500">
                            Tempo estimado: {step.estimatedTime}
                          </p>
                        )}
                        {step.rejectionReason && (
                          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700">
                              <strong>Motivo da rejeição:</strong>{" "}
                              {step.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {getStatusIcon(step.status)}
                      <Button
                        variant={
                          step.status === "rejected" ? "primary" : "outline"
                        }
                        size="sm"
                      >
                        {step.status === "rejected" ? "Reenviar" : "Completar"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Todos os Passos de Verificação */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-grafite mb-6">
          Status Completo da Verificação
        </h3>
        <div className="space-y-3">
          {verificationSteps.map((step, index) => {
            const StepIcon = getStepIcon(step.id);
            return (
              <div
                key={step.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <StepIcon className="w-5 h-5 text-grafite" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-grafite">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`text-sm font-medium ${getStatusColor(step.status)}`}
                  >
                    {step.status === "completed" && "Concluído"}
                    {step.status === "rejected" && "Rejeitado"}
                    {step.status === "in-review" && "Em Análise"}
                    {step.status === "pending" && "Pendente"}
                  </span>
                  {getStatusIcon(step.status)}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recursos de Ajuda */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-grafite mb-6">
          Precisa de Ajuda?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {supportResources.map((resource, index) => {
            const IconComponent = resource.icon;
            return (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-azul transition-colors cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-azul-claro rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-azul" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-grafite mb-1">
                      {resource.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {resource.description}
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

      {/* Aviso Importante */}
      <Card className="p-6 bg-grafite-50 border-grafite-200 dark:bg-grafite-800 dark:border-grafite-700">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-roxo flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-grafite-800 dark:text-grafite-200 mb-2">
              Segurança e Privacidade
            </h4>
            <p className="text-sm text-blue-700 mb-3">
              Seus dados são protegidos com criptografia de ponta e seguem
              rigorosos padrões de segurança. O processo de verificação é
              necessário para cumprir regulamentações financeiras e garantir a
              segurança de todos os usuários.
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • Nunca compartilhamos seus dados com terceiros não autorizados
              </li>
              <li>
                • Todos os documentos são armazenados de forma segura e
                criptografada
              </li>
              <li>
                • Você pode solicitar a exclusão dos seus dados a qualquer
                momento
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
