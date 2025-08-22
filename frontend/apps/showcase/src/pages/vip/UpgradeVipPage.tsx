import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { isVipUser } from "../../types/auth";
import { Card, Button } from "@launchpad/shared-ui";
import {
  Crown,
  Star,
  TrendingUp,
  Shield,
  Zap,
  Gift,
  ArrowLeft,
  Check,
} from "lucide-react";

/**
 * Página de upgrade para VIP
 * Permite que usuários façam upgrade para status VIP
 */
const UpgradeVipPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Redireciona para login se não autenticado
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    // Se já é VIP, redireciona para dashboard
    if (isVipUser(user)) {
      navigate("/dashboard", { replace: true });
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Don't render if redirecting
  if (!isAuthenticated || isVipUser(user)) {
    return null;
  }

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      // TODO: Implementar lógica de upgrade VIP
      console.log("Processando upgrade VIP:", selectedPlan);
      // Simular processamento
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Erro ao processar upgrade:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const plans = {
    monthly: {
      price: "99",
      period: "mês",
      savings: null,
    },
    yearly: {
      price: "999",
      period: "ano",
      savings: "20% de desconto",
    },
  };

  const benefits = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Acesso Antecipado",
      description:
        "Participe de projetos exclusivos antes do lançamento público",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Proteção Premium",
      description: "Seguro adicional para seus investimentos",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Análises Avançadas",
      description: "Relatórios detalhados e insights de mercado",
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Recompensas Exclusivas",
      description: "Tokens bonus e airdrops especiais",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Suporte Prioritário",
      description: "Atendimento dedicado 24/7",
    },
    {
      icon: <Crown className="w-6 h-6" />,
      title: "Status VIP",
      description: "Badge exclusivo e reconhecimento na plataforma",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-roxo/5 to-grafite-50 dark:from-roxo/10 dark:to-grafite-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-roxo to-roxo-700 rounded-full mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Torne-se VIP
            </h1>
            <p className="text-xl text-gray-600">
              Desbloqueie recursos exclusivos e maximize seus investimentos
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Benefícios */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Benefícios VIP
            </h2>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-2 bg-gradient-to-r from-roxo to-roxo-700 rounded-lg text-white">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Planos */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Escolha seu Plano
            </h2>

            {/* Seletor de Plano */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => setSelectedPlan("monthly")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  selectedPlan === "monthly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setSelectedPlan("yearly")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  selectedPlan === "yearly"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Anual
                {plans.yearly.savings && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    {plans.yearly.savings}
                  </span>
                )}
              </button>
            </div>

            {/* Card do Plano */}
            <Card className="p-6 border-2 border-roxo/20 bg-gradient-to-br from-roxo/5 to-grafite-50 dark:from-roxo/10 dark:to-grafite-800">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  ${plans[selectedPlan].price}
                  <span className="text-lg font-normal text-gray-600">
                    /{plans[selectedPlan].period}
                  </span>
                </div>
                {plans[selectedPlan].savings && (
                  <div className="text-green-600 font-medium">
                    {plans[selectedPlan].savings}
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {[
                  "Acesso a todos os recursos VIP",
                  "Suporte prioritário 24/7",
                  "Análises e relatórios avançados",
                  "Projetos exclusivos",
                  "Recompensas e airdrops",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleUpgrade}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-roxo to-roxo-700 hover:from-roxo-600 hover:to-roxo-800 text-white font-semibold py-3"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processando...</span>
                  </div>
                ) : (
                  `Fazer Upgrade - $${plans[selectedPlan].price}`
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Pagamento seguro • Cancele a qualquer momento
              </p>
            </Card>
          </div>
        </div>

        {/* FAQ ou informações adicionais */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Tem dúvidas?{" "}
            <Link
              to="/support"
              className="text-roxo hover:text-roxo-700 font-medium"
            >
              Entre em contato conosco
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeVipPage;
