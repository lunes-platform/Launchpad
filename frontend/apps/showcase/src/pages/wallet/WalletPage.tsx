import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Card, Button, ProgressBar } from "@launchpad/shared-ui";
import { Wallet, DollarSign, Send, QrCode, TrendingUp } from "lucide-react";

// Mock data for wallet
const walletData = {
  balance: 12500.75,
  currency: "USD",
  tokenBalance: 5000,
  tokenSymbol: "LPT",
  recentTransactions: [
    {
      id: 1,
      type: "deposit",
      amount: 2500,
      date: "2024-07-20",
      status: "Completed",
    },
    {
      id: 2,
      type: "investment",
      amount: -1000,
      project: "SolarMax",
      date: "2024-07-18",
      status: "Completed",
    },
    {
      id: 3,
      type: "withdrawal",
      amount: -500,
      date: "2024-07-15",
      status: "Pending",
    },
    {
      id: 4,
      type: "reward",
      amount: 100,
      token: "LPT",
      date: "2024-07-12",
      status: "Completed",
    },
  ],
};

const WalletPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Wallet className="mr-3" /> Minha Carteira
          </h1>
          <p className="text-gray-600">
            Visualize seu saldo, transações e gerencie seus fundos.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="primary">
            <Send className="mr-2 h-4 w-4" /> Enviar
          </Button>
          <Button variant="outline">
            <QrCode className="mr-2 h-4 w-4" /> Receber
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Coluna Principal */}
        <div className="md:col-span-2 space-y-8">
          <Card padding="lg">
            <h2 className="text-2xl font-semibold mb-4">Balanço Total</h2>
            <div className="flex items-baseline">
              <p className="text-4xl font-bold">
                ${walletData.balance.toLocaleString()}
              </p>
              <span className="text-lg ml-2 text-gray-500">
                {walletData.currency}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-lg font-semibold">
                + {walletData.tokenBalance.toLocaleString()}{" "}
                {walletData.tokenSymbol}
              </p>
              <p className="text-sm text-gray-500">Tokens de Recompensa</p>
            </div>
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Metas de Investimento</h3>
              <ProgressBar value={65} />
              <p className="text-sm text-gray-500 mt-1">
                Você atingiu 65% da sua meta de investimento para este
                trimestre.
              </p>
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="text-2xl font-semibold mb-4">Transações Recentes</h2>
            <div className="space-y-4">
              {walletData.recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${tx.amount > 0 ? "bg-success-100" : "bg-error-100"}`}
                    >
                      <TrendingUp
                        className={`h-5 w-5 ${tx.amount > 0 ? "text-success-600" : "text-error-600"}`}
                      />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {tx.type === "investment"
                          ? `Investimento em ${tx.project}`
                          : tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </p>
                      <p className="text-sm text-gray-500">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${tx.amount > 0 ? "text-success-600" : "text-error-600"}`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {tx.amount.toLocaleString()}{" "}
                      {tx.token || walletData.currency}
                    </p>
                    <p className="text-xs text-gray-400">{tx.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-8">
          <Card padding="lg">
            <h2 className="text-2xl font-semibold mb-4">Ações Rápidas</h2>
            <div className="space-y-3">
              <Button fullWidth variant="outline">
                <DollarSign className="mr-2 h-4 w-4" /> Adicionar Fundos
              </Button>
              <Button fullWidth variant="outline">
                <Send className="mr-2 h-4 w-4" /> Retirar Fundos
              </Button>
              <Button fullWidth variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" /> Ver Histórico Completo
              </Button>
            </div>
          </Card>
          <Card padding="lg" className="bg-primary-50 border-primary-200">
            <h2 className="text-2xl font-semibold mb-4 text-primary-800">
              Programa de Recompensas
            </h2>
            <p className="text-primary-700 mb-4">
              Ganhe tokens LPT por cada investimento e participação na
              comunidade. Seus tokens podem ser usados para descontos e acesso
              exclusivo.
            </p>
            <Button fullWidth variant="primary">
              Saiba Mais
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
