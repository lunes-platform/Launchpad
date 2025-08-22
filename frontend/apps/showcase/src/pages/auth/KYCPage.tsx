import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { KYCStatus } from "../../types/auth";
import { Card, Button } from "@launchpad/shared-ui";
import {
  Shield,
  FileText,
  Camera,
  CheckCircle,
  AlertCircle,
  Upload,
  User,
  MapPin,
  Calendar,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

/**
 * Tipos para o processo de KYC
 */
interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface DocumentInfo {
  documentType: "passport" | "id" | "driver_license";
  documentNumber: string;
  expiryDate: string;
  frontImage: File | null;
  backImage: File | null;
  selfieImage: File | null;
}

type KYCStep = "personal" | "documents" | "verification" | "review";

/**
 * Página de KYC (Know Your Customer)
 *
 * Funcionalidades:
 * - Coleta de informações pessoais
 * - Upload de documentos de identidade
 * - Verificação de selfie
 * - Revisão e submissão
 * - Estados de progresso e validação
 */
export default function KYCPage() {
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState<KYCStep>("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Estados dos formulários
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "",
    dateOfBirth: "",
    nationality: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Brasil",
  });

  const [documentInfo, setDocumentInfo] = useState<DocumentInfo>({
    documentType: "id",
    documentNumber: "",
    expiryDate: "",
    frontImage: null,
    backImage: null,
    selfieImage: null,
  });

  // Se não está autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se KYC já foi aprovado, redireciona para dashboard
  if (user?.kycStatus === KYCStatus.APPROVED) {
    return <Navigate to="/dashboard" replace />;
  }

  // Handler para upload de arquivos
  const handleFileUpload = (field: keyof DocumentInfo, file: File | null) => {
    setDocumentInfo((prev) => ({ ...prev, [field]: file }));
  };

  // Validação do step atual
  const isStepValid = (step: KYCStep): boolean => {
    switch (step) {
      case "personal":
        return !!(
          personalInfo.fullName &&
          personalInfo.dateOfBirth &&
          personalInfo.nationality &&
          personalInfo.address &&
          personalInfo.city &&
          personalInfo.country
        );
      case "documents":
        return !!(
          documentInfo.documentNumber &&
          documentInfo.expiryDate &&
          documentInfo.frontImage &&
          documentInfo.backImage
        );
      case "verification":
        return !!documentInfo.selfieImage;
      default:
        return true;
    }
  };

  // Handler para próximo step
  const handleNextStep = () => {
    const steps: KYCStep[] = [
      "personal",
      "documents",
      "verification",
      "review",
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  // Handler para step anterior
  const handlePreviousStep = () => {
    const steps: KYCStep[] = [
      "personal",
      "documents",
      "verification",
      "review",
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  // Handler para submissão final
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Simular API call para submissão do KYC
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Em uma implementação real, aqui seria feita a chamada para a API
      console.log("KYC submetido:", { personalInfo, documentInfo });

      // Redirecionar para dashboard com status pendente
      window.location.href = "/dashboard";
    } catch (error) {
      setSubmitError("Erro ao submeter KYC. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Componente de progresso
  const ProgressIndicator = () => {
    const steps = [
      { key: "personal", label: "Informações Pessoais", icon: User },
      { key: "documents", label: "Documentos", icon: FileText },
      { key: "verification", label: "Verificação", icon: Camera },
      { key: "review", label: "Revisão", icon: CheckCircle },
    ];

    const currentIndex = steps.findIndex((step) => step.key === currentStep);

    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;

          return (
            <div key={step.key} className="flex items-center">
              <div
                className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                ${
                  isActive
                    ? "border-azul-500 bg-azul-500 text-white"
                    : isCompleted
                      ? "border-verde-500 bg-verde-500 text-white"
                      : "border-grafite-300 dark:border-grafite-600 text-grafite-400"
                }
              `}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="ml-3 hidden sm:block">
                <div
                  className={`text-sm font-medium ${
                    isActive
                      ? "text-azul-600 dark:text-azul-400"
                      : isCompleted
                        ? "text-verde-600 dark:text-verde-400"
                        : "text-grafite-500 dark:text-grafite-400"
                  }`}
                >
                  {step.label}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-4 ${
                    isCompleted
                      ? "bg-verde-500"
                      : "bg-grafite-200 dark:bg-grafite-700"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-azul-50 to-roxo-50 dark:from-grafite-900 dark:to-grafite-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-azul-100 dark:bg-azul-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-azul-600 dark:text-azul-400" />
          </div>
          <h1 className="text-3xl font-bold text-grafite-900 dark:text-grafite-50 mb-2">
            Verificação de Identidade (KYC)
          </h1>
          <p className="text-grafite-600 dark:text-grafite-300 max-w-2xl mx-auto">
            Para garantir a segurança da plataforma e cumprir regulamentações,
            precisamos verificar sua identidade. Este processo é seguro e seus
            dados são protegidos.
          </p>
        </div>

        <Card className="p-8">
          <ProgressIndicator />

          {/* Step: Informações Pessoais */}
          {currentStep === "personal" && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <User className="w-12 h-12 text-azul-500 mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-grafite-900 dark:text-grafite-50 mb-2">
                  Informações Pessoais
                </h2>
                <p className="text-grafite-600 dark:text-grafite-300">
                  Forneça suas informações pessoais exatamente como aparecem em
                  seus documentos oficiais.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-grafite-700 dark:text-grafite-300 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={personalInfo.fullName}
                    onChange={(e) =>
                      setPersonalInfo((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-grafite-300 dark:border-grafite-600 rounded-lg focus:ring-2 focus:ring-azul-500 focus:border-azul-500 dark:bg-grafite-800 dark:text-grafite-50"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-grafite-700 dark:text-grafite-300 mb-2">
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) =>
                      setPersonalInfo((prev) => ({
                        ...prev,
                        dateOfBirth: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-grafite-300 dark:border-grafite-600 rounded-lg focus:ring-2 focus:ring-azul-500 focus:border-azul-500 dark:bg-grafite-800 dark:text-grafite-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-grafite-700 dark:text-grafite-300 mb-2">
                    Nacionalidade *
                  </label>
                  <input
                    type="text"
                    value={personalInfo.nationality}
                    onChange={(e) =>
                      setPersonalInfo((prev) => ({
                        ...prev,
                        nationality: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-grafite-300 dark:border-grafite-600 rounded-lg focus:ring-2 focus:ring-azul-500 focus:border-azul-500 dark:bg-grafite-800 dark:text-grafite-50"
                    placeholder="Ex: Brasileira"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-grafite-700 dark:text-grafite-300 mb-2">
                    País *
                  </label>
                  <select
                    value={personalInfo.country}
                    onChange={(e) =>
                      setPersonalInfo((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-grafite-300 dark:border-grafite-600 rounded-lg focus:ring-2 focus:ring-azul-500 focus:border-azul-500 dark:bg-grafite-800 dark:text-grafite-50"
                  >
                    <option value="Brasil">Brasil</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Estados Unidos">Estados Unidos</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-grafite-700 dark:text-grafite-300 mb-2">
                    Endereço Completo *
                  </label>
                  <input
                    type="text"
                    value={personalInfo.address}
                    onChange={(e) =>
                      setPersonalInfo((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-grafite-300 dark:border-grafite-600 rounded-lg focus:ring-2 focus:ring-azul-500 focus:border-azul-500 dark:bg-grafite-800 dark:text-grafite-50"
                    placeholder="Rua, número, complemento"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-grafite-700 dark:text-grafite-300 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    value={personalInfo.city}
                    onChange={(e) =>
                      setPersonalInfo((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-grafite-300 dark:border-grafite-600 rounded-lg focus:ring-2 focus:ring-azul-500 focus:border-azul-500 dark:bg-grafite-800 dark:text-grafite-50"
                    placeholder="Sua cidade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-grafite-700 dark:text-grafite-300 mb-2">
                    CEP
                  </label>
                  <input
                    type="text"
                    value={personalInfo.postalCode}
                    onChange={(e) =>
                      setPersonalInfo((prev) => ({
                        ...prev,
                        postalCode: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-grafite-300 dark:border-grafite-600 rounded-lg focus:ring-2 focus:ring-azul-500 focus:border-azul-500 dark:bg-grafite-800 dark:text-grafite-50"
                    placeholder="00000-000"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step: Documentos */}
          {currentStep === "documents" && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <FileText className="w-12 h-12 text-azul-500 mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-grafite-900 dark:text-grafite-50 mb-2">
                  Documentos de Identidade
                </h2>
                <p className="text-grafite-600 dark:text-grafite-300">
                  Faça upload de fotos claras do seu documento de identidade.
                  Certifique-se de que todas as informações estejam visíveis.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-grafite-700 dark:text-grafite-300 mb-2">
                    Tipo de Documento *
                  </label>
                  <select
                    value={documentInfo.documentType}
                    onChange={(e) =>
                      setDocumentInfo((prev) => ({
                        ...prev,
                        documentType: e.target.value as any,
                      }))
                    }
                    className="w-full px-4 py-3 border border-grafite-300 dark:border-grafite-600 rounded-lg focus:ring-2 focus:ring-azul-500 focus:border-azul-500 dark:bg-grafite-800 dark:text-grafite-50"
                  >
                    <option value="id">RG / Carteira de Identidade</option>
                    <option value="passport">Passaporte</option>
                    <option value="driver_license">CNH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-grafite-700 dark:text-grafite-300 mb-2">
                    Número do Documento *
                  </label>
                  <input
                    type="text"
                    value={documentInfo.documentNumber}
                    onChange={(e) =>
                      setDocumentInfo((prev) => ({
                        ...prev,
                        documentNumber: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-grafite-300 dark:border-grafite-600 rounded-lg focus:ring-2 focus:ring-azul-500 focus:border-azul-500 dark:bg-grafite-800 dark:text-grafite-50"
                    placeholder="Número do documento"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-grafite-700 dark:text-grafite-300 mb-2">
                    Data de Validade *
                  </label>
                  <input
                    type="date"
                    value={documentInfo.expiryDate}
                    onChange={(e) =>
                      setDocumentInfo((prev) => ({
                        ...prev,
                        expiryDate: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-grafite-300 dark:border-grafite-600 rounded-lg focus:ring-2 focus:ring-azul-500 focus:border-azul-500 dark:bg-grafite-800 dark:text-grafite-50"
                  />
                </div>
              </div>

              {/* Upload de imagens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <label className="block text-sm font-medium text-grafite-700 dark:text-grafite-300 mb-2">
                    Frente do Documento *
                  </label>
                  <div className="border-2 border-dashed border-grafite-300 dark:border-grafite-600 rounded-lg p-6 text-center hover:border-azul-400 transition-colors">
                    <Upload className="w-8 h-8 text-grafite-400 mx-auto mb-2" />
                    <p className="text-sm text-grafite-600 dark:text-grafite-300 mb-2">
                      {documentInfo.frontImage
                        ? documentInfo.frontImage.name
                        : "Clique para fazer upload"}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload(
                          "frontImage",
                          e.target.files?.[0] || null,
                        )
                      }
                      className="hidden"
                      id="front-upload"
                    />
                    <label
                      htmlFor="front-upload"
                      className="cursor-pointer text-azul-600 hover:text-azul-700"
                    >
                      Selecionar arquivo
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-grafite-700 dark:text-grafite-300 mb-2">
                    Verso do Documento *
                  </label>
                  <div className="border-2 border-dashed border-grafite-300 dark:border-grafite-600 rounded-lg p-6 text-center hover:border-azul-400 transition-colors">
                    <Upload className="w-8 h-8 text-grafite-400 mx-auto mb-2" />
                    <p className="text-sm text-grafite-600 dark:text-grafite-300 mb-2">
                      {documentInfo.backImage
                        ? documentInfo.backImage.name
                        : "Clique para fazer upload"}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload(
                          "backImage",
                          e.target.files?.[0] || null,
                        )
                      }
                      className="hidden"
                      id="back-upload"
                    />
                    <label
                      htmlFor="back-upload"
                      className="cursor-pointer text-azul-600 hover:text-azul-700"
                    >
                      Selecionar arquivo
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step: Verificação (Selfie) */}
          {currentStep === "verification" && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Camera className="w-12 h-12 text-azul-500 mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-grafite-900 dark:text-grafite-50 mb-2">
                  Verificação Facial
                </h2>
                <p className="text-grafite-600 dark:text-grafite-300">
                  Tire uma selfie clara para confirmar sua identidade.
                  Certifique-se de que seu rosto esteja bem iluminado e visível.
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="border-2 border-dashed border-grafite-300 dark:border-grafite-600 rounded-lg p-8 text-center hover:border-azul-400 transition-colors">
                  <Camera className="w-12 h-12 text-grafite-400 mx-auto mb-4" />
                  <p className="text-sm text-grafite-600 dark:text-grafite-300 mb-4">
                    {documentInfo.selfieImage
                      ? documentInfo.selfieImage.name
                      : "Tire uma selfie ou faça upload de uma foto"}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={(e) =>
                      handleFileUpload(
                        "selfieImage",
                        e.target.files?.[0] || null,
                      )
                    }
                    className="hidden"
                    id="selfie-upload"
                  />
                  <label htmlFor="selfie-upload" className="cursor-pointer">
                    <Button variant="outline" className="w-full">
                      <Camera className="w-4 h-4 mr-2" />
                      {documentInfo.selfieImage
                        ? "Alterar Foto"
                        : "Tirar Selfie"}
                    </Button>
                  </label>
                </div>

                <div className="mt-6 p-4 bg-amarelo-50 dark:bg-amarelo-900/20 border border-amarelo-200 dark:border-amarelo-800 rounded-lg">
                  <h4 className="font-medium text-amarelo-800 dark:text-amarelo-200 mb-2">
                    Dicas para uma boa selfie:
                  </h4>
                  <ul className="text-sm text-amarelo-700 dark:text-amarelo-300 space-y-1">
                    <li>• Remova óculos escuros e chapéus</li>
                    <li>• Certifique-se de ter boa iluminação</li>
                    <li>• Olhe diretamente para a câmera</li>
                    <li>• Mantenha uma expressão neutra</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step: Revisão */}
          {currentStep === "review" && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <CheckCircle className="w-12 h-12 text-verde-500 mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-grafite-900 dark:text-grafite-50 mb-2">
                  Revisão Final
                </h2>
                <p className="text-grafite-600 dark:text-grafite-300">
                  Revise todas as informações antes de submeter. Após a
                  submissão, o processo de verificação pode levar até 24 horas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold text-grafite-900 dark:text-grafite-50 mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Informações Pessoais
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Nome:</span>{" "}
                      {personalInfo.fullName}
                    </div>
                    <div>
                      <span className="font-medium">Data de Nascimento:</span>{" "}
                      {personalInfo.dateOfBirth}
                    </div>
                    <div>
                      <span className="font-medium">Nacionalidade:</span>{" "}
                      {personalInfo.nationality}
                    </div>
                    <div>
                      <span className="font-medium">País:</span>{" "}
                      {personalInfo.country}
                    </div>
                    <div>
                      <span className="font-medium">Cidade:</span>{" "}
                      {personalInfo.city}
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold text-grafite-900 dark:text-grafite-50 mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Documentos
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Tipo:</span>{" "}
                      {documentInfo.documentType === "id"
                        ? "RG"
                        : documentInfo.documentType === "passport"
                          ? "Passaporte"
                          : "CNH"}
                    </div>
                    <div>
                      <span className="font-medium">Número:</span>{" "}
                      {documentInfo.documentNumber}
                    </div>
                    <div>
                      <span className="font-medium">Validade:</span>{" "}
                      {documentInfo.expiryDate}
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                      <CheckCircle className="w-4 h-4 text-verde-500" />
                      <span>Frente do documento</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-verde-500" />
                      <span>Verso do documento</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-verde-500" />
                      <span>Selfie de verificação</span>
                    </div>
                  </div>
                </Card>
              </div>

              {submitError && (
                <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-1">
                      Erro na Submissão
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {submitError}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-azul-50 dark:bg-azul-900/20 border border-azul-200 dark:border-azul-800 rounded-lg p-4">
                <h4 className="font-medium text-azul-800 dark:text-azul-200 mb-2">
                  Próximos Passos
                </h4>
                <ul className="text-sm text-azul-700 dark:text-azul-300 space-y-1">
                  <li>• Sua documentação será analisada por nossa equipe</li>
                  <li>• O processo pode levar até 24 horas</li>
                  <li>• Você receberá uma notificação com o resultado</li>
                  <li>• Em caso de dúvidas, entre em contato conosco</li>
                </ul>
              </div>
            </div>
          )}

          {/* Botões de navegação */}
          <div className="flex justify-between pt-8 border-t border-grafite-200 dark:border-grafite-700">
            <div>
              {currentStep !== "personal" && (
                <Button
                  variant="outline"
                  onClick={handlePreviousStep}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
              )}
            </div>

            <div className="flex space-x-3">
              <Link to="/dashboard">
                <Button variant="outline">Cancelar</Button>
              </Link>

              {currentStep === "review" ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submetendo...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submeter KYC
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNextStep}
                  disabled={!isStepValid(currentStep)}
                  className="flex items-center"
                >
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
