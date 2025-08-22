import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe,
  Shield,
  Database,
  Zap,
  Clock,
  Server,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
} from "lucide-react";

/**
 * Tipos para configurações do sistema
 */
interface PlatformSettings {
  general: {
    platformName: string;
    platformDescription: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    kycRequired: boolean;
    maxProjectsPerUser: number;
    defaultInvestmentLimit: number;
  };
  investment: {
    minInvestmentAmount: number;
    maxInvestmentAmount: number;
    investmentFeePercentage: number;
    stakingRewardRate: number;
    unstakingPeriodDays: number;
    vipMinimumStaking: number;
  };
  kyc: {
    autoApproval: boolean;
    requiredDocuments: string[];
    verificationLevels: string[];
    maxVerificationTime: number;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    twoFactorRequired: boolean;
    passwordMinLength: number;
    ipWhitelist: string[];
  };
}

interface SmartContractConfig {
  network: string;
  rpcUrl: string;
  chainId: number;
  contracts: {
    launchpad: string;
    token: string;
    staking: string;
    governance: string;
    oracle: string;
  };
  gasSettings: {
    gasLimit: number;
    gasPrice: number;
    maxFeePerGas: number;
    maxPriorityFeePerGas: number;
  };
}

interface IntegrationSettings {
  email: {
    provider: string;
    apiKey: string;
    fromAddress: string;
    templatesEnabled: boolean;
  };
  sms: {
    provider: string;
    apiKey: string;
    fromNumber: string;
    enabled: boolean;
  };
  analytics: {
    googleAnalytics: string;
    mixpanel: string;
    hotjar: string;
    enabled: boolean;
  };
  storage: {
    provider: string;
    bucket: string;
    region: string;
    cdnUrl: string;
  };
}

/**
 * Página de Configurações do Sistema para Administradores
 *
 * Funcionalidades:
 * - Configurações gerais da plataforma
 * - Parâmetros de investimento e staking
 * - Configurações de KYC e segurança
 * - Configuração de smart contracts
 * - Integrações com serviços externos
 * - Monitoramento de status do sistema
 */
export function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Mock data - em produção viria da API
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    general: {
      platformName: "Launchpad Lunes",
      platformDescription: "Plataforma de lançamento de projetos blockchain",
      maintenanceMode: false,
      registrationEnabled: true,
      kycRequired: true,
      maxProjectsPerUser: 5,
      defaultInvestmentLimit: 10000,
    },
    investment: {
      minInvestmentAmount: 100,
      maxInvestmentAmount: 100000,
      investmentFeePercentage: 2.5,
      stakingRewardRate: 12.5,
      unstakingPeriodDays: 7,
      vipMinimumStaking: 50000,
    },
    kyc: {
      autoApproval: false,
      requiredDocuments: ["identity", "address", "selfie"],
      verificationLevels: ["basic", "advanced", "premium"],
      maxVerificationTime: 72,
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      twoFactorRequired: false,
      passwordMinLength: 8,
      ipWhitelist: [],
    },
  });

  const [contractConfig, setContractConfig] = useState<SmartContractConfig>({
    network: "Polkadot",
    rpcUrl: "wss://rpc.polkadot.io",
    chainId: 0,
    contracts: {
      launchpad: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      token: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
      staking: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy",
      governance: "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw",
      oracle: "5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL",
    },
    gasSettings: {
      gasLimit: 2000000,
      gasPrice: 20,
      maxFeePerGas: 30,
      maxPriorityFeePerGas: 2,
    },
  });

  const [integrations, setIntegrations] = useState<IntegrationSettings>({
    email: {
      provider: "SendGrid",
      apiKey: "SG.***************************",
      fromAddress: "noreply@launchpadlunes.com",
      templatesEnabled: true,
    },
    sms: {
      provider: "Twilio",
      apiKey: "AC***************************",
      fromNumber: "+1234567890",
      enabled: true,
    },
    analytics: {
      googleAnalytics: "GA-***********",
      mixpanel: "mp-***********",
      hotjar: "hj-***********",
      enabled: true,
    },
    storage: {
      provider: "AWS S3",
      bucket: "launchpad-storage",
      region: "us-east-1",
      cdnUrl: "https://cdn.launchpadlunes.com",
    },
  });

  const systemStatus = {
    database: { status: "healthy", latency: 12 },
    blockchain: { status: "healthy", latency: 245 },
    email: { status: "healthy", lastSent: "2024-01-20T10:30:00Z" },
    storage: { status: "warning", usage: 78 },
    api: { status: "healthy", uptime: 99.9 },
  };

  const tabs = [
    { id: "general", label: "Geral", icon: Settings },
    { id: "contracts", label: "Smart Contracts", icon: Database },
    { id: "integrations", label: "Integrações", icon: Zap },
    { id: "security", label: "Segurança", icon: Shield },
    { id: "monitoring", label: "Monitoramento", icon: Server },
  ];

  const handleSave = () => {
    console.log("Salvando configurações...");
    // Implementar lógica de salvamento
    setHasChanges(false);
  };

  const handleReset = () => {
    console.log("Resetando configurações...");
    // Implementar lógica de reset
    setHasChanges(false);
  };

  const toggleSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Implementar feedback visual
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return CheckCircle;
      case "warning":
        return AlertTriangle;
      case "error":
        return XCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-grafite dark:text-grafite-50">
            Configurações do Sistema
          </h1>
          <p className="text-gray-600 dark:text-grafite-300">
            Gerencie parâmetros da plataforma e integrações
          </p>
        </div>

        {hasChanges && (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-grafite-700 border border-gray-300 dark:border-grafite-600 text-gray-700 dark:text-grafite-200 rounded-lg hover:bg-gray-50 dark:hover:bg-grafite-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Resetar</span>
            </button>

            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-roxo text-white rounded-lg hover:bg-roxo-600 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-grafite-800 rounded-xl shadow-sm border border-gray-200 dark:border-grafite-700 transition-colors duration-200">
        <div className="border-b border-gray-200 dark:border-grafite-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-roxo text-roxo dark:text-roxo-400"
                      : "border-transparent text-gray-500 dark:text-grafite-400 hover:text-gray-700 dark:hover:text-grafite-200 hover:border-gray-300 dark:hover:border-grafite-500"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-grafite dark:text-grafite-50">
                    Configurações Gerais
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-grafite-300 mb-2">
                      Nome da Plataforma
                    </label>
                    <input
                      type="text"
                      value={platformSettings.general.platformName}
                      onChange={(e) => {
                        setPlatformSettings((prev) => ({
                          ...prev,
                          general: {
                            ...prev.general,
                            platformName: e.target.value,
                          },
                        }));
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-grafite-600 bg-white dark:bg-grafite-700 text-gray-900 dark:text-grafite-100 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-grafite-300 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={platformSettings.general.platformDescription}
                      onChange={(e) => {
                        setPlatformSettings((prev) => ({
                          ...prev,
                          general: {
                            ...prev.general,
                            platformDescription: e.target.value,
                          },
                        }));
                        setHasChanges(true);
                      }}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-grafite-600 bg-white dark:bg-grafite-700 text-gray-900 dark:text-grafite-100 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent transition-colors"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-grafite-300">
                        Modo de Manutenção
                      </label>
                      <input
                        type="checkbox"
                        checked={platformSettings.general.maintenanceMode}
                        onChange={(e) => {
                          setPlatformSettings((prev) => ({
                            ...prev,
                            general: {
                              ...prev.general,
                              maintenanceMode: e.target.checked,
                            },
                          }));
                          setHasChanges(true);
                        }}
                        className="rounded border-gray-300 text-roxo focus:ring-roxo"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-grafite-300">
                        Registro Habilitado
                      </label>
                      <input
                        type="checkbox"
                        checked={platformSettings.general.registrationEnabled}
                        onChange={(e) => {
                          setPlatformSettings((prev) => ({
                            ...prev,
                            general: {
                              ...prev.general,
                              registrationEnabled: e.target.checked,
                            },
                          }));
                          setHasChanges(true);
                        }}
                        className="rounded border-gray-300 text-roxo focus:ring-roxo"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        KYC Obrigatório
                      </label>
                      <input
                        type="checkbox"
                        checked={platformSettings.general.kycRequired}
                        onChange={(e) => {
                          setPlatformSettings((prev) => ({
                            ...prev,
                            general: {
                              ...prev.general,
                              kycRequired: e.target.checked,
                            },
                          }));
                          setHasChanges(true);
                        }}
                        className="rounded border-gray-300 text-roxo focus:ring-roxo"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-grafite dark:text-grafite-50">
                    Limites e Parâmetros
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-grafite-300 mb-2">
                      Máximo de Projetos por Usuário
                    </label>
                    <input
                      type="number"
                      value={platformSettings.general.maxProjectsPerUser}
                      onChange={(e) => {
                        setPlatformSettings((prev) => ({
                          ...prev,
                          general: {
                            ...prev.general,
                            maxProjectsPerUser: parseInt(e.target.value),
                          },
                        }));
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-grafite-600 bg-white dark:bg-grafite-700 text-gray-900 dark:text-grafite-100 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-grafite-300 mb-2">
                      Limite Padrão de Investimento ($)
                    </label>
                    <input
                      type="number"
                      value={platformSettings.general.defaultInvestmentLimit}
                      onChange={(e) => {
                        setPlatformSettings((prev) => ({
                          ...prev,
                          general: {
                            ...prev.general,
                            defaultInvestmentLimit: parseInt(e.target.value),
                          },
                        }));
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-grafite-600 bg-white dark:bg-grafite-700 text-gray-900 dark:text-grafite-100 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-grafite-300 mb-2">
                      Taxa de Investimento (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={
                        platformSettings.investment.investmentFeePercentage
                      }
                      onChange={(e) => {
                        setPlatformSettings((prev) => ({
                          ...prev,
                          investment: {
                            ...prev.investment,
                            investmentFeePercentage: parseFloat(e.target.value),
                          },
                        }));
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-grafite-600 bg-white dark:bg-grafite-700 text-gray-900 dark:text-grafite-100 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-grafite-300 mb-2">
                      Taxa de Recompensa de Staking (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={platformSettings.investment.stakingRewardRate}
                      onChange={(e) => {
                        setPlatformSettings((prev) => ({
                          ...prev,
                          investment: {
                            ...prev.investment,
                            stakingRewardRate: parseFloat(e.target.value),
                          },
                        }));
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-grafite-600 bg-white dark:bg-grafite-700 text-gray-900 dark:text-grafite-100 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Smart Contracts */}
          {activeTab === "contracts" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-grafite dark:text-grafite-50">
                    Configuração da Rede
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-grafite-300 mb-2">
                      Rede Blockchain
                    </label>
                    <select
                      value={contractConfig.network}
                      onChange={(e) => {
                        setContractConfig((prev) => ({
                          ...prev,
                          network: e.target.value,
                        }));
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-grafite-600 bg-white dark:bg-grafite-700 text-gray-900 dark:text-grafite-100 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent transition-colors"
                    >
                      <option value="Polkadot">Polkadot</option>
                      <option value="Kusama">Kusama</option>
                      <option value="Westend">Westend (Testnet)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-grafite-300 mb-2">
                      RPC URL
                    </label>
                    <input
                      type="text"
                      value={contractConfig.rpcUrl}
                      onChange={(e) => {
                        setContractConfig((prev) => ({
                          ...prev,
                          rpcUrl: e.target.value,
                        }));
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-grafite-600 bg-white dark:bg-grafite-700 text-gray-900 dark:text-grafite-100 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-grafite-300 mb-2">
                      Chain ID
                    </label>
                    <input
                      type="number"
                      value={contractConfig.chainId}
                      onChange={(e) => {
                        setContractConfig((prev) => ({
                          ...prev,
                          chainId: parseInt(e.target.value),
                        }));
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-grafite-600 bg-white dark:bg-grafite-700 text-gray-900 dark:text-grafite-100 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-grafite dark:text-grafite-50">
                    Endereços dos Contratos
                  </h3>

                  {Object.entries(contractConfig.contracts).map(
                    ([key, address]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-grafite-300 mb-2 capitalize">
                          {key === "launchpad"
                            ? "Launchpad"
                            : key === "token"
                              ? "Token"
                              : key === "staking"
                                ? "Staking"
                                : key === "governance"
                                  ? "Governança"
                                  : "Oráculo"}
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => {
                              setContractConfig((prev) => ({
                                ...prev,
                                contracts: {
                                  ...prev.contracts,
                                  [key]: e.target.value,
                                },
                              }));
                              setHasChanges(true);
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-grafite-600 bg-white dark:bg-grafite-700 text-gray-900 dark:text-grafite-100 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent font-mono text-sm transition-colors"
                          />
                          <button
                            onClick={() => copyToClipboard(address)}
                            className="p-2 text-gray-600 dark:text-grafite-400 hover:bg-gray-100 dark:hover:bg-grafite-600 rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 dark:text-grafite-400 hover:bg-gray-100 dark:hover:bg-grafite-600 rounded-lg transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Integrations */}
          {activeTab === "integrations" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-5 h-5 text-roxo" />
                      <h3 className="text-lg font-semibold text-grafite">
                        Email
                      </h3>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provedor
                      </label>
                      <select
                        value={integrations.email.provider}
                        onChange={(e) => {
                          setIntegrations((prev) => ({
                            ...prev,
                            email: { ...prev.email, provider: e.target.value },
                          }));
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent"
                      >
                        <option value="SendGrid">SendGrid</option>
                        <option value="Mailgun">Mailgun</option>
                        <option value="AWS SES">AWS SES</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type={showSecrets.emailApi ? "text" : "password"}
                          value={integrations.email.apiKey}
                          onChange={(e) => {
                            setIntegrations((prev) => ({
                              ...prev,
                              email: { ...prev.email, apiKey: e.target.value },
                            }));
                            setHasChanges(true);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent font-mono text-sm"
                        />
                        <button
                          onClick={() => toggleSecret("emailApi")}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {showSecrets.emailApi ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-5 h-5 text-roxo" />
                      <h3 className="text-lg font-semibold text-grafite">
                        SMS
                      </h3>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provedor
                      </label>
                      <select
                        value={integrations.sms.provider}
                        onChange={(e) => {
                          setIntegrations((prev) => ({
                            ...prev,
                            sms: { ...prev.sms, provider: e.target.value },
                          }));
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent"
                      >
                        <option value="Twilio">Twilio</option>
                        <option value="AWS SNS">AWS SNS</option>
                        <option value="Vonage">Vonage</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type={showSecrets.smsApi ? "text" : "password"}
                          value={integrations.sms.apiKey}
                          onChange={(e) => {
                            setIntegrations((prev) => ({
                              ...prev,
                              sms: { ...prev.sms, apiKey: e.target.value },
                            }));
                            setHasChanges(true);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent font-mono text-sm"
                        />
                        <button
                          onClick={() => toggleSecret("smsApi")}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {showSecrets.smsApi ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-roxo" />
                      <h3 className="text-lg font-semibold text-grafite">
                        Analytics
                      </h3>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Google Analytics ID
                      </label>
                      <input
                        type="text"
                        value={integrations.analytics.googleAnalytics}
                        onChange={(e) => {
                          setIntegrations((prev) => ({
                            ...prev,
                            analytics: {
                              ...prev.analytics,
                              googleAnalytics: e.target.value,
                            },
                          }));
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent font-mono text-sm"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Analytics Habilitado
                      </label>
                      <input
                        type="checkbox"
                        checked={integrations.analytics.enabled}
                        onChange={(e) => {
                          setIntegrations((prev) => ({
                            ...prev,
                            analytics: {
                              ...prev.analytics,
                              enabled: e.target.checked,
                            },
                          }));
                          setHasChanges(true);
                        }}
                        className="rounded border-gray-300 text-roxo focus:ring-roxo"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Database className="w-5 h-5 text-roxo" />
                      <h3 className="text-lg font-semibold text-grafite">
                        Armazenamento
                      </h3>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Provedor
                      </label>
                      <select
                        value={integrations.storage.provider}
                        onChange={(e) => {
                          setIntegrations((prev) => ({
                            ...prev,
                            storage: {
                              ...prev.storage,
                              provider: e.target.value,
                            },
                          }));
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent"
                      >
                        <option value="AWS S3">AWS S3</option>
                        <option value="Google Cloud">
                          Google Cloud Storage
                        </option>
                        <option value="Azure Blob">Azure Blob Storage</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CDN URL
                      </label>
                      <input
                        type="text"
                        value={integrations.storage.cdnUrl}
                        onChange={(e) => {
                          setIntegrations((prev) => ({
                            ...prev,
                            storage: {
                              ...prev.storage,
                              cdnUrl: e.target.value,
                            },
                          }));
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-grafite">
                    Autenticação
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeout de Sessão (minutos)
                    </label>
                    <input
                      type="number"
                      value={platformSettings.security.sessionTimeout}
                      onChange={(e) => {
                        setPlatformSettings((prev) => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            sessionTimeout: parseInt(e.target.value),
                          },
                        }));
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Máximo de Tentativas de Login
                    </label>
                    <input
                      type="number"
                      value={platformSettings.security.maxLoginAttempts}
                      onChange={(e) => {
                        setPlatformSettings((prev) => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            maxLoginAttempts: parseInt(e.target.value),
                          },
                        }));
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comprimento Mínimo da Senha
                    </label>
                    <input
                      type="number"
                      value={platformSettings.security.passwordMinLength}
                      onChange={(e) => {
                        setPlatformSettings((prev) => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            passwordMinLength: parseInt(e.target.value),
                          },
                        }));
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      2FA Obrigatório
                    </label>
                    <input
                      type="checkbox"
                      checked={platformSettings.security.twoFactorRequired}
                      onChange={(e) => {
                        setPlatformSettings((prev) => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            twoFactorRequired: e.target.checked,
                          },
                        }));
                        setHasChanges(true);
                      }}
                      className="rounded border-gray-300 text-roxo focus:ring-roxo"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-grafite">
                    Controle de Acesso
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lista Branca de IPs
                    </label>
                    <textarea
                      value={platformSettings.security.ipWhitelist.join("\n")}
                      onChange={(e) => {
                        setPlatformSettings((prev) => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            ipWhitelist: e.target.value
                              .split("\n")
                              .filter((ip) => ip.trim()),
                          },
                        }));
                        setHasChanges(true);
                      }}
                      rows={6}
                      placeholder="192.168.1.1\n10.0.0.0/8\n172.16.0.0/12"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-roxo focus:border-transparent font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Um IP ou CIDR por linha. Deixe vazio para permitir todos
                      os IPs.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Monitoring */}
          {activeTab === "monitoring" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold text-grafite">
                Status do Sistema
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(systemStatus).map(([service, status]) => {
                  const StatusIcon = getStatusIcon(status.status);
                  return (
                    <div key={service} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-grafite capitalize">
                          {service === "database"
                            ? "Banco de Dados"
                            : service === "blockchain"
                              ? "Blockchain"
                              : service === "email"
                                ? "Email"
                                : service === "storage"
                                  ? "Armazenamento"
                                  : "API"}
                        </h4>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            status.status,
                          )}`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.status === "healthy"
                            ? "Saudável"
                            : status.status === "warning"
                              ? "Atenção"
                              : "Erro"}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        {"latency" in status && (
                          <div>Latência: {status.latency}ms</div>
                        )}
                        {"lastSent" in status && (
                          <div>
                            Último envio:{" "}
                            {new Date(status.lastSent).toLocaleString("pt-BR")}
                          </div>
                        )}
                        {"usage" in status && <div>Uso: {status.usage}%</div>}
                        {"uptime" in status && (
                          <div>Uptime: {status.uptime}%</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">
                      Alertas do Sistema
                    </h4>
                    <ul className="mt-2 space-y-1 text-sm text-yellow-700">
                      <li>
                        • Armazenamento com 78% de uso - considere expandir
                      </li>
                      <li>• 3 tentativas de login falharam nas últimas 24h</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
