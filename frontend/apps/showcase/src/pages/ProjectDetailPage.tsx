import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Users,
  DollarSign,
  Target,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Project, ProjectPhase } from "../types";
import { useWallet } from "../contexts/WalletContext";

/**
 * Página de detalhes de um projeto IDO específico
 * Exibe informações completas, fases e permite investimento
 */
export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { selectedAccount } = useWallet();
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("LUNES");
  const [isInvesting, setIsInvesting] = useState(false);

  // Mock data - será substituído por dados reais da API
  const mockProject: Project = {
    id: id || "1",
    name: "LunesSwap Protocol",
    symbol: "LSP",
    description:
      "Protocolo de troca descentralizada na rede Lunes com pools de liquidez automatizados e funcionalidades avançadas de yield farming.",
    logo: "/api/placeholder/64/64",
    banner: "/api/placeholder/800/400",
    website: "https://lunesswap.io",
    twitter: "https://twitter.com/lunesswap",
    telegram: "https://t.me/lunesswap",
    discord: "https://discord.gg/lunesswap",
    totalSupply: "1000000000",
    tokenPrice: "0.05",
    hardCap: "500000",
    softCap: "100000",
    minInvestment: "10",
    maxInvestment: "5000",
    phase: "sale",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-02-15"),
    distributionDate: new Date("2024-02-20"),
    raised: "350000",
    participants: 1250,
    progress: 70,
    isKycRequired: true,
    isWhitelistOnly: false,
    acceptedTokens: ["LUNES", "USDT", "DOT"],
  };

  const phases: {
    phase: ProjectPhase;
    label: string;
    description: string;
    status: "completed" | "active" | "upcoming";
  }[] = [
    {
      phase: "upcoming",
      label: "Anúncio",
      description: "Projeto anunciado e em preparação",
      status: "completed",
    },
    {
      phase: "whitelist",
      label: "Whitelist",
      description: "Período de registro para whitelist",
      status: "completed",
    },
    {
      phase: "sale",
      label: "Venda Pública",
      description: "Período de investimento ativo",
      status: "active",
    },
    {
      phase: "distribution",
      label: "Distribuição",
      description: "Distribuição dos tokens para investidores",
      status: "upcoming",
    },
    {
      phase: "completed",
      label: "Finalizado",
      description: "Projeto finalizado com sucesso",
      status: "upcoming",
    },
  ];

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(value));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleInvestment = async () => {
    if (!selectedAccount || !investmentAmount) return;

    setIsInvesting(true);

    // Simular investimento
    setTimeout(() => {
      setIsInvesting(false);
      alert(
        `Investimento de ${investmentAmount} ${selectedToken} realizado com sucesso!`,
      );
      setInvestmentAmount("");
    }, 2000);
  };

  const canInvest = () => {
    return (
      mockProject.phase === "sale" &&
      selectedAccount &&
      parseFloat(investmentAmount) >= parseFloat(mockProject.minInvestment) &&
      parseFloat(investmentAmount) <= parseFloat(mockProject.maxInvestment)
    );
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-grafite-900 via-roxo-600 to-verde-500">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para Projetos
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-grafite-800/50 backdrop-blur-sm border border-grafite-700/50 rounded-lg p-6"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-roxo-500 to-verde-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {mockProject.symbol.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {mockProject.name}
                  </h1>
                  <p className="text-grafite-300 mb-4">
                    {mockProject.description}
                  </p>

                  {/* Social Links */}
                  <div className="flex gap-4">
                    {mockProject.website && (
                      <a
                        href={mockProject.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-roxo-600 hover:text-roxo-700 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Website
                      </a>
                    )}
                    {mockProject.twitter && (
                      <a
                        href={mockProject.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-roxo-600 hover:text-roxo-700 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Twitter
                      </a>
                    )}
                    {mockProject.telegram && (
                      <a
                        href={mockProject.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-roxo-600 hover:text-roxo-700 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Telegram
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-grafite-300">Progresso da Venda</span>
                  <span className="font-medium text-white">
                    {mockProject.progress}%
                  </span>
                </div>
                <div className="w-full bg-grafite-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-roxo-500 to-verde-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${mockProject.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm mt-2 text-grafite-300">
                  <span>{formatCurrency(mockProject.raised)} arrecadado</span>
                  <span>Meta: {formatCurrency(mockProject.hardCap)}</span>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-grafite-700/30 border border-grafite-600/30 rounded-lg hover:bg-grafite-700/50 transition-colors">
                  <DollarSign className="w-6 h-6 text-roxo-400 mx-auto mb-2" />
                  <p className="text-sm text-grafite-300 mb-1">Preço do Token</p>
                  <p className="font-bold text-white">
                    {formatCurrency(mockProject.tokenPrice)}
                  </p>
                </div>
                <div className="text-center p-4 bg-grafite-700/30 border border-grafite-600/30 rounded-lg hover:bg-grafite-700/50 transition-colors">
                  <Users className="w-6 h-6 text-verde-400 mx-auto mb-2" />
                  <p className="text-sm text-grafite-300 mb-1">Participantes</p>
                  <p className="font-bold text-white">
                    {mockProject.participants.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-grafite-700/30 border border-grafite-600/30 rounded-lg hover:bg-grafite-700/50 transition-colors">
                  <Target className="w-6 h-6 text-laranja-400 mx-auto mb-2" />
                  <p className="text-sm text-grafite-300 mb-1">Hard Cap</p>
                  <p className="font-bold text-white">
                    {formatCurrency(mockProject.hardCap)}
                  </p>
                </div>
                <div className="text-center p-4 bg-grafite-700/30 border border-grafite-600/30 rounded-lg hover:bg-grafite-700/50 transition-colors">
                  <Clock className="w-6 h-6 text-grafite-400 mx-auto mb-2" />
                  <p className="text-sm text-grafite-300 mb-1">Termina em</p>
                  <p className="font-bold text-white text-xs">
                    {formatDate(mockProject.endDate)}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Project Phases */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-grafite-800/50 backdrop-blur-sm border border-grafite-700/50 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">
                Fases do Projeto
              </h2>
              <div className="space-y-4">
                {phases.map((phase, index) => (
                  <div key={phase.phase} className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        phase.status === "completed"
                          ? "bg-verde-500 text-white"
                          : phase.status === "active"
                            ? "bg-roxo-500 text-white"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {phase.status === "completed" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : phase.status === "active" ? (
                        <Clock className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-medium ${
                          phase.status === "active"
                            ? "text-roxo-400"
                            : "text-white"
                        }`}
                      >
                        {phase.label}
                      </h3>
                      <p className="text-sm text-grafite-300">
                        {phase.description}
                      </p>
                    </div>
                    {phase.status === "active" && (
                      <span className="px-2 py-1 bg-roxo-500/20 text-roxo-300 text-xs font-medium rounded-full border border-roxo-500/30">
                        Ativo
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Project Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-grafite-800/50 backdrop-blur-sm border border-grafite-700/50 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">
                Detalhes do Projeto
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-white mb-3">
                    Informações do Token
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-grafite-300">Símbolo:</span>
                      <span className="font-medium text-white">{mockProject.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-grafite-300">Supply Total:</span>
                      <span className="font-medium text-white">
                        {parseInt(mockProject.totalSupply).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-grafite-300">Preço:</span>
                      <span className="font-medium text-white">
                        {formatCurrency(mockProject.tokenPrice)}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-3">
                    Limites de Investimento
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-grafite-300">Mínimo:</span>
                      <span className="font-medium text-white">
                        {formatCurrency(mockProject.minInvestment)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-grafite-300">Máximo:</span>
                      <span className="font-medium text-white">
                        {formatCurrency(mockProject.maxInvestment)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-grafite-300">Tokens Aceitos:</span>
                      <span className="font-medium text-white">
                        {mockProject.acceptedTokens.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Investment Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-grafite-800/50 backdrop-blur-sm border border-grafite-700/50 rounded-lg p-6 sticky top-8"
            >
              <h2 className="text-xl font-bold text-white mb-6">
                Investir no Projeto
              </h2>

              {!selectedAccount ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-grafite-300 mb-4">
                    Conecte sua carteira para investir
                  </p>
                  <button className="w-full bg-roxo-600 text-white py-2 px-4 rounded-lg hover:bg-roxo-700 transition-colors">
                    Conectar Carteira
                  </button>
                </div>
              ) : mockProject.phase !== "sale" ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-grafite-300">
                    Venda não está ativa no momento
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Token Selection */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Token de Pagamento
                    </label>
                    <select
                      value={selectedToken}
                      onChange={(e) => setSelectedToken(e.target.value)}
                      className="w-full bg-grafite-700 border border-grafite-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-roxo-500 focus:border-roxo-500"
                    >
                      {mockProject.acceptedTokens.map((token) => (
                        <option key={token} value={token}>
                          {token}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Valor do Investimento
                    </label>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      placeholder={`Min: ${mockProject.minInvestment} - Max: ${mockProject.maxInvestment}`}
                      className="w-full bg-grafite-700 border border-grafite-600 text-white placeholder-grafite-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-roxo-500 focus:border-roxo-500"
                    />
                  </div>

                  {/* Investment Summary */}
                  {investmentAmount && (
                    <div className="bg-grafite-700/30 border border-grafite-600/30 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-grafite-300">Valor:</span>
                        <span className="font-medium text-white">
                          {investmentAmount} {selectedToken}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-grafite-300">Tokens a Receber:</span>
                        <span className="font-medium text-white">
                          {(
                            parseFloat(investmentAmount) /
                            parseFloat(mockProject.tokenPrice)
                          ).toFixed(2)}{" "}
                          {mockProject.symbol}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Investment Button */}
                  <button
                    onClick={handleInvestment}
                    disabled={!canInvest() || isInvesting}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      canInvest() && !isInvesting
                        ? "bg-roxo-600 text-white hover:bg-roxo-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isInvesting ? "Processando..." : "Investir Agora"}
                  </button>

                  {/* Requirements */}
                  <div className="space-y-2 text-xs text-grafite-300">
                    {mockProject.isKycRequired && (
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span>KYC obrigatório</span>
                      </div>
                    )}
                    {mockProject.isWhitelistOnly && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Apenas whitelist</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
